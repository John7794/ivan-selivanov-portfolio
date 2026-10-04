import { Language } from '../types';

export const hasCyrillic = (str: string): boolean => {
  return /[\u0400-\u04FF]/.test(str);
};

export const COMMON_TRANSLATIONS: Record<string, string> = {
  // Names & identity
  'іван селіванов': 'Ivan Selivanov',
  'іван': 'Ivan',
  'селіванов': 'Selivanov',

  // Status & titles
  'готовий до співпраці': 'Available for work',
  'доступний до співпраці': 'Available for work',
  'доступний для співпраці': 'Available for work',
  'відкритий до співпраці': 'Open to opportunities',
  'артдиректор & ui/ux архітектор': 'Art Director & UI/UX Architect',
  'арт-директор & ui/ux архітектор': 'Art Director & UI/UX Architect',
  'ui/ux дизайнер': 'UI/UX Designer',
  'ui/ux дизайнер & артдиректор': 'UI/UX Designer & Art Director',
  'ui/ux архітектор': 'UI/UX Architect',
  'головний дизайнер': 'Lead Designer',
  'продуктовий дизайнер': 'Product Designer',
  'дизайнер': 'Designer',

  // Locations & addresses
  'львів, україна': 'Lviv, Ukraine',
  'львів, україна (доступний по всьому світу)': 'Lviv, Ukraine (Available Worldwide)',
  'львів': 'Lviv',
  'україна': 'Ukraine',
  'київ, україна': 'Kyiv, Ukraine',
  'київ / віддалено': 'Kyiv / Remote',
  'київ': 'Kyiv',
  'віддалено': 'Remote',

  // Hero bio & taglines
  'проєктую сучасні вебсайти та цифрові продукти, поєднуючи чисту візуальну естетику з продуманою логікою.':
    'I design modern websites and digital products, combining clean visual aesthetics with thoughtful logic.',
  'проєктую сучасні вебсайти...':
    'I design modern websites and digital products, combining clean visual aesthetics with thoughtful logic.',
  'створюю естетичні та ефективні інтерфейси для бізнесу.':
    'Crafting aesthetic and high-performance digital interfaces for modern business.',

  // Menu navigation items
  'проєкти': 'Selected Work',
  'експертиза': 'Core Expertise',
  'досвід': 'Career Timeline',
  'контакти': 'Get In Touch',
  'is // система навігації': 'IS // NAVIGATION SYSTEM',
  'вибрані кейси & інтерфейси': 'Featured cases & digital products',
  'ui/ux, графіка та стек': 'UI/UX, visual design & tech',
  'кар’єрний шлях та ролі': 'Professional trajectory & milestones',
  'зв’язок для нових викликів': 'Direct collaboration inquiries',
  'прямі контакти:': 'Direct Channels:',
  'копія': 'Copy',
  'скопійовано!': 'Copied!',
  'адреса': 'Address',

  // Sections & filters
  'вибрані роботи': 'Selected Works',
  'дослідити кейси': 'Explore case studies',
  'каскад': 'Masonry',
  'сітка': 'Grid',
  'всі напрямки': 'All disciplines',
  'ui/ux продукт': 'UI/UX Product',
  'ui/ux / web design': 'UI/UX / Web Design',
  '3d рендери': '3D Renders',
  '3d моделювання': '3D Modeling',
  'книжковий дизайн': 'Book Design',
  'дизайн книжок / друк': 'Book Design / Print',
  'айдентика & постери': 'Identity & Posters',
  'реклама / соціальні мережі': 'Advertising / Social Media',

  // Statuses (Filter & Card Badges)
  'всі статуси': 'All statuses',
  'статус': 'Status',
  'статуси': 'Statuses',
  'реалізовані (продакшн)': 'Live (Production)',
  'реалізовані': 'Live',
  'реалізовано': 'Live',
  'продакшн': 'Production',
  'продакшен': 'Production',
  'концепт': 'Concept',
  'концепти': 'Concepts',
  'концепти & r&d': 'Concept & R&D',
  'концепт & r&d': 'Concept & R&D',
  'обрані': 'Selected',
  'флагман': 'Selected',
  'відкрити кейс': 'Open case study',
  'переглянути кейс': 'View case study',
  'в роботі': 'In Progress',
  'в процесі': 'In Progress',
  'в розробці': 'In Development',
  'архів': 'Archive',
  'бета': 'Beta',
  'mvp': 'MVP',
  'тестування': 'Testing',
  'завершено': 'Completed',
  'реліз': 'Released',
  'дизайн-система': 'Design System',

  // Expertise cards
  'ui/ux дизайн': 'UI/UX Design',
  'проєктування зручних користувацьких інтерфейсів, створення прототипів та адаптивного дизайну з фокусом на користувацький досвід у figma.':
    'Designing intuitive user interfaces, wireframing, and responsive web design with a strong focus on UX in Figma.',
  'типографіка & сітки': 'Typography & Grid Systems',
  'робота з ієрархією шрифтів, модульними та швейцарськими сітками, створення гармонійного ритму сторінки.':
    'Precision layout with modular & Swiss grids, micro-typography, and rhythmic contrast.',
  '3d & візуалізація': '3D & Visual Assets',
  'створення об\'ємних ілюстрацій, рендерів та графічних елементів для підсилення візуальної ідентичності продукту.':
    'Production-ready 3D renders, spatial compositions, and high-impact visual artifacts.',
  'маркетинг & аналітика': 'Marketing & Analytics',
  'налаштування та оптимізація рекламних кампаній (google ads, meta ads) та вебаналітики через google tag manager, робота з даними у google sheets.':
    'Setting up and optimizing advertising campaigns (Google Ads, Meta Ads) and web analytics via Google Tag Manager, working with data in Google Sheets.',
  'технічний стек': 'Technical Stack',

  // Heuristics
  'глибоке дослідження': 'Deep Heuristic Discovery',
  'швейцарська школа верстки': 'Swiss Graphic Architecture',
  'системність компонентів': 'Design System Scalability',
  'орієнтація на бізнес-метрики': 'Measurable Business Impact'
};

