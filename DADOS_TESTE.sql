-- Insert only test data (tables already exist)

-- Insert clinic if not exists
INSERT INTO clinicas (nome) VALUES ('Clínica Teste OrthoFácil')
ON CONFLICT (nome) DO NOTHING;

-- Get clinic ID for use in other inserts
WITH clinic AS (
  SELECT id FROM clinicas WHERE nome = 'Clínica Teste OrthoFácil' LIMIT 1
)

-- Insert test patients
INSERT INTO pacientes (clinica_id, nome, email, telefone, lgpd_consentimento)
SELECT c.id, 'João Silva', 'joao@teste.com', '(11) 98765-4321', true FROM clinic c
WHERE NOT EXISTS (SELECT 1 FROM pacientes WHERE email = 'joao@teste.com');

INSERT INTO pacientes (clinica_id, nome, email, lgpd_consentimento)
SELECT c.id, 'Maria Santos', 'maria@teste.com', true FROM clinic c
WHERE NOT EXISTS (SELECT 1 FROM pacientes WHERE email = 'maria@teste.com');

-- Insert test contas
INSERT INTO contas_receber (clinica_id, paciente_id, valor_total, status, data_vencimento)
SELECT c.id, p.id, 500.00, 'pendente'::conta_status, NOW() + INTERVAL '30 days'
FROM clinicas c, pacientes p 
WHERE c.nome = 'Clínica Teste OrthoFácil' 
AND p.nome = 'João Silva'
AND NOT EXISTS (
  SELECT 1 FROM contas_receber 
  WHERE paciente_id = p.id AND valor_total = 500.00
);

-- Insert test agendamentos
INSERT INTO agendamentos (clinica_id, paciente_id, data_hora, status)
SELECT c.id, p.id, NOW() + INTERVAL '2 days', 'agendado'::agenda_status
FROM clinicas c, pacientes p
WHERE c.nome = 'Clínica Teste OrthoFácil'
AND p.nome = 'Maria Santos'
AND NOT EXISTS (
  SELECT 1 FROM agendamentos
  WHERE paciente_id = p.id
);
