/**
 * Reveal on scroll via IntersectionObserver.
 * Respeta prefers-reduced-motion (clases aplicadas; CSS ya desactiva animación).
 * Para las líneas de ESPACIO (DEJAR SITIO / a lo esencial / A LA TIERRA...)
 * añade un efecto de "máquina de escribir" suave.
 */
(function () {
  function typeWriter(el, options) {
    if (!el || el.getAttribute('data-typed') === '1') return;
    var text = (el.getAttribute('data-full-text') || el.textContent || '').trim();
    el.setAttribute('data-full-text', text);
    el.setAttribute('data-typed', '1');
    el.textContent = '';
    var speed = options && options.speed || 40;
    var delay = options && options.delay || 0;
    var i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 1;
        setTimeout(step, speed);
      }
    }
    setTimeout(step, delay);
  }

  function triggerEspacioTyping(target) {
    if (!target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ORIGEN hero title (nosotros page)
    var origenHero = target.querySelector('.origen-hero-line');
    if (origenHero) {
      typeWriter(origenHero, { speed: 40, delay: 150 });
    }

    var isLine1 = target.classList.contains('espacio-line-1');
    var isLine2 = target.classList.contains('espacio-line-2');
    if (isLine1) {
      var subline = target.querySelector('[data-bind="claims.espacioSubline"]');
      if (subline) {
        typeWriter(subline, { speed: 35, delay: 120 });
      } else {
        var title = target.querySelector('[data-bind="claims.tagline1Title"]');
        var subtitle = target.querySelector('[data-bind="claims.tagline1Subtitle"]');
        if (title) typeWriter(title, { speed: 35, delay: 120 });
        if (subtitle) typeWriter(subtitle, { speed: 35, delay: 600 });
      }
    }
    if (isLine2) {
      var tagline2 = target.querySelector('[data-bind="claims.tagline2"]');
      typeWriter(tagline2, { speed: 35, delay: 150 });
    }
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-subtle, .reveal-editorial').forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          triggerEspacioTyping(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-subtle, .reveal-editorial').forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
