import { Project, ExperienceItem, Testimonial, GeneralSettings, LegalAndBannersData, ContactsData, FilterOption } from '../types';
import { DEFAULT_PROJECTS, DEFAULT_EXPERIENCE, DEFAULT_TESTIMONIALS, DEFAULT_SETTINGS, DEFAULT_LEGAL_AND_BANNERS, DEFAULT_CONTACTS } from '../data/defaultData';
import { translateToEnglishIfNeeded, hasCyrillic } from '../utils/i18n';

const CACHE_KEY = 'ivan_portfolio_sheets_data';
const SETTINGS_KEY = 'ivan_portfolio_settings';

export interface PortfolioData {
  projects: Project[];
  categories?: FilterOption[];
  statuses?: FilterOption[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  settings: GeneralSettings;
  contacts: ContactsData;
  legalAndBanners: LegalAndBannersData;
  source: 'cache' | 'default' | 'live_sheets';
  lastSyncedAt: string;
  hasLegalDataInEndpoint?: boolean;
  rawEndpointResponseKeys?: string[];
}

export const DEFAULT_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzWBH_tyMHYUEeaRM1u91hS1TWTKiQm3F2H6eFfQNN9oUBIKfbwZnF36kFERfZ9D1gLhA/exec';

export function formatImageUrl(url: any, fallback?: string): string {
  if (!url) return fallback || '';

  let cleanUrl = '';
  if (typeof url === 'string') {
    cleanUrl = url.trim();
  } else if (typeof url === 'object' && url !== null) {
    const candidate = url.ua || url.en || url.url || url.src || '';
    if (typeof candidate === 'string') {
      cleanUrl = candidate.trim();
    }
  } else {
    cleanUrl = String(url).trim();
  }

  if (!cleanUrl) return fallback || '';
  
  // Extract ID from any Google Drive link
  let fileId = '';
  
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = cleanUrl.match(driveRegex);
  if (match && match[1]) fileId = match[1];
  
  const openRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = cleanUrl.match(openRegex);
  if (openMatch && openMatch[1]) fileId = openMatch[1];
  
  const ucRegex = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = cleanUrl.match(ucRegex);
  if (ucMatch && ucMatch[1]) fileId = ucMatch[1];

  const lhMatch = cleanUrl.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lhMatch && lhMatch[1]) fileId = lhMatch[1];

  const thumbMatch = cleanUrl.match(/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (thumbMatch && thumbMatch[1]) fileId = thumbMatch[1];
  
  if (fileId) {
    // =s0 instructs Google's edge CDN to render the image in full crystal-clear native resolution, preventing blurry previews
    return `https://lh3.googleusercontent.com/d/${fileId}=s0`;
  }

  // Optimize Unsplash images for crisp retina displays
  if (cleanUrl.includes('images.unsplash.com')) {
    let upgraded = cleanUrl;
    if (upgraded.includes('w=')) {
      upgraded = upgraded.replace(/w=\d+/, 'w=3200');
    } else {
      upgraded += '&w=3200';
    }
    if (upgraded.includes('q=')) {
      upgraded = upgraded.replace(/q=\d+/, 'q=95');
    }
    return upgraded;
  }

  return cleanUrl;
}

export function cleanLiveLink(val: any): string | undefined {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;
  const lower = str.toLowerCase();
  if (
    lower === '-' ||
    lower === '–' ||
    lower === '—' ||
    lower === '#' ||
    lower === 'none' ||
    lower === 'n/a' ||
    lower === 'na' ||
    lower === 'null' ||
    lower === 'undefined' ||
    lower === 'false' ||
    lower === 'no' ||
    lower === 'ні' ||
    lower === 'немає' ||
    lower === 'http://' ||
    lower === 'https://' ||
    lower === 'http://...' ||
    lower === 'https://...'
  ) {
    return undefined;
  }
  return str.length > 3 ? str : undefined;
}

function isLocalizedObj(val: any): boolean {
  return typeof val === 'object' && val !== null && !Array.isArray(val) && ('ua' in val || 'en' in val);
}

function parseFontList(val: any): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {}
    return val.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

const KNOWN_FONTS = [
  'PP Neue Montreal', 'Neue Montreal', 'Plus Jakarta Sans', 'Jakarta Sans',
  'Space Grotesk', 'Space Mono', 'Cabinet Grotesk', 'General Sans',
  'Clash Display', 'Playfair Display', 'Cormorant Garamond', 'IBM Plex Sans',
  'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'Fira Sans', 'Noto Sans',
  'Noto Serif', 'DM Sans', 'DM Serif', 'Work Sans', 'Monument Extended',
  'Bebas Neue', 'Cinzel Decorative', 'Cinzel', 'Inter', 'Roboto', 'Syne',
  'Montserrat', 'Geist', 'Satoshi', 'Manrope', 'Outfit', 'Unbounded',
  'Onest', 'Golos Text', 'Golos', 'e-Ukraine', 'Arial', 'Futura',
  'Circular', 'SF Pro Display', 'SF Pro Text', 'SF Pro', 'Poppins',
  'Lato', 'Open Sans', 'Raleway', 'Oswald', 'Rubik', 'Ubuntu',
  'Merriweather', 'Lora', 'Epilogue', 'Sora', 'Urbanist'
];

function extractFontNamesFromText(text: string): string[] {
  if (!text) return [];
  const clean = text.trim();

  // 1. If text is short (<= 35 chars) and doesn't look like a sentence, treat as comma/ampersand separated list
  if (clean.length <= 35 && !/[.!?]$/.test(clean) && !clean.includes(' з ') && !clean.includes(' with ') && !clean.includes(' для ') && !clean.includes(' for ')) {
    return clean.split(/[,;&+/]|\band\b|\bта\b/i).map(s => s.trim()).filter(Boolean);
  }

  // 2. Check for colon or dash prefix: e.g. "Inter: ..." or "PP Neue Montreal — ..."
  const prefixMatch = clean.match(/^([A-Za-z0-9\s\-]+?)\s*(?::|—|-{1,2})\s*(.+)$/);
  if (prefixMatch && prefixMatch[1].trim().length <= 35) {
    const extracted = prefixMatch[1].trim();
    if (extracted.length > 2) return [extracted];
  }

  // 3. Check for parentheses containing Latin font family/style: e.g. "(Geometric Sans-Serif)"
  const parenMatches = clean.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    for (const pm of parenMatches) {
      const inner = pm.replace(/[()]/g, '').trim();
      // If inner is 1-4 words and contains letters (e.g. Geometric Sans-Serif)
      if (inner.length >= 3 && inner.length <= 35 && /^[A-Za-z0-9\s\-]+$/.test(inner)) {
        return [inner];
      }
    }
  }

  // 4. Check for known font names inside the text
  const foundKnown: string[] = [];
  for (const kf of KNOWN_FONTS) {
    const regex = new RegExp(`\\b${kf.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(clean)) {
      if (!foundKnown.some(f => f.toLowerCase() === kf.toLowerCase())) {
        foundKnown.push(kf);
      }
    }
  }
  if (foundKnown.length > 0) return foundKnown;

  // 5. Look for typographic style classifications in Ukrainian or English
  if (/геометричн\w*\s+гротеск/i.test(clean) || /geometric\s+sans/i.test(clean)) {
    return ['Geometric Sans-Serif'];
  }
  if (/неогротеск/i.test(clean) || /neo-grotesque/i.test(clean)) {
    return ['Neo-Grotesque'];
  }
  if (/гуманістичн\w*\s+гротеск/i.test(clean) || /humanist\s+sans/i.test(clean)) {
    return ['Humanist Sans'];
  }
  if (/моноширинн\w*/i.test(clean) || /monospace/i.test(clean)) {
    return ['Monospace / Code'];
  }
  if (/антикв\w*/i.test(clean) || /serif/i.test(clean)) {
    return ['Editorial Serif'];
  }
  if (/гротеск/i.test(clean) || /sans-serif/i.test(clean)) {
    return ['Sans-Serif'];
  }

  // 6. If it's a long sentence, take the first 2-3 words or a clean label
  const words = clean.split(/\s+/).slice(0, 3).join(' ').replace(/[.,;:!]$/, '');
  if (words.length > 2 && words.length <= 30) {
    return [words];
  }

  return ['Custom Typography'];
}

export function parseFontsDescription(p: any): { ua: string; en: string } | undefined {
  if (!p) return undefined;

  const rawUa = String(p.fonts_ua || p.font_ua || p.typography_ua || p.fonts_desc_ua || '').trim();
  const rawEn = String(p.fonts_en || p.font_en || p.typography_en || p.fonts_desc_en || '').trim();

  // If a string is short (<= 30 chars) and is just a simple font name like "Inter, Roboto", it's not a description
  const isJustFontName = (text: string) => {
    if (!text) return true;
    if (text.length > 40) return false;
    if (/[.!?]/.test(text) || text.includes(' для ') || text.includes(' for ') || text.includes(' з ') || text.includes(' with ')) {
      return false;
    }
    return true;
  };

  if (rawUa && !isJustFontName(rawUa)) {
    return {
      ua: rawUa,
      en: rawEn && !isJustFontName(rawEn) ? rawEn : translateToEnglishIfNeeded(rawUa)
    };
  }

  if (rawEn && !isJustFontName(rawEn)) {
    return {
      ua: rawUa && !isJustFontName(rawUa) ? rawUa : rawEn,
      en: rawEn
    };
  }

  return undefined;
}

export function parseFonts(p: any): { ua: string[]; en: string[] } | string[] {
  if (!p) return [];

  // 1. If explicit font column exists (e.g. p.fonts, p.font_family, p.font_families, p.typography)
  const explicit = p.fonts || p.font_family || p.font_families || p.typography_fonts || p.designSystem?.fonts;
  if (explicit) {
    const list = parseFontList(explicit);
    if (list.length > 0 && list.every(f => f.length <= 40)) {
      return list;
    }
  }

  // 2. Extract from descriptive columns fonts_ua / fonts_en
  const rawUa = String(p.fonts_ua || p.font_ua || p.typography_ua || '').trim();
  const rawEn = String(p.fonts_en || p.font_en || p.typography_en || '').trim();

  if (rawEn) {
    const fromEn = extractFontNamesFromText(rawEn);
    if (fromEn.length > 0) return fromEn;
  }

  if (rawUa) {
    const fromUa = extractFontNamesFromText(rawUa);
    if (fromUa.length > 0) return fromUa;
  }

  return [];
}

function extractCleanHex(str: string): string | null {
  if (!str) return null;
  const trimmed = str.trim();
  // Valid hex with hash: #FFF, #FFFF, #FFFFFF, #FFFFFFFF
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  // Hex without hash: 3, 4, 6, or 8 hex digits
  if (/^([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return `#${trimmed.toUpperCase()}`;
  }
  return null;
}

function parseSwatchesFromSource(val: any): { name: string; hex: string }[] {
  if (!val) return [];

  if (Array.isArray(val)) {
    const list: { name: string; hex: string }[] = [];
    val.forEach((item, idx) => {
      if (typeof item === 'string') {
        const h = extractCleanHex(item);
        if (h) list.push({ name: `Color ${idx + 1}`, hex: h });
      } else if (item && typeof item === 'object') {
        const rawName = typeof item.name === 'object' ? (item.name.ua || item.name.en) : item.name;
        const h = extractCleanHex(String(item.hex || item.color || ''));
        if (h) {
          list.push({ name: String(rawName || `Color ${idx + 1}`), hex: h });
        }
      }
    });
    return list;
  }

  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parseSwatchesFromSource(parsed);
    } catch {}

    const parts = val.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    const results: { name: string; hex: string }[] = [];

    parts.forEach((part, idx) => {
      if (part.includes(':') || part.includes(' - ')) {
        const sep = part.includes(':') ? ':' : ' - ';
        const [name, hex] = part.split(sep).map(s => s.trim());
        const h = extractCleanHex(hex);
        if (h) {
          results.push({ name: name || `Color ${idx + 1}`, hex: h });
          return;
        }
      }
      const directHex = extractCleanHex(part);
      if (directHex) {
        results.push({ name: `Color ${results.length + 1}`, hex: directHex });
        return;
      }
      // Check space-delimited hex codes inside the part
      const subTokens = part.split(/\s+/).map(s => s.trim()).filter(Boolean);
      subTokens.forEach(st => {
        const subHex = extractCleanHex(st);
        if (subHex) {
          results.push({ name: `Color ${results.length + 1}`, hex: subHex });
        }
      });
    });

    if (results.length > 0) return results;

    // Regex match any #hex
    const regexMatches = val.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g);
    if (regexMatches && regexMatches.length > 0) {
      return regexMatches.map((m, idx) => ({ name: `Color ${idx + 1}`, hex: m.toUpperCase() }));
    }
  }

  return [];
}

