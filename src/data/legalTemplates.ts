export interface LegalTemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'cpf' | 'phone' | 'cep' | 'textarea';
  required?: boolean;
}

export interface LegalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: LegalTemplateField[];
  generatePrompt: (data: Record<string, string>) => string;
}

export const legalTemplates: LegalTemplate[] = [
  {
    id: 'contrato-honorarios',
    name: 'Contrato de Honorários',
    description: 'Contrato de prestação de serviços advocatícios com definição de honorários',
    icon: '📄',
    fields: [
      { key: 'nome_advogado', label: 'Nome do Advogado (a)', type: 'text', required: true },
      { key: 'oab', label: 'Número OAB', type: 'text', required: true },
      { key: 'nome_cliente', label: 'Nome do Cliente', type: 'text', required: true },
      { key: 'cpf_cliente', label: 'CPF do Cliente', type: 'cpf', required: true },
      { key: 'rg_cliente', label: 'RG do Cliente', type: 'text', required: true },
      { key: 'endereco_cliente', label: 'Endereço Completo', type: 'textarea', required: true },
      { key: 'telefone_cliente', label: 'Telefone', type: 'phone', required: true },
      { key: 'email_cliente', label: 'E-mail', type: 'text', required: true },
      { key: 'tipo_acao', label: 'Tipo de Ação/Procedimento', type: 'textarea', required: true },
      { key: 'honorarios_valor', label: 'Valor dos Honorários (R$)', type: 'text', required: true },
      { key: 'honorarios_forma', label: 'Forma de Pagamento', type: 'text', required: true },
      { key: 'data', label: 'Data', type: 'date', required: true },
    ],
    generatePrompt: (data) =>
      `Gere um contrato de honorários advocatícios em português brasileiro válido, com as seguintes informações:\n\nAdvogado(a): ${data.nome_advogado} - OAB: ${data.oab}\nCliente: ${data.nome_cliente}\nCPF: ${data.cpf_cliente} | RG: ${data.rg_cliente}\nEndereço: ${data.endereco_cliente}\nTelefone: ${data.telefone_cliente} | E-mail: ${data.email_cliente}\n\nTipo de Ação: ${data.tipo_acao}\n\nHonorários: R$ ${data.honorarios_valor}\nForma de Pagamento: ${data.honorarios_forma}\n\nData: ${data.data}\n\nInclua cláusulas sobre: objeto do contrato, obrigação das partes, valor e forma de pagamento, rescisão, e foro competente.`,
  },
  {
    id: 'declaracao-hipossuficiencia',
    name: 'Declaração de Hipossuficiência',
    description: 'Declaração para obtenção de justiça gratuita',
    icon: '📋',
    fields: [
      { key: 'nome_completo', label: 'Nome Completo', type: 'text', required: true },
      { key: 'cpf', label: 'CPF', type: 'cpf', required: true },
      { key: 'rg', label: 'RG', type: 'text', required: true },
      { key: 'endereco', label: 'Endereço Completo', type: 'textarea', required: true },
      { key: 'bairro', label: 'Bairro', type: 'text', required: true },
      { key: 'cidade', label: 'Cidade', type: 'text', required: true },
      { key: 'estado', label: 'Estado (UF)', type: 'text', required: true },
      { key: 'cep', label: 'CEP', type: 'cep', required: true },
      { key: 'telefone', label: 'Telefone', type: 'phone', required: true },
      { key: 'profissao', label: 'Profissão', type: 'text', required: true },
      { key: 'renda_mensal', label: 'Renda Mensal (R$)', type: 'text', required: true },
      { key: 'estado_civil', label: 'Estado Civil', type: 'text', required: true },
      { key: 'nome_advogado', label: 'Advogado(a) Indicado(a)', type: 'text', required: true },
      { key: 'oab', label: 'OAB do Advogado', type: 'text', required: true },
      { key: 'data', label: 'Data', type: 'date', required: true },
    ],
    generatePrompt: (data) =>
      `Gere uma declaração de hipossuficiência econômica (justiça gratuita) em português brasileiro, válida juridicamente, com as seguintes informações:\n\nDeclarante: ${data.nome_completo}\nCPF: ${data.cpf} | RG: ${data.rg}\nEndereço: ${data.endereco}, Bairro: ${data.bairro}, ${data.cidade}/${data.estado} - CEP: ${data.cep}\nTelefone: ${data.telefone}\nProfissão: ${data.profissao}\nRenda Mensal: R$ ${data.renda_mensal}\nEstado Civil: ${data.estado_civil}\n\nAdvogado(a) Indicado(a): ${data.nome_advogado} - OAB: ${data.oab}\n\nData: ${data.data}\n\nInclua declaração de que não possui condições de arcar com as custas processuais sem prejuízo de seu sustento, conforme Lei 1.060/50.`,
  },
  {
    id: 'procuracao',
    name: 'Procuração',
    description: 'Procuração extrajudicial para representação judicial',
    icon: '⚖️',
    fields: [
      { key: 'nome_advogado', label: 'Nome do Advogado (a)', type: 'text', required: true },
      { key: 'oab', label: 'Número OAB', type: 'text', required: true },
      { key: 'uf_oab', label: 'UF da OAB', type: 'text', required: true },
      { key: 'nome_outorgante', label: 'Nome do Outorgante (Cliente)', type: 'text', required: true },
      { key: 'cpf_outorgante', label: 'CPF do Outorgante', type: 'cpf', required: true },
      { key: 'rg_outorgante', label: 'RG do Outorgante', type: 'text', required: true },
      { key: 'nacionalidade', label: 'Nacionalidade', type: 'text', required: true },
      { key: 'estado_civil', label: 'Estado Civil', type: 'text', required: true },
      { key: 'profissao', label: 'Profissão', type: 'text', required: true },
      { key: 'endereco_outorgante', label: 'Endereço Completo', type: 'textarea', required: true },
      { key: 'poderes', label: 'Poderes Específicos (ou genéricos)', type: 'textarea', required: false },
      { key: 'tipo_processo', label: 'Tipo de Processo/Assunto', type: 'text', required: false },
      { key: 'data', label: 'Data', type: 'date', required: true },
    ],
    generatePrompt: (data) =>
      `Gere uma procuração extrajudicial em português brasileiro válida, com os seguintes dados:\n\nOutorgado (Advogado): ${data.nome_advogado} - OAB/${data.uf_oab}: ${data.oab}\n\nOutorgante (Cliente):\nNome: ${data.nome_outorgante}\nCPF: ${data.cpf_outorgante} | RG: ${data.rg_outorgante}\nNacionalidade: ${data.nacionalidade}\nEstado Civil: ${data.estado_civil}\nProfissão: ${data.profissao}\nEndereço: ${data.endereco_outorgante}\n\n${data.tipo_processo ? `Assunto: ${data.tipo_processo}` : ''}\n${data.poderes ? `Poderes específicos: ${data.poderes}` : 'Poderes: genéricos para ato de judicial'}\n\nData: ${data.data}\n\nInclua poderes para receber citações, intimações, interpor recursos, requerer diligências, e demais poderes processuais conformes art. 105 do CPC.`,
  },
  {
    id: 'termo-renuncia',
    name: 'Termo de Renúncia',
    description: 'Termo de renúncia de mandato/Procuração',
    icon: '📜',
    fields: [
      { key: 'nome_advogado', label: 'Nome do Advogado (a)', type: 'text', required: true },
      { key: 'oab', label: 'Número OAB', type: 'text', required: true },
      { key: 'uf_oab', label: 'UF da OAB', type: 'text', required: true },
      { key: 'nome_advogado_substituto', label: 'Nome do Novo Advogado (a)', type: 'text', required: true },
      { key: 'oab_substituto', label: 'OAB do Novo Advogado', type: 'text', required: true },
      { key: 'nome_parte', label: 'Nome da Parte (cliente)', type: 'text', required: true },
      { key: 'cpf_parte', label: 'CPF da Parte', type: 'cpf', required: true },
      { key: 'numero_processo', label: 'Número do Processo', type: 'text', required: true },
      { key: 'vara', label: 'Vara/Órgão Julgador', type: 'text', required: true },
      { key: 'comarca', label: 'Comarca', type: 'text', required: true },
      { key: 'motivo', label: 'Motivo da Renúncia', type: 'textarea', required: false },
      { key: 'data', label: 'Data', type: 'date', required: true },
    ],
    generatePrompt: (data) =>
      `Gere um termo de renúncia de mandato advocatício em português brasileiro válido, com as seguintes informações:\n\nAdvogado Renunciante: ${data.nome_advogado} - OAB/${data.uf_oab}: ${data.oab}\n\nAdvogado Substituto: ${data.nome_advogado_substituto} - OAB: ${data.oab_substituto}\n\nParte: ${data.nome_parte} - CPF: ${data.cpf_parte}\n\nProcesso: ${data.numero_processo}\nVara: ${data.vara}\nComarca: ${data.comarca}\n\n${data.motivo ? `Motivo: ${data.motivo}` : 'Motivo: a requerimento da parte'}\n\nData: ${data.data}\n\nInclua declaração de extinção do mandato, comunicação da parte e do juízo, e ARTIGOS aplicáveis do CPC (art. 104 e seguintes).`,
  },
];
