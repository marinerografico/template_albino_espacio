/**
 * Build: copia páginas a dist/ reescribiendo rutas; copia config, js y assets.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const CONFIG = path.join(ROOT, 'config');

const PATHS = {
  '../assets/': 'assets/',
  '../config/': 'config/',
  '../js/': 'js/'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function rewriteAndCopyHtml(srcPath, destPath) {
  let html = fs.readFileSync(srcPath, 'utf8');
  Object.entries(PATHS).forEach(([from, to]) => { html = html.split(from).join(to); });
  ensureDir(path.dirname(destPath));
  fs.writeFileSync(destPath, html);
}

// Dist layout
ensureDir(DIST);
ensureDir(path.join(DIST, 'config'));
ensureDir(path.join(DIST, 'js'));
ensureDir(path.join(DIST, 'assets'));

// Pages
rewriteAndCopyHtml(path.join(SRC, 'pages', 'index.html'), path.join(DIST, 'index.html'));
rewriteAndCopyHtml(path.join(SRC, 'pages', 'elaboracion.html'), path.join(DIST, 'elaboracion.html'));
rewriteAndCopyHtml(path.join(SRC, 'pages', 'nosotros.html'), path.join(DIST, 'nosotros.html'));
rewriteAndCopyHtml(path.join(SRC, 'pages', 'presencia.html'), path.join(DIST, 'presencia.html'));

// Config
copyFile(path.join(CONFIG, 'site.js'), path.join(DIST, 'config', 'site.js'));

// JS (order matters: binder after config, sticky-logo last for home)
const jsFiles = ['age-gate.js', 'binder.js', 'main.js', 'reveal.js', 'accordion.js', 'mobile-menu.js', 'hover-preview.js', 'sticky-logo.js', 'presence.js'];
jsFiles.forEach(name => {
  const src = path.join(SRC, 'js', name);
  if (fs.existsSync(src)) copyFile(src, path.join(DIST, 'js', name));
});

// CSS
copyFile(path.join(SRC, 'styles', 'albino.css'), path.join(DIST, 'assets', 'albino.css'));

// Public assets (p. ej. BDOGrotesk-DemiBold.woff2)
const publicAssets = path.join(ROOT, 'public', 'assets');
if (fs.existsSync(publicAssets)) {
  fs.readdirSync(publicAssets).forEach(name => {
    copyFile(path.join(publicAssets, name), path.join(DIST, 'assets', name));
  });
}

// Public root (fuentes .otf referenciadas en CSS como ../public/...)
const publicDir = path.join(ROOT, 'public');
if (fs.existsSync(publicDir)) {
  ensureDir(path.join(DIST, 'public'));
  fs.readdirSync(publicDir).forEach(name => {
    const src = path.join(publicDir, name);
    if (fs.statSync(src).isFile()) copyFile(src, path.join(DIST, 'public', name));
  });
}

console.log('Build done → dist/');
