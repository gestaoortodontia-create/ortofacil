-- Seed Data para Testes (Execute APÓS 001_schema_with_rls.sql)

-- Procedimentos padrão
INSERT INTO procedimentos (clinica_id, nome, codigo, preco_tabela) VALUES
  ((SELECT id FROM clinicas LIMIT 1), 'Consulta de Avaliação', 'CONS-001', 150.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Limpeza e Profilaxia', 'LIMP-001', 200.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Restauração em Resina', 'REST-001', 300.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Extração Dentária', 'EXTR-001', 250.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Tratamento de Canal', 'TRAT-001', 800.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Aparelho Fixo (Mês)', 'ORTO-001', 400.00),
  ((SELECT id FROM clinicas LIMIT 1), 'Manutenção Ortodôntica', 'MANU-001', 150.00);

-- Modelos de contrato
INSERT INTO modelos_contrato (clinica_id, nome, tipo, conteudo) VALUES
  ((SELECT id FROM clinicas LIMIT 1), 'Contrato Geral', 'geral',
   'CONTRATO DE PRESTAÇÃO DE SERVIÇOS ODONTOLÓGICOS

1. O(A) paciente contrata os serviços odontológicos da clínica pelos valores acordados.

2. O paciente autoriza o tratamento e procedimentos descritos neste contrato.

3. A clínica se compromete a manter sigilo profissional e cumprir as normas sanitárias.

4. Cancelamentos devem ser feitos com 48 horas de antecedência.

5. Este contrato é válido pela data de assinatura até o término do tratamento.'),
  ((SELECT id FROM clinicas LIMIT 1), 'Contrato Ortodontia', 'ortodontia',
   'CONTRATO DE TRATAMENTO ORTODÔNTICO

1. O(A) paciente contrata tratamento ortodôntico pela duração estimada de 24-30 meses.

2. Manutenção mensal obrigatória durante o tratamento.

3. Retenção pós-tratamento por mínimo 6 meses com aparelho fixo.

4. Faltas em 2 consultas seguidas resultam em pausa do tratamento.

5. Rescisão antecipada implica multa de 20% do valor total.');

-- Materiais de exemplo
INSERT INTO materiais (clinica_id, nome, codigo, quantidade, quantidade_minima, preco_unitario, fornecedor) VALUES
  ((SELECT id FROM clinicas LIMIT 1), 'Fio Ortodôntico NiTi', 'FIO-001', 50, 10, 25.00, 'Distribuidor Odonto'),
  ((SELECT id FROM clinicas LIMIT 1), 'Elástico Ortodôntico', 'ELAS-001', 200, 50, 0.50, 'Distribuidor Odonto'),
  ((SELECT id FROM clinicas LIMIT 1), 'Resina Fotopolimerizável', 'RES-001', 30, 10, 80.00, 'Distribuidor Odonto'),
  ((SELECT id FROM clinicas LIMIT 1), 'Anestésico Local', 'ANES-001', 100, 20, 15.00, 'Distribuidor Odonto'),
  ((SELECT id FROM clinicas LIMIT 1), 'Ácido Fosfórico 37%', 'ACID-001', 20, 5, 45.00, 'Distribuidor Odonto');

-- Profissionais de exemplo
INSERT INTO profissionais (clinica_id, nome, cro, especialidade) VALUES
  ((SELECT id FROM clinicas LIMIT 1), 'Dr. João Silva', '123456-SP', 'Ortodontia'),
  ((SELECT id FROM clinicas LIMIT 1), 'Dra. Maria Santos', '654321-SP', 'Dentística'),
  ((SELECT id FROM clinicas LIMIT 1), 'Dr. Carlos Oliveira', '789456-SP', 'Endodontia');

-- Pacientes de exemplo (use user_id real se precisar)
INSERT INTO pacientes (clinica_id, nome, cpf, email, telefone, data_nascimento, endereco, cidade, estado, cep, convenio, lgpd_consentimento) VALUES
  ((SELECT id FROM clinicas LIMIT 1), 'João Santos Silva', '123.456.789-10', 'joao@email.com', '(11) 98765-4321', '1990-05-15', 'Rua A, 123', 'São Paulo', 'SP', '01234-567', 'Unimed', true),
  ((SELECT id FROM clinicas LIMIT 1), 'Maria Oliveira Costa', '987.654.321-00', 'maria@email.com', '(11) 99876-5432', '1995-08-22', 'Rua B, 456', 'São Paulo', 'SP', '02345-678', 'SulAmérica', true),
  ((SELECT id FROM clinicas LIMIT 1), 'Pedro Ferreira Mendes', '456.789.123-45', 'pedro@email.com', '(11) 97654-3210', '1988-03-10', 'Rua C, 789', 'São Paulo', 'SP', '03456-789', NULL, true);

-- Anamneses de exemplo
INSERT INTO anamneses (clinica_id, paciente_id, historico_familiar, historico_pessoal, medicamentos, alergias) VALUES
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'João Santos Silva' LIMIT 1),
   'Pai com problemas bucais', 'Bom estado de saúde', 'Nenhum', 'Penicilina'),
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'Maria Oliveira Costa' LIMIT 1),
   'Avó com problemas de gengiva', 'Tabagista social', 'Vitamina D', 'Nenhuma'),
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'Pedro Ferreira Mendes' LIMIT 1),
   'Histórico de diabetes', 'Diabetes controlado', 'Metformina', 'AINE');

