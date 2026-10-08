'use client'

export default function ContratosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contratos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de contratos: modelos, geração em PDF, assinatura digital</p>
        <div className="mt-6 space-y-2">
          <p className="text-sm">✓ Modelo Geral (serviços odontológicos)</p>
          <p className="text-sm">✓ Modelo Ortodontia (manutenção mensal, retenção)</p>
        </div>
      </div>
    </div>
  )
}
