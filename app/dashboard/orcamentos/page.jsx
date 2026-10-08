'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Receipt, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { Alert, EmptyState, Field, Modal, PageHeader, Spinner } from '@/components/ui'
import StatusBadge from '@/components/StatusBadge'
import { STATUS_ORCAMENTO } from '@/lib/opcoes'
import { addDays, data, isoDate, moeda, traduzErro } from '@/lib/format'

const itemVazio = () => ({ procedimento_id: '', descricao: '', quantidade: 1, valor_unitario: '' })

function Editor({ orcamento, onClose, onSaved }) {
  const { clinica } = useClinica()
  const [cab, setCab] = useState({
    paciente_id: orcamento.paciente_id || '',
    profissional_id: orcamento.profissional_id || '',
    data_validade: orcamento.data_validade?.slice(0, 10) || addDays(isoDate(), 30),
    status: orcamento.status || 'rascunho',
  })
  const [itens, setItens] = useState([itemVazio()])
  const [opts, setOpts] = useState({ pacientes: [], profissionais: [], procedimentos: [] })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const s = createClient()
    Promise.all([
      s.from('pacientes').select('id, nome').eq('clinica_id', clinica.id).order('nome'),
      s.from('profissionais').select('id, nome').eq('clinica_id', clinica.id).order('nome'),
      s.from('procedimentos').select('id, nome, preco_base').eq('clinica_id', clinica.id).eq('ativo', true).order('nome'),
      orcamento.id ? s.from('orcamento_itens').select('*').eq('orcamento_id', orcamento.id).order('ordem') : Promise.resolve({ data: null }),
    ]).then(([pac, prof, proc, it]) => {
      setOpts({ pacientes: pac.data || [], profissionais: prof.data || [], procedimentos: proc.data || [] })
      if (it.data?.length) setItens(it.data.map((i) => ({ procedimento_id: i.procedimento_id || '', descricao: i.descricao || '', quantidade: i.quantidade, valor_unitario: i.valor_unitario })))
    })
  }, [clinica.id, orcamento.id])

  const setItem = (idx, patch) => setItens((l) => l.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  const escolherProc = (idx, id) => {
    const p = opts.procedimentos.find((x) => x.id === id)
    setItem(idx, { procedimento_id: id, descricao: p?.nome || '', valor_unitario: p?.preco_base ?? '' })
  }
  const total = itens.reduce((s, i) => s + (Number(i.quantidade) || 0) * (Number(i.valor_unitario) || 0), 0)

  const salvar = async (e) => {
    e.preventDefault()
    const validos = itens.filter((i) => i.descricao.trim() && Number(i.quantidade) > 0)
    if (!cab.paciente_id) return setErro('Selecione o paciente.')
    if (!validos.length) return setErro('Adicione ao menos um item com descrição.')
    setSalvando(true)
    setErro('')
    const s = createClient()
    try {
      const dados = {
        paciente_id: cab.paciente_id,
        profissional_id: cab.profissional_id || null,
        data_validade: cab.data_validade || null,
        status: cab.status,
        valor_total: total,
      }
      let id = orcamento.id
      if (id) {
        const { error } = await s.from('orcamentos').update(dados).eq('id', id)
        if (error) throw error
        const { error: delErr } = await s.from('orcamento_itens').delete().eq('orcamento_id', id)
        if (delErr) throw delErr
      } else {
        const { count } = await s.from('orcamentos').select('id', { count: 'exact', head: true }).eq('clinica_id', clinica.id)
        const numero = `${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`
        const { data: novo, error } = await s.from('orcamentos').insert({ ...dados, numero, clinica_id: clinica.id }).select('id').single()
        if (error) throw error
        id = novo.id
      }
      const { error: itErr } = await s.from('orcamento_itens').insert(validos.map((i, ordem) => ({
        orcamento_id: id,
        procedimento_id: i.procedimento_id || null,
        descricao: i.descricao.trim(),
        quantidade: Number(i.quantidade),
        valor_unitario: Number(i.valor_unitario) || 0,
        valor_total: Number(i.quantidade) * (Number(i.valor_unitario) || 0),
        ordem,
      })))
      if (itErr) throw itErr
      onSaved()
    } catch (err) {
      setErro(traduzErro(err))
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Paciente" required className="sm:col-span-2">
          <select className="input" value={cab.paciente_id} onChange={(e) => setCab({ ...cab, paciente_id: e.target.value })}>
            <option value="">Selecione...</option>
            {opts.pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </Field>
        <Field label="Profissional">
          <select className="input" value={cab.profissional_id} onChange={(e) => setCab({ ...cab, profissional_id: e.target.value })}>
            <option value="">—</option>
            {opts.profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Validade"><input type="date" className="input" value={cab.data_validade} onChange={(e) => setCab({ ...cab, data_validade: e.target.value })} /></Field>
          <Field label="Status">
            <select className="input" value={cab.status} onChange={(e) => setCab({ ...cab, status: e.target.value })}>
              {STATUS_ORCAMENTO.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div>
        <p className="label">Itens</p>
        <div className="space-y-2">
          {itens.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 rounded-lg border border-slate-200 p-2">
              <select className="input col-span-12 sm:col-span-4" value={it.procedimento_id} onChange={(e) => escolherProc(idx, e.target.value)}>
                <option value="">Procedimento (opcional)</option>
                {opts.procedimentos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <input className="input col-span-12 sm:col-span-4" placeholder="Descrição" value={it.descricao} onChange={(e) => setItem(idx, { descricao: e.target.value })} />
              <input className="input col-span-3 sm:col-span-1" type="number" min="1" value={it.quantidade} onChange={(e) => setItem(idx, { quantidade: e.target.value })} title="Quantidade" />
              <input className="input col-span-7 sm:col-span-2" type="number" step="0.01" min="0" placeholder="Valor unit." value={it.valor_unitario} onChange={(e) => setItem(idx, { valor_unitario: e.target.value })} />
              <button type="button" onClick={() => setItens((l) => (l.length > 1 ? l.filter((_, i) => i !== idx) : [itemVazio()]))} className="col-span-2 flex items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 sm:col-span-1" title="Remover"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button type="button" onClick={() => setItens((l) => [...l, itemVazio()])} className="btn-ghost text-brand-700"><Plus className="h-4 w-4" /> Adicionar item</button>
          <p className="text-lg font-bold text-slate-900">Total: {moeda(total)}</p>
        </div>
      </div>

      <Alert>{erro}</Alert>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={salvando} className="btn-primary">{salvando ? 'Salvando...' : 'Salvar orçamento'}</button>
      </div>
    </form>
  )
}

function GerarCobranca({ orcamento, onClose, onDone }) {
  const { clinica } = useClinica()
  const [parcelas, setParcelas] = useState(1)
  const [primeiro, setPrimeiro] = useState(isoDate())
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const total = Number(orcamento.valor_total) || 0
  const n = Math.max(1, Math.min(48, Number(parcelas) || 1))
  const base = Math.floor((total / n) * 100) / 100

  const gerar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    const [y, m, d] = primeiro.split('-').map(Number)
    const linhas = Array.from({ length: n }, (_, i) => {
      const venc = new Date(y, m - 1 + i, d)
      const valor = i === n - 1 ? Math.round((total - base * (n - 1)) * 100) / 100 : base
      return {
        clinica_id: clinica.id,
        paciente_id: orcamento.paciente_id,
        descricao: `Orçamento nº ${orcamento.numero}${n > 1 ? ` — parcela ${i + 1}/${n}` : ''}`,
        valor_total: valor,
        valor_pago: 0,
        status: 'aberto',
        data_vencimento: isoDate(venc),
      }
    })
    const { error } = await createClient().from('contas_receber').insert(linhas)
    if (error) {
      setErro(traduzErro(error))
      setSalvando(false)
      return
    }
    onDone()
  }

  return (
    <form onSubmit={gerar} className="space-y-4">
      <p className="text-sm text-slate-600">Gera contas a receber no financeiro para <strong>{orcamento.pacientes?.nome}</strong>, total de <strong>{moeda(total)}</strong>.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Parcelas"><input type="number" min="1" max="48" className="input" value={parcelas} onChange={(e) => setParcelas(e.target.value)} /></Field>
        <Field label="1º vencimento"><input type="date" required className="input" value={primeiro} onChange={(e) => setPrimeiro(e.target.value)} /></Field>
      </div>
      <p className="text-sm text-slate-500">{n}x de {moeda(base)}{n > 1 && base * n !== total ? ' (ajuste de centavos na última)' : ''}, vencimentos mensais.</p>
      <Alert>{erro}</Alert>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={salvando} className="btn-primary">{salvando ? 'Gerando...' : 'Gerar cobrança'}</button>
      </div>
    </form>
  )
}

export default function OrcamentosPage() {
  const { clinica } = useClinica()
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [editando, setEditando] = useState(null)
  const [cobrando, setCobrando] = useState(null)

  const carregar = useCallback(async () => {
    const { data, error } = await createClient().from('orcamentos')
      .select('*, pacientes(nome), profissionais(nome)').eq('clinica_id', clinica.id).order('data_emissao', { ascending: false })
    setErro(error ? traduzErro(error) : '')
    setLista(data || [])
  }, [clinica.id])

  useEffect(() => { carregar() }, [carregar])

  const excluir = async (o) => {
    if (!window.confirm(`Excluir o orçamento nº ${o.numero}?`)) return
    const { error } = await createClient().from('orcamentos').delete().eq('id', o.id)
    if (error) setErro(traduzErro(error))
    else carregar()
  }

  return (
    <div>
      <PageHeader title="Orçamentos" subtitle="Planos de tratamento com valores, aprovação e geração de cobrança.">
        <Link href="/dashboard/configuracoes?aba=procedimentos" className="btn-secondary">Tabela de procedimentos</Link>
        <button onClick={() => setEditando({})} className="btn-primary"><Plus className="h-4 w-4" /> Novo orçamento</button>
      </PageHeader>

      {erro && <div className="mb-4"><Alert>{erro}</Alert></div>}
      {ok && <div className="mb-4"><Alert type="success">{ok}</Alert></div>}

      <div className="card overflow-hidden">
        {lista === null ? <Spinner /> : lista.length === 0 ? <EmptyState title="Nenhum orçamento" text="Monte orçamentos a partir da sua tabela de procedimentos." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50"><tr>
                <th className="th">Nº</th><th className="th">Paciente</th><th className="th">Emissão</th><th className="th">Validade</th>
                <th className="th text-right">Valor</th><th className="th">Status</th><th className="th text-right">Ações</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70">
                    <td className="td font-mono text-xs">{o.numero}</td>
                    <td className="td font-medium text-slate-900">{o.pacientes?.nome}</td>
                    <td className="td">{data(o.data_emissao)}</td>
                    <td className="td">{data(o.data_validade)}</td>
                    <td className="td text-right font-semibold">{moeda(o.valor_total)}</td>
                    <td className="td"><StatusBadge lista={STATUS_ORCAMENTO} value={o.status} /></td>
                    <td className="td">
                      <div className="flex justify-end gap-1">
                        {o.status === 'aprovado' && (
                          <button onClick={() => setCobrando(o)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"><Receipt className="h-3.5 w-3.5" /> Cobrar</button>
                        )}
                        <button onClick={() => setEditando(o)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-700" title="Editar"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => excluir(o)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editando} title={editando?.id ? `Orçamento nº ${editando.numero}` : 'Novo orçamento'} onClose={() => setEditando(null)} size="xl">
        {editando && <Editor orcamento={editando} onClose={() => setEditando(null)} onSaved={() => { setEditando(null); carregar() }} />}
      </Modal>
      <Modal open={!!cobrando} title="Gerar cobrança" onClose={() => setCobrando(null)} size="md">
        {cobrando && <GerarCobranca orcamento={cobrando} onClose={() => setCobrando(null)} onDone={() => { setCobrando(null); setOk('Cobrança gerada. Veja em Financeiro → Contas a receber.') }} />}
      </Modal>
    </div>
  )
}
