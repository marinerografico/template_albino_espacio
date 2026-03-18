/**
 * MIRADA — Experiencia NFC editorial para Albino.
 * Estados: audioEnabled, accessibleMode.
 * Modo inmersivo: audio por sección, transiciones, haptic.
 * Modo accesible: sin autoplay, estructura semántica, labels claros.
 */
(function () {
  'use strict';

  var root = document.getElementById('mirada-page-root');
  var audioPlayer = document.getElementById('mirada-audio-player');
  var audioEnabled = false;
  var accessibleMode = false;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setAccessibleMode(on) {
    accessibleMode = !!on;
    document.body.classList.toggle('mirada-accessible', accessibleMode);
    var toggle = document.getElementById('btn-accessible-toggle');
    var msg = document.getElementById('accessible-mode-msg');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(accessibleMode));
      toggle.textContent = accessibleMode ? 'Modo accesible activado' : 'Usar modo accesible';
    }
    if (msg) msg.hidden = !accessibleMode;
    if (accessibleMode) setAudioEnabled(false);
  }

  function setAudioEnabled(on) {
    if (accessibleMode) on = false;
    audioEnabled = !!on;
    var btnOn = document.getElementById('btn-audio-on');
    var btnOff = document.getElementById('btn-audio-off');
    var status = document.getElementById('audio-status');
    var band = document.getElementById('mirada-audio-band');
    if (btnOn) btnOn.setAttribute('aria-pressed', String(audioEnabled));
    if (btnOff) btnOff.setAttribute('aria-pressed', String(!audioEnabled));
    if (status) status.hidden = !audioEnabled;
    if (band) {
      band.hidden = !audioEnabled;
      band.classList.toggle('mirada-audio-band-visible', audioEnabled);
    }
    document.querySelectorAll('.mirada-btn-audio, .learn-moment-audio').forEach(function (el) {
      el.hidden = !audioEnabled;
    });
    if (audioEnabled && navigator.vibrate) navigator.vibrate(50);
  }

  function getAudioUrl(key) {
    if (!root) return null;
    var attr = 'data-audio-' + key.replace(/_/g, '-');
    return root.getAttribute(attr) || null;
  }

  function playAudio(url) {
    if (!url || !audioPlayer) return;
    audioPlayer.src = url;
    audioPlayer.play().catch(function () {});
  }

  function vibrate(ms) {
    if (accessibleMode) return;
    if (navigator.vibrate) navigator.vibrate(ms || 30);
  }

  function initAccessibleToggle() {
    if (prefersReducedMotion()) setAccessibleMode(true);
    var toggle = document.getElementById('btn-accessible-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        setAccessibleMode(!accessibleMode);
      });
    }
  }

  function initAudioButtons() {
    var btnOn = document.getElementById('btn-audio-on');
    var btnOff = document.getElementById('btn-audio-off');
    if (btnOn) btnOn.addEventListener('click', function () {
      setAudioEnabled(true);
      vibrate(80);
      var url = getAudioUrl('intro');
      if (url && !accessibleMode) playAudio(url);
    });
    if (btnOff) btnOff.addEventListener('click', function () { setAudioEnabled(false); });
  }

  function initSectionAudioButtons() {
    document.getElementById('btn-audio-product')?.addEventListener('click', function () {
      playAudio(getAudioUrl('product'));
    });
    document.getElementById('btn-audio-nutrition')?.addEventListener('click', function () {
      playAudio(getAudioUrl('nutrition'));
    });
    document.getElementById('btn-audio-discover')?.addEventListener('click', function () {
      playAudio(getAudioUrl('discover'));
    });
    document.getElementById('btn-audio-outro')?.addEventListener('click', function () {
      playAudio(getAudioUrl('outro'));
    });
    document.querySelectorAll('.learn-moment-audio').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = btn.getAttribute('data-audio');
        playAudio(getAudioUrl('step_' + step));
        if (step === '3') vibrate(60);
      });
    });
  }

  function initQuickLinks() {
    document.querySelectorAll('.mirada-quick-links a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initNutritionToggle() {
    var btn = document.getElementById('btn-toggle-nutrition');
    var section = document.getElementById('nutrition-info');
    var btnSkip = document.getElementById('btn-skip-nutrition');
    if (!btn || !section) return;
    btn.addEventListener('click', function () {
      var hidden = section.hidden;
      section.hidden = !hidden;
      btn.setAttribute('aria-expanded', String(!hidden));
      btn.textContent = hidden ? 'Ocultar información nutricional' : 'Ver información nutricional';
      if (!hidden) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (btnSkip) btnSkip.addEventListener('click', function () {
      section.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Ver información nutricional';
      document.getElementById('discover-wine')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
    if (accessibleMode || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === 'undefined') return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('reveal-in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }

  function init() {
    setAudioEnabled(false);
    initAccessibleToggle();
    initAudioButtons();
    initSectionAudioButtons();
    initQuickLinks();
    initNutritionToggle();
    initForm();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
