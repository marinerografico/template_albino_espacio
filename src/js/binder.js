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
