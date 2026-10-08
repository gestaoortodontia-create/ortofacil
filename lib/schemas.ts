import { z } from 'zod'

// Auth
export const SignUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não correspondem",
  path: ["confirmPassword"],
})

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

// Pacientes
export const PacienteSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  data_nascimento: z.date().optional(),
  sexo: z.enum(['M', 'F']).optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  endereco: z.string().optional(),
  responsavel_nome: z.string().optional(),
  responsavel_telefone: z.string().optional(),
  conveniado: z.boolean().default(false),
  nome_convenio: z.string().optional(),
  numero_convenio: z.string().optional(),
  consentimento_lgpd: z.boolean().default(false),
  notas: z.string().optional(),
})

export type Paciente = z.infer<typeof PacienteSchema>

// Profissionais
export const ProfissionalSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  especialidade: z.string().optional(),
  cro: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
})

export type Profissional = z.infer<typeof ProfissionalSchema>

// Agendamentos
export const AgendamentoSchema = z.object({
  paciente_id: z.string().uuid('ID de paciente inválido'),
  profissional_id: z.string().uuid('ID de profissional inválido'),
  data_hora: z.date('Data/hora obrigatória'),
  duracao_minutos: z.number().int().default(60),
  cadeira: z.string().optional(),
  procedimento: z.string().optional(),
  status: z.enum(['agendado', 'realizado', 'cancelado', 'falta']).default('agendado'),
  notas: z.string().optional(),
})

export type Agendamento = z.infer<typeof AgendamentoSchema>

// Procedimentos
export const ProcedimentoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  descricao: z.string().optional(),
  preco_base: z.number().positive('Preço deve ser positivo').optional(),
  categoria: z.string().optional(),
  ativo: z.boolean().default(true),
})

export type Procedimento = z.infer<typeof ProcedimentoSchema>

// Orçamentos
export const OrcamentoSchema = z.object({
  paciente_id: z.string().uuid('ID de paciente inválido'),
  numero: z.string().optional(),
  status: z.enum(['rascunho', 'enviado', 'aprovado', 'recusado']).default('rascunho'),
  valor_total: z.number().positive().optional(),
  data_validade: z.date().optional(),
  profissional_id: z.string().uuid().optional(),
})

export type Orcamento = z.infer<typeof OrcamentoSchema>

// Ortodontia
export const PlanoOrtodontioSchema = z.object({
  paciente_id: z.string().uuid('ID de paciente inválido'),
  aparelho: z.string().min(1, 'Aparelho obrigatório'),
  data_inicio: z.date('Data de início obrigatória'),
  duracao_prevista_meses: z.number().int().positive().optional(),
  profissional_id: z.string().uuid().optional(),
  notas: z.string().optional(),
})

export type PlanoOrtodontio = z.infer<typeof PlanoOrtodontioSchema>

// Materiais/Estoque
export const MaterialSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  categoria: z.string().optional(),
  unidade: z.string().default('unidade'),
  quantidade_atual: z.number().int().default(0),
  quantidade_minima: z.number().int().default(0),
  preco_unitario: z.number().positive().optional(),
})

export type Material = z.infer<typeof MaterialSchema>
