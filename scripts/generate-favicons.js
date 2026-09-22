import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// ICO format generator from PNG buffers
function createIco(pngBuffers) {
  // ICONDIR: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Image type (1 for ICO)
  // 4-5: Number of images
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries = [];

  for (const { buffer, width, height } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0); // width
    entry.writeUInt8(height >= 256 ? 0 : height, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([
    header,
    ...entries,
    ...pngBuffers.map(item => item.buffer)
  ]);
}

async function run() {
  const publicDir = path.resolve('public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  const icoSources = [];

  for (const target of targets) {
    const outPath = path.join(publicDir, target.name);
    const pngBuffer = await sharp(svgBuffer)
      .resize(target.size, target.size)
      .png()
      .toBuffer();

    fs.writeFileSync(outPath, pngBuffer);
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);

    if ([16, 32, 48].includes(target.size)) {
      icoSources.push({ buffer: pngBuffer, width: target.size, height: target.size });
    }
  }

  // Generate favicon.ico
  const icoBuffer = createIco(icoSources);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico (multi-res 16, 32, 48)');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
