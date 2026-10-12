import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('assets/projects');
const outputDir = path.resolve('public/projects');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map of original file name to clean standardized output filename
const mapping = {
  '1': 'conference-identity.webp',
  '1.png': 'rodovody-archive.webp',
  'bee-protect-lp.webp': 'bee-protect-lp.webp',
  'cosmopedia.svg': 'cosmopedia.svg',
  'dentist-landing-page-d': 'dentist-landing-page-d.webp',
  'dentist-landing-page-m': 'dentist-landing-page-m.webp',
  'facebook-post-6.png': 'facebook-post-6.webp',
  'fundraising-lp.png': 'fundraising-lp.webp',
  'image-01.png': 'cosmopedia-app.webp',
  'inspace-logo.webp': 'inspace-logo.webp',
  'inspace-lp-d': 'inspace-lp-d.webp',
  'inspace-lp-m': 'inspace-lp-m.webp',
  'kavomolka': 'kavomolka-app.webp',
  'luna-m': 'luna-m.webp',
  'mfalcon-1.png': 'mfalcon-3d.webp',
  'muzei-saleziian-uhkts.webp': 'muzei-saleziian.webp',
  'parad-obuvi-d': 'parad-obuvi-d.webp',
  'project-passport-uk-pages-to-jpg-0001.jpg': 'uk-passport-redesign.webp'
};

async function processImages() {
  console.log('--- Optimizing Project Images ---');
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const srcPath = path.join(inputDir, file);
    const stat = fs.statSync(srcPath);
    if (!stat.isFile()) continue;

    const outName = mapping[file] || (file.endsWith('.webp') ? file : `${file}.webp`);
    const destPath = path.join(outputDir, outName);

    if (file.endsWith('.svg')) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[SVG COPY] ${file} -> ${outName}`);
      continue;
    }

    try {
      const srcBuf = fs.readFileSync(srcPath);
      const image = sharp(srcBuf);
      const metadata = await image.metadata();

      // Resize max dimension to 2560px for retina displays, convert to WebP quality 85
      let pipeline = image;
      if (metadata.width > 2560 || metadata.height > 2560) {
        pipeline = pipeline.resize(2560, 2560, { fit: 'inside', withoutEnlargement: true });
      }

      const outBuf = await pipeline.webp({ quality: 85, effort: 6 }).toBuffer();
      fs.writeFileSync(destPath, outBuf);

      const oldSize = (stat.size / 1024).toFixed(1);
      const newSize = (outBuf.length / 1024).toFixed(1);
      const savings = (100 - (outBuf.length / stat.size) * 100).toFixed(1);
      console.log(`[OPTIMIZED] ${file} (${oldSize} KB) -> ${outName} (${newSize} KB) [Saved ${savings}%]`);

      // Also create a direct copy matching original name with .png if needed for backwards compat
      const directWebp = path.join(outputDir, `${file}.webp`);
      if (!fs.existsSync(directWebp) && directWebp !== destPath) {
        fs.writeFileSync(directWebp, outBuf);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  // Create high-resolution Open Graph Image (1200x630)
  console.log('\n--- Generating Open Graph Social Preview Image ---');
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0a" />
        <stop offset="50%" stop-color="#111111" />
        <stop offset="100%" stop-color="#070707" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#888888" />
      </linearGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#222222" stroke-width="0.8" opacity="0.6" />
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <!-- Grid overlay -->
    <rect width="1200" height="630" fill="url(#grid)" />

    <!-- Ambient glow circle -->
    <circle cx="1000" cy="200" r="300" fill="#333333" opacity="0.15" filter="blur(60px)" />

    <!-- Outer border -->
    <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#262626" stroke-width="1.5" />

    <!-- Top system bar -->
    <text x="70" y="80" fill="#888888" font-family="JetBrains Mono, monospace" font-size="14" letter-spacing="4">IS // PORTFOLIO 2026</text>
    <circle cx="1110" cy="74" r="5" fill="#10B981" />
    <text x="1000" y="78" fill="#10B981" font-family="JetBrains Mono, monospace" font-size="12" letter-spacing="2">AVAILABLE FOR WORK</text>

    <!-- Brand Monogram -->
    <text x="70" y="210" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="64" font-weight="bold" letter-spacing="8">IS</text>
    <line x1="70" y1="235" x2="260" y2="235" stroke="#444444" stroke-width="1.5" />

    <!-- Monumental Name -->
    <text x="70" y="340" fill="#f4f4f0" font-family="Inter, -apple-system, sans-serif" font-size="76" font-weight="900" letter-spacing="-2">IVAN SELIVANOV</text>
    <text x="70" y="410" fill="#a3a3a3" font-family="Inter, -apple-system, sans-serif" font-size="34" font-weight="400">Art Director &amp; UI/UX Architect</text>

    <!-- Subtitle / Disciplines -->
    <text x="70" y="520" fill="#737373" font-family="JetBrains Mono, monospace" font-size="16" letter-spacing="2">UI/UX PRODUCT • DESIGN SYSTEMS • IDENTITY • 3D VISUALIZATION</text>
    <text x="70" y="555" fill="#525252" font-family="JetBrains Mono, monospace" font-size="14" letter-spacing="1">LVIV, UKRAINE // AVAILABLE WORLDWIDE</text>

    <!-- Bottom link badge -->
    <rect x="940" y="500" width="190" height="44" fill="#161616" stroke="#333333" stroke-width="1" />
    <text x="965" y="528" fill="#f4f4f0" font-family="JetBrains Mono, monospace" font-size="13" letter-spacing="1">VIEW CASES →</text>
  </svg>
  `;

  const ogPngPath = path.resolve('public/og-image.png');
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(ogPngPath);
  console.log(`[OG-IMAGE GENERATED] ${ogPngPath} (1200x630)`);
}

processImages().catch(err => {
  console.error(err);
  process.exit(1);
});
