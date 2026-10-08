const moedaFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const moeda = (v) => moedaFmt.format(Number(v) || 0)

export function data(v) {
  if (!v) return '—'
  const [y, m, d] = String(v).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function dataHora(v) {
  if (!v) return '—'
  return new Date(v).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function hora(v) {
  if (!v) return '—'
  return new Date(v).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const pad = (n) => String(n).padStart(2, '0')

// Horário local no formato aceito pelas colunas "timestamp" (sem fuso).
export function agoraLocal() {
  const d = new Date()
  return `${isoDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// Datas locais em formato ISO (as colunas do banco são "timestamp" sem fuso).
export function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number)
  return isoDate(new Date(y, m - 1, d + n))
}

export function idade(nascimento) {
  if (!nascimento) return null
  const [y, m, d] = nascimento.slice(0, 10).split('-').map(Number)
  const hoje = new Date()
  let anos = hoje.getFullYear() - y
  if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos--
  return anos
}

export function traduzErro(error) {
  if (!error) return ''
  const msg = error.message || String(error)
  if (error.code === '23505') return 'Já existe um registro com esses dados (ex.: CPF, CRO ou número repetido).'
  if (error.code === '23503') return 'Este registro está ligado a outros dados e não pode ser excluído.'
  if (error.code === '42501' || /row-level security/i.test(msg)) return 'Sem permissão para esta operação.'
  if (error.code === '23502') return 'Preencha todos os campos obrigatórios.'
  if (/Failed to fetch/i.test(msg)) return 'Sem conexão com o servidor. Verifique sua internet.'
  return msg
}
