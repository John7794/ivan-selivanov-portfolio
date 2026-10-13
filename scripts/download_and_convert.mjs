import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// List of all 16 projects and their Drive links
const projectsData = [
  {
    id: 1,
    slug: 'inspace-logo',
    baseName: 'inspace-logo',
    desktopDriveIds: ['1aSuuwApMts70iAdCwniVuaFArP_250lM'],
    mobileDriveIds: []
  },
  {
    id: 2,
    slug: 'muzei-saleziian',
    baseName: 'muzei-saleziian',
    desktopDriveIds: ['1RaVwj7rW9qVB3RBPewDBYOoCil-PMFZt'],
    mobileDriveIds: []
  },
  {
    id: 3,
    slug: 'cosmopedia-logo',
    baseName: 'cosmopedia',
    desktopDriveIds: ['1vgB0yGEjA0Y2mtoasQ6GNxT10Qck_D_T'],
    mobileDriveIds: []
  },
  {
    id: 4,
    slug: 'fundraising-lp',
    baseName: 'fundraising-lp',
    desktopDriveIds: ['15SC2uKDcnbZQeH1LYWyBtFoU2HSeRMWo'],
    mobileDriveIds: []
  },
  {
    id: 5,
    slug: 'bee-protect-lp',
    baseName: 'bee-protect-lp',
    desktopDriveIds: ['1FsJEaurApt4v0uj88b2LS5tncXcIKaHM'],
    mobileDriveIds: []
  },
  {
    id: 6,
    slug: 'inspace-site',
    baseName: 'inspace-lp',
    desktopDriveIds: ['1e8dLHEaIO5ECHLA7cp_5WJn027wzw1Oy'],
    mobileDriveIds: ['13p26B0XL3lkzdR4_kRba7y5nIh8SjGr6']
  },
  {
    id: 7,
    slug: 'uk-passport-redesign',
    baseName: 'uk-passport',
    desktopDriveIds: [
      '1Hh002OuHFz7PfuhLeLmM20vX2QM8oZoo',
      '1afAjcXT0Dz4ISeluHAUUsNv9K4EzwiFT',
      '17YjD3Y09OM7HxLewTis0Hkw4RECYTCOV',
      '1qMI_dxat3zrOQOLyurEl8mxBnP-Xa31g',
      '1kNz9S_olWCpSahOrr-1dAxdTf_qslvyE'
    ],
    mobileDriveIds: []
  },
  {
    id: 8,
    slug: 'petsbro-ads',
    baseName: 'petsbro-ads',
    desktopDriveIds: [
      '1JahKk9hYWOX5WX9Dbo7n1GvFbtIvieqK',
      '1Zd15HbMjsFRRF9O6WAKhd1zurvP5MPpn',
      '1oNzt2NZB9rjr0sXJlSWdAli35rL2G8zf'
    ],
    mobileDriveIds: []
  },
  {
    id: 9,
    slug: 'mfalcon-3d',
    baseName: 'mfalcon-3d',
    desktopDriveIds: [
      '1xgS8V74RSvx18fv4ATq7A0y_hGf3z4R4',
      '1KZ34kpoG0fOnTA7gjgQbKK7t7jE1RrjM',
      '1aDHpuGaT9nX-TMq0jI4uD3XUFZXh5qFe',
      '1phdyeaxEVj9-Pp5GJpIZtMnasM1-HxzE',
      '1HSh3KE0C-IGUmnHzhblbV8s_o_ivtH7g',
      '1fiPaJPLtf_f-QSrdoz95ZWmpWEkKTCyt',
      '1Sc-a3o6ZcqU_SPkQdfvPA9cQDUY_oN_p',
      '19fJbKe41zLUrJv2gaBj8cisMUiLWNd7l',
      '1HLUaeHDhZNU3-kPLUpSMyxrWVLz3ZKxD',
      '1mQ-ldLgwXvkGxEDUbxCd3HzlX9uCmAD-'
    ],
    mobileDriveIds: []
  },
  {
    id: 10,
    slug: 'cosmopedia-app',
    baseName: 'cosmopedia-app',
    desktopDriveIds: [
      '1E4tw5xHvyJF9puNtYuhuqxOi3Je6Xxt7',
      '1EUxW22Sx7tRvId4ILCQyQ8itGIuo_K_S',
      '1nzv_fv44O-8hXE4g9x8viy_cbmGMBZO3',
      '1nbM9pq6WppzA505M4PjNan_dX0-XA8nn',
      '1z9vI0-eEfm7jcPQiViwi86C67cZX-jXM',
      '11aQHgUDEgoAgvzM66C-epQc-sOXdV0Ur',
      '1mGt5aGdGs5MwZdbz1_5Ol32tsc83AWbu'
    ],
    mobileDriveIds: []
  },
  {
    id: 11,
    slug: 'rodovody-archive',
    baseName: 'rodovody-archive',
    desktopDriveIds: [
      '1lYrkEZgAyfoGEs_sVJgSdWaAxebj-CSW',
      '1cSyks8JpMQTuy1Rrz8U_hGCivBqWXuKr',
      '1vMmyKwkMkQKaBmBkOUFi1yg68LwjOZLY'
    ],
    mobileDriveIds: []
  },
  {
    id: 12,
    slug: 'conference-identity',
    baseName: 'conference-identity',
    desktopDriveIds: ['1JZ9yuyItAwGZNCZS5t5y961NOypFxD7t'],
    mobileDriveIds: []
  },
  {
    id: 13,
    slug: 'kavomolka-app',
    baseName: 'kavomolka-app',
    desktopDriveIds: [],
    mobileDriveIds: ['1yzPyLHfEhKFhYTWoTnKUB-jJ1I1AWZWF']
  },
  {
    id: 14,
    slug: 'dentist-landing-page',
    baseName: 'dentist-landing-page',
    desktopDriveIds: ['1sW1CGBVJ825iFut-Qp5-HmSo4wcVQbU6'],
    mobileDriveIds: ['16z2Ob10HMJPUH7Vcs_rJAPs5k4EDN8B0']
  },
  {
    id: 15,
    slug: 'luna-ecommerce',
    baseName: 'luna-m',
    desktopDriveIds: [],
    mobileDriveIds: ['1RWWldmqBzTEAoSI9IMWj_7udJbCDgmZ9']
  },
  {
    id: 16,
    slug: 'parad-obuvi',
    baseName: 'parad-obuvi-d',
    desktopDriveIds: ['190ez-hH-9klWMHbFHHHMrG2Afa51CQ1I'],
    mobileDriveIds: []
  }
];

