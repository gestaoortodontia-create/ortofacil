-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. CLÍNICAS (organização)
create table if not exists clinicas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique,
  cnpj text unique,
  endereco text,
  telefone text,
  email text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 2. PERFIS (roles)
create type user_role as enum ('admin', 'dentista', 'recepcao', 'paciente');

create table if not exists perfis (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  user_id uuid not null,
  nome text not null,
  role user_role not null default 'recepcao',
  email text not null,
  ativo boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(clinica_id, user_id)
);

-- 3. PACIENTES
create table if not exists pacientes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  nome text not null,
  cpf text unique,
  rg text,
  data_nascimento date,
  genero text,
  telefone text,
  email text unique,
  endereco text,
  cidade text,
  estado text,
  cep text,
  responsavel_nome text,
  responsavel_parentesco text,
  responsavel_telefone text,
  convenio text,
  numero_cartao_convenio text,
  autoriza_foto boolean default false,
  lgpd_consentimento boolean default false,
  lgpd_data_consentimento timestamp,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 4. PROFISSIONAIS
create table if not exists profissionais (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  nome text not null,
  cro text unique,
  especialidade text,
  telefone text,
  email text,
  ativo boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 5. AGENDA
create type agenda_status as enum ('agendado', 'concluído', 'cancelado', 'não_compareceu');

create table if not exists agendamentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id) on delete cascade,
  data_hora timestamp not null,
  duracao_minutos integer default 60,
  tipo_procedimento text,
  cadeira integer,
  status agenda_status default 'agendado',
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 6. ANAMNESES
create table if not exists anamneses (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  data timestamp default now(),
  historico_familiar text,
  historico_pessoal text,
  medicamentos text,
  alergias text,
  ultima_limpeza date,
  bruxismo boolean,
  tabagismo boolean,
  alcoolismo boolean,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 7. ODONTOGRAMA (JSONB for per-tooth state)
create table if not exists odontogramas (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data timestamp default now(),
  dentes jsonb, -- {11: {estado: 'hígido', cor: 'A1', observacoes: '...'}, ...}
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 8. EVOLUCOES (treatement notes)
create table if not exists evolucoes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data timestamp default now(),
  tipo_procedimento text not null,
  descricao text,
  dentes_tratados text, -- comma separated
  proxima_consulta date,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 9. PRESCRIÇÕES
create table if not exists prescricoes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data timestamp default now(),
  medicamento text not null,
  dosagem text,
  frequencia text,
  duracao_dias integer,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 10. FOTOS
create table if not exists fotos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  arquivo_path text not null, -- supabase storage path
  tipo text, -- intraoral, extraoral, odontograma
  dente text,
  etapa text, -- inicial, durante, final
  tamanho_kb integer,
  data_upload timestamp default now(),
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 11. PLANOS ORTODÔNTICOS
create table if not exists planos_ortodonticos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data_inicio date not null,
  data_previsao_termino date,
  tipo_aparelho text, -- fixo, móvel, invisalign
  descricao text,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 12. MANUTENÇÕES ORTODÔNTICAS
create table if not exists manutencoes_orto (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  plano_id uuid not null references planos_ortodonticos(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data_consulta timestamp not null,
  tipo_manutencao text, -- ativação, troca_arco, troca_elastico
  arco_tamanho text,
  materiais_utilizados text,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 13. MODELOS DE CONTRATO
create table if not exists modelos_contrato (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  nome text not null,
  tipo text not null, -- geral, ortodontia
  conteudo text not null, -- texto com {{variáveis}}
  ativo boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(clinica_id, nome)
);

-- 14. CONTRATOS
create table if not exists contratos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  modelo_id uuid not null references modelos_contrato(id) on delete set null,
  arquivo_pdf_path text, -- supabase storage
  conteudo_gerado text,
  data_assinatura timestamp,
  assinado boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 15. PROCEDIMENTOS (tabela de preços)
create table if not exists procedimentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  nome text not null,
  codigo text,
  descricao text,
  preco_tabela decimal(10,2) not null,
  ativo boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(clinica_id, nome)
);

-- 16. ORÇAMENTOS
create table if not exists orcamentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data timestamp default now(),
  data_validade date,
  status text default 'pendente', -- pendente, aprovado, rejeitado
  valor_total decimal(10,2),
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 17. ITENS DE ORÇAMENTO
create table if not exists orcamento_itens (
  id uuid primary key default uuid_generate_v4(),
  orcamento_id uuid not null references orcamentos(id) on delete cascade,
  procedimento_id uuid not null references procedimentos(id) on delete cascade,
  quantidade integer default 1,
  preco_unitario decimal(10,2) not null,
  subtotal decimal(10,2) not null,
  observacoes text,
  created_at timestamp default now()
);

-- 18. CONTAS A RECEBER
create type conta_status as enum ('pendente', 'parcialmente_pago', 'pago', 'cancelado', 'vencido');

create table if not exists contas_receber (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  paciente_id uuid not null references pacientes(id) on delete cascade,
  orcamento_id uuid references orcamentos(id) on delete set null,
  numero text unique,
  valor_total decimal(10,2) not null,
  valor_pago decimal(10,2) default 0,
  status conta_status default 'pendente',
  data_vencimento date,
  data_emissao timestamp default now(),
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 19. PAGAMENTOS
create type metodo_pagamento as enum ('dinheiro', 'cheque', 'cartao_credito', 'cartao_debito', 'pix', 'boleto');

create table if not exists pagamentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  conta_id uuid not null references contas_receber(id) on delete cascade,
  valor decimal(10,2) not null,
  data_pagamento timestamp default now(),
  metodo metodo_pagamento not null,
  numero_referencia text,
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 20. CONTAS A PAGAR
create table if not exists contas_pagar (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  fornecedor text not null,
  descricao text,
  valor decimal(10,2) not null,
  data_vencimento date,
  data_pagamento date,
  status conta_status default 'pendente',
  observacoes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 21. MATERIAIS (estoque)
create table if not exists materiais (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  nome text not null,
  codigo text,
  descricao text,
  quantidade integer default 0,
  quantidade_minima integer default 10,
  unidade text default 'un', -- un, kg, l, cx
  preco_unitario decimal(10,2),
  fornecedor text,
  data_validade date,
  localizacao text,
  ativo boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(clinica_id, nome)
);

-- 22. MOVIMENTAÇÕES DE ESTOQUE
create type tipo_movimentacao as enum ('entrada', 'saida', 'ajuste');

create table if not exists movimentacoes_estoque (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id) on delete cascade,
  material_id uuid not null references materiais(id) on delete cascade,
  tipo tipo_movimentacao not null,
  quantidade integer not null,
  motivo text,
  profissional_id uuid references profissionais(id) on delete set null,
  data_movimentacao timestamp default now(),
  observacoes text,
  created_at timestamp default now()
);

-- ÍNDICES PARA PERFORMANCE
create index idx_pacientes_clinica on pacientes(clinica_id);
create index idx_agendamentos_clinica on agendamentos(clinica_id);
create index idx_agendamentos_paciente on agendamentos(paciente_id);
create index idx_agendamentos_data on agendamentos(data_hora);
create index idx_fotos_paciente on fotos(paciente_id);
create index idx_contas_receber_paciente on contas_receber(paciente_id);
create index idx_contas_receber_status on contas_receber(status);
create index idx_materiais_clinica on materiais(clinica_id);
create index idx_movimentacoes_material on movimentacoes_estoque(material_id);

-- ROW LEVEL SECURITY (RLS)
alter table clinicas enable row level security;
alter table perfis enable row level security;
alter table pacientes enable row level security;
alter table profissionais enable row level security;
alter table agendamentos enable row level security;
alter table anamneses enable row level security;
alter table odontogramas enable row level security;
alter table evolucoes enable row level security;
alter table prescricoes enable row level security;
alter table fotos enable row level security;
alter table planos_ortodonticos enable row level security;
alter table manutencoes_orto enable row level security;
alter table modelos_contrato enable row level security;
alter table contratos enable row level security;
alter table procedimentos enable row level security;
alter table orcamentos enable row level security;
alter table orcamento_itens enable row level security;
alter table contas_receber enable row level security;
alter table pagamentos enable row level security;
alter table contas_pagar enable row level security;
alter table materiais enable row level security;
alter table movimentacoes_estoque enable row level security;

-- RLS POLICIES
-- Pacientes: usuário da clínica vê dados da sua clínica
create policy "Pacientes - usuário vê da sua clínica"
  on pacientes for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Agendamentos - usuário vê da sua clínica"
  on agendamentos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Fotos - usuário vê da sua clínica"
  on fotos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Contas receber - usuário vê da sua clínica"
  on contas_receber for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Materiais - usuário vê da sua clínica"
  on materiais for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Movimentacoes - usuário vê da sua clínica"
  on movimentacoes_estoque for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

-- Permissões adicionais por role podem ser adicionadas depois
create policy "Profissionais - usuário vê da sua clínica"
  on profissionais for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Procedimentos - usuário vê da sua clínica"
  on procedimentos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Orcamentos - usuário vê da sua clínica"
  on orcamentos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));
