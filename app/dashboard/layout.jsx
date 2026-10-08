'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [clinica, setClinica] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Carregar clínica do usuário
      const { data: perfil } = await supabase
        .from('perfis')
        .select('clinica_id, role')
        .eq('user_id', user.id)
        .single()

      if (perfil) {
        const { data: clinicaData } = await supabase
          .from('clinicas')
          .select('*')
          .eq('id', perfil.clinica_id)
          .single()

        setClinica(clinicaData)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Pacientes', href: '/dashboard/pacientes', icon: '👥' },
    { name: 'Agenda', href: '/dashboard/agenda', icon: '📅' },
    { name: 'Prontuário', href: '/dashboard/prontuario', icon: '📋' },
    { name: 'Ortodontia', href: '/dashboard/ortodontia', icon: '🦷' },
    { name: 'Orçamentos', href: '/dashboard/orcamentos', icon: '💰' },
    { name: 'Contratos', href: '/dashboard/contratos', icon: '📄' },
    { name: 'Financeiro', href: '/dashboard/financeiro', icon: '💳' },
    { name: 'Estoque', href: '/dashboard/estoque', icon: '📦' },
    { name: 'Relatórios', href: '/dashboard/relatorios', icon: '📈' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-800">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs text-center'}`}>
            {sidebarOpen ? 'OrthoFácil' : 'OF'}
          </h1>
          {sidebarOpen && <p className="text-xs text-gray-400 mt-1">{clinica?.nome}</p>}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              title={!sidebarOpen ? item.name : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '<<' : '>>'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm mt-2"
          >
            {sidebarOpen ? 'Sair' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
