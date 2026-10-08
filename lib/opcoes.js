export const STATUS_AGENDA = [
  { value: 'agendado', label: 'Agendado', color: 'blue' },
  { value: 'confirmado', label: 'Confirmado', color: 'brand' },
  { value: 'em_atendimento', label: 'Em atendimento', color: 'yellow' },
  { value: 'concluido', label: 'Concluído', color: 'green' },
  { value: 'faltou', label: 'Faltou', color: 'red' },
  { value: 'cancelado', label: 'Cancelado', color: 'gray' },
]

export const STATUS_ORCAMENTO = [
  { value: 'rascunho', label: 'Rascunho', color: 'gray' },
  { value: 'enviado', label: 'Enviado', color: 'blue' },
  { value: 'aprovado', label: 'Aprovado', color: 'green' },
  { value: 'recusado', label: 'Recusado', color: 'red' },
]

export const STATUS_RECEBER = [
  { value: 'aberto', label: 'Em aberto', color: 'yellow' },
  { value: 'parcial', label: 'Parcial', color: 'blue' },
  { value: 'pago', label: 'Pago', color: 'green' },
  { value: 'cancelado', label: 'Cancelado', color: 'gray' },
]

export const STATUS_PAGAR = [
  { value: 'aberto', label: 'Em aberto', color: 'yellow' },
  { value: 'pago', label: 'Pago', color: 'green' },
  { value: 'cancelado', label: 'Cancelado', color: 'gray' },
]

export const METODOS_PAGAMENTO = ['PIX', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Boleto', 'Transferência', 'Convênio']

export function statusInfo(lista, value) {
  return lista.find((s) => s.value === value) || { value, label: value || '—', color: 'gray' }
}

export const ufs = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')
