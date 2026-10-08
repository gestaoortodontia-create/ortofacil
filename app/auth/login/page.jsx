'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Alert, Field } from '@/components/ui'
import AuthShell from '../AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const entrar = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(/invalid/i.test(error.message) ? 'E-mail ou senha incorretos.' : error.message)
      setLoading(false)
      return
    }
    router.replace('/dashboard')
    router.refresh()
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse o painel da sua clínica."
      footer={<>Ainda não tem conta? <Link href="/auth/signup" className="font-semibold text-brand-600 hover:underline">Cadastre sua clínica</Link></>}
    >
      <form onSubmit={entrar} className="space-y-4">
        <Field label="E-mail">
          <input type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@clinica.com.br" />
        </Field>
        <Field label="Senha">
          <input type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Alert>{error}</Alert>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </AuthShell>
  )
}
