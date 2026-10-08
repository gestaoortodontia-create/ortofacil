'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Printer, Trash2, CheckCircle2, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { Alert, Badge, EmptyState, Field, Modal, PageHeader, Spinner, Tabs } from '@/components/ui'
import CrudPage from '@/components/CrudPage'
import { MODELO_GERAL, MODELO_ORTODONTIA, VARIAVEIS_CONTRATO, preencherContrato } from '@/lib/contratos-padrao'
import { agoraLocal, data, isoDate, moeda, traduzErro } from '@/lib/format'

const CAMPOS_MODELO = [
  { name: 'nome', label: 'Nome do modelo', required: true },
  { name: 'tipo', label: 'Tipo', type: 'select', required: true, options: [{ value: 'geral', label: 'Geral' }, { value: 'ortodontia', label: 'Ortodontia' }, { value: 'outro', label: 'Outro' }] },
  {
    name: 'conteudo', label: 'Texto do contrato', type: 'textarea', rows: 18, required: true,
    help: `Variáveis disponíveis: ${VARIAVEIS_CONTRATO.map(([k]) => `{{${k}}}`).join(' ')}`,
  },
]
const COLS_MODELO = [
  { key: 'nome', label: 'Modelo', render: (r) => <span className="font-medium text-slate-900">{r.nome}</span> },
  { key: 'tipo', label: 'Tipo', render: (r) => <Badge color={r.tipo === 'ortodontia' ? 'brand' : 'gray'}>{r.tipo}</Badge> },
  { key: 'atualizado_em', label: 'Atualizado', render: (r) => data(r.atualizado_em || r.criado_em) },
]
const ORDEM_NOME = { column: 'nome', ascending: true }
const comAtualizacao = (p) => ({ ...p, atualizado_em: agoraLocal() })

