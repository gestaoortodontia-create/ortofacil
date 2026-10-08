'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgendamentos()
  }, [])

  const loadAgendamentos = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('perfis')
      .select('clinica_id')
      .eq('user_id', user.id)
      .single()

    const { data } = await supabase
      .from('agendamentos')
      .select(`
        *,
        pacientes(nome),
        profissionais(nome)
      `)
      .eq('clinica_id', perfil.clinica_id)
      .order('data_hora', { ascending: true })

    setAgendamentos(data || [])
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Agenda</h1>

      {loading ? (
        <div>Carregando agendamentos...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {agendamentos.slice(0, 9).map((a) => (
              <div key={a.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <p className="font-medium text-lg">{a.pacientes?.nome}</p>
                <p className="text-gray-600 text-sm">Dr(a). {a.profissionais?.nome}</p>
                <p className="text-sm mt-2">{new Date(a.data_hora).toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-500 mt-2">Status: {a.status}</p>
              </div>
            ))}
          </div>
          {agendamentos.length === 0 && <div className="p-6 text-center text-gray-600">Nenhum agendamento</div>}
        </div>
      )}
    </div>
  )
}
