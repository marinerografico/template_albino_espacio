/**
 * MIRADA — Lógica para la experiencia NFC de Albino (Shopify).
 * Estado: audioEnabled (true/false). Sin autoplay.
 * Los botones usan data-audio-url (URL completa) o data-audio (nombre + base).
 */
(function () {
  var audioEnabled = false;
  var audioPlayer = document.getElementById('mirada-audio-player');
  var btnAudioOn = document.getElementById('btn-audio-on');
  var btnAudioOff = document.getElementById('btn-audio-off');
  var audioStatus = document.getElementById('audio-status');
  var nutritionSection = document.getElementById('nutrition-info');
  var btnToggleNutrition = document.getElementById('btn-toggle-nutrition');
  var form = document.getElementById('form-miradas');
  var btnGuidedTour = document.getElementById('btn-guided-tour');

  function setAudioEnabled(enabled) {
    audioEnabled = !!enabled;
    if (btnAudioOn) btnAudioOn.setAttribute('aria-pressed', String(audioEnabled));
    if (btnAudioOff) btnAudioOff.setAttribute('aria-pressed', String(!audioEnabled));
    if (audioStatus) audioStatus.hidden = !audioEnabled;
    if (btnGuidedTour) btnGuidedTour.hidden = !audioEnabled;
    var band = document.getElementById('mirada-audio-band');
    if (band) {
      band.hidden = !audioEnabled;
      band.classList.toggle('-translate-y-full', !audioEnabled);
      band.classList.toggle('translate-y-0', audioEnabled);
    }
  }

  function initModeButtons() {
    if (btnAudioOn) btnAudioOn.addEventListener('click', function () { setAudioEnabled(true); });
    if (btnAudioOff) btnAudioOff.addEventListener('click', function () { setAudioEnabled(false); });
    if (btnGuidedTour) btnGuidedTour.addEventListener('click', function () {
      var step1 = document.getElementById('step-1');
      if (step1) {
        guidedScrollActive = true;
        playStepAndContinue(step1);
      }
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

  function initProductModal() {
    var triggerBtns = document.querySelectorAll('#btn-product-popup, #btn-product-popup-info');
    var modal = document.getElementById('mirada-product-modal');
    var iframe = document.getElementById('mirada-product-iframe');
    var closeBtn = document.getElementById('mirada-product-modal-close');
    if (!triggerBtns.length || !modal || !iframe) return;
    function openModal(btn) {
      var url = btn && btn.getAttribute('data-product-url');
      if (url) {
        if (url.charAt(0) === '/') url = window.location.origin + url;
        iframe.src = url;
      }
      modal.classList.remove('pointer-events-none');
      modal.classList.add('opacity-100');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.add('pointer-events-none');
      modal.classList.remove('opacity-100');
      modal.setAttribute('aria-hidden', 'true');
      iframe.src = '';
      document.body.style.overflow = '';
    }
    triggerBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  function initNutritionToggle() {
    if (!btnToggleNutrition || !nutritionSection) return;
    btnToggleNutrition.addEventListener('click', function () {
      var isHidden = nutritionSection.hidden;
      nutritionSection.hidden = !isHidden;
      btnToggleNutrition.setAttribute('aria-expanded', String(!isHidden));
      btnToggleNutrition.textContent = isHidden ? 'Ocultar información nutricional' : 'Ver información nutricional';
    });
  }

  function getNextStepArticle(currentArticle) {
    if (!currentArticle || !currentArticle.id) return null;
    var match = currentArticle.id.match(/step-(\d+)/);
    if (!match) return null;
    var nextNum = parseInt(match[1], 10) + 1;
    var nextId = 'step-' + nextNum;
    return document.getElementById(nextId);
  }

  function getAudioUrlForArticle(article) {
    if (!article) return null;
    var url = article.getAttribute('data-audio-url');
    if (url) return url;
    var dataAudio = article.getAttribute('data-audio');
    if (dataAudio) {
      var base = (window.ALBINO_CONFIG && window.ALBINO_CONFIG.links && window.ALBINO_CONFIG.links.audioBase) || '';
      return base.replace(/\/?$/, '/') + dataAudio;
    }
    return null;
  }

  function playStepAndContinue(article) {
    var url = getAudioUrlForArticle(article);
    if (!url || !audioPlayer) return;
    article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    audioPlayer.src = url;
    audioPlayer._activeArticle = article;
    audioPlayer.play().catch(function () {
      audioPlayer._activeArticle = null;
    });
  }

  var guidedScrollActive = false;

  function initAudioSequence() {
    if (!audioPlayer) return;
    audioPlayer.addEventListener('ended', function () {
      var article = audioPlayer._activeArticle;
      audioPlayer._activeArticle = null;
      var nextArticle = article ? getNextStepArticle(article) : null;
      if (nextArticle && getAudioUrlForArticle(nextArticle)) {
        guidedScrollActive = true;
        playStepAndContinue(nextArticle);
      } else {
        guidedScrollActive = false;
      }
    });
  }

  function initScrollToAudio() {
    if (typeof IntersectionObserver === 'undefined') return;
    var steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    var observed = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          if (entry.target.id) observed[entry.target.id] = false;
          return;
        }
        if (guidedScrollActive || !audioEnabled) return;
        var id = entry.target.id;
        if (!id || observed[id]) return;
        var article = entry.target;
        if (!getAudioUrlForArticle(article) || !audioPlayer) return;
        observed[id] = true;
        guidedScrollActive = true;
        playStepAndContinue(article);
      });
    }, { threshold: 0.5, rootMargin: '0px' });
    steps.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function initForm() {
    if (!form) return;
    var feedback = document.getElementById('form-miradas-feedback');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="mirada"]:checked');
      var textarea = form.querySelector('textarea[name="tu_mirada"]');
      var mirada = selected ? selected.value : '';
      var tuMirada = textarea ? textarea.value.trim() : '';
      if (!mirada && !tuMirada) {
        if (feedback) {
          feedback.setAttribute('role', 'alert');
          feedback.textContent = 'Por favor, elige una opción o escribe tu mirada.';
          feedback.className = 'mb-4 min-h-[1.5rem] text-[#B56B80]';
          var firstRadio = form.querySelector('input[name="mirada"]');
        if (firstRadio) firstRadio.focus();
        }
        return;
      }
      if (feedback) {
        feedback.removeAttribute('role');
        feedback.setAttribute('role', 'status');
        feedback.textContent = '';
      }
      if (window.ALBINO_CONFIG && window.ALBINO_CONFIG.miradasEndpoint) {
        fetch(window.ALBINO_CONFIG.miradasEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mirada: mirada, tu_mirada: tuMirada })
        }).then(function () {
          form.reset();
          if (feedback) {
            feedback.textContent = 'Gracias por compartir tu mirada.';
            feedback.className = 'mb-4 min-h-[1.5rem] text-stone-900';
          }
        }).catch(function () {
          if (feedback) {
            feedback.setAttribute('role', 'alert');
            feedback.textContent = 'No se pudo enviar. Inténtalo de nuevo.';
            feedback.className = 'mb-4 min-h-[1.5rem] text-[#B56B80]';
          }
        });
      } else {
        form.reset();
        if (feedback) {
          feedback.textContent = 'Gracias por compartir tu mirada.';
          feedback.className = 'mb-4 min-h-[1.5rem] text-stone-900';
        }
      }
    });
  }

  function init() {
    setAudioEnabled(false);
    initModeButtons();
    initQuickLinks();
    initProductModal();
    initNutritionToggle();
    initAudioSequence();
    initScrollToAudio();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
