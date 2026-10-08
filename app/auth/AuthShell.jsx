import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <Link href="/" className="relative"><Logo light size="lg" /></Link>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-white">A rotina da sua clínica, organizada em um só lugar.</h2>
          <p className="mt-4 text-brand-100/80">Agenda, prontuário, ortodontia, orçamentos, contratos, financeiro e estoque — com seus dados protegidos.</p>
        </div>
        <p className="relative text-sm text-brand-100/60">© {new Date().getFullYear()} OrtoFácil</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-block lg:hidden"><Logo /></Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-center text-sm text-slate-600">{footer}</p>}
        </div>
      </div>
    </div>
  )
}
