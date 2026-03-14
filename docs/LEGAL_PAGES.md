# Páginas legales para ecommerce de alcohol en España

El footer incluye enlaces a las páginas legales necesarias. Debes crearlas y configurarlas en Shopify.

## Páginas que Shopify gestiona automáticamente

En **Settings → Legal** configura el contenido de:

- **Privacy policy** → `/policies/privacy-policy`
- **Terms of service** → `/policies/terms-of-service`
- **Shipping policy** → `/policies/shipping-policy`
- **Refund policy** → `/policies/refund-policy`

## Páginas que debes crear manualmente

En **Content → Pages** crea:

| Handle (URL) | Título sugerido |
|--------------|-----------------|
| `aviso-legal` | Aviso Legal |
| `politica-cookies` | Política de Cookies |

**Aviso Legal:** datos del titular, NIF, domicilio, objeto del sitio, LSSICE. Consulta a un abogado para el texto definitivo.

**Política de Cookies:** tipos de cookies, finalidad, cómo gestionarlas, enlaces a herramientas de opt-out.

## Instagram

En **Theme settings → Footer** añade la URL de tu perfil de Instagram (ej: `https://instagram.com/albino`).

## Banner de cookies

El tema incluye un banner de consentimiento (`snippets/cookie-banner.liquid`) que aparece en la primera visita. Guarda la elección en `localStorage` (clave: `albino_cookie_consent`). Para cumplimiento estricto de GDPR, considera cargar GA y Meta Pixel solo tras el consentimiento (actualmente se cargan al inicio).
