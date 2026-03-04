/**
 * Hover preview en filas de packs: muestra imagen flotante siguiendo el cursor.
 */
(function () {
  function init() {
    var preview = document.getElementById('hover-img-preview-aura');
    if (!preview) return;

    document.querySelectorAll('[data-hover-preview]').forEach(function (row) {
      var srcEl = row.querySelector('.hover-source-img');
      if (!srcEl) return;

      row.addEventListener('mouseenter', function () {
        preview.src = srcEl.src;
        preview.style.opacity = '1';
        preview.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      row.addEventListener('mouseleave', function () {
        preview.style.opacity = '0';
        preview.style.transform = 'translate(-50%, -50%) scale(0.85)';
      });
      row.addEventListener('mousemove', function (e) {
        preview.style.left = e.clientX + 'px';
        preview.style.top = e.clientY + 'px';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
