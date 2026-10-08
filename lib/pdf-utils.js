import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 15, borderBottom: '1pt solid #000', paddingBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  text: { marginBottom: 10, lineHeight: 1.5 },
  footer: { fontSize: 9, marginTop: 30, textAlign: 'center', color: '#666' },
})

export async function generateContractPDF(contrato) {
  const ContratoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{contrato.titulo}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>DADOS DO PACIENTE</Text>
          <Text style={styles.text}>Nome: {contrato.paciente.nome}</Text>
          <Text style={styles.text}>CPF: {contrato.paciente.cpf || 'N/A'}</Text>
          <Text style={styles.text}>Email: {contrato.paciente.email || 'N/A'}</Text>
          <Text style={styles.text}>Telefone: {contrato.paciente.telefone || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DADOS DA CLÍNICA</Text>
          <Text style={styles.text}>Clínica: {contrato.clinica.nome}</Text>
          <Text style={styles.text}>Email: {contrato.clinica.email || 'N/A'}</Text>
          <Text style={styles.text}>Telefone: {contrato.clinica.telefone || 'N/A'}</Text>
        </View>

        {contrato.valor_total && (
          <View style={styles.section}>
            <Text style={styles.label}>VALORES</Text>
            <Text style={styles.text}>Valor Total: R$ {contrato.valor_total.toFixed(2)}</Text>
            {contrato.data_validade && (
              <Text style={styles.text}>Válido até: {new Date(contrato.data_validade).toLocaleDateString('pt-BR')}</Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>TERMOS E CONDIÇÕES</Text>
          <Text style={styles.text}>{contrato.conteudo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ASSINATURAS</Text>
          <Text style={styles.text}>Paciente: _____________________________ Data: _____________</Text>
          <Text style={styles.text}>Clínica: _____________________________ Data: _____________</Text>
        </View>

        <Text style={styles.footer}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} por OrthoFácil
        </Text>
      </Page>
    </Document>
  )

  try {
    const doc = <ContratoDocument />
    const blob = await pdf(doc).toBlob()
    return blob
  } catch (error) {
    throw new Error(`Erro ao gerar PDF: ${error.message}`)
  }
}

export async function uploadContractPDF(supabase, clinicaId, pacienteId, blob) {
  const timestamp = new Date().getTime()
  const filename = `${clinicaId}/${pacienteId}/contrato_${timestamp}.pdf`

  const { error } = await supabase.storage
    .from('fotos-tratamento')
    .upload(filename, blob, {
      contentType: 'application/pdf',
    })

  if (error) throw new Error(`Erro upload PDF: ${error.message}`)

  const { data: signedUrl } = await supabase.storage
    .from('fotos-tratamento')
    .createSignedUrl(filename, 365 * 24 * 60 * 60)

  return {
    path: filename,
    url: signedUrl?.signedUrl,
  }
}
