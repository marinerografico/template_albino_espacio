/**
 * Age gate — Laus-level. Primera pantalla antes de la experiencia Albino.
 */
(function () {
  var STORAGE_KEY = 'albino_age_verified';
  var EXIT_DURATION_MS = 700;
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function init() {
    var gate = document.getElementById('age-gate');
    if (!gate) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      if (gate.parentNode) gate.parentNode.removeChild(gate);
      document.body.style.overflow = '';
      document.body.removeAttribute('data-age-gate-active');
      return;
    }
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-age-gate-active', 'true');
    var duration = prefersReducedMotion() ? 0 : EXIT_DURATION_MS;
    var yesBtn = document.getElementById('age-gate-yes');
    var noBtn = document.getElementById('age-gate-no');
    var askPanel = document.getElementById('age-gate-ask');
    var deniedPanel = document.getElementById('age-gate-denied');
    var backBtn = document.getElementById('age-gate-back');
    var leaveLink = document.getElementById('age-gate-leave');
    if (yesBtn) {
      yesBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'true');
        gate.setAttribute('data-age-gate-exiting', 'true');
        setTimeout(function () {
          if (gate.parentNode) gate.parentNode.removeChild(gate);
          document.body.style.overflow = '';
          document.body.removeAttribute('data-age-gate-active');
        }, duration);
      });
    }
    if (noBtn) {
      noBtn.addEventListener('click', function () {
        if (askPanel) askPanel.hidden = true;
        if (deniedPanel) deniedPanel.hidden = false;
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (deniedPanel) deniedPanel.hidden = true;
        if (askPanel) askPanel.hidden = false;
      });
    }
    if (leaveLink) {
      leaveLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.history.length > 1) window.history.back();
        else window.location.href = 'about:blank';
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Shopify cart — integración en header.
 * Actualiza el contador del carrito (id="header-cart-count") vía /cart.js.
 * Exponer: window.AlbinoCart.refreshCount() para llamar tras add-to-cart u otros cambios.
 */
(function () {
  function updateCount(count) {
    var el = document.getElementById('header-cart-count');
    if (el) el.textContent = count;
    document.querySelectorAll('[data-shopify-cart-count]').forEach(function (e) {
      e.textContent = count;
    });
  }
  function refreshCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (data) { updateCount(data.item_count || 0); })
      .catch(function () {});
  }
  window.AlbinoCart = {
    refreshCount: refreshCount,
    updateCount: updateCount
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshCount);
  } else {
    refreshCount();
  }
})();

/**
 * Add-to-cart desde botones con data-add-to-cart en la home.
 * Usa /cart/add.js y luego actualiza el contador y abre el carrito modal.
 */
(function () {
  function handleClick(btn) {
    var variantId = btn.getAttribute('data-variant-id');
    if (!variantId) return;
    var qtyAttr = btn.getAttribute('data-quantity') || '1';
    var quantity = parseInt(qtyAttr, 10) || 1;

    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id: Number(variantId), quantity: quantity })
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        if (window.AlbinoCart && typeof window.AlbinoCart.refreshCount === 'function') {
          window.AlbinoCart.refreshCount();
        }
        if (window.AlbinoCartModal && typeof window.AlbinoCartModal.open === 'function') {
          window.AlbinoCartModal.open();
        }
      })
      .catch(function () {
        btn.disabled = false;
      });
  }

  function init() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        handleClick(btn);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Página de producto: formulario add-to-cart.
 * - Actualiza el hidden variant id cuando cambia el selector de variantes.
 * - Intercepta el envío del form, hace POST a /cart/add.js y abre el modal del carrito.
 */
