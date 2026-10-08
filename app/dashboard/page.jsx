'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, CalendarDays, Wallet, Package, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { PageHeader, Spinner, StatCard, EmptyState } from '@/components/ui'
import StatusBadge from '@/components/StatusBadge'
import { STATUS_AGENDA } from '@/lib/opcoes'
import { addDays, data, hora, isoDate, moeda } from '@/lib/format'

export default function PainelPage() {
  const { clinica, perfil } = useClinica()
  const [d, setD] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    const hoje = isoDate()
    const amanha = addDays(hoje, 1)
    const cid = clinica.id
    Promise.all([
      supabase.from('pacientes').select('id', { count: 'exact', head: true }).eq('clinica_id', cid),
      supabase.from('agendamentos').select('id, data_hora, procedimento, status, pacientes(nome), profissionais(nome)')
        .eq('clinica_id', cid).gte('data_hora', `${hoje}T00:00:00`).lt('data_hora', `${amanha}T00:00:00`).order('data_hora'),
      supabase.from('contas_receber').select('id, descricao, valor_total, valor_pago, data_vencimento, status, pacientes(nome)')
        .eq('clinica_id', cid).in('status', ['aberto', 'parcial']).order('data_vencimento', { ascending: true, nullsFirst: false }),
      supabase.from('materiais').select('id, nome, quantidade_atual, quantidade_minima, unidade').eq('clinica_id', cid),
    ]).then(([pac, ag, cr, mat]) => {
      const abertas = cr.data || []
      setD({
        pacientes: pac.count || 0,
        consultas: ag.data || [],
        aReceber: abertas.reduce((s, c) => s + (Number(c.valor_total) - Number(c.valor_pago || 0)), 0),
        vencidas: abertas.filter((c) => c.data_vencimento && c.data_vencimento < hoje),
        estoqueBaixo: (mat.data || []).filter((m) => m.quantidade_atual <= m.quantidade_minima),
      })
    })
  }, [clinica.id])

  const saudacao = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  })()

  return (
    <div>
      <PageHeader title={`${saudacao}${perfil.nome ? `, ${perfil.nome.split(' ')[0]}` : ''}!`} subtitle={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
        <Link href="/dashboard/agenda" className="btn-primary"><CalendarDays className="h-4 w-4" /> Abrir agenda</Link>
      </PageHeader>

      {!d ? <Spinner /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pacientes cadastrados" value={d.pacientes} icon={Users} />
            <StatCard label="Consultas hoje" value={d.consultas.length} icon={CalendarDays} tone="blue" />
            <StatCard label="A receber (em aberto)" value={moeda(d.aReceber)} icon={Wallet} tone="green" hint={d.vencidas.length ? `${d.vencidas.length} conta(s) vencida(s)` : 'Nenhuma conta vencida'} />
            <StatCard label="Estoque baixo" value={d.estoqueBaixo.length} icon={Package} tone={d.estoqueBaixo.length ? 'red' : 'brand'} hint="itens no mínimo ou abaixo" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-slate-900">Agenda de hoje</h2>
                <Link href="/dashboard/agenda" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">Ver agenda <ArrowRight className="h-4 w-4" /></Link>
              </div>
              {d.consultas.length === 0 ? <EmptyState title="Nenhuma consulta hoje" /> : (
                <ul className="divide-y divide-slate-100">
                  {d.consultas.map((c) => (
                    <li key={c.id} className="flex items-center gap-4 px-5 py-3">
                      <span className="w-14 text-sm font-semibold text-brand-700">{hora(c.data_hora)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{c.pacientes?.nome}</p>
                        <p className="truncate text-xs text-slate-500">{c.procedimento || 'Consulta'} · {c.profissionais?.nome}</p>
                      </div>
                      <StatusBadge lista={STATUS_AGENDA} value={c.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Contas vencidas</h2></div>
                {d.vencidas.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">Tudo em dia. 🎉</p> : (
                  <ul className="divide-y divide-slate-100">
                    {d.vencidas.slice(0, 5).map((c) => (
                      <li key={c.id} className="px-5 py-3">
                        <p className="truncate text-sm font-medium text-slate-900">{c.pacientes?.nome}</p>
                        <p className="text-xs text-slate-500">{moeda(Number(c.valor_total) - Number(c.valor_pago || 0))} · venceu {data(c.data_vencimento)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card">
                <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Repor estoque</h2></div>
                {d.estoqueBaixo.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">Estoque em níveis adequados.</p> : (
                  <ul className="divide-y divide-slate-100">
                    {d.estoqueBaixo.slice(0, 5).map((m) => (
                      <li key={m.id} className="flex justify-between px-5 py-3 text-sm">
                        <span className="truncate text-slate-900">{m.nome}</span>
                        <span className="font-medium text-red-600">{m.quantidade_atual} {m.unidade}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
