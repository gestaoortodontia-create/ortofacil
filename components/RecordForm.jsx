'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import { Alert, Field } from '@/components/ui'

export function toFormValues(record, fields) {
  const values = {}
  for (const f of fields) {
    let v = record?.[f.name]
    if (v === undefined || v === null) v = f.default ?? (f.type === 'checkbox' ? false : '')
    if (f.type === 'date' && v) v = String(v).slice(0, 10)
    if (f.type === 'datetime-local' && v) v = String(v).slice(0, 16)
    values[f.name] = v
  }
  return values
}

export function toPayload(values, fields) {
  const payload = {}
  for (const f of fields) {
    if (f.readOnly) continue
    let v = values[f.name]
    if (f.type === 'checkbox') v = !!v
    else if (v === '' || v === undefined) v = null
    else if (f.type === 'number' || f.type === 'money') v = Number(v)
    payload[f.name] = v
  }
  return payload
}

function useOptions(fields) {
  const { clinica } = useClinica()
  const [options, setOptions] = useState({})

  useEffect(() => {
    const supabase = createClient()
    const sources = fields.filter((f) => f.source)
    Promise.all(
      sources.map(async (f) => {
        const { table, label = 'nome', filter } = f.source
        let q = supabase.from(table).select(`id, ${label}`).eq('clinica_id', clinica.id).order(label).limit(1000)
        if (filter) q = filter(q)
        const { data } = await q
        return [f.name, (data || []).map((r) => ({ value: r.id, label: r[label] }))]
      })
    ).then((entries) => setOptions(Object.fromEntries(entries)))
  }, [fields, clinica.id])

  return options
}

export function FieldInput({ field, value, onChange, options }) {
  const common = {
    name: field.name,
    required: field.required,
    disabled: field.readOnly,
    placeholder: field.placeholder,
    className: 'input',
  }
  if (field.type === 'textarea') {
    return <textarea {...common} rows={field.rows || 3} value={value} onChange={(e) => onChange(e.target.value)} />
  }
  if (field.type === 'select') {
    const opts = field.options || options || []
    return (
      <select {...common} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{field.required ? 'Selecione...' : '—'}</option>
        {opts.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o
          return <option key={opt.value} value={opt.value}>{opt.label}</option>
        })}
      </select>
    )
  }
  if (field.type === 'checkbox') {
    return (
      <span className="flex h-10 items-center gap-2">
        <input type="checkbox" name={field.name} disabled={field.readOnly} checked={!!value} onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400" />
        <span className="text-sm text-slate-600">{field.checkboxLabel || 'Sim'}</span>
      </span>
    )
  }
  const type = field.type === 'money' ? 'number' : field.type || 'text'
  const step = field.type === 'money' ? '0.01' : field.step
  return <input {...common} type={type} step={step} min={field.min} value={value} onChange={(e) => onChange(e.target.value)} />
}

export default function RecordForm({ fields, initial, onSubmit, onCancel, submitLabel = 'Salvar' }) {
  const [values, setValues] = useState(() => toFormValues(initial, fields))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const options = useOptions(fields)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(toPayload(values, fields), values)
    } catch (err) {
      setError(err.message || String(err))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.name} label={f.label} required={f.required} className={f.full || f.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <FieldInput
              field={f}
              value={values[f.name]}
              options={options[f.name]}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
            />
            {f.help && <span className="mt-1 block text-xs text-slate-500">{f.help}</span>}
          </Field>
        ))}
      </div>
      <Alert>{error}</Alert>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>}
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvando...' : submitLabel}</button>
      </div>
    </form>
  )
}
