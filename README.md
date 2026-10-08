# Odonto Service - Sistema de Gestão Odontológica

Sistema completo de gestão para clínicas odontológicas, desenvolvido com Next.js 15, Supabase e Vercel.

## 🎯 Features

- **Agenda**: Agendamentos, profissionais, lembretes
- **Pacientes**: Cadastro completo, convênios, LGPD
- **Prontuário**: Anamnese, odontograma, evolução, prescrições
- **Tratamentos**: Orçamentos, procedimentos, contratos (geral + ortodontia)
- **Ortodontia**: Planos, manutenções, acompanhamento
- **Fotos**: Upload comprimido (WebP ~300KB), metadados
- **Financeiro**: Contas a receber, pagamentos, fluxo de caixa
- **Estoque**: Materiais, movimentações, alertas
- **Dashboard**: Visão geral, relatórios

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 18+
- Conta Supabase
- Conta Vercel (opcional, para deploy)

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais Supabase:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### Banco de Dados

Execute as migrations SQL (em `supabase/migrations/`):

```bash
# Via Supabase CLI
supabase migration up

# Ou manualmente via Dashboard Supabase
# Copie o SQL de cada arquivo e execute na aba SQL
```

### Dev Server

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura

```
app/              # Rotas e layouts (Next.js App Router)
├── (auth)/       # Autenticação (login, signup)
├── (dashboard)/  # Áreas autenticadas
│   ├── pacientes/
│   ├── agenda/
│   ├── prontuario/
│   ├── ortodontia/
│   ├── orcamentos/
│   ├── contratos/
│   ├── financeiro/
│   ├── estoque/
│   └── relatorios/
components/       # Componentes React reutilizáveis
lib/
├── supabase/     # Clients e middleware Supabase
├── imagem.ts     # Compressão de imagens
├── contrato.ts   # Geração de contratos
└── ...
supabase/
├── migrations/   # SQL schema + RLS
└── storage/      # Config de buckets
styles/           # CSS global
middleware.ts     # Auth middleware
```

## 🔐 Segurança

- RLS (Row Level Security) ativado em todas tabelas
- Auth via Supabase (JWT sessions)
- Isolamento por `clinica_id`
- LGPD compliant (consentimento em pacientes)
- Signed URLs para acesso a fotos

## 📦 Deploy

### Vercel

```bash
vercel login
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel deploy
```

## 📝 Roadmap

- [x] Scaffold inicial
- [ ] Auth + Login
- [ ] Pacientes + Agenda
- [ ] Prontuário + Fotos
- [ ] Ortodontia
- [ ] Contratos + PDF
- [ ] Financeiro + Estoque
- [ ] Dashboard
- [ ] Deploy

## 📧 Suporte

mgutoas@gmail.com

---

Desenvolvido com ❤️ para clínicas odontológicas
