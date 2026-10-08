# 🚀 Getting Started - Odonto Service

Seu sistema de gestão odontológica está pronto! Aqui está como começar:

## ⚡ Quick Start (5 minutos)

### 1. Clone e instale
```bash
cd odonto-service
npm install
```

### 2. Configure Supabase
Crie um projeto em [supabase.com](https://supabase.com) e obtenha:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Crie `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### 4. Aplique o Schema
No Supabase Dashboard → SQL Editor:
- Copie conteúdo de `supabase/migrations/001_initial_schema.sql`
- Cole e execute

### 5. Crie os Buckets
No Supabase Dashboard → Storage:
- Novo bucket: `fotos-tratamento` (privado)
- Novo bucket: `contratos` (privado)

### 6. Rode
```bash
npm run dev
```

Acesse `http://localhost:3000` e registre-se!

---

## 📚 Leia Depois

1. **[SETUP.md](./SETUP.md)** - Guia completo de configuração
2. **[README.md](./README.md)** - Visão geral do projeto

---

## 🏗️ O que foi criado

### ✅ Infrastructure
- Next.js 15 com App Router
- Supabase com Auth + RLS
- Tailwind CSS + shadcn/ui ready
- TypeScript completo

### ✅ Autenticação
- Login/Signup com email
- Session management
- Proteção de rotas

### ✅ Database
22 tabelas estruturadas:
- **Gestão**: clinicas, perfis, pacientes, profissionais
- **Agenda**: agendamentos, lembretes
- **Prontuário**: anamneses, odontograma, evolucoes, prescricoes, fotos
- **Ortodontia**: planos, manutenções
- **Contratos**: modelos, contratos gerados
- **Orçamentos**: procedimentos, orçamentos, itens
- **Financeiro**: contas a receber/pagar, pagamentos
- **Estoque**: materiais, movimentações

### ✅ Features
- 📸 Compressão de imagens (WebP ~300KB)
- 📄 Templates de contrato (geral + ortodontia)
- 🔐 RLS em todas tabelas
- 💾 Schemas Zod para validação

### ⏳ Em Construção (próximos passos)
- CRUD para Pacientes
- Calendário de Agenda
- Upload de fotos com preview
- Geração de contratos em PDF
- Ortdontia com acompanhamento
- Financeiro e Estoque
- Dashboard com relatórios

---

## 📁 Estrutura Principal

```
odonto-service/
├── app/
│   ├── (auth)/              ← Login/Signup
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/           ← Hub principal (autenticado)
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   ├── supabase/            ← Clients e auth
│   ├── imagem.ts            ← Compressão de fotos
│   ├── contrato.ts          ← Templates de contrato
│   └── schemas.ts           ← Validações Zod
├── supabase/
│   ├── migrations/          ← SQL schema
│   └── config.toml
├── components/              ← UI reutilizáveis (para criar)
├── .env.example
├── SETUP.md                 ← Guia completo
├── README.md
└── package.json
```

---

## 🔑 Commits Organizados

```
2dbe878 Initial scaffold: Next.js 15, Supabase auth, and project structure
0d3b5a2 Add database schema with RLS and Supabase config
dc7f519 Add utilities: image compression, contract templates, and Zod schemas
0d0a45c Add authentication pages and dashboard layout
779bd6f Add comprehensive setup guide for local development and Vercel deployment
```

Cada commit é atômico e documentado! 📝

---

## ✨ Destaques

✅ **RLS habilitado** em todas tabelas (cada clínica vê só seus dados)
✅ **LGPD pronto** (consentimento em pacientes, dados sensíveis)
✅ **Contratos parametrizados** (paciente.nome, clinica.cnpj, valor, etc)
✅ **Fotos otimizadas** (compressão no navegador, 300KB máximo)
✅ **TypeScript full** (type safety em todo o projeto)
✅ **Schemas Zod** (validação de dados)
✅ **Pronto para Vercel** (env vars configuradas)

---

## 🚀 Deploy no Vercel

```bash
# Push para GitHub
git push origin main

# 1. Acesse https://vercel.com/new
# 2. Selecione seu repo
# 3. Adicione env vars (SUPABASE_URL, etc)
# 4. Clique Deploy!
```

Seu app estará online em minutos! 🎉

---

## 🆘 Precisa de Ajuda?

1. Leia **[SETUP.md](./SETUP.md)** para troubleshooting
2. Verifique `.env.local` está correto
3. RLS/Storage ativados no Supabase?
4. Migrations aplicadas?

---

**Desenvolvido com ❤️**

Next: Criar módulo de Pacientes com CRUD completo!
