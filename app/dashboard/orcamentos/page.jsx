'use client'

export default function OrcamentosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orçamentos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de orçamentos: criação, aprovação, conversão em contas</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Novo Orçamento
        </button>
      </div>
    </div>
  )
}
