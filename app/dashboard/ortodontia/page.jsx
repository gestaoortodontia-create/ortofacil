'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import CrudPage from '@/components/CrudPage'
import { Modal } from '@/components/ui'
import { agoraLocal, data, dataHora } from '@/lib/format'

const APARELHOS = ['Fixo metálico', 'Fixo estético (cerâmico/safira)', 'Autoligado', 'Alinhadores invisíveis', 'Móvel', 'Ortopédico funcional', 'Contenção']

const CAMPOS_PLANO = [
  { name: 'paciente_id', label: 'Paciente', type: 'select', required: true, source: { table: 'pacientes' }, full: true },
  { name: 'aparelho', label: 'Aparelho', type: 'select', required: true, options: APARELHOS },
  { name: 'profissional_id', label: 'Ortodontista', type: 'select', source: { table: 'profissionais' } },
  { name: 'data_inicio', label: 'Início do tratamento', type: 'date', required: true },
  { name: 'duracao_prevista_meses', label: 'Duração prevista (meses)', type: 'number', min: 1 },
  { name: 'data_prevista_conclusao', label: 'Previsão de conclusão', type: 'date', help: 'Em branco: calculada pela duração.' },
  { name: 'notas', label: 'Diagnóstico / planejamento', type: 'textarea', rows: 4 },
]

const COLUNAS_PLANO = [
  { key: 'paciente', label: 'Paciente', render: (r) => <Link href={`/dashboard/pacientes/${r.paciente_id}`} className="font-medium text-slate-900 hover:text-brand-600">{r.pacientes?.nome}</Link> },
  { key: 'aparelho', label: 'Aparelho' },
  { key: 'inicio', label: 'Início', render: (r) => data(r.data_inicio) },
  { key: 'previsao', label: 'Previsão', render: (r) => data(r.data_prevista_conclusao) },
  { key: 'prof', label: 'Ortodontista', render: (r) => r.profissionais?.nome || '—' },
]

const TIPOS_MANUTENCAO = ['Ativação', 'Troca de arco', 'Troca de elástico', 'Colagem', 'Recolagem de bráquete', 'Remoção do aparelho', 'Instalação de contenção', 'Avaliação']

const CAMPOS_MANUTENCAO = [
  { name: 'data', label: 'Data e hora', type: 'datetime-local', required: true },
  { name: 'tipo', label: 'Procedimento', type: 'select', required: true, options: TIPOS_MANUTENCAO },
  { name: 'arco_material', label: 'Arco — material', type: 'select', options: ['NiTi', 'NiTi termoativado', 'Aço', 'TMA', 'CuNiTi'] },
  { name: 'arco_espessura', label: 'Arco — espessura', placeholder: 'Ex.: 0.014, 0.017x0.025' },
  { name: 'elasticos_tipo', label: 'Elásticos — tipo', placeholder: 'Ex.: Classe II, intermaxilar' },
  { name: 'elasticos_forca', label: 'Elásticos — força', placeholder: 'Ex.: 3/16 médio' },
  { name: 'profissional_id', label: 'Profissional', type: 'select', source: { table: 'profissionais' } },
  { name: 'notas', label: 'Observações', type: 'textarea' },
]

const COLUNAS_MANUTENCAO = [
  { key: 'data', label: 'Data', render: (r) => dataHora(r.data) },
  { key: 'tipo', label: 'Procedimento', render: (r) => <span className="font-medium text-slate-900">{r.tipo}</span> },
  { key: 'arco', label: 'Arco', render: (r) => [r.arco_material, r.arco_espessura].filter(Boolean).join(' ') || '—' },
  { key: 'elasticos', label: 'Elásticos', render: (r) => [r.elasticos_tipo, r.elasticos_forca].filter(Boolean).join(' · ') || '—' },
]

const ORDEM_PLANO = { column: 'data_inicio', ascending: false }
const ORDEM_MANUT = { column: 'data', ascending: false }

const calcularPrevisao = (p) => {
  if (!p.data_prevista_conclusao && p.data_inicio && p.duracao_prevista_meses) {
    const [y, m, d] = p.data_inicio.split('-').map(Number)
    const dt = new Date(y, m - 1 + p.duracao_prevista_meses, d)
    p.data_prevista_conclusao = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  }
  return p
}

function Manutencoes({ plano }) {
  const porPlano = useCallback((q) => q.eq('plano_orto_id', plano.id), [plano.id])
  const comPlano = useCallback((p) => ({ ...p, plano_orto_id: plano.id }), [plano.id])
  const [campos] = useState(() => CAMPOS_MANUTENCAO.map((f) => (f.name === 'data' ? { ...f, default: agoraLocal().slice(0, 16) } : f)))
  return (
    <CrudPage embedded table="manutencoes_orto" singular="manutenção" feminino fields={campos} columns={COLUNAS_MANUTENCAO}
      order={ORDEM_MANUT} query={porPlano} beforeSave={comPlano} />
  )
}

export default function OrtodontiaPage() {
  const [plano, setPlano] = useState(null)
  return (
    <>
      <CrudPage
        table="planos_ortodonticos"
        title="Ortodontia"
        subtitle="Planos de tratamento ortodôntico e histórico de manutenções."
        singular="plano"
        select="*, pacientes(nome), profissionais(nome)"
        fields={CAMPOS_PLANO}
        columns={COLUNAS_PLANO}
        order={ORDEM_PLANO}
        beforeSave={calcularPrevisao}
        emptyText="Crie um plano para registrar as manutenções mensais do paciente."
        rowActions={(r) => (
          <button onClick={() => setPlano(r)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50">
            <Wrench className="h-3.5 w-3.5" /> Manutenções
          </button>
        )}
      />
      <Modal open={!!plano} title={plano ? `Manutenções · ${plano.pacientes?.nome} (${plano.aparelho})` : ''} onClose={() => setPlano(null)} size="xl">
        {plano && <Manutencoes plano={plano} />}
      </Modal>
    </>
  )
}