export function parseColorsDescription(p: any): { ua: string; en: string } | undefined {
  if (!p) return undefined;

  const rawUa = String(p.colors_ua || p.color_ua || p.colors_desc_ua || p.palette_ua || p.palette_desc_ua || '').trim();
  const rawEn = String(p.colors_en || p.color_en || p.colors_desc_en || p.palette_en || p.palette_desc_en || '').trim();

  // If a string only contains HEX tokens without actual sentences/words, it's not a description
  const isPureHexList = (text: string) => {
    if (!text) return true;
    const stripped = text.replace(/#[0-9a-fA-F]{3,8}/gi, '').replace(/[\s,;:\-–—]/g, '');
    return stripped.length === 0;
  };

  if (rawUa && !isPureHexList(rawUa)) {
    return {
      ua: rawUa,
      en: rawEn && !isPureHexList(rawEn) ? rawEn : translateToEnglishIfNeeded(rawUa)
    };
  }
  if (rawEn && !isPureHexList(rawEn)) {
    return {
      ua: rawUa && !isPureHexList(rawUa) ? rawUa : rawEn,
      en: rawEn
    };
  }
  return undefined;
}

export function parseColors(p: any): { name: string | { ua: string; en: string }; hex: string }[] {
  if (!p) return [];

  // 1. Primary source: palette column (or colors_hex / palette_hex / colors)
  const paletteSource = p.palette || p.palette_hex || p.colors_hex || p.colors || p.designSystem?.colors;
  const swatchesFromPalette = parseSwatchesFromSource(paletteSource);

  // 2. Secondary source: check if colors_ua or colors_en has explicit name:hex or hex list
  const swatchesFromUa = parseSwatchesFromSource(p.colors_ua);
  const swatchesFromEn = parseSwatchesFromSource(p.colors_en);

  if (swatchesFromPalette.length > 0) {
    // If swatchesFromPalette has colors, check if colors_ua/colors_en provides localized names
    if (swatchesFromUa.length === swatchesFromPalette.length && swatchesFromEn.length === swatchesFromPalette.length) {
      return swatchesFromPalette.map((item, idx) => ({
        name: {
          ua: swatchesFromUa[idx]?.name || item.name,
          en: swatchesFromEn[idx]?.name || item.name
        },
        hex: item.hex
      }));
    }
    return swatchesFromPalette;
  }

  // If palette was empty, maybe swatches were defined in colors_ua/colors_en?
  if (swatchesFromUa.length > 0 || swatchesFromEn.length > 0) {
    const maxLen = Math.max(swatchesFromUa.length, swatchesFromEn.length);
    const result: { name: { ua: string; en: string }; hex: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const itemUa = swatchesFromUa[i];
      const itemEn = swatchesFromEn[i];
      result.push({
        name: {
          ua: itemUa?.name || itemEn?.name || `Колір ${i + 1}`,
          en: itemEn?.name || itemUa?.name || `Color ${i + 1}`
        },
        hex: itemUa?.hex || itemEn?.hex || '#000000'
      });
    }
    return result;
  }

  return [];
}

function stripFigJam(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/\s*(?:та|and|,)\s*FigJam\b/gi, '')
    .replace(/\bFigJam\s*(?:та|and|,)?\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function parseProjectImages(p: any): { thumbnailUrl: string; galleryUrls: string[] } {
  const images: string[] = [];

  const addUrl = (raw: any) => {
    if (!raw) return;
    if (typeof raw !== 'string') return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const formatted = formatImageUrl(trimmed);
    if (formatted && !images.includes(formatted)) {
      images.push(formatted);
    }
  };

  const processEntry = (val: any) => {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(item => {
        if (typeof item === 'string') addUrl(item);
      });
      return;
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return;
      // Split by newline, semicolon, or comma
      const items = trimmed.split(/[\n;,]+/).map(s => s.trim()).filter(Boolean);
      if (items.length > 0) {
        items.forEach(addUrl);
      } else {
        addUrl(trimmed);
      }
    }
  };

  // 1. Check primary/cover fields first
  const primaryKeys = ['thumbnailUrl', 'heroImage', 'cover', 'coverImage', 'image', 'mainImage'];
  for (const k of primaryKeys) {
    if (p[k]) processEntry(p[k]);
  }

  // 2. Check multi-image fields
  const multiKeys = ['galleryUrls', 'gallery', 'images', 'screenshots', 'screens', 'additional_images', 'additionalImages', 'photos'];
  for (const k of multiKeys) {
    if (p[k]) processEntry(p[k]);
  }

  // 3. Check numbered columns: image_1..20, image1..20, gallery1..20, screen1..20
  for (let i = 1; i <= 20; i++) {
    const numberedKeys = [
      `image_${i}`,
      `image${i}`,
      `gallery_${i}`,
      `gallery${i}`,
      `screen_${i}`,
      `screen${i}`,
      `screenshot_${i}`,
      `screenshot${i}`
    ];
    for (const key of numberedKeys) {
      if (p[key]) processEntry(p[key]);
    }
  }

  const defaultImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600';
  const finalUrls = images.length > 0 ? images : [defaultImage];

  return {
    thumbnailUrl: finalUrls[0],
    galleryUrls: finalUrls
  };
}

export function parseProjectCategory(
  p: any, 
  categoriesMap?: Map<string, { ua: string; en: string }>
): { id: string; label: { ua: string; en: string } } {
  const raw = p.category || p.category_ua || p.discipline || p.categoryLabel || '';
  const rawEn = p.category_en || p.categoryLabel_en || '';

  let rawStr = '';
  if (typeof raw === 'object' && raw !== null) {
    rawStr = String(raw.ua || raw.en || '').trim();
  } else {
    rawStr = String(raw ?? '').trim();
  }

  const rawLower = rawStr.toLowerCase();

  // 0. Check custom Categories tab mapping if provided
  if (categoriesMap && categoriesMap.size > 0) {
    // Check by exact key/slug or lowercase
    const matched = categoriesMap.get(rawStr) || categoriesMap.get(rawLower);
    if (matched) {
      return {
        id: rawLower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'cat',
        label: {
          ua: matched.ua || rawStr,
          en: matched.en || matched.ua || rawStr
        }
      };
    }
  }

  // 1. UI/UX patterns
  if (
    rawLower === 'ui-ux' ||
    rawLower === 'ui/ux' ||
    rawLower.includes('ui/ux') ||
    rawLower.includes('ui-ux') ||
    rawLower.includes('продукт') ||
    rawLower.includes('product') ||
    rawLower.includes('інтерфейс') ||
    rawLower.includes('interface')
  ) {
    return {
      id: 'ui-ux',
      label: {
        ua: rawStr && !rawLower.includes('ui-ux') ? rawStr : 'UI/UX Продукт',
        en: String(rawEn || '').trim() || 'UI/UX Product'
      }
    };
  }

  // 2. 3D Render patterns
  if (
    rawLower === '3d-render' ||
    rawLower === '3d' ||
    rawLower.includes('3d') ||
    rawLower.includes('рендер') ||
    rawLower.includes('render')
  ) {
    return {
      id: '3d-render',
      label: {
        ua: rawStr && !rawLower.includes('3d-render') ? rawStr : '3D Рендери',
        en: String(rawEn || '').trim() || '3D Renders'
      }
    };
  }

  // 3. Book Design patterns
  if (
    rawLower === 'book-design' ||
    rawLower.includes('книг') ||
    rawLower.includes('book') ||
    rawLower.includes('верстк') ||
    rawLower.includes('editorial')
  ) {
    return {
      id: 'book-design',
      label: {
        ua: rawStr && !rawLower.includes('book-design') ? rawStr : 'Книжковий дизайн',
        en: String(rawEn || '').trim() || 'Book Design'
      }
    };
  }

  // 4. Branding & Identity patterns
  if (
    rawLower === 'branding' ||
    rawLower.includes('айдентик') ||
    rawLower.includes('бренд') ||
    rawLower.includes('brand') ||
    rawLower.includes('постер') ||
    rawLower.includes('poster') ||
    rawLower.includes('identity')
  ) {
    return {
      id: 'branding',
      label: {
        ua: rawStr && !rawLower.includes('branding') ? rawStr : 'Айдентика & Постери',
        en: String(rawEn || '').trim() || 'Identity & Posters'
      }
    };
  }

  // 5. Custom Category from user's table (e.g. Mobile, Motion, Illustrations)
  if (rawStr) {
    const slug = rawLower
      .replace(/[^\w\dа-яіїєґ]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'custom';
    
    const enLabel = String(rawEn || '').trim() || translateToEnglishIfNeeded(rawStr);

    return {
      id: slug,
      label: {
        ua: rawStr,
        en: enLabel
      }
    };
  }

  // Fallback if empty
  return {
    id: 'ui-ux',
    label: { ua: 'UI/UX Продукт', en: 'UI/UX Product' }
  };
}

export function parseProjectStatus(
  p: any,
  statusesMap?: Map<string, { filterLabel: { ua: string; en: string }; badgeLabel: { ua: string; en: string } }>
): { id: string; filterLabel: { ua: string; en: string }; badgeLabel: { ua: string; en: string } } {
  const raw = p.status || p.status_ua || p.project_status || '';
  const rawEn = p.status_en || '';

  let rawStr = '';
  if (typeof raw === 'object' && raw !== null) {
    rawStr = String(raw.ua || raw.en || '').trim();
  } else {
    rawStr = String(raw ?? '').trim();
  }

  const rawLower = rawStr.toLowerCase();

  // 0. Explicit bilingual status columns on project row
  if (p.status_ua || p.status_en) {
    const ua = String(p.status_ua || rawStr || 'Продакшн').trim();
    const en = String(p.status_en || rawEn || ua).trim();
    const slug = rawLower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'status';
    return {
      id: slug,
      filterLabel: { ua, en },
      badgeLabel: { ua, en }
    };
  }

  // 1. Look up in custom Statuses tab mapping if provided
  if (statusesMap && statusesMap.size > 0) {
    const matched = statusesMap.get(rawStr) || statusesMap.get(rawLower);
    if (matched) {
      return {
        id: rawLower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'status',
        filterLabel: matched.filterLabel,
        badgeLabel: matched.badgeLabel
      };
    }
  }

  // 2. Concept / R&D
  if (
    rawLower === 'concept' ||
    rawLower.includes('концепт') ||
    rawLower.includes('r&d') ||
    rawLower.includes('rnd') ||
    rawLower.includes('досліджен') ||
    rawLower.includes('research')
  ) {
    return {
      id: 'concept',
      filterLabel: { ua: 'Концепти & R&D', en: 'Concept & R&D' },
      badgeLabel: { ua: 'Концепт', en: 'Concept' }
    };
  }

  // Realized / Production
  if (
    rawLower === 'realized' ||
    rawLower.includes('продакшн') ||
    rawLower.includes('продакшен') ||
    rawLower.includes('реалізован') ||
    rawLower.includes('production') ||
    rawLower.includes('live') ||
    rawLower.includes('реліз') ||
    rawLower.includes('release')
  ) {
    return {
      id: 'realized',
      filterLabel: { ua: 'Реалізовані (Продакшн)', en: 'Production' },
      badgeLabel: { ua: 'Продакшн', en: 'Production' }
    };
  }

  // Custom Status from user's table (e.g. "В роботі", "Archive", etc.)
  if (rawStr) {
    const slug = rawLower
      .replace(/[^\w\dа-яіїєґ]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'custom';

    const enLabel = String(rawEn || '').trim() || translateToEnglishIfNeeded(rawStr);

    return {
      id: slug,
      filterLabel: { ua: rawStr, en: enLabel },
      badgeLabel: { ua: rawStr, en: enLabel }
    };
  }

  // Default to realized
  return {
    id: 'realized',
    filterLabel: { ua: 'Реалізовані (Продакшн)', en: 'Production' },
    badgeLabel: { ua: 'Продакшн', en: 'Production' }
  };
}

export function mapCategoriesFromSheet(raw: any): FilterOption[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (typeof raw === 'object' ? Object.values(raw) : []);
  const result: FilterOption[] = [];
  const seen = new Set<string>();

  list.forEach((row: any, idx: number) => {
    if (!row) return;
    const id = String(row.id || row.key || row.slug || row.code || `cat-${idx + 1}`).trim().toLowerCase();
    const ua = String(row.ua || row.name_ua || row.title_ua || row.title || row.name || row.label || id).trim();
    const en = String(row.en || row.name_en || row.title_en || row.title || row.name || row.label || ua).trim();
    if (id && id !== 'all' && !seen.has(id)) {
      seen.add(id);
      result.push({ id, ua, en: translateToEnglishIfNeeded(ua, en) });
    }
  });

  return result;
}

export function mapStatusesFromSheet(raw: any): FilterOption[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (typeof raw === 'object' ? Object.values(raw) : []);
  const result: FilterOption[] = [];
  const seen = new Set<string>();

  list.forEach((row: any, idx: number) => {
    if (!row) return;
    const id = String(row.id || row.key || row.slug || row.code || `status-${idx + 1}`).trim().toLowerCase();
    const ua = String(row.ua || row.name_ua || row.title_ua || row.title || row.name || row.label || id).trim();
    const en = String(row.en || row.name_en || row.title_en || row.title || row.name || row.label || ua).trim();
    if (id && id !== 'all' && !seen.has(id)) {
      seen.add(id);
      result.push({ id, ua, en: translateToEnglishIfNeeded(ua, en) });
    }
  });

  return result;
}

function parseTools(val: any): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {}
    return val.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  }
  return ['Figma', 'TypeScript', 'Design Systems'];
}

function mapProjectFromSheet(
  p: any, 
  idx: number, 
  categoriesMap?: Map<string, { ua: string; en: string }>,
  statusesMap?: Map<string, { filterLabel: { ua: string; en: string }; badgeLabel: { ua: string; en: string } }>
): Project {
  const { id: catId, label: catLabel } = parseProjectCategory(p, categoriesMap);
  const { id: statusId, filterLabel, badgeLabel } = parseProjectStatus(p, statusesMap);

  const parsedFonts = parseFonts(p);
  const parsedFontsDescription = parseFontsDescription(p);
  const parsedColors = parseColors(p);
  const parsedColorsDescription = parseColorsDescription(p);
  const parsedGrid = String(p.gridType || p.grid || p.designSystem?.gridType || '').trim();
  const { thumbnailUrl, galleryUrls } = parseProjectImages(p);

  const rawTitleUa = p.title_ua || p.title || p.name_ua || p.name || '';
  const rawTitleEn = p.title_en || (p.title_ua ? '' : p.title) || p.name_en || p.name || '';

  let titleUa = '';
  let titleEn = '';

  if (typeof p.title === 'object' && p.title !== null) {
    titleUa = String(p.title.ua || rawTitleUa || 'Без назви').trim();
    titleEn = String(p.title.en || rawTitleEn || titleUa).trim();
  } else {
    titleUa = String(p.title_ua || p.title || p.name_ua || p.name || 'Без назви').trim();
    titleEn = String(p.title_en || (p.title_ua ? '' : p.title) || p.name_en || p.name || '').trim();
    if (!titleEn && titleUa) {
      titleEn = translateToEnglishIfNeeded(titleUa, undefined, titleUa);
    }
  }

  const resolvedTitle = {
    ua: titleUa,
    en: titleEn || titleUa
  };

  return {
    id: String(p.id || `p-${idx + 1}`),
    slug: String(p.slug || p.id || `project-${idx + 1}`),
    title: resolvedTitle,
    title_ua: resolvedTitle.ua,
    title_en: resolvedTitle.en,
    client: p.client ? String(p.client).trim() : undefined,
    category: catId,
    categoryLabel: catLabel,
    status: statusId,
    statusLabel: filterLabel,
    statusBadgeLabel: badgeLabel,
    role: isLocalizedObj(p.role) ? p.role : {
      ua: String(p.role_ua || p.role || p.Role || p.Role_UA || p.position || p.position_ua || 'Lead Designer & Creative Director').trim(),
      en: String(p.role_en || (!p.role_ua ? (p.role || p.Role || p.position) : '') || p.role_ua || p.role || 'Lead Designer & Creative Director').trim()
    },
    timeline: String(p.year || p.timeline || '2024'),
    tagline: isLocalizedObj(p.tagline) ? p.tagline : {
      ua: p.tagline_ua || p.tagline || '',
      en: p.tagline_en || p.tagline || ''
    },
    description: isLocalizedObj(p.description) ? p.description : {
      ua: p.overview_ua || p.description_ua || p.description || '',
      en: p.overview_en || p.description_en || p.description || ''
    },
    problemStatement: isLocalizedObj(p.problemStatement) ? p.problemStatement : {
      ua: String(p.challenge_ua || p.problem_ua || p.problemStatement_ua || '').trim(),
      en: String(p.challenge_en || p.problem_en || p.problemStatement_en || '').trim()
    },
    solution: isLocalizedObj(p.solution) ? p.solution : {
      ua: String(p.solution_ua || '').trim(),
      en: String(p.solution_en || '').trim()
    },
    businessImpact: isLocalizedObj(p.businessImpact) ? p.businessImpact : {
      ua: String(p.impact_ua || p.businessImpact_ua || '').trim(),
      en: String(p.impact_en || p.businessImpact_en || '').trim()
    },
    toolsUsed: parseTools(p.tools || p.toolsUsed),
    designSystem: {
      fonts: parsedFonts,
      fontsDescription: parsedFontsDescription,
      colors: parsedColors,
      colorsDescription: parsedColorsDescription,
      gridType: parsedGrid || undefined
    },
    thumbnailUrl,
    galleryUrls,
    liveLink: cleanLiveLink(p.liveLink ?? p.live_link ?? p.livelink ?? p.link ?? p.url ?? p.projectUrl ?? p.project_url ?? p.website),
    figmaUrl: cleanLiveLink(p.figmaUrl ?? p.figma_url ?? p.figma ?? p.figmaLink ?? p.figma_link),
    figmaEmbedUrl: cleanLiveLink(p.figmaEmbedUrl ?? p.figma_embed ?? p.figma_embed_url ?? p.figmaEmbed ?? p.figma_prototype),
    isFeatured: Boolean(p.featured === true || p.featured === 'true' || p.featured === 1 || p.featured === '1' || p.isFeatured === true),
    sortOrder: Number(p.sortOrder || idx + 1),
    testimonialId: p.testimonialId || undefined
  };
}

function mapExperienceFromSheet(e: any, idx: number): ExperienceItem {
  const rawType = String(e.type || 'commercial').toLowerCase();
  let type: 'commercial' | 'art-direction' | 'education' = 'commercial';
  if (rawType.includes('art') || rawType.includes('creative') || rawType.includes('lead') || rawType.includes('direction')) {
    type = 'art-direction';
  } else if (rawType.includes('edu') || rawType.includes('teach') || rawType.includes('mentor')) {
    type = 'education';
  } else if (rawType === 'commercial') {
    type = 'commercial';
  }

  const parseDesc = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') {
      return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const descUa = e.description?.ua 
    ? parseDesc(e.description.ua)
    : parseDesc(e.description_ua ?? e.description);
    
  const descEn = e.description?.en
    ? parseDesc(e.description.en)
    : parseDesc(e.description_en ?? e.description);

  return {
    id: String(e.id || `exp-${idx + 1}`),
    type,
    company: isLocalizedObj(e.company) ? e.company : {
      ua: String(e.company_ua ?? e.company ?? 'Студія'),
      en: String(e.company_en ?? e.company ?? 'Studio')
    },
    location: isLocalizedObj(e.location) ? e.location : {
      ua: String(e.location_ua ?? e.location ?? 'Київ / Віддалено'),
      en: String(e.location_en ?? e.location ?? 'Kyiv / Remote')
    },
    role: isLocalizedObj(e.role) ? e.role : {
      ua: String(e.role_ua ?? e.position_ua ?? e.role ?? e.position ?? 'Головний дизайнер'),
      en: String(e.role_en ?? e.position_en ?? e.role ?? e.position ?? 'Principal Designer')
    },
    period: isLocalizedObj(e.period) ? e.period : {
      ua: String(e.period_ua ?? e.period ?? '2022 — Зараз'),
      en: String(e.period_en ?? e.period ?? '2022 — Present')
    },
    description: {
      ua: descUa,
      en: descEn
    },
    technologies: Array.isArray(e.skills) ? e.skills : (Array.isArray(e.technologies) ? e.technologies : [])
  };
}

function mapTestimonialFromSheet(t: any, idx: number): Testimonial {
  return {
    id: String(t.id || `test-${idx + 1}`),
    projectId: t.projectId || t.projectTitle || undefined,
    author: String(t.author || ''),
    company: String(t.company || ''),
    role: isLocalizedObj(t.role) ? t.role : {
      ua: t.role_ua || t.role || '',
      en: t.role_en || t.role || ''
    },
    text: isLocalizedObj(t.text) ? t.text : {
      ua: t.content_ua || t.text_ua || t.text || '',
      en: t.content_en || t.text_en || t.text || ''
    },
    avatarUrl: formatImageUrl(t.avatarUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  };
}

export function mapSettingsFromSheet(raw: any): GeneralSettings {
  if (!raw) return DEFAULT_SETTINGS;

  let s: Record<string, any> = {};

  // If the sheet comes as an array of rows (e.g. key, ua, en or key, value)
  if (Array.isArray(raw)) {
    s = raw.reduce((acc, row) => {
      if (row && (row.key || row.Key)) {
        const k = String(row.key || row.Key).trim();
        const uaVal = row.ua !== undefined ? row.ua : (row.UA !== undefined ? row.UA : (row.value_ua !== undefined ? row.value_ua : row.value));
        const enVal = row.en !== undefined ? row.en : (row.EN !== undefined ? row.EN : (row.value_en !== undefined ? row.value_en : row.value));
        acc[`${k}_ua`] = uaVal;
        acc[`${k}_en`] = enVal;
        acc[k] = { ua: uaVal, en: enVal };
        if (row.value !== undefined && row.ua === undefined) {
          acc[k] = row.value;
        }
      }
      return acc;
    }, {} as Record<string, any>);
  } else if (typeof raw === 'object') {
    s = { ...raw };
  }

  const getLoc = (key: string, fallback: { ua: string; en: string }): { ua: string; en: string } => {
    const val = s[key];
    let candidateUa = '';
    let candidateEn = '';

    if (isLocalizedObj(val)) {
      candidateUa = val.ua !== undefined && String(val.ua).trim() !== '' ? String(val.ua).trim() : '';
      candidateEn = val.en !== undefined && String(val.en).trim() !== '' ? String(val.en).trim() : '';
    } else if (typeof val === 'string' && val.trim() !== '') {
      candidateUa = val.trim();
    }

    const valUa = s[`${key}_ua`] || s[`${key}_UA`];
    const valEn = s[`${key}_en`] || s[`${key}_EN`];
    if (valUa !== undefined && String(valUa).trim() !== '') candidateUa = String(valUa).trim();
    if (valEn !== undefined && String(valEn).trim() !== '') candidateEn = String(valEn).trim();

    const finalUa = candidateUa || fallback.ua;
    const finalEn = translateToEnglishIfNeeded(finalUa, candidateEn, fallback.en);

    return { ua: finalUa, en: finalEn };
  };

  const parseList = (val: any, fallback: string[]): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val.split(/[\n,]+/).map(i => i.trim()).filter(Boolean);
    }
    return fallback;
  };

  const name = getLoc('name', DEFAULT_SETTINGS.name);
  const title = getLoc('title', DEFAULT_SETTINGS.title);
  const heroTag = getLoc('heroTag', DEFAULT_SETTINGS.heroTag || { ua: 'Готовий до співпраці', en: 'Available for work' });
  const heroTagline = getLoc('heroTagline', getLoc('bioShort', DEFAULT_SETTINGS.bioShort));
  
  // Resilient location / address resolution with multiple aliases
  const locRaw = s['location'] || s['address'] || s['локація'] || s['адреса'] || s['city'] || s['місто'];
  const location = locRaw ? (
    getLoc('location', getLoc('address', getLoc('локація', getLoc('адреса', { ua: '', en: '' }))))
  ) : { ua: '', en: '' };

  const getSingleStr = (key: string, fallback: string): string => {
    const val = s[key];
    if (typeof val === 'string' && val.trim() !== '') return val.trim();
    if (typeof val === 'object' && val !== null) {
      const candidate = val.ua || val.en || val.url || '';
      if (typeof candidate === 'string' && candidate.trim() !== '') return candidate.trim();
    }
    const valUa = s[`${key}_ua`] || s[`${key}_UA`];
    if (typeof valUa === 'string' && valUa.trim() !== '') return valUa.trim();
    const valEn = s[`${key}_en`] || s[`${key}_EN`];
    if (typeof valEn === 'string' && valEn.trim() !== '') return valEn.trim();
    return fallback;
  };

  const email = getSingleStr('email', DEFAULT_SETTINGS.email);
  const telegram = getSingleStr('telegram', DEFAULT_SETTINGS.telegram);
  const linkedin = getSingleStr('linkedin', DEFAULT_SETTINGS.linkedin);
  const behance = getSingleStr('behance', DEFAULT_SETTINGS.behance);
  const github = getSingleStr('github', DEFAULT_SETTINGS.github);

  const heroImageRaw = s.heroImage || s.profileImage || (s.heroImage_ua || s.heroImage_en);
  const heroImage = formatImageUrl(heroImageRaw, DEFAULT_SETTINGS.heroImage);

  // Expertise fields
  const expHeading = getLoc('expertise_heading', DEFAULT_SETTINGS.expertise!.heading);
  const expSubtitle = getLoc('expertise_subtitle', DEFAULT_SETTINGS.expertise!.subtitle);
  const card1Title = getLoc('expertise_card1_title', DEFAULT_SETTINGS.expertise!.card1Title);
  const card1Desc = {
    ua: stripFigJam(getLoc('expertise_card1_desc', DEFAULT_SETTINGS.expertise!.card1Desc).ua),
    en: stripFigJam(getLoc('expertise_card1_desc', DEFAULT_SETTINGS.expertise!.card1Desc).en)
  };
  const card2Title = getLoc('expertise_card2_title', DEFAULT_SETTINGS.expertise!.card2Title);
  const card2Desc = getLoc('expertise_card2_desc', DEFAULT_SETTINGS.expertise!.card2Desc);
  const card3Title = getLoc('expertise_card3_title', DEFAULT_SETTINGS.expertise!.card3Title);
  const card3Desc = getLoc('expertise_card3_desc', DEFAULT_SETTINGS.expertise!.card3Desc);
  const card4Title = getLoc('expertise_card4_title', DEFAULT_SETTINGS.expertise!.card4Title);
  const card4Desc = getLoc('expertise_card4_desc', DEFAULT_SETTINGS.expertise!.card4Desc || {
    ua: 'Налаштування та оптимізація рекламних кампаній (Google Ads, Meta Ads) та вебаналітики через Google Tag Manager, робота з даними у Google Sheets.',
    en: 'Setting up and optimizing advertising campaigns (Google Ads, Meta Ads) and web analytics via Google Tag Manager, working with data in Google Sheets.'
  });

  const h1 = getLoc('expertise_h1', { ua: DEFAULT_SETTINGS.expertise!.heuristics.ua[0], en: DEFAULT_SETTINGS.expertise!.heuristics.en[0] });
  const h2 = getLoc('expertise_h2', { ua: DEFAULT_SETTINGS.expertise!.heuristics.ua[1], en: DEFAULT_SETTINGS.expertise!.heuristics.en[1] });
  const h3 = getLoc('expertise_h3', { ua: DEFAULT_SETTINGS.expertise!.heuristics.ua[2], en: DEFAULT_SETTINGS.expertise!.heuristics.en[2] });
  const h4 = getLoc('expertise_h4', { ua: DEFAULT_SETTINGS.expertise!.heuristics.ua[3], en: DEFAULT_SETTINGS.expertise!.heuristics.en[3] });

  const techTitle = getLoc('expertise_tech_title', DEFAULT_SETTINGS.expertise!.techStackTitle);
  const techItemsRaw = s.expertise_tech_items || (s.expertise_tech_items_ua || s.expertise_tech_items_en) || s.expertise_techStackItems || s.techStackItems;
  const techItems = parseList(techItemsRaw, DEFAULT_SETTINGS.expertise!.techStackItems)
    .filter((item: string) => !item.toLowerCase().includes('figjam'));

  const menuSystemTitle = getLoc('menu_system_title', DEFAULT_SETTINGS.menu?.systemTitle || { ua: 'IS // СИСТЕМА НАВІГАЦІЇ', en: 'IS // NAVIGATION SYSTEM' });
  const menuItem1Title = getLoc('menu_item1_title', DEFAULT_SETTINGS.menu?.item1Title || { ua: 'Проєкти', en: 'Selected Work' });
  const menuItem1Desc = getLoc('menu_item1_desc', DEFAULT_SETTINGS.menu?.item1Desc || { ua: 'Вибрані кейси & інтерфейси', en: 'Featured cases & digital products' });
  const menuItem2Title = getLoc('menu_item2_title', DEFAULT_SETTINGS.menu?.item2Title || { ua: 'Експертиза', en: 'Core Expertise' });
  const menuItem2Desc = getLoc('menu_item2_desc', DEFAULT_SETTINGS.menu?.item2Desc || { ua: 'UI/UX, графіка та стек', en: 'UI/UX, visual design & tech' });
  const menuItem3Title = getLoc('menu_item3_title', DEFAULT_SETTINGS.menu?.item3Title || { ua: 'Досвід', en: 'Career Timeline' });
  const menuItem3Desc = getLoc('menu_item3_desc', DEFAULT_SETTINGS.menu?.item3Desc || { ua: 'Кар’єрний шлях та ролі', en: 'Professional trajectory & milestones' });
  const menuItem4Title = getLoc('menu_item4_title', DEFAULT_SETTINGS.menu?.item4Title || { ua: 'Контакти', en: 'Get In Touch' });
  const menuItem4Desc = getLoc('menu_item4_desc', DEFAULT_SETTINGS.menu?.item4Desc || { ua: 'Зв’язок для нових викликів', en: 'Direct collaboration inquiries' });
  const menuContactsTitle = getLoc('menu_contacts_title', DEFAULT_SETTINGS.menu?.contactsTitle || { ua: 'Прямі контакти:', en: 'Direct Channels:' });
  const menuCopyBtn = getLoc('menu_copy_btn', DEFAULT_SETTINGS.menu?.copyBtn || { ua: 'Копія', en: 'Copy' });
  const menuCopiedBtn = getLoc('menu_copied_btn', DEFAULT_SETTINGS.menu?.copiedBtn || { ua: 'Скопійовано!', en: 'Copied!' });

  // UI interface texts (Work section, filters, buttons, headers)
  const defUi = DEFAULT_SETTINGS.ui!;
  const heroCta = getLoc('hero_cta_btn', getLoc('hero_cta', getLoc('heroCta', defUi.heroCta!)));
  const workIndex = getLoc('work_index', defUi.workIndex!);
  const workTitle = getLoc('work_title', defUi.workTitle!);
  const layoutCascade = getLoc('layout_cascade', getLoc('layout_masonry', defUi.layoutCascade!));
  const layoutGrid = getLoc('layout_grid', defUi.layoutGrid!);
  const filterCategoryLabel = getLoc('filter_category_label', defUi.filterCategoryLabel!);
  const filterCategoryAll = getLoc('filter_category_all', defUi.filterCategoryAll!);
  const filterStatusLabel = getLoc('filter_status_label', defUi.filterStatusLabel!);
  const filterStatusAll = getLoc('filter_status_all', defUi.filterStatusAll!);
  const expertiseIndex = getLoc('expertise_index', defUi.expertiseIndex!);
  const quoteText = getLoc('quote_text', defUi.quoteText!);
  const quoteAuthor = getLoc('quote_author', defUi.quoteAuthor!);
  const experienceIndex = getLoc('experience_index', defUi.experienceIndex!);
  const experienceTitle = getLoc('experience_title', defUi.experienceTitle!);
  const experienceSubtitle = getLoc('experience_subtitle', defUi.experienceSubtitle!);
  const contactHeading = getLoc('contact_heading', defUi.contactHeading!);
  const contactCta = getLoc('contact_cta', defUi.contactCta!);
  const contactEmailLabel = getLoc('contact_email_label', defUi.contactEmailLabel!);
  const contactSocialLabel = getLoc('contact_social_label', defUi.contactSocialLabel!);
  const contactLocationLabel = getLoc('contact_location_label', defUi.contactLocationLabel!);

  // Modal & Portfolio view UI strings
  const modalCaseStudy = getLoc('modal_case_study', defUi.modalCaseStudy || { ua: 'CASE STUDY //', en: 'CASE STUDY //' });
  const modalPrev = getLoc('modal_prev', defUi.modalPrev || { ua: 'Попередній', en: 'Previous' });
  const modalNext = getLoc('modal_next', defUi.modalNext || { ua: 'Наступний', en: 'Next' });
  const modalClose = getLoc('modal_close', defUi.modalClose || { ua: 'Закрити', en: 'Close' });
  const modalLive = getLoc('modal_live', defUi.modalLive || { ua: 'Live', en: 'Live' });
  const modalRole = getLoc('modal_role', defUi.modalRole || { ua: 'Роль', en: 'Role' });
  const modalTimeline = getLoc('modal_timeline', defUi.modalTimeline || { ua: 'Період', en: 'Timeline' });
  const modalCategory = getLoc('modal_category', defUi.modalCategory || { ua: 'Категорія', en: 'Category' });
  const modalDeliverables = getLoc('modal_deliverables', defUi.modalDeliverables || { ua: 'Результати', en: 'Deliverables' });
  const modalInteractiveExperience = getLoc('modal_interactive_experience', getLoc('modal_interactive_title', defUi.modalInteractiveExperience || { ua: 'INTERACTIVE VISUAL EXPERIENCE', en: 'INTERACTIVE VISUAL EXPERIENCE' }));
  const modalMaxSpace = getLoc('modal_max_space', defUi.modalMaxSpace || { ua: 'Максимум місця', en: 'Max space' });
  const modalFitFrame = getLoc('modal_fit_frame', defUi.modalFitFrame || { ua: 'Вписати в екран', en: 'Fit frame' });
  const modalFullscreen = getLoc('modal_fullscreen', defUi.modalFullscreen || { ua: 'На весь екран', en: 'Fullscreen' });
  const modalOverview = getLoc('modal_overview', defUi.modalOverview || { ua: 'Огляд проєкту', en: 'Project Overview' });
  const modalChallenge = getLoc('modal_challenge', defUi.modalChallenge || { ua: 'Виклик & Проблема', en: 'The Challenge' });
  const modalSolution = getLoc('modal_solution', defUi.modalSolution || { ua: 'Архітектурне Рішення', en: 'The Solution' });
  const modalImpact = getLoc('modal_impact', defUi.modalImpact || { ua: 'Результати & Бізнес-Метрики', en: 'Business Impact & Metrics' });
  const modalDesignSystem = getLoc('modal_design_system', defUi.modalDesignSystem || { ua: 'Дизайн-Система & Токени', en: 'Design Tokens & Typography' });
  const modalFonts = getLoc('modal_fonts', defUi.modalFonts || { ua: 'Шрифти', en: 'Typography' });
  const modalColors = getLoc('modal_colors', defUi.modalColors || { ua: 'Колірна палітра', en: 'Color Palette' });
  const modalGrid = getLoc('modal_grid', defUi.modalGrid || { ua: 'Тип сітки', en: 'Grid Architecture' });
  const modalTools = getLoc('modal_tools', defUi.modalTools || { ua: 'Інструменти', en: 'Tooling' });
  const modalClientReview = getLoc('modal_client_review', defUi.modalClientReview || { ua: 'Відгук замовника', en: 'Client Endorsement' });
  const modalVisitLive = getLoc('modal_visit_live', defUi.modalVisitLive || { ua: 'Переглянути Live Проєкт', en: 'Explore Live Interface' });
  const modalCopied = getLoc('modal_copied', defUi.modalCopied || { ua: 'Скопійовано', en: 'Copied' });
  const modalArtifacts = getLoc('modal_artifacts', defUi.modalArtifacts || { ua: 'Екрани та Артефакти', en: 'Screens & Artifacts' });

  // Card & Badge UI strings
  const badgeFeatured = getLoc('badge_featured', defUi.badgeFeatured || { ua: 'Флагман', en: 'Featured' });
  const badgeConcept = getLoc('badge_concept', defUi.badgeConcept || { ua: 'Концепт', en: 'Concept' });
  const badgeProduction = getLoc('badge_production', getLoc('badge_realized', defUi.badgeProduction || { ua: 'Продакшн', en: 'Production' }));
  const cardViewCase = getLoc('card_view_case', getLoc('btn_view_case', defUi.cardViewCase || { ua: 'Відкрити кейс', en: 'View Case' }));

  return {
    name,
    title,
    bioShort: heroTagline,
    heroTag,
    heroTagline,
    location,
    email,
    telegram,
    linkedin,
    behance,
    github,
    heroImage,
    appsScriptUrl: s.appsScriptUrl || DEFAULT_SETTINGS.appsScriptUrl,
    googleSheetId: s.googleSheetId || DEFAULT_SETTINGS.googleSheetId,
    lastSyncedAt: new Date().toLocaleTimeString('en-GB'),
    expertise: {
      heading: expHeading,
      subtitle: expSubtitle,
      card1Title,
      card1Desc,
      card2Title,
      card2Desc,
      card3Title,
      card3Desc,
      card4Title,
      card4Desc,
      heuristics: {
        ua: [h1.ua, h2.ua, h3.ua, h4.ua],
        en: [h1.en, h2.en, h3.en, h4.en]
      },
      techStackTitle: techTitle,
      techStackItems: techItems
    },
    menu: {
      systemTitle: menuSystemTitle,
      item1Title: menuItem1Title,
      item1Desc: menuItem1Desc,
      item2Title: menuItem2Title,
      item2Desc: menuItem2Desc,
      item3Title: menuItem3Title,
      item3Desc: menuItem3Desc,
      item4Title: menuItem4Title,
      item4Desc: menuItem4Desc,
      contactsTitle: menuContactsTitle,
      copyBtn: menuCopyBtn,
      copiedBtn: menuCopiedBtn
    },
    ui: {
      heroCta,
      workIndex,
      workTitle,
      layoutCascade,
      layoutGrid,
      filterCategoryLabel,
      filterCategoryAll,
      filterStatusLabel,
      filterStatusAll,
      expertiseIndex,
      quoteText,
      quoteAuthor,
      experienceIndex,
      experienceTitle,
      experienceSubtitle,
      contactHeading,
      contactCta,
      contactEmailLabel,
      contactSocialLabel,
      contactLocationLabel,
      modalCaseStudy,
      modalPrev,
      modalNext,
      modalClose,
      modalLive,
      modalRole,
      modalTimeline,
      modalCategory,
      modalDeliverables,
      modalInteractiveExperience,
      modalMaxSpace,
      modalFitFrame,
      modalFullscreen,
      modalOverview,
      modalChallenge,
      modalSolution,
      modalImpact,
      modalDesignSystem,
      modalFonts,
      modalColors,
      modalGrid,
      modalTools,
      modalClientReview,
      modalVisitLive,
      modalCopied,
      modalArtifacts,
      badgeFeatured,
      badgeConcept,
      badgeProduction,
      cardViewCase
    }
  };
}

