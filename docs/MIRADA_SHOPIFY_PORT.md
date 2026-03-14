# Port de /mirada a Shopify

Guía para convertir la landing HTML/CSS/JS en una página o sección de Shopify.

## Archivos fuente

| Origen | Destino Shopify |
|--------|-----------------|
| `src/pages/mirada.html` | `templates/page.mirada.liquid` |
| `src/styles/mirada.css` | `assets/mirada.css` |
| `src/js/mirada.js` | `assets/mirada.js` |

## Opción A: Page template

1. Crear `templates/page.mirada.liquid` con el contenido de `mirada.html`.
2. Sustituir rutas estáticas por Liquid:
   - `/products/albino` → `{{ product.url }}` o `{{ routes.root_url }}products/albino`
   - Rutas de audio → `{{ 'audio-step-1.mp3' | asset_url }}`
3. Subir audios a **Content → Files** (Shopify Admin).
4. Crear una página en **Content → Pages** y asignar la plantilla "mirada".

## Opción B: Sección reutilizable

1. Dividir el HTML en bloques lógicos.
2. Crear `sections/albino-mirada.liquid` con schema para:
   - `product` (product picker)
   - `audio_*` (file pickers para cada audio)
   - textos editables
3. Incluir la sección en `templates/page.mirada.liquid` o en la home.

## Audios a subir

- `audio-activate.mp3`
- `audio-intro.mp3`
- `audio-product.mp3`
- `audio-learn-intro.mp3`
- `audio-step-1.mp3` … `audio-step-4.mp3`
- `audio-outro.mp3`

## URL NFC

Configurar la etiqueta NFC para que apunte a:

```
https://tu-tienda.myshopify.com/pages/mirada
```

O la URL personalizada si usas dominio propio.

## Estado `audioEnabled`

El JS mantiene `audioEnabled` en memoria. No requiere cookies ni localStorage. Los botones "Escuchar" solo se muestran cuando el usuario ha pulsado "Activar experiencia sonora".
