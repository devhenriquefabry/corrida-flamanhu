// Conteúdo único do regulamento — gera o .docx (build-docx.mjs) e o .pdf (build-pdf.mjs).
//
// Marcação inline usada nos textos:
//   {{texto}}   → dado a CONFIRMAR/PREENCHER (sai destacado em amarelo)
//   **texto**   → negrito
//
// Tipos de item:
//   c  cláusula numerada      s  subcláusula (recuada)
//   p  parágrafo solto        h  subtítulo dentro da seção
//   l  lista com marcadores   table  tabela

export const EVENTO = {
  titulo: 'REGULAMENTO OFICIAL',
  nome: 'CORRIDA FLAMANHU 2027',
  cidade: 'MANHUAÇU/MG',
  rodape: 'Corrida Flamanhu 2027 · Regulamento oficial · Organização Hennder Company · corridaflamanhu@gmail.com',
};

export const INFO = [
  ['Data', '15/05/2027 (sábado)'],
  ['Local', 'Praça Cordovil Pinto Coelho, Centro – Manhuaçu/MG'],
  ['Horários', 'Concentração: 07h30 | Corrida Kids: {{08h30}} | Largadas 3,0km (caminhada), 5km e 10km: 09h'],
  ['Organização', 'Hennder Company {{CNPJ}}'],
  ['Em parceria com', 'FlaManhu – Torcida Organizada do Flamengo em Manhuaçu'],
  ['Instagram', '@corrida_flamanhu'],
  ['E-mail', 'corridaflamanhu@gmail.com'],
  ['Site oficial', '{{endereço do site de inscrição}}'],
];

export const AVISO_HORARIOS = 'Estes horários são previstos; caso haja alteração, comunicamos com antecedência.';

