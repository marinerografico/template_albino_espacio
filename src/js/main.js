/**
 * Main entry: Lucide icons (si existe) y cualquier init global.
 */
(function () {
  function init() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
