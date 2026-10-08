# 🚀 Setup OrthoFácil - Guia Completo

## Status: ✅ MVP DEPLOYADO

**URL:** https://ortofacil.vercel.app

---

## 1️⃣ PASSO 1: Criar Bucket de Storage no Supabase

1. Acesse https://app.supabase.com
2. Entre no projeto `ortofacil`
3. Vá para **Storage** (lateral esquerda)
4. Clique em **Create a new bucket**
5. Configure:
   - **Name:** `fotos-tratamento`
   - **Privacy:** Private
   - **Clique:** Create bucket

---

## 2️⃣ PASSO 2: Aplicar Schema SQL

1. No Supabase, clique em **SQL Editor** (lateral)
2. Clique em **New Query**
3. Copie todo o conteúdo de `supabase/migrations/001_schema_with_rls.sql`
4. Cole no editor
5. Clique em **Run** (botão azul, canto superior direito)
6. Aguarde: deve completar sem erros

### ✓ Resultado esperado:
```
Executed successfully
Tables created: 22
```

---

## 3️⃣ PASSO 3: Testar na URL Viva

1. Acesse https://ortofacil.vercel.app
2. Clique em **"Criar Conta"**
3. Preencha:
   - **Nome da Clínica:** Sua Clínica
   - **Email:** seu@email.com
   - **Senha:** qualquer uma
4. Clique em **Criar Conta**
5. Deve redirecionar para **Dashboard** ✓

---

## 📦 Módulos Implementados

1. **Pacientes** - Cadastro com CRUD
2. **Agenda** - Visualização de agendamentos
3. **Prontuário** - Anamneses, odontogramas
4. **Ortodontia** - Planos e manutenções
5. **Orçamentos** - Gestão de orçamentos
6. **Contratos** - Modelos e PDFs
7. **Financeiro** - Contas a receber
8. **Estoque** - Materiais e movimentações
9. **Relatórios** - Templates prontos

---

## 🔗 Links

- **App:** https://ortofacil.vercel.app
- **GitHub:** https://github.com/gestaoortodontia-create/ortofacil
- **Supabase:** https://app.supabase.com
- **Vercel:** https://vercel.com

**Status:** ✅ Sistema pronto!
