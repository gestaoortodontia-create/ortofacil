'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field } from '@/components/ui'
import AuthShell from '../AuthShell'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nome_clinica: '', nome: '', email: '', password: '', confirmar: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const cadastrar = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('A senha deve ter pelo menos 8 caracteres.')
    if (form.password !== form.confirmar) return setError('As senhas não coincidem.')

    setLoading(true)
    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_clinica: form.nome_clinica, nome: form.nome, email: form.email, password: form.password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Não foi possível concluir o cadastro.')

      const { error } = await createClient().auth.signInWithPassword({ email: form.email.trim(), password: form.password })
      if (error) throw new Error('Conta criada, mas o login automático falhou. Entre pela tela de login.')

      router.replace('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Cadastre sua clínica"
      subtitle="Crie o acesso de administrador. Leva menos de um minuto."
      footer={<>Já tem conta? <Link href="/auth/login" className="font-semibold text-brand-600 hover:underline">Entrar</Link></>}
    >
      <form onSubmit={cadastrar} className="space-y-4">
        <Field label="Nome da clínica" required>
          <input required className="input" value={form.nome_clinica} onChange={set('nome_clinica')} placeholder="Clínica Sorriso" />
        </Field>
        <Field label="Seu nome" required>
          <input required autoComplete="name" className="input" value={form.nome} onChange={set('nome')} placeholder="Dra. Ana Souza" />
        </Field>
        <Field label="E-mail" required>
          <input type="email" required autoComplete="email" className="input" value={form.email} onChange={set('email')} placeholder="voce@clinica.com.br" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Senha" required>
            <input type="password" required minLength={8} autoComplete="new-password" className="input" value={form.password} onChange={set('password')} placeholder="Mín. 8 caracteres" />
          </Field>
          <Field label="Confirmar senha" required>
            <input type="password" required autoComplete="new-password" className="input" value={form.confirmar} onChange={set('confirmar')} />
          </Field>
        </div>
        <Alert>{error}</Alert>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">{loading ? 'Criando conta...' : 'Criar conta'}</button>
      </form>
    </AuthShell>
  )
}
