'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EstoquePage() {
  const [materiais, setMateriais] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMateriais()
  }, [])

  const loadMateriais = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('perfis')
      .select('clinica_id')
      .eq('user_id', user.id)
      .single()

    const { data } = await supabase
      .from('materiais')
      .select('*')
      .eq('clinica_id', perfil.clinica_id)
      .eq('ativo', true)
      .order('nome')

    setMateriais(data || [])
    setLoading(false)
  }

  const baixosEstoque = materiais.filter(m => m.quantidade <= m.quantidade_minima)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Estoque</h1>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          {baixosEstoque.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">⚠️ {baixosEstoque.length} item(ns) com estoque baixo</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Material</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Quantidade</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Mínima</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Fornecedor</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map(m => (
                  <tr key={m.id} className={m.quantidade <= m.quantidade_minima ? 'bg-yellow-50 border-b' : 'border-b'}>
                    <td className="px-6 py-4 text-sm">{m.nome}</td>
                    <td className="px-6 py-4 text-sm">{m.quantidade} {m.unidade}</td>
                    <td className="px-6 py-4 text-sm">{m.quantidade_minima}</td>
                    <td className="px-6 py-4 text-sm">{m.fornecedor || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {materiais.length === 0 && (
              <div className="p-6 text-center text-gray-600">Nenhum material cadastrado</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
