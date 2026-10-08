import { redirect } from 'next/navigation'
import { createClient, createAdminClientServer } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  async function handleSignup(formData) {
    'use server'
    const nome_clinica = formData.get('nome_clinica')
    const email = formData.get('email')
    const password = formData.get('password')
    const password_confirm = formData.get('password_confirm')

    if (password !== password_confirm) {
      return { error: 'Senhas não coincidem' }
    }

    const supabase = await createClient()
    const admin = createAdminClientServer()

    // Criar conta de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUpWithPassword({
      email,
      password,
    })

    if (authError) {
      return { error: authError.message }
    }

    // Criar clínica com SERVICE_ROLE
    const { data: clinica, error: clinicaError } = await admin
      .from('clinicas')
      .insert([{ nome: nome_clinica }])
      .select()
      .single()

    if (clinicaError) {
      return { error: 'Erro ao criar clínica: ' + clinicaError.message }
    }

    // Criar perfil de admin com SERVICE_ROLE
    const { error: perfilError } = await admin
      .from('perfis')
      .insert([{
        clinica_id: clinica.id,
        user_id: authData.user.id,
        nome: email.split('@')[0],
        email,
        role: 'admin'
      }])

    if (perfilError) {
      return { error: 'Erro ao criar perfil: ' + perfilError.message }
    }

    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">OrthoFácil</h1>
          <p className="text-gray-600 mt-2">Criar nova conta</p>
        </div>

        <form action={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Clínica</label>
            <input
              type="text"
              name="nome_clinica"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Clínica Odonto Plus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              name="password_confirm"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
