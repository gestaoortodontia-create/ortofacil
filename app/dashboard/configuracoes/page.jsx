'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import CrudPage from '@/components/CrudPage'
import RecordForm from '@/components/RecordForm'
import { Alert, Badge, PageHeader, Spinner, Tabs } from '@/components/ui'
import { PAPEIS, statusInfo } from '@/lib/opcoes'
import { agoraLocal, moeda, traduzErro } from '@/lib/format'

const CAMPOS_CLINICA = [
  { name: 'nome', label: 'Nome da clínica', required: true, full: true },
  { name: 'cnpj', label: 'CNPJ' },
  { name: 'telefone', label: 'Telefone', type: 'tel' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'endereco', label: 'Endereço completo', full: true, help: 'Usado nos contratos.' },
]

const CAMPOS_PROFISSIONAL = [
  { name: 'nome', label: 'Nome', required: true, full: true },
  { name: 'especialidade', label: 'Especialidade', type: 'select', options: ['Ortodontia', 'Clínica geral', 'Endodontia', 'Implantodontia', 'Periodontia', 'Prótese', 'Odontopediatria', 'Cirurgia', 'Estética', 'Harmonização orofacial'] },
  { name: 'cro', label: 'CRO', placeholder: 'Ex.: CRO-SP 12345' },
  { name: 'telefone', label: 'Telefone', type: 'tel' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'ativo', label: 'Situação', type: 'checkbox', checkboxLabel: 'Ativo (aparece na agenda)', default: true },
]
const COLS_PROFISSIONAL = [
  { key: 'nome', label: 'Nome', render: (p) => <span className="font-medium text-slate-900">{p.nome}</span> },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'cro', label: 'CRO' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'ativo', label: 'Situação', render: (p) => (p.ativo ? <Badge color="green">Ativo</Badge> : <Badge>Inativo</Badge>) },
]

const CAMPOS_PROCEDIMENTO = [
  { name: 'nome', label: 'Procedimento', required: true, full: true },
  { name: 'categoria', label: 'Categoria', type: 'select', options: ['Ortodontia', 'Clínica geral', 'Dentística', 'Endodontia', 'Periodontia', 'Cirurgia', 'Prótese', 'Implante', 'Estética', 'Prevenção', 'Radiologia'] },
  { name: 'preco_base', label: 'Preço (R$)', type: 'money', min: 0 },
  { name: 'descricao', label: 'Descrição', type: 'textarea' },
  { name: 'ativo', label: 'Situação', type: 'checkbox', checkboxLabel: 'Disponível para orçamentos', default: true },
]
const COLS_PROCEDIMENTO = [
  { key: 'nome', label: 'Procedimento', render: (p) => <span className="font-medium text-slate-900">{p.nome}</span> },
  { key: 'categoria', label: 'Categoria' },
  { key: 'preco_base', label: 'Preço', render: (p) => (p.preco_base != null ? moeda(p.preco_base) : '—') },
  { key: 'ativo', label: 'Situação', render: (p) => (p.ativo ? <Badge color="green">Ativo</Badge> : <Badge>Inativo</Badge>) },
]
const ORDEM_NOME = { column: 'nome', ascending: true }

function DadosClinica() {
  const { clinica } = useClinica()
  const router = useRouter()
  const [ok, setOk] = useState('')
  const salvar = async (payload) => {
    const { error } = await createClient().from('clinicas').update({ ...payload, atualizado_em: agoraLocal() }).eq('id', clinica.id)
    if (error) throw new Error(traduzErro(error))
    setOk('Dados da clínica atualizados.')
    router.refresh()
  }
  return (
    <div className="card max-w-3xl p-6">
      {ok && <div className="mb-4"><Alert type="success">{ok}</Alert></div>}
      <RecordForm fields={CAMPOS_CLINICA} initial={clinica} onSubmit={salvar} />
    </div>
  )
}

function Equipe() {
  const { clinica, userId } = useClinica()
  const [lista, setLista] = useState(null)
  useEffect(() => {
    createClient().from('perfis').select('id, nome, papel, user_id, criado_em').eq('clinica_id', clinica.id).order('criado_em')
      .then(({ data }) => setLista(data || []))
  }, [clinica.id])
  if (!lista) return <Spinner />
  return (
    <div className="card max-w-3xl overflow-hidden">
      <ul className="divide-y divide-slate-100">
        {lista.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm font-medium text-slate-900">{p.nome || 'Sem nome'}{p.user_id === userId && <span className="ml-2 text-xs text-slate-500">(você)</span>}</span>
            <Badge color="brand">{statusInfo(PAPEIS, p.papel).label}</Badge>
          </li>
        ))}
      </ul>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Cada usuário enxerga apenas os dados desta clínica.</p>
    </div>
  )
}

function Conteudo() {
  const params = useSearchParams()
  const router = useRouter()
  const tab = params.get('aba') || 'clinica'
  const setTab = (id) => router.replace(`/dashboard/configuracoes?aba=${id}`, { scroll: false })

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Dados da clínica, profissionais, tabela de procedimentos e equipe." />
      <Tabs
        tabs={[{ id: 'clinica', label: 'Clínica' }, { id: 'profissionais', label: 'Profissionais' }, { id: 'procedimentos', label: 'Procedimentos' }, { id: 'equipe', label: 'Equipe' }]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'clinica' && <DadosClinica />}
      {tab === 'profissionais' && (
        <CrudPage embedded table="profissionais" singular="profissional" fields={CAMPOS_PROFISSIONAL} columns={COLS_PROFISSIONAL} order={ORDEM_NOME} searchFields={['nome', 'cro', 'especialidade']} />
      )}
      {tab === 'procedimentos' && (
        <CrudPage embedded table="procedimentos" singular="procedimento" fields={CAMPOS_PROCEDIMENTO} columns={COLS_PROCEDIMENTO} order={ORDEM_NOME} searchFields={['nome', 'categoria']} />
      )}
      {tab === 'equipe' && <Equipe />}
    </div>
  )
}

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Conteudo />
    </Suspense>
  )
}
