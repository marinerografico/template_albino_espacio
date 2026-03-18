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
    var toggles = document.querySelectorAll('#btn-accessible-toggle, #btn-accessible-hero');
    var msg = document.getElementById('accessible-mode-msg');
    toggles.forEach(function (t) {
      t.setAttribute('aria-pressed', String(accessibleMode));
      t.setAttribute('aria-label', accessibleMode ? 'Desactivar modo accesible' : 'Usar modo accesible');
      t.textContent = accessibleMode ? 'Modo accesible activado' : 'Modo accesible';
    });
    if (msg) msg.hidden = !accessibleMode;
    if (accessibleMode) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(audioEnabled);
    }
  }

  function setAudioEnabled(on) {
    if (accessibleMode) on = false;
    audioEnabled = !!on;
    var btnToggle = document.getElementById('btn-audio-toggle');
    var heroActions = document.getElementById('hero-audio-actions');
    var status = document.getElementById('audio-status');
    var band = document.getElementById('mirada-audio-band');
    if (btnToggle) {
      btnToggle.hidden = !!accessibleMode;
      btnToggle.setAttribute('aria-pressed', String(audioEnabled));
      btnToggle.setAttribute('aria-label', audioEnabled ? 'Desactivar audio' : 'Activar experiencia sonora');
      btnToggle.textContent = audioEnabled ? 'Desactivar audio' : 'Activar experiencia sonora';
    }
    if (status) status.hidden = !audioEnabled;
    if (band) {
      band.hidden = !audioEnabled;
      band.classList.toggle('mirada-audio-band-visible', audioEnabled);
    }
    document.querySelectorAll('.mirada-btn-audio').forEach(function (el) {
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

  function initAudioEnded() {
    if (!audioPlayer) return;
    audioPlayer.addEventListener('ended', function () {
      if (learnAudioIndex > 0 && learnAudioIndex < LEARN_AUDIO_ORDER.length) {
        if (LEARN_AUDIO_ORDER[learnAudioIndex - 1] === 'step_3') vibrate(60);
        playNextLearnStep();
      } else if (learnAudioIndex >= LEARN_AUDIO_ORDER.length) {
        learnAudioIndex = 0;
      }
    });
  }

  function vibrate(ms) {
    if (accessibleMode) return;
    if (navigator.vibrate) navigator.vibrate(ms || 30);
  }

  function initAccessibleToggle() {
    if (prefersReducedMotion()) setAccessibleMode(true);
    document.querySelectorAll('#btn-accessible-toggle, #btn-accessible-hero').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        setAccessibleMode(!accessibleMode);
      });
    });
  }

  var LEARN_AUDIO_ORDER = ['step_1', 'step_2', 'step_3', 'step_4'];
  var learnAudioIndex = 0;

  function playNextLearnStep() {
    if (learnAudioIndex >= LEARN_AUDIO_ORDER.length) {
      learnAudioIndex = 0;
      return;
    }
    var url = getAudioUrl(LEARN_AUDIO_ORDER[learnAudioIndex]);
    if (url) {
      playAudio(url);
      learnAudioIndex++;
    }
  }

  function initAudioButtons() {
    var btnToggle = document.getElementById('btn-audio-toggle');
    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        if (audioEnabled) {
          setAudioEnabled(false);
        } else {
          setAudioEnabled(true);
          vibrate(80);
          var url = getAudioUrl('intro');
          if (url && !accessibleMode) playAudio(url);
        }
      });
    }
  }

  function initSectionAudioButtons() {
    document.getElementById('btn-audio-product')?.addEventListener('click', function () {
      playAudio(getAudioUrl('product'));
    });
    var btnLearn = document.getElementById('btn-audio-learn');
    if (btnLearn) {
      btnLearn.addEventListener('click', function () {
        learnAudioIndex = 0;
        var introUrl = getAudioUrl('learn_intro');
        if (introUrl) {
          audioPlayer.addEventListener('ended', function onIntroEnd() {
            audioPlayer.removeEventListener('ended', onIntroEnd);
            playNextLearnStep();
          }, { once: true });
          playAudio(introUrl);
        } else {
          playNextLearnStep();
        }
      });
    }
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
    if (!btn || !section) return;
    btn.addEventListener('click', function () {
      var hidden = section.hidden;
      section.hidden = !hidden;
      btn.setAttribute('aria-expanded', String(!hidden));
      btn.textContent = hidden ? 'Ocultar información nutricional' : 'Ver información nutricional';
      if (!hidden) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    initAudioEnded();
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
