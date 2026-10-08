# Setup do Odonto Service

Guia completo para configurar o sistema localmente e fazer deploy.

## 1️⃣ Pré-requisitos

- Node.js 18+ ([download](https://nodejs.org/))
- Git ([download](https://git-scm.com/))
- Conta no Supabase ([criar](https://supabase.com))
- Conta no Vercel ([criar](https://vercel.com)) - opcional, para deploy

## 2️⃣ Configurar Supabase

### 2.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Organization**: Criar nova ou selecionar
   - **Project Name**: `odonto-service` (ou similar)
   - **Database Password**: Anote em local seguro!
   - **Region**: Selecione mais próximo (ex: São Paulo)
4. Aguarde 2-3 minutos a criação

### 2.2 Obter Credenciais

Após criação, vá para **Project Settings** → **API**:

- Copie `Project URL` (ex: `https://xxxx.supabase.co`)
- Copie `anon public` key
- Copie `service_role` key (mantenha seguro!)

## 3️⃣ Configurar Ambiente Local

### 3.1 Instalar Dependências

```bash
npm install
```

### 3.2 Configurar Variáveis

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
```

## 4️⃣ Aplicar Migrations (Schema)

### 4.1 Via Supabase Dashboard

1. Acesse seu projeto Supabase
2. Vá para **SQL Editor** (aba esquerda)
3. Clique **New Query**
4. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
5. Cole no editor
6. Clique **Run**
7. Aguarde a execução (alguns segundos)

### 4.2 Verificar Schema

Você deve ver as seguintes tabelas em **Database** → **Tables**:

```
clinicas, perfis, pacientes, profissionais, agendamentos,
anamneses, odontogramas, evolucoes, prescricoes, fotos,
planos_ortodonticos, manutencoes_orto, modelos_contrato, contratos,
procedimentos, orcamentos, orcamento_itens,
contas_receber, pagamentos, contas_pagar,
materiais, movimentacoes_estoque
```

## 5️⃣ Criar Buckets no Supabase Storage

1. Vá para **Storage** (aba esquerda)
2. Clique **Create New Bucket** para cada:

**Bucket 1: `fotos-tratamento`**
- Private ✓
- [Create]

**Bucket 2: `contratos`**
- Private ✓
- [Create]

Suas fotos e PDFs estarão privados com acesso via signed URLs.

## 6️⃣ Rodar Dev Server

```bash
npm run dev
```

Acesse em **http://localhost:3000**

### Primeiro Login

1. Clique **Criar Conta**
2. Preencha:
   - Nome da Clínica
   - Email
   - Senha (min 8 caracteres)
3. Clique **Criar Conta**
4. Verifique seu email (pode levar alguns segundos)
5. Volte a **Entrar** com suas credenciais

## 7️⃣ Estrutura Criada

```
app/
  (auth)/
    login/          ← Login
    signup/         ← Registrar
  dashboard/
    page.tsx        ← Hub principal
    pacientes/      ← Em breve
    agenda/         ← Em breve
    prontuario/     ← Em breve
    ...

lib/
  supabase/
    client.ts       ← Browser client
    server.ts       ← Server client
    middleware.ts   ← Auth middleware
  imagem.ts         ← Compressão de fotos
  contrato.ts       ← Templates de contrato
  schemas.ts        ← Validações Zod

supabase/
  migrations/
    001_...sql      ← Schema do banco

.env.local          ← Variáveis (não commitar!)
```

## 8️⃣ Deploy no Vercel

### 8.1 Preparar

```bash
git push origin main
```

### 8.2 Conectar ao Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione seu repo GitHub
3. Clique **Import**

### 8.3 Variáveis de Ambiente

Na tela **Environment Variables**, adicione:

```
NEXT_PUBLIC_SUPABASE_URL    → Sua URL Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY → Sua chave anon
SUPABASE_SERVICE_ROLE_KEY   → Sua chave service role
```

### 8.4 Deploy

Clique **Deploy** e aguarde 2-3 minutos.

Seu site estará em `https://seu-projeto.vercel.app` 🚀

## 🔒 Segurança - IMPORTANTE

### Nunca Commitar `.env.local`

Já está no `.gitignore`, mas confirme:

```bash
git status  # .env.local NÃO deve aparecer
```

### Rotacionar Chaves Regularmente

No Supabase Dashboard → Project Settings → API → **Rotate Keys**

### LGPD / Dados de Saúde

- Os dados de pacientes são sensíveis
- RLS está ativado em todas tabelas (cada clínica vê só seus dados)
- Implemente consentimento de paciente (checkbox LGPD)
- Mantenha backups regulares

## 🧪 Testar Localmente

### Build

```bash
npm run build
```

Verifica TypeScript, imports, etc.

### Lint

```bash
npm run lint
```

Verifica código.

### Rodar

```bash
npm start
```

Simula produção localmente (depois de `build`).

## 📝 Próximos Passos

1. ✅ Scaffold criado
2. ✅ Auth + Login
3. ⏭️ Módulo Pacientes (CRUD básico)
4. ⏭️ Módulo Agenda (calendário)
5. ⏭️ Prontuário + Upload de fotos
6. ⏭️ Ortodontia
7. ⏭️ Orçamentos + Contratos
8. ⏭️ Financeiro
9. ⏭️ Estoque
10. ⏭️ Dashboard/Relatórios

## 🆘 Problemas Comuns

### "Invalid login credentials"
- Confirme email + senha
- Verifique se confirmou email (se exigido)

### "SUPABASE_URL not found"
- `.env.local` está preenchido?
- Variável `NEXT_PUBLIC_SUPABASE_URL` existe?

### "Table already exists"
- Não rode migrations 2x no mesmo banco
- Se precisar resetar: Supabase Dashboard → Settings → Reset Database

### Fotos não salvam
- Bucket `fotos-tratamento` existe e é privado?
- Storage RLS ativado?

---

**Suporte**: mgutoas@gmail.com
