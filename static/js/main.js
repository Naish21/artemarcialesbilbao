// Menú móvil
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('is-open')));
}

// Reveals al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Año del footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Aviso de temporada: visible solo en julio (mes 6) y agosto (mes 7)
const seasonBar = document.getElementById('seasonBar');
if (seasonBar) {
  const month = new Date().getMonth();
  if (month === 6 || month === 7) seasonBar.hidden = false;
}

// Portada del manual: si la imagen remota no carga, muestra el texto de reserva
document.querySelectorAll('img[data-fallback]').forEach(function (img) {
  function showFallback() {
    img.style.display = 'none';
    const placeholder = img.nextElementSibling;
    if (placeholder) placeholder.style.display = 'grid';
  }
  if (img.complete && img.naturalWidth === 0) showFallback();
  img.addEventListener('error', showFallback);
});

// ---- Consentimiento de cookies (RGPD) --------------------------------------
// Guarda la elección y no carga el mapa de Google (ni otros embeds) sin permiso.
const AMBCookies = (function () {
  const KEY = 'amb_cookie_consent';
  const banner = document.getElementById('cookieBanner');

  function read() {
    try {
      return globalThis.localStorage.getItem(KEY);
    } catch {
      // localStorage puede no estar disponible (modo privado, etc.): se continúa sin recordar la elección
      return null;
    }
  }
  function write(value) {
    try {
      globalThis.localStorage.setItem(KEY, value);
    } catch {
      // Si no se puede guardar (modo privado, etc.), se ignora sin romper la web
    }
  }

  function activateEmbeds() {
    document.querySelectorAll('iframe[data-cookiesrc]').forEach(function (frame) {
      if (!frame.src) frame.src = frame.dataset.cookiesrc;
    });
    document.querySelectorAll('.map-wrap').forEach(function (wrap) {
      wrap.classList.add('is-consented');
    });
  }
  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  function accept() { write('accepted'); activateEmbeds(); hide(); }
  function reject() { write('rejected'); hide(); }
  function openBanner() { show(); }

  const consent = read();
  if (consent === 'accepted') {
    activateEmbeds();
  } else if (consent !== 'rejected') {
    show();
  }

  if (banner) {
    banner.querySelectorAll('[data-cookie]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.cookie === 'accept') {
          accept();
        } else {
          reject();
        }
      });
    });
  }

  return { accept: accept, reject: reject, open: openBanner };
})();
globalThis.AMBCookies = AMBCookies;

// Botones "Configurar cookies" / "Aceptar y ver el mapa" (delegación por data-*)
document.addEventListener('click', function (ev) {
  const trigger = ev.target.closest('[data-cookie-action]');
  if (!trigger) return;
  ev.preventDefault();
  if (trigger.dataset.cookieAction === 'accept') {
    AMBCookies.accept();
  } else {
    AMBCookies.open();
  }
});

// ---- Visor de imágenes de las galerías -------------------------------------
const lightbox = document.getElementById('lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const lbImg = lightbox.querySelector('.lightbox__img');

  document.addEventListener('click', function (ev) {
    const opener = ev.target.closest('.gallery__open');
    if (opener) {
      const inner = opener.querySelector('img');
      lbImg.src = opener.dataset.full;
      lbImg.alt = inner ? inner.alt : '';
      lightbox.showModal();
      return;
    }
    // Cerrar al pulsar la X o al hacer clic fuera de la imagen (sobre el fondo)
    if (ev.target.closest('[data-lightbox-close]') || ev.target === lightbox) {
      lightbox.close();
    }
  });

  // Liberar la imagen al cerrar
  lightbox.addEventListener('close', function () { lbImg.removeAttribute('src'); });
}
