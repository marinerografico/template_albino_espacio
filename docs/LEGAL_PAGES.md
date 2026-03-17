# Páginas legales para ecommerce de alcohol en España

El footer incluye enlaces a las páginas legales necesarias. El tema usa diseño mobile-first para todas ellas.

## Templates

- **`templates/page.liquid`**: Aviso Legal, Política de Cookies (Content → Pages).
- **`templates/policy.liquid`**: Política de Privacidad, Condiciones de Compra, Envíos, Devoluciones (Settings → Legal).

Ambos comparten estilos `.legal-page` en `assets/albino.css` (tipografía, espaciado, imágenes responsive, lazy loading).

## Páginas que Shopify gestiona (Settings → Legal)

Configura el contenido en **Settings → Legal**:

| Política | URL | Obligatorio |
|----------|-----|-------------|
| Privacy policy | `/policies/privacy-policy` | Sí |
| Terms of service (Condiciones de compra) | `/policies/terms-of-service` | Sí |
| **Shipping policy (Envíos)** | `/policies/shipping-policy` | Sí — crear y rellenar |
| Refund policy (Devoluciones) | `/policies/refund-policy` | Sí |

## Páginas que debes crear (Content → Pages)

| Handle | Título | Template |
|--------|--------|----------|
| `aviso-legal` | Aviso Legal | Página predeterminada |
| `politica-cookies` | Política de Cookies | Página predeterminada |

## Checklist de contenido legal

**No uses plantillas genéricas.** Usa `docs/LEGAL_CONTENT_CHECKLIST.md` para redactar cada política con:

- Responsable, finalidad, base legal, retención exacta
- Dónde y cómo se almacenan los datos
- Seguridad (HTTPS, no almacenar tarjetas, Shopify Payments)
- Derechos del usuario y contacto
- Evitar afirmaciones ilegales o incorrectas (ver checklist)

## Imágenes en políticas

Si insertas imágenes desde el editor de Shopify, se sirven por CDN. El tema aplica `loading="lazy"` y estilos responsive. Evita pegar URLs externas; usa el selector de medios de Shopify.

## Instagram

En **Theme settings → Footer** añade la URL de tu perfil de Instagram (ej: `https://instagram.com/albino`).

## Banner de cookies

El tema incluye un banner de consentimiento (`snippets/cookie-banner.liquid`) que:

- **Cuándo se muestra:** Solo tras pasar el age gate (verificación de edad), para no mostrar dos diálogos seguidos.
- **Almacenamiento:** `localStorage` del navegador (clave: `albino_cookie_consent`). No se usa base de datos.
- **Duración:** 12 meses. Tras ese periodo se vuelve a solicitar el consentimiento.
- **Formato:** `{ "choice": "accepted"|"rejected", "expiresAt": timestamp }`
- **Política de cookies:** Debe indicar que el consentimiento se guarda en localStorage durante 12 meses, que el usuario puede revocarlo en cualquier momento desde la configuración del navegador, y el enlace a la política está en el banner.

Para cumplimiento estricto de GDPR, considera cargar GA y Meta Pixel solo tras el consentimiento (actualmente se cargan al inicio).
