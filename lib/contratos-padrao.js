export const VARIAVEIS_CONTRATO = [
  ['clinica.nome', 'Nome da clínica'],
  ['clinica.cnpj', 'CNPJ da clínica'],
  ['clinica.endereco', 'Endereço da clínica'],
  ['paciente.nome', 'Nome do paciente'],
  ['paciente.cpf', 'CPF do paciente'],
  ['paciente.endereco', 'Endereço do paciente'],
  ['paciente.data_nascimento', 'Nascimento do paciente'],
  ['responsavel.nome', 'Responsável (menor de idade)'],
  ['responsavel.cpf', 'CPF do responsável'],
  ['profissional.nome', 'Profissional responsável'],
  ['profissional.cro', 'CRO do profissional'],
  ['tratamento', 'Descrição do tratamento'],
  ['valor_total', 'Valor total'],
  ['forma_pagamento', 'Forma de pagamento'],
  ['valor_manutencao', 'Valor da manutenção mensal'],
  ['prazo_estimado', 'Prazo estimado'],
  ['data', 'Data de hoje'],
]

export function preencherContrato(texto, vars) {
  return texto.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, chave) => {
    const v = vars[chave]
    return v === undefined || v === null || v === '' ? '________________' : String(v)
  })
}

const CABECALHO = `CONTRATANTE: {{paciente.nome}}, CPF {{paciente.cpf}}, residente em {{paciente.endereco}}, neste ato representado(a), quando menor ou incapaz, por {{responsavel.nome}}, CPF {{responsavel.cpf}}.

CONTRATADA: {{clinica.nome}}, CNPJ {{clinica.cnpj}}, com sede em {{clinica.endereco}}, tendo como responsável técnico(a) {{profissional.nome}}, CRO {{profissional.cro}}.`

