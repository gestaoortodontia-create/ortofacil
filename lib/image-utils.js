import imageCompression from 'browser-image-compression'

export async function compressImage(file) {
  if (!file) throw new Error('Arquivo não fornecido')

  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: 'image/webp',
  }

  try {
    const compressed = await imageCompression(file, options)
    return {
      file: compressed,
      originalSize: file.size,
      compressedSize: compressed.size,
      compression: Math.round((1 - compressed.size / file.size) * 100),
    }
  } catch (error) {
    throw new Error(`Erro ao comprimir imagem: ${error.message}`)
  }
}

export async function uploadFoto(supabase, clinicaId, pacienteId, file, tipo) {
  const compressed = await compressImage(file)
  const timestamp = new Date().getTime()
  const filename = `${clinicaId}/${pacienteId}/${tipo}_${timestamp}.webp`

  const { error: uploadError, data } = await supabase.storage
    .from('fotos-tratamento')
    .upload(filename, compressed.file, {
      contentType: 'image/webp',
    })

  if (uploadError) throw new Error(`Erro upload: ${uploadError.message}`)

  // Criar signed URL válida por 365 dias
  const { data: signedUrl } = await supabase.storage
    .from('fotos-tratamento')
    .createSignedUrl(filename, 365 * 24 * 60 * 60)

  return {
    path: filename,
    url: signedUrl?.signedUrl,
    size_kb: Math.round(compressed.compressedSize / 1024),
    type: tipo,
  }
}

export function getImageUrl(supabase, path) {
  if (!path) return null
  return supabase.storage.from('fotos-tratamento').getPublicUrl(path).data.publicUrl
}
