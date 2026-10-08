import Link from 'next/link'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">OrthoFácil</h1>
        <p className="text-xl mb-8 text-gray-600">Sistema de gestão ortodôntica completo</p>
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Acessar Sistema</Link>
      </div>
    </main>
  )
}