export const STATUS_TRANSLATIONS_EN_TO_UA: Record<string, string> = {
  'all statuses': 'Всі статуси',
  'all': 'Всі статуси',
  'status': 'Статус',
  'statuses': 'Статуси',
  'live (production)': 'Реалізовані (Продакшн)',
  'production': 'Продакшн',
  'live': 'Реалізовані',
  'concept': 'Концепт',
  'conceptual': 'Концепт',
  'concepts': 'Концепти',
  'concept & r&d': 'Концепт & R&D',
  'concepts & r&d': 'Концепти & R&D',
  'selected': 'Обрані',
  'featured': 'Обрані',
  'in progress': 'В роботі',
  'in development': 'В розробці',
  'archive': 'Архів',
  'archived': 'Архів',
  'beta': 'Бета',
  'mvp': 'MVP',
  'testing': 'Тестування',
  'completed': 'Завершено',
  'released': 'Реліз',
  'release': 'Реліз',
  'open case study': 'Відкрити кейс',
  'view case': 'Відкрити кейс'
};

export const CATEGORY_TRANSLATIONS_EN_TO_UA: Record<string, string> = {
  'editorial / print design': 'Дизайн книжок / Друк',
  'editorial': 'Дизайн книжок / Друк',
  'print design': 'Дизайн книжок / Друк',
  'book design': 'Дизайн книжок / Друк',
  'book design / print': 'Дизайн книжок / Друк',
  'editorial & book design': 'Дизайн книжок / Друк',
  'advertising / social media': 'Реклама / Соціальні мережі',
  'advertising': 'Реклама / Соціальні мережі',
  'social media': 'Реклама / Соціальні мережі',
  'advertising and social media': 'Реклама / Соціальні мережі',
  '3d modeling': '3D Моделювання',
  '3d-render': '3D Моделювання',
  '3d renders': '3D Моделювання',
  '3d render': '3D Моделювання',
  '3d': '3D Моделювання',
  'identity & posters': 'Айдентика & Постери',
  'branding': 'Айдентика & Постери',
  'visual identity': 'Айдентика & Постери',
  'visual identity & posters': 'Айдентика & Постери',
  'identity': 'Айдентика & Постери',
  'posters': 'Айдентика & Постери',
  'ui/ux / web design': 'UI/UX / Web Design',
  'ui/ux product': 'UI/UX / Web Design',
  'ui/ux': 'UI/UX / Web Design',
  'web design': 'UI/UX / Web Design',
  'ui/ux design': 'UI/UX / Web Design',
  'all disciplines': 'Всі напрямки',
  'all': 'Всі напрямки'
};

