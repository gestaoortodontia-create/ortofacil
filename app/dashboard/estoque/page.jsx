'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import CrudPage from '@/components/CrudPage'
import { Alert, Badge, EmptyState, Field, Modal, PageHeader, Spinner, Tabs } from '@/components/ui'
import { agoraLocal, dataHora, moeda, traduzErro } from '@/lib/format'

const CATEGORIAS = ['Ortodontia', 'Dentística', 'Endodontia', 'Periodontia', 'Cirurgia', 'Prótese', 'Descartáveis', 'Biossegurança', 'Medicamentos', 'Outros']
const UNIDADES = ['unidade', 'caixa', 'pacote', 'kit', 'frasco', 'tubo', 'seringa', 'rolo', 'par']

const CAMPOS = [
  { name: 'nome', label: 'Material', required: true, full: true },
  { name: 'categoria', label: 'Categoria', type: 'select', options: CATEGORIAS },
  { name: 'unidade', label: 'Unidade', type: 'select', required: true, options: UNIDADES, default: 'unidade' },
  { name: 'quantidade_atual', label: 'Quantidade em estoque', type: 'number', min: 0, default: 0, help: 'Depois de cadastrado, prefira usar "Movimentar".' },
  { name: 'quantidade_minima', label: 'Estoque mínimo (alerta)', type: 'number', min: 0, default: 0 },
  { name: 'preco_unitario', label: 'Preço unitário (R$)', type: 'money', min: 0 },
]

const baixo = (m) => m.quantidade_atual <= m.quantidade_minima

const COLUNAS = [
  { key: 'nome', label: 'Material', render: (m) => <span className="font-medium text-slate-900">{m.nome}<span className="block text-xs font-normal text-slate-500">{m.categoria || 'Sem categoria'}</span></span> },
  { key: 'qtd', label: 'Em estoque', render: (m) => <span className={baixo(m) ? 'font-semibold text-red-600' : 'font-semibold text-slate-900'}>{m.quantidade_atual} {m.unidade}</span> },
  { key: 'min', label: 'Mínimo', render: (m) => m.quantidade_minima },
  { key: 'preco', label: 'Preço unit.', render: (m) => (m.preco_unitario != null ? moeda(m.preco_unitario) : '—') },
  { key: 'situacao', label: 'Situação', render: (m) => (baixo(m) ? <Badge color="red">Repor</Badge> : <Badge color="green">OK</Badge>) },
]

const ORDEM = { column: 'nome', ascending: true }

function Movimentar({ material, onClose, onDone }) {
  const { clinica } = useClinica()
  const [tipo, setTipo] = useState('saida')
  const [qtd, setQtd] = useState('1')
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const n = Number(qtd)
  const novo = tipo === 'entrada' ? material.quantidade_atual + n : tipo === 'saida' ? material.quantidade_atual - n : n

  const salvar = async (e) => {
    e.preventDefault()
    if (!Number.isInteger(n) || n < 0 || (tipo !== 'ajuste' && n === 0)) return setErro('Informe uma quantidade válida.')
    if (novo < 0) return setErro('A saída é maior que o estoque disponível.')
    setSalvando(true)
    const s = createClient()
    const { error } = await s.from('movimentacoes_estoque').insert({
      clinica_id: clinica.id, material_id: material.id, tipo, quantidade: n, motivo: motivo || null, criado_em: agoraLocal(),
    })
    if (error) { setErro(traduzErro(error)); setSalvando(false); return }
    const { error: upErr } = await s.from('materiais').update({ quantidade_atual: novo, atualizado_em: agoraLocal() }).eq('id', material.id)
    if (upErr) { setErro(traduzErro(upErr)); setSalvando(false); return }
    onDone()
  }

  return (
    <form onSubmit={salvar} className="space-y-4">
      <p className="text-sm text-slate-600"><strong>{material.nome}</strong> — estoque atual: {material.quantidade_atual} {material.unidade}</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo">
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="saida">Saída (uso)</option>
            <option value="entrada">Entrada (compra)</option>
            <option value="ajuste">Ajuste (inventário)</option>
          </select>
        </Field>
        <Field label={tipo === 'ajuste' ? 'Nova quantidade' : 'Quantidade'}><input type="number" min="0" step="1" className="input" value={qtd} onChange={(e) => setQtd(e.target.value)} /></Field>
        <Field label="Motivo / referência" className="col-span-2"><input className="input" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: NF 1234, uso em atendimento..." /></Field>
      </div>
      <p className="text-sm text-slate-600">Estoque após a movimentação: <strong className={novo < 0 ? 'text-red-600' : ''}>{Number.isFinite(novo) ? novo : '—'} {material.unidade}</strong></p>
      <Alert>{erro}</Alert>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={salvando} className="btn-primary">{salvando ? 'Salvando...' : 'Confirmar'}</button>
      </div>
    </form>
  )
}

function Historico() {
  const { clinica } = useClinica()
  const [lista, setLista] = useState(null)
  useEffect(() => {
    createClient().from('movimentacoes_estoque').select('*, materiais(nome, unidade)').eq('clinica_id', clinica.id)
      .order('criado_em', { ascending: false }).limit(200).then(({ data }) => setLista(data || []))
  }, [clinica.id])
  const rotulo = { entrada: ['Entrada', 'green'], saida: ['Saída', 'yellow'], ajuste: ['Ajuste', 'blue'] }
  return (
    <div className="card overflow-hidden">
      {lista === null ? <Spinner /> : lista.length === 0 ? <EmptyState title="Nenhuma movimentação registrada" /> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50"><tr><th className="th">Data</th><th className="th">Material</th><th className="th">Tipo</th><th className="th">Quantidade</th><th className="th">Motivo</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((m) => (
                <tr key={m.id}>
                  <td className="td">{dataHora(m.criado_em)}</td>
                  <td className="td font-medium text-slate-900">{m.materiais?.nome}</td>
                  <td className="td"><Badge color={rotulo[m.tipo]?.[1]}>{rotulo[m.tipo]?.[0] || m.tipo}</Badge></td>
                  <td className="td">{m.quantidade} {m.materiais?.unidade}</td>
                  <td className="td">{m.motivo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function EstoquePage() {
  const [tab, setTab] = useState('materiais')
  const [mov, setMov] = useState(null)
  const [reload, setReload] = useState(0)

  return (
    <div>
      <PageHeader title="Estoque" subtitle="Materiais, níveis mínimos e movimentações." />
      <Tabs tabs={[{ id: 'materiais', label: 'Materiais' }, { id: 'historico', label: 'Movimentações' }]} active={tab} onChange={setTab} />
      {tab === 'materiais' ? (
        <CrudPage embedded table="materiais" singular="material" fields={CAMPOS} columns={COLUNAS} order={ORDEM}
          searchFields={['nome', 'categoria']} reloadKey={reload}
          rowActions={(m) => (
            <button onClick={() => setMov(m)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"><ArrowLeftRight className="h-3.5 w-3.5" /> Movimentar</button>
          )} />
      ) : <Historico />}
      <Modal open={!!mov} title="Movimentar estoque" onClose={() => setMov(null)} size="md">
        {mov && <Movimentar material={mov} onClose={() => setMov(null)} onDone={() => { setMov(null); setReload((n) => n + 1) }} />}
      </Modal>
    </div>
  )
}