export const MODELO_GERAL = {
  nome: 'Contrato de Prestação de Serviços Odontológicos',
  tipo: 'geral',
  conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ODONTOLÓGICOS

${CABECALHO}

CLÁUSULA 1 — OBJETO
1.1. O presente contrato tem por objeto a prestação dos seguintes serviços odontológicos: {{tratamento}}.
1.2. O plano de tratamento foi apresentado e explicado ao CONTRATANTE, que declara ter compreendido as etapas, alternativas, riscos e benefícios envolvidos.

CLÁUSULA 2 — VALOR E PAGAMENTO
2.1. Pelos serviços, o CONTRATANTE pagará o valor total de {{valor_total}}, na seguinte forma: {{forma_pagamento}}.
2.2. O atraso no pagamento implicará multa de 2% (dois por cento), juros de 1% (um por cento) ao mês e correção monetária, nos termos da legislação vigente.
2.3. Procedimentos não previstos no plano de tratamento serão orçados à parte e somente realizados mediante aprovação do CONTRATANTE.

CLÁUSULA 3 — OBRIGAÇÕES DA CONTRATADA
3.1. Executar os serviços com zelo, técnica adequada e observância ao Código de Ética Odontológica.
3.2. Manter prontuário atualizado e sigiloso, fornecendo cópia ao CONTRATANTE quando solicitado.
3.3. Informar previamente qualquer alteração necessária no plano de tratamento.

CLÁUSULA 4 — OBRIGAÇÕES DO CONTRATANTE
4.1. Comparecer às consultas agendadas, avisando eventual ausência com no mínimo 24 (vinte e quatro) horas de antecedência.
4.2. Seguir as orientações de higiene, cuidados e medicações prescritas.
4.3. Informar com veracidade seu histórico de saúde, alergias e uso de medicamentos.

CLÁUSULA 5 — RESULTADOS
5.1. A odontologia é atividade de meio: a CONTRATADA empregará os melhores recursos técnicos, não podendo garantir resultado específico, que depende também de fatores biológicos e da colaboração do CONTRATANTE.

CLÁUSULA 6 — RESCISÃO
6.1. O contrato poderá ser rescindido por qualquer das partes mediante comunicação por escrito, sendo devidos os valores correspondentes aos serviços já realizados e materiais já adquiridos para o tratamento.

CLÁUSULA 7 — PROTEÇÃO DE DADOS (LGPD)
7.1. Os dados pessoais e de saúde do CONTRATANTE serão tratados exclusivamente para a execução deste contrato, cumprimento de obrigações legais e tutela da saúde, conforme a Lei nº 13.709/2018, sendo mantidos em sigilo.
7.2. O uso de imagens do tratamento para fins diversos do registro clínico dependerá de autorização específica do CONTRATANTE.

CLÁUSULA 8 — FORO
8.1. Fica eleito o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer questões oriundas deste contrato.

E, por estarem de acordo, as partes assinam o presente em 2 (duas) vias de igual teor.

Local e data: ____________________, {{data}}.


______________________________________
CONTRATANTE (ou responsável legal)


______________________________________
{{clinica.nome}} — {{profissional.nome}}, CRO {{profissional.cro}}`,
}

export const MODELO_ORTODONTIA = {
  nome: 'Contrato de Tratamento Ortodôntico',
  tipo: 'ortodontia',
  conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRATAMENTO ORTODÔNTICO

${CABECALHO}

CLÁUSULA 1 — OBJETO
1.1. O presente contrato tem por objeto o tratamento ortodôntico do CONTRATANTE, compreendendo: {{tratamento}}.
1.2. O prazo estimado de tratamento é de {{prazo_estimado}}, podendo variar conforme a resposta biológica, a colaboração e a assiduidade do CONTRATANTE.

CLÁUSULA 2 — VALORES
2.1. Pela instalação do aparelho e início do tratamento, o CONTRATANTE pagará {{valor_total}}, na forma: {{forma_pagamento}}.
2.2. Pelas consultas de manutenção, o CONTRATANTE pagará o valor mensal de {{valor_manutencao}}, devido mensalmente enquanto durar o tratamento, independentemente do comparecimento.
2.3. O atraso no pagamento implicará multa de 2% (dois por cento), juros de 1% (um por cento) ao mês e correção monetária.
2.4. Os valores de manutenção poderão ser reajustados anualmente pelo IPCA ou índice que o substitua.

CLÁUSULA 3 — MANUTENÇÕES E FALTAS
3.1. As consultas de manutenção ocorrerão, em regra, a cada 30 (trinta) dias.
3.2. Faltas não justificadas, ou ausência por período superior a 60 (sessenta) dias, podem prolongar o tratamento e comprometer os resultados, sem responsabilidade da CONTRATADA.
3.3. Ausência injustificada superior a 90 (noventa) dias poderá caracterizar abandono de tratamento, facultando à CONTRATADA a rescisão deste contrato.

CLÁUSULA 4 — APARELHO E CUIDADOS
4.1. A quebra, perda ou dano de peças do aparelho por mau uso será reparada mediante cobrança adicional.
4.2. O CONTRATANTE compromete-se a manter rigorosa higiene bucal, uso correto de elásticos e acessórios indicados e a evitar alimentos que danifiquem o aparelho.
4.3. Tratamentos complementares (restaurações, extrações, cirurgias, limpezas, entre outros) não estão incluídos e serão orçados à parte.

CLÁUSULA 5 — CONTENÇÃO
5.1. Após a remoção do aparelho, será instalada contenção, cujo uso conforme orientação é indispensável para a estabilidade do resultado. O uso inadequado da contenção pode causar recidiva, que não é de responsabilidade da CONTRATADA.

CLÁUSULA 6 — RESULTADOS
6.1. A ortodontia é atividade de meio. A CONTRATADA empregará técnica adequada, não sendo possível garantir resultado estético ou funcional específico, que depende de fatores biológicos, crescimento ósseo e colaboração do CONTRATANTE.

CLÁUSULA 7 — RESCISÃO
7.1. Qualquer das partes poderá rescindir este contrato mediante comunicação escrita com 30 (trinta) dias de antecedência.
7.2. Em caso de rescisão, serão devidos os valores proporcionais aos serviços prestados e materiais utilizados. A remoção do aparelho, se solicitada, será cobrada à parte.

CLÁUSULA 8 — DOCUMENTAÇÃO E IMAGENS (LGPD)
8.1. O CONTRATANTE autoriza a realização de fotografias, radiografias e modelos para fins de diagnóstico, planejamento e acompanhamento clínico, que integrarão o prontuário.
8.2. Os dados pessoais e de saúde serão tratados conforme a Lei nº 13.709/2018 (LGPD), exclusivamente para a execução deste contrato e cumprimento de obrigações legais. O uso de imagens em publicações ou divulgação depende de autorização específica e por escrito.

CLÁUSULA 9 — FORO
9.1. Fica eleito o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer questões oriundas deste contrato.

E, por estarem de acordo, as partes assinam o presente em 2 (duas) vias de igual teor.

Local e data: ____________________, {{data}}.


______________________________________
CONTRATANTE (ou responsável legal)


______________________________________
{{clinica.nome}} — {{profissional.nome}}, CRO {{profissional.cro}}`,
}
