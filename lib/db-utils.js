export async function getClinicaId(supabase, userId) {
  const { data } = await supabase
    .from('perfis')
    .select('clinica_id')
    .eq('user_id', userId)
    .single()

  return data?.clinica_id
}

export async function createRecord(supabase, table, data, clinicaId) {
  const { error, data: result } = await supabase
    .from(table)
    .insert([{ ...data, clinica_id: clinicaId }])
    .select()
    .single()

  if (error) throw new Error(`Erro ao criar: ${error.message}`)
  return result
}

export async function updateRecord(supabase, table, id, data) {
  const { error, data: result } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Erro ao atualizar: ${error.message}`)
  return result
}

export async function deleteRecord(supabase, table, id) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Erro ao deletar: ${error.message}`)
  return true
}

export async function getRecords(supabase, table, clinicaId, options = {}) {
  let query = supabase
    .from(table)
    .select(options.select || '*', { count: 'exact' })
    .eq('clinica_id', clinicaId)

  if (options.where) {
    Object.entries(options.where).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  if (options.order) {
    query = query.order(options.order.field, { ascending: options.order.asc !== false })
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`Erro ao buscar: ${error.message}`)
  return { data, count }
}

export async function getRecord(supabase, table, id, clinicaId) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .eq('clinica_id', clinicaId)
    .single()

  if (error) throw new Error(`Registro não encontrado`)
  return data
}
