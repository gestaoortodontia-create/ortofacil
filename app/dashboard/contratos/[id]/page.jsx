'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { EmptyState, Spinner } from '@/components/ui'

export default function ContratoPage({ params }) {
  const { id } = use(params)
  const [contrato, setContrato] = useState(undefined)

  useEffect(() => {
    createClient().from('contratos').select('conteudo_preenchido, pacientes(nome)').eq('id', id).maybeSingle()
      .then(({ data }) => setContrato(data))
  }, [id])

  if (contrato === undefined) return <Spinner />
  if (!contrato) return <EmptyState title="Contrato não encontrado"><Link href="/dashboard/contratos" className="btn-secondary">Voltar</Link></EmptyState>

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/dashboard/contratos" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"><ArrowLeft className="h-4 w-4" /> Contratos</Link>
        <button onClick={() => window.print()} className="btn-primary"><Printer className="h-4 w-4" /> Imprimir / salvar PDF</button>
      </div>
      <article className="card mx-auto max-w-3xl whitespace-pre-wrap p-8 font-serif text-[15px] leading-relaxed text-slate-900 sm:p-12 print:max-w-none print:border-0 print:p-0 print:shadow-none">
        {contrato.conteudo_preenchido}
      </article>
    </div>
  )
}