export function mapContactsFromSheet(raw: any, fallbackSettings?: GeneralSettings): ContactsData {
  const d = DEFAULT_CONTACTS;
  const dict: Record<string, any> = {};
  const explicitlyDefinedKeys = new Set<string>();

  const processSource = (source: any) => {
    if (!source) return;
    if (Array.isArray(source)) {
      for (const row of source) {
        if (!row || typeof row !== 'object') continue;
        const key = String(row.key || row.Key || row.id || row.Id || row.name || row.Name || '').trim().toLowerCase();
        if (!key) continue;

        explicitlyDefinedKeys.add(key);

        const uaVal = row.ua ?? row.UA ?? row.Ua ?? row.Ukrainian ?? row.value_ua ?? row.val_ua ?? row.value ?? row.url;
        const enVal = row.en ?? row.EN ?? row.En ?? row.English ?? row.value_en ?? row.val_en ?? row.value ?? row.url ?? uaVal;

        if (uaVal !== undefined || enVal !== undefined) {
          dict[key] = {
            ua: String(uaVal ?? '').trim(),
            en: String(enVal ?? uaVal ?? '').trim()
          };
          dict[`${key}_ua`] = String(uaVal ?? '').trim();
          dict[`${key}_en`] = String(enVal ?? uaVal ?? '').trim();
        } else if (row.value !== undefined) {
          dict[key] = String(row.value ?? '').trim();
        }
      }
    } else if (typeof source === 'object') {
      for (const [k, val] of Object.entries(source)) {
        const key = k.toLowerCase();
        explicitlyDefinedKeys.add(key);

        if (val && typeof val === 'object' && ('ua' in val || 'en' in val)) {
          dict[key] = {
            ua: String((val as any).ua ?? '').trim(),
            en: String((val as any).en ?? (val as any).ua ?? '').trim()
          };
        } else if (val !== undefined && val !== null) {
          dict[key] = String(val).trim();
        }
      }
    }
  };

  // 1. Initial fallback values
  if (fallbackSettings) {
    if (fallbackSettings.email) dict['email'] = fallbackSettings.email;
    if (fallbackSettings.telegram) dict['telegram'] = fallbackSettings.telegram;
    if (fallbackSettings.linkedin) dict['linkedin'] = fallbackSettings.linkedin;
    if (fallbackSettings.behance) dict['behance'] = fallbackSettings.behance;
    if (fallbackSettings.github) dict['github'] = fallbackSettings.github;
    if (fallbackSettings.location) {
      dict['address'] = fallbackSettings.location;
      dict['location'] = fallbackSettings.location;
    }
  }

  // 2. Primary source from "Contacts" sheet (overwrites fallback)
  if (raw) processSource(raw);

  const getStr = (key: string, fallback: string): string => {
    // If the key was explicitly in the sheet, respect user choice (even if blank or spaces)
    if (explicitlyDefinedKeys.has(key)) {
      const val = dict[key];
      if (val && typeof val === 'object') {
        return String(val.ua || val.en || '').trim();
      }
      if (typeof val === 'string') {
        return val.trim();
      }
      return '';
    }

    const val = dict[key];
    if (val && typeof val === 'object') {
      const clean = String(val.ua || val.en || '').trim();
      return clean || fallback;
    }
    if (typeof val === 'string' && val.trim()) {
      return val.trim();
    }
    return fallback;
  };

  const getLoc = (key: string, fallback: { ua: string; en: string }): { ua: string; en: string } => {
    const val = dict[key];
    let candidateUa = '';
    let candidateEn = '';

    if (val && typeof val === 'object' && (val.ua || val.en)) {
      candidateUa = String(val.ua || '').trim();
      candidateEn = String(val.en || '').trim();
    } else if (typeof val === 'string' && val.trim()) {
      candidateUa = val.trim();
    }

    // If key was explicitly in sheet and user left it blank:
    if (explicitlyDefinedKeys.has(key) && !candidateUa && !candidateEn) {
      return { ua: '', en: '' };
    }

    const finalUa = candidateUa || fallback.ua;
    const finalEn = translateToEnglishIfNeeded(finalUa, candidateEn, fallback.en);

    return { ua: finalUa, en: finalEn };
  };

  const emailFallback = fallbackSettings?.email || d.email;
  const telegramFallback = fallbackSettings?.telegram || d.telegram || '';
  const linkedinFallback = fallbackSettings?.linkedin || d.linkedin || '';
  const behanceFallback = fallbackSettings?.behance || d.behance || '';
  const githubFallback = fallbackSettings?.github || d.github || '';

  const addressVal = getLoc('address', getLoc('location', getLoc('локація', getLoc('адреса', getLoc('місто', fallbackSettings?.location || d.address || { ua: 'Львів, Україна', en: 'Lviv, Ukraine' })))));

  return {
    email: getStr('email', emailFallback),
    telegram: getStr('telegram', telegramFallback),
    linkedin: getStr('linkedin', linkedinFallback),
    behance: getStr('behance', behanceFallback),
    github: getStr('github', githubFallback),
    phone: getStr('phone', d.phone || ''),
    address: addressVal,
    location: addressVal
  };
}



