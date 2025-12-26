export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}

export const categories = [
  "Todos",
  "Direito Previdenciário",
  "Direito Aéreo",
  "INSS",
  "Aposentadoria",
  "Dicas Jurídicas",
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "como-solicitar-aposentadoria-por-idade",
    title: "Como Solicitar Aposentadoria por Idade em 2025",
    excerpt: "Saiba todos os requisitos e documentos necessários para dar entrada na sua aposentadoria por idade junto ao INSS.",
    content: `
## O que é a Aposentadoria por Idade?

A aposentadoria por idade é um benefício previdenciário concedido pelo INSS aos trabalhadores que atingem determinada idade e cumprem o tempo mínimo de contribuição.

### Requisitos Atuais

Para solicitar a aposentadoria por idade, você precisa cumprir os seguintes requisitos:

- **Mulheres**: 62 anos de idade + 15 anos de contribuição
- **Homens**: 65 anos de idade + 15 anos de contribuição

### Documentos Necessários

1. Documento de identificação com foto (RG ou CNH)
2. CPF
3. Carteira de Trabalho (CTPS)
4. Comprovante de residência
5. Carnês de contribuição (se contribuinte individual)

### Como Dar Entrada

O pedido pode ser feito de forma 100% online através do aplicativo ou site Meu INSS. Caso prefira, você pode agendar atendimento presencial em uma agência do INSS.

### Dica Importante

Antes de solicitar sua aposentadoria, faça um planejamento previdenciário para garantir que está recebendo o melhor benefício possível. Muitas vezes, aguardar alguns meses pode resultar em um valor significativamente maior.

Se precisar de ajuda profissional, conte com nossa equipe especializada em Direito Previdenciário.
    `,
    category: "Aposentadoria",
    author: "Dra. Keliane Machado",
    date: "2025-01-10",
    readTime: "5 min",
  },
  {
    id: "2",
    slug: "direitos-passageiros-voo-cancelado",
    title: "Seus Direitos Quando o Voo é Cancelado",
    excerpt: "Entenda quais são seus direitos como passageiro em caso de cancelamento de voo e como solicitar indenização.",
    content: `
## Cancelamento de Voo: Conheça Seus Direitos

Quando uma companhia aérea cancela seu voo, você tem direitos garantidos por lei. Entenda o que fazer e como ser indenizado.

### O Que a Companhia Aérea Deve Oferecer

Dependendo do tempo de espera, a empresa deve oferecer:

- **A partir de 1 hora**: Facilidades de comunicação (internet, telefone)
- **A partir de 2 horas**: Alimentação (voucher ou refeição)
- **A partir de 4 horas**: Hospedagem e transporte de ida/volta

### Opções do Passageiro

Em caso de cancelamento, você pode optar por:

1. Reembolso integral da passagem
2. Reacomodação em outro voo (da mesma empresa ou de outra)
3. Execução do serviço por outra modalidade de transporte

### Indenização por Danos Morais

Além das assistências, você pode ter direito a indenização por danos morais se:

- Perdeu compromissos importantes
- Teve prejuízos financeiros comprovados
- Sofreu constrangimento ou tratamento inadequado

### Como Solicitar Seus Direitos

Guarde todos os comprovantes: cartões de embarque, e-mails, comprovantes de gastos extras e fotos do painel de voos. Esses documentos são essenciais para comprovar seu direito.

Nossa equipe está pronta para ajudá-lo a obter a indenização que você merece.
    `,
    category: "Direito Aéreo",
    author: "Dra. Keliane Machado",
    date: "2025-01-08",
    readTime: "4 min",
  },
  {
    id: "3",
    slug: "bpc-loas-quem-tem-direito",
    title: "BPC/LOAS: Quem Tem Direito ao Benefício Assistencial?",
    excerpt: "Descubra se você ou alguém da sua família tem direito ao Benefício de Prestação Continuada (BPC/LOAS).",
    content: `
## O Que é o BPC/LOAS?

O Benefício de Prestação Continuada (BPC), também conhecido como LOAS, é um benefício assistencial no valor de um salário mínimo pago mensalmente.

### Quem Pode Receber?

O BPC é destinado a dois grupos:

1. **Idosos**: Com 65 anos ou mais
2. **Pessoas com Deficiência**: De qualquer idade, com impedimento de longo prazo

### Requisitos de Renda

Para ter direito ao BPC, a renda per capita familiar deve ser:

- Inferior a 1/4 do salário mínimo por pessoa
- Em alguns casos, o STF reconhece o direito com renda superior, se comprovada a vulnerabilidade

### Como é Feito o Cálculo

A renda familiar é dividida pelo número de pessoas que moram na mesma casa. Não entram no cálculo:

- Benefícios assistenciais de outros membros
- Bolsa Família
- Em alguns casos, aposentadoria de um salário mínimo de idoso

### Documentação Necessária

- CPF de todos os membros da família
- Comprovante de renda de todos
- Comprovante de residência
- Laudo médico (para pessoas com deficiência)

O BPC não é aposentadoria e não deixa pensão por morte. Por isso, é importante fazer um planejamento com um advogado especializado.
    `,
    category: "INSS",
    author: "Dra. Keliane Machado",
    date: "2025-01-05",
    readTime: "6 min",
  },
  {
    id: "4",
    slug: "revisao-aposentadoria-vale-pena",
    title: "Revisão de Aposentadoria: Quando Vale a Pena?",
    excerpt: "Muitos aposentados recebem valores menores do que deveriam. Saiba quando a revisão pode aumentar seu benefício.",
    content: `
## Revisão de Aposentadoria

Milhares de brasileiros recebem aposentadorias com valores inferiores ao que teriam direito. A revisão pode corrigir isso.

### Principais Tipos de Revisão

1. **Revisão da Vida Toda**: Considera todas as contribuições anteriores a 1994
2. **Revisão de Atividades Concomitantes**: Para quem tinha dois empregos
3. **Revisão por Erro de Cálculo**: Quando o INSS calculou errado
4. **Revisão por Atividade Especial**: Reconhecimento de tempo especial não computado

### Quando Vale a Pena Revisar?

A revisão pode valer a pena se você:

- Teve salários altos antes de 1994
- Trabalhou em dois empregos simultaneamente
- Exerceu atividade insalubre ou perigosa
- Desconfia de erro no cálculo

### Prazo para Solicitar

O prazo para pedir revisão é de **10 anos** a partir do primeiro pagamento do benefício. Após esse prazo, o direito à revisão prescreve.

### Como Funciona o Processo

1. Análise dos documentos e histórico contributivo
2. Cálculo comparativo do benefício
3. Identificação da melhor tese revisional
4. Entrada com pedido administrativo ou judicial

Não deixe passar o prazo! Consulte um advogado previdenciário para avaliar seu caso.
    `,
    category: "Direito Previdenciário",
    author: "Dra. Keliane Machado",
    date: "2025-01-02",
    readTime: "5 min",
  },
  {
    id: "5",
    slug: "extravio-bagagem-como-proceder",
    title: "Extravio de Bagagem: O Que Fazer e Como Ser Indenizado",
    excerpt: "Sua mala foi extraviada? Saiba exatamente como agir para garantir seus direitos e receber indenização.",
    content: `
## Bagagem Extraviada: Passo a Passo

O extravio de bagagem é uma das situações mais frustrantes em viagens. Saiba como proceder para garantir seus direitos.

### Ação Imediata no Aeroporto

1. Procure o balcão da companhia aérea imediatamente
2. Preencha o Registro de Irregularidade de Bagagem (RIB)
3. Guarde uma cópia do documento
4. Anote protocolo e nome do atendente

### Prazos da Companhia Aérea

A empresa tem prazo para localizar sua bagagem:

- **Voos nacionais**: 7 dias
- **Voos internacionais**: 21 dias

### Assistência Imediata

Enquanto aguarda a localização, você tem direito a:

- Ressarcimento de itens de primeira necessidade
- Adiantamento de valores para compras essenciais

### Indenização por Danos

Se a bagagem não for localizada ou for devolvida danificada:

- **Danos materiais**: Valor dos itens perdidos
- **Danos morais**: Pelo transtorno causado

### Valores de Indenização

Em voos nacionais, a indenização pode chegar a valores significativos, especialmente se você declarou o conteúdo da bagagem. A jurisprudência brasileira tem sido favorável aos passageiros.

Guarde todos os comprovantes de compras e documentos. Nossa equipe pode ajudá-lo a obter a indenização justa.
    `,
    category: "Direito Aéreo",
    author: "Dra. Keliane Machado",
    date: "2024-12-28",
    readTime: "4 min",
  },
  {
    id: "6",
    slug: "auxilio-doenca-como-conseguir",
    title: "Auxílio-Doença: Como Conseguir o Benefício",
    excerpt: "Está incapacitado para o trabalho? Entenda como funciona o auxílio-doença e como dar entrada no pedido.",
    content: `
## Auxílio-Doença: Guia Completo

O auxílio-doença é um benefício pago pelo INSS ao trabalhador que fica temporariamente incapacitado para o trabalho por mais de 15 dias.

### Requisitos Básicos

Para ter direito ao auxílio-doença, você precisa:

1. Estar incapacitado para o trabalho
2. Ter qualidade de segurado
3. Cumprir carência de 12 contribuições (exceto acidentes e doenças graves)

### Carência Dispensada

Algumas doenças dispensam a carência de 12 meses:

- Tuberculose
- Hanseníase
- AIDS
- Câncer
- E outras listadas em lei

### Como Solicitar

1. Acesse o Meu INSS (app ou site)
2. Agende a perícia médica
3. Reúna documentação médica completa
4. Compareça à perícia na data agendada

### Documentação Importante

- Atestados médicos com CID
- Exames e laudos recentes
- Prontuários médicos
- Receitas de medicamentos

### Se o Pedido For Negado

Se o INSS negar seu pedido, você pode:

1. Entrar com recurso administrativo
2. Ajuizar ação judicial

Muitos benefícios negados são concedidos na Justiça. Um advogado especializado pode fazer a diferença no seu caso.
    `,
    category: "INSS",
    author: "Dra. Keliane Machado",
    date: "2024-12-20",
    readTime: "5 min",
  },
];
