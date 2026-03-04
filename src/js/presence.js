/**
 * Presencia: listado de lugares (data-driven) y formulario sin backend.
 */
(function () {
  var LOCATIONS = [
    { city: 'Madrid', places: ['Nombre', 'Nombre'] },
    { city: 'Barcelona', places: ['Nombre'] },
    { city: 'Sevilla', places: ['Nombre'] },
    { city: 'Extremadura', places: ['Nombre'] }
  ];

  function renderListado(container) {
    if (!container) return;
    container.innerHTML = '';
    LOCATIONS.forEach(function (item) {
      var h3 = document.createElement('h3');
      h3.className = 'font-geist-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/80 mb-4 mt-10 first:mt-0';
      h3.textContent = item.city;
      container.appendChild(h3);
      var ul = document.createElement('ul');
      ul.className = 'space-y-2 font-body text-base md:text-lg font-light text-white/90 leading-relaxed';
      ul.setAttribute('aria-label', 'Lugares en ' + item.city);
      item.places.forEach(function (place) {
        var li = document.createElement('li');
        li.textContent = place;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    });
  }

  function initForm(formEl, successEl) {
    if (!formEl || !successEl) return;
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = formEl.querySelector('#presencia-name');
      var espacio = formEl.querySelector('#presencia-espacio');
      var email = formEl.querySelector('#presencia-email');
      var errors = [];
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      [name, espacio, email].forEach(function (field) {
        if (field) {
          var err = field.getAttribute('aria-describedby') ? document.getElementById(field.getAttribute('aria-describedby')) : null;
          if (err) err.textContent = '';
          if (field.hasAttribute('required') && !(field.value && field.value.trim())) {
            errors.push(field);
            if (err) err.textContent = 'Requerido';
          }
          if (field.type === 'email' && field.value && !emailRe.test(field.value.trim())) {
            errors.push(field);
            if (err) err.textContent = 'Email no válido';
          }
        }
      });

      if (errors.length) {
        errors[0].focus();
        return;
      }

      formEl.classList.add('hidden');
      successEl.classList.remove('hidden');
      if (successEl.tabIndex !== undefined) successEl.focus();
    });
  }

  function init() {
    renderListado(document.getElementById('presencia-listado'));
    initForm(document.getElementById('presencia-form'), document.getElementById('presencia-form-success'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
