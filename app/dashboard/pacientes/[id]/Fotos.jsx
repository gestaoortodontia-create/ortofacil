'use client'

import { useCallback, useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { Upload, Trash2, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Alert, EmptyState, Field, Modal, Spinner } from '@/components/ui'
import { agoraLocal, dataHora, traduzErro } from '@/lib/format'

const BUCKET = 'fotos-tratamento'
const TIPOS = ['Intraoral', 'Extraoral', 'Radiografia', 'Modelo / escaneamento', 'Outro']
const ETAPAS = ['Inicial', 'Em andamento', 'Final', 'Contenção']

export default function Fotos({ pacienteId, clinicaId }) {
  const [fotos, setFotos] = useState(null)
  const [urls, setUrls] = useState({})
  const [form, setForm] = useState({ tipo: 'Intraoral', etapa_tratamento: 'Inicial', dente: '', notas: '' })
  const [arquivos, setArquivos] = useState([])
  const [enviando, setEnviando] = useState('')
  const [erro, setErro] = useState('')
  const [aberta, setAberta] = useState(null)

  const carregar = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('fotos').select('*').eq('paciente_id', pacienteId).order('data', { ascending: false })
    if (error) return setErro(traduzErro(error))
    setFotos(data)
    if (data.length) {
      const { data: assinadas } = await supabase.storage.from(BUCKET).createSignedUrls(data.map((f) => f.storage_path), 3600)
      setUrls(Object.fromEntries((assinadas || []).map((s) => [s.path, s.signedUrl])))
    }
  }, [pacienteId])

  useEffect(() => { carregar() }, [carregar])

  const enviar = async (e) => {
    e.preventDefault()
    if (!arquivos.length) return setErro('Selecione ao menos uma imagem.')
    setErro('')
    const supabase = createClient()
    try {
      for (let i = 0; i < arquivos.length; i++) {
        const original = arquivos[i]
        setEnviando(`Comprimindo e enviando ${i + 1} de ${arquivos.length}...`)
        const comprimida = await imageCompression(original, {
          maxSizeMB: 0.35,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          fileType: 'image/webp',
          initialQuality: 0.82,
        })
        const path = `${clinicaId}/${pacienteId}/${crypto.randomUUID()}.webp`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, comprimida, { contentType: 'image/webp' })
        if (upErr) throw upErr
        const { error: dbErr } = await supabase.from('fotos').insert({
          clinica_id: clinicaId,
          paciente_id: pacienteId,
          storage_path: path,
          data: agoraLocal(),
          tipo: form.tipo,
          etapa_tratamento: form.etapa_tratamento,
          dente: form.dente || null,
          notas: form.notas || null,
          tamanho_original_kb: Math.round(original.size / 1024),
          tamanho_comprimido_kb: Math.round(comprimida.size / 1024),
        })
        if (dbErr) {
          await supabase.storage.from(BUCKET).remove([path])
          throw dbErr
        }
      }
      setArquivos([])
      e.target.reset()
      carregar()
    } catch (err) {
      setErro(traduzErro(err))
    } finally {
      setEnviando('')
    }
  }

  const excluir = async (foto) => {
    if (!window.confirm('Excluir esta foto?')) return
    const supabase = createClient()
    const { error } = await supabase.from('fotos').delete().eq('id', foto.id)
    if (error) return setErro(traduzErro(error))
    await supabase.storage.from(BUCKET).remove([foto.storage_path])
    setAberta(null)
    carregar()
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      <form onSubmit={enviar} className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><Camera className="h-5 w-5 text-brand-500" /> Enviar fotos</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tipo"><select className="input" value={form.tipo} onChange={set('tipo')}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Etapa"><select className="input" value={form.etapa_tratamento} onChange={set('etapa_tratamento')}>{ETAPAS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Dente(s)"><input className="input" value={form.dente} onChange={set('dente')} placeholder="Ex.: 11, 21" /></Field>
          <Field label="Imagens">
            <input type="file" accept="image/*" multiple onChange={(e) => setArquivos(Array.from(e.target.files || []))}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100" />
          </Field>
          <Field label="Observações" className="sm:col-span-2 lg:col-span-4"><input className="input" value={form.notas} onChange={set('notas')} /></Field>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">As imagens são comprimidas no navegador (WebP, até 1600 px) antes do envio e ficam em armazenamento privado.</p>
          <button type="submit" disabled={!!enviando} className="btn-primary"><Upload className="h-4 w-4" />{enviando || 'Enviar'}</button>
        </div>
        {erro && <div className="mt-4"><Alert>{erro}</Alert></div>}
      </form>

      {fotos === null ? <Spinner /> : fotos.length === 0 ? (
        <div className="card"><EmptyState title="Nenhuma foto enviada" text="Registre fotos iniciais, de acompanhamento e finais do tratamento." /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {fotos.map((f) => (
            <button key={f.id} onClick={() => setAberta(f)} className="card group overflow-hidden text-left">
              <div className="aspect-square bg-slate-100">
                {urls[f.storage_path] && <img src={urls[f.storage_path]} alt={f.tipo} className="h-full w-full object-cover transition group-hover:scale-105" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900">{f.tipo} · {f.etapa_tratamento}</p>
                <p className="text-xs text-slate-500">{dataHora(f.data)}{f.dente ? ` · dente ${f.dente}` : ''}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!aberta} title={aberta ? `${aberta.tipo} · ${aberta.etapa_tratamento}` : ''} onClose={() => setAberta(null)} size="xl">
        {aberta && (
          <div>
            <img src={urls[aberta.storage_path]} alt={aberta.tipo} className="mx-auto max-h-[70vh] rounded-lg" />
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p>{dataHora(aberta.data)}{aberta.dente ? ` · dente ${aberta.dente}` : ''}{aberta.notas ? ` · ${aberta.notas}` : ''}</p>
                {aberta.tamanho_original_kb && <p className="text-xs text-slate-500">Original {aberta.tamanho_original_kb} KB → armazenado {aberta.tamanho_comprimido_kb} KB</p>}
              </div>
              <button onClick={() => excluir(aberta)} className="btn-danger"><Trash2 className="h-4 w-4" /> Excluir</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
