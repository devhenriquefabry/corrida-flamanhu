import { withBase } from '../utils/withBase';

// Dados do evento usados nas telas e nas mensagens enviadas aos atletas.
// O worker (backend/worker) tem o espelho destes valores em wrangler.toml
// [vars] — ao mudar algo aqui, mude lá também.
// Campo vazio = a linha correspondente some das mensagens.
export const EVENTO = {
  nome: 'Corrida Flamanhu 2026',
  data: '', // ex.: '12/09'
  local: '', // ex.: 'Praça Cordovil Pinto Coelho'
  emailContato: 'contato@corridaflamanhu.com.br',
  grupoWhatsAppUrl: '', // link de convite do grupo de participantes
  instagramUrl: '',
  // WhatsApp da equipe de boas-vindas, só dígitos com DDI: '5533999999999'
  whatsappBoasVindas: '',
  // Nome da instância na Evolution API (o número de WhatsApp do evento)
  whatsappInstancia: 'flamanhu',
};

// Link da página de pagamento de uma inscrição. Usa o endereço em que o site
// está aberto, então funciona igual no GitHub Pages e num domínio próprio.
export const buildPaymentPageUrl = (registrationId: string) =>
  `${window.location.origin}${withBase(`/inscricao/pagamento/${registrationId}`)}`;

export const buildPaymentConfirmationText = (nome: string, modalidadeNome: string) => {
  const modalidade = String(modalidadeNome || '').trim() || EVENTO.nome;
  // null = linha omitida; '' = linha em branco proposital
  const linhas = [
    'Pagamento confirmado!',
    '',
    `Olá ${nome || 'Atleta'}! Sua inscrição na ${EVENTO.nome} está garantida.`,
    '',
    EVENTO.data ? `Data: ${EVENTO.data}` : null,
    EVENTO.local ? `Local: ${EVENTO.local}` : null,
    `Modalidade: ${modalidade}`,
    '',
    EVENTO.grupoWhatsAppUrl ? `Entre no grupo exclusivo de participantes no WhatsApp para ficar por dentro de todos os detalhes da corrida:\n${EVENTO.grupoWhatsAppUrl}\n` : null,
    EVENTO.instagramUrl ? `Nos acompanhe pelas redes sociais:\nInstagram: ${EVENTO.instagramUrl}\n` : null,
    'Compartilhe seu card #EUVOU em todas as redes sociais!',
  ];
  return linhas.filter((l) => l !== null).join('\n');
};
