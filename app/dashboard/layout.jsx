import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClinicaProvider } from '@/components/ClinicaProvider'
import Sidebar from '@/components/Sidebar'
import SemClinica from './SemClinica'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, nome, papel, clinica_id, clinicas(id, nome, cnpj, telefone, email, endereco)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!perfil?.clinicas) return <SemClinica email={user.email} />

  const value = {
    userId: user.id,
    email: user.email,
    perfil: { id: perfil.id, nome: perfil.nome, papel: perfil.papel },
    clinica: perfil.clinicas,
  }

  return (
    <ClinicaProvider value={value}>
      <Sidebar />
      <main className="lg:pl-64 print:pl-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:max-w-none print:p-0">{children}</div>
      </main>
    </ClinicaProvider>
  )
}
