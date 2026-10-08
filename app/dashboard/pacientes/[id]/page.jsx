'use client'

import { use, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Phone, Mail, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { Badge, EmptyState, Modal, Spinner, Tabs } from '@/components/ui'
import RecordForm from '@/components/RecordForm'
import CrudPage from '@/components/CrudPage'
import { agoraLocal, data, dataHora, idade, traduzErro } from '@/lib/format'
import { CAMPOS_PACIENTE } from '../campos'
import Anamnese from './Anamnese'
import Odontograma from './Odontograma'
import Fotos from './Fotos'

const TABS = [
  { id: 'dados', label: 'Dados' },
  { id: 'anamnese', label: 'Anamnese' },
  { id: 'evolucoes', label: 'Evoluções' },
  { id: 'prescricoes', label: 'Prescrições' },
  { id: 'odontograma', label: 'Odontograma' },
  { id: 'fotos', label: 'Fotos' },
]

const CAMPOS_EVOLUCAO = [
  { name: 'data', label: 'Data e hora', type: 'datetime-local', required: true },
  { name: 'profissional_id', label: 'Profissional', type: 'select', source: { table: 'profissionais' } },
  { name: 'titulo', label: 'Procedimento / título', required: true, full: true },
  { name: 'descricao', label: 'Descrição', type: 'textarea', rows: 5 },
]

const CAMPOS_PRESCRICAO = [
  { name: 'data', label: 'Data', type: 'datetime-local', required: true },
  { name: 'profissional_id', label: 'Profissional', type: 'select', source: { table: 'profissionais' } },
  { name: 'medicamento', label: 'Medicamento', required: true, full: true },
  { name: 'dose', label: 'Dose', placeholder: 'Ex.: 500 mg' },
  { name: 'frequencia', label: 'Frequência', placeholder: 'Ex.: de 8 em 8 horas' },
  { name: 'duracao', label: 'Duração', placeholder: 'Ex.: 7 dias' },
]

const COLS_EVOLUCAO = [
  { key: 'data', label: 'Data', render: (r) => dataHora(r.data) },
  { key: 'titulo', label: 'Procedimento', render: (r) => <span className="font-medium text-slate-900">{r.titulo}<span className="block max-w-md whitespace-pre-wrap text-xs font-normal text-slate-500">{r.descricao}</span></span> },
  { key: 'prof', label: 'Profissional', render: (r) => r.profissionais?.nome || '—' },
]

const COLS_PRESCRICAO = [
  { key: 'data', label: 'Data', render: (r) => dataHora(r.data) },
  { key: 'medicamento', label: 'Medicamento', render: (r) => <span className="font-medium text-slate-900">{r.medicamento}</span> },
  { key: 'posologia', label: 'Posologia', render: (r) => [r.dose, r.frequencia, r.duracao].filter(Boolean).join(' · ') || '—' },
  { key: 'prof', label: 'Profissional', render: (r) => r.profissionais?.nome || '—' },
]

const ORDEM_DATA = { column: 'data', ascending: false }

function Info({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{children || '—'}</dd>
    </div>
  )
}

export default function PacientePage({ params }) {
  const { id } = use(params)
  const { clinica } = useClinica()
  const [paciente, setPaciente] = useState(null)
  const [alergias, setAlergias] = useState('')
  const [erro, setErro] = useState('')
  const [tab, setTab] = useState('dados')
  const [editando, setEditando] = useState(false)

  const carregar = useCallback(async () => {
    const supabase = createClient()
    const [{ data: p, error }, { data: an }] = await Promise.all([
      supabase.from('pacientes').select('*').eq('id', id).maybeSingle(),
      supabase.from('anamneses').select('alergias').eq('paciente_id', id).order('criado_em', { ascending: false }).limit(1).maybeSingle(),
    ])
    if (error || !p) setErro(error ? traduzErro(error) : 'Paciente não encontrado.')
    setPaciente(p)
    setAlergias(an?.alergias || '')
  }, [id])

  useEffect(() => { carregar() }, [carregar])

  const porPaciente = useCallback((q) => q.eq('paciente_id', id), [id])
  const comPaciente = useCallback((p) => ({ ...p, paciente_id: id }), [id])
  const camposEvolucao = useMemo(() => CAMPOS_EVOLUCAO.map((f) => (f.name === 'data' ? { ...f, default: agoraLocal() } : f)), [])
  const camposPrescricao = useMemo(() => CAMPOS_PRESCRICAO.map((f) => (f.name === 'data' ? { ...f, default: agoraLocal() } : f)), [])

  const salvar = async (payload) => {
    const { error } = await createClient().from('pacientes').update(payload).eq('id', id)
    if (error) throw new Error(traduzErro(error))
    setEditando(false)
    carregar()
  }

  if (erro) return <EmptyState title={erro}><Link href="/dashboard/pacientes" className="btn-secondary">Voltar</Link></EmptyState>
  if (!paciente) return <Spinner />

  const anos = idade(paciente.data_nascimento)

  return (
    <div>
      <Link href="/dashboard/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Pacientes
      </Link>

      <div className="card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {paciente.nome.trim()[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{paciente.nome}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              {anos !== null && <span>{anos} anos</span>}
              {paciente.telefone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{paciente.telefone}</span>}
              {paciente.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{paciente.email}</span>}
              {paciente.conveniado ? <Badge color="blue">{paciente.nome_convenio || 'Convênio'}</Badge> : <Badge>Particular</Badge>}
            </div>
          </div>
        </div>
        <button onClick={() => setEditando(true)} className="btn-secondary"><Pencil className="h-4 w-4" /> Editar cadastro</button>
      </div>

      {alergias && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Alergias:</strong> {alergias}</span>
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'dados' && (
        <div className="card p-6">
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="CPF">{paciente.cpf}</Info>
            <Info label="RG">{paciente.rg}</Info>
            <Info label="Nascimento">{paciente.data_nascimento && data(paciente.data_nascimento)}</Info>
            <Info label="Sexo">{paciente.sexo}</Info>
            <Info label="Telefone">{paciente.telefone}</Info>
            <Info label="E-mail">{paciente.email}</Info>
            <Info label="Endereço">{paciente.endereco}</Info>
            <Info label="Responsável">{paciente.responsavel_nome && `${paciente.responsavel_nome}${paciente.responsavel_telefone ? ` · ${paciente.responsavel_telefone}` : ''}`}</Info>
            <Info label="Convênio">{paciente.conveniado ? `${paciente.nome_convenio || ''} ${paciente.numero_convenio ? `nº ${paciente.numero_convenio}` : ''}` : 'Particular'}</Info>
            <Info label="LGPD">{paciente.consentimento_lgpd ? `Consentiu em ${dataHora(paciente.data_consentimento)}` : <span className="text-amber-600">Consentimento não registrado</span>}</Info>
            <div className="sm:col-span-2 lg:col-span-3"><Info label="Observações"><span className="whitespace-pre-wrap">{paciente.notas}</span></Info></div>
          </dl>
        </div>
      )}

      {tab === 'anamnese' && <Anamnese pacienteId={id} onSaved={carregar} />}

      {tab === 'evolucoes' && (
        <CrudPage embedded table="evolucoes" singular="registro de evolução" select="*, profissionais(nome)"
          fields={camposEvolucao}
          columns={COLS_EVOLUCAO} order={ORDEM_DATA} query={porPaciente} beforeSave={comPaciente} searchFields={['titulo', 'descricao']} />
      )}

      {tab === 'prescricoes' && (
        <CrudPage embedded table="prescricoes" singular="prescrição" feminino select="*, profissionais(nome)"
          fields={camposPrescricao}
          columns={COLS_PRESCRICAO} order={ORDEM_DATA} query={porPaciente} beforeSave={comPaciente} searchFields={['medicamento']} />
      )}

      {tab === 'odontograma' && <Odontograma pacienteId={id} clinicaId={clinica.id} />}

      {tab === 'fotos' && <Fotos pacienteId={id} clinicaId={clinica.id} />}

      <Modal open={editando} title="Editar paciente" onClose={() => setEditando(false)}>
        {editando && <RecordForm fields={CAMPOS_PACIENTE} initial={paciente} onSubmit={salvar} onCancel={() => setEditando(false)} />}
      </Modal>
    </div>
  )
}
