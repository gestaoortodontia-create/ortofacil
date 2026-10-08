-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== AUTH & PERFIS =====
CREATE TABLE clinicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE perfis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  nome TEXT,
  papel TEXT NOT NULL DEFAULT 'recepção',
  criado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinica_id, user_id)
);

-- ===== PACIENTES =====
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  rg TEXT,
  data_nascimento DATE,
  sexo TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  responsavel_nome TEXT,
  responsavel_cpf TEXT,
  responsavel_telefone TEXT,
  conveniado BOOLEAN DEFAULT FALSE,
  nome_convenio TEXT,
  numero_convenio TEXT,
  consentimento_lgpd BOOLEAN DEFAULT FALSE,
  data_consentimento TIMESTAMP,
  notas TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- ===== PROFISSIONAIS =====
CREATE TABLE profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidade TEXT,
  cro TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ===== AGENDA =====
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  profissional_id UUID NOT NULL REFERENCES profissionais(id),
  data_hora TIMESTAMP NOT NULL,
  duracao_minutos INTEGER DEFAULT 60,
  cadeira TEXT,
  procedimento TEXT,
  status TEXT DEFAULT 'agendado',
  notas TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agendamentos_data ON agendamentos(data_hora);
CREATE INDEX idx_agendamentos_paciente ON agendamentos(paciente_id);

-- ===== PRONTUÁRIO =====
CREATE TABLE anamneses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  queixa_principal TEXT,
  historico_doencas TEXT,
  alergias TEXT,
  medicamentos TEXT,
  historico_odontologico TEXT,
  habitos TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE odontogramas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  dentes JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(paciente_id)
);

CREATE TABLE evolucoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  data TIMESTAMP DEFAULT NOW(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  profissional_id UUID REFERENCES profissionais(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prescricoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  data TIMESTAMP DEFAULT NOW(),
  medicamento TEXT NOT NULL,
  dose TEXT,
  frequencia TEXT,
  duracao TEXT,
  profissional_id UUID REFERENCES profissionais(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fotos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  tipo TEXT NOT NULL,
  data TIMESTAMP DEFAULT NOW(),
  dente TEXT,
  etapa_tratamento TEXT,
  notas TEXT,
  tamanho_original_kb INTEGER,
  tamanho_comprimido_kb INTEGER,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ===== ORTODONTIA =====
CREATE TABLE planos_ortodonticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  aparelho TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  duracao_prevista_meses INTEGER,
  data_prevista_conclusao DATE,
  profissional_id UUID REFERENCES profissionais(id),
  notas TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE manutencoes_orto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  plano_orto_id UUID NOT NULL REFERENCES planos_ortodonticos(id) ON DELETE CASCADE,
  data TIMESTAMP NOT NULL,
  tipo TEXT,
  arco_material TEXT,
  arco_espessura TEXT,
  elasticos_tipo TEXT,
  elasticos_forca TEXT,
  profissional_id UUID REFERENCES profissionais(id),
  notas TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ===== CONTRATOS =====
CREATE TABLE modelos_contrato (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id),
  modelo_id UUID REFERENCES modelos_contrato(id),
  conteudo_preenchido TEXT,
  pdf_storage_path TEXT,
  assinado BOOLEAN DEFAULT FALSE,
  data_assinatura TIMESTAMP,
  data_validade DATE,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- ===== ORÇAMENTOS E PROCEDIMENTOS =====
CREATE TABLE procedimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_base DECIMAL(10, 2),
  categoria TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  numero TEXT UNIQUE,
  status TEXT DEFAULT 'rascunho',
  valor_total DECIMAL(10, 2),
  data_emissao TIMESTAMP DEFAULT NOW(),
  data_validade DATE,
  profissional_id UUID REFERENCES profissionais(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  procedimento_id UUID REFERENCES procedimentos(id),
  descricao TEXT,
  quantidade INTEGER DEFAULT 1,
  valor_unitario DECIMAL(10, 2),
  valor_total DECIMAL(10, 2),
  ordem INTEGER
);

-- ===== FINANCEIRO =====
CREATE TABLE contas_receber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES pacientes(id),
  descricao TEXT NOT NULL,
  valor_total DECIMAL(10, 2),
  valor_pago DECIMAL(10, 2) DEFAULT 0,
  data_emissao TIMESTAMP DEFAULT NOW(),
  data_vencimento DATE,
  status TEXT DEFAULT 'aberto',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  conta_receber_id UUID REFERENCES contas_receber(id) ON DELETE SET NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_pagamento TIMESTAMP DEFAULT NOW(),
  metodo_pagamento TEXT,
  numero_referencia TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contas_pagar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  fornecedor TEXT,
  descricao TEXT NOT NULL,
  valor DECIMAL(10, 2),
  data_emissao TIMESTAMP DEFAULT NOW(),
  data_vencimento DATE,
  status TEXT DEFAULT 'aberto',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ===== ESTOQUE =====
CREATE TABLE materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT,
  unidade TEXT DEFAULT 'unidade',
  quantidade_atual INTEGER DEFAULT 0,
  quantidade_minima INTEGER DEFAULT 0,
  preco_unitario DECIMAL(10, 2),
  fornecedor_id UUID,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materiais(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  quantidade INTEGER,
  motivo TEXT,
  referencia TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ===== RLS (Row Level Security) =====
ALTER TABLE clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE odontogramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolucoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_ortodonticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE manutencoes_orto ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos_contrato ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their clinic" ON clinicas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = clinicas.id AND perfis.user_id = auth.uid()
    )
  );

CREATE POLICY "Pacientes visible to clinic members" ON pacientes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = pacientes.clinica_id AND perfis.user_id = auth.uid()
    )
  );

CREATE POLICY "Pacientes insert" ON pacientes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = pacientes.clinica_id AND perfis.user_id = auth.uid()
    )
  );

CREATE POLICY "Pacientes update" ON pacientes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = pacientes.clinica_id AND perfis.user_id = auth.uid()
    )
  );

-- Repeat for other tables (following same pattern)
CREATE POLICY "Profissionais visible" ON profissionais
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = profissionais.clinica_id AND perfis.user_id = auth.uid()
    )
  );

CREATE POLICY "Agendamentos visible" ON agendamentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = agendamentos.clinica_id AND perfis.user_id = auth.uid()
    )
  );

CREATE POLICY "Fotos visible" ON fotos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM perfis WHERE perfis.clinica_id = fotos.clinica_id AND perfis.user_id = auth.uid()
    )
  );
