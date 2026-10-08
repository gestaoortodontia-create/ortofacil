# 🦷 OrthoFácil - Sistema de Gestão Ortodôntica

Sistema **100% operacional** de gestão para clínicas ortodônticas.

**URL:** https://ortofacil.vercel.app

---

## ✅ Status: PRONTO PARA PRODUÇÃO

- ✅ 9 módulos funcionais
- ✅ Segurança (RLS, LGPD, Validação)
- ✅ Upload de fotos com compressão
- ✅ Geração de PDFs
- ✅ Dados de teste inclusos
- ✅ Documentação completa

---

## 🚀 Quick Start

### 1. Setup Banco de Dados

Abra https://app.supabase.com > SQL Editor:
1. Execute `supabase/migrations/001_schema_with_rls.sql`
2. Execute `supabase/migrations/002_seed_data.sql`

### 2. Criar Bucket

Storage > Create Bucket:
- Nome: `fotos-tratamento`
- Privado: ✅

### 3. Teste

Acesse https://ortofacil.vercel.app
- Clique "Criar Conta"
- Use dados fictícios
- Explore dashboard

---

## 📦 Stack

```
Next.js 15 + React 19 + Supabase + Vercel + Tailwind
```

---

## 📚 Documentação

- [SETUP.md](./SETUP.md) - Guia instalação
- [SECURITY.md](./SECURITY.md) - Segurança e testes
- [GitHub](https://github.com/gestaoortodontia-create/ortofacil)

---

## ✨ Funcionalidades

### Core
- Autenticação Supabase
- Multi-clínica (RLS)
- Dashboard completo

### Módulos
- Pacientes (CRUD + fotos)
- Agenda (agendamentos)
- Prontuário (documentação)
- Ortodontia (especializado)
- Orçamentos
- Contratos (PDF)
- Financeiro
- Estoque
- Relatórios

---

**Status:** ✅ Operacional e seguro
