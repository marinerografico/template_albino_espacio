# Mirada — Experiencia NFC editorial Albino

## Arquitectura

| Archivo | Uso |
|---------|-----|
| `templates/page.mirada.liquid` | Plantilla de página |
| `sections/albino-mirada.liquid` | Sección con todo el contenido |
| `assets/mirada.css` | Estilos editoriales |
| `assets/mirada.js` | Lógica (audio, accesibilidad, form) |

**Jerarquía de contenido:** Hero → Producto → Nutrición → Descubrir → Aprender → Archivo → CTA

## Modos

- **Inmersivo:** Audio por sección, transiciones reveal, haptic opcional.
- **Accesible:** Sin autoplay, estructura semántica, labels claros.
  - Se activa con `prefers-reduced-motion` o con el botón "Usar modo accesible" en el hero.

## Audios (Content → Files)

Sube los MP3 y pega la URL en Theme editor → Mirada:

| Campo | Archivo sugerido |
|-------|------------------|
| `audio_intro` | audio-intro.mp3 |
| `audio_product_info` | audio-product.mp3 |
| `audio_nutrition` | audio-nutrition.mp3 |
| `audio_discover` | audio-discover.mp3 |
| `audio_learn_intro` | audio-learn-intro.mp3 |
| `audio_step_1` … `audio_step_4` | audio-step-1.mp3 … |
| `audio_outro` | audio-outro.mp3 |

## URL NFC

```
https://tu-dominio.com/pages/mirada
```

## Configuración

- **product_url:** Enlace al producto (Ver el vino, Comprar botella).
- **Vídeos de fondo:** Pasos 1–4 (opcional). Sin vídeo → fondo oscuro.
- **Audios:** URL completa desde Content → Files.

## Accesibilidad

- `prefers-reduced-motion` activa modo accesible por defecto.
- Toggle manual "Usar modo accesible" en el hero.
- Sin autoplay en modo accesible.
- Labels descriptivos para screen readers (ej. "Paso 1. Escuchar: Mira el momento antes de probar el vino").
