# Desplegar el tema en Shopify

## Requisitos

- Cuenta Shopify (prueba o plan de pago).
- Tema en la carpeta `shopify-theme/`.

## Método 1: Shopify CLI

```bash
# Instalación global
npm install -g @shopify/cli @shopify/theme

# Desde la raíz del proyecto
cd shopify-theme
shopify theme dev    # desarrollo con preview
shopify theme push   # subir tema a la tienda
```

En la primera ejecución te pedirá iniciar sesión y elegir tienda.  
Con `theme dev` se genera una URL de vista previa; con `theme push` el tema se sube como tema no publicado (o publicas desde el admin).

## Método 2: Theme Kit

```bash
brew install theme-kit   # macOS
# Crea config.yml en shopify-theme/ (no versionado):

# store: tu-tienda.myshopify.com
# password: shpat_xxxx   # Token de la API (Admin → Configuración → Apps y canales de ventas → Desarrollar aplicaciones → Crear app → Configurar Admin API → token)
```

Luego:

```bash
cd shopify-theme
theme deploy
```

## Método 3: Subir ZIP desde el admin

1. Empaqueta la carpeta `shopify-theme` en un `.zip` (el ZIP debe contener directamente `layout/`, `templates/`, `sections/`, etc., no una subcarpeta con el mismo nombre).
2. Shopify Admin → **Tienda online** → **Temas** → **Añadir tema** → **Subir archivo ZIP**.
3. Una vez subido, puedes publicar el tema o dejarlo como tema de respaldo.

## Después del despliegue

- **Página Elaboración:** en **Páginas** crea una página con handle `elaboracion` y asígnale la plantilla **elaboracion**.
- **Colecciones / productos:** los enlaces "Comprar edición" y "Añadir" apuntan a la colección o a la tienda; en un siguiente paso puedes enlazar productos concretos o variantes (por handle o ID) en las secciones.
