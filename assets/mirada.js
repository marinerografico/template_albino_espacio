/**
 * MIRADA — Etiqueta digital expandida. Minimal, editorial.
 * Formulario y reveal suave.
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initForm() {
    var form = document.getElementById('form-miradas');
    var feedback = document.getElementById('form-miradas-feedback');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="mirada"]:checked');
      var textarea = form.querySelector('#tu-mirada');
      var mirada = selected ? selected.value : '';
      var tuMirada = textarea ? textarea.value.trim() : '';
      if (!mirada && !tuMirada) {
        if (feedback) {
          feedback.setAttribute('role', 'alert');
          feedback.textContent = 'Por favor, elige una opción o escribe tu mirada.';
          feedback.className = 'mirada-form-feedback mirada-form-feedback-error';
          form.querySelector('input[name="mirada"]')?.focus();
        }
        return;
      }
      if (feedback) {
        feedback.removeAttribute('role');
        feedback.setAttribute('role', 'status');
        feedback.textContent = '';
        feedback.className = 'mirada-form-feedback';
      }
      var endpoint = window.ALBINO_CONFIG?.miradasEndpoint;
      if (endpoint) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mirada: mirada, tu_mirada: tuMirada })
        }).then(function () {
          form.reset();
          if (feedback) {
            feedback.textContent = 'Gracias por compartir tu mirada.';
            feedback.className = 'mirada-form-feedback mirada-form-feedback-success';
          }
        }).catch(function () {
          if (feedback) {
            feedback.setAttribute('role', 'alert');
            feedback.textContent = 'No se pudo enviar. Inténtalo de nuevo.';
            feedback.className = 'mirada-form-feedback mirada-form-feedback-error';
          }
        });
      } else {
        form.reset();
        if (feedback) {
          feedback.textContent = 'Gracias por compartir tu mirada.';
          feedback.className = 'mirada-form-feedback mirada-form-feedback-success';
        }
      }
    });
  }

  function initReveal() {
    if (prefersReducedMotion()) return;
    if (typeof IntersectionObserver === 'undefined') return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('reveal-in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }

  function init() {
    initForm();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
