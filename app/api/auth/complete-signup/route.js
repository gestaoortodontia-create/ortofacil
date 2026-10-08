import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { nome_clinica, email, password } = await request.json()

    if (!nome_clinica || !email || !password) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Usar SERVICE_ROLE para criar tudo no servidor
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 1. Criar usuário
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.error('Auth error:', authError)
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
      console.error('Clinic error:', clinicaError)
      return NextResponse.json(
        { error: 'Erro ao criar clínica: ' + clinicaError.message },
        { status: 400 }
      )
    }

    // 3. Criar perfil
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
      console.error('Profile error:', perfilError)
      return NextResponse.json(
        { error: 'Erro ao criar perfil: ' + perfilError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user_id: authData.user.id,
      clinica_id: clinicaData.id
    })

  } catch (err) {
    console.error('Complete signup error:', err)
    return NextResponse.json(
      { error: 'Erro no servidor: ' + (err?.message || String(err)) },
      { status: 500 }
    )
  }
}
