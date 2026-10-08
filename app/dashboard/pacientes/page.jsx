'use client'

import Link from 'next/link'
import { FolderOpen } from 'lucide-react'
import CrudPage from '@/components/CrudPage'
import { agoraLocal, data, idade } from '@/lib/format'
import { CAMPOS_PACIENTE } from './campos'

const COLUNAS = [
  {
    key: 'nome',
    label: 'Paciente',
    render: (p) => (
      <Link href={`/dashboard/pacientes/${p.id}`} className="font-medium text-slate-900 hover:text-brand-600">
        {p.nome}
        {p.data_nascimento && <span className="block text-xs font-normal text-slate-500">{idade(p.data_nascimento)} anos · {data(p.data_nascimento)}</span>}
      </Link>
    ),
  },
  { key: 'cpf', label: 'CPF' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'nome_convenio', label: 'Convênio', render: (p) => (p.conveniado ? p.nome_convenio || 'Sim' : 'Particular') },
]

const ORDEM = { column: 'nome', ascending: true }

const beforeSave = (p, anterior) => {
  if (p.consentimento_lgpd && !anterior?.consentimento_lgpd) p.data_consentimento = agoraLocal()
  if (!p.consentimento_lgpd) p.data_consentimento = null
  return p
}

export default function PacientesPage() {
  return (
    <CrudPage
      table="pacientes"
      title="Pacientes"
      subtitle="Cadastro completo dos pacientes da clínica."
      singular="paciente"
      fields={CAMPOS_PACIENTE}
      columns={COLUNAS}
      order={ORDEM}
      searchFields={['nome', 'cpf', 'telefone', 'email']}
      beforeSave={beforeSave}
      emptyText="Cadastre o primeiro paciente para começar a usar a agenda e o prontuário."
      rowActions={(p) => (
        <Link href={`/dashboard/pacientes/${p.id}`} className="rounded-md p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700" title="Abrir prontuário">
          <FolderOpen className="h-4 w-4" />
        </Link>
      )}
    />
  )
}
