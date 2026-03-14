# Port de /mirada a Shopify

**Ya implementado** en el tema Shopify. Archivos creados:

| Archivo | Uso |
|---------|-----|
| `templates/page.mirada.liquid` | Plantilla de página |
| `sections/albino-mirada.liquid` | Sección con todo el contenido |
| `assets/mirada.css` | Estilos |
| `assets/mirada.js` | Lógica (audio, scroll, form) |

## Cómo usar

1. **Sincronizar el tema** con Shopify (GitHub o Shopify CLI).
2. En **Content → Pages**, crear o editar una página.
3. En **Plantilla**, elegir **mirada**.
4. Guardar. La URL será `/pages/{handle}` (p. ej. `/pages/mirada`).

## Configuración de la sección

En **Theme editor → Página Mirada**:
- **URL del producto**: enlace al producto (por defecto `/products/albino-edicion-2026`).
- **Vídeos de fondo**: sube MP4 a **Content → Files**, copia la URL y pégala en cada paso (Mira el momento, Acércate al vino, Prueba, Vuelve a mirar). Sin vídeo se muestra un fondo oscuro.
- **Audios (flujo completo)**: sube los MP3 a **Content → Files**, copia la URL y pégala en cada campo:
  - **Intro** — se reproduce al activar la experiencia sonora
  - **Información del vino** — al llegar a la ficha
  - **Descubrir el vino** — al llegar a esa sección
  - **Pasos 1–4** — Aprender a mirarlo

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

### Experiencia sonora — flujo completo

- **Intro**: Al activar la experiencia sonora se reproduce el audio intro (si está configurado). Al terminar, hace scroll a Información del vino y continúa.
- **Secuencia**: Información del vino → Descubrir el vino → Paso 1 → Paso 2 → Paso 3 → Paso 4. Cada audio, al terminar, hace scroll al siguiente y reproduce.
- **Scroll → audio**: Si la experiencia sonora está activada y el usuario hace scroll hasta una sección con audio, se reproduce automáticamente y continúa la secuencia.
- **Recorrido guiado**: Empieza por el intro (o por Información del vino si no hay intro) y recorre todo el flujo.
