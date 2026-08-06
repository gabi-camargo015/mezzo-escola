/* ================================================================
   MEZZO ESCOLA DE MÚSICA — Interações globais
   Compatível com todas as páginas institucionais e de cursos.
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');
  const navCollapseElement = document.querySelector('.navbar-collapse');
  const navToggler = document.querySelector('.navbar-toggler');

  /** Atualiza o cabeçalho de acordo com a posição de rolagem. */
  const updateScrollElements = () => {
    const hasScrolled = window.scrollY > 24;
    header?.classList.toggle('is-scrolled', hasScrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 520);
  };

  updateScrollElements();
  window.addEventListener('scroll', updateScrollElements, { passive: true });

  /** Fecha o menu após selecionar um link em telas menores. */
  if (navCollapseElement && navToggler && window.bootstrap) {
    const mobileMenu = window.bootstrap.Collapse.getOrCreateInstance(navCollapseElement, { toggle: false });

    navCollapseElement.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) mobileMenu.hide();
      });
    });

    navCollapseElement.addEventListener('show.bs.collapse', () => document.body.classList.add('menu-open'));
    navCollapseElement.addEventListener('hide.bs.collapse', () => document.body.classList.remove('menu-open'));
  }

  /** Retorna ao início preservando animação suave. */
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /** Revela elementos quando entram na área visível. */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  /** Anima números de forma acessível, com fallback para redução de movimento. */
  const counters = document.querySelectorAll('.counter');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    if (reducedMotion) {
      counter.textContent = `${target}${suffix}`;
      return;
    }

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.floor(target * easedProgress)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /**
   * Filtro da galeria.
   * Cada item deve usar data-category com uma ou mais categorias separadas por espaço.
   */
  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.galleryFilter;
      filterButtons.forEach((item) => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      galleryItems.forEach((item) => {
        const categories = item.dataset.category?.split(' ') || [];
        const showItem = filter === 'todos' || categories.includes(filter);
        item.hidden = !showItem;
      });
    });
  });

  /** Lightbox de imagens da galeria, operável por teclado. */
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
  const closeLightboxButton = lightbox?.querySelector('[data-lightbox-close]');
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lastFocusedElement?.focus();
  };

  document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lastFocusedElement = trigger;
      lightboxImage.src = trigger.dataset.lightboxSrc || '';
      lightboxImage.alt = trigger.dataset.lightboxAlt || '';
      if (lightboxCaption) lightboxCaption.textContent = trigger.dataset.lightboxCaption || trigger.dataset.lightboxAlt || '';
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeLightboxButton?.focus();
    });
  });

  closeLightboxButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  /**
   * Validação amigável do formulário de contato.
   * Para envio real, defina data-form-endpoint no formulário com a URL do serviço escolhido.
   */
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactForm.classList.add('was-validated');

    if (!contactForm.checkValidity()) {
      formStatus?.replaceChildren('Revise os campos destacados antes de enviar.');
      formStatus?.classList.remove('is-success');
      formStatus?.classList.add('is-error');
      return;
    }

    const endpoint = contactForm.dataset.formEndpoint;
    if (!endpoint) {
      formStatus?.replaceChildren('Formulário pronto. Configure o destino de envio antes da publicação.');
      formStatus?.classList.remove('is-error');
      formStatus?.classList.add('is-success');
      return;
    }

    const submitButton = contactForm.querySelector('[type="submit"]');
    const originalLabel = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Não foi possível enviar a mensagem.');
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      formStatus?.replaceChildren('Mensagem enviada com sucesso. Em breve entraremos em contato.');
      formStatus?.classList.remove('is-error');
      formStatus?.classList.add('is-success');
    } catch (error) {
      formStatus?.replaceChildren('Não foi possível enviar agora. Tente novamente ou fale conosco pelos canais oficiais.');
      formStatus?.classList.remove('is-success');
      formStatus?.classList.add('is-error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    }
  });

  /** Atualiza automaticamente o ano no rodapé. */
  document.querySelectorAll('#currentYear').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
});
