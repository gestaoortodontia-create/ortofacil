-- OrtoFácil — correções de segurança (RLS) e integridade.
-- Idempotente: pode ser executado mais de uma vez. Não apaga dados.

-- 1) Clínicas do usuário logado (security definer evita recursão de RLS em "perfis")
create or replace function public.minhas_clinicas()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinica_id from public.perfis where user_id = auth.uid()
$$;

revoke all on function public.minhas_clinicas() from public, anon;
grant execute on function public.minhas_clinicas() to authenticated;

-- 2) Remove políticas antigas (incompletas) das tabelas do sistema
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in (
      'clinicas','perfis','pacientes','profissionais','agendamentos','anamneses','odontogramas',
      'evolucoes','prescricoes','fotos','planos_ortodonticos','manutencoes_orto','modelos_contrato',
      'contratos','procedimentos','orcamentos','orcamento_itens','contas_receber','pagamentos',
      'contas_pagar','materiais','movimentacoes_estoque')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- 3) Unicidade por clínica (CPF/CRO/número podem repetir entre clínicas diferentes)
alter table public.pacientes drop constraint if exists pacientes_cpf_key;
alter table public.profissionais drop constraint if exists profissionais_cro_key;
alter table public.orcamentos drop constraint if exists orcamentos_numero_key;
create unique index if not exists pacientes_clinica_cpf_uniq on public.pacientes (clinica_id, cpf) where cpf is not null and cpf <> '';
create unique index if not exists profissionais_clinica_cro_uniq on public.profissionais (clinica_id, cro) where cro is not null and cro <> '';
create unique index if not exists orcamentos_clinica_numero_uniq on public.orcamentos (clinica_id, numero) where numero is not null;

-- 4) RLS ligado em todas as tabelas
do $$
declare t text;
begin
  foreach t in array array[
    'clinicas','perfis','pacientes','profissionais','agendamentos','anamneses','odontogramas',
    'evolucoes','prescricoes','fotos','planos_ortodonticos','manutencoes_orto','modelos_contrato',
    'contratos','procedimentos','orcamentos','orcamento_itens','contas_receber','pagamentos',
    'contas_pagar','materiais','movimentacoes_estoque']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- 5) Políticas: membro da clínica tem acesso completo aos dados da própria clínica
do $$
declare t text;
begin
  foreach t in array array[
    'pacientes','profissionais','agendamentos','anamneses','odontogramas','evolucoes','prescricoes',
    'fotos','planos_ortodonticos','manutencoes_orto','modelos_contrato','contratos','procedimentos',
    'orcamentos','contas_receber','pagamentos','contas_pagar','materiais','movimentacoes_estoque']
  loop
    execute format(
      'create policy "membros da clinica" on public.%I for all to authenticated
         using (clinica_id in (select public.minhas_clinicas()))
         with check (clinica_id in (select public.minhas_clinicas()))', t);
  end loop;
end $$;

create policy "membros da clinica" on public.orcamento_itens for all to authenticated
  using (exists (select 1 from public.orcamentos o where o.id = orcamento_id
                 and o.clinica_id in (select public.minhas_clinicas())))
  with check (exists (select 1 from public.orcamentos o where o.id = orcamento_id
                      and o.clinica_id in (select public.minhas_clinicas())));

-- Clínica: membros leem e editam; criação só pelo servidor (cadastro)
create policy "membros leem a clinica" on public.clinicas for select to authenticated
  using (id in (select public.minhas_clinicas()));
create policy "membros editam a clinica" on public.clinicas for update to authenticated
  using (id in (select public.minhas_clinicas()))
  with check (id in (select public.minhas_clinicas()));

-- Perfis: membros veem a equipe da clínica; usuário edita o próprio nome
create policy "membros veem a equipe" on public.perfis for select to authenticated
  using (clinica_id in (select public.minhas_clinicas()));
create policy "usuario edita proprio perfil" on public.perfis for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 6) Índices de apoio
create index if not exists perfis_user_idx on public.perfis (user_id);
create index if not exists pacientes_clinica_idx on public.pacientes (clinica_id);
create index if not exists agendamentos_clinica_data_idx on public.agendamentos (clinica_id, data_hora);
create index if not exists contas_receber_clinica_idx on public.contas_receber (clinica_id, status);
create index if not exists materiais_clinica_idx on public.materiais (clinica_id);
create index if not exists fotos_paciente_idx on public.fotos (paciente_id);

-- 7) Storage: arquivos ficam em <clinica_id>/... e só membros da clínica acessam
insert into storage.buckets (id, name, public)
values ('fotos-tratamento', 'fotos-tratamento', false), ('contratos', 'contratos', false)
on conflict (id) do nothing;

drop policy if exists "ortofacil arquivos select" on storage.objects;
drop policy if exists "ortofacil arquivos insert" on storage.objects;
drop policy if exists "ortofacil arquivos update" on storage.objects;
drop policy if exists "ortofacil arquivos delete" on storage.objects;

create policy "ortofacil arquivos select" on storage.objects for select to authenticated
  using (bucket_id in ('fotos-tratamento','contratos')
         and (storage.foldername(name))[1] in (select id::text from public.minhas_clinicas() as id));
create policy "ortofacil arquivos insert" on storage.objects for insert to authenticated
  with check (bucket_id in ('fotos-tratamento','contratos')
              and (storage.foldername(name))[1] in (select id::text from public.minhas_clinicas() as id));
create policy "ortofacil arquivos update" on storage.objects for update to authenticated
  using (bucket_id in ('fotos-tratamento','contratos')
         and (storage.foldername(name))[1] in (select id::text from public.minhas_clinicas() as id));
create policy "ortofacil arquivos delete" on storage.objects for delete to authenticated
  using (bucket_id in ('fotos-tratamento','contratos')
         and (storage.foldername(name))[1] in (select id::text from public.minhas_clinicas() as id));