/**
 * Resolves a category string into a normalized ID and guaranteed bilingual { ua, en } labels
 */
export function getBilingualCategory(rawUa?: string | null, rawEn?: string | null): { id: string; ua: string; en: string } {
  const uaCandidate = String(rawUa || '').trim();
  const enCandidate = String(rawEn || '').trim();
  const primary = uaCandidate || enCandidate;
  if (!primary) {
    return { id: 'all', ua: 'Всі напрямки', en: 'All disciplines' };
  }
  const lower = primary.toLowerCase().trim();

  // 1. UI/UX
  if (lower.includes('ui/ux') || lower.includes('ui-ux') || lower.includes('web design') || lower.includes('продукт') || lower.includes('product') || lower.includes('інтерфейс')) {
    return {
      id: 'ui-ux',
      ua: 'UI/UX / Web Design',
      en: 'UI/UX / Web Design'
    };
  }

  // 2. Identity & Posters / Branding
  if (lower.includes('айдентик') || lower.includes('постер') || lower.includes('brand') || lower.includes('identity') || lower.includes('poster')) {
    return {
      id: 'branding',
      ua: 'Айдентика & Постери',
      en: 'Identity & Posters'
    };
  }

  // 3. Editorial & Book Design / Print
  if (lower.includes('книг') || lower.includes('book') || lower.includes('верстк') || lower.includes('editorial') || lower.includes('print')) {
    return {
      id: 'book-design',
      ua: 'Дизайн книжок / Друк',
      en: 'Book Design / Print'
    };
  }

  // 4. Advertising & Social Media
  if (lower.includes('реклам') || lower.includes('соціал') || lower.includes('advertis') || lower.includes('social')) {
    return {
      id: 'advertising',
      ua: 'Реклама / Соціальні мережі',
      en: 'Advertising / Social Media'
    };
  }

  // 5. 3D Modeling / Render
  if (lower.includes('3d') || lower.includes('моделюван') || lower.includes('рендер') || lower.includes('render')) {
    return {
      id: '3d-render',
      ua: '3D Моделювання',
      en: '3D Modeling'
    };
  }

  // Reverse translation if in English
  if (!hasCyrillic(primary)) {
    const uaMapped = CATEGORY_TRANSLATIONS_EN_TO_UA[lower];
    if (uaMapped) {
      return {
        id: lower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'custom',
        ua: uaMapped,
        en: enCandidate || primary
      };
    }
  }

  // Forward translation if in Ukrainian
  if (hasCyrillic(primary)) {
    return {
      id: lower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'custom',
      ua: primary,
      en: enCandidate && !hasCyrillic(enCandidate) ? enCandidate : translateToEnglishIfNeeded(primary)
    };
  }

  return {
    id: lower.replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'custom',
    ua: primary,
    en: enCandidate || primary
  };
}

/**
 * Given raw status input in either Ukrainian or English (or both),
 * returns guaranteed bilingual status object { ua, en } with accurate translations.
 */