-- Agendamentos de exemplo
INSERT INTO agendamentos (clinica_id, paciente_id, profissional_id, data_hora, tipo_procedimento, status) VALUES
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'João Santos Silva' LIMIT 1),
   (SELECT id FROM profissionais WHERE nome = 'Dr. João Silva' LIMIT 1),
   NOW() + INTERVAL '1 day', 'Consulta de Avaliação', 'agendado'),
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'Maria Oliveira Costa' LIMIT 1),
   (SELECT id FROM profissionais WHERE nome = 'Dra. Maria Santos' LIMIT 1),
   NOW() + INTERVAL '2 days', 'Manutenção Ortodôntica', 'agendado'),
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'Pedro Ferreira Mendes' LIMIT 1),
   (SELECT id FROM profissionais WHERE nome = 'Dr. Carlos Oliveira' LIMIT 1),
   NOW() + INTERVAL '3 days', 'Tratamento de Canal', 'agendado');

-- Orçamentos de exemplo
INSERT INTO orcamentos (clinica_id, paciente_id, profissional_id, data, data_validade, status, valor_total) VALUES
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'João Santos Silva' LIMIT 1),
   (SELECT id FROM profissionais WHERE nome = 'Dr. João Silva' LIMIT 1),
   NOW(), NOW() + INTERVAL '30 days', 'pendente', 1200.00);

INSERT INTO orcamento_itens (orcamento_id, procedimento_id, quantidade, preco_unitario, subtotal)
SELECT
  (SELECT id FROM orcamentos LIMIT 1),
  (SELECT id FROM procedimentos WHERE nome = 'Consulta de Avaliação' LIMIT 1),
  2,
  150.00,
  300.00;

-- Contas a receber de exemplo
INSERT INTO contas_receber (clinica_id, paciente_id, orcamento_id, numero, valor_total, data_vencimento, status) VALUES
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'João Santos Silva' LIMIT 1),
   (SELECT id FROM orcamentos LIMIT 1),
   'FAT-001-2024',
   1200.00,
   NOW() + INTERVAL '30 days',
   'pendente'),
  ((SELECT id FROM clinicas LIMIT 1), (SELECT id FROM pacientes WHERE nome = 'Maria Oliveira Costa' LIMIT 1),
   NULL,
   'FAT-002-2024',
   600.00,
   NOW() - INTERVAL '5 days',
   'vencido');
