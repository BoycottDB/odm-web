// Génère le logo du header, les favicons et les icônes PWA/Apple depuis assets/logo.svg
// Usage : node scripts/generate-icons.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS = path.join(ROOT, 'assets');
const PUBLIC = path.join(ROOT, 'public');

// Logo X€? du header
const LOGO_HEIGHT = 84;
// Logo X€? centré dans un carré, transparent autour
const FAVICON_SIZES = [16, 32];
// Logo X€? coupé à la main sur le fond du site
// Fond transparent : c'est le téléphone qui choisit la couleur de remplissage
const APP_ICON_BACKGROUND = { r: 0, g: 0, b: 0, alpha: 0 };
const APP_ICON_LOGO_WIDTH = 0.96;
// Android peut rogner ces icônes en cercle : le logo doit rester dans leur zone sûre (cercle de 80 %)
const MASKABLE_ICON_SIZES = [192, 512];
const MASKABLE_ICON_LOGO_WIDTH = 0.75; // limite : les coins du logo, légèrement penché, touchent ce cercle
const APP_ICON_SIZES = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 167, 180, 192, 512];

function render(source) {
  return sharp(path.join(ASSETS, source), { density: 300 });
}

// Logo sans sa marge transparente, à la largeur voulue
async function renderTrimmedLogo(width) {
  const trimmed = await render('logo.svg').trim().png().toBuffer();
  return sharp(trimmed).resize({ width }).png().toBuffer();
}

async function renderFavicon(size) {
  const logo = await renderTrimmedLogo(size);
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function renderAppIcon(size) {
  const ratio = MASKABLE_ICON_SIZES.includes(size) ? MASKABLE_ICON_LOGO_WIDTH : APP_ICON_LOGO_WIDTH;
  const logo = await renderTrimmedLogo(Math.round(size * ratio));
  return sharp({ create: { width: size, height: size, channels: 4, background: APP_ICON_BACKGROUND } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  await render('logo.svg').resize({ height: LOGO_HEIGHT }).png().toFile(path.join(PUBLIC, 'logo.png'));
  console.log('✓ logo.png');
  for (const size of FAVICON_SIZES) {
    const output = `favicon-${size}x${size}.png`;
    await sharp(await renderFavicon(size)).toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
  for (const size of APP_ICON_SIZES) {
    const output = `icon-${size}.png`;
    await sharp(await renderAppIcon(size)).toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