function NovoContrato({ onClose, onSaved }) {
  const { clinica } = useClinica()
  const [opts, setOpts] = useState({ pacientes: [], modelos: [], profissionais: [] })
  const [f, setF] = useState({ paciente_id: '', modelo_id: '', profissional_id: '', tratamento: '', valor_total: '', forma_pagamento: '', valor_manutencao: '', prazo_estimado: '', data_validade: '' })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  useEffect(() => {
    const s = createClient()
    Promise.all([
      s.from('pacientes').select('*').eq('clinica_id', clinica.id).order('nome'),
      s.from('modelos_contrato').select('*').eq('clinica_id', clinica.id).order('nome'),
      s.from('profissionais').select('id, nome, cro').eq('clinica_id', clinica.id).order('nome'),
    ]).then(([p, m, pr]) => setOpts({ pacientes: p.data || [], modelos: m.data || [], profissionais: pr.data || [] }))
  }, [clinica.id])

  const paciente = opts.pacientes.find((p) => p.id === f.paciente_id)
  const modelo = opts.modelos.find((m) => m.id === f.modelo_id)
  const prof = opts.profissionais.find((p) => p.id === f.profissional_id)

  const texto = useMemo(() => {
    if (!modelo) return ''
    return preencherContrato(modelo.conteudo, {
      'clinica.nome': clinica.nome, 'clinica.cnpj': clinica.cnpj, 'clinica.endereco': clinica.endereco,
      'paciente.nome': paciente?.nome, 'paciente.cpf': paciente?.cpf, 'paciente.endereco': paciente?.endereco,
      'paciente.data_nascimento': paciente?.data_nascimento && data(paciente.data_nascimento),
      'responsavel.nome': paciente?.responsavel_nome || 'não se aplica', 'responsavel.cpf': paciente?.responsavel_cpf || '—',
      'profissional.nome': prof?.nome, 'profissional.cro': prof?.cro?.replace(/^CRO[\s-]*/i, ''),
      tratamento: f.tratamento, valor_total: f.valor_total && moeda(f.valor_total), forma_pagamento: f.forma_pagamento,
      valor_manutencao: f.valor_manutencao && moeda(f.valor_manutencao), prazo_estimado: f.prazo_estimado,
      data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    })
  }, [modelo, paciente, prof, f, clinica])

  const salvar = async (e) => {
    e.preventDefault()
    if (!paciente || !modelo) return setErro('Selecione o paciente e o modelo.')
    setSalvando(true)
    const { data: novo, error } = await createClient().from('contratos').insert({
      clinica_id: clinica.id, paciente_id: paciente.id, modelo_id: modelo.id,
      conteudo_preenchido: texto, data_validade: f.data_validade || null,
    }).select('id').single()
    if (error) {
      setErro(traduzErro(error))
      setSalvando(false)
      return
    }
    onSaved(novo.id)
  }

  return (
    <form onSubmit={salvar} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Paciente" required>
          <select className="input" value={f.paciente_id} onChange={set('paciente_id')}><option value="">Selecione...</option>{opts.pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
        </Field>
        <Field label="Modelo" required>
          <select className="input" value={f.modelo_id} onChange={set('modelo_id')}><option value="">Selecione...</option>{opts.modelos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select>
        </Field>
        <Field label="Profissional responsável">
          <select className="input" value={f.profissional_id} onChange={set('profissional_id')}><option value="">—</option>{opts.profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
        </Field>
        <Field label="Tratamento / serviços"><textarea className="input" rows={3} value={f.tratamento} onChange={set('tratamento')} placeholder="Ex.: Tratamento ortodôntico com aparelho fixo autoligado superior e inferior" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Valor total (R$)"><input type="number" step="0.01" className="input" value={f.valor_total} onChange={set('valor_total')} /></Field>
          <Field label="Manutenção mensal (R$)"><input type="number" step="0.01" className="input" value={f.valor_manutencao} onChange={set('valor_manutencao')} /></Field>
          <Field label="Forma de pagamento"><input className="input" value={f.forma_pagamento} onChange={set('forma_pagamento')} placeholder="Ex.: 10x no boleto" /></Field>
          <Field label="Prazo estimado"><input className="input" value={f.prazo_estimado} onChange={set('prazo_estimado')} placeholder="Ex.: 24 meses" /></Field>
          <Field label="Validade do contrato"><input type="date" className="input" value={f.data_validade} onChange={set('data_validade')} min={isoDate()} /></Field>
        </div>
        <Alert>{erro}</Alert>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={salvando} className="btn-primary">{salvando ? 'Gerando...' : 'Gerar contrato'}</button>
        </div>
      </div>
      <div>
        <p className="label">Pré-visualização</p>
        <div className="h-[560px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-serif text-[13px] leading-relaxed text-slate-800">
          {texto || <span className="font-sans text-slate-400">Selecione um modelo para visualizar.</span>}
        </div>
      </div>
    </form>
  )
}

function ListaContratos() {
  const { clinica } = useClinica()
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [novo, setNovo] = useState(false)

  const carregar = useCallback(async () => {
    const { data, error } = await createClient().from('contratos').select('id, criado_em, assinado, data_assinatura, data_validade, pacientes(nome), modelos_contrato(nome)')
      .eq('clinica_id', clinica.id).order('criado_em', { ascending: false })
    setErro(error ? traduzErro(error) : '')
    setLista(data || [])
  }, [clinica.id])
  useEffect(() => { carregar() }, [carregar])

  const alternarAssinado = async (c) => {
    const { error } = await createClient().from('contratos')
      .update({ assinado: !c.assinado, data_assinatura: c.assinado ? null : agoraLocal() }).eq('id', c.id)
    if (error) setErro(traduzErro(error))
    else carregar()
  }
  const excluir = async (c) => {
    if (!window.confirm('Excluir este contrato?')) return
    const { error } = await createClient().from('contratos').delete().eq('id', c.id)
    if (error) setErro(traduzErro(error))
    else carregar()
  }

  return (
    <>
      <div className="mb-4 flex justify-end"><button onClick={() => setNovo(true)} className="btn-primary"><Plus className="h-4 w-4" /> Novo contrato</button></div>
      {erro && <div className="mb-4"><Alert>{erro}</Alert></div>}
      <div className="card overflow-hidden">
        {lista === null ? <Spinner /> : lista.length === 0 ? <EmptyState title="Nenhum contrato gerado" text="Gere um contrato a partir de um modelo, já preenchido com os dados do paciente." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50"><tr><th className="th">Paciente</th><th className="th">Modelo</th><th className="th">Gerado em</th><th className="th">Situação</th><th className="th text-right">Ações</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="td font-medium text-slate-900">{c.pacientes?.nome}</td>
                    <td className="td">{c.modelos_contrato?.nome || '—'}</td>
                    <td className="td">{data(c.criado_em)}</td>
                    <td className="td">{c.assinado ? <Badge color="green">Assinado em {data(c.data_assinatura)}</Badge> : <Badge color="yellow">Aguardando assinatura</Badge>}</td>
                    <td className="td">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/contratos/${c.id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"><Printer className="h-3.5 w-3.5" /> Imprimir</Link>
                        <button onClick={() => alternarAssinado(c)} className="rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600" title={c.assinado ? 'Desmarcar assinatura' : 'Marcar como assinado'}><CheckCircle2 className="h-4 w-4" /></button>
                        <button onClick={() => excluir(c)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal open={novo} title="Novo contrato" onClose={() => setNovo(false)} size="xl">
        {novo && <NovoContrato onClose={() => setNovo(false)} onSaved={(id) => { window.location.href = `/dashboard/contratos/${id}` }} />}
      </Modal>
    </>
  )
}

export default function ContratosPage() {
  const { clinica } = useClinica()
  const [tab, setTab] = useState('contratos')
  const [reload, setReload] = useState(0)
  const [msg, setMsg] = useState('')

  const restaurarPadroes = async () => {
    const { error } = await createClient().from('modelos_contrato')
      .insert([MODELO_GERAL, MODELO_ORTODONTIA].map((m) => ({ ...m, clinica_id: clinica.id })))
    setMsg(error ? traduzErro(error) : 'Modelos padrão adicionados.')
    setReload((n) => n + 1)
  }

  return (
    <div>
      <PageHeader title="Contratos" subtitle="Contratos de prestação de serviços odontológicos e de ortodontia." />
      <Tabs tabs={[{ id: 'contratos', label: 'Contratos gerados' }, { id: 'modelos', label: 'Modelos' }]} active={tab} onChange={setTab} />
      {tab === 'contratos' ? <ListaContratos /> : (
        <>
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
            <span>Os modelos padrão são uma base de referência. Recomenda-se revisão por um advogado antes do uso.</span>
            <button onClick={restaurarPadroes} className="btn-secondary shrink-0"><RotateCcw className="h-4 w-4" /> Adicionar modelos padrão</button>
          </div>
          {msg && <div className="mb-4"><Alert type="success">{msg}</Alert></div>}
          <CrudPage embedded table="modelos_contrato" singular="modelo" fields={CAMPOS_MODELO} columns={COLS_MODELO} order={ORDEM_NOME} beforeSave={comAtualizacao} reloadKey={reload} searchFields={['nome']} />
        </>
      )}
    </div>
  )
}
