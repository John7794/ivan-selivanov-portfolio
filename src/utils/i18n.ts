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
  'дослідити кейси': 'Explore Portfolio',
  'каскад': 'Masonry',
  'сітка': 'Grid',
  'всі напрямки': 'All Disciplines',
  'ui/ux продукт': 'UI/UX Product',
  '3d рендери': '3D Renders',
  'книжковий дизайн': 'Book Design',
  'айдентика & постери': 'Identity & Posters',
  'всі статуси': 'All',
  'реалізовані (продакшн)': 'Production',
  'концепти & r&d': 'Concept',

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
  fallback: { ua: string; en: string }
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
