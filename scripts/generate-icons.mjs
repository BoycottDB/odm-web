// Génère le logo du header, les favicons et les icônes PWA/Apple depuis les SVG de assets/
// Usage : node scripts/generate-icons.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS = path.join(ROOT, 'assets');
const PUBLIC = path.join(ROOT, 'public');

// Logo X€? du header
const LOGO_HEIGHT = 84;
// X€? sur fond carré coupé à la main, transparent autour
const FAVICON_SIZES = [16, 32];
// X€? plein cadre : le contenu reste dans la zone sûre des icônes « maskable »
const APP_ICON_SIZES = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 167, 180, 192, 512];

function render(source) {
  return sharp(path.join(ASSETS, source), { density: 300 });
}

async function main() {
  await render('logo.svg').resize({ height: LOGO_HEIGHT }).png().toFile(path.join(PUBLIC, 'logo.png'));
  console.log('✓ logo.png');
  for (const size of FAVICON_SIZES) {
    const output = `favicon-${size}x${size}.png`;
    await render('icon-favicon.svg').resize(size, size).png().toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
  for (const size of APP_ICON_SIZES) {
    const output = `icon-${size}.png`;
    await render('icon-app.svg').resize(size, size).png().toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
