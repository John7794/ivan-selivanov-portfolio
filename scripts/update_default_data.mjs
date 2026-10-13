import fs from 'fs';

const projectScreens = JSON.parse(fs.readFileSync('ivan-selivanov-portfolio/src/data/projectScreensMap.json', 'utf8'));

let defDataStr = fs.readFileSync('ivan-selivanov-portfolio/src/data/defaultData.ts', 'utf8');

// For each project, update galleryUrls and thumbnailUrl
projectScreens.forEach(p => {
  const pIdStr = `"${p.id}"`;
  const desktopFiles = p.files.filter(f => f.type === 'desktop').map(f => `/projects/${f.outName}`);
  const mobileFiles = p.files.filter(f => f.type === 'mobile').map(f => `/projects/${f.outName}`);
  
  console.log(`Project #${p.id} (${p.slug}): ${desktopFiles.length} desktop, ${mobileFiles.length} mobile`);
});

// Specifically update projects 7, 8, 9, 10, 11
const ukPassportGallery = [
  "/projects/uk-passport-01.webp",
  "/projects/uk-passport-02.webp",
  "/projects/uk-passport-03.webp",
  "/projects/uk-passport-04.webp",
  "/projects/uk-passport-05.webp"
];

const petsbroGallery = [
  "/projects/petsbro-ads-01.webp",
  "/projects/petsbro-ads-02.webp",
  "/projects/petsbro-ads-03.webp"
];

const mfalconGallery = [
  "/projects/mfalcon-3d-01.webp",
  "/projects/mfalcon-3d-02.webp",
  "/projects/mfalcon-3d-03.webp",
  "/projects/mfalcon-3d-04.webp",
  "/projects/mfalcon-3d-05.webp",
  "/projects/mfalcon-3d-06.webp",
  "/projects/mfalcon-3d-07.webp",
  "/projects/mfalcon-3d-08.webp",
  "/projects/mfalcon-3d-09.webp",
  "/projects/mfalcon-3d-10.webp"
];

const cosmopediaGallery = [
  "/projects/cosmopedia-app-01.webp",
  "/projects/cosmopedia-app-02.webp",
  "/projects/cosmopedia-app-03.webp",
  "/projects/cosmopedia-app-04.webp",
  "/projects/cosmopedia-app-05.webp",
  "/projects/cosmopedia-app-06.webp",
  "/projects/cosmopedia-app-07.webp"
];

const rodovodyGallery = [
  "/projects/rodovody-archive-01.webp",
  "/projects/rodovody-archive-02.webp",
  "/projects/rodovody-archive-03.webp"
];

// Let's replace in defDataStr
defDataStr = defDataStr.replace(
  /"galleryUrls": \[\s*"\/projects\/uk-passport-redesign\.webp"\s*\]/,
  `"galleryUrls": ${JSON.stringify(ukPassportGallery, null, 8).replace(/^ {8}/gm, '    ')}`
);

defDataStr = defDataStr.replace(
  /"galleryUrls": \[\s*"\/projects\/facebook-post-6\.webp"\s*\]/,
  `"galleryUrls": ${JSON.stringify(petsbroGallery, null, 8).replace(/^ {8}/gm, '    ')}`
);

defDataStr = defDataStr.replace(
  /"galleryUrls": \[\s*"\/projects\/mfalcon-3d\.webp"\s*\]/,
  `"galleryUrls": ${JSON.stringify(mfalconGallery, null, 8).replace(/^ {8}/gm, '    ')}`
);

defDataStr = defDataStr.replace(
  /"galleryUrls": \[\s*"\/projects\/cosmopedia-app\.webp"\s*\]/,
  `"galleryUrls": ${JSON.stringify(cosmopediaGallery, null, 8).replace(/^ {8}/gm, '    ')}`
);

defDataStr = defDataStr.replace(
  /"galleryUrls": \[\s*"\/projects\/rodovody-archive\.webp"\s*\]/,
  `"galleryUrls": ${JSON.stringify(rodovodyGallery, null, 8).replace(/^ {8}/gm, '    ')}`
);

fs.writeFileSync('ivan-selivanov-portfolio/src/data/defaultData.ts', defDataStr);
console.log('Successfully updated DEFAULT_PROJECTS galleries in defaultData.ts');
