'use client'

export default function ProntuarioPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Prontuário</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de prontuário: anamneses, odontogramas, evoluções, prescrições</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded p-4 text-center hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Anamneses</p>
          </div>
          <div className="border rounded p-4 text-center hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Odontogramas</p>
          </div>
          <div className="border rounded p-4 text-center hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Evoluções</p>
          </div>
          <div className="border rounded p-4 text-center hover:bg-blue-50 cursor-pointer">
            <p className="font-medium">Prescrições</p>
          </div>
        </div>
      </div>
    </div>
  )
}
