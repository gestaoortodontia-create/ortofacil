'use client'

import { Suspense, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import CrudPage from '@/components/CrudPage'
import RecordForm from '@/components/RecordForm'
import { Alert, Badge, Field, PageHeader, Spinner, Tabs } from '@/components/ui'
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
  { name: 'cro', label: 'CRO', placeholder: 'Ex.: SP 12345' },
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

function MinhaConta() {
  const { perfil, email } = useClinica()
  const router = useRouter()
  const [nome, setNome] = useState(perfil.nome || '')
  const [senha, setSenha] = useState({ nova: '', confirmar: '' })
  const [msg, setMsg] = useState({ type: 'success', text: '' })
  const [salvando, setSalvando] = useState('')

  const salvarNome = async (e) => {
    e.preventDefault()
    setSalvando('nome')
    const { error } = await createClient().from('perfis').update({ nome: nome.trim() }).eq('id', perfil.id)
    setSalvando('')
    setMsg(error ? { type: 'error', text: traduzErro(error) } : { type: 'success', text: 'Nome atualizado.' })
    if (!error) router.refresh()
  }

  const trocarSenha = async (e) => {
    e.preventDefault()
    if (senha.nova.length < 8) return setMsg({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres.' })
    if (senha.nova !== senha.confirmar) return setMsg({ type: 'error', text: 'As senhas não coincidem.' })
    setSalvando('senha')
    const { error } = await createClient().auth.updateUser({ password: senha.nova })
    setSalvando('')
    setMsg(error ? { type: 'error', text: traduzErro(error) } : { type: 'success', text: 'Senha alterada.' })
    if (!error) setSenha({ nova: '', confirmar: '' })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
        <span>Este login é independente: tudo o que você cadastra (pacientes, agenda, financeiro, contratos, fotos) é visível <strong>somente</strong> com este e-mail e senha. Nenhum outro usuário do sistema tem acesso.</span>
      </div>
      {msg.text && <Alert type={msg.type}>{msg.text}</Alert>}
      <form onSubmit={salvarNome} className="card space-y-4 p-6">
        <h3 className="font-semibold text-slate-900">Dados de acesso</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail de login"><input className="input" value={email} disabled /></Field>
          <Field label="Seu nome"><input className="input" value={nome} onChange={(e) => setNome(e.target.value)} required /></Field>
        </div>
        <div className="flex justify-end"><button type="submit" disabled={salvando === 'nome'} className="btn-primary">{salvando === 'nome' ? 'Salvando...' : 'Salvar nome'}</button></div>
      </form>
      <form onSubmit={trocarSenha} className="card space-y-4 p-6">
        <h3 className="font-semibold text-slate-900">Alterar senha</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nova senha"><input type="password" autoComplete="new-password" className="input" value={senha.nova} onChange={(e) => setSenha({ ...senha, nova: e.target.value })} placeholder="Mín. 8 caracteres" /></Field>
          <Field label="Confirmar nova senha"><input type="password" autoComplete="new-password" className="input" value={senha.confirmar} onChange={(e) => setSenha({ ...senha, confirmar: e.target.value })} /></Field>
        </div>
        <div className="flex justify-end"><button type="submit" disabled={salvando === 'senha'} className="btn-primary">{salvando === 'senha' ? 'Alterando...' : 'Alterar senha'}</button></div>
      </form>
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
      <PageHeader title="Configurações" subtitle="Dados da clínica, profissionais, tabela de procedimentos e sua conta." />
      <Tabs
        tabs={[{ id: 'clinica', label: 'Clínica' }, { id: 'profissionais', label: 'Profissionais' }, { id: 'procedimentos', label: 'Procedimentos' }, { id: 'conta', label: 'Minha conta' }]}
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
      {tab === 'conta' && <MinhaConta />}
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
