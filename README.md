# Albino — Espacio

Landing y página Elaboración convertidas en **template mantenible** con GitHub y desplegable en **Shopify** (Theme Liquid).

- **Origen:** proyecto exportado desde [Aura](https://aura.build) (HTML + Tailwind + JS).
- **Estructura:** código fuente en `/src`, configuración en `/config`, build en `/dist`, tema Shopify en `/shopify-theme`.

---

## Estructura del repositorio

```
albino-espacio/
├── config/
│   └── site.js              # Config central: precios, enlaces, textos, assets (sin tocar HTML)
├── src/
│   ├── pages/               # HTML fuente (index, elaboracion) con data-bind
│   ├── js/                  # Módulos: binder, reveal, accordion, mobile-menu, hover-preview, sticky-logo
│   └── styles/
│       └── albino.css        # Estilos base, reveal, prefers-reduced-motion
├── dist/                    # Build estático (generado con npm run build)
├── shopify-theme/           # Tema Shopify (Liquid)
│   ├── layout/theme.liquid
│   ├── templates/
│   │   ├── index.liquid
│   │   └── page.elaboracion.liquid
│   ├── sections/
│   │   ├── albino-home.liquid
│   │   └── albino-elaboracion.liquid
│   ├── snippets/
│   │   ├── header.liquid
│   │   ├── footer.liquid
│   │   └── albino-config.liquid
│   ├── assets/
│   │   ├── albino.css
│   │   └── albino.js
│   └── config/
│       ├── settings_schema.json
│       └── settings_data.json
├── scripts/
│   └── build.js             # Copia src → dist y reescribe rutas
├── docs/                    # Documentación adicional
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

---

## Desarrollo local (sitio estático)

1. **Configuración:** edita `config/site.js` (precios, enlaces, textos, URLs de imágenes). No hace falta tocar HTML.
2. **Build:**
   ```bash
   npm run build
   ```
   Genera `dist/` con `index.html`, `elaboracion.html`, `config/site.js`, `js/*.js`, `assets/albino.css`.
3. **Servir:** abre `dist/index.html` en el navegador o usa un servidor local, por ejemplo:
   ```bash
   npx serve dist
   ```

Comportamiento esperado:

- **Reveal:** elementos con clase `.reveal` se animan al entrar en vista (IntersectionObserver).
- **Sticky logo (solo home):** logo centrado que se reduce al hacer scroll; el header (z-40) aparece cuando `scrollY > 50`; el logo queda en z-50.
- **Menú móvil:** botón abre/cierra el overlay.
- **Accordion:** botones con `data-accordion-toggle="id-panel"` abren/cierran el panel.
- **Hover preview:** filas con `data-hover-preview` muestran imagen flotante en desktop.

---

## Cómo publicar como GitHub Template

1. Crea un **nuevo repositorio** en GitHub a partir de este proyecto (o sube el código a un repo existente).
2. En el repo → **Settings** → **General** → activa **Template repository**.
3. Quien quiera usarlo: **Use this template** → **Create a new repository**.
4. Opcional: añade en la descripción del repo o en `README` un aviso tipo: *“Este repositorio es una plantilla. Crea un nuevo repo desde ‘Use this template’ para tu propia tienda.”*

---

## Cómo subir el tema a Shopify

### Opción A: Shopify CLI (recomendado)

1. Instala [Shopify CLI](https://shopify.dev/docs/themes/tools/cli):
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```
2. En la raíz del proyecto (o dentro de `shopify-theme`):
   ```bash
   cd shopify-theme
   shopify theme dev
   ```
   Te pedirá tienda y autenticación. Abre la URL de preview para ver el tema en tu tienda de desarrollo.

3. Para **publicar** (subir el tema):
   ```bash
   shopify theme push
   ```
   O empacar y subir manualmente:
   ```bash
   shopify theme package
   ```
   Se genera un `.zip` que puedes subir en **Shopify Admin → Tienda online → Temas → Añadir tema → Subir archivo ZIP**.

### Opción B: Theme Kit (legacy)

1. Instala [Theme Kit](https://shopify.dev/docs/themes/tools/theme-kit):
   ```bash
   brew tap shopify/shopify
   brew install theme-kit
   ```
2. Crea `config.yml` en la carpeta del tema (no versionado; en `.gitignore`):
   ```yaml
   store: tu-tienda.myshopify.com
   theme_id: "123456789"   # opcional; si no, crea un tema sin publicar
   password: shpat_xxxx    # token de acceso privado (Admin API)
   ```
3. Desde `shopify-theme`:
   ```bash
   theme deploy
   # o theme watch para desarrollo
   ```

### Después de subir

- **Página de elaboración:** en Shopify Admin → **Páginas** → crea una página con handle `elaboracion` (o edita la existente) y asígnale la plantilla **elaboracion**.
- **Enlaces:** el tema usa `routes.root_url`, `routes.cart_url`, etc.; los textos y precios se inyectan desde `snippets/albino-config.liquid`. Para cambiar textos/precios sin tocar Liquid, edita ese snippet o añade después un section/schema con settings.

---

## SEO, accesibilidad y rendimiento

- **Meta:** `description` y `canonical` en el layout (Shopify) y en las páginas fuente (HTML).
- **Accesibilidad:** `sr-only` para h1, `aria-label` en botones de menú, `focus-visible:ring` en controles, labels en formularios.
- **prefers-reduced-motion:** en `albino.css`, las animaciones `.reveal` y `.blur-text-container` se desactivan con `@media (prefers-reduced-motion: reduce)`; el JS de reveal marca igualmente `.in-view` para que el contenido sea visible.
- **Imágenes y fuentes:** Tailwind y fuentes vía CDN; imágenes desde Supabase (configurables en `config/site.js`). Para producción propia, sustituye URLs en `site.js` o en `albino-config.liquid`. La fuente **BDO Grotesk** se referencia en `albino.css` como `url('BDOGrotesk-DemiBold.woff2')`: coloca el archivo en `public/assets/` y en el build copia a `dist/assets/` (o en Shopify sube el `.woff2` a `shopify-theme/assets/`) para que cargue correctamente.

---

## Workflow opcional (GitHub Actions)

Incluido en `.github/workflows/build.yml`: en cada push se ejecuta `npm run build`. Opcionalmente puedes añadir lint (p. ej. ESLint, html-validate) en `package.json` y en el workflow.

---

## Licencia

MIT. Ver [LICENSE](LICENSE).
