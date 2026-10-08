const ALTURAS = { sm: 'h-10', md: 'h-14', lg: 'h-24' }

// O logo tem texto escuro: em fundos escuros ("light") ele vai sobre um cartão branco.
export default function Logo({ light = false, size = 'md' }) {
  const img = <img src="/logo.png" alt="OrtoFácil — Sistema Odontológico Inteligente" width={139} height={96} className={`${ALTURAS[size]} w-auto`} />
  if (!light) return img
  return <span className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm">{img}</span>
}
