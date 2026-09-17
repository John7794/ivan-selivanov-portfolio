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

function mapProjectFromSheet(p: any, idx: number): Project {
  const category = (p.category || 'ui-ux') as Project['category'];
  const categoryLabels: Record<string, { ua: string; en: string }> = {
    'ui-ux': { ua: 'UI/UX Продукт', en: 'UI/UX Product' },
    '3d-render': { ua: '3D Рендери', en: '3D Renders' },
    'book-design': { ua: 'Книжковий дизайн', en: 'Book Design' },
    'branding': { ua: 'Айдентика & Постери', en: 'Identity & Posters' }
  };

  const catLabel = p.categoryLabel || categoryLabels[category] || { ua: 'Проєкт', en: 'Project' };

  return {
    id: String(p.id || `p-${idx + 1}`),
    slug: String(p.slug || p.id || `project-${idx + 1}`),
    title: String(p.title || 'Без назви'),
    category: category,
    categoryLabel: typeof catLabel === 'object' ? catLabel : { ua: String(catLabel), en: String(catLabel) },
    status: p.status === 'concept' ? 'concept' : 'realized',
    role: typeof p.role === 'object' ? p.role : {
      ua: p.role_ua || p.role || 'Lead Designer & Creative Director',
      en: p.role_en || p.role || 'Lead Designer & Creative Director'
    },
    timeline: String(p.year || p.timeline || '2024'),
    tagline: typeof p.tagline === 'object' ? p.tagline : {
      ua: p.tagline_ua || p.tagline || '',
      en: p.tagline_en || p.tagline || ''
    },
    description: typeof p.description === 'object' ? p.description : {
      ua: p.overview_ua || p.description_ua || p.description || '',
      en: p.overview_en || p.description_en || p.description || ''
    },
    problemStatement: typeof p.problemStatement === 'object' ? p.problemStatement : {
      ua: p.problemStatement_ua || 'Оптимізація складних процесів та структурування візуальної ієрархії для максимальної чіткості взаємодії.',
      en: p.problemStatement_en || 'Streamlining intricate workflows and structuring visual hierarchy to minimize friction.'
    },
    solution: typeof p.solution === 'object' ? p.solution : {
      ua: p.solution_ua || 'Впровадження суворої швейцарської сітки, адаптивних дизайн-токенів та виразної типографіки.',
      en: p.solution_en || 'Deploying a rigorous modular grid, adaptive design tokens, and expressive typography.'
    },
    businessImpact: typeof p.businessImpact === 'object' ? p.businessImpact : {
      ua: p.businessImpact_ua || 'Істотне зниження когнітивного навантаження та підвищення ефективності сприйняття продукту.',
      en: p.businessImpact_en || 'Substantial reduction in user latency and elevation of overall brand precision.'
    },
    metrics: Array.isArray(p.metrics)
      ? p.metrics.map((m: any) => ({
          value: String(m.value || ''),
          label: typeof m.label === 'object' ? m.label : { ua: String(m.label || ''), en: String(m.label || '') }
        }))
      : [],
    toolsUsed: Array.isArray(p.tools) ? p.tools : (Array.isArray(p.toolsUsed) ? p.toolsUsed : ['Figma', 'TypeScript', 'Design Systems']),
    designSystem: {
      fonts: p.designSystem?.fonts || ['Plus Jakarta Sans', 'Playfair Display', 'JetBrains Mono'],
      colors: Array.isArray(p.palette)
        ? p.palette.map((hex: string, i: number) => ({ name: `Color ${i + 1}`, hex }))
        : (p.designSystem?.colors || [{ name: 'Obsidian', hex: '#0a0a0a' }, { name: 'Chalk', hex: '#f4f4f0' }]),
      gridType: p.designSystem?.gridType || '12-Column Swiss Modular'
    },
    thumbnailUrl: p.thumbnailUrl || p.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600',
    galleryUrls: Array.isArray(p.galleryUrls) ? p.galleryUrls : [p.heroImage || p.thumbnailUrl],
    liveLink: p.liveLink || undefined,
    isFeatured: Boolean(p.featured ?? p.isFeatured ?? true),
    sortOrder: Number(p.sortOrder || idx + 1),
    testimonialId: p.testimonialId || undefined
  };
}

