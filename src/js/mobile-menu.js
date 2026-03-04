/**
 * Menú móvil: abrir/cerrar por id mobile-menu-btn, mobile-close-btn, mobile-menu.
 */
(function () {
  function init() {
    var openBtn = document.getElementById('mobile-menu-btn');
    var closeBtn = document.getElementById('mobile-close-btn');
    var menu = document.getElementById('mobile-menu');
    if (!openBtn || !closeBtn || !menu) return;

    openBtn.addEventListener('click', function () {
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'auto';
    });
    closeBtn.addEventListener('click', function () {
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