export function getBilingualStatus(rawUa?: string | null, rawEn?: string | null): { ua: string; en: string } {
  const uaCandidate = String(rawUa || '').trim();
  const enCandidate = String(rawEn || '').trim();

  // If both provided and valid
  if (uaCandidate && enCandidate && hasCyrillic(uaCandidate) && !hasCyrillic(enCandidate)) {
    return { ua: uaCandidate, en: enCandidate };
  }

  const primary = uaCandidate || enCandidate;
  if (!primary) {
    return { ua: 'Реалізовані (Продакшн)', en: 'Live (Production)' };
  }

  const lower = primary.toLowerCase();

  // 1. Concept checks
  if (
    lower.includes('concept') ||
    lower.includes('концепт') ||
    lower.includes('r&d') ||
    lower.includes('rnd')
  ) {
    return { ua: 'Концепт', en: 'Concept' };
  }

  // 2. Realized / Production checks
  if (
    lower.includes('realiz') ||
    lower.includes('prod') ||
    lower.includes('live') ||
    lower.includes('продакшн') ||
    lower.includes('реаліз') ||
    lower.includes('реліз') ||
    lower.includes('release')
  ) {
    return { ua: 'Реалізовані (Продакшн)', en: 'Live (Production)' };
  }

  // 3. Reverse lookup if input is in English
  if (!hasCyrillic(primary)) {
    const uaMapped = STATUS_TRANSLATIONS_EN_TO_UA[lower];
    if (uaMapped) {
      return { ua: uaMapped, en: enCandidate || primary };
    }
  }

  // 4. Forward lookup from COMMON_TRANSLATIONS if input is in Ukrainian
  const enMapped = COMMON_TRANSLATIONS[lower];
  if (enMapped) {
    return { ua: uaCandidate || primary, en: enMapped };
  }

  // 5. Fallback heuristics
  if (hasCyrillic(primary)) {
    return {
      ua: primary,
      en: enCandidate && !hasCyrillic(enCandidate) ? enCandidate : translateToEnglishIfNeeded(primary)
    };
  }

  return {
    ua: STATUS_TRANSLATIONS_EN_TO_UA[lower] || primary,
    en: primary
  };
}

/**
 * Normalizes text and attempts dictionary translation if English string is missing or corrupted with Cyrillic
 */
export function translateToEnglishIfNeeded(uaText: string, enCandidate?: string, fallbackEn: string = ''): string {
  if (enCandidate && enCandidate.trim() !== '' && !hasCyrillic(enCandidate)) {
    return enCandidate.trim();
  }

  const cleanUa = (uaText || '').trim().toLowerCase();
  if (COMMON_TRANSLATIONS[cleanUa]) {
    return COMMON_TRANSLATIONS[cleanUa];
  }

  // Check if candidate itself is a lowercase match
  const cleanEn = (enCandidate || '').trim().toLowerCase();
  if (COMMON_TRANSLATIONS[cleanEn]) {
    return COMMON_TRANSLATIONS[cleanEn];
  }

  if (fallbackEn && fallbackEn.trim() !== '' && !hasCyrillic(fallbackEn)) {
    return fallbackEn.trim();
  }

  return (enCandidate && enCandidate.trim() !== '') ? enCandidate.trim() : (fallbackEn || uaText || '');
}

/**
 * Safely resolves localized text based on the active language.
 * Guarantees that when `language === 'en'`, Cyrillic strings are replaced with clean English translations or fallbacks.
 */
export function getLocalizedText(
  localized: { ua?: string; en?: string } | string | undefined | null,
  language: Language,
  fallback: { ua: string; en: string } = { ua: '', en: '' }
): string {
  if (!localized) {
    return fallback[language];
  }

  if (typeof localized === 'string') {
    if (language === 'ua') return localized.trim() || fallback.ua;
    return translateToEnglishIfNeeded(localized, undefined, fallback.en);
  }

  if (language === 'ua') {
    return (localized.ua && localized.ua.trim() !== '') ? localized.ua.trim() : fallback.ua;
  }

  // English requested
  const enVal = localized.en;
  const uaVal = localized.ua || '';
  return translateToEnglishIfNeeded(uaVal, enVal, fallback.en);
}

/**
 * Safely resolves localized string arrays (e.g. descriptions, heuristics).
 */
export function getLocalizedArray(
  localized: { ua?: string[]; en?: string[] } | string[] | undefined | null,
  language: Language,
  fallback: { ua: string[]; en: string[] }
): string[] {
  if (!localized) {
    return fallback[language];
  }

  if (Array.isArray(localized)) {
    if (language === 'ua') return localized;
    return localized.map(item => translateToEnglishIfNeeded(item, undefined, item));
  }

  if (language === 'ua') {
    return localized.ua && localized.ua.length > 0 ? localized.ua : fallback.ua;
  }

  if (localized.en && localized.en.length > 0) {
    const allCyrillic = localized.en.every(item => hasCyrillic(item));
    if (!allCyrillic) {
      return localized.en;
    }
  }

  return fallback.en;
}
