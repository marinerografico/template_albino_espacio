/**
 * Accordion: toggle max-height del panel y rotación del icono.
 */
(function () {
  function toggle(panelId, btn) {
    var el = document.getElementById(panelId);
    var icon = btn ? btn.querySelector('i[data-lucide]') : null;
    if (!el) return;
    if (el.style.maxHeight && el.style.maxHeight !== '0px') {
      el.style.maxHeight = '0px';
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      el.style.maxHeight = el.scrollHeight + 'px';
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  }

  function init() {
    document.querySelectorAll('[data-accordion-toggle]').forEach(function (btn) {
      var targetId = btn.getAttribute('data-accordion-toggle');
      if (!targetId) return;
      btn.addEventListener('click', function () { toggle(targetId, btn); });
    });
  }

  window.toggleAccordion = toggle;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
