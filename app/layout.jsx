import './globals.css'
export const metadata = { title: 'OrthoFácil - Gestão Ortodôntica', description: 'Sistema completo de gestão para clínicas ortodônticas' }
export default function RootLayout({ children }) {
  return (<html lang="pt-BR"><body className="antialiased">{children}</body></html>)
}
