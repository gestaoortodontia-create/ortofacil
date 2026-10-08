'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { EmptyState, PageHeader, Spinner } from '@/components/ui'
import { data, dataHora } from '@/lib/format'

const normaliza = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function ProntuarioPage() {
  const { clinica } = useClinica()
  const [pacientes, setPacientes] = useState(null)
  const [recentes, setRecentes] = useState([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('pacientes').select('id, nome, cpf, data_nascimento, telefone').eq('clinica_id', clinica.id).order('nome').limit(2000)
      .then(({ data }) => setPacientes(data || []))
    supabase.from('evolucoes').select('id, data, titulo, pacientes(id, nome)').eq('clinica_id', clinica.id).order('data', { ascending: false }).limit(8)
      .then(({ data }) => setRecentes(data || []))
  }, [clinica.id])

  const lista = useMemo(() => {
    const t = normaliza(busca.trim())
    if (!pacientes) return []
    return t ? pacientes.filter((p) => normaliza(p.nome).includes(t) || normaliza(p.cpf).includes(t)) : pacientes.slice(0, 50)
  }, [pacientes, busca])

  return (
    <div>
      <PageHeader title="Prontuário" subtitle="Encontre o paciente para ver anamnese, evoluções, prescrições, odontograma e fotos." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="border-b border-slate-200 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input autoFocus className="input pl-9" placeholder="Buscar por nome ou CPF..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          {pacientes === null ? <Spinner /> : lista.length === 0 ? (
            <EmptyState title={busca ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}>
              <Link href="/dashboard/pacientes" className="btn-primary">Cadastrar paciente</Link>
            </EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lista.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/pacientes/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{p.nome.trim()[0]?.toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{p.nome}</span>
                      <span className="block text-xs text-slate-500">{[p.cpf, p.data_nascimento && data(p.data_nascimento), p.telefone].filter(Boolean).join(' · ') || '—'}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card h-fit">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Últimas evoluções</h2></div>
          {recentes.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">Nenhuma evolução registrada.</p> : (
            <ul className="divide-y divide-slate-100">
              {recentes.map((r) => (
                <li key={r.id}>
                  <Link href={`/dashboard/pacientes/${r.pacientes?.id}`} className="block px-5 py-3 hover:bg-slate-50">
                    <p className="truncate text-sm font-medium text-slate-900">{r.pacientes?.nome}</p>
                    <p className="truncate text-xs text-slate-500">{r.titulo} · {dataHora(r.data)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
