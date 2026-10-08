'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data: perfil } = await supabase
      .from('perfis')
      .select('clinica_id')
      .eq('user_id', user.id)
      .single()

    if (!perfil) return

    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('clinica_id', perfil.clinica_id)
      .order('created_at', { ascending: false })

    setPacientes(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('perfis')
      .select('clinica_id')
      .eq('user_id', user.id)
      .single()

    const { error } = await supabase
      .from('pacientes')
      .insert([{
        clinica_id: perfil.clinica_id,
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        data_nascimento: formData.get('data_nascimento'),
      }])

    if (!error) {
      setShowForm(false)
      loadPacientes()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Novo Paciente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="nome" placeholder="Nome" required className="border rounded p-2" />
            <input type="text" name="cpf" placeholder="CPF" className="border rounded p-2" />
            <input type="email" name="email" placeholder="Email" className="border rounded p-2" />
            <input type="tel" name="telefone" placeholder="Telefone" className="border rounded p-2" />
            <input type="date" name="data_nascimento" className="border rounded p-2" />
          </div>
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </form>
      )}

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">CPF</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Telefone</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{p.nome}</td>
                  <td className="px-6 py-4 text-sm">{p.cpf || '-'}</td>
                  <td className="px-6 py-4 text-sm">{p.email || '-'}</td>
                  <td className="px-6 py-4 text-sm">{p.telefone || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/dashboard/pacientes/${p.id}`} className="text-blue-600 hover:underline">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
