/**
 * Sticky logo + header on scroll (home only).
 * - Logo aparece grande centrado (héroe) al cargar.
 * - Al hacer scroll, se mueve y reduce hasta la posición/tamaño del logo del header.
 * - El header solo aparece cuando el logo llega arriba.
 */
(function () {
  var SCROLL_RANGE = 420; // píxeles de scroll para completar la transición

  function init() {
    var h1 = document.getElementById('sticky-logo-h1');
    var img = document.getElementById('sticky-logo-img');
    var header = document.getElementById('main-header');
    if (!h1 || !img || !header) return;

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    function update() {
      var y = window.scrollY || window.pageYOffset || 0;
      var t = Math.min(1, Math.max(0, y / SCROLL_RANGE));
      t = smoothstep(t);

      var w = window.innerWidth;
      var isMd = w >= 768;
      var smallW = isMd ? 150 : 120; // tamaño final (igual que logo del header)
      var startW = Math.min(1000, w - 48); // ancho casi completo con margen lateral

      // Posición final: centrado en el header (altura del logo dentro de un header de 100/120px)
      var endY = isMd ? 45 : 35;
      // Posición inicial: más cerca del borde inferior en todas las vistas
      var vh = window.innerHeight;
      var startOffset = isMd ? 260 : 220; // distancia al borde inferior
      var startY = Math.max(vh * 0.55, vh - startOffset);

      var ty = startY + (endY - startY) * t;
      var width = startW + (smallW - startW) * t;

      h1.style.transform = 'translateY(' + ty + 'px)';
      img.style.width = width + 'px';
      img.style.maxWidth = width + 'px';
      img.classList.remove('w-full', 'max-w-[1000px]');
      img.classList.add('w-[120px]', 'md:w-[150px]');

      // Header solo visible cuando el logo ha llegado arriba.
      if (t >= 1) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      } else {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      }
    }

    // Estado inicial + fade-in independiente del scroll.
    update();
    h1.style.opacity = '0';
    setTimeout(function () {
      h1.style.transition = 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease-out';
      img.style.transition = 'width 0.25s ease-out, max-width 0.25s ease-out';
      h1.style.opacity = '1';
    }, 50);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