(function () {
  function showError(msg) {
    var el = document.getElementById('product-form-error');
    if (el) {
      el.textContent = msg || '';
      el.classList.toggle('hidden', !msg);
    } else if (msg) {
      alert(msg);
    }
  }

  function init() {
    var form = document.getElementById('product-form-albino');
    if (!form) {
      form = document.querySelector('form[data-product-add-form]');
    }
    if (!form) return;

    var select = form.querySelector('[data-product-variant-select]');
    var hidden = form.querySelector('[data-product-variant-id], input[name="id"]');
    if (select && hidden) {
      select.addEventListener('change', function () {
        hidden.value = select.value;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showError('');
      var idInput = form.querySelector('[data-product-variant-id], input[name="id"]');
      var qtyInput = form.querySelector('input[name="quantity"]');
      var variantId = idInput ? String(idInput.value).trim() : '';
      var quantity = (qtyInput && parseInt(qtyInput.value, 10)) || 1;
      if (!variantId) {
        showError('No se ha seleccionado ninguna variante.');
        return;
      }

      var btn = form.querySelector('button[type="submit"], button[name="add"]');
      if (btn) btn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: Number(variantId), quantity: quantity })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) {
              var msg = (data && (data.description || data.message)) || 'No se pudo añadir al carrito.';
              showError(msg);
              return;
            }
            if (window.AlbinoCart && typeof window.AlbinoCart.refreshCount === 'function') {
              window.AlbinoCart.refreshCount();
            }
            if (window.AlbinoCartModal && typeof window.AlbinoCartModal.open === 'function') {
              window.AlbinoCartModal.open();
            }
          });
        })
        .catch(function () {
          showError('Error de conexión. Intentando envío normal…');
          form.submit();
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Carrito modal: abre al hacer clic en "Carrito" o tras añadir al carrito.
 */
(function () {
  function qs(id) {
    return document.getElementById(id);
  }

  function open() {
    var modal = qs('cart-modal');
    if (!modal) return;
    modal.classList.remove('pointer-events-none');
    modal.classList.add('opacity-100');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    fetchCart();
  }

  function close() {
    var modal = qs('cart-modal');
    if (!modal) return;
    modal.classList.add('pointer-events-none');
    modal.classList.remove('opacity-100');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderCart(cart) {
    var itemsEl = qs('cart-modal-items');
    var subtotalEl = qs('cart-modal-subtotal');
    if (!itemsEl) return;

    if (!cart || !cart.items || cart.items.length === 0) {
      itemsEl.innerHTML = '<p class="text-sm text-stone-900">Tu carrito está vacío.</p>';
      if (subtotalEl) subtotalEl.textContent = '0€';
      return;
    }

    var html = cart.items.map(function (item, index) {
      var line = index + 1;
      var price = (item.final_line_price / 100).toFixed(2).replace('.', ',') + '€';
      return (
        '<div class="flex items-start justify-between gap-4">' +
          '<div class="flex-1">' +
            '<p class="text-sm font-body font-light">' + item.product_title + '</p>' +
            '<p class="text-xs font-geist-mono tracking-[0.18em] uppercase text-stone-500">Cantidad: ' + item.quantity + '</p>' +
          '</div>' +
          '<div class="flex flex-col items-end gap-2">' +
            '<span class="text-sm font-geist-mono font-light">' + price + '</span>' +
            '<button type="button" class="text-xs font-geist-mono tracking-[0.18em] uppercase border-b border-[#a0a09e] hover:border-[#111111] text-stone-900" data-cart-remove data-line="' + line + '">Eliminar</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    itemsEl.innerHTML = html;
    if (subtotalEl) {
      var subtotal = (cart.total_price / 100).toFixed(2).replace('.', ',') + '€';
      subtotalEl.textContent = subtotal;
    }

    itemsEl.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var line = parseInt(btn.getAttribute('data-line'), 10);
        if (!line) return;
        changeLine(line, 0);
      });
    });
  }

  function fetchCart() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        renderCart(cart);
      })
      .catch(function () {});
  }

  function changeLine(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ line: line, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        if (window.AlbinoCart && typeof window.AlbinoCart.refreshCount === 'function') {
          window.AlbinoCart.refreshCount();
        }
        renderCart(cart);
      })
      .catch(function () {});
  }

  function init() {
    var headerCart = document.getElementById('header-cart-link');
    if (headerCart) {
      headerCart.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    }
    document.querySelectorAll('[data-shopify-cart="mobile"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    var closeBtn = qs('cart-modal-close');
    var continueBtn = qs('cart-modal-continue');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (continueBtn) continueBtn.addEventListener('click', close);
    var modal = qs('cart-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  window.AlbinoCartModal = {
    open: open
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Data-bind binder: inyecta valores de ALBINO_CONFIG en elementos con data-bind.
 * Uso: data-bind="claims.tagline1" (textContent) o data-bind-href="links.elaboracion"
 */
(function () {
  function get(obj, path) {
    return path.split('.').reduce(function (acc, key) { return acc && acc[key]; }, obj);
  }

  function apply() {
    var config = window.ALBINO_CONFIG;
    if (!config) return;

    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var path = el.getAttribute('data-bind').trim();
      var value = get(config, path);
      if (value != null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = value;
        else el.textContent = value;
      }
    });

    document.querySelectorAll('[data-bind-href]').forEach(function (el) {
      var path = el.getAttribute('data-bind-href').trim();
      var value = get(config, path);
      if (value != null) el.setAttribute('href', value);
    });

    document.querySelectorAll('[data-bind-src]').forEach(function (el) {
      var path = el.getAttribute('data-bind-src').trim();
      var value = get(config, path);
      if (value != null) el.setAttribute('src', value);
    });

    document.querySelectorAll('[data-bind-placeholder]').forEach(function (el) {
      var path = el.getAttribute('data-bind-placeholder').trim();
      var value = get(config, path);
      if (value != null) el.setAttribute('placeholder', value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
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
/**
 * Reveal on scroll via IntersectionObserver.
 * Respeta prefers-reduced-motion (clases aplicadas; CSS ya desactiva animación).
 * Para las líneas de ESPACIO (DEJAR SITIO / a lo esencial / A LA TIERRA...)
 * añade un efecto de "máquina de escribir" suave.
 */
(function () {
  function typeWriter(el, options) {
    if (!el || el.getAttribute('data-typed') === '1') return;
    var text = (el.getAttribute('data-full-text') || el.textContent || '').trim();
    el.setAttribute('data-full-text', text);
    el.setAttribute('data-typed', '1');
    el.textContent = '';
    var speed = options && options.speed || 40;
    var delay = options && options.delay || 0;
    var i = 0;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 1;
        setTimeout(step, speed);
      }
    }
    setTimeout(step, delay);
  }

  function triggerEspacioTyping(target) {
    if (!target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var isLine1 = target.classList.contains('espacio-line-1');
    var isLine2 = target.classList.contains('espacio-line-2');
    if (isLine1) {
      var subline = target.querySelector('[data-bind="claims.espacioSubline"]');
      if (subline) {
        typeWriter(subline, { speed: 35, delay: 120 });
      } else {
        var title = target.querySelector('[data-bind="claims.tagline1Title"]');
        var subtitle = target.querySelector('[data-bind="claims.tagline1Subtitle"]');
        if (title) typeWriter(title, { speed: 35, delay: 120 });
        if (subtitle) typeWriter(subtitle, { speed: 35, delay: 600 });
      }
    }
    if (isLine2) {
      var tagline2 = target.querySelector('[data-bind="claims.tagline2"]');
      typeWriter(tagline2, { speed: 35, delay: 150 });
    }
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-subtle').forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          triggerEspacioTyping(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-subtle').forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
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
/**
 * Sticky logo + header on scroll (home only).
 * Mismo comportamiento que en la versión estática (src/js/sticky-logo.js).
 */
(function () {
  var SCROLL_RANGE = 420;

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
      var smallW = isMd ? 150 : 120;
      var startW = Math.min(1000, w - 48);

      var endY = isMd ? 45 : 35;
      var vh = window.innerHeight;
      var startOffset = isMd ? 260 : 220;
      var startY = Math.max(vh * 0.55, vh - startOffset);

      var ty = startY + (endY - startY) * t;
      var width = startW + (smallW - startW) * t;

      h1.style.transform = 'translateY(' + ty + 'px)';
      img.style.width = width + 'px';
      img.style.maxWidth = width + 'px';
      img.classList.remove('w-full', 'max-w-[1000px]');
      img.classList.add('w-[120px]', 'md:w-[150px]');

      if (t >= 1) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      } else {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      }
    }

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
