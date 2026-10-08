'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login') } else { setUser(user) }
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }
  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow"><div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center"><h1 className="text-2xl font-bold text-indigo-600">OrthoFácil</h1><button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Sair</button></div></header>
      <main className="max-w-7xl mx-auto px-4 py-8"><h2 className="text-3xl font-bold mb-8">Bem-vindo!</h2></main>
    </div>
  )
}
