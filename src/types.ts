export type Language = 'ua' | 'en';

export type ProjectCategory = string;
export type ProjectStatus = string;

export interface FilterOption {
  id: string;
  ua: string;
  en: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string | {
    ua: string;
    en: string;
  };
  title_ua?: string;
  title_en?: string;
  category: string;
  categoryLabel: {
    ua: string;
    en: string;
  };
  status: string;
  statusLabel?: {
    ua: string;
    en: string;
  };
  statusBadgeLabel?: {
    ua: string;
    en: string;
  };
  client?: string | {
    ua: string;
    en: string;
  };
  client_ua?: string;
  client_en?: string;
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
  toolsUsed: string[];
  designSystem: {
    fonts: string[] | { ua: string[]; en: string[] };
    fontsDescription?: { ua: string; en: string };
    colors: { name: string | { ua: string; en: string }; hex: string }[];
    colorsDescription?: { ua: string; en: string };
    gridType?: string;
  };
  thumbnailUrl: string;
  mobileThumbnailUrl?: string;
  mobilePreviewUrl?: string;
  galleryUrls: string[];
  mobileGalleryUrls?: string[];
  liveLink?: string;
  figmaUrl?: string;
  figmaEmbedUrl?: string;
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

export interface WorkflowStep {
  id: string;
  stepNumber: string;
  title: {
    ua: string;
    en: string;
  };
  description: {
    ua: string;
    en: string;
  };
  deliverables?: {
    ua: string[];
    en: string[];
  };
  tools?: string[];
  highlightTool?: string;
}

export interface FAQItem {
  id: string;
  question: {
    ua: string;
    en: string;
  };
  answer: {
    ua: string;
    en: string;
  };
  category?: {
    ua: string;
    en: string;
  };
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
  menu?: {
    systemTitle?: { ua: string; en: string };
    item1Title?: { ua: string; en: string };
    item1Desc?: { ua: string; en: string };
    item2Title?: { ua: string; en: string };
    item2Desc?: { ua: string; en: string };
    item3Title?: { ua: string; en: string };
    item3Desc?: { ua: string; en: string };
    item4Title?: { ua: string; en: string };
    item4Desc?: { ua: string; en: string };
    contactsTitle?: { ua: string; en: string };
    copyBtn?: { ua: string; en: string };
    copiedBtn?: { ua: string; en: string };
  };
  ui?: {
    heroCta?: { ua: string; en: string };
    workIndex?: { ua: string; en: string };
    workTitle?: { ua: string; en: string };
    layoutCascade?: { ua: string; en: string };
    layoutGrid?: { ua: string; en: string };
    filterCategoryLabel?: { ua: string; en: string };
    filterCategoryAll?: { ua: string; en: string };
    filterStatusLabel?: { ua: string; en: string };
    filterStatusAll?: { ua: string; en: string };
    expertiseIndex?: { ua: string; en: string };
    quoteText?: { ua: string; en: string };
    quoteAuthor?: { ua: string; en: string };
    experienceIndex?: { ua: string; en: string };
    experienceTitle?: { ua: string; en: string };
    experienceSubtitle?: { ua: string; en: string };
    contactHeading?: { ua: string; en: string };
    contactCta?: { ua: string; en: string };
    contactEmailLabel?: { ua: string; en: string };
    contactSocialLabel?: { ua: string; en: string };
    contactLocationLabel?: { ua: string; en: string };
    // Portfolio & Case Study Modal UI strings
    modalCaseStudy?: { ua: string; en: string };
    modalPrev?: { ua: string; en: string };
    modalNext?: { ua: string; en: string };
    modalClose?: { ua: string; en: string };
    modalLive?: { ua: string; en: string };
    modalRole?: { ua: string; en: string };
    modalTimeline?: { ua: string; en: string };
    modalCategory?: { ua: string; en: string };
    modalDeliverables?: { ua: string; en: string };
    modalInteractiveExperience?: { ua: string; en: string };
    modalMaxSpace?: { ua: string; en: string };
    modalFitFrame?: { ua: string; en: string };
    modalFullscreen?: { ua: string; en: string };
    modalOverview?: { ua: string; en: string };
    modalChallenge?: { ua: string; en: string };
    modalSolution?: { ua: string; en: string };
    modalImpact?: { ua: string; en: string };
    modalDesignSystem?: { ua: string; en: string };
    modalFonts?: { ua: string; en: string };
    modalColors?: { ua: string; en: string };
    modalGrid?: { ua: string; en: string };
    modalTools?: { ua: string; en: string };
    modalClientReview?: { ua: string; en: string };
    modalVisitLive?: { ua: string; en: string };
    modalCopied?: { ua: string; en: string };
    modalArtifacts?: { ua: string; en: string };
    // Card & Badge UI strings
    badgeFeatured?: { ua: string; en: string };
    badgeConcept?: { ua: string; en: string };
    badgeProduction?: { ua: string; en: string };
    cardViewCase?: { ua: string; en: string };
    // Workflow Section UI strings
    workflowIndex?: { ua: string; en: string };
    workflowTitle?: { ua: string; en: string };
    workflowSubtitle?: { ua: string; en: string };
    workflowDeliverablesLabel?: { ua: string; en: string };
    workflowToolsLabel?: { ua: string; en: string };
    // FAQ Section UI strings
    faqIndex?: { ua: string; en: string };
    faqTitle?: { ua: string; en: string };
    faqSubtitle?: { ua: string; en: string };
    faqContactPrompt?: { ua: string; en: string };
    faqContactCta?: { ua: string; en: string };
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
    badge?: { ua: string; en: string };
    configureBtn?: { ua: string; en: string };
    collapseBtn?: { ua: string; en: string };
    essentialTitle?: { ua: string; en: string };
    essentialDesc?: { ua: string; en: string };
    essentialStorage?: { ua: string; en: string };
    functionalTitle?: { ua: string; en: string };
    functionalDesc?: { ua: string; en: string };
    functionalStorage?: { ua: string; en: string };
    analyticsLabel: { ua: string; en: string };
    analyticsDesc: { ua: string; en: string };
    analyticsStorage?: { ua: string; en: string };
    preferencesLabel: { ua: string; en: string };
    preferencesDesc: { ua: string; en: string };
    personalizationTitle?: { ua: string; en: string };
    personalizationDesc?: { ua: string; en: string };
    personalizationStorage?: { ua: string; en: string };
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

export interface ContactsData {
  email: string;
  telegram: string;
  linkedin: string;
  behance?: string;
  github?: string;
  phone?: string;
  address?: { ua: string; en: string };
  location?: { ua: string; en: string };
}

