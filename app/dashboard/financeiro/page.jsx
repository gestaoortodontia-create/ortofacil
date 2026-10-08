'use client'

import { useCallback, useEffect, useState } from 'react'
import { HandCoins, CheckCircle2, TrendingUp, AlertTriangle, ArrowDownCircle, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import CrudPage from '@/components/CrudPage'
import StatusBadge from '@/components/StatusBadge'
import { Alert, EmptyState, Field, Modal, PageHeader, Spinner, StatCard, Tabs } from '@/components/ui'
import { METODOS_PAGAMENTO, STATUS_PAGAR, STATUS_RECEBER } from '@/lib/opcoes'
import { agoraLocal, data, dataHora, isoDate, moeda, traduzErro } from '@/lib/format'

const hoje = () => isoDate()
const saldo = (c) => Math.max(0, Number(c.valor_total || 0) - Number(c.valor_pago || 0))

const CAMPOS_RECEBER = [
  { name: 'paciente_id', label: 'Paciente', type: 'select', required: true, source: { table: 'pacientes' }, full: true },
  { name: 'descricao', label: 'Descrição', required: true, full: true },
  { name: 'valor_total', label: 'Valor (R$)', type: 'money', required: true, min: 0 },
  { name: 'data_vencimento', label: 'Vencimento', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUS_RECEBER, default: 'aberto' },
]

const CAMPOS_PAGAR = [
  { name: 'fornecedor', label: 'Fornecedor / favorecido', required: true },
  { name: 'descricao', label: 'Descrição', required: true },
  { name: 'valor', label: 'Valor (R$)', type: 'money', required: true, min: 0 },
  { name: 'data_vencimento', label: 'Vencimento', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', required: true, options: STATUS_PAGAR, default: 'aberto' },
]

const vencida = (c) => c.data_vencimento && c.data_vencimento < hoje() && ['aberto', 'parcial'].includes(c.status)

const COLS_RECEBER = [
  { key: 'paciente', label: 'Paciente', render: (c) => <span className="font-medium text-slate-900">{c.pacientes?.nome}<span className="block text-xs font-normal text-slate-500">{c.descricao}</span></span> },
  { key: 'venc', label: 'Vencimento', render: (c) => <span className={vencida(c) ? 'font-semibold text-red-600' : ''}>{data(c.data_vencimento)}{vencida(c) && ' · vencida'}</span> },
  { key: 'valor', label: 'Valor', className: 'text-right', render: (c) => moeda(c.valor_total) },
  { key: 'pago', label: 'Recebido', className: 'text-right', render: (c) => moeda(c.valor_pago) },
  { key: 'status', label: 'Status', render: (c) => <StatusBadge lista={STATUS_RECEBER} value={c.status} /> },
]

const COLS_PAGAR = [
  { key: 'fornecedor', label: 'Fornecedor', render: (c) => <span className="font-medium text-slate-900">{c.fornecedor}<span className="block text-xs font-normal text-slate-500">{c.descricao}</span></span> },
  { key: 'venc', label: 'Vencimento', render: (c) => <span className={c.status === 'aberto' && c.data_vencimento < hoje() ? 'font-semibold text-red-600' : ''}>{data(c.data_vencimento)}</span> },
  { key: 'valor', label: 'Valor', className: 'text-right', render: (c) => moeda(c.valor) },
  { key: 'status', label: 'Status', render: (c) => <StatusBadge lista={STATUS_PAGAR} value={c.status} /> },
]

const ORDEM_VENC = { column: 'data_vencimento', ascending: true }

function RegistrarPagamento({ conta, onClose, onDone }) {
  const { clinica } = useClinica()
  const [valor, setValor] = useState(saldo(conta).toFixed(2))
  const [metodo, setMetodo] = useState('PIX')
  const [dia, setDia] = useState(hoje())
  const [ref, setRef] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvar = async (e) => {
    e.preventDefault()
    const v = Number(valor)
    if (!(v > 0)) return setErro('Informe um valor maior que zero.')
    setSalvando(true)
    const s = createClient()
    const { error } = await s.from('pagamentos').insert({
      clinica_id: clinica.id, conta_receber_id: conta.id, valor: v, metodo_pagamento: metodo,
      data_pagamento: `${dia}T${agoraLocal().slice(11)}`, numero_referencia: ref || null,
    })
    if (error) { setErro(traduzErro(error)); setSalvando(false); return }
    const novoPago = Math.round((Number(conta.valor_pago || 0) + v) * 100) / 100
    const { error: upErr } = await s.from('contas_receber').update({
      valor_pago: novoPago,
      status: novoPago >= Number(conta.valor_total) ? 'pago' : 'parcial',
      atualizado_em: agoraLocal(),
    }).eq('id', conta.id)
    if (upErr) { setErro(traduzErro(upErr)); setSalvando(false); return }
    onDone()
  }

  return (
    <form onSubmit={salvar} className="space-y-4">
      <p className="text-sm text-slate-600"><strong>{conta.pacientes?.nome}</strong> — {conta.descricao}<br />Saldo em aberto: <strong>{moeda(saldo(conta))}</strong></p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Valor recebido (R$)" required><input type="number" step="0.01" min="0.01" className="input" value={valor} onChange={(e) => setValor(e.target.value)} /></Field>
        <Field label="Data" required><input type="date" className="input" value={dia} onChange={(e) => setDia(e.target.value)} /></Field>
        <Field label="Forma de pagamento"><select className="input" value={metodo} onChange={(e) => setMetodo(e.target.value)}>{METODOS_PAGAMENTO.map((m) => <option key={m}>{m}</option>)}</select></Field>
        <Field label="Referência / comprovante"><input className="input" value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
      </div>
      <Alert>{erro}</Alert>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={salvando} className="btn-primary">{salvando ? 'Registrando...' : 'Registrar pagamento'}</button>
      </div>
    </form>
  )
}

function Recebimentos({ reloadKey }) {
  const { clinica } = useClinica()
  const [mes, setMes] = useState(hoje().slice(0, 7))
  const [lista, setLista] = useState(null)

  useEffect(() => {
    const [y, m] = mes.split('-').map(Number)
    const fim = `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}-01`
    createClient().from('pagamentos').select('*, contas_receber(descricao, pacientes(nome))').eq('clinica_id', clinica.id)
      .gte('data_pagamento', `${mes}-01T00:00:00`).lt('data_pagamento', `${fim}T00:00:00`).order('data_pagamento', { ascending: false })
      .then(({ data }) => setLista(data || []))
  }, [clinica.id, mes, reloadKey])

  const total = (lista || []).reduce((s, p) => s + Number(p.valor), 0)

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <input type="month" className="input w-auto" value={mes} onChange={(e) => e.target.value && setMes(e.target.value)} />
        <p className="text-sm text-slate-600">Total recebido: <strong className="text-emerald-700">{moeda(total)}</strong></p>
      </div>
      {lista === null ? <Spinner /> : lista.length === 0 ? <EmptyState title="Nenhum recebimento neste mês" /> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50"><tr><th className="th">Data</th><th className="th">Paciente</th><th className="th">Forma</th><th className="th text-right">Valor</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((p) => (
                <tr key={p.id}>
                  <td className="td">{dataHora(p.data_pagamento)}</td>
                  <td className="td"><span className="font-medium text-slate-900">{p.contas_receber?.pacientes?.nome || '—'}</span><span className="block text-xs text-slate-500">{p.contas_receber?.descricao}</span></td>
                  <td className="td">{p.metodo_pagamento}</td>
                  <td className="td text-right font-semibold text-emerald-700">{moeda(p.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function FinanceiroPage() {
  const { clinica } = useClinica()
  const [tab, setTab] = useState('receber')
  const [resumo, setResumo] = useState(null)
  const [pagando, setPagando] = useState(null)
  const [reload, setReload] = useState(0)

  const carregarResumo = useCallback(async () => {
    const s = createClient()
    const mes = hoje().slice(0, 7)
    const [cr, cp, pg] = await Promise.all([
      s.from('contas_receber').select('valor_total, valor_pago, data_vencimento, status').eq('clinica_id', clinica.id).in('status', ['aberto', 'parcial']),
      s.from('contas_pagar').select('valor').eq('clinica_id', clinica.id).eq('status', 'aberto'),
      s.from('pagamentos').select('valor').eq('clinica_id', clinica.id).gte('data_pagamento', `${mes}-01T00:00:00`),
    ])
    const abertas = cr.data || []
    setResumo({
      receber: abertas.reduce((t, c) => t + saldo(c), 0),
      vencido: abertas.filter(vencida).reduce((t, c) => t + saldo(c), 0),
      recebidoMes: (pg.data || []).reduce((t, p) => t + Number(p.valor), 0),
      pagar: (cp.data || []).reduce((t, c) => t + Number(c.valor || 0), 0),
    })
  }, [clinica.id])

  useEffect(() => { carregarResumo() }, [carregarResumo, reload])
  const atualizar = () => setReload((n) => n + 1)

  const marcarPaga = async (c, recarregar) => {
    await createClient().from('contas_pagar').update({ status: 'pago' }).eq('id', c.id)
    recarregar()
    atualizar()
  }

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Contas a receber, pagamentos e despesas da clínica." />

      {!resumo ? <Spinner /> : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="A receber" value={moeda(resumo.receber)} icon={Wallet} />
          <StatCard label="Vencido" value={moeda(resumo.vencido)} icon={AlertTriangle} tone={resumo.vencido ? 'red' : 'green'} />
          <StatCard label="Recebido no mês" value={moeda(resumo.recebidoMes)} icon={TrendingUp} tone="green" />
          <StatCard label="A pagar" value={moeda(resumo.pagar)} icon={ArrowDownCircle} tone="yellow" />
        </div>
      )}

      <Tabs tabs={[{ id: 'receber', label: 'Contas a receber' }, { id: 'recebimentos', label: 'Recebimentos' }, { id: 'pagar', label: 'Contas a pagar' }]} active={tab} onChange={setTab} />

      {tab === 'receber' && (
        <CrudPage embedded table="contas_receber" singular="conta a receber" select="*, pacientes(nome)" fields={CAMPOS_RECEBER} columns={COLS_RECEBER}
          order={ORDEM_VENC} searchFields={['descricao']} afterSave={atualizar} reloadKey={reload}
          rowActions={(c) => ['aberto', 'parcial'].includes(c.status) && (
            <button onClick={() => setPagando(c)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"><HandCoins className="h-3.5 w-3.5" /> Receber</button>
          )} />
      )}
      {tab === 'recebimentos' && <Recebimentos reloadKey={reload} />}
      {tab === 'pagar' && (
        <CrudPage embedded table="contas_pagar" singular="conta a pagar" fields={CAMPOS_PAGAR} columns={COLS_PAGAR}
          order={ORDEM_VENC} searchFields={['fornecedor', 'descricao']} afterSave={atualizar}
          rowActions={(c, recarregar) => c.status === 'aberto' && (
            <button onClick={() => marcarPaga(c, recarregar)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-3.5 w-3.5" /> Pagar</button>
          )} />
      )}

      <Modal open={!!pagando} title="Registrar pagamento" onClose={() => setPagando(null)} size="md">
        {pagando && <RegistrarPagamento conta={pagando} onClose={() => setPagando(null)} onDone={() => { setPagando(null); atualizar() }} />}
      </Modal>
    </div>
  )
}
