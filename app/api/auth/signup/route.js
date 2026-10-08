import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { nome_clinica, email, password } = await request.json()

    if (!nome_clinica || !email || !password) {
      return NextResponse.json(
        { error: 'Nome da clínica, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Criar conta de autenticação
    const { data: authData, error: authError } = await admin.auth.signUpWithPassword({
      email,
      password
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Erro ao criar conta: ' + authError.message },
        { status: 400 }
      )
    }

    // 2. Criar clínica
    const { data: clinicaData, error: clinicaError } = await admin
      .from('clinicas')
      .insert([{ nome: nome_clinica }])
      .select()
      .single()

    if (clinicaError) {
      return NextResponse.json(
        { error: 'Erro ao criar clínica: ' + clinicaError.message },
        { status: 400 }
      )
    }

    // 3. Criar perfil de admin
    const { error: perfilError } = await admin
      .from('perfis')
      .insert([{
        clinica_id: clinicaData.id,
        user_id: authData.user.id,
        nome: email.split('@')[0],
        email,
        role: 'admin'
      }])

    if (perfilError) {
      return NextResponse.json(
        { error: 'Erro ao criar perfil: ' + perfilError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso'
    })

  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json(
      { error: 'Erro no servidor: ' + (err?.message || 'desconhecido') },
      { status: 500 }
    )
  }
}
