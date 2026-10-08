export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-5xl font-bold text-indigo-600">OrthoFácil</h1>
        <p className="text-xl text-gray-700">Gestão Ortodôntica</p>

        <div className="flex flex-col gap-3 pt-8">
          <a href="/auth/login" className="w-full px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition">
            Entrar
          </a>
          <a href="/auth/signup" className="w-full px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition">
            Criar Conta
          </a>
        </div>
      </div>
    </main>
  )
}
