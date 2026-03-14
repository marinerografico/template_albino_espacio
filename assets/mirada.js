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
  var audioButtons = document.querySelectorAll('.mirada-audio-btn');
  var form = document.getElementById('form-miradas');

  function setAudioEnabled(enabled) {
    audioEnabled = !!enabled;
    if (btnAudioOn) btnAudioOn.setAttribute('aria-pressed', String(audioEnabled));
    if (btnAudioOff) btnAudioOff.setAttribute('aria-pressed', String(!audioEnabled));
    if (audioStatus) audioStatus.hidden = !audioEnabled;
    audioButtons.forEach(function (btn) { btn.hidden = !audioEnabled; });
  }

  function initModeButtons() {
    if (btnAudioOn) btnAudioOn.addEventListener('click', function () { setAudioEnabled(true); });
    if (btnAudioOff) btnAudioOff.addEventListener('click', function () { setAudioEnabled(false); });
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
    if (!btnToggleNutrition || !nutritionSection) return;
    btnToggleNutrition.addEventListener('click', function () {
      var isHidden = nutritionSection.hidden;
      nutritionSection.hidden = !isHidden;
      btnToggleNutrition.setAttribute('aria-expanded', String(!isHidden));
      btnToggleNutrition.textContent = isHidden ? 'Ocultar información nutricional' : 'Ver información nutricional';
    });
  }

  function initAudioButtons() {
    if (!audioPlayer) return;
    var activeBtn = null;
    audioButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-audio-url');
        if (!url && btn.getAttribute('data-audio')) {
          var base = (window.ALBINO_CONFIG && window.ALBINO_CONFIG.links && window.ALBINO_CONFIG.links.audioBase) || '';
          url = base.replace(/\/?$/, '/') + btn.getAttribute('data-audio');
        }
        if (!url) return;
        audioPlayer.src = url;
        activeBtn = btn;
        btn.textContent = 'Reproduciendo…';
        audioPlayer.play().catch(function () {
          if (activeBtn) activeBtn.textContent = 'Escuchar';
        });
      });
    });
    audioPlayer.addEventListener('ended', function () {
      if (activeBtn) activeBtn.textContent = 'Escuchar';
      activeBtn = null;
    });
  }

  function initForm() {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="mirada"]:checked');
      var textarea = form.querySelector('textarea[name="tu_mirada"]');
      var mirada = selected ? selected.value : '';
      var tuMirada = textarea ? textarea.value.trim() : '';
      if (!mirada && !tuMirada) return;
      if (window.ALBINO_CONFIG && window.ALBINO_CONFIG.miradasEndpoint) {
        fetch(window.ALBINO_CONFIG.miradasEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mirada: mirada, tu_mirada: tuMirada })
        }).then(function () {
          form.reset();
          alert('Gracias por compartir tu mirada.');
        }).catch(function () {});
      } else {
        form.reset();
        alert('Gracias por compartir tu mirada.');
      }
    });
  }

  function init() {
    setAudioEnabled(false);
    initModeButtons();
    initQuickLinks();
    initNutritionToggle();
    initAudioButtons();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
