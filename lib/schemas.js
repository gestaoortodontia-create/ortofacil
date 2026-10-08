import { z } from 'zod'

// Auth
export const signupSchema = z.object({
  nome_clinica: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirm: z.string(),
}).refine(d => d.password === d.password_confirm, {
  message: 'Senhas não coincidem',
  path: ['password_confirm'],
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

// Pacientes
export const pacienteSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório').max(200),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(),
  email: z.string().email().optional(),
  telefone: z.string().min(10).optional(),
  data_nascimento: z.string().date().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido').optional(),
  responsavel_nome: z.string().optional(),
  convenio: z.string().optional(),
  lgpd_consentimento: z.boolean().default(false),
})

// Agendamentos
export const agendamentoSchema = z.object({
  paciente_id: z.string().uuid(),
  profissional_id: z.string().uuid(),
  data_hora: z.string().datetime(),
  duracao_minutos: z.number().int().positive().default(60),
  tipo_procedimento: z.string().optional(),
  cadeira: z.number().int().optional(),
  status: z.enum(['agendado', 'concluído', 'cancelado', 'não_compareceu']).default('agendado'),
  observacoes: z.string().optional(),
})

// Orçamentos
export const orcamentoSchema = z.object({
  paciente_id: z.string().uuid(),
  profissional_id: z.string().uuid().optional(),
  data_validade: z.string().date(),
  status: z.enum(['pendente', 'aprovado', 'rejeitado']).default('pendente'),
  observacoes: z.string().optional(),
  itens: z.array(z.object({
    procedimento_id: z.string().uuid(),
    quantidade: z.number().int().positive(),
    preco_unitario: z.number().positive(),
  })),
})

// Anamnese
export const anamneseSchema = z.object({
  paciente_id: z.string().uuid(),
  historico_familiar: z.string().optional(),
  historico_pessoal: z.string().optional(),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  bruxismo: z.boolean().default(false),
  tabagismo: z.boolean().default(false),
})

// Contrato
export const contratoSchema = z.object({
  paciente_id: z.string().uuid(),
  modelo_id: z.string().uuid(),
  conteudo_gerado: z.string(),
  data_assinatura: z.string().datetime().optional(),
  assinado: z.boolean().default(false),
})

// Material
export const materialSchema = z.object({
  nome: z.string().min(3).max(200),
  codigo: z.string().optional(),
  descricao: z.string().optional(),
  quantidade: z.number().int().nonnegative(),
  quantidade_minima: z.number().int().nonnegative().default(10),
  unidade: z.string().default('un'),
  preco_unitario: z.number().nonnegative().optional(),
  fornecedor: z.string().optional(),
  localizacao: z.string().optional(),
})
