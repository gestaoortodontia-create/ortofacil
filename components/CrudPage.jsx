'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { traduzErro } from '@/lib/format'
import { Alert, EmptyState, Modal, PageHeader, Spinner } from '@/components/ui'
import RecordForm from '@/components/RecordForm'

const normaliza = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function CrudPage({
  table,
  title,
  subtitle,
  singular,
  fields,
  columns,
  select = '*',
  order = { column: 'criado_em', ascending: false },
  searchFields = [],
  query,
  beforeSave,
  afterSave,
  rowActions,
  headerActions,
  embedded = false,
  reloadKey,
  emptyText,
}) {
  const { clinica } = useClinica()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busca, setBusca] = useState('')
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    let q = supabase.from(table).select(select).eq('clinica_id', clinica.id)
    if (query) q = query(q)
    q = q.order(order.column, { ascending: order.ascending }).limit(1000)
    const { data, error } = await q
    if (error) setError(traduzErro(error))
    else setError('')
    setRows(data || [])
    setLoading(false)
  }, [table, select, clinica.id, query, order.column, order.ascending])

  useEffect(() => { load() }, [load, reloadKey])

  const filtered = useMemo(() => {
    const termo = normaliza(busca.trim())
    if (!termo) return rows
    return rows.filter((r) => searchFields.some((f) => normaliza(r[f]).includes(termo)))
  }, [rows, busca, searchFields])

  const save = async (payload) => {
    const supabase = createClient()
    const isNew = !editing?.id
    let data = { ...payload }
    if (beforeSave) data = await beforeSave(data, editing)
    const { data: saved, error } = isNew
      ? await supabase.from(table).insert({ ...data, clinica_id: clinica.id }).select().single()
      : await supabase.from(table).update(data).eq('id', editing.id).select().single()
    if (error) throw new Error(traduzErro(error))
    if (afterSave) await afterSave(saved, isNew)
    setEditing(null)
    load()
  }

  const remove = async (row) => {
    if (!window.confirm(`Excluir este ${singular}? Esta ação não pode ser desfeita.`)) return
    const { error } = await createClient().from(table).delete().eq('id', row.id)
    if (error) setError(traduzErro(error))
    else load()
  }

  const novoBtn = (
    <button onClick={() => setEditing({})} className="btn-primary">
      <Plus className="h-4 w-4" /> Novo {singular}
    </button>
  )

  return (
    <div>
      {!embedded && (
        <PageHeader title={title} subtitle={subtitle}>
          {headerActions}
          {novoBtn}
        </PageHeader>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchFields.length > 0 ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input className="input pl-9" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          ) : <span />}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{filtered.length} registro(s)</span>
            {embedded && novoBtn}
          </div>
        </div>

        {error && <div className="p-4"><Alert>{error}</Alert></div>}

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState title={busca ? 'Nenhum resultado para a busca' : `Nenhum ${singular} cadastrado`} text={!busca ? emptyText : undefined} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((c) => <th key={c.key} className={`th ${c.className || ''}`}>{c.label}</th>)}
                  <th className="th text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    {columns.map((c) => (
                      <td key={c.key} className={`td ${c.className || ''}`}>
                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="td">
                      <div className="flex items-center justify-end gap-1">
                        {rowActions?.(row, load)}
                        <button onClick={() => setEditing(row)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-700" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(row)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} title={editing?.id ? `Editar ${singular}` : `Novo ${singular}`} onClose={() => setEditing(null)}>
        {editing && <RecordForm fields={fields} initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
