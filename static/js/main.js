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

// ---- Consentimiento de cookies (RGPD) --------------------------------------
// Guarda la elección y no carga el mapa de Google (ni otros embeds) sin permiso.
const AMBCookies = (function () {
  const KEY = 'amb_cookie_consent';
  const banner = document.getElementById('cookieBanner');

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function activateEmbeds() {
    document.querySelectorAll('iframe[data-cookiesrc]').forEach(function (f) {
      if (!f.src) f.src = f.getAttribute('data-cookiesrc');
    });
    document.querySelectorAll('.map-wrap').forEach(function (w) { w.classList.add('is-consented'); });
  }
  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  function accept() { save('accepted'); activateEmbeds(); hide(); }
  function reject() { save('rejected'); hide(); }
  function open() { show(); }

  function init() {
    const c = get();
    if (c === 'accepted') activateEmbeds();
    else if (c !== 'rejected') show();
    if (banner) {
      banner.querySelectorAll('[data-cookie]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          btn.getAttribute('data-cookie') === 'accept' ? accept() : reject();
        });
      });
    }
  }

  init();
  return { accept: accept, reject: reject, open: open };
})();
window.AMBCookies = AMBCookies;
