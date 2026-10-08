'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus, Clock, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { Alert, EmptyState, Modal, PageHeader, Spinner } from '@/components/ui'
import RecordForm from '@/components/RecordForm'
import { STATUS_AGENDA, statusInfo } from '@/lib/opcoes'
import { addDays, hora, isoDate, traduzErro } from '@/lib/format'

const CAMPOS_BASE = [
  { name: 'paciente_id', label: 'Paciente', type: 'select', required: true, source: { table: 'pacientes' }, full: true },
  { name: 'profissional_id', label: 'Profissional', type: 'select', required: true, source: { table: 'profissionais', filter: (q) => q.eq('ativo', true) } },
  { name: 'data_hora', label: 'Data e hora', type: 'datetime-local', required: true },
  { name: 'duracao_minutos', label: 'Duração (min)', type: 'number', min: 5, step: 5, default: 30 },
  { name: 'cadeira', label: 'Cadeira / sala' },
  { name: 'procedimento', label: 'Procedimento', placeholder: 'Ex.: Manutenção ortodôntica', full: true },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUS_AGENDA, default: 'agendado' },
  { name: 'notas', label: 'Observações', type: 'textarea' },
]

const corStatus = {
  blue: 'border-l-sky-400', brand: 'border-l-brand-400', yellow: 'border-l-amber-400',
  green: 'border-l-emerald-500', red: 'border-l-red-500', gray: 'border-l-slate-300',
}

const tituloDia = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function AgendaPage() {
  const { clinica } = useClinica()
  const [dia, setDia] = useState(isoDate())
  const [modo, setModo] = useState('dia')
  const [profissional, setProfissional] = useState('')
  const [profissionais, setProfissionais] = useState([])
  const [itens, setItens] = useState(null)
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState(null)

  const fim = modo === 'dia' ? addDays(dia, 1) : addDays(dia, 7)

  const carregar = useCallback(async () => {
    let q = createClient().from('agendamentos')
      .select('*, pacientes(id, nome, telefone), profissionais(nome)')
      .eq('clinica_id', clinica.id)
      .gte('data_hora', `${dia}T00:00:00`).lt('data_hora', `${fim}T00:00:00`)
      .order('data_hora')
    if (profissional) q = q.eq('profissional_id', profissional)
    const { data, error } = await q
    setErro(error ? traduzErro(error) : '')
    setItens(data || [])
  }, [clinica.id, dia, fim, profissional])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    createClient().from('profissionais').select('id, nome').eq('clinica_id', clinica.id).eq('ativo', true).order('nome')
      .then(({ data }) => setProfissionais(data || []))
  }, [clinica.id])

  const campos = useMemo(
    () => CAMPOS_BASE.map((f) => (f.name === 'data_hora' ? { ...f, default: `${dia}T08:00` } : f)),
    [dia]
  )

  const salvar = async (payload) => {
    const supabase = createClient()
    const { error } = editando?.id
      ? await supabase.from('agendamentos').update(payload).eq('id', editando.id)
      : await supabase.from('agendamentos').insert({ ...payload, clinica_id: clinica.id })
    if (error) throw new Error(traduzErro(error))
    setEditando(null)
    carregar()
  }

  const mudarStatus = async (item, status) => {
    const { error } = await createClient().from('agendamentos').update({ status }).eq('id', item.id)
    if (error) setErro(traduzErro(error))
    else carregar()
  }

  const excluir = async (item) => {
    if (!window.confirm('Excluir este agendamento?')) return
    const { error } = await createClient().from('agendamentos').delete().eq('id', item.id)
    if (error) setErro(traduzErro(error))
    else carregar()
  }

  const grupos = useMemo(() => {
    const g = {}
    for (const it of itens || []) (g[it.data_hora.slice(0, 10)] ||= []).push(it)
    return g
  }, [itens])

  const passo = modo === 'dia' ? 1 : 7

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Consultas da clínica por dia ou semana.">
        <button onClick={() => setEditando({})} className="btn-primary" disabled={!profissionais.length}><Plus className="h-4 w-4" /> Novo agendamento</button>
      </PageHeader>

      {profissionais.length === 0 && itens !== null && (
        <div className="mb-4">
          <Alert>Cadastre ao menos um profissional em <Link href="/dashboard/configuracoes" className="font-semibold underline">Configurações</Link> para começar a agendar.</Alert>
        </div>
      )}

      <div className="card mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setDia(addDays(dia, -passo))} className="btn-secondary px-2.5" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setDia(isoDate())} className="btn-secondary">Hoje</button>
          <button onClick={() => setDia(addDays(dia, passo))} className="btn-secondary px-2.5" aria-label="Próximo"><ChevronRight className="h-4 w-4" /></button>
          <input type="date" className="input w-auto" value={dia} onChange={(e) => e.target.value && setDia(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <select className="input w-auto" value={profissional} onChange={(e) => setProfissional(e.target.value)}>
            <option value="">Todos os profissionais</option>
            {profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
            {['dia', 'semana'].map((m) => (
              <button key={m} onClick={() => setModo(m)} className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${modo === m ? 'bg-brand-700 text-white' : 'text-slate-600'}`}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {erro && <div className="mb-4"><Alert>{erro}</Alert></div>}

      {itens === null ? <Spinner /> : itens.length === 0 ? (
        <div className="card"><EmptyState title={modo === 'dia' ? `Sem consultas em ${tituloDia(dia)}` : 'Sem consultas nesta semana'} /></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grupos).map(([d, lista]) => (
            <section key={d}>
              <h2 className="mb-2 text-sm font-semibold text-slate-600"><span className="inline-block first-letter:uppercase">{tituloDia(d)}</span> <span className="font-normal text-slate-400">· {lista.length} consulta(s)</span></h2>
              <div className="card divide-y divide-slate-100">
                {lista.map((a) => {
                  const st = statusInfo(STATUS_AGENDA, a.status)
                  return (
                    <div key={a.id} className={`flex flex-col gap-3 border-l-4 px-4 py-3 sm:flex-row sm:items-center ${corStatus[st.color]}`}>
                      <div className="flex w-28 shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <Clock className="h-4 w-4 text-slate-400" />{hora(a.data_hora)}
                        <span className="text-xs font-normal text-slate-400">{a.duracao_minutos}min</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/dashboard/pacientes/${a.pacientes?.id}`} className="font-medium text-slate-900 hover:text-brand-600">{a.pacientes?.nome}</Link>
                        <p className="truncate text-xs text-slate-500">
                          {a.procedimento || 'Consulta'} · {a.profissionais?.nome}{a.cadeira ? ` · ${a.cadeira}` : ''}{a.pacientes?.telefone ? ` · ${a.pacientes.telefone}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <select value={a.status} onChange={(e) => mudarStatus(a, e.target.value)} className="input w-auto py-1 text-xs">
                          {STATUS_AGENDA.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <button onClick={() => setEditando(a)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-700" title="Editar"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => excluir(a)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal open={!!editando} title={editando?.id ? 'Editar agendamento' : 'Novo agendamento'} onClose={() => setEditando(null)}>
        {editando && <RecordForm fields={campos} initial={editando} onSubmit={salvar} onCancel={() => setEditando(null)} />}
      </Modal>
    </div>
  )
}
