import { Project, ExperienceItem, Testimonial, GeneralSettings, LegalAndBannersData } from '../types';
import { DEFAULT_PROJECTS, DEFAULT_EXPERIENCE, DEFAULT_TESTIMONIALS, DEFAULT_SETTINGS, DEFAULT_LEGAL_AND_BANNERS } from '../data/defaultData';

const CACHE_KEY = 'ivan_portfolio_sheets_data';
const SETTINGS_KEY = 'ivan_portfolio_settings';

export interface PortfolioData {
  projects: Project[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  settings: GeneralSettings;
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

function isLocalizedObj(val: any): boolean {
  return typeof val === 'object' && val !== null && !Array.isArray(val) && ('ua' in val || 'en' in val);
}

function parseFonts(val: any): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function parseColors(val: any): { name: string; hex: string }[] {
  if (Array.isArray(val)) {
    return val.map((item, idx) => {
      if (typeof item === 'string') return { name: `Color ${idx + 1}`, hex: item };
      if (item && typeof item === 'object') {
        return { name: String(item.name || `Color ${idx + 1}`), hex: String(item.hex || '#000000') };
      }
      return null;
    }).filter((x): x is { name: string; hex: string } => Boolean(x));
  }
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map((part, idx) => {
      const trimmed = part.trim();
      if (!trimmed) return null;
      if (trimmed.includes(':')) {
        const [name, hex] = trimmed.split(':').map(s => s.trim());
        const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
        return { name: name || `Color ${idx + 1}`, hex: cleanHex };
      }
      const cleanHex = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      return { name: `Color ${idx + 1}`, hex: cleanHex };
    }).filter((x): x is { name: string; hex: string } => Boolean(x));
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

function mapProjectFromSheet(p: any, idx: number): Project {
  const category = (p.category || 'ui-ux') as Project['category'];
  const categoryLabels: Record<string, { ua: string; en: string }> = {
    'ui-ux': { ua: 'UI/UX Продукт', en: 'UI/UX Product' },
    '3d-render': { ua: '3D Рендери', en: '3D Renders' },
    'book-design': { ua: 'Книжковий дизайн', en: 'Book Design' },
    'branding': { ua: 'Айдентика & Постери', en: 'Identity & Posters' }
  };

  const catLabel = p.categoryLabel || categoryLabels[category] || { ua: 'Проєкт', en: 'Project' };

  const parsedFonts = parseFonts(p.fonts || p.designSystem?.fonts);
  const parsedColors = parseColors(p.colors || p.palette || p.designSystem?.colors);
  const parsedGrid = String(p.gridType || p.grid || p.designSystem?.gridType || '').trim();
  const { thumbnailUrl, galleryUrls } = parseProjectImages(p);

  return {
    id: String(p.id || `p-${idx + 1}`),
    slug: String(p.slug || p.id || `project-${idx + 1}`),
    title: String(p.title || 'Без назви'),
    category: category,
    categoryLabel: isLocalizedObj(catLabel) ? catLabel : { ua: String(catLabel), en: String(catLabel) },
    status: p.status === 'concept' ? 'concept' : 'realized',
    role: isLocalizedObj(p.role) ? p.role : {
      ua: p.role_ua || p.role || 'Lead Designer & Creative Director',
      en: p.role_en || p.role || 'Lead Designer & Creative Director'
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
    metrics: Array.isArray(p.metrics)
      ? p.metrics.map((m: any) => ({
          value: String(m.value || ''),
          label: isLocalizedObj(m.label) ? m.label : { ua: String(m.label || ''), en: String(m.label || '') }
        }))
      : [],
    toolsUsed: Array.isArray(p.tools) ? p.tools : (Array.isArray(p.toolsUsed) ? p.toolsUsed : ['Figma', 'TypeScript', 'Design Systems']),
    designSystem: {
      fonts: parsedFonts,
      colors: parsedColors,
      gridType: parsedGrid || undefined
    },
    thumbnailUrl,
    galleryUrls,
    liveLink: p.liveLink || undefined,
    isFeatured: Boolean(p.featured ?? p.isFeatured ?? true),
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
    if (isLocalizedObj(val)) {
      return {
        ua: val.ua !== undefined && String(val.ua).trim() !== '' ? String(val.ua).trim() : fallback.ua,
        en: val.en !== undefined && String(val.en).trim() !== '' ? String(val.en).trim() : fallback.en
      };
    }
    const valUa = s[`${key}_ua`] || s[`${key}_UA`];
    const valEn = s[`${key}_en`] || s[`${key}_EN`];
    if ((valUa !== undefined && String(valUa).trim() !== '') || (valEn !== undefined && String(valEn).trim() !== '')) {
      return {
        ua: valUa !== undefined && String(valUa).trim() !== '' ? String(valUa).trim() : (valEn ? String(valEn).trim() : fallback.ua),
        en: valEn !== undefined && String(valEn).trim() !== '' ? String(valEn).trim() : (valUa ? String(valUa).trim() : fallback.en)
      };
    }
    if (typeof val === 'string' && val.trim() !== '') {
      return { ua: val.trim(), en: val.trim() };
    }
    return fallback;
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
  const location = getLoc('location', DEFAULT_SETTINGS.location);

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
    }
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
        parsed.settings = mapSettingsFromSheet(parsed.settings);
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

      return {
        ...parsed,
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

  const parsedProjects = json.projects && Array.isArray(json.projects) && json.projects.length > 0
    ? json.projects.map(mapProjectFromSheet)
    : DEFAULT_PROJECTS;

  const parsedExperience = json.experience && Array.isArray(json.experience) && json.experience.length > 0
    ? json.experience.map(mapExperienceFromSheet)
    : DEFAULT_EXPERIENCE;

  const parsedTestimonials = json.testimonials && Array.isArray(json.testimonials) && json.testimonials.length > 0
    ? json.testimonials.map(mapTestimonialFromSheet)
    : DEFAULT_TESTIMONIALS;

  const parsedSettings = json.settings
    ? mapSettingsFromSheet(json.settings)
    : DEFAULT_SETTINGS;

  const parsedLegalAndBanners = mapLegalAndBannersFromSheet(
    json.legalAndBanners || json.legal || json.banners,
    json.settings
  );

  const hasLegalDataInEndpoint = Boolean(
    (json.legalAndBanners && typeof json.legalAndBanners === 'object' && Object.keys(json.legalAndBanners).length > 0) ||
    json.legal ||
    json.banners ||
    (json.settings && (json.settings.cookie_title || json.settings['cookie_title_ua'] || json.settings['cookie_title_UA']))
  );

  const freshData: PortfolioData = {
    projects: parsedProjects,
    experience: parsedExperience,
    testimonials: parsedTestimonials,
    settings: parsedSettings,
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
 * 1. "Projects"
 * 2. "General_Data" (columns: key, ua, en)
 * 3. "Experience"
 * 4. "Testimonials"
 * 5. "Legal_And_Banners" (columns: key, ua, en)
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
  var generalSheet = findSheet(["General_Data", "general_data", "General", "general"]);
  var expSheet = findSheet(["Experience", "experience"]);
  var testSheet = findSheet(["Testimonials", "testimonials"]);
  var legalSheet = findSheet(["Legal_And_Banners", "legal_and_banners", "Legal and Banners", "Legal", "legal", "Banners", "banners", "Cookies", "cookies"]);
  
  var result = {
    status: "ok",
    timestamp: new Date().toISOString(),
    sheetId: ss.getId(),
    projects: parseSheetToObjects(projectsSheet),
    settings: parseGeneralSheet(generalSheet),
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
    ['expertise_tech_items', 'Figma, HTML, CSS, JavaScript, Vercel, Google AI Studio, Google Ads, Meta Ads, Google Tag Manager, Google Sheets, SVG, Adobe Illustrator', 'Figma, HTML, CSS, JavaScript, Vercel, Google AI Studio, Google Ads, Meta Ads, Google Tag Manager, Google Sheets, SVG, Adobe Illustrator']
  ];

  return rows.map(r => r.join('\t')).join('\n');
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

    // Announcement Banner
    ['announcement_enabled', String(d.announcementBanner.enabled), String(d.announcementBanner.enabled)],
    ['announcement_badge', d.announcementBanner.badge.ua, d.announcementBanner.badge.en],
    ['announcement_text', d.announcementBanner.text.ua, d.announcementBanner.text.en],
    ['announcement_link', d.announcementBanner.link || '#contact', d.announcementBanner.link || '#contact']
  ];

  const escapeTsv = (str: string) => str.replace(/\t/g, ' ').replace(/\n/g, ' ');
  return ['key\tua\ten', ...rows.map(r => `${r[0]}\t${escapeTsv(r[1])}\t${escapeTsv(r[2])}`)].join('\n');
}
