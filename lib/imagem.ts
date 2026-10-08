import imageCompression from 'browser-image-compression'
export interface ImageCompressionOptions {
  maxWidthOrHeight?: number; maxFileSizeMB?: number; useWebWorker?: boolean; fileType?: string
}
const defaultOptions: ImageCompressionOptions = { maxWidthOrHeight: 1600, maxFileSizeMB: 0.3, useWebWorker: true, fileType: 'image/webp' }
export async function compressImage(file: File, options: ImageCompressionOptions = {}) {
  const finalOptions = { ...defaultOptions, ...options }
  const originalSizeKB = Math.round(file.size / 1024)
  const compressedBlob = await imageCompression(file, finalOptions)
  const compressedSizeKB = Math.round(compressedBlob.size / 1024)
  const compressedFile = new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp', lastModified: Date.now() })
  return { compressedFile, originalSizeKB, compressedSizeKB }
}
