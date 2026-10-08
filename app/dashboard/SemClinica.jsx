'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

export default function SemClinica({ email }) {
  const router = useRouter()
  const sair = async () => {
    await createClient().auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="text-lg font-semibold text-slate-900">Conta sem clínica vinculada</h1>
        <p className="mt-2 text-sm text-slate-600">
          O usuário <strong>{email}</strong> não está vinculado a nenhuma clínica. Se o banco de dados acabou de ser
          configurado, execute o script <code className="rounded bg-slate-100 px-1">002_correcoes_rls.sql</code> no Supabase e entre novamente.
        </p>
        <button onClick={sair} className="btn-primary mt-6">Sair</button>
      </div>
    </div>
  )
}
