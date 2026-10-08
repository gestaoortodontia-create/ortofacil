'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Conteúdo */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 mb-6 shadow-lg">
              <span className="text-2xl">🦷</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              OrthoFácil
            </h1>
            <p className="text-xl text-blue-100 font-light">
              Gestão completa para sua clínica
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">📊</p>
              <p className="text-xs text-blue-100">Dashboard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">👥</p>
              <p className="text-xs text-blue-100">Pacientes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">📅</p>
              <p className="text-xs text-blue-100">Agenda</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mb-8">
            <a
              href="/auth/login"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>→</span> Entrar
            </a>
            <a
              href="/auth/signup"
              className="w-full px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>+</span> Criar Conta
            </a>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-blue-200">
              Sistema de gestão ortodôntica profissional
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
