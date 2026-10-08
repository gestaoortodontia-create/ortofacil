import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { MODELO_GERAL, MODELO_ORTODONTIA } from '@/lib/contratos-padrao'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const erro = (mensagem, status = 400) => NextResponse.json({ error: mensagem }, { status })

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return erro('Requisição inválida.')
  }

  const nomeClinica = String(body.nome_clinica || '').trim()
  const nome = String(body.nome || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (nomeClinica.length < 2) return erro('Informe o nome da clínica.')
  if (nome.length < 2) return erro('Informe seu nome.')
  if (!EMAIL_RE.test(email)) return erro('Informe um e-mail válido.')
  if (password.length < 8) return erro('A senha deve ter pelo menos 8 caracteres.')

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    console.error(e)
    return erro('Servidor sem configuração do Supabase. Contate o suporte.', 500)
  }

  const { data: created, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome },
  })
  if (userError) {
    const jaExiste = /already|registered|exists/i.test(userError.message)
    return erro(jaExiste ? 'Este e-mail já está cadastrado. Faça login.' : `Não foi possível criar a conta: ${userError.message}`)
  }
  const userId = created.user.id

  const desfazer = async (clinicaId) => {
    if (clinicaId) await admin.from('clinicas').delete().eq('id', clinicaId)
    await admin.auth.admin.deleteUser(userId)
  }

  const { data: clinica, error: clinicaError } = await admin
    .from('clinicas')
    .insert({ nome: nomeClinica, email })
    .select('id')
    .single()
  if (clinicaError) {
    console.error('cadastro/clinica', clinicaError)
    await desfazer()
    return erro('Não foi possível criar a clínica. Tente novamente.', 500)
  }

  const { error: perfilError } = await admin
    .from('perfis')
    .insert({ clinica_id: clinica.id, user_id: userId, nome, papel: 'admin' })
  if (perfilError) {
    console.error('cadastro/perfil', perfilError)
    await desfazer(clinica.id)
    return erro('Não foi possível criar o perfil. Tente novamente.', 500)
  }

  const { error: modelosError } = await admin
    .from('modelos_contrato')
    .insert([MODELO_GERAL, MODELO_ORTODONTIA].map((m) => ({ ...m, clinica_id: clinica.id })))
  if (modelosError) console.error('cadastro/modelos', modelosError)

  return NextResponse.json({ ok: true })
}
