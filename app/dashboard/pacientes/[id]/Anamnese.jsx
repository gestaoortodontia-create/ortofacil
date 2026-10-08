'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useClinica } from '@/components/ClinicaProvider'
import RecordForm from '@/components/RecordForm'
import { Alert, Spinner } from '@/components/ui'
import { agoraLocal, dataHora, traduzErro } from '@/lib/format'

const CAMPOS = [
  { name: 'queixa_principal', label: 'Queixa principal', type: 'textarea' },
  { name: 'historico_doencas', label: 'Doenças / condições sistêmicas', type: 'textarea', placeholder: 'Diabetes, hipertensão, cardiopatias, gestação...' },
  { name: 'alergias', label: 'Alergias', type: 'textarea', placeholder: 'Medicamentos, látex, anestésicos...' },
  { name: 'medicamentos', label: 'Medicamentos em uso', type: 'textarea' },
  { name: 'historico_odontologico', label: 'Histórico odontológico', type: 'textarea' },
  { name: 'habitos', label: 'Hábitos', type: 'textarea', placeholder: 'Bruxismo, tabagismo, respiração bucal, onicofagia...' },
]

export default function Anamnese({ pacienteId, onSaved }) {
  const { clinica } = useClinica()
  const [registro, setRegistro] = useState(undefined)
  const [ok, setOk] = useState('')

  useEffect(() => {
    createClient().from('anamneses').select('*').eq('paciente_id', pacienteId)
      .order('criado_em', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => setRegistro(data || null))
  }, [pacienteId])

  const salvar = async (payload) => {
    const supabase = createClient()
    const dados = { ...payload, atualizado_em: agoraLocal() }
    const { data, error } = registro
      ? await supabase.from('anamneses').update(dados).eq('id', registro.id).select().single()
      : await supabase.from('anamneses').insert({ ...dados, paciente_id: pacienteId, clinica_id: clinica.id }).select().single()
    if (error) throw new Error(traduzErro(error))
    setRegistro(data)
    setOk('Anamnese salva.')
    onSaved?.()
    setTimeout(() => setOk(''), 3000)
  }

  if (registro === undefined) return <Spinner />

  return (
    <div className="card p-6">
      {registro && <p className="mb-4 text-xs text-slate-500">Última atualização: {dataHora(registro.atualizado_em || registro.criado_em)}</p>}
      <div className="mb-4"><Alert type="success">{ok}</Alert></div>
      <RecordForm key={registro?.id || 'nova'} fields={CAMPOS} initial={registro} onSubmit={salvar} submitLabel="Salvar anamnese" />
    </div>
  )
}
