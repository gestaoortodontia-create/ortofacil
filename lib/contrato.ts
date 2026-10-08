export interface ContratoVariaveis {
  paciente: { nome: string; cpf?: string; data_nascimento?: string; endereco?: string }
  clinica: { nome: string; cnpj?: string; endereco?: string; telefone?: string }
  procedimentos?: string; valor_total?: number; valor_parcelas?: number; data?: string; profissional?: string
}
export function preencherContrato(template: string, vars: ContratoVariaveis): string {
  let conteudo = template
  conteudo = conteudo.replace(/{{paciente\.nome}}/g, vars.paciente.nome).replace(/{{paciente\.cpf}}/g, vars.paciente.cpf || '')
  conteudo = conteudo.replace(/{{clinica\.nome}}/g, vars.clinica.nome).replace(/{{valor_total}}/g, vars.valor_total ? formatarMoeda(vars.valor_total) : '')
  return conteudo
}
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}
