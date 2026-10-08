export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-indigo-600">OrthoFácil</h1>
        <p className="text-2xl text-gray-700">Sistema de Gestão Ortodôntica</p>
        <p className="text-gray-600 max-w-md">Plataforma completa para gerenciar sua clínica de ortodontia</p>

        <div className="pt-4 space-y-2">
          <p className="text-sm text-gray-600">✅ Scaffold preparado</p>
          <p className="text-sm text-gray-600">✅ Banco de dados: Supabase</p>
          <p className="text-sm text-gray-600">✅ Deploy: Vercel</p>
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <a href="/auth/login" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            Entrar
          </a>
          <a href="/auth/signup" className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold">
            Criar Conta
          </a>
        </div>

        <a href="https://github.com/gestaoortodontia-create/ortofacil" target="_blank" className="inline-block px-8 py-4 mt-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold">
          Ver no GitHub
        </a>
      </div>
    </main>
  )
}
