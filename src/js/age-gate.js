/**
 * Age gate — Laus-level. Primera pantalla antes de la experiencia Albino.
 * localStorage key: albino_age_verified = "true" para no volver a mostrar.
 */
(function () {
  var STORAGE_KEY = 'albino_age_verified';
  var EXIT_DURATION_MS = 700;
  var ENTER_DURATION_MS = 300;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    var gate = document.getElementById('age-gate');
    if (!gate) return;

    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      removeGate(gate, false);
      return;
    }

    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-age-gate-active', 'true');

    var duration = prefersReducedMotion() ? 0 : EXIT_DURATION_MS;

    var yesBtn = document.getElementById('age-gate-yes');
    var noBtn = document.getElementById('age-gate-no');
    var askPanel = document.getElementById('age-gate-ask');
    var deniedPanel = document.getElementById('age-gate-denied');
    var leaveLink = document.getElementById('age-gate-leave');

    if (yesBtn) {
      yesBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'true');
        gate.setAttribute('data-age-gate-exiting', 'true');
        setTimeout(function () {
          removeGate(gate, true);
        }, duration);
      });
    }

    if (noBtn) {
      noBtn.addEventListener('click', function () {
        if (askPanel) askPanel.hidden = true;
        if (deniedPanel) deniedPanel.hidden = false;
      });
    }

    if (leaveLink) {
      leaveLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'about:blank';
        }
      });
    }
  }

  function removeGate(gate, restoreScroll) {
    if (!gate || !gate.parentNode) return;
    gate.parentNode.removeChild(gate);
    if (restoreScroll !== false) {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-age-gate-active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
