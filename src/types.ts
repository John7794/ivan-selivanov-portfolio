export type Language = 'ua' | 'en';

export type ProjectCategory = 'all' | 'ui-ux' | '3d-render' | 'book-design' | 'branding';
export type ProjectStatus = 'all' | 'realized' | 'concept';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'ui-ux' | '3d-render' | 'book-design' | 'branding';
  categoryLabel: {
    ua: string;
    en: string;
  };
  status: 'realized' | 'concept';
  role: {
    ua: string;
    en: string;
  };
  timeline: string;
  tagline: {
    ua: string;
    en: string;
  };
  description: {
    ua: string;
    en: string;
  };
  problemStatement: {
    ua: string;
    en: string;
  };
  solution: {
    ua: string;
    en: string;
  };
  businessImpact: {
    ua: string;
    en: string;
  };
  metrics?: {
    value: string;
    label: { ua: string; en: string };
  }[];
  toolsUsed: string[];
  designSystem: {
    fonts: string[];
    colors: { name: string; hex: string }[];
    gridType?: string;
  };
  thumbnailUrl: string;
  galleryUrls: string[];
  liveLink?: string;
  isFeatured: boolean;
  sortOrder: number;
  testimonialId?: string;
}

export interface ExperienceItem {
  id: string;
  type: 'commercial' | 'art-direction' | 'education';
  company: {
    ua: string;
    en: string;
  };
  location: {
    ua: string;
    en: string;
  };
  role: {
    ua: string;
    en: string;
  };
  period: {
    ua: string;
    en: string;
  };
  description: {
    ua: string[];
    en: string[];
  };
  technologies: string[];
}

export interface Testimonial {
  id: string;
  projectId: string;
  author: string;
  company: string;
  role: {
    ua: string;
    en: string;
  };
  text: {
    ua: string;
    en: string;
  };
  avatarUrl: string;
}

export interface GeneralSettings {
  name: {
    ua: string;
    en: string;
  };
  title: {
    ua: string;
    en: string;
  };
  bioShort: {
    ua: string;
    en: string;
  };
  heroTag?: {
    ua: string;
    en: string;
  };
  heroTagline?: {
    ua: string;
    en: string;
  };
  location: {
    ua: string;
    en: string;
  };
  email: string;
  telegram: string;
  linkedin: string;
  behance: string;
  github: string;
  heroImage?: string;
  googleSheetId?: string;
  appsScriptUrl?: string;
  lastSyncedAt?: string;
  expertise?: {
    heading: { ua: string; en: string };
    subtitle: { ua: string; en: string };
    card1Title: { ua: string; en: string };
    card1Desc: { ua: string; en: string };
    card2Title: { ua: string; en: string };
    card2Desc: { ua: string; en: string };
    card3Title: { ua: string; en: string };
    card3Desc: { ua: string; en: string };
    card4Title: { ua: string; en: string };
    card4Desc?: { ua: string; en: string };
    heuristics: { ua: string[]; en: string[] };
    techStackTitle: { ua: string; en: string };
    techStackItems: string[];
  };
}

export interface LegalSection {
  id?: string;
  title: {
    ua: string;
    en: string;
  };
  content: {
    ua: string;
    en: string;
  };
}

export interface LegalAndBannersData {
  cookieBanner: {
    title: { ua: string; en: string };
    description: { ua: string; en: string };
    analyticsLabel: { ua: string; en: string };
    analyticsDesc: { ua: string; en: string };
    preferencesLabel: { ua: string; en: string };
    preferencesDesc: { ua: string; en: string };
    acceptAll: { ua: string; en: string };
    onlyNecessary: { ua: string; en: string };
    savePreferences: { ua: string; en: string };
    policyLink: { ua: string; en: string };
  };
  privacyPolicy: {
    title: { ua: string; en: string };
    subtitle: { ua: string; en: string };
    lastUpdated: { ua: string; en: string };
    sections: LegalSection[];
    contactEmail: string;
    contactLocation: { ua: string; en: string };
  };
  termsOfUse: {
    title: { ua: string; en: string };
    subtitle: { ua: string; en: string };
    lastUpdated: { ua: string; en: string };
    sections: LegalSection[];
    contactEmail: string;
  };
  announcementBanner: {
    enabled: boolean;
    badge: { ua: string; en: string };
    text: { ua: string; en: string };
    link?: string;
  };
}
