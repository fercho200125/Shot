// Genera dist-single/mordida-burger.html: la web completa en un solo archivo
// (código, estilos, fuentes e imágenes incrustados). Ejecutar después de `vite build`.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const outDir = new URL('../dist-single/', import.meta.url).pathname;
const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff' };

const dataUri = (file) => `data:${TYPES[extname(file)]};base64,${readFileSync(file).toString('base64')}`;
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

let html = readFileSync(join(dist, 'index.html'), 'utf8');
const cssHref = /<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/.exec(html);
const jsSrc = /<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/.exec(html);
if (!cssHref || !jsSrc) throw new Error('No se encontraron el CSS o el JS en dist/index.html');

// Estilos con las fuentes incrustadas
const css = readFileSync(join(dist, cssHref[1]), 'utf8').replace(/url\(\.\/([^)]+)\)/g, (_, f) => `url(${dataUri(join(dist, 'assets', f))})`);

// Imágenes: solo la versión grande; la de 640 px apunta a la misma para no duplicar peso
const images = walk(join(dist, 'img')).map((f) => f.slice(dist.length));
const large = images.filter((p) => !/-640\.webp$/.test(p));
const map = large.map((p) => `${JSON.stringify(p)}:${JSON.stringify(dataUri(join(dist, p)))}`).join(',');
const aliases = images
  .filter((p) => /-640\.webp$/.test(p))
  .map((p) => `a[${JSON.stringify(p)}]=a[${JSON.stringify(p.replace('-640.webp', '.webp'))}];`)
  .join('');
const assetsScript = `<script>(function(){var a={${map}};${aliases}window.__MORDIDA_ASSETS__=a;})();</script>`;

const js = readFileSync(join(dist, jsSrc[1]), 'utf8').replace(/<\/script/gi, '<\\/script');

html = html
  .replace(cssHref[0], () => `<style>${css}</style>`)
  .replace(jsSrc[0], () => `${assetsScript}\n<script type="module">${js}</script>`)
  .replace(/\s*<link\s+rel="preload"[\s\S]*?\/>/, '')
  .replace(/\s*<!--[^>]*-->\s*<meta property="og:image"[^>]*>/, '')
  .replace('href="./favicon.png"', () => `href="${dataUri(join(dist, 'favicon.png'))}"`)
  .replace('href="./apple-touch-icon.png"', () => `href="${dataUri(join(dist, 'apple-touch-icon.png'))}"`);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'mordida-burger.html'), html);
console.log(`dist-single/mordida-burger.html · ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
