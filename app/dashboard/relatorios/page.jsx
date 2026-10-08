'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { PageHeader, Spinner, StatCard, EmptyState } from '@/components/ui'
import StatusBadge from '@/components/StatusBadge'
import { STATUS_AGENDA } from '@/lib/opcoes'
import { data, isoDate, moeda } from '@/lib/format'
import { Users, CalendarCheck, UserX, Wallet } from 'lucide-react'

const nomeMes = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}
const proxMes = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
}
const mesesAtras = (ym, n) => {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 1 - n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function RelatoriosPage() {
  const { clinica } = useClinica()
  const [mes, setMes] = useState(isoDate().slice(0, 7))
  const [r, setR] = useState(null)

  useEffect(() => {
    setR(null)
    const s = createClient()
    const ini = `${mes}-01T00:00:00`
    const fim = `${proxMes(mes)}-01T00:00:00`
    const ini6 = `${mesesAtras(mes, 5)}-01T00:00:00`
    Promise.all([
      s.from('pagamentos').select('valor, data_pagamento').eq('clinica_id', clinica.id).gte('data_pagamento', ini6).lt('data_pagamento', fim),
      s.from('agendamentos').select('status, procedimento').eq('clinica_id', clinica.id).gte('data_hora', ini).lt('data_hora', fim),
      s.from('pacientes').select('id', { count: 'exact', head: true }).eq('clinica_id', clinica.id).gte('criado_em', ini).lt('criado_em', fim),
      s.from('contas_receber').select('id, descricao, valor_total, valor_pago, data_vencimento, pacientes(nome)').eq('clinica_id', clinica.id)
        .in('status', ['aberto', 'parcial']).lt('data_vencimento', isoDate()).order('data_vencimento'),
    ]).then(([pg, ag, pac, inad]) => {
      const porMes = {}
      for (let i = 5; i >= 0; i--) porMes[mesesAtras(mes, i)] = 0
      for (const p of pg.data || []) {
        const k = p.data_pagamento.slice(0, 7)
        if (k in porMes) porMes[k] += Number(p.valor)
      }
      const ags = ag.data || []
      const porStatus = Object.fromEntries(STATUS_AGENDA.map((s) => [s.value, 0]))
      const procs = {}
      for (const a of ags) {
        porStatus[a.status] = (porStatus[a.status] || 0) + 1
        if (a.status === 'concluido') {
          const k = (a.procedimento || 'Consulta').trim()
          procs[k] = (procs[k] || 0) + 1
        }
      }
      const inadimplentes = inad.data || []
      setR({
        porMes,
        total: ags.length,
        porStatus,
        procs: Object.entries(procs).sort((a, b) => b[1] - a[1]).slice(0, 8),
        novosPacientes: pac.count || 0,
        faltas: porStatus.faltou || 0,
        inadimplentes,
        totalInad: inadimplentes.reduce((t, c) => t + Number(c.valor_total) - Number(c.valor_pago || 0), 0),
      })
    })
  }, [clinica.id, mes])

  const maxMes = r ? Math.max(1, ...Object.values(r.porMes)) : 1

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Indicadores de atendimento e financeiro da clínica.">
        <input type="month" className="input w-auto" value={mes} onChange={(e) => e.target.value && setMes(e.target.value)} />
      </PageHeader>

      {!r ? <Spinner /> : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Recebido no mês" value={moeda(r.porMes[mes])} icon={Wallet} tone="green" />
            <StatCard label="Consultas no mês" value={r.total} icon={CalendarCheck} tone="blue" />
            <StatCard label="Faltas" value={r.faltas} icon={UserX} tone={r.faltas ? 'red' : 'brand'} hint={r.total ? `${Math.round((r.faltas / r.total) * 100)}% das consultas` : undefined} />
            <StatCard label="Novos pacientes" value={r.novosPacientes} icon={Users} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-6 font-semibold text-slate-900">Faturamento recebido — últimos 6 meses</h2>
              <div className="flex h-56 items-end gap-3">
                {Object.entries(r.porMes).map(([k, v]) => (
                  <div key={k} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-600">{v ? moeda(v).replace(',00', '') : ''}</span>
                    <div className={`w-full rounded-t-md ${k === mes ? 'bg-brand-500' : 'bg-brand-200'}`} style={{ height: `${Math.max(2, (v / maxMes) * 170)}px` }} />
                    <span className="text-xs capitalize text-slate-500">{nomeMes(k)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 font-semibold text-slate-900">Consultas por status</h2>
              <ul className="space-y-3">
                {STATUS_AGENDA.map((s) => (
                  <li key={s.value} className="flex items-center gap-3">
                    <span className="w-32"><StatusBadge lista={STATUS_AGENDA} value={s.value} /></span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-400" style={{ width: `${r.total ? (r.porStatus[s.value] / r.total) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold text-slate-700">{r.porStatus[s.value]}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-8 text-sm font-semibold text-slate-900">Procedimentos concluídos</h3>
              {r.procs.length === 0 ? <p className="text-sm text-slate-500">Nenhum procedimento concluído no mês.</p> : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {r.procs.map(([nome, n]) => <li key={nome} className="flex justify-between py-2"><span className="text-slate-700">{nome}</span><span className="font-semibold">{n}</span></li>)}
                </ul>
              )}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Inadimplência (contas vencidas)</h2>
              <span className="text-sm font-semibold text-red-600">{moeda(r.totalInad)}</span>
            </div>
            {r.inadimplentes.length === 0 ? <EmptyState title="Nenhuma conta vencida" /> : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50"><tr><th className="th">Paciente</th><th className="th">Descrição</th><th className="th">Vencimento</th><th className="th text-right">Em aberto</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {r.inadimplentes.map((c) => (
                      <tr key={c.id}>
                        <td className="td font-medium text-slate-900">{c.pacientes?.nome}</td>
                        <td className="td">{c.descricao}</td>
                        <td className="td text-red-600">{data(c.data_vencimento)}</td>
                        <td className="td text-right font-semibold">{moeda(Number(c.valor_total) - Number(c.valor_pago || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
