// Contatos oficiais do WhatsApp.
const WHATSAPP_NUMBERS = {
  primary: '5522981113417',
  secondary: '',
};

document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  const href = link.getAttribute('href');
  const queryStart = href.indexOf('?');
  const suffix = queryStart >= 0 ? href.substring(queryStart) : '';
  link.href = `https://wa.me/${WHATSAPP_NUMBERS.primary}${suffix}`;
});
