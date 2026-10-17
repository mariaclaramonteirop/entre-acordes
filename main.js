/* =============================================
   main.js – Entre Acordes
   Navbar dinâmica, carrossel de fotos/vídeos,
   modal de lightbox, menu mobile, FAQ accordion,
   formulário de contato com envio para WhatsApp.
   ============================================= */

// ── NAVBAR DINÂMICA COM INDICADOR DE SEÇÃO ATIVA ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Destacar link ativo conforme a página/scroll
const navLinksAnchors = document.querySelectorAll('.nav-links a:not(.btn-orcamento)');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinksAnchors.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── MENU MOBILE ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── CARROSSEL DE GALERIA ──
const track = document.getElementById('carousel-track');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const dotsContainer = document.getElementById('carousel-dots');

if (track && prevBtn && nextBtn) {
  const slides = Array.from(track.children);
  let currentIndex = 0;

  function getSlidesVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getSlidesVisible());
  }

  // Criar pontinhos
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const totalDots = getMaxIndex() + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function moveToSlide(index) {
    const max = getMaxIndex();
    currentIndex = Math.min(Math.max(index, 0), max);
    
    // Obter largura do primeiro slide + gap
    const slide = slides[0];
    if (!slide) return;
    const slideWidth = slide.getBoundingClientRect().width;
    const gap = 20;
    const amount = (slideWidth + gap) * currentIndex;
    
    track.style.transform = `translateX(-${amount}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    } else {
      moveToSlide(getMaxIndex()); // loop para o final
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      moveToSlide(currentIndex + 1);
    } else {
      moveToSlide(0); // loop para o início
    }
  });

  window.addEventListener('resize', () => {
    renderDots();
    moveToSlide(currentIndex);
  });

  renderDots();

  // Suporte a swipe em mobile
  let startX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 40) {
      nextBtn.click();
    } else if (diff < -40) {
      prevBtn.click();
    }
    isSwiping = false;
  }, { passive: true });
}

// ── MODAL DE MÍDIA (LIGHTBOX) ──
const modal = document.getElementById('media-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
const modalCaption = document.getElementById('modal-caption');

if (modal) {
  function openModal(slide) {
    const type = slide.getAttribute('data-type') || 'image';
    const title = slide.getAttribute('data-title') || 'Momento Especial';
    
    modalCaption.textContent = title;
    modalContent.innerHTML = '';

    const img = slide.querySelector('img');
    const video = slide.querySelector('video');

    if (img) {
      const clone = img.cloneNode(true);
      clone.style.display = 'block';
      modalContent.appendChild(clone);
    } else if (video) {
      const vid = document.createElement('video');
      vid.src = video.src;
      vid.controls = true;
      vid.autoplay = true;
      modalContent.appendChild(vid);
    } else {
      // Exibição amigável para quando o usuário ainda não adicionou a mídia real
      const placeholder = document.createElement('div');
      placeholder.className = 'modal-preview-placeholder';
      placeholder.innerHTML = `
        <span class="icon">${type === 'video' ? '🎥' : '📷'}</span>
        <p><strong>${title}</strong></p>
        <span style="font-size:0.85rem;color:#C9A96E;letter-spacing:0.1em;text-transform:uppercase;">Prévia em alta resolução</span>
        <span style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:8px;">Substitua o arquivo na pasta correspondente para ver a foto ou o vídeo real da sua apresentação!</span>
      `;
      modalContent.appendChild(placeholder);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Pausar vídeos ao fechar
    const vids = modalContent.querySelectorAll('video');
    vids.forEach(v => v.pause());
  }

  document.querySelectorAll('.carousel-slide').forEach(slide => {
    slide.addEventListener('click', () => openModal(slide));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-pergunta').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-resposta');
    const icon   = btn.querySelector('.faq-icon');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-item').forEach(i => {
      i.querySelector('.faq-pergunta').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-resposta').style.maxHeight = null;
      i.querySelector('.faq-icon').textContent = '+';
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.textContent = '−';
    }
  });
});

// ── FORMULÁRIO DE CONTATO (COM ENVIO DIRETO AO WHATSAPP) ──
const form    = document.getElementById('contato-form');
const success = document.getElementById('form-success');
const telefoneInput = document.getElementById('telefone');

function aplicarMascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);

  if (numeros.length <= 2) {
    return numeros.length ? `(${numeros}` : '';
  }
  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }
  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

if (telefoneInput) {
  telefoneInput.addEventListener('input', () => {
    telefoneInput.value = aplicarMascaraTelefone(telefoneInput.value);
  });
}

if (form && success) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      nome_noivo:     form.nome_noivo?.value.trim()     || '',
      nome_noiva:     form.nome_noiva?.value.trim()     || '',
      telefone:       form.telefone?.value.trim()       || '',
      tipo_evento:    form.tipo_evento?.value           || '',
      data_evento:    form.data_evento?.value           || '',
      horario_evento: form.horario_evento?.value        || '',
      local:          form.local?.value.trim()          || '',
      mensagem:       form.mensagem?.value.trim()       || '',
    };

    const telefoneNumeros = data.telefone.replace(/\D/g, '');

    if (!data.nome_noivo || !telefoneNumeros || !data.tipo_evento || !data.data_evento || !data.horario_evento) {
      alert('Por favor, preencha os campos obrigatórios (marcados com *).');
      return;
    }
    if (telefoneNumeros.length < 10) {
      alert('Por favor, informe um WhatsApp ou telefone válido com DDD.');
      return;
    }

    const nomesFormatados = data.nome_noiva 
      ? `${data.nome_noivo} & ${data.nome_noiva}` 
      : data.nome_noivo;

    const tipoFormatado = {
      'casamento-catolico': 'Casamento Católico',
      'casamento-civil': 'Casamento Civil',
      'missa-15-anos': 'Missa de 15 Anos',
      'recepcao': 'Recepção / Festa',
      'aniversario': 'Aniversário / Bodas',
      'outro': 'Outro Evento'
    }[data.tipo_evento] || data.tipo_evento;

    let infoDataHora = '';
    if (data.data_evento) {
      infoDataHora += `\n*Data:* ${formatarData(data.data_evento)}`;
    }
    if (data.horario_evento) {
      infoDataHora += `\n*Horário:* ${data.horario_evento}h`;
    }

    let msgDetalhes = data.mensagem ? `\n\n*Mensagem / Detalhes:*\n${data.mensagem}` : '';

    const wppMsg = encodeURIComponent(
`Olá, Entre Acordes!

Gostaria de solicitar um orçamento:

*Nome(s):* ${nomesFormatados}
*Telefone:* ${data.telefone}
*Evento:* ${tipoFormatado}${infoDataHora}${data.local ? '\n*Local:* ' + data.local : ''}${msgDetalhes}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBERS.primary}?text=${wppMsg}`, '_blank');

    form.style.display = 'none';
    success.style.display = 'block';
  });
}

function formatarData(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

// ── ANIMAÇÃO DE ENTRADA SUAVE (Intersection Observer) ──
const animados = document.querySelectorAll(
  '.servico-card, .membro-card, .valor-item, .faq-item, .contato-item, .carousel-container'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animados.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}
