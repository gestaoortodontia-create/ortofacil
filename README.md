# OrtoFácil

Sistema de gestão para clínicas odontológicas e ortodônticas. Roda inteiramente em **Vercel** (aplicação Next.js) e **Supabase** (banco Postgres, autenticação e armazenamento de arquivos), sem outros serviços.

## Módulos

| Módulo | O que faz |
| --- | --- |
| Painel | Consultas do dia, valores a receber, contas vencidas e estoque baixo |
| Agenda | Consultas por dia/semana e por profissional, com status (confirmado, faltou...) |
| Pacientes / Prontuário | Cadastro, anamnese, evoluções, prescrições, odontograma e fotos |
| Fotos | Comprimidas no navegador (WebP, até 1600 px, ~350 KB) e guardadas em bucket privado |
| Ortodontia | Planos de tratamento e manutenções (arcos, elásticos) |
| Orçamentos | Itens a partir da tabela de procedimentos; gera cobranças parceladas |
| Contratos | Modelos padrão (geral e ortodontia) com variáveis; impressão / PDF |
| Financeiro | Contas a receber, pagamentos parciais, recebimentos do mês, contas a pagar |
| Estoque | Materiais, entradas/saídas/ajustes e alerta de estoque mínimo |
| Relatórios | Faturamento dos últimos 6 meses, consultas por status, faltas, inadimplência |
| Configurações | Dados da clínica, profissionais, procedimentos e equipe |

Cada clínica só enxerga os próprios dados (Row Level Security no Postgres).

## Configuração do Supabase (uma vez)

No painel do Supabase → **SQL Editor**, execute em ordem:

1. `supabase/migrations/001_initial_schema.sql` — tabelas (somente em um projeto novo; o projeto atual já tem).
2. `supabase/migrations/002_correcoes_rls.sql` — regras de segurança, buckets e políticas de arquivos. Pode ser executado novamente sem perda de dados.

Em **Authentication → Providers → Email**, o cadastro funciona com ou sem confirmação de e-mail (o servidor cria a conta já confirmada).

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Onde encontrar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon / public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role (somente servidor) |

A integração oficial Supabase ↔ Vercel já cria essas variáveis automaticamente.

## Desenvolvimento local

```bash
cp .env.example .env.local   # preencha as três variáveis
npm install
npm run dev                   # http://localhost:3000
```

## Publicação

```bash
vercel deploy --prod
```

Ou conecte o repositório ao projeto na Vercel para publicar a cada `git push`.

## Observações

- Os modelos de contrato são uma base de referência; revise-os com um advogado antes do uso.
- Dados de saúde são dados sensíveis pela LGPD: registre o consentimento do paciente no cadastro.