const assetsDir = path.resolve('ivan-selivanov-portfolio/assets/projects');
const publicDir = path.resolve('ivan-selivanov-portfolio/public/projects');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

async function downloadDriveImage(driveId) {
  const url = `https://lh3.googleusercontent.com/d/${driveId}=s0`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        const fallbackUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
        const fRes = await fetch(fallbackUrl);
        if (fRes.ok) {
          const buf = Buffer.from(await fRes.arrayBuffer());
          return buf;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return buf;
    } catch (err) {
      console.warn(`[Attempt ${attempt}/3] Failed to download ${driveId}: ${err.message}`);
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function run() {
  console.log('=== Starting Download and High-Definition WebP Conversion ===\n');

  const idToUrlMap = new Map();
  const idToFilenameMap = new Map();
  const projectScreensMap = [];

  for (const proj of projectsData) {
    console.log(`\n--- Project #${proj.id}: ${proj.slug} ---`);
    const projectFiles = [];

    // Desktop
    for (let i = 0; i < proj.desktopDriveIds.length; i++) {
      const driveId = proj.desktopDriveIds[i];
      let outName = '';
      if (proj.desktopDriveIds.length === 1) {
        if (proj.baseName.endsWith('.svg')) {
          outName = proj.baseName;
        } else if (proj.baseName.endsWith('-d')) {
          outName = `${proj.baseName}.webp`;
        } else {
          outName = `${proj.baseName}.webp`;
        }
      } else {
        const num = String(i + 1).padStart(2, '0');
        outName = `${proj.baseName}-${num}.webp`;
      }

      console.log(`Downloading desktop [${i + 1}/${proj.desktopDriveIds.length}] ${driveId} -> ${outName}...`);
      const rawBuf = await downloadDriveImage(driveId);

      const isSvg = rawBuf.slice(0, 100).toString('utf8').includes('<svg');
      let finalWebpBuf;

      if (isSvg) {
        outName = outName.replace(/\.webp$/, '.svg');
        finalWebpBuf = rawBuf;
        fs.writeFileSync(path.join(assetsDir, outName), rawBuf);
        fs.writeFileSync(path.join(publicDir, outName), rawBuf);
        console.log(`  Saved SVG: ${outName} (${(rawBuf.length / 1024).toFixed(1)} KB)`);
      } else {
        const image = sharp(rawBuf);
        const meta = await image.metadata();
        console.log(`  Source: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${(rawBuf.length / 1024).toFixed(1)} KB`);

        let pipeline = image;
        // Keep crisp retina sharpness up to 3840px (4K)
        if (meta.width > 3840 || meta.height > 3840) {
          pipeline = pipeline.resize(3840, 3840, { fit: 'inside', withoutEnlargement: true });
        }

        // WebP high quality 92 with smartSubsample for super sharp UI details
        finalWebpBuf = await pipeline.webp({ quality: 92, effort: 6, smartSubsample: true }).toBuffer();

        fs.writeFileSync(path.join(assetsDir, outName), finalWebpBuf);
        fs.writeFileSync(path.join(publicDir, outName), finalWebpBuf);
        console.log(`  Saved WebP: ${outName} (${(finalWebpBuf.length / 1024).toFixed(1)} KB)`);

        // Legacy compatibility aliases
        if (i === 0 && proj.id === 7) {
          fs.writeFileSync(path.join(publicDir, 'uk-passport-redesign.webp'), finalWebpBuf);
          fs.writeFileSync(path.join(assetsDir, 'uk-passport-redesign.webp'), finalWebpBuf);
        } else if (i === 0 && proj.id === 8) {
          fs.writeFileSync(path.join(publicDir, 'facebook-post-6.webp'), finalWebpBuf);
          fs.writeFileSync(path.join(assetsDir, 'facebook-post-6.webp'), finalWebpBuf);
        } else if (i === 0 && proj.id === 9) {
          fs.writeFileSync(path.join(publicDir, 'mfalcon-3d.webp'), finalWebpBuf);
          fs.writeFileSync(path.join(assetsDir, 'mfalcon-3d.webp'), finalWebpBuf);
        } else if (i === 0 && proj.id === 10) {
          fs.writeFileSync(path.join(publicDir, 'cosmopedia-app.webp'), finalWebpBuf);
          fs.writeFileSync(path.join(assetsDir, 'cosmopedia-app.webp'), finalWebpBuf);
        } else if (i === 0 && proj.id === 11) {
          fs.writeFileSync(path.join(publicDir, 'rodovody-archive.webp'), finalWebpBuf);
          fs.writeFileSync(path.join(assetsDir, 'rodovody-archive.webp'), finalWebpBuf);
        }
      }

      const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/John7794/ivan-selivanov-portfolio@main/assets/projects/${outName}`;
      idToUrlMap.set(driveId, jsdelivrUrl);
      idToFilenameMap.set(driveId, outName);
      projectFiles.push({ type: 'desktop', driveId, outName, jsdelivrUrl });
    }

    // Mobile
    for (let i = 0; i < proj.mobileDriveIds.length; i++) {
      const driveId = proj.mobileDriveIds[i];
      let outName = '';
      if (proj.baseName.endsWith('-m') || proj.baseName.endsWith('-lp')) {
        outName = `${proj.baseName}-m.webp`.replace('-lp-m.webp', '-lp-m.webp');
      } else {
        outName = `${proj.baseName}-m.webp`;
      }
      if (proj.id === 13) outName = 'kavomolka-app.webp';
      if (proj.id === 14) outName = 'dentist-landing-page-m.webp';
      if (proj.id === 15) outName = 'luna-m.webp';
      if (proj.id === 6) outName = 'inspace-lp-m.webp';

      console.log(`Downloading mobile [${i + 1}/${proj.mobileDriveIds.length}] ${driveId} -> ${outName}...`);
      const rawBuf = await downloadDriveImage(driveId);
      const image = sharp(rawBuf);
      const meta = await image.metadata();
      console.log(`  Source: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${(rawBuf.length / 1024).toFixed(1)} KB`);

      let pipeline = image;
      if (meta.width > 3840 || meta.height > 3840) {
        pipeline = pipeline.resize(3840, 3840, { fit: 'inside', withoutEnlargement: true });
      }

      const finalWebpBuf = await pipeline.webp({ quality: 92, effort: 6, smartSubsample: true }).toBuffer();
      fs.writeFileSync(path.join(assetsDir, outName), finalWebpBuf);
      fs.writeFileSync(path.join(publicDir, outName), finalWebpBuf);
      console.log(`  Saved WebP: ${outName} (${(finalWebpBuf.length / 1024).toFixed(1)} KB)`);

      const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/John7794/ivan-selivanov-portfolio@main/assets/projects/${outName}`;
      idToUrlMap.set(driveId, jsdelivrUrl);
      idToFilenameMap.set(driveId, outName);
      projectFiles.push({ type: 'mobile', driveId, outName, jsdelivrUrl });
    }

    projectScreensMap.push({
      id: proj.id,
      slug: proj.slug,
      files: projectFiles
    });
  }

  console.log('\n=== All 41 Images Downloaded & Converted Successfully ===');

  const urlMapObj = {};
  for (const [k, v] of idToUrlMap.entries()) {
    urlMapObj[k] = v;
  }
  fs.writeFileSync('ivan-selivanov-portfolio/src/data/driveMap.json', JSON.stringify(urlMapObj, null, 2));
  fs.writeFileSync('ivan-selivanov-portfolio/src/data/projectScreensMap.json', JSON.stringify(projectScreensMap, null, 2));

  console.log('Mapping saved to driveMap.json and projectScreensMap.json');
}

run().catch(console.error);
