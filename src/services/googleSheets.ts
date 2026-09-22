import { Project, ExperienceItem, Testimonial, GeneralSettings } from '../types';
import { DEFAULT_PROJECTS, DEFAULT_EXPERIENCE, DEFAULT_TESTIMONIALS, DEFAULT_SETTINGS } from '../data/defaultData';

const CACHE_KEY = 'ivan_portfolio_sheets_data';
const SETTINGS_KEY = 'ivan_portfolio_settings';

export interface PortfolioData {
  projects: Project[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  settings: GeneralSettings;
  source: 'cache' | 'default' | 'live_sheets';
  lastSyncedAt: string;
}

export const DEFAULT_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzWBH_tyMHYUEeaRM1u91hS1TWTKiQm3F2H6eFfQNN9oUBIKfbwZnF36kFERfZ9D1gLhA/exec';

function formatImageUrl(url: string | undefined | null, fallback?: string): string {
  if (!url) return fallback || '';
  
  // Extract ID from any Google Drive link
  let fileId = '';
  
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) fileId = match[1];
  
  const openRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openRegex);
  if (openMatch && openMatch[1]) fileId = openMatch[1];
  
  const ucRegex = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = url.match(ucRegex);
  if (ucMatch && ucMatch[1]) fileId = ucMatch[1];
  
  if (fileId) {
    // lh3.googleusercontent.com/d/ is the most reliable endpoint for embedding Drive images in <img> tags
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
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

function mapSettingsFromSheet(raw: any): GeneralSettings {
  let s = raw;
  
  // If the sheet comes as an array of rows (e.g. key, value_ua, value_en), transform it into a flat map
  if (Array.isArray(raw)) {
    s = raw.reduce((acc, row) => {
      if (row && row.key) {
        // Fallbacks: if value_ua/value_en is not present, check ua/en, then value
        acc[`${row.key}_ua`] = row.value_ua || row.ua || row.value;
        acc[`${row.key}_en`] = row.value_en || row.en || row.value;
        acc[row.key] = row.value || row.value_ua || row.ua;
      }
      return acc;
    }, {});
  }

  const parseList = (val: any, fallback: string[]): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val.split(/[\n,]+/).map(i => i.trim()).filter(Boolean);
    }
    return fallback;
  };

  return {
    name: isLocalizedObj(s.name) ? s.name : {
      ua: s.name_ua || s.name || DEFAULT_SETTINGS.name.ua,
      en: s.name_en || s.name || DEFAULT_SETTINGS.name.en
    },
    title: isLocalizedObj(s.title) ? s.title : {
      ua: s.heroTag_ua || s.heroTitle || s.title_ua || s.title || DEFAULT_SETTINGS.title.ua,
      en: s.heroTag_en || s.heroTitle || s.title_en || s.title || DEFAULT_SETTINGS.title.en
    },
    bioShort: isLocalizedObj(s.bioShort) ? s.bioShort : {
      ua: s.heroTagline_ua || s.bio_ua || s.bioShort || DEFAULT_SETTINGS.bioShort.ua,
      en: s.heroTagline_en || s.bio_en || s.bioShort || DEFAULT_SETTINGS.bioShort.en
    },
    location: isLocalizedObj(s.location) ? s.location : {
      ua: s.location_ua || s.location || DEFAULT_SETTINGS.location.ua,
      en: s.location_en || s.location || DEFAULT_SETTINGS.location.en
    },
    email: s.email || DEFAULT_SETTINGS.email,
    telegram: s.telegram || DEFAULT_SETTINGS.telegram,
    linkedin: s.linkedin || DEFAULT_SETTINGS.linkedin,
    behance: s.behance || DEFAULT_SETTINGS.behance,
    github: s.github || DEFAULT_SETTINGS.github,
    heroImage: formatImageUrl(s.heroImage || s.profileImage, DEFAULT_SETTINGS.heroImage),
    appsScriptUrl: s.appsScriptUrl || DEFAULT_SETTINGS.appsScriptUrl,
    googleSheetId: s.googleSheetId || DEFAULT_SETTINGS.googleSheetId,
    lastSyncedAt: new Date().toLocaleTimeString('en-GB'),
    expertise: {
      heading: {
        ua: s.expertise_heading_ua || DEFAULT_SETTINGS.expertise!.heading.ua,
        en: s.expertise_heading_en || DEFAULT_SETTINGS.expertise!.heading.en
      },
      subtitle: {
        ua: s.expertise_subtitle_ua || DEFAULT_SETTINGS.expertise!.subtitle.ua,
        en: s.expertise_subtitle_en || DEFAULT_SETTINGS.expertise!.subtitle.en
      },
      card1Title: {
        ua: s.expertise_card1_title_ua || DEFAULT_SETTINGS.expertise!.card1Title.ua,
        en: s.expertise_card1_title_en || DEFAULT_SETTINGS.expertise!.card1Title.en
      },
      card1Desc: {
        ua: stripFigJam(s.expertise_card1_desc_ua || DEFAULT_SETTINGS.expertise!.card1Desc.ua),
        en: stripFigJam(s.expertise_card1_desc_en || DEFAULT_SETTINGS.expertise!.card1Desc.en)
      },
      card2Title: {
        ua: s.expertise_card2_title_ua || DEFAULT_SETTINGS.expertise!.card2Title.ua,
        en: s.expertise_card2_title_en || DEFAULT_SETTINGS.expertise!.card2Title.en
      },
      card2Desc: {
        ua: s.expertise_card2_desc_ua || DEFAULT_SETTINGS.expertise!.card2Desc.ua,
        en: s.expertise_card2_desc_en || DEFAULT_SETTINGS.expertise!.card2Desc.en
      },
      card3Title: {
        ua: s.expertise_card3_title_ua || DEFAULT_SETTINGS.expertise!.card3Title.ua,
        en: s.expertise_card3_title_en || DEFAULT_SETTINGS.expertise!.card3Title.en
      },
      card3Desc: {
        ua: s.expertise_card3_desc_ua || DEFAULT_SETTINGS.expertise!.card3Desc.ua,
        en: s.expertise_card3_desc_en || DEFAULT_SETTINGS.expertise!.card3Desc.en
      },
      card4Title: {
        ua: s.expertise_card4_title_ua || DEFAULT_SETTINGS.expertise!.card4Title.ua,
        en: s.expertise_card4_title_en || DEFAULT_SETTINGS.expertise!.card4Title.en
      },
      heuristics: {
        ua: [
          s.expertise_h1_ua || DEFAULT_SETTINGS.expertise!.heuristics.ua[0],
          s.expertise_h2_ua || DEFAULT_SETTINGS.expertise!.heuristics.ua[1],
          s.expertise_h3_ua || DEFAULT_SETTINGS.expertise!.heuristics.ua[2],
          s.expertise_h4_ua || DEFAULT_SETTINGS.expertise!.heuristics.ua[3]
        ],
        en: [
          s.expertise_h1_en || DEFAULT_SETTINGS.expertise!.heuristics.en[0],
          s.expertise_h2_en || DEFAULT_SETTINGS.expertise!.heuristics.en[1],
          s.expertise_h3_en || DEFAULT_SETTINGS.expertise!.heuristics.en[2],
          s.expertise_h4_en || DEFAULT_SETTINGS.expertise!.heuristics.en[3]
        ]
      },
      techStackTitle: {
        ua: s.expertise_tech_title_ua || DEFAULT_SETTINGS.expertise!.techStackTitle.ua,
        en: s.expertise_tech_title_en || DEFAULT_SETTINGS.expertise!.techStackTitle.en
      },
      techStackItems: parseList(
        s.expertise_tech_items || s.expertise_techStackItems || s.techStackItems,
        DEFAULT_SETTINGS.expertise!.techStackItems
      ).filter((item: string) => !item.toLowerCase().includes('figjam'))
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

  const freshData: PortfolioData = {
    projects: parsedProjects,
    experience: parsedExperience,
    testimonials: parsedTestimonials,
    settings: parsedSettings,
    source: 'live_sheets',
    lastSyncedAt: new Date().toISOString()
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
 * 1. Open your Google Sheet with tabs: "Projects", "General_Data", "Experience", "Testimonials"
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code and click Deploy > New deployment > Web app
 * 4. Execute as: Me, Who has access: Anyone
 * 5. Copy the Web app URL and paste it in the portfolio's "Database Sync" panel!
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var projectsSheet = ss.getSheetByName("Projects");
  var generalSheet = ss.getSheetByName("General_Data");
  var expSheet = ss.getSheetByName("Experience");
  var testSheet = ss.getSheetByName("Testimonials");
  
  var result = {
    status: "ok",
    timestamp: new Date().toISOString(),
    projects: parseSheetToObjects(projectsSheet),
    settings: parseKeyValueSheet(generalSheet),
    experience: parseSheetToObjects(expSheet),
    testimonials: parseSheetToObjects(testSheet)
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseSheetToObjects(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = row[j];
      // Auto parse JSON columns
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      obj[headers[j]] = val;
    }
    rows.push(obj);
  }
  return rows;
}

function parseKeyValueSheet(sheet) {
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    var key = data[i][0];
    var val = data[i][1];
    if (key) settings[key] = val;
  }
  return settings;
}
`;
}
