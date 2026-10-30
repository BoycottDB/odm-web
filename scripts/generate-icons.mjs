// Génère le logo du header, les favicons et les icônes PWA/Apple depuis assets/logo.svg
// Usage : node scripts/generate-icons.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, 'assets/logo.svg');
const PUBLIC = path.join(ROOT, 'public');

// Fond des icônes d'application (= --background du site)
const APP_BACKGROUND = '#f8f6f7';
// Marge des icônes d'application : garde le dessin dans la zone sûre des icônes « maskable »
const APP_PADDING = 0.12;

const TRANSPARENT_ICONS = [
  { output: 'logo.png', size: 160 },
  { output: 'favicon-16x16.png', size: 16 },
  { output: 'favicon-32x32.png', size: 32 },
];

const APP_ICON_SIZES = [16, 32, 48, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 167, 180, 192, 512];

async function renderTransparent(size) {
  return sharp(SOURCE, { density: 300 }).resize(size, size).png().toBuffer();
}

async function renderOnBackground(size) {
  const inner = Math.round(size * (1 - 2 * APP_PADDING));
  const logo = await sharp(SOURCE, { density: 300 }).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: APP_BACKGROUND } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  for (const { output, size } of TRANSPARENT_ICONS) {
    await sharp(await renderTransparent(size)).toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
  for (const size of APP_ICON_SIZES) {
    const output = `icon-${size}.png`;
    await sharp(await renderOnBackground(size)).toFile(path.join(PUBLIC, output));
    console.log(`✓ ${output}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
