export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white border-opacity-20 w-full max-w-md">

        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl mb-6">
            <span className="text-4xl">🦷</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">OrthoFácil</h1>
          <p className="text-lg text-blue-100">Gestão Ortodôntica Profissional</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-white bg-opacity-5 rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-xs text-blue-100">Dashboard</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-xs text-blue-100">Pacientes</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-4 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-xs text-blue-100">Agenda</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <a
            href="/auth/login"
            className="w-full block py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl text-center hover:shadow-xl hover:shadow-blue-500 hover:shadow-opacity-50"
          >
            → Entrar
          </a>
          <a
            href="/auth/signup"
            className="w-full block py-3 px-6 bg-white bg-opacity-20 text-white font-bold rounded-xl text-center border-2 border-white border-opacity-30 hover:bg-opacity-30"
          >
            + Criar Conta
          </a>
        </div>

        <div className="text-center pt-6 border-t border-white border-opacity-10">
          <p className="text-sm text-blue-100">Sistema profissional para sua clínica</p>
        </div>
      </div>
    </div>
  )
}
