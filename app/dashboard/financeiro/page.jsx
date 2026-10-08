'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FinanceiroPage() {
  const [totais, setTotais] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinanceiro()
  }, [])

  const loadFinanceiro = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: perfil } = await supabase
      .from('perfis')
      .select('clinica_id')
      .eq('user_id', user.id)
      .single()

    const { data: receber } = await supabase
      .from('contas_receber')
      .select('valor_total, valor_pago, status')
      .eq('clinica_id', perfil.clinica_id)

    const pendente = receber?.filter(c => c.status === 'pendente').reduce((a, b) => a + (b.valor_total - b.valor_pago), 0) || 0
    const pago = receber?.filter(c => c.status === 'pago').reduce((a, b) => a + b.valor_total, 0) || 0

    setTotais({
      pendente: pendente.toFixed(2),
      pago: pago.toFixed(2),
      total: (pendente + pago).toFixed(2),
    })

    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Financeiro</h1>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Total a Receber</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">R$ {totais?.pendente}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Total Pago</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">R$ {totais?.pago}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Faturamento Total</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">R$ {totais?.total}</p>
          </div>
        </div>
      )}
    </div>
  )
}
