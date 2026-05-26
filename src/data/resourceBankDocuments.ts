export interface ResourceBankDocument {
  id: string;
  title: string;
  category: string;
  icon: string;
  content: string;
}

export const resourceBankDocuments: ResourceBankDocument[] = [
  {
    id: 'demo-termo-renuncia',
    title: 'Termo de Renúncia (Demo)',
    category: 'Processual',
    icon: '📜',
    content: `TERMO DE RENÚNCIA DE MANDATO

Eu, [NOME DO ADVOGADO], inscrito(a) na OAB/[UF] sob nº [NÚMERO], venho, com fundamento no art. 112 do CPC, RENUNCIAR ao mandato judicial outorgado por [NOME DA PARTE], nos autos do processo nº [NÚMERO DO PROCESSO], em trâmite perante a [VARA], Comarca de [CIDADE/UF].

Declaro que a parte outorgante foi devidamente notificada desta renúncia, para que constitua novo patrono no prazo legal.

[CIDADE], [DATA].

___________________________________
[NOME DO ADVOGADO]
OAB/[UF] [NÚMERO]`,
  },
  {
    id: 'demo-procuracao-ad-judicia',
    title: 'Procuração Ad Judicia (Demo)',
    category: 'Representação',
    icon: '⚖️',
    content: `PROCURAÇÃO

OUTORGANTE: [NOME], [NACIONALIDADE], [ESTADO CIVIL], [PROFISSÃO], portador(a) do RG nº [RG], CPF nº [CPF], residente à [ENDEREÇO COMPLETO].

OUTORGADO: [NOME DO ADVOGADO], inscrito(a) na OAB/[UF] sob nº [NÚMERO].

PODERES: confere ao(à) outorgado(a) poderes da cláusula ad judicia et extra, para representar o(a) outorgante em qualquer juízo, instância ou tribunal, podendo propor ações, contestar, transigir, firmar compromissos, receber e dar quitação, interpor recursos e praticar todos os atos necessários à defesa dos interesses do(a) outorgante.

[CIDADE], [DATA].

___________________________________
[ASSINATURA DO OUTORGANTE]`,
  },
  {
    id: 'demo-declaracao-hipossuficiencia',
    title: 'Declaração de Hipossuficiência (Demo)',
    category: 'Justiça Gratuita',
    icon: '📋',
    content: `DECLARAÇÃO DE HIPOSSUFICIÊNCIA

Eu, [NOME COMPLETO], CPF nº [CPF], RG nº [RG], residente à [ENDEREÇO], DECLARO, para os devidos fins e sob as penas da lei, que não possuo condições financeiras de arcar com as custas processuais e honorários advocatícios sem prejuízo do meu sustento e de minha família.

Requeiro, assim, os benefícios da gratuidade de justiça, nos termos da legislação vigente.

[CIDADE], [DATA].

___________________________________
[ASSINATURA]`,
  },
  {
    id: 'demo-contrato-honorarios',
    title: 'Contrato de Honorários (Demo)',
    category: 'Contratual',
    icon: '📄',
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: [NOME DO CLIENTE], CPF [CPF].
CONTRATADO(A): [NOME DO ADVOGADO], OAB/[UF] [NÚMERO].

CLÁUSULA 1ª - OBJETO
O presente contrato tem por objeto a prestação de serviços advocatícios referentes a [DESCREVER A DEMANDA].

CLÁUSULA 2ª - HONORÁRIOS
Pelos serviços ajustados, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A) o valor de R$ [VALOR], na forma [FORMA DE PAGAMENTO].

CLÁUSULA 3ª - RESCISÃO
Em caso de rescisão imotivada, serão devidos honorários proporcionais ao trabalho realizado.

[CIDADE], [DATA].

___________________________________
CONTRATANTE

___________________________________
CONTRATADO(A)`,
  },
];