export function mapLegalAndBannersFromSheet(raw: any, fallbackRaw?: any): LegalAndBannersData {
  const dict: Record<string, any> = {};

  const processSource = (source: any) => {
    if (!source) return;
    if (Array.isArray(source)) {
      for (const row of source) {
        if (!row || typeof row !== 'object') continue;
        const key = String(row.key || row.Key || row.id || row.Id || row.name || row.Name || '').trim();
        if (!key) continue;

        const uaVal = row.ua ?? row.UA ?? row.Ua ?? row.Ukrainian ?? row.value_ua ?? row.val_ua;
        const enVal = row.en ?? row.EN ?? row.En ?? row.English ?? row.value_en ?? row.val_en;

        if (uaVal !== undefined || enVal !== undefined) {
          dict[key] = {
            ua: String(uaVal ?? ''),
            en: String(enVal ?? uaVal ?? '')
          };
          dict[`${key}_ua`] = String(uaVal ?? '');
          dict[`${key}_en`] = String(enVal ?? uaVal ?? '');
        } else if (row.value !== undefined || row.Value !== undefined) {
          dict[key] = row.value ?? row.Value;
        }
      }
    } else if (typeof source === 'object') {
      Object.assign(dict, source);
    }
  };

  // 1. Process fallback (e.g. General_Data settings rows)
  if (fallbackRaw) processSource(fallbackRaw);
  // 2. Process primary legal data source (overwrites fallback if present)
  if (raw) processSource(raw);

  if (Object.keys(dict).length === 0) return DEFAULT_LEGAL_AND_BANNERS;

  const getI18n = (key: string, fallback: { ua: string; en: string }): { ua: string; en: string } => {
    if (dict[key] && typeof dict[key] === 'object' && ('ua' in dict[key] || 'en' in dict[key])) {
      return {
        ua: String(dict[key].ua || fallback.ua).trim(),
        en: String(dict[key].en || fallback.en).trim()
      };
    }
    const ua = dict[`${key}_ua`] ?? dict[`${key}_UA`] ?? (typeof dict[key] === 'string' ? dict[key] : fallback.ua);
    const en = dict[`${key}_en`] ?? dict[`${key}_EN`] ?? (typeof dict[key] === 'string' ? dict[key] : fallback.en);
    return {
      ua: String(ua || fallback.ua).trim(),
      en: String(en || fallback.en).trim()
    };
  };

  const getStr = (key: string, fallback: string): string => {
    const val = dict[key] ?? dict[key.toLowerCase()];
    return val !== undefined && val !== null ? String(val).trim() : fallback;
  };

  const getBool = (key: string, fallback: boolean): boolean => {
    const val = dict[key] ?? dict[key.toLowerCase()];
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'boolean') return val;
    const str = String(val).toLowerCase().trim();
    return str === 'true' || str === '1' || str === 'yes' || str === 'так';
  };

  const defaultPrivacySections = DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.sections;
  const privacySections = defaultPrivacySections.map((defSec, idx) => {
    const num = idx + 1;
    return {
      id: defSec.id || `s${num}`,
      title: getI18n(`privacy_s${num}_title`, defSec.title),
      content: getI18n(`privacy_s${num}_content`, defSec.content)
    };
  });

  const defaultTermsSections = DEFAULT_LEGAL_AND_BANNERS.termsOfUse.sections;
  const termsSections = defaultTermsSections.map((defSec, idx) => {
    const num = idx + 1;
    return {
      id: defSec.id || `t${num}`,
      title: getI18n(`terms_s${num}_title`, defSec.title),
      content: getI18n(`terms_s${num}_content`, defSec.content)
    };
  });

  return {
    cookieBanner: {
      title: getI18n('cookie_title', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.title),
      description: getI18n('cookie_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.description),
      badge: getI18n('cookie_badge', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.badge || { ua: 'PRIVACY & COMPLIANCE // GDPR & ЗУ «ПРО ЗАХИСТ ПЕРСОНАЛЬНИХ ДАНИХ»', en: 'PRIVACY & COMPLIANCE // GDPR & PRIVACY ACT' }),
      configureBtn: getI18n('cookie_btn_configure', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.configureBtn || { ua: 'Налаштувати тогли', en: 'Customize Toggles' }),
      collapseBtn: getI18n('cookie_btn_collapse', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.collapseBtn || { ua: 'Згорнути', en: 'Collapse' }),
      essentialTitle: getI18n('cookie_essential_title', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.essentialTitle || { ua: 'Необхідні технічні дані', en: 'Strictly Necessary Data' }),
      essentialDesc: getI18n('cookie_essential_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.essentialDesc || { ua: 'Збереження обраної мови інтерфейсу (UA/EN), стану згоди та критичних параметрів сесії.', en: 'Preserving chosen language (UA/EN), consent choices, and core session accessibility parameters.' }),
      essentialStorage: getI18n('cookie_essential_storage', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.essentialStorage || { ua: 'LocalStorage', en: 'LocalStorage' }),
      functionalTitle: getI18n('cookie_functional_title', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.functionalTitle || { ua: 'Функціональні параметри', en: 'Functional Preferences' }),
      functionalDesc: getI18n('cookie_functional_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.functionalDesc || { ua: 'Тактильний звуковий супровід кліків (Web Audio API), збереження вибраного вигляду проєктів (Каскад / Сітка).', en: 'Tactile sound feedback for micro-interactions, layout view density memory (Masonry / Grid).' }),
      functionalStorage: getI18n('cookie_functional_storage', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.functionalStorage || { ua: 'LocalStorage / Audio API', en: 'LocalStorage / Audio API' }),
      analyticsLabel: getI18n('cookie_analytics_label', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.analyticsLabel),
      analyticsDesc: getI18n('cookie_analytics_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.analyticsDesc),
      analyticsStorage: getI18n('cookie_analytics_storage', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.analyticsStorage || { ua: 'Client Runtime', en: 'Client Runtime' }),
      preferencesLabel: getI18n('cookie_preferences_label', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.preferencesLabel),
      preferencesDesc: getI18n('cookie_preferences_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.preferencesDesc),
      personalizationTitle: getI18n('cookie_personalization_title', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.personalizationTitle || { ua: 'Персоналізація перегляду', en: 'Experience Personalization' }),
      personalizationDesc: getI18n('cookie_personalization_desc', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.personalizationDesc || { ua: 'Запам’ятовування останніх переглянутих кейсів та збереженого масштабу зображень (Fill / Contain).', en: 'Retaining previously viewed project deep-dives and preferred image viewport presentation modes.' }),
      personalizationStorage: getI18n('cookie_personalization_storage', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.personalizationStorage || { ua: 'LocalStorage Cache', en: 'LocalStorage Cache' }),
      acceptAll: getI18n('cookie_btn_accept', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.acceptAll),
      onlyNecessary: getI18n('cookie_btn_necessary', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.onlyNecessary),
      savePreferences: getI18n('cookie_btn_save', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.savePreferences),
      policyLink: getI18n('cookie_link_policy', DEFAULT_LEGAL_AND_BANNERS.cookieBanner.policyLink)
    },
    privacyPolicy: {
      title: getI18n('privacy_title', DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.title),
      subtitle: getI18n('privacy_subtitle', DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.subtitle),
      lastUpdated: getI18n('privacy_last_updated', DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.lastUpdated),
      sections: privacySections,
      contactEmail: getStr('privacy_contact_email', DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.contactEmail),
      contactLocation: getI18n('privacy_contact_location', DEFAULT_LEGAL_AND_BANNERS.privacyPolicy.contactLocation)
    },
    termsOfUse: {
      title: getI18n('terms_title', DEFAULT_LEGAL_AND_BANNERS.termsOfUse.title),
      subtitle: getI18n('terms_subtitle', DEFAULT_LEGAL_AND_BANNERS.termsOfUse.subtitle),
      lastUpdated: getI18n('terms_last_updated', DEFAULT_LEGAL_AND_BANNERS.termsOfUse.lastUpdated),
      sections: termsSections,
      contactEmail: getStr('terms_contact_email', DEFAULT_LEGAL_AND_BANNERS.termsOfUse.contactEmail)
    },
    announcementBanner: {
      enabled: getBool('announcement_enabled', DEFAULT_LEGAL_AND_BANNERS.announcementBanner.enabled),
      badge: getI18n('announcement_badge', DEFAULT_LEGAL_AND_BANNERS.announcementBanner.badge),
      text: getI18n('announcement_text', DEFAULT_LEGAL_AND_BANNERS.announcementBanner.text),
      link: getStr('announcement_link', DEFAULT_LEGAL_AND_BANNERS.announcementBanner.link || '#contact')
    }
  };
}

export function getStoredData(): PortfolioData {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Run the settings through the mapper to catch URL fixes and schema updates on old cache
      if (parsed.settings) {
        parsed.settings = mapSettingsFromSheet({
          ...(typeof parsed.legalAndBanners === 'object' ? parsed.legalAndBanners : {}),
          ...parsed.settings
        });
      }

      // Upgrade old cache schemas
      if (Array.isArray(parsed.projects)) {
        parsed.projects = parsed.projects.map(mapProjectFromSheet);
      }
      if (Array.isArray(parsed.experience)) {
        parsed.experience = parsed.experience.map(mapExperienceFromSheet);
      }
      if (Array.isArray(parsed.testimonials)) {
        parsed.testimonials = parsed.testimonials.map(mapTestimonialFromSheet);
      }
      if (parsed.legalAndBanners) {
        parsed.legalAndBanners = mapLegalAndBannersFromSheet(parsed.legalAndBanners, parsed.settings);
      } else {
        parsed.legalAndBanners = mapLegalAndBannersFromSheet(parsed.settings);
      }

      const contacts = parsed.contacts 
        ? mapContactsFromSheet(parsed.contacts, parsed.settings) 
        : mapContactsFromSheet(parsed.settings, parsed.settings);

      if (parsed.settings) {
        parsed.settings.email = contacts.email || parsed.settings.email;
        parsed.settings.telegram = contacts.telegram;
        parsed.settings.linkedin = contacts.linkedin;
        parsed.settings.behance = contacts.behance;
        parsed.settings.github = contacts.github;
      }

      return {
        ...parsed,
        contacts,
        source: 'cache'
      };
    }
  } catch (err) {
    console.warn('Failed to parse localStorage portfolio data:', err);
  }

  return {
    projects: DEFAULT_PROJECTS,
    experience: DEFAULT_EXPERIENCE,
    testimonials: DEFAULT_TESTIMONIALS,
    settings: DEFAULT_SETTINGS,
    contacts: DEFAULT_CONTACTS,
    legalAndBanners: DEFAULT_LEGAL_AND_BANNERS,
    source: 'default',
    lastSyncedAt: new Date().toISOString()
  };
}

export function saveStoredData(data: Partial<PortfolioData>): void {
  try {
    const current = getStoredData();
    const updated = {
      ...current,
      ...data,
      lastSyncedAt: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Connect and fetch data from Google Apps Script Web App or custom API endpoint
 */
export async function syncWithGoogleSheets(endpointUrl: string = DEFAULT_SHEETS_ENDPOINT): Promise<PortfolioData> {
  if (!endpointUrl || !endpointUrl.startsWith('http')) {
    throw new Error('Please provide a valid Google Apps Script Web App URL or API endpoint');
  }

  const response = await fetch(endpointUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Google Sheets endpoint responded with HTTP status ${response.status}`);
  }

  const json = await response.json();

  const categoriesMap = new Map<string, { ua: string; en: string }>();
  if (json.categories && Array.isArray(json.categories)) {
    for (const c of json.categories) {
      const id = String(c.id || c.slug || c.key || '').trim();
      const ua = String(c.ua || c.UA || c.title_ua || c.name_ua || c.name || '').trim();
      const en = String(c.en || c.EN || c.title_en || c.name_en || ua).trim();
      if (id && ua) {
        categoriesMap.set(id, { ua, en });
        categoriesMap.set(id.toLowerCase(), { ua, en });
      }
      if (ua) {
        categoriesMap.set(ua, { ua, en });
        categoriesMap.set(ua.toLowerCase(), { ua, en });
      }
    }
  }

  const statusesMap = new Map<string, { filterLabel: { ua: string; en: string }; badgeLabel: { ua: string; en: string } }>();
  if (json.statuses && Array.isArray(json.statuses)) {
    for (const s of json.statuses) {
      const id = String(s.id || s.slug || s.key || '').trim();
      const ua = String(s.ua || s.name_ua || s.title_ua || s.name || s.label || '').trim();
      const en = String(s.en || s.name_en || s.title_en || s.name || ua).trim();
      const badgeUa = String(s.badge_ua || s.badge || ua).trim();
      const badgeEn = String(s.badge_en || s.badge || en).trim();
      const entry = {
        filterLabel: { ua, en },
        badgeLabel: { ua: badgeUa, en: badgeEn }
      };
      if (id && ua) {
        statusesMap.set(id, entry);
        statusesMap.set(id.toLowerCase(), entry);
      }
      if (ua) {
        statusesMap.set(ua, entry);
        statusesMap.set(ua.toLowerCase(), entry);
      }
    }
  }

  const parsedProjects = json.projects && Array.isArray(json.projects) && json.projects.length > 0
    ? json.projects.map((p: any, idx: number) => mapProjectFromSheet(p, idx, categoriesMap, statusesMap))
    : DEFAULT_PROJECTS;

  const parsedExperience = json.experience && Array.isArray(json.experience) && json.experience.length > 0
    ? json.experience.map(mapExperienceFromSheet)
    : DEFAULT_EXPERIENCE;

  const parsedTestimonials = json.testimonials && Array.isArray(json.testimonials) && json.testimonials.length > 0
    ? json.testimonials.map(mapTestimonialFromSheet)
    : DEFAULT_TESTIMONIALS;

  const combinedSettings = {
    ...(json.legalAndBanners && typeof json.legalAndBanners === 'object' ? json.legalAndBanners : {}),
    ...(json.settings && typeof json.settings === 'object' ? json.settings : {})
  };

  const parsedSettings = mapSettingsFromSheet(combinedSettings);

  const parsedContacts = mapContactsFromSheet(
    json.contacts || json.socials || json.contact,
    parsedSettings
  );

  parsedSettings.email = parsedContacts.email || parsedSettings.email;
  parsedSettings.telegram = parsedContacts.telegram;
  parsedSettings.linkedin = parsedContacts.linkedin;
  parsedSettings.behance = parsedContacts.behance;
  parsedSettings.github = parsedContacts.github;

  const parsedLegalAndBanners = mapLegalAndBannersFromSheet(
    json.legalAndBanners || json.legal || json.banners,
    combinedSettings
  );

  const hasLegalDataInEndpoint = Boolean(
    (json.legalAndBanners && typeof json.legalAndBanners === 'object' && Object.keys(json.legalAndBanners).length > 0) ||
    json.legal ||
    json.banners ||
    (json.settings && (json.settings.cookie_title || json.settings['cookie_title_ua'] || json.settings['cookie_title_UA']))
  );

  const parsedCategories = mapCategoriesFromSheet(json.categories || json.disciplines || json.filters);
  const parsedStatuses = mapStatusesFromSheet(json.statuses || json.status);

  const freshData: PortfolioData = {
    projects: parsedProjects,
    categories: parsedCategories.length > 0 ? parsedCategories : undefined,
    statuses: parsedStatuses.length > 0 ? parsedStatuses : undefined,
    experience: parsedExperience,
    testimonials: parsedTestimonials,
    settings: parsedSettings,
    contacts: parsedContacts,
    legalAndBanners: parsedLegalAndBanners,
    source: 'live_sheets',
    lastSyncedAt: new Date().toISOString(),
    hasLegalDataInEndpoint,
    rawEndpointResponseKeys: Object.keys(json)
  };

  saveStoredData(freshData);
  return freshData;
}

/**
 * Returns copyable Google Apps Script code for 1-click deployment on user's Google Drive
 */
export function getGoogleAppsScriptTemplate(): string {
  return `/**
 * Google Apps Script for Ivan Selivanov Portfolio Sync
 * Tabs supported:
 * 1. "Projects" (columns: id, title_ua, title_en, year, client, role_ua, role_en, category, status, featured, thumbnailUrl, heroImage, liveLink, tagline_ua, tagline_en, overview_ua, overview_en, tools, palette, challenge_ua, challenge_en, solution_ua, solution_en, impact_ua, impact_en, fonts_ua, fonts_en, colors_ua, colors_en)
 * 2. "Categories" (optional custom filter categories, columns: id, ua, en)
 * 3. "Statuses" (optional custom filter statuses, columns: id, ua, en)
 * 4. "General_Data" (columns: key, ua, en)
 * 5. "Contacts" (columns: key, ua, en)
 * 6. "Experience"
 * 7. "Testimonials"
 * 8. "Legal_And_Banners" (columns: key, ua, en)
 * 
 * Deployment:
 * Extensions > Apps Script > Paste this code > Deploy > New deployment > Web app
 * Execute as: Me, Who has access: Anyone
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  function findSheet(names) {
    for (var i = 0; i < names.length; i++) {
      var s = ss.getSheetByName(names[i]);
      if (s) return s;
    }
    var allSheets = ss.getSheets();
    for (var j = 0; j < allSheets.length; j++) {
      var curClean = allSheets[j].getName().toLowerCase().replace(/[^a-z0-9]/g, '');
      for (var k = 0; k < names.length; k++) {
        if (curClean === names[k].toLowerCase().replace(/[^a-z0-9]/g, '')) {
          return allSheets[j];
        }
      }
    }
    return null;
  }
  
  var projectsSheet = findSheet(["Projects", "projects"]);
  var categoriesSheet = findSheet(["Categories", "categories", "Disciplines", "disciplines"]);
  var statusesSheet = findSheet(["Statuses", "statuses", "Status", "status"]);
  var generalSheet = findSheet(["General_Data", "general_data", "General", "general"]);
  var contactsSheet = findSheet(["Contacts", "contacts", "Contact", "contact", "Socials", "socials"]);
  var expSheet = findSheet(["Experience", "experience"]);
  var testSheet = findSheet(["Testimonials", "testimonials"]);
  var legalSheet = findSheet(["Legal_And_Banners", "legal_and_banners", "Legal and Banners", "Legal", "legal", "Banners", "banners", "Cookies", "cookies"]);
  
  var result = {
    status: "ok",
    timestamp: new Date().toISOString(),
    sheetId: ss.getId(),
    projects: parseSheetToObjects(projectsSheet),
    categories: parseSheetToObjects(categoriesSheet),
    statuses: parseSheetToObjects(statusesSheet),
    settings: parseGeneralSheet(generalSheet),
    contacts: parseContactsSheet(contactsSheet),
    experience: parseSheetToObjects(expSheet),
    testimonials: parseSheetToObjects(testSheet),
    legalAndBanners: parseLegalSheet(legalSheet)
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseSheetToObjects(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0].map(function(h) { return String(h).trim(); });
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }
  return rows;
}

function parseGeneralSheet(sheet) {
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};
  var headers = data[0].map(function(h) { return String(h).toLowerCase().trim(); });
  
  var keyIdx = headers.indexOf("key");
  if (keyIdx === -1) keyIdx = 0;
  var uaIdx = headers.indexOf("ua") !== -1 ? headers.indexOf("ua") : headers.indexOf("ukrainian");
  var enIdx = headers.indexOf("en") !== -1 ? headers.indexOf("en") : headers.indexOf("english");
  var valIdx = headers.indexOf("value") !== -1 ? headers.indexOf("value") : 1;
  
  var settings = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var key = String(row[keyIdx] || "").trim();
    if (!key) continue;
    
    // Support unified 3-column key | ua | en format
    if (uaIdx !== -1 && enIdx !== -1) {
      var uaVal = row[uaIdx] !== undefined ? row[uaIdx] : "";
      var enVal = row[enIdx] !== undefined ? row[enIdx] : "";
      settings[key] = { ua: uaVal, en: enVal };
      settings[key + "_ua"] = uaVal;
      settings[key + "_en"] = enVal;
    } else {
      // Support 2-column key | value format
      settings[key] = row[valIdx];
    }
  }
  return settings;
}

function parseContactsSheet(sheet) {
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};
  var headers = data[0].map(function(h) { return String(h).toLowerCase().trim(); });
  
  var keyIdx = headers.indexOf("key");
  if (keyIdx === -1) keyIdx = 0;
  var uaIdx = headers.indexOf("ua") !== -1 ? headers.indexOf("ua") : (headers.indexOf("ukrainian") !== -1 ? headers.indexOf("ukrainian") : (headers.length > 1 ? 1 : -1));
  var enIdx = headers.indexOf("en") !== -1 ? headers.indexOf("en") : (headers.indexOf("english") !== -1 ? headers.indexOf("english") : (headers.length > 2 ? 2 : -1));
  
  var result = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var key = String(row[keyIdx] || "").trim();
    if (!key) continue;
    
    var uaVal = (uaIdx !== -1 && row[uaIdx] !== undefined) ? String(row[uaIdx]) : "";
    var enVal = (enIdx !== -1 && row[enIdx] !== undefined) ? String(row[enIdx]) : uaVal;
    
    result[key] = { ua: uaVal, en: enVal };
    result[key + "_ua"] = uaVal;
    result[key + "_en"] = enVal;
  }
  return result;
}

function parseLegalSheet(sheet) {
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};
  var headers = data[0].map(function(h) { return String(h).toLowerCase().trim(); });
  
  var keyIdx = headers.indexOf("key");
  if (keyIdx === -1) keyIdx = 0;
  var uaIdx = headers.indexOf("ua") !== -1 ? headers.indexOf("ua") : (headers.indexOf("ukrainian") !== -1 ? headers.indexOf("ukrainian") : (headers.length > 1 ? 1 : -1));
  var enIdx = headers.indexOf("en") !== -1 ? headers.indexOf("en") : (headers.indexOf("english") !== -1 ? headers.indexOf("english") : (headers.length > 2 ? 2 : -1));
  
  var result = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var key = String(row[keyIdx] || "").trim();
    if (!key) continue;
    
    var uaVal = (uaIdx !== -1 && row[uaIdx] !== undefined) ? String(row[uaIdx]) : "";
    var enVal = (enIdx !== -1 && row[enIdx] !== undefined) ? String(row[enIdx]) : uaVal;
    
    result[key] = { ua: uaVal, en: enVal };
    result[key + "_ua"] = uaVal;
    result[key + "_en"] = enVal;
  }
  return result;
}
`;
}

/**
 * Generates copy-pasteable TSV data for the "General_Data" tab in Google Sheets with lowercase headers: key, ua, en
 */
export function getGeneralSheetTsvTemplate(): string {
  const rows: [string, string, string][] = [
    ['key', 'ua', 'en'],
    ['name', 'Іван Селіванов', 'Ivan Selivanov'],
    ['title', 'Артдиректор & UI/UX Архітектор', 'Art Director & UI/UX Architect'],
    ['heroImage', '', ''],
    ['heroTag', 'Готовий до співпраці', 'Available for work'],
    ['heroTagline', 'Проєктую сучасні вебсайти та цифрові продукти, поєднуючи чисту візуальну естетику з продуманою логікою.', 'I design modern websites and digital products, combining clean visual aesthetics with thoughtful logic.'],
    ['location', 'Львів, Україна (Доступний по всьому світу)', 'Lviv, Ukraine (Available Worldwide)'],
    ['email', 'ivanselivanov771994@gmail.com', 'ivanselivanov771994@gmail.com'],
    ['linkedin', 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/', 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/'],
    ['expertise_heading', 'Експертиза', 'Expertise'],
    ['expertise_subtitle', 'Мої ключові навички та напрямки роботи, в яких я створюю ефективні цифрові рішення.', 'My core skills and areas of focus where I create effective digital solutions.'],
    ['expertise_card1_title', 'UI/UX Дизайн', 'UI/UX Design'],
    ['expertise_card1_desc', 'Проєктування зручних користувацьких інтерфейсів, створення прототипів та адаптивного дизайну з фокусом на користувацький досвід у Figma.', 'Designing intuitive user interfaces, creating prototypes, and responsive web design with a focus on user experience in Figma.'],
    ['expertise_card2_title', 'Графічний дизайн', 'Graphic Design'],
    ['expertise_card2_desc', 'Створення логотипів, банерів та комп\'ютерної графіки. Застосування теорії кольору та основ композиції.', 'Creating logos, banners, and computer graphics. Applying color theory and composition fundamentals.'],
    ['expertise_card3_title', 'Веброзробка', 'Web Development'],
    ['expertise_card3_desc', 'Верстка лендингів та розробка сайтів з використанням HTML, CSS, JavaScript, робота з SVG та розгортання проєктів на Vercel.', 'Landing page markup and website development using HTML, CSS, JavaScript, working with SVG, and deploying projects on Vercel.'],
    ['expertise_card4_title', 'Маркетинг та Аналітика', 'Marketing & Analytics'],
    ['expertise_card4_desc', 'Налаштування та оптимізація рекламних кампаній (Google Ads, Meta Ads) та вебаналітики через Google Tag Manager, робота з даними у Google Sheets.', 'Setting up and optimizing advertising campaigns (Google Ads, Meta Ads) and web analytics via Google Tag Manager, working with data in Google Sheets.'],
    ['expertise_h1', 'Дизайн інтерфейсів', 'Interface Design'],
    ['expertise_h2', 'Візуальний дизайн', 'Visual Design'],
    ['expertise_h3', 'Фронтенд', 'Frontend'],
    ['expertise_h4', 'Таргетинг', 'Targeting'],
    ['expertise_tech_title', 'Інструменти та Технології', 'Tools & Technologies'],
    ['expertise_tech_items', 'Figma, HTML, CSS, JavaScript, Vercel, Google AI Studio, Google Ads, Meta Ads, Google Tag Manager, Google Sheets, SVG, Adobe Illustrator', 'Figma, HTML, CSS, JavaScript, Vercel, Google AI Studio, Google Ads, Meta Ads, Google Tag Manager, Google Sheets, SVG, Adobe Illustrator'],
    ['menu_system_title', 'IS // СИСТЕМА НАВІГАЦІЇ', 'IS // NAVIGATION SYSTEM'],
    ['menu_item1_title', 'Проєкти', 'Selected Work'],
    ['menu_item1_desc', 'Вибрані кейси & інтерфейси', 'Featured cases & digital products'],
    ['menu_item2_title', 'Експертиза', 'Core Expertise'],
    ['menu_item2_desc', 'UI/UX, графіка та стек', 'UI/UX, visual design & tech'],
    ['menu_item3_title', 'Досвід', 'Career Timeline'],
    ['menu_item3_desc', 'Кар’єрний шлях та ролі', 'Professional trajectory & milestones'],
    ['menu_item4_title', 'Контакти', 'Get In Touch'],
    ['menu_item4_desc', 'Зв’язок для нових викликів', 'Direct collaboration inquiries'],
    ['menu_contacts_title', 'Прямі контакти:', 'Direct Channels:'],
    ['menu_copy_btn', 'Копія', 'Copy'],
    ['menu_copied_btn', 'Скопійовано!', 'Copied!'],
    ['hero_cta_btn', 'Дослідити кейси', 'Explore Portfolio'],
    ['work_index', '01 // INDEXED CASE STUDIES', '01 // INDEXED CASE STUDIES'],
    ['work_title', 'Вибрані Роботи', 'Selected Works'],
    ['layout_cascade', 'Каскад', 'Masonry'],
    ['layout_grid', 'Сітка', 'Grid'],
    ['filter_category_label', 'Напрямок:', 'Discipline:'],
    ['filter_category_all', 'Всі напрямки', 'All Disciplines'],
    ['filter_status_label', 'Статус:', 'Status:'],
    ['filter_status_all', 'Всі статуси', 'All'],
    ['expertise_index', '02 // METHODOLOGY & CAPABILITIES', '02 // METHODOLOGY & CAPABILITIES'],
    ['quote_text', 'Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials.', 'Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials.'],
    ['quote_author', '— Dieter Rams (Ten Principles for Good Design)', '— Dieter Rams (Ten Principles for Good Design)'],
    ['experience_index', '03 // TRACK RECORD', '03 // TRACK RECORD'],
    ['experience_title', 'Кар’єрний Шлях & Досвід', 'Career Track & Background'],
    ['experience_subtitle', 'Хронологія комерційних проєктів, артдирекції та фундаментальної академічної школи', 'Timeline of design leadership, commercial execution, and academic honors'],
    ['contact_heading', 'Маєте амбітний проєкт?', 'Have an ambitious project?'],
    ['contact_cta', 'Обговорити', "Let's Talk"],
    ['contact_email_label', 'Прямий контакт', 'Direct Inquiries'],
    ['contact_social_label', 'Мережі', 'Networks'],
    ['contact_location_label', 'Локальний час', 'Local Time'],
    // Modal & Case study viewer UI strings
    ['modal_case_study', 'CASE STUDY //', 'CASE STUDY //'],
    ['modal_prev', 'Попередній', 'Previous'],
    ['modal_next', 'Наступний', 'Next'],
    ['modal_close', 'Закрити', 'Close'],
    ['modal_live', 'Live', 'Live'],
    ['modal_role', 'Роль', 'Role'],
    ['modal_timeline', 'Період', 'Timeline'],
    ['modal_category', 'Категорія', 'Category'],
    ['modal_deliverables', 'Результати', 'Deliverables'],
    ['modal_interactive_title', 'INTERACTIVE VISUAL EXPERIENCE', 'INTERACTIVE VISUAL EXPERIENCE'],
    ['modal_max_space', 'Максимум місця', 'Max space'],
    ['modal_fit_frame', 'Вписати в екран', 'Fit frame'],
    ['modal_fullscreen', 'На весь екран', 'Fullscreen'],
    ['modal_overview', 'Огляд проєкту', 'Project Overview'],
    ['modal_challenge', 'Виклик & Проблема', 'The Challenge'],
    ['modal_solution', 'Архітектурне Рішення', 'The Solution'],
    ['modal_impact', 'Результати & Бізнес-Метрики', 'Business Impact & Metrics'],
    ['modal_design_system', 'Дизайн-Система & Токени', 'Design Tokens & Typography'],
    ['modal_fonts', 'Шрифти', 'Typography'],
    ['modal_colors', 'Колірна палітра', 'Color Palette'],
    ['modal_grid', 'Тип сітки', 'Grid Architecture'],
    ['modal_tools', 'Інструменти', 'Tooling'],
    ['modal_client_review', 'Відгук замовника', 'Client Endorsement'],
    ['modal_visit_live', 'Переглянути Live Проєкт', 'Explore Live Interface'],
    ['modal_copied', 'Скопійовано', 'Copied'],
    ['modal_artifacts', 'Екрани та Артефакти', 'Screens & Artifacts'],
    // Card & Badge UI
    ['badge_featured', 'Флагман', 'Featured'],
    ['badge_concept', 'Концепт', 'Concept'],
    ['badge_production', 'Продакшн', 'Production'],
    ['card_view_case', 'Відкрити кейс', 'View Case']
  ];

  return rows.map(r => r.join('\t')).join('\n');
}

/**
 * Generates copy-pasteable TSV data for the dedicated "Contacts" tab in Google Sheets
 */
export function getContactsSheetTsvTemplate(): string {
  const d = DEFAULT_CONTACTS;
  const rows: [string, string, string][] = [
    ['key', 'ua', 'en'],
    ['email', d.email, d.email],
    ['telegram', d.telegram, d.telegram],
    ['linkedin', d.linkedin, d.linkedin],
    ['behance', d.behance || 'https://behance.net/ivanselivanov', d.behance || 'https://behance.net/ivanselivanov'],
    ['github', d.github || 'https://github.com/ivanselivanov', d.github || 'https://github.com/ivanselivanov'],
    ['phone', d.phone || '', d.phone || ''],
    ['address', d.address?.ua || 'Львів, Україна (Доступний по всьому світу)', d.address?.en || 'Lviv, Ukraine (Available Worldwide)']
  ];

  const escapeTsv = (str: string) => str.replace(/\t/g, ' ').replace(/\n/g, ' ');
  return ['key\tua\ten', ...rows.slice(1).map(r => `${r[0]}\t${escapeTsv(r[1])}\t${escapeTsv(r[2])}`)].join('\n');
}


/**
 * Generates copy-pasteable TSV data for the "Legal_And_Banners" tab in Google Sheets
 */
export function getLegalSheetTsvTemplate(): string {
  const d = DEFAULT_LEGAL_AND_BANNERS;
  const rows: [string, string, string][] = [
    // Cookie & Data Processing Banner
    ['cookie_title', d.cookieBanner.title.ua, d.cookieBanner.title.en],
    ['cookie_desc', d.cookieBanner.description.ua, d.cookieBanner.description.en],
    ['cookie_badge', d.cookieBanner.badge?.ua || '', d.cookieBanner.badge?.en || ''],
    ['cookie_btn_configure', d.cookieBanner.configureBtn?.ua || '', d.cookieBanner.configureBtn?.en || ''],
    ['cookie_btn_collapse', d.cookieBanner.collapseBtn?.ua || '', d.cookieBanner.collapseBtn?.en || ''],
    ['cookie_essential_title', d.cookieBanner.essentialTitle?.ua || '', d.cookieBanner.essentialTitle?.en || ''],
    ['cookie_essential_desc', d.cookieBanner.essentialDesc?.ua || '', d.cookieBanner.essentialDesc?.en || ''],
    ['cookie_essential_storage', d.cookieBanner.essentialStorage?.ua || 'LocalStorage', d.cookieBanner.essentialStorage?.en || 'LocalStorage'],
    ['cookie_functional_title', d.cookieBanner.functionalTitle?.ua || '', d.cookieBanner.functionalTitle?.en || ''],
    ['cookie_functional_desc', d.cookieBanner.functionalDesc?.ua || '', d.cookieBanner.functionalDesc?.en || ''],
    ['cookie_functional_storage', d.cookieBanner.functionalStorage?.ua || 'LocalStorage / Audio API', d.cookieBanner.functionalStorage?.en || 'LocalStorage / Audio API'],
    ['cookie_analytics_label', d.cookieBanner.analyticsLabel.ua, d.cookieBanner.analyticsLabel.en],
    ['cookie_analytics_desc', d.cookieBanner.analyticsDesc.ua, d.cookieBanner.analyticsDesc.en],
    ['cookie_analytics_storage', d.cookieBanner.analyticsStorage?.ua || 'Client Runtime', d.cookieBanner.analyticsStorage?.en || 'Client Runtime'],
    ['cookie_preferences_label', d.cookieBanner.preferencesLabel.ua, d.cookieBanner.preferencesLabel.en],
    ['cookie_preferences_desc', d.cookieBanner.preferencesDesc.ua, d.cookieBanner.preferencesDesc.en],
    ['cookie_personalization_title', d.cookieBanner.personalizationTitle?.ua || '', d.cookieBanner.personalizationTitle?.en || ''],
    ['cookie_personalization_desc', d.cookieBanner.personalizationDesc?.ua || '', d.cookieBanner.personalizationDesc?.en || ''],
    ['cookie_personalization_storage', d.cookieBanner.personalizationStorage?.ua || 'LocalStorage Cache', d.cookieBanner.personalizationStorage?.en || 'LocalStorage Cache'],
    ['cookie_btn_accept', d.cookieBanner.acceptAll.ua, d.cookieBanner.acceptAll.en],
    ['cookie_btn_necessary', d.cookieBanner.onlyNecessary.ua, d.cookieBanner.onlyNecessary.en],
    ['cookie_btn_save', d.cookieBanner.savePreferences.ua, d.cookieBanner.savePreferences.en],
    ['cookie_link_policy', d.cookieBanner.policyLink.ua, d.cookieBanner.policyLink.en],

    // Privacy Policy
    ['privacy_title', d.privacyPolicy.title.ua, d.privacyPolicy.title.en],
    ['privacy_subtitle', d.privacyPolicy.subtitle.ua, d.privacyPolicy.subtitle.en],
    ['privacy_last_updated', d.privacyPolicy.lastUpdated.ua, d.privacyPolicy.lastUpdated.en],
    ['privacy_contact_email', d.privacyPolicy.contactEmail, d.privacyPolicy.contactEmail],
    ['privacy_contact_location', d.privacyPolicy.contactLocation.ua, d.privacyPolicy.contactLocation.en],

    ['privacy_s1_title', d.privacyPolicy.sections[0].title.ua, d.privacyPolicy.sections[0].title.en],
    ['privacy_s1_content', d.privacyPolicy.sections[0].content.ua, d.privacyPolicy.sections[0].content.en],

    ['privacy_s2_title', d.privacyPolicy.sections[1].title.ua, d.privacyPolicy.sections[1].title.en],
    ['privacy_s2_content', d.privacyPolicy.sections[1].content.ua, d.privacyPolicy.sections[1].content.en],

    ['privacy_s3_title', d.privacyPolicy.sections[2].title.ua, d.privacyPolicy.sections[2].title.en],
    ['privacy_s3_content', d.privacyPolicy.sections[2].content.ua, d.privacyPolicy.sections[2].content.en],

    ['privacy_s4_title', d.privacyPolicy.sections[3].title.ua, d.privacyPolicy.sections[3].title.en],
    ['privacy_s4_content', d.privacyPolicy.sections[3].content.ua, d.privacyPolicy.sections[3].content.en],

    ['privacy_s5_title', d.privacyPolicy.sections[4].title.ua, d.privacyPolicy.sections[4].title.en],
    ['privacy_s5_content', d.privacyPolicy.sections[4].content.ua, d.privacyPolicy.sections[4].content.en],

    ['privacy_s6_title', d.privacyPolicy.sections[5].title.ua, d.privacyPolicy.sections[5].title.en],
    ['privacy_s6_content', d.privacyPolicy.sections[5].content.ua, d.privacyPolicy.sections[5].content.en],

    // Terms of Use
    ['terms_title', d.termsOfUse.title.ua, d.termsOfUse.title.en],
    ['terms_subtitle', d.termsOfUse.subtitle.ua, d.termsOfUse.subtitle.en],
    ['terms_last_updated', d.termsOfUse.lastUpdated.ua, d.termsOfUse.lastUpdated.en],
    ['terms_contact_email', d.termsOfUse.contactEmail, d.termsOfUse.contactEmail],

    ['terms_s1_title', d.termsOfUse.sections[0].title.ua, d.termsOfUse.sections[0].title.en],
    ['terms_s1_content', d.termsOfUse.sections[0].content.ua, d.termsOfUse.sections[0].content.en],

    ['terms_s2_title', d.termsOfUse.sections[1].title.ua, d.termsOfUse.sections[1].title.en],
    ['terms_s2_content', d.termsOfUse.sections[1].content.ua, d.termsOfUse.sections[1].content.en],

    ['terms_s3_title', d.termsOfUse.sections[2].title.ua, d.termsOfUse.sections[2].title.en],
    ['terms_s3_content', d.termsOfUse.sections[2].content.ua, d.termsOfUse.sections[2].content.en],

    ['terms_s4_title', d.termsOfUse.sections[3].title.ua, d.termsOfUse.sections[3].title.en],
    ['terms_s4_content', d.termsOfUse.sections[3].content.ua, d.termsOfUse.sections[3].content.en],

    ['terms_s5_title', d.termsOfUse.sections[4].title.ua, d.termsOfUse.sections[4].title.en],
    ['terms_s5_content', d.termsOfUse.sections[4].content.ua, d.termsOfUse.sections[4].content.en],

    ['terms_s6_title', d.termsOfUse.sections[5].title.ua, d.termsOfUse.sections[5].title.en],
    ['terms_s6_content', d.termsOfUse.sections[5].content.ua, d.termsOfUse.sections[5].content.en],

    // Navigation Menu Texts
    ['menu_system_title', 'IS // СИСТЕМА НАВІГАЦІЇ', 'IS // NAVIGATION SYSTEM'],
    ['menu_item1_title', 'Проєкти', 'Selected Work'],
    ['menu_item1_desc', 'Вибрані кейси & інтерфейси', 'Featured cases & digital products'],
    ['menu_item2_title', 'Експертиза', 'Core Expertise'],
    ['menu_item2_desc', 'UI/UX, графіка та стек', 'UI/UX, visual design & tech'],
    ['menu_item3_title', 'Досвід', 'Career Timeline'],
    ['menu_item3_desc', 'Кар’єрний шлях та ролі', 'Professional trajectory & milestones'],
    ['menu_item4_title', 'Контакти', 'Get In Touch'],
    ['menu_item4_desc', 'Зв’язок для нових викликів', 'Direct collaboration inquiries'],
    ['menu_contacts_title', 'Прямі контакти:', 'Direct Channels:'],
    ['menu_copy_btn', 'Копія', 'Copy'],
    ['menu_copied_btn', 'Скопійовано!', 'Copied!'],

    // Announcement Banner
    ['announcement_enabled', String(d.announcementBanner.enabled), String(d.announcementBanner.enabled)],
    ['announcement_badge', d.announcementBanner.badge.ua, d.announcementBanner.badge.en],
    ['announcement_text', d.announcementBanner.text.ua, d.announcementBanner.text.en],
    ['announcement_link', d.announcementBanner.link || '#contact', d.announcementBanner.link || '#contact']
  ];

  const escapeTsv = (str: string) => str.replace(/\t/g, ' ').replace(/\n/g, ' ');
  return ['key\tua\ten', ...rows.map(r => `${r[0]}\t${escapeTsv(r[1])}\t${escapeTsv(r[2])}`)].join('\n');
}

/**
 * Generates copy-pasteable TSV data for the "Projects" tab in Google Sheets
 */
export function generateProjectsTSV(projects: any[]): string {
  const headers = [
    'id',
    'title_ua',
    'title_en',
    'year',
    'client',
    'role_ua',
    'role_en',
    'category',
    'status',
    'featured',
    'thumbnailUrl',
    'heroImage',
    'liveLink',
    'figmaUrl',
    'figmaEmbedUrl',
    'tagline_ua',
    'tagline_en',
    'overview_ua',
    'overview_en',
    'tools',
    'palette',
    'challenge_ua',
    'challenge_en',
    'solution_ua',
    'solution_en',
    'impact_ua',
    'impact_en',
    'fonts_ua',
    'fonts_en',
    'colors_ua',
    'colors_en'
  ];

  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return '';
    return String(val).replace(/\t/g, ' ').replace(/\n/g, ' ').trim();
  };

  const rows = projects.map(p => {
    const roleUa = typeof p.role === 'object' && p.role !== null ? p.role.ua : String(p.role || p.role_ua || '');
    const roleEn = typeof p.role === 'object' && p.role !== null ? p.role.en : String(p.role || p.role_en || '');
    const titleUa = typeof p.title === 'object' && p.title !== null ? p.title.ua : String(p.title_ua || p.title || '');
    const titleEn = typeof p.title === 'object' && p.title !== null ? p.title.en : String(p.title_en || p.title || '');
    const taglineUa = typeof p.tagline === 'object' && p.tagline !== null ? p.tagline.ua : String(p.tagline_ua || p.tagline || '');
    const taglineEn = typeof p.tagline === 'object' && p.tagline !== null ? p.tagline.en : String(p.tagline_en || p.tagline || '');
    const descUa = typeof p.description === 'object' && p.description !== null ? p.description.ua : String(p.overview_ua || p.description_ua || p.description || '');
    const descEn = typeof p.description === 'object' && p.description !== null ? p.description.en : String(p.overview_en || p.description_en || p.description || '');
    const challengeUa = typeof p.problemStatement === 'object' && p.problemStatement !== null ? p.problemStatement.ua : String(p.challenge_ua || p.problemStatement || '');
    const challengeEn = typeof p.problemStatement === 'object' && p.problemStatement !== null ? p.problemStatement.en : String(p.challenge_en || p.problemStatement || '');
    const solutionUa = typeof p.solution === 'object' && p.solution !== null ? p.solution.ua : String(p.solution_ua || p.solution || '');
    const solutionEn = typeof p.solution === 'object' && p.solution !== null ? p.solution.en : String(p.solution_en || p.solution || '');
    const impactUa = typeof p.businessImpact === 'object' && p.businessImpact !== null ? p.businessImpact.ua : String(p.impact_ua || p.businessImpact || '');
    const impactEn = typeof p.businessImpact === 'object' && p.businessImpact !== null ? p.businessImpact.en : String(p.impact_en || p.businessImpact || '');
    const toolsStr = Array.isArray(p.toolsUsed) ? p.toolsUsed.join(', ') : (Array.isArray(p.tools) ? p.tools.join(', ') : String(p.tools || ''));
    
    // Fonts resolution
    const fontsRaw = p.designSystem?.fonts;
    let fontsUa = '';
    let fontsEn = '';
    if (Array.isArray(fontsRaw)) {
      fontsUa = fontsRaw.join(', ');
      fontsEn = fontsRaw.join(', ');
    } else if (fontsRaw && typeof fontsRaw === 'object') {
      fontsUa = Array.isArray(fontsRaw.ua) ? fontsRaw.ua.join(', ') : String(fontsRaw.ua || '');
      fontsEn = Array.isArray(fontsRaw.en) ? fontsRaw.en.join(', ') : String(fontsRaw.en || fontsUa);
    } else {
      fontsUa = String(p.fonts_ua || p.fonts || '');
      fontsEn = String(p.fonts_en || p.fonts || fontsUa);
    }

    // Colors resolution
    const colorsRaw = p.designSystem?.colors;
    let colorsUa = '';
    let colorsEn = '';
    if (Array.isArray(colorsRaw)) {
      colorsUa = colorsRaw.map((c: any) => {
        const name = typeof c.name === 'object' && c.name !== null ? (c.name.ua || c.name.en) : c.name;
        return `${name}: ${c.hex}`;
      }).join(', ');
      colorsEn = colorsRaw.map((c: any) => {
        const name = typeof c.name === 'object' && c.name !== null ? (c.name.en || c.name.ua) : c.name;
        return `${name}: ${c.hex}`;
      }).join(', ');
    } else {
      colorsUa = String(p.colors_ua || p.palette_ua || p.colors || p.palette || '');
      colorsEn = String(p.colors_en || p.palette_en || p.colors || p.palette || colorsUa);
    }

    return [
      escapeCell(p.id),
      escapeCell(titleUa),
      escapeCell(titleEn),
      escapeCell(p.timeline || p.year),
      escapeCell(p.client || ''),
      escapeCell(roleUa),
      escapeCell(roleEn),
      escapeCell(p.category),
      escapeCell(p.status),
      escapeCell(p.isFeatured || p.featured ? 'TRUE' : 'FALSE'),
      escapeCell(p.thumbnailUrl || ''),
      escapeCell((p.galleryUrls && p.galleryUrls[0]) || p.heroImage || ''),
      escapeCell(p.liveLink || ''),
      escapeCell(p.figmaUrl || ''),
      escapeCell(p.figmaEmbedUrl || ''),
      escapeCell(taglineUa),
      escapeCell(taglineEn),
      escapeCell(descUa),
      escapeCell(descEn),
      escapeCell(toolsStr),
      escapeCell(colorsUa),
      escapeCell(challengeUa),
      escapeCell(challengeEn),
      escapeCell(solutionUa),
      escapeCell(solutionEn),
      escapeCell(impactUa),
      escapeCell(impactEn),
      escapeCell(fontsUa),
      escapeCell(fontsEn),
      escapeCell(colorsUa),
      escapeCell(colorsEn)
    ].join('\t');
  });

  return [headers.join('\t'), ...rows].join('\n');
}
