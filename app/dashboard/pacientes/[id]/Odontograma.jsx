'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field, Spinner } from '@/components/ui'
import { agoraLocal, traduzErro } from '@/lib/format'

const ESTADOS = [
  { value: 'higido', label: 'Hígido', cor: 'bg-white border-slate-300 text-slate-700' },
  { value: 'carie', label: 'Cárie', cor: 'bg-red-100 border-red-400 text-red-700' },
  { value: 'restaurado', label: 'Restaurado', cor: 'bg-sky-100 border-sky-400 text-sky-700' },
  { value: 'canal', label: 'Tratamento de canal', cor: 'bg-purple-100 border-purple-400 text-purple-700' },
  { value: 'coroa', label: 'Coroa / prótese', cor: 'bg-amber-100 border-amber-400 text-amber-800' },
  { value: 'implante', label: 'Implante', cor: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
  { value: 'extracao', label: 'Extração indicada', cor: 'bg-orange-100 border-orange-400 text-orange-700' },
  { value: 'ausente', label: 'Ausente', cor: 'bg-slate-200 border-slate-400 text-slate-400 line-through' },
]

const ARCADAS = [
  [[18, 17, 16, 15, 14, 13, 12, 11], [21, 22, 23, 24, 25, 26, 27, 28]],
  [[48, 47, 46, 45, 44, 43, 42, 41], [31, 32, 33, 34, 35, 36, 37, 38]],
]

const estilo = (estado) => (ESTADOS.find((e) => e.value === estado) || ESTADOS[0]).cor

export default function Odontograma({ pacienteId, clinicaId }) {
  const [dentes, setDentes] = useState(null)
  const [sel, setSel] = useState(null)
  const [msg, setMsg] = useState({ type: 'success', text: '' })
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    createClient().from('odontogramas').select('dentes').eq('paciente_id', pacienteId).maybeSingle()
      .then(({ data }) => setDentes(data?.dentes || {}))
  }, [pacienteId])

  const atualizar = (num, campo, valor) => setDentes((d) => ({ ...d, [num]: { ...(d[num] || {}), [campo]: valor } }))

  const salvar = async () => {
    setSalvando(true)
    const { error } = await createClient().from('odontogramas').upsert(
      { paciente_id: pacienteId, clinica_id: clinicaId, dentes, atualizado_em: agoraLocal() },
      { onConflict: 'paciente_id' }
    )
    setSalvando(false)
    setMsg(error ? { type: 'error', text: traduzErro(error) } : { type: 'success', text: 'Odontograma salvo.' })
    if (!error) setTimeout(() => setMsg({ type: 'success', text: '' }), 3000)
  }

  if (!dentes) return <Spinner />

  const dente = (n) => (
    <button
      key={n}
      type="button"
      onClick={() => setSel(n)}
      title={ESTADOS.find((e) => e.value === dentes[n]?.estado)?.label || 'Hígido'}
      className={`flex h-12 w-9 flex-col items-center justify-center rounded-md border-2 text-xs font-semibold transition sm:w-10
        ${estilo(dentes[n]?.estado)} ${sel === n ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}
    >
      {n}
      {dentes[n]?.obs && <span className="h-1 w-1 rounded-full bg-current" />}
    </button>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card overflow-x-auto p-6 lg:col-span-2">
        <div className="mx-auto w-fit space-y-6">
          {ARCADAS.map((arcada, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex gap-1">{arcada[0].map(dente)}</div>
              <div className="w-px bg-slate-300" />
              <div className="flex gap-1">{arcada[1].map(dente)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ESTADOS.map((e) => <span key={e.value} className={`rounded border px-2 py-0.5 text-xs ${e.cor}`}>{e.label}</span>)}
        </div>
      </div>

      <div className="card p-6">
        {sel ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Dente {sel}</h3>
            <Field label="Situação">
              <select className="input" value={dentes[sel]?.estado || 'higido'} onChange={(e) => atualizar(sel, 'estado', e.target.value)}>
                {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </Field>
            <Field label="Observações">
              <textarea className="input" rows={4} value={dentes[sel]?.obs || ''} onChange={(e) => atualizar(sel, 'obs', e.target.value)} />
            </Field>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Clique em um dente para registrar a situação.</p>
        )}
        <div className="mt-6 space-y-3">
          <Alert type={msg.type}>{msg.text}</Alert>
          <button onClick={salvar} disabled={salvando} className="btn-primary w-full">{salvando ? 'Salvando...' : 'Salvar odontograma'}</button>
        </div>
      </div>
    </div>
  )
}
