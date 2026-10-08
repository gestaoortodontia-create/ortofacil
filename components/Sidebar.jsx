'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, CalendarDays, ClipboardList, Smile, Calculator, FileSignature,
  Wallet, Package, BarChart3, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import Logo from '@/components/Logo'

const MENU = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/dashboard/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users },
  { href: '/dashboard/prontuario', label: 'Prontuário', icon: ClipboardList },
  { href: '/dashboard/ortodontia', label: 'Ortodontia', icon: Smile },
  { href: '/dashboard/orcamentos', label: 'Orçamentos', icon: Calculator },
  { href: '/dashboard/contratos', label: 'Contratos', icon: FileSignature },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: Wallet },
  { href: '/dashboard/estoque', label: 'Estoque', icon: Package },
  { href: '/dashboard/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  const { clinica, perfil, email } = useClinica()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const sair = async () => {
    await createClient().auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }

  const isActive = (href) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href))

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5 lg:justify-center">
        <Logo light size="md" />
        <button className="rounded-md p-1 text-brand-100 lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-4 mb-4 rounded-lg bg-white/5 px-3 py-2.5">
        <p className="truncate text-sm font-semibold text-white">{clinica.nome}</p>
        <p className="truncate text-xs text-brand-100/70">{perfil.nome || email}</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {MENU.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(href) ? 'bg-brand-300 text-brand-900' : 'text-brand-50/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button onClick={sair} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-50/80 transition hover:bg-white/10 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo size="sm" />
        <button onClick={() => setOpen(true)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 bg-brand-800 lg:block">{nav}</aside>

      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-brand-800 shadow-xl">{nav}</aside>
        </div>
      )}
    </>
  )
}
