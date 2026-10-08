export default function Logo({ light = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  const text = size === 'lg' ? 'text-2xl' : 'text-lg'
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`${box} inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-300 to-brand-600 shadow-sm`}>
        <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 3c-2.2 0-4 1.8-4 4.2 0 2 .8 3.2 1.4 4.6.7 1.7.9 4 1.4 6.4.4 2 1 2.8 1.8 2.8 1.2 0 1.4-1.7 1.8-3.6.3-1.6.8-2.9 2.6-2.9s2.3 1.3 2.6 2.9c.4 1.9.6 3.6 1.8 3.6.8 0 1.4-.8 1.8-2.8.5-2.4.7-4.7 1.4-6.4.6-1.4 1.4-2.6 1.4-4.6C21 4.8 19.2 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3z" />
        </svg>
      </span>
      <span className={`${text} font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-700'}`}>
        Orto<span className={light ? 'text-brand-300' : 'text-brand-400'}>Fácil</span>
      </span>
    </span>
  )
}