function mapExperienceFromSheet(e: any, idx: number): ExperienceItem {
  const rawType = String(e.type || 'commercial').toLowerCase();
  let type: 'commercial' | 'art-direction' | 'education' = 'commercial';
  if (rawType.includes('art') || rawType.includes('creative') || rawType.includes('lead')) {
    type = 'art-direction';
  } else if (rawType.includes('edu') || rawType.includes('teach') || rawType.includes('mentor')) {
    type = 'education';
  }

  const periodStr = String(e.period || '2022 — Present');
  const isCurrent = periodStr.toLowerCase().includes('present') || periodStr.toLowerCase().includes('зараз');
  const parts = periodStr.split(/[—–-]/);
  const startDate = parts[0]?.trim() || '2022';
  const endDate = parts[1]?.trim() || (isCurrent ? 'Зараз' : '2024');

  const descUa = Array.isArray(e.description?.ua)
    ? e.description.ua
    : (e.description_ua ? [e.description_ua] : (typeof e.description === 'string' ? [e.description] : ['Управління продуктовою дизайн-системою та візуальною ієрархією']));
  const descEn = Array.isArray(e.description?.en)
    ? e.description.en
    : (e.description_en ? [e.description_en] : (typeof e.description === 'string' ? [e.description] : ['Directing core design systems and visual architecture']));

  return {
    id: String(e.id || `exp-${idx + 1}`),
    type,
    company: String(e.company || 'Studio'),
    location: String(e.location || 'Lviv / Remote'),
    position: typeof e.position === 'object' ? e.position : {
      ua: e.role_ua || e.position_ua || e.role || 'Principal Designer',
      en: e.role_en || e.position_en || e.role || 'Principal Designer'
    },
    startDate,
    endDate,
    isCurrent,
    description: {
      ua: descUa,
      en: descEn
    },
    technologies: Array.isArray(e.skills) ? e.skills : (Array.isArray(e.technologies) ? e.technologies : ['UI/UX', 'Design Systems', 'Typography'])
  };
}

function mapTestimonialFromSheet(t: any, idx: number): Testimonial {
  return {
    id: String(t.id || `test-${idx + 1}`),
    projectId: t.projectId || t.projectTitle || undefined,
    author: String(t.author || ''),
    company: String(t.company || ''),
    role: typeof t.role === 'object' ? t.role : {
      ua: t.role_ua || t.role || '',
      en: t.role_en || t.role || ''
    },
    text: typeof t.text === 'object' ? t.text : {
      ua: t.content_ua || t.text_ua || t.text || '',
      en: t.content_en || t.text_en || t.text || ''
    },
    avatarUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  };
}

function mapSettingsFromSheet(s: any): GeneralSettings {
  return {
    name: typeof s.name === 'object' ? s.name : {
      ua: s.name_ua || s.name || DEFAULT_SETTINGS.name.ua,
      en: s.name_en || s.name || DEFAULT_SETTINGS.name.en
    },
    title: typeof s.title === 'object' ? s.title : {
      ua: s.heroTag_ua || s.heroTitle || s.title_ua || DEFAULT_SETTINGS.title.ua,
      en: s.heroTag_en || s.heroTitle || s.title_en || DEFAULT_SETTINGS.title.en
    },
    bioShort: typeof s.bioShort === 'object' ? s.bioShort : {
      ua: s.heroTagline_ua || s.bio_ua || DEFAULT_SETTINGS.bioShort.ua,
      en: s.heroTagline_en || s.bio_en || DEFAULT_SETTINGS.bioShort.en
    },
    location: typeof s.location === 'object' ? s.location : {
      ua: s.location_ua || DEFAULT_SETTINGS.location.ua,
      en: s.location_en || DEFAULT_SETTINGS.location.en
    },
    email: s.email || DEFAULT_SETTINGS.email,
    telegram: s.telegram || DEFAULT_SETTINGS.telegram,
    linkedin: s.linkedin || DEFAULT_SETTINGS.linkedin,
    behance: s.behance || DEFAULT_SETTINGS.behance,
    github: s.github || DEFAULT_SETTINGS.github,
    heroImage: formatImageUrl(s.heroImage || s.profileImage, DEFAULT_SETTINGS.heroImage),
    appsScriptUrl: s.appsScriptUrl || DEFAULT_SETTINGS.appsScriptUrl,
    googleSheetId: s.googleSheetId || DEFAULT_SETTINGS.googleSheetId,
    lastSyncedAt: new Date().toLocaleTimeString('en-GB')
  };
}

export function getStoredData(): PortfolioData {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Run the settings through the mapper to catch URL fixes and schema updates on old cache
      if (parsed.settings) {
        parsed.settings.heroImage = formatImageUrl(parsed.settings.heroImage, DEFAULT_SETTINGS.heroImage);
        if (typeof parsed.settings.name === 'string') {
          parsed.settings.name = {
            ua: parsed.settings.name,
            en: parsed.settings.name
          };
        }
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
