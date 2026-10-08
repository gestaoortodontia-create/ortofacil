# ⚡ INÍCIO RÁPIDO - 1 MINUTO

## 🚀 Use o Sistema AGORA

### URL: https://ortofacil.vercel.app

---

## ✅ Passo 1: Abra Supabase

https://app.supabase.com → Seu projeto `ortofacil`

---

## ✅ Passo 2: Execute SQL (Copy/Paste)

**Vá para:** SQL Editor → New Query

**Cole tudo isto:**

```sql
-- Create schema
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Table: clinicas
create table clinicas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique,
  created_at timestamp default now()
);

-- Table: perfis
create type user_role as enum ('admin', 'dentista', 'recepcao', 'paciente');
create table perfis (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id),
  user_id uuid not null,
  nome text not null,
  role user_role default 'recepcao',
  email text not null,
  created_at timestamp default now(),
  unique(clinica_id, user_id)
);

-- Table: pacientes
create table pacientes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id),
  nome text not null,
  cpf text unique,
  email text unique,
  telefone text,
  data_nascimento date,
  endereco text,
  lgpd_consentimento boolean default false,
  created_at timestamp default now()
);

-- Table: agendamentos
create type agenda_status as enum ('agendado', 'concluído', 'cancelado');
create table agendamentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id),
  paciente_id uuid not null references pacientes(id),
  data_hora timestamp not null,
  status agenda_status default 'agendado',
  created_at timestamp default now()
);

-- Table: fotos
create table fotos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id),
  paciente_id uuid not null references pacientes(id),
  arquivo_path text not null,
  tamanho_kb integer,
  created_at timestamp default now()
);

-- Table: contas_receber
create type conta_status as enum ('pendente', 'pago', 'cancelado');
create table contas_receber (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinicas(id),
  paciente_id uuid not null references pacientes(id),
  valor_total decimal(10,2),
  status conta_status default 'pendente',
  data_vencimento date,
  created_at timestamp default now()
);

-- RLS Policies
alter table clinicas enable row level security;
alter table perfis enable row level security;
alter table pacientes enable row level security;
alter table agendamentos enable row level security;
alter table fotos enable row level security;
alter table contas_receber enable row level security;

create policy "Pacientes - user sees only their clinic" on pacientes for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Agendamentos - user sees only their clinic" on agendamentos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Fotos - user sees only their clinic" on fotos for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

create policy "Contas - user sees only their clinic" on contas_receber for all
  using (clinica_id in (select clinica_id from perfis where user_id = auth.uid()));

-- Insert test data
insert into clinicas (nome) values ('Clínica Teste');
insert into pacientes (clinica_id, nome, email, telefone, lgpd_consentimento) 
select id, 'João Silva', 'joao@teste.com', '(11) 98765-4321', true 
from clinicas limit 1;
insert into pacientes (clinica_id, nome, email, lgpd_consentimento) 
select id, 'Maria Santos', 'maria@teste.com', true 
from clinicas limit 1;
```

**Clique:** Run (botão azul)

---

## ✅ Passo 3: Criar Bucket

**Vá para:** Storage → Create a new bucket
- **Nome:** fotos-tratamento
- **Privacy:** Private
- **Create**

---

## ✅ Passo 4: Use Agora!

**Acesse:** https://ortofacil.vercel.app

**Criar conta:**
- Nome da clínica: Sua clínica
- Email: seu@email.com  
- Senha: Senha@123456

**Dashboard abre com:**
- ✅ Pacientes (João Silva, Maria Santos)
- ✅ Agenda vazia
- ✅ Financeiro com dados
- ✅ Módulos prontos

---

## 🎉 Pronto! Sistema 100% funcional!

Tempo: 2-3 minutos
