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
  var audioButtons = document.querySelectorAll('.mirada-btn-audio');
  var form = document.getElementById('form-miradas');
  var btnGuidedTour = document.getElementById('btn-guided-tour');

  function setAudioEnabled(enabled) {
    audioEnabled = !!enabled;
    if (btnAudioOn) btnAudioOn.setAttribute('aria-pressed', String(audioEnabled));
    if (btnAudioOff) btnAudioOff.setAttribute('aria-pressed', String(!audioEnabled));
    if (audioStatus) audioStatus.hidden = !audioEnabled;
    audioButtons.forEach(function (btn) { btn.hidden = !audioEnabled; });
    if (btnGuidedTour) btnGuidedTour.hidden = !audioEnabled;
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
    var btn = document.getElementById('btn-product-popup');
    var modal = document.getElementById('mirada-product-modal');
    var iframe = document.getElementById('mirada-product-iframe');
    var closeBtn = document.getElementById('mirada-product-modal-close');
    if (!btn || !modal || !iframe) return;
    function openModal() {
      var url = btn.getAttribute('data-product-url');
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
    btn.addEventListener('click', openModal);
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

  function getStepArticle(btn) {
    var article = btn && btn.closest ? btn.closest('article') : null;
    return article;
  }

  function getNextStepArticle(currentArticle) {
    if (!currentArticle || !currentArticle.id) return null;
    var match = currentArticle.id.match(/step-(\d+)/);
    if (!match) return null;
    var nextNum = parseInt(match[1], 10) + 1;
    var nextId = 'step-' + nextNum;
    return document.getElementById(nextId);
  }

  function getAudioButtonForArticle(article) {
    if (!article) return null;
    var btn = article.querySelector('.mirada-btn-audio');
    return btn && btn.getAttribute('data-audio-url') ? btn : null;
  }

  function playStepAndContinue(article) {
    var btn = getAudioButtonForArticle(article);
    if (!btn || !audioPlayer) return;
    var url = btn.getAttribute('data-audio-url');
    if (!url && btn.getAttribute('data-audio')) {
      var base = (window.ALBINO_CONFIG && window.ALBINO_CONFIG.links && window.ALBINO_CONFIG.links.audioBase) || '';
      url = base.replace(/\/?$/, '/') + btn.getAttribute('data-audio');
    }
    if (!url) return;
    article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    audioPlayer.src = url;
    audioPlayer._activeBtn = btn;
    btn.textContent = 'Reproduciendo…';
    audioPlayer.play().catch(function () {
      if (audioPlayer._activeBtn) audioPlayer._activeBtn.textContent = 'Escuchar';
      audioPlayer._activeBtn = null;
    });
  }

  var guidedScrollActive = false;

  function initAudioButtons() {
    if (!audioPlayer) return;
    audioButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var article = getStepArticle(btn);
        if (!article) return;
        guidedScrollActive = true;
        playStepAndContinue(article);
      });
    });
    audioPlayer.addEventListener('ended', function () {
      var btn = audioPlayer._activeBtn;
      if (btn) btn.textContent = 'Escuchar';
      audioPlayer._activeBtn = null;
      var article = btn ? getStepArticle(btn) : null;
      var nextArticle = article ? getNextStepArticle(article) : null;
      if (nextArticle && getAudioButtonForArticle(nextArticle)) {
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
        var btn = getAudioButtonForArticle(article);
        if (!btn || !audioPlayer) return;
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
    initAudioButtons();
    initScrollToAudio();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
