# Checklist de contenido legal — Albino

Guía para redactar políticas que cumplan RGPD y buenas prácticas. **No uses plantillas genéricas**: adapta cada punto a lo que Albino hace realmente.

---

## 1. Política de Privacidad

### Responsable del tratamiento
- [ ] Nombre o razón social completa
- [ ] NIF/CIF
- [ ] Domicilio fiscal
- [ ] Email de contacto para ejercer derechos
- [ ] Delegado de Protección de Datos (DPD) si aplica (obligatorio en ciertos casos)

### Qué datos recoges y para qué
- [ ] Lista concreta: email, nombre, dirección, teléfono, historial de pedidos, IP (si aplica)
- [ ] Finalidad de cada dato (ej: "email para enviar confirmación de pedido")
- [ ] Base legal: consentimiento / ejecución del contrato / interés legítimo

### Tiempo de retención (exacto)
- [ ] Cuánto tiempo conservas cada tipo de dato
- [ ] Ejemplo: "Datos de pedidos: 6 años (obligación legal fiscal)"
- [ ] Ejemplo: "Newsletter: hasta que revoques el consentimiento"
- [ ] Ejemplo: "Cookies analíticas: 12 meses"

### Dónde y cómo se almacenan
- [ ] Plataforma (Shopify, servidores en UE/EEUU según contrato)
- [ ] Formato (base de datos cifrada, backups)
- [ ] Transferencias internacionales si las hay (Shopify → EEUU, cláusulas tipo, etc.)

### Seguridad
- [ ] **HTTPS/TLS**: La web transmite datos cifrados. No digas "no es segura".
- [ ] **Pagos**: Shopify Payments procesa tarjetas; tú NO almacenas datos de tarjetas. Indícalo explícitamente.
- [ ] **Datos sensibles**: No recoges datos de salud, ideología, etc. Si no los recoges, dilo claro.

### Derechos del usuario
- [ ] Acceso, rectificación, supresión, oposición, portabilidad, limitación
- [ ] Cómo ejercerlos (email, formulario)
- [ ] Plazo de respuesta (máx. 1 mes)
- [ ] Derecho a reclamar ante la AEPD

### Auditoría y cumplimiento
- [ ] Cómo revisas el cumplimiento (revisiones periódicas, registro de actividades)
- [ ] Quién es responsable interno (si aplica)

---

## 2. Política de Cookies

- [ ] Cookies esenciales (funcionamiento): qué son, sin consentimiento
- [ ] Cookies analíticas: qué usas (Shopify Analytics, GA si aplica), con consentimiento
- [ ] **Sin cookies de publicidad** (ya confirmado)
- [ ] Duración: 12 meses (localStorage, clave `albino_cookie_consent`)
- [ ] Cómo revocar: borrar cookies/localStorage o enlace al banner
- [ ] Enlace a política de privacidad

---

## 3. Aviso Legal (LSSICE)

- [ ] Titular del sitio (nombre, NIF, domicilio)
- [ ] Objeto del sitio (venta de vino, información, etc.)
- [ ] Condiciones de uso del sitio
- [ ] Propiedad intelectual
- [ ] Enlaces a políticas de privacidad y cookies

---

## 4. Condiciones de Compra

- [ ] Objeto del contrato
- [ ] Precios (IVA incluido, moneda)
- [ ] Forma de pago (Shopify Payments, no almacenamiento de datos de tarjeta)
- [ ] Plazos de entrega (o remitir a política de envíos)
- [ ] Derecho de desistimiento (14 días, consumidores UE)
- [ ] Garantías y reclamaciones

---

## 5. Política de Devoluciones

- [ ] Plazo para devoluciones (ej: 14 días desde recepción)
- [ ] Condiciones (producto sin abrir, embalaje original)
- [ ] Proceso (contactar, enviar, reembolso)
- [ ] Excepciones (productos perecederos, alcohol según normativa)

---

## 6. Política de Envíos

- [ ] Zonas de envío (España peninsular, Baleares, Canarias, UE, etc.)
- [ ] Plazos estimados por zona
- [ ] Costes de envío
- [ ] Transportista(s)
- [ ] Seguimiento del pedido

---

## Errores a evitar

| No hagas | Haz |
|----------|-----|
| Decir que la web "no es segura" | Indicar que usas HTTPS y cifrado en transmisión |
| Mencionar almacenamiento de datos de tarjetas | Aclarar que Shopify Payments procesa pagos; tú no guardas datos de tarjeta |
| Plantillas genéricas sin adaptar | Texto específico para Albino: qué datos, para qué, cuánto tiempo |
| Omitir tiempos de retención | Indicar plazos exactos por tipo de dato |
| Omitir responsable y contacto | Nombre, NIF, email para ejercer derechos |
| Promesas que no cumples | Solo indica lo que realmente haces |

---

## Referencias

- [AEPD — Guía cookies](https://www.aepd.es/guias/guia-cookies.pdf)
- [AEPD — Derechos](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos)
- [Shopify — Legal policies](https://help.shopify.com/manual/checkout-settings/refund-privacy-tos)