export const SECOES = [
  {
    num: 1,
    titulo: 'Sobre a Corrida Flamanhu',
    itens: [
      { k: 'c', n: '1.1', t: 'A Corrida Flamanhu é uma corrida de rua **organizada pela Hennder Company** {{CNPJ}}, em parceria com a FlaManhu, torcida organizada do Flamengo em Manhuaçu/MG. O evento tem como objetivo incentivar o esporte, promover a saúde e fortalecer a união da torcida e da comunidade de Manhuaçu e região.' },
      { k: 'c', n: '1.2', t: 'A **Hennder Company é a organizadora do evento** e responsável, para todos os fins deste regulamento, pela sua realização, incluindo inscrições, cronometragem, estrutura, premiação e atendimento aos participantes. A **FlaManhu é parceira** do evento e apoia a mobilização e a divulgação junto à torcida, sem assumir a organização da prova.' },
      { k: 'c', n: '1.3', t: '**A Corrida Flamanhu é um evento independente. Não possui vínculo, patrocínio, apoio ou chancela oficial do Clube de Regatas do Flamengo.** Nomes, cores e símbolos que remetam ao clube são usados apenas como expressão da paixão da torcida e pertencem aos seus respectivos titulares.' },
      { k: 'c', n: '1.4', t: 'A edição de 2027 será no dia 15/05/2027, na Praça Cordovil Pinto Coelho, Centro de Manhuaçu/MG. Podem participar pessoas de todos os sexos, torcedoras do Flamengo ou não, desde que devidamente inscritas e que respeitem este regulamento.' },
      { k: 'c', n: '1.5', t: 'A prova conta com as distâncias de 3,0km na modalidade Caminhada Participativa, 5km e 10km de corrida, além da Corrida Kids para as crianças.' },
      { k: 'c', n: '1.6', t: 'A largada e a chegada acontecem na Praça Cordovil Pinto Coelho. O mapa do percurso será publicado no site oficial e nas redes sociais do evento antes da prova.' },
      { k: 'c', n: '1.7', t: 'Programação do dia:' },
      {
        k: 'table',
        cols: [20, 80],
        head: ['Horário', 'Atividade'],
        rows: [
          ['07h30', 'Abertura da arena e concentração da Nação'],
          ['{{08h30}}', 'Largada da Corrida Kids'],
          ['{{08h45}}', 'Aquecimento geral'],
          ['09h00', 'Largada oficial das provas de 3,0km, 5km e 10km'],
          ['11h00', 'Cerimônia de premiação'],
          ['11h30', 'Celebração: música, festa e confraternização'],
        ],
      },
    ],
  },
  {
    num: 2,
    titulo: 'Categorias de participação',
    itens: [
      { k: 'c', n: '2.1', t: '**Geral Masculino e Feminino** (5km e 10km): aberta a qualquer participante inscrito.' },
      { k: 'c', n: '2.2', t: '**PCD Masculino e Feminino** (5km e 10km): para pessoas com deficiência, mediante comprovação conforme o item 6.11.2.' },
      { k: 'c', n: '2.3', t: '**Faixa etária Masculino e Feminino** (5km e 10km): conforme as faixas descritas no item 8.4.' },
      { k: 'c', n: '2.4', t: '**Equipes:** conforme o item 8.5.' },
      { k: 'c', n: '2.5', t: '**Caminhada Participativa** (3,0km) e **Corrida Kids:** modalidades de caráter participativo, sem classificação por colocação.' },
      { k: 'c', n: '2.6', t: 'A Corrida Flamanhu **não possui categoria por local de residência**. Todos os atletas concorrem nas mesmas categorias, independentemente da cidade de origem.' },
    ],
  },
  {
    num: 3,
    titulo: 'Regras gerais do evento',
    itens: [
      { k: 'c', n: '3.1', t: 'Ao se inscrever, você declara que todas as informações fornecidas são verdadeiras e assume todos os custos com transporte, hospedagem, alimentação e qualquer outra despesa pessoal para participar do evento.' },
      { k: 'c', n: '3.2', t: 'Você também declara estar em condições físicas e mentais adequadas para participar da prova escolhida. Recomendamos fortemente que faça uma avaliação médica antes de correr.' },
      { k: 'c', n: '3.3', t: 'A participação é por sua conta e risco. Ao se inscrever, você isenta a Hennder Company, a FlaManhu, seus sócios e organizadores, patrocinadores e apoiadores de qualquer responsabilidade por acidentes ou problemas de saúde que possam ocorrer antes, durante ou após a prova.' },
      { k: 'c', n: '3.4', t: 'Sua inscrição é pessoal, individual e intransferível, não podendo ser cedida, vendida ou repassada para outra pessoa sob qualquer hipótese. Se desistir, você pode pedir reembolso em até 7 dias após a data da inscrição, como prevê o Código de Defesa do Consumidor. Passado esse prazo, não fazemos devolução do valor pago.' },
      { k: 's', n: '3.4.1', t: 'Correr com número de peito de outra pessoa configura fraude e resulta em desclassificação imediata, conforme o item 4.12 deste regulamento.' },
      { k: 'c', n: '3.5', t: 'Ao se inscrever, você autoriza que a organização envie comunicados sobre o evento por e-mail ou WhatsApp.' },
      { k: 'c', n: '3.6', t: 'Você também autoriza o uso da sua imagem em fotos e vídeos do evento para divulgação em qualquer mídia, sem limite de tempo e sem pagamento. Se quiser revogar essa autorização depois, é só enviar um pedido formal, conforme a Lei Geral de Proteção de Dados (LGPD).' },
      { k: 'c', n: '3.7', t: 'Teremos equipe de primeiros socorros {{e ambulância}} no local. Em caso de emergência, o atendimento será encaminhado para a rede pública de saúde de Manhuaçu (SAMU 192).' },
      { k: 'c', n: '3.8', t: 'A organização contará com equipe de staffs identificada para orientar os participantes e solicitará aos órgãos competentes de trânsito e segurança pública o apoio necessário ao evento. O percurso poderá ter interdição parcial das vias: respeite a sinalização e as orientações da equipe.' },
      { k: 'c', n: '3.9', t: 'Na arena do evento você encontrará banheiros {{químicos}} e guarda-volumes gratuito para os inscritos.' },
      { k: 'c', n: '3.10', t: 'O guarda-volumes funciona até 2 horas depois da largada. A organização não se responsabiliza por objetos deixados lá. Evite levar itens de valor.' },
      { k: 'c', n: '3.11', t: 'Por segurança, não guarde dinheiro, cartões, celulares, relógios ou joias no guarda-volumes.' },
      { k: 'c', n: '3.12', t: 'Não é permitido pular grades ou entrar em áreas isoladas pela organização.' },
      { k: 'c', n: '3.13', t: 'A Hennder Company e a FlaManhu não se responsabilizam por danos materiais ou físicos causados por você ou por terceiros durante o evento.' },
      { k: 'c', n: '3.14', t: 'O evento poderá ser adiado ou cancelado em caso de chuva forte, questões de segurança pública ou qualquer motivo de força maior.' },
      { k: 's', n: '3.14.1', t: 'Se isso acontecer, vamos remarcar para uma nova data. Nesse caso não haverá reembolso da inscrição, já que a prova será realizada posteriormente.' },
      { k: 'c', n: '3.15', t: 'Quem desrespeitar qualquer regra deste regulamento poderá ser desclassificado da prova.' },
      { k: 'c', n: '3.16', t: 'A organização não oferece seguro de vida ou de acidentes individual para os participantes. Contrate por conta própria se desejar.' },
    ],
  },
  {
    num: 4,
    titulo: 'Regras específicas da corrida',
    itens: [
      { k: 'c', n: '4.1', t: 'Idade mínima para participar:' },
      { k: 'l', items: [
        '**5km:** 14 anos completos até 31/12/2027.',
        '**10km:** 16 anos completos até 31/12/2027.',
        '**Caminhada 3,0km:** sem idade mínima, mas menores de 14 anos precisam estar acompanhados por um responsável.',
      ] },
      { k: 's', n: '4.1.1', t: 'O sistema de inscrição fará o bloqueio automático por idade. Não será possível se inscrever em distâncias incompatíveis com a data de nascimento informada.' },
      { k: 'c', n: '4.2', t: 'O uso do número de peito na frente da camiseta e do chip de cronometragem é obrigatório durante toda a prova. Você vai retirar os dois junto com o kit.' },
      { k: 'c', n: '4.3', t: 'Se você correr sem número de peito ou sem chip, seu resultado não será validado e você não aparecerá na classificação oficial.' },
      { k: 'c', n: '4.4', t: 'É obrigatório passar por todos os tapetes de cronometragem no percurso. Quem cortar caminho será desclassificado.' },
      { k: 'c', n: '4.5', t: 'Tempo limite de prova: 2 horas para todos os percursos.' },
      { k: 's', n: '4.5.1', t: 'Você pode largar com até 10 minutos de atraso. Depois disso, sua largada não será autorizada.' },
      { k: 's', n: '4.5.2', t: 'Se largar atrasado dentro dos 10 minutos, seu tempo de prova começa a contar a partir da largada oficial, às 09h.' },
      { k: 's', n: '4.5.3', t: 'Após 2 horas de prova, o pórtico de chegada e a cronometragem serão desligados.' },
      { k: 'c', n: '4.6', t: 'Você deve seguir exatamente o percurso sinalizado pela organização. Atalhos levam à desclassificação.' },
      { k: 'c', n: '4.7', t: 'A prova é individual. Não é permitido correr empurrando carrinhos, de bicicleta, skate, patins, acompanhado de animais ou receber ajuda de terceiros durante o percurso.' },
      { k: 's', n: '4.7.1', t: 'Entende-se como "ajuda externa" qualquer tipo de pacing feito por pessoas que não estão inscritas na prova.' },
      { k: 's', n: '4.7.2', t: 'Por segurança, não recomendamos o uso de fones de ouvido. Você precisa estar atento às orientações da equipe e à movimentação ao seu redor.' },
      { k: 'c', n: '4.8', t: 'Nenhum atleta recebe pagamento para participar. A premiação é apenas por troféu e valores descritos no item 8.' },
      { k: 'c', n: '4.9', t: 'Reforçamos: cuide da sua saúde. Se sentir qualquer mal-estar, pare e procure a equipe médica.' },
      { k: 'c', n: '4.10', t: 'A direção de prova pode convidar atletas de elite para participar.' },
      { k: 'c', n: '4.11', t: 'Só entram na classificação oficial os atletas que completarem a prova sem cometer infrações.' },
      { k: 'c', n: '4.12', t: 'Qualquer tipo de fraude, como correr com número de outra pessoa, trocar de chip ou pegar atalho, resulta em desclassificação imediata e banimento de edições futuras.' },
      { k: 'c', n: '4.13', t: 'Teremos pontos de hidratação com água ao longo do percurso e na chegada para todos os participantes.' },
    ],
  },
  {
    num: 5,
    titulo: 'Corrida Kids',
    itens: [
      { k: 'c', n: '5.1', t: 'A Corrida Kids acontece no dia 15/05/2027, às {{08h30}}. Podem participar crianças de 4 a 14 anos completos até 31/12/2027.' },
      { k: 'c', n: '5.2', t: 'As vagas são limitadas. Toda criança inscrita recebe kit e medalha de participação ao completar a prova.' },
      { k: 'c', n: '5.3', t: 'Distâncias por idade:' },
      {
        k: 'table',
        cols: [50, 50],
        head: ['Idade', 'Distância'],
        rows: [
          ['4 a 6 anos', '100 metros'],
          ['7 a 9 anos', '150 metros'],
          ['10 a 12 anos', '250 metros'],
          ['13 a 14 anos', '500 metros'],
        ],
      },
      { k: 's', n: '5.3.1', t: 'A concentração das crianças começa às {{08h00}} na arena.' },
      { k: 's', n: '5.3.2', t: 'Os horários podem ter pequenos ajustes conforme o andamento do evento.' },
      { k: 's', n: '5.3.3', t: 'A organização define quantas crianças correm por bateria para garantir a segurança de todos.' },
      { k: 'c', n: '5.4', t: 'O uso do número de peito é obrigatório também para as crianças. A Corrida Kids não utiliza chip de cronometragem por ter caráter exclusivamente participativo.' },
      { k: 'c', n: '5.5', t: 'Para crianças de até 6 anos, um responsável pode entrar na área de concentração para ajudar, mas não pode correr junto na pista.' },
      { k: 'c', n: '5.6', t: 'A Corrida Kids tem caráter participativo. Não marcamos tempo e todas as crianças ganham medalha.' },
      { k: 'c', n: '5.7', t: 'Ao inscrever a criança, o responsável declara que ela está em condições de saúde para participar da atividade.' },
      { k: 'c', n: '5.8', t: 'O responsável isenta a Hennder Company, a FlaManhu e a organização de qualquer responsabilidade sobre a criança durante o evento.' },
      { k: 'c', n: '5.9', t: 'Transporte, alimentação e demais custos da criança são de responsabilidade exclusiva dos pais ou responsáveis.' },
    ],
  },
  {
    num: 6,
    titulo: 'Inscrições',
    itens: [
      { k: 'c', n: '6.1', t: 'As inscrições vão até {{13/05/2027}} ou até acabarem as vagas. Faça a sua pelo site {{endereço do site de inscrição}}.' },
      { k: 'c', n: '6.2', t: 'Preencha todos os campos do formulário. Inscrições incompletas não serão validadas.' },
      { k: 'c', n: '6.3', t: 'Ao se inscrever você concorda com todas as regras deste regulamento.' },
      { k: 'c', n: '6.4', t: 'Toda inscrição passa por conferência da organização antes de ser confirmada.' },
      { k: 'c', n: '6.5', t: 'Sua inscrição só vale depois que o pagamento for aprovado pelo sistema.' },
      { k: 's', n: '6.5.1', t: 'Formas de pagamento: as inscrições poderão ser pagas via Pix e cartão de crédito, conforme opções disponibilizadas pela plataforma de inscrição no momento da compra.' },
      { k: 'c', n: '6.6', t: 'Leve o comprovante de pagamento impresso ou no celular para retirar o kit.' },
      { k: 'c', n: '6.7', t: 'Se encontrarmos algum dado inconsistente, vamos entrar em contato. Se você não responder, sua inscrição poderá ser cancelada.' },
      { k: 'c', n: '6.8', t: 'Informações falsas levam ao cancelamento imediato da inscrição, sem reembolso.' },
      { k: 'c', n: '6.9', t: 'Em caso de cancelamento pela organização, o valor é devolvido pela plataforma de inscrição.' },
      { k: 'c', n: '6.10', t: 'Outra pessoa pode fazer sua inscrição, mas precisa ter autorização por escrito sua e cópia do seu documento.' },
      { k: 'c', n: '6.11', t: 'Valores:' },
      {
        k: 'table',
        cols: [20, 40, 40],
        head: ['Lote', '3,0km, 5km e 10km', 'Kids'],
        rows: [
          ['1º lote', '{{R$ 00,00}}', '{{R$ 00,00}}'],
          ['2º lote', '{{R$ 00,00}}', '{{R$ 00,00}}'],
          ['3º lote', '{{R$ 00,00}}', '{{R$ 00,00}}'],
        ],
      },
      { k: 'p', t: '{{Taxa da plataforma cobrada à parte / já incluída no valor — definir.}}' },
      { k: 's', n: '6.11.1', t: 'As datas de virada de cada lote serão divulgadas no site oficial e no Instagram @corrida_flamanhu. A mudança de lote ocorre automaticamente pelo sistema ao atingir a data limite ou o número de vagas previsto para o lote.' },
      { k: 's', n: '6.11.2', t: '**Atletas PCD:** pessoas com deficiência têm direito a 50% de desconto sobre o valor do lote vigente. Para validar, é obrigatório anexar laudo médico atualizado que comprove a deficiência durante a inscrição online e apresentar o laudo original na retirada do kit.' },
      { k: 's', n: '6.11.3', t: '**Idosos com 60 anos ou mais:** pagam metade do valor, conforme o Estatuto da Pessoa Idosa. O desconto é aplicado automaticamente pela plataforma mediante informação da data de nascimento. Na retirada do kit é obrigatória a apresentação do documento de identidade original com foto para validação do benefício.' },
      { k: 's', n: '6.11.4', t: 'Os descontos de PCD e de idoso não são cumulativos entre si.' },
      { k: 's', n: '6.11.5', t: '**Cupons de desconto:** a organização poderá disponibilizar cupons promocionais, com as regras de cada cupom divulgadas junto com ele. O cupom é pessoal, deve ser informado no momento da inscrição e não pode ser aplicado depois de finalizada a compra. {{Definir se o cupom pode ser cumulado com os descontos de PCD e de idoso.}}' },
      { k: 'c', n: '6.12', t: 'A organização pode prorrogar ou encerrar as inscrições antes do prazo se atingir o limite técnico de participantes.' },
      { k: 'c', n: '6.13', t: 'A inscrição dá direito a participar da prova, usar toda a estrutura da arena, receber kit, medalha e concorrer à premiação.' },
      { k: 'c', n: '6.14', t: 'Menores de 18 anos só podem se inscrever com autorização por escrito dos pais ou responsáveis, que deve ser entregue na retirada do kit.' },
    ],
  },
  {
    num: 7,
    titulo: 'Retirada de kits',
    itens: [
      { k: 'c', n: '7.1', t: 'O kit contém camiseta oficial do evento, número de peito, chip de cronometragem {{, sacola}} e possíveis brindes de patrocinadores. Quem não retirar no prazo perde o direito ao kit.' },
      { k: 'c', n: '7.2', t: 'Datas e horários: {{13/05 das 14h às 20h e 14/05 das 09h às 18h}}. Local: {{local de retirada}}, que será divulgado no site e no Instagram @corrida_flamanhu até uma semana antes.' },
      { k: 'c', n: '7.3', t: 'Para retirar, apresente documento com foto e comprovante de inscrição. Se outra pessoa for retirar para você, ela precisa levar autorização assinada e cópia do seu documento.' },
      { k: 's', n: '7.3.1', t: 'Na Kids, o responsável deve apresentar o próprio documento e o comprovante de pagamento da criança.' },
      { k: 'c', n: '7.4', t: 'Não entregamos kit no dia da corrida, sem exceções. Programe-se.' },
      { k: 'c', n: '7.5', t: 'A escolha do tamanho de camiseta é feita na inscrição. Se acabar o seu tamanho, vamos oferecer a melhor opção disponível no momento da retirada.' },
      { k: 'c', n: '7.6', t: 'O kit pode incluir materiais de divulgação dos apoiadores.' },
      { k: 'c', n: '7.7', t: 'A medalha de participação é entregue apenas para quem completar a prova e cruzar o pórtico de chegada.' },
    ],
  },
  {
    num: 8,
    titulo: 'Premiação',
    itens: [
      { k: 'c', n: '8.1', t: 'Todo atleta que completar a prova dentro do tempo limite recebe medalha de participação.' },
      { k: 'c', n: '8.2', t: '**Premiação em dinheiro — Geral 5km e 10km, masculino e feminino:**' },
      {
        k: 'table',
        cols: [30, 70],
        head: ['Colocação', 'Prêmio'],
        rows: [
          ['1º lugar', 'Troféu + R$ 500,00'],
          ['2º lugar', 'Troféu + R$ 400,00'],
          ['3º lugar', 'Troféu + R$ 300,00'],
          ['4º lugar', 'Troféu + brinde'],
          ['5º lugar', 'Troféu + brinde'],
        ],
      },
      { k: 'c', n: '8.3', t: '**Categoria PCD — 5km e 10km, masculino e feminino:** troféu para o 1º, 2º e 3º lugares.' },
      { k: 'c', n: '8.4', t: '**Por faixa etária — 5km e 10km, masculino e feminino:** troféu do 1º ao 3º lugar.' },
      { k: 'p', t: 'Faixas de 5 em 5 anos: 14–19 | 20–24 | 25–29 | 30–34 | 35–39 | 40–44 | 45–49 | 50–54 | 55–59 | 60–64 | 65–69 | 70 anos ou mais.' },
      { k: 's', n: '8.4.1', t: 'A idade considerada é sempre a que o atleta terá até o dia 31 de dezembro de 2027, conforme regra oficial da CBAt.' },
      { k: 'c', n: '8.5', t: '**Equipes:** as 3 maiores equipes, contando apenas atletas que concluírem a prova, recebem troféu. Considera-se equipe o grupo de, no mínimo, {{5}} atletas inscritos sob o mesmo nome de equipe, informado no ato da inscrição.' },
      { k: 'c', n: '8.6', t: 'A Caminhada 3,0km não tem premiação por colocação. Todos que completam ganham medalha.' },
      { k: 'c', n: '8.7', t: 'A classificação geral considera o tempo bruto, ou seja, a ordem em que você cruzar a linha de chegada. As categorias de faixa etária usam o tempo líquido do chip.' },
      { k: 'c', n: '8.8', t: 'O resultado extraoficial sai na arena até 30 minutos depois da chegada do último atleta.' },
      { k: 's', n: '8.8.1', t: 'Se você tiver alguma reclamação sobre o resultado, fale com a cronometragem em até 15 minutos após a divulgação na arena.' },
      { k: 'c', n: '8.9', t: 'O pagamento da premiação em dinheiro é feito via Pix, para conta de titularidade do próprio atleta, em até {{10 dias úteis}} após a prova, mediante apresentação de documento com foto e CPF.' },
      { k: 'c', n: '8.10', t: 'Se não puder ficar para a cerimônia, você tem 30 dias para pedir seu troféu pelo e-mail corridaflamanhu@gmail.com. O envio é pelos Correios e o custo do frete é por sua conta.' },
      { k: 'c', n: '8.11', t: 'O resultado oficial completo entra no site em até 48 horas após a prova.' },
      { k: 's', n: '8.11.1', t: 'Reclamações sobre o resultado online devem ser enviadas para corridaflamanhu@gmail.com.' },
      { k: 's', n: '8.11.2', t: 'Toda reclamação precisa indicar qual item do regulamento foi descumprido.' },
      { k: 's', n: '8.11.3', t: 'Depois que a cerimônia de premiação termina, não aceitamos mais recursos sobre o pódio da categoria Geral.' },
      { k: 'c', n: '8.12', t: 'Um atleta não acumula premiações. Se você ganhar na Geral, não recebe também na faixa etária ou PCD. Vale sempre o prêmio de maior valor.' },
    ],
  },
  {
    num: 9,
    titulo: 'Conduta e convivência',
    itens: [
      { k: 'c', n: '9.1', t: 'A Corrida Flamanhu é um evento esportivo e familiar, aberto a todos. Torcedores de outros clubes são bem-vindos e devem ser tratados com respeito, assim como atletas, staffs, voluntários e moradores da região.' },
      { k: 'c', n: '9.2', t: 'É incentivado, mas não obrigatório, o uso da camiseta oficial do evento ou do manto rubro-negro durante a prova.' },
      { k: 'c', n: '9.3', t: 'É proibido, na arena e no percurso:' },
      { k: 'l', items: [
        'fogos de artifício, sinalizadores, rojões, bombas, tochas ou fumaça colorida;',
        'cânticos, gestos, faixas ou cartazes com conteúdo ofensivo, discriminatório (racismo, homofobia, xenofobia, machismo ou qualquer outra forma de preconceito) ou que incitem violência;',
        'provocações, agressões físicas ou verbais a qualquer pessoa;',
        'recipientes de vidro e objetos que possam ferir outros participantes.',
      ] },
      { k: 'c', n: '9.4', t: 'Bandeiras com mastro e instrumentos de percussão não são permitidos na pista durante a prova, por risco aos demais atletas. Podem ser usados na área de torcida indicada pela organização.' },
      { k: 'c', n: '9.5', t: 'Não é permitido participar da prova sob efeito de álcool ou outras substâncias que comprometam a segurança do atleta e dos demais participantes.' },
      { k: 'c', n: '9.6', t: 'O descumprimento deste item pode resultar em advertência, retirada da arena, desclassificação e banimento de edições futuras, sem direito a reembolso, sem prejuízo das medidas legais cabíveis.' },
    ],
  },
  {
    num: 10,
    titulo: 'Considerações finais',
    itens: [
      { k: 'c', n: '10.1', t: 'A organização pode ajustar itens deste regulamento por motivos técnicos ou de segurança. Qualquer mudança será publicada no site oficial.' },
      { k: 'c', n: '10.2', t: 'Os dados pessoais coletados na inscrição são usados somente para a organização do evento, a cronometragem, a divulgação de resultados e a comunicação com os participantes, em conformidade com a Lei Geral de Proteção de Dados (LGPD). A Hennder Company atua como controladora desses dados.' },
      { k: 'c', n: '10.3', t: 'Ficou com dúvida? Fale com a gente pelo e-mail corridaflamanhu@gmail.com ou no Instagram @corrida_flamanhu.' },
      { k: 'c', n: '10.4', t: 'Situações que não estão previstas aqui serão resolvidas pela comissão organizadora da Hennder Company. A decisão da comissão é final.' },
      { k: 'c', n: '10.5', t: 'Fica eleito o foro da comarca de Manhuaçu/MG para dirimir quaisquer questões decorrentes deste regulamento.' },
    ],
  },
];

export const ASSINATURA = {
  local: 'Manhuaçu/MG, 2027.',
  linhas: [
    'Organização: Hennder Company {{CNPJ / representante legal}}',
    'Em parceria com: FlaManhu – Torcida Organizada do Flamengo em Manhuaçu',
  ],
  nota: 'Evento independente, organizado pela Hennder Company em parceria com a FlaManhu, sem vínculo com o Clube de Regatas do Flamengo.',
};
