'use client'

export default function RelatoriosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition">
          <h3 className="text-lg font-medium mb-2">Relatório de Faturamento</h3>
          <p className="text-gray-600 text-sm">Faturamento por período, paciente ou profissional</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition">
          <h3 className="text-lg font-medium mb-2">Relatório de Inadimplência</h3>
          <p className="text-gray-600 text-sm">Contas vencidas e não pagas</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition">
          <h3 className="text-lg font-medium mb-2">Relatório de Estoque</h3>
          <p className="text-gray-600 text-sm">Materiais com baixo estoque e movimentações</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition">
          <h3 className="text-lg font-medium mb-2">Relatório de Agenda</h3>
          <p className="text-gray-600 text-sm">Taxa de ocupação e não-comparecimento</p>
        </div>
      </div>
    </div>
  )
}
