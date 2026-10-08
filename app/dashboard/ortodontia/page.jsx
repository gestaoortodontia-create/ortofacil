'use client'

export default function OrtodontiaPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Ortodontia</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de ortodontia: planos, manutenções, arcos, elásticos</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4 hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Planos Ortodônticos</p>
            <p className="text-sm text-gray-500">Criar e gerenciar planos de tratamento</p>
          </div>
          <div className="border rounded p-4 hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Manutenções</p>
            <p className="text-sm text-gray-500">Consultas mensais e ajustes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
