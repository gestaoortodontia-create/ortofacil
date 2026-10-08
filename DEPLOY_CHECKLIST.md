# ✅ CHECKLIST FINAL - 100% OPERACIONAL

## Status: Sistema está PRONTO, faltam últimas configurações

---

## 🔧 PASSO 1: Configurar Supabase (5 min)

### 1.1 Aplicar Migrations
- [ ] Abra https://app.supabase.com → seu projeto
- [ ] Vá para **SQL Editor**
- [ ] Clique **New Query**
- [ ] Cole: `supabase/migrations/001_schema_with_rls.sql`
- [ ] Clique **Run**
- [ ] Cole: `supabase/migrations/002_seed_data.sql`
- [ ] Clique **Run**

✓ Resultado: 22 tabelas criadas + dados de teste

### 1.2 Criar Bucket de Storage
- [ ] Vá para **Storage** (menu lateral)
- [ ] Clique **Create a new bucket**
- [ ] Nome: `fotos-tratamento`
- [ ] Privado: ✅ (selecione "Private")
- [ ] Clique **Create bucket**

✓ Resultado: Bucket pronto para fotos comprimidas

---

## 🌐 PASSO 2: Configurar Vercel (3 min)

### 2.1 Environment Variables
- [ ] Vá para https://vercel.com/gestaoortodontia-7153/ortofacil
- [ ] **Settings** > **Environment Variables**
- [ ] Adicione as 3 variáveis (se não estiverem):
  ```
  NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-chave-publica
  SUPABASE_SERVICE_ROLE_KEY = sua-chave-secreta
  ```
- [ ] Clique **Save**
- [ ] Vá para **Deployments** e **Redeploy** o mais recente

✓ Resultado: Variáveis sincronizadas

---

## 🧪 PASSO 3: Testar Sistema (10 min)

### 3.1 Teste de Auth
- [ ] Acesse https://ortofacil.vercel.app
- [ ] Clique **"Criar Conta"**
- [ ] Preencha:
  ```
  Nome da Clínica: Clínica Teste XYZ
  Email: seu-email@seu-dominio.com
  Senha: Senha@123456
  ```
- [ ] Clique **Criar Conta**
- [ ] Deve redirecionar para **Dashboard** ✓

### 3.2 Teste de Pacientes
- [ ] No dashboard, clique **Pacientes** (👥)
- [ ] Clique **+ Novo Paciente**
- [ ] Preencha:
  ```
  Nome: João da Silva
  Email: joao@teste.com
  Telefone: (11) 98765-4321
  ```
- [ ] Clique **Salvar**
- [ ] Deve aparecer na lista ✓

### 3.3 Teste de RLS (Segurança!)
- [ ] Abra console (F12)
- [ ] Execute:
  ```javascript
  const supabase = window.__supabase
  const {data} = await supabase.from('pacientes').select()
  console.log(data)
  ```
- [ ] Deve mostrar APENAS seus pacientes ✓

### 3.4 Teste de Upload de Foto
- [ ] Clique em um paciente
- [ ] Seção **Fotos do Tratamento**
- [ ] Escolha uma imagem (> 5MB)
- [ ] Automático: Comprime para WebP ~300KB
- [ ] Aparece na lista ✓

### 3.5 Teste de Agenda
- [ ] Clique **Agenda** (📅)
- [ ] Deve mostrar agendamentos de teste ✓

### 3.6 Teste de Financeiro
- [ ] Clique **Financeiro** (💳)
- [ ] Deve mostrar contas a receber ✓

---

## 🔒 PASSO 4: Verificar Segurança (5 min)

- [ ] RLS ativado em todas tabelas → SQL Editor:
  ```sql
  SELECT tablename FROM pg_tables WHERE schemaname='public';
  ```
  Todas devem ter RLS policy

- [ ] Bucket é **Private** → Storage > fotos-tratamento > Settings

- [ ] Service Role Key **NUNCA** em `.env.local` público

- [ ] Teste de força bruta → Tente login 10x com senha errada
  → Deve bloquear após 5 tentativas ✓

---

## 📊 PASSO 5: Dados Reais (Opcional)

Se quiser dados reais ao invés dos de teste:

### 5.1 Deletar dados de teste
```sql
DELETE FROM pagamentos;
DELETE FROM contas_receber;
DELETE FROM orcamento_itens;
DELETE FROM orcamentos;
DELETE FROM agendamentos;
DELETE FROM anamneses;
DELETE FROM pacientes;
DELETE FROM materiais;
DELETE FROM modelos_contrato;
DELETE FROM procedimentos;
DELETE FROM profissionais;
```

### 5.2 Adicionar seus dados
- Pacientes reais (respectivamente à LGPD)
- Profissionais da clínica
- Horários de agenda
- Procedimentos e preços

---

## 🚀 PASSO 6: Colocar em Produção (1 min)

- [ ] Todos os testes passaram ✓
- [ ] Documentação lida (SECURITY.md, SETUP.md)
- [ ] Backup do Supabase configurado → Settings > Backups

**Sistema está 100% operacional e seguro!**

---

## 📱 URLs Importantes

| Serviço | URL |
|---------|-----|
| **App** | https://ortofacil.vercel.app |
| **GitHub** | https://github.com/gestaoortodontia-create/ortofacil |
| **Supabase** | https://app.supabase.com |
| **Vercel** | https://vercel.com |

---

## 🆘 Se algo der errado

| Problema | Solução |
|----------|---------|
| "Módulo não encontrado" | Verifique `.env.local` |
| Login não funciona | Verifique migration 001 foi executada |
| Fotos não upload | Verifique bucket `fotos-tratamento` existe |
| RLS erro | Verifique RLS policies estão ativas |
| Build falha | Execute `npm install --legacy-peer-deps` |

---

**Status Final:** ✅ Sistema 100% operacional, seguro e pronto para produção!

Tempo total de setup: ~20 minutos
