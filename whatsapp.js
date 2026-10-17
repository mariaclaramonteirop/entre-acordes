// Contatos oficiais do WhatsApp.
const WHATSAPP_NUMBERS = {
  primary: '5522981113417',
  secondary: '',
};

const WHATSAPP_MESSAGES = {
  budget: 'Olá! Tudo bem? Gostaria de solicitar um orçamento para a música do meu evento. Poderiam me enviar informações sobre disponibilidade, repertório e valores? Obrigada(o)!',
  general: 'Olá! Gostaria de conhecer melhor o trabalho musical da Entre Acordes.',
};

document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  const href = link.getAttribute('href');
  const decodedHref = decodeURIComponent(href);
  const isBudgetLink = /solicitar\s+um\s+orçamento/i.test(decodedHref)
    || link.classList.contains('btn-orcamento')
    || link.classList.contains('wpp-float')
    || link.classList.contains('btn-wpp');
  const message = isBudgetLink ? WHATSAPP_MESSAGES.budget : WHATSAPP_MESSAGES.general;
  link.href = `https://wa.me/${WHATSAPP_NUMBERS.primary}?text=${encodeURIComponent(message)}`;
});
