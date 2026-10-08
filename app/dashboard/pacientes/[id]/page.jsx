'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRecord, updateRecord } from '@/lib/db-utils'
import { uploadFoto } from '@/lib/image-utils'
import { FormInput, FormCheckbox, FormTextarea } from '@/components/FormInput'

export default function PacienteDetailPage({ params }) {
  const [paciente, setPaciente] = useState(null)
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clinicaId, setClinicaId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    loadPaciente()
  }, [])

  const loadPaciente = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: perfil } = await supabase
        .from('perfis')
        .select('clinica_id')
        .eq('user_id', user.id)
        .single()

      setClinicaId(perfil.clinica_id)

      const pacienteData = await getRecord(supabase, 'pacientes', params.id, perfil.clinica_id)
      setPaciente(pacienteData)

      const { data: fotosData } = await supabase
        .from('fotos')
        .select('*')
        .eq('paciente_id', params.id)
        .order('created_at', { ascending: false })

      setFotos(fotosData || [])
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.target)
      const supabase = createClient()

      await updateRecord(supabase, 'pacientes', params.id, {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        cpf: formData.get('cpf'),
        data_nascimento: formData.get('data_nascimento'),
        endereco: formData.get('endereco'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        cep: formData.get('cep'),
        responsavel_nome: formData.get('responsavel_nome'),
        convenio: formData.get('convenio'),
        lgpd_consentimento: formData.get('lgpd_consentimento') === 'on',
      })

      alert('Paciente atualizado com sucesso!')
      loadPaciente()
    } catch (error) {
      alert('Erro ao salvar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUploadFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const supabase = createClient()
      const resultado = await uploadFoto(supabase, clinicaId, params.id, file, 'intraoral')

      await supabase.from('fotos').insert([{
        clinica_id: clinicaId,
        paciente_id: params.id,
        arquivo_path: resultado.path,
        tipo: 'intraoral',
        tamanho_kb: resultado.size_kb,
      }])

      alert(`Foto enviada! Compressão: ${resultado.compression}%`)
      loadPaciente()
    } catch (error) {
      alert('Erro ao enviar foto: ' + error.message)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (!paciente) return <div>Paciente não encontrado</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{paciente.nome}</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">
          ← Voltar
        </button>
      </div>

      {/* Formulário de dados */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Dados Pessoais</h2>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Nome" name="nome" defaultValue={paciente.nome} required />
            <FormInput label="CPF" name="cpf" defaultValue={paciente.cpf} />
            <FormInput label="Email" name="email" type="email" defaultValue={paciente.email} />
            <FormInput label="Telefone" name="telefone" defaultValue={paciente.telefone} />
            <FormInput label="Data Nascimento" name="data_nascimento" type="date" defaultValue={paciente.data_nascimento} />
            <FormInput label="Endereço" name="endereco" defaultValue={paciente.endereco} />
            <FormInput label="Cidade" name="cidade" defaultValue={paciente.cidade} />
            <FormInput label="Estado" name="estado" defaultValue={paciente.estado} />
            <FormInput label="CEP" name="cep" defaultValue={paciente.cep} />
            <FormInput label="Convênio" name="convenio" defaultValue={paciente.convenio} />
            <FormInput label="Responsável" name="responsavel_nome" defaultValue={paciente.responsavel_nome} />
          </div>

          <FormCheckbox
            label="Autoriza uso de fotos no prontuário (LGPD)"
            name="lgpd_consentimento"
            defaultChecked={paciente.lgpd_consentimento}
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Mudanças'}
          </button>
        </form>
      </div>

      {/* Upload de fotos */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Fotos do Tratamento</h2>
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadFoto}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-2 text-xs text-gray-500">Comprime automaticamente para WebP ~300KB</p>
        </div>

        {fotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fotos.map(foto => (
              <div key={foto.id} className="border rounded-lg p-4">
                <p className="font-medium">{foto.tipo}</p>
                <p className="text-sm text-gray-600">{foto.tamanho_kb} KB</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(foto.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma foto enviada</p>
        )}
      </div>
    </div>
  )
}
