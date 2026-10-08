import Link from 'next/link'
import { CalendarDays, ClipboardList, Smile, FileSignature, Wallet, Package, ShieldCheck, Camera } from 'lucide-react'
import Logo from '@/components/Logo'

const RECURSOS = [
  { icon: CalendarDays, titulo: 'Agenda', texto: 'Consultas por dia e profissional, com status de confirmação e faltas.' },
  { icon: ClipboardList, titulo: 'Prontuário', texto: 'Anamnese, evoluções, prescrições e odontograma de cada paciente.' },
  { icon: Smile, titulo: 'Ortodontia', texto: 'Planos de tratamento e histórico de manutenções, arcos e elásticos.' },
  { icon: Camera, titulo: 'Fotos comprimidas', texto: 'Fotos do tratamento otimizadas no navegador antes do envio.' },
  { icon: FileSignature, titulo: 'Contratos', texto: 'Modelos padrão de serviços e de ortodontia, prontos para imprimir.' },
  { icon: Wallet, titulo: 'Financeiro', texto: 'Contas a receber e a pagar, pagamentos e inadimplência.' },
  { icon: Package, titulo: 'Estoque', texto: 'Materiais, entradas, saídas e alerta de estoque mínimo.' },
  { icon: ShieldCheck, titulo: 'Seguro e LGPD', texto: 'Dados isolados por clínica, com acesso restrito à sua equipe.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/auth/login" className="btn-ghost">Entrar</Link>
          <Link href="/auth/signup" className="btn-primary">Criar conta</Link>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-brand-50 to-white" />
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
            Gestão odontológica e ortodôntica
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Sua clínica organizada,<br className="hidden sm:block" /> <span className="text-brand-600">do agendamento ao contrato.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            O OrtoFácil reúne agenda, prontuário, ortodontia, orçamentos, financeiro, estoque e contratos em um sistema simples, feito para o dia a dia do consultório.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth/signup" className="btn-primary px-6 py-3 text-base">Cadastrar minha clínica</Link>
            <Link href="/auth/login" className="btn-secondary px-6 py-3 text-base">Já tenho conta</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="inline-flex rounded-lg bg-brand-50 p-2.5 text-brand-600"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold text-slate-900">{titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} OrtoFácil · Gestão completa para clínicas odontológicas
      </footer>
    </div>
  )
}
