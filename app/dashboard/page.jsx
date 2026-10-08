'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data: perfil } = await supabase
        .from('perfis')
        .select('clinica_id')
        .eq('user_id', user.id)
        .single()

      if (!perfil) return

      const [
        { count: pacientesCount },
        { count: agendamentosCount },
        { count: contasCount },
      ] = await Promise.all([
        supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .eq('clinica_id', perfil.clinica_id),
        supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('clinica_id', perfil.clinica_id)
          .eq('status', 'agendado'),
        supabase
          .from('contas_receber')
          .select('*', { count: 'exact', head: true })
          .eq('clinica_id', perfil.clinica_id)
          .eq('status', 'pendente'),
      ])

      setStats({
        pacientes: pacientesCount,
        agendamentos: agendamentosCount,
        contas: contasCount,
      })

      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Pacientes</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.pacientes || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Agendamentos</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.agendamentos || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Contas Pendentes</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats?.contas || 0}</p>
        </div>
      </div>
    </div>
  )
}
