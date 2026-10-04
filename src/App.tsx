/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, SlidersHorizontal, Sparkles, Filter, Columns3, LayoutGrid } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, Language, FilterOption } from './types';
import { getStoredData, PortfolioData, syncWithGoogleSheets } from './services/googleSheets';
import { DEFAULT_SETTINGS } from './data/defaultData';
import { getLocalizedText, getBilingualStatus } from './utils/i18n';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { CaseStudyModal } from './components/CaseStudyModal';
import { BentoExpertise } from './components/BentoExpertise';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { SheetsSyncModal } from './components/SheetsSyncModal';
import { WorkflowSection } from './components/WorkflowSection';
import { FAQSection } from './components/FAQSection';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => getStoredData());
  const [language, setLanguage] = useState<Language>('ua');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [layoutMode, setLayoutMode] = useState<'bento-masonry' | 'bento-grid'>('bento-grid');
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(false);

  // Interactive subtle grid spotlight on mouse move
  const [heroMousePos, setHeroMousePos] = useState({ x: -1000, y: -1000 });
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeroMousePos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
    if (!isHeroHovered) setIsHeroHovered(true);
  };

  const handleHeroMouseLeave = () => {
    setIsHeroHovered(false);
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Background sync on load if URL is saved
  useEffect(() => {
    const url = data.settings.appsScriptUrl || localStorage.getItem('ivan_portfolio_sheets_url');
    if (url && url.startsWith('http')) {
      syncWithGoogleSheets(url)
        .then(fresh => setData(fresh))
        .catch(err => console.warn('Background Sheets sync skipped:', err));
    }
  }, []);

  // Listen for URL hash changes like #privacy, #terms, or #sheets
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#privacy' || hash === '#privacypolicy' || hash === '#privacy-policy') {
        setLegalDoc('privacy');
      } else if (hash === '#terms' || hash === '#terms-of-use' || hash === '#termsofuse' || hash === '#conditions') {
        setLegalDoc('terms');
      } else if (hash === '#cookies' || hash === '#cookie') {
        setIsCookieBannerOpen(true);
      } else if (hash === '#sheets' || hash === '#admin' || hash === '#sync') {
        setIsSheetsModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Keyboard shortcut (Esc for closing project modal, Ctrl+Shift+S for sheets management)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        if (activeProject) setActiveProject(null);
      } else if ((e.key === 'S' || e.key === 's') && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setIsSheetsModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  // Smooth scroll to Work section with fixed navbar offset
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const workSection = document.getElementById('work');
    if (workSection) {
      const navOffset = 76;
      const elementPosition = workSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  // Dynamic Categories derived directly from Google Sheets Projects & custom tabs
  const categoryLabels = useMemo(() => {
    const ui = data.settings.ui;
    const allCatUa = ui?.filterCategoryAll?.ua || 'Всі напрямки';
    const allCatEn = ui?.filterCategoryAll?.en || 'All disciplines';
    const list: FilterOption[] = [
      { id: 'all', ua: allCatUa, en: allCatEn }
    ];

    const getCanonicalId = (idOrName: string): string => {
      const lower = idOrName.toLowerCase().replace(/[\s\-_/\\&()]+/g, '');
      if (lower.includes('brand') || lower.includes('ident') || lower.includes('айдент') || lower.includes('постер')) return 'branding';
      if (lower.includes('ui') || lower.includes('webdesign') || lower.includes('інтерфейс') || lower.includes('продукт')) return 'ui-ux';
      if (lower.includes('book') || lower.includes('editorial') || lower.includes('print') || lower.includes('книг') || lower.includes('друк')) return 'book-design';
      if (lower.includes('advertis') || lower.includes('social') || lower.includes('реклам') || lower.includes('соціал')) return 'advertising';
      if (lower.includes('3d') || lower.includes('render') || lower.includes('моделюван')) return '3d-render';
      return idOrName.toLowerCase().trim().replace(/[^\w\dа-яіїєґ]+/gi, '-').replace(/^-+|-+$/g, '') || 'custom';
    };

    const normalizeLabel = (str: string | undefined) => (str || '').toLowerCase().trim().replace(/[\s\-_/\\&()]+/g, '');

    // Canonical default names from UI settings or defaults
    const canonicalDefs: Record<string, { ua: string; en: string }> = {
      'branding': ui?.filterCategoryIdentity || { ua: 'Айдентика & Постери', en: 'Identity & Posters' },
      'ui-ux': ui?.filterCategoryUiux || { ua: 'UI/UX / Web Design', en: 'UI/UX / Web Design' },
      'book-design': ui?.filterCategoryPrint || { ua: 'Editorial / Print Design', en: 'Editorial / Print Design' },
      'advertising': ui?.filterCategoryAds || { ua: 'Advertising / Social Media', en: 'Advertising / Social Media' },
      '3d-render': ui?.filterCategory3d || { ua: '3D Modeling', en: '3D Modeling' },
    };

    const addOrUpdateOption = (rawId: string, ua: string, en: string) => {
      const canonId = getCanonicalId(rawId);
      const def = canonicalDefs[canonId];
      const finalUa = def?.ua || ua;
      const finalEn = def?.en || en;

      const normUa = normalizeLabel(finalUa);
      const normEn = normalizeLabel(finalEn);

      // Check if already in list by canonical id OR by matching label
      const existingIdx = list.findIndex(item => 
        item.id === canonId || 
        normalizeLabel(item.ua) === normUa || 
        normalizeLabel(item.en) === normEn
      );

      if (existingIdx >= 0) {
        // Keep canonical id and update labels if this is a standard category
        if (def) {
          list[existingIdx].id = canonId;
          list[existingIdx].ua = def.ua;
          list[existingIdx].en = def.en;
        }
      } else {
        list.push({
          id: canonId,
          ua: finalUa,
          en: finalEn
        });
      }
    };

    // 1. Explicit categories sheet if provided
    if (data.categories && data.categories.length > 0) {
      data.categories.forEach(cat => {
        addOrUpdateOption(cat.id, cat.ua, cat.en);
      });
    }

    // 2. Scan every project from table
    data.projects.forEach(p => {
      if (p.category) {
        addOrUpdateOption(p.category, p.categoryLabel?.ua || p.category, p.categoryLabel?.en || p.category);
      }
    });

    // 3. Guarantee standard 5 categories are present once
    Object.keys(canonicalDefs).forEach(canonId => {
      const def = canonicalDefs[canonId];
      addOrUpdateOption(canonId, def.ua, def.en);
    });

    return list;
  }, [data.projects, data.categories, data.settings.ui]);

  // Dynamic Statuses derived directly from Google Sheets Projects & custom tabs
  const statusLabels = useMemo(() => {
    const allStatUa = data.settings.ui?.filterStatusAll?.ua || 'Всі статуси';
    const allStatEn = data.settings.ui?.filterStatusAll?.en || 'All statuses';
    const list: FilterOption[] = [
      { id: 'all', ua: allStatUa, en: allStatEn }
    ];

    // 1. If explicit statuses sheet was provided
    if (data.statuses && data.statuses.length > 0) {
      data.statuses.forEach(st => {
        const cleanId = String(st.id || '').toLowerCase().trim();
        if (cleanId === 'all' || cleanId === 'всі') {
          list[0].ua = st.ua;
          list[0].en = st.en;
        } else {
          const existingIdx = list.findIndex(item => item.id === st.id);
          const bilingual = getBilingualStatus(st.ua, st.en);
          if (existingIdx !== -1) {
            list[existingIdx] = { id: st.id, ua: bilingual.ua, en: bilingual.en };
          } else {
            list.push({ id: st.id, ua: bilingual.ua, en: bilingual.en });
          }
        }
      });
    }

    // 2. Scan every project from table to guarantee all existing statuses are present
    const seenStatusIds = new Set(list.map(s => s.id));
    data.projects.forEach(p => {
      const rawLower = String(p.status || '').toLowerCase().trim();
      const isConcept = rawLower === 'concept' || rawLower.includes('concept') || rawLower.includes('концепт') || rawLower.includes('r&d') || rawLower.includes('rnd');
      const isRealized = rawLower === 'realized' || rawLower.includes('realiz') || rawLower.includes('prod') || rawLower.includes('live') || rawLower.includes('продакшн') || rawLower.includes('реліз');

      const stId = isConcept ? 'concept' : isRealized ? 'realized' : (p.status || 'status');

      if (stId && !seenStatusIds.has(stId)) {
        seenStatusIds.add(stId);
        const hasCustomLabel = p.statusLabel && typeof p.statusLabel === 'object' && (p.statusLabel.ua || p.statusLabel.en);
        const uaDefault = hasCustomLabel
          ? (p.statusLabel.ua || p.statusLabel.en)
          : isRealized 
          ? (data.settings.ui?.filterStatusProduction?.ua || 'Реалізовані (Продакшн)') 
          : isConcept 
          ? (data.settings.ui?.filterStatusConceptual?.ua || 'Концепт') 
          : stId;
        const enDefault = hasCustomLabel
          ? (p.statusLabel.en || p.statusLabel.ua)
          : isRealized 
          ? (data.settings.ui?.filterStatusProduction?.en || 'Live (Production)') 
          : isConcept 
          ? (data.settings.ui?.filterStatusConceptual?.en || 'Concept') 
          : stId;
        const bilingual = getBilingualStatus(uaDefault, enDefault);
        list.push({
          id: stId,
          ua: bilingual.ua,
          en: bilingual.en
        });
      }
    });

    // 3. Fallback defaults if empty
    if (list.length === 1) {
      list.push(
        { 
          id: 'concept', 
          ua: data.settings.ui?.filterStatusConceptual?.ua || 'Концепт', 
          en: data.settings.ui?.filterStatusConceptual?.en || 'Concept' 
        },
        { 
          id: 'realized', 
          ua: data.settings.ui?.filterStatusProduction?.ua || 'Реалізовані (Продакшн)', 
          en: data.settings.ui?.filterStatusProduction?.en || 'Live (Production)' 
        }
      );
    } else {
      // Sync UI settings translations to default concept/realized options if not overridden by explicit statuses tab
      const hasExplicitConcept = data.statuses?.some(s => s.id === 'concept');
      const hasExplicitRealized = data.statuses?.some(s => s.id === 'realized');

      if (!hasExplicitConcept && data.settings.ui?.filterStatusConceptual) {
        const cIdx = list.findIndex(s => s.id === 'concept');
        if (cIdx !== -1) {
          list[cIdx].ua = data.settings.ui.filterStatusConceptual.ua;
          list[cIdx].en = data.settings.ui.filterStatusConceptual.en;
        }
      }
      if (!hasExplicitRealized && data.settings.ui?.filterStatusProduction) {
        const rIdx = list.findIndex(s => s.id === 'realized');
        if (rIdx !== -1) {
          list[rIdx].ua = data.settings.ui.filterStatusProduction.ua;
          list[rIdx].en = data.settings.ui.filterStatusProduction.en;
        }
      }
    }

    return list;
  }, [data.projects, data.statuses, data.settings.ui]);

  // Auto-reset filter if active selection is no longer present
  useEffect(() => {
    if (selectedCategory !== 'all' && !categoryLabels.some(c => c.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categoryLabels, selectedCategory]);

  useEffect(() => {
    if (selectedStatus !== 'all' && !statusLabels.some(s => s.id === selectedStatus)) {
      setSelectedStatus('all');
    }
  }, [statusLabels, selectedStatus]);

  // Filter projects based on Category & Status with resilient fuzzy matching
  const filteredProjects = useMemo(() => {
    const normalize = (str: string | undefined) => {
      if (!str) return '';
      return str.toLowerCase().trim().replace(/[\s\-_/\\&()]+/g, '');
    };

    return data.projects.filter(p => {
      // Category match
      let matchesCategory = selectedCategory === 'all';
      if (!matchesCategory) {
        const normSelected = normalize(selectedCategory);
        const normCat = normalize(p.category);
        const normUa = normalize(p.categoryLabel?.ua);
        const normEn = normalize(p.categoryLabel?.en);
        matchesCategory = normCat === normSelected || 
                          normUa === normSelected || 
                          normEn === normSelected ||
                          (normSelected.includes('ui') && (normCat.includes('ui') || normUa.includes('ui') || normEn.includes('ui'))) ||
                          (normSelected.includes('3d') && (normCat.includes('3d') || normUa.includes('3d') || normEn.includes('3d'))) ||
                          (normSelected.includes('book') && (normCat.includes('book') || normCat.includes('editorial') || normCat.includes('print') || normUa.includes('книг') || normUa.includes('друк'))) ||
                          ((normSelected.includes('advertis') || normSelected.includes('social') || normSelected.includes('ads')) && (normCat.includes('advertis') || normCat.includes('social') || normCat.includes('ads') || normUa.includes('реклам') || normUa.includes('соціал'))) ||
                          (normSelected.includes('brand') && (normCat.includes('brand') || normCat.includes('ident') || normUa.includes('айдент') || normUa.includes('постер')));
      }

      // Status match
      let matchesStatus = selectedStatus === 'all';
      if (!matchesStatus) {
        const normSelected = normalize(selectedStatus);
        const normStatus = normalize(p.status);
        const normUa = normalize(p.statusLabel?.ua);
        const normEn = normalize(p.statusLabel?.en);
        const normBadgeUa = normalize(typeof p.statusBadgeLabel === 'object' ? p.statusBadgeLabel?.ua : p.statusBadgeLabel);
        const normBadgeEn = normalize(typeof p.statusBadgeLabel === 'object' ? p.statusBadgeLabel?.en : p.statusBadgeLabel);
        matchesStatus = normStatus === normSelected || 
                        normUa === normSelected || 
                        normEn === normSelected ||
                        normBadgeUa === normSelected ||
                        normBadgeEn === normSelected ||
                        ((normSelected.includes('realiz') || normSelected.includes('prod') || normSelected.includes('live') || normSelected.includes('продакшн')) && 
                         (normStatus.includes('realiz') || normStatus.includes('prod') || normStatus.includes('live') || normUa.includes('продакшн') || normEn.includes('production') || normEn.includes('live') || normBadgeUa.includes('продакшн') || normBadgeEn.includes('prod'))) ||
                        ((normSelected.includes('concept') || normSelected.includes('концепт')) && 
                         (normStatus.includes('concept') || normUa.includes('концепт') || normEn.includes('concept') || normBadgeUa.includes('концепт') || normBadgeEn.includes('concept')));
      }

      return matchesCategory && matchesStatus;
    });
  }, [data.projects, selectedCategory, selectedStatus]);

  const featuredIndices = useMemo(() => {
    const map = new Map<string, number>();
    let count = 0;
    filteredProjects.forEach(p => {
      if (p.isFeatured) {
        map.set(p.id, count++);
      }
    });
    return map;
  }, [filteredProjects]);

  const activeTestimonial = activeProject?.testimonialId
    ? data.testimonials.find(t => t.id === activeProject.testimonialId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f0] font-sans selection:bg-[#f4f4f0] selection:text-[#0a0a0a] relative">
      {/* Top Announcement Banner (synced with Google Sheets Legal_And_Banners tab) */}
      <AnnouncementBanner
        bannerData={data.legalAndBanners?.announcementBanner}
        language={language}
      />

      {/* Global Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        name={getLocalizedText(data.settings.name, language, DEFAULT_SETTINGS.name)}
        settings={data.settings}
        contacts={data.contacts}
        onOpenLegal={(doc) => setLegalDoc(doc)}
        onOpenCookies={() => setIsCookieBannerOpen(true)}
        onCloseModal={() => setActiveProject(null)}
      />

      {/* Hero Section with Interactive Ambient Grid */}
      <section 
        ref={heroRef} 
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full flex flex-col px-4 sm:px-6 lg:px-12 pt-[76px] sm:pt-[82px] lg:pt-[88px] pb-8 sm:pb-12 lg:pb-20"
      >
        {/* Subtle background ambient line structure - hidden on mobile to eliminate harsh background grid frames */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          {/* Base ambient grid - softened to 0.08 */}
          <div
            className="w-full h-full opacity-[0.08]"
            style={{
              backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)',
              backgroundSize: '5rem 5rem'
            }}
          />

          {/* Interactive illuminated grid layer with softened radial spotlight */}
          <div
            className="w-full h-full absolute inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              opacity: isHeroHovered ? 0.6 : 0,
              backgroundImage: 'linear-gradient(#444444 1px, transparent 1px), linear-gradient(90deg, #444444 1px, transparent 1px)',
              backgroundSize: '5rem 5rem',
              maskImage: `radial-gradient(350px circle at ${heroMousePos.x}px ${heroMousePos.y}px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)`,
              WebkitMaskImage: `radial-gradient(350px circle at ${heroMousePos.x}px ${heroMousePos.y}px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)`,
            }}
          />

          {/* Soft ambient halo around cursor */}
          <div
            className="w-full h-full absolute inset-0 transition-opacity duration-500 pointer-events-none"
            style={{
              opacity: isHeroHovered ? 0.2 : 0,
              background: `radial-gradient(420px circle at ${heroMousePos.x}px ${heroMousePos.y}px, rgba(255, 255, 255, 0.02), transparent 75%)`
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full max-w-[1600px] mx-auto relative pt-1 sm:pt-2 lg:pt-3"
        >
          {/* Status badge */}
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-emerald-400 font-semibold shrink-0">
              {getLocalizedText(data.settings.heroTag, language, DEFAULT_SETTINGS.heroTag || { ua: 'Готовий до співпраці', en: 'Available for work' })}
            </span>
            {Boolean(getLocalizedText(data.settings.title, language).trim()) && (
              <>
                <span className="text-neutral-700 hidden sm:inline">|</span>
                <span className="text-neutral-400 text-[10px] sm:text-xs">
                  {getLocalizedText(data.settings.title, language)}
                </span>
              </>
            )}
            {Boolean(getLocalizedText(data.settings.location, language).trim()) && (
              <>
                <span className="text-neutral-700 hidden sm:inline">|</span>
                <span className="hidden sm:inline text-neutral-500">
                  {getLocalizedText(data.settings.location, language)}
                </span>
              </>
            )}
          </div>

          <div className="relative">
            {/* Main Monumental Heading: SEL & OV crisp architectural outline, IVAN solid fill with bespoke optical kerning */}
            <h1 
              aria-label="SELIVANOV"
              className="hero-monument-title text-[18vw] xs:text-[17vw] sm:text-[14.5vw] md:text-[12.5vw] lg:text-[11vw] xl:text-[12vw] leading-[0.84] font-black tracking-tighter uppercase select-none pointer-events-none flex flex-col items-start shrink-0 mb-6 lg:mb-12"
            >
              <span className="text-stroke-outline">
                SEL
              </span>
              <span className="inline-flex items-baseline">
                <span className="text-[#f4f4f0] inline-flex items-baseline">
                  <span>I</span>
                  <span>V</span>
                  <span className="-ml-[0.048em]">A</span>
                  <span className="-ml-[0.015em]">N</span>
                </span>
                <span className="text-stroke-outline inline-flex items-baseline">
                  <span>O</span>
                  <span className="-ml-[0.02em]">V</span>
                </span>
              </span>
            </h1>

            {/* Bio & CTA Row */}
            <div className="flex flex-col items-start gap-6 sm:gap-8 pt-4 sm:pt-8 w-full lg:w-[calc(100%-380px-2rem)] xl:w-[calc(100%-480px-2rem)] relative z-20 pointer-events-none">
              {/* Animated Line with Continuous Soft Ambient Sheen - hidden on mobile to avoid dividing box lines */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="hidden sm:block absolute top-0 left-0 h-[1px] bg-neutral-800/80 origin-left w-full overflow-hidden"
              >
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "400%" }}
                  transition={{ 
                    duration: 3.5, 
                    ease: "linear", 
                    repeat: Infinity, 
                    repeatDelay: 0 
                  }}
                  className="w-1/4 h-full absolute top-0 bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent opacity-50"
                />
              </motion.div>

              <p className="text-base sm:text-xl md:text-2xl max-w-xl font-light leading-relaxed sm:leading-snug text-neutral-300 pointer-events-auto min-h-[60px] sm:min-h-[84px] md:min-h-[100px]">
                {getLocalizedText(data.settings.bioShort, language, DEFAULT_SETTINGS.bioShort)}
              </p>

              <div className="flex items-center gap-6 pointer-events-auto mt-1 sm:mt-2 w-full sm:w-auto">
                <a
                  href="#work"
                  onClick={scrollToWork}
                  className="flex items-center justify-center gap-3 sm:gap-4 text-xs font-mono uppercase tracking-widest text-[#f4f4f0] bg-neutral-900/90 hover:bg-neutral-800 active:bg-neutral-950 px-6 py-3.5 sm:py-4 border border-neutral-800/80 hover:border-neutral-600 transition-all group cursor-pointer w-full sm:w-auto text-center"
                >
                  <span>{getLocalizedText(data.settings.ui?.heroCta, language, { ua: 'Дослідити кейси', en: 'Explore Portfolio' })}</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Hero Image (Absolute on Desktop to overlap bio, natural integrated portrait on mobile without harsh box frames) */}
            <motion.div 
              style={{ y: heroImageY }}
              className="mt-8 sm:mt-12 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-none lg:w-[380px] xl:w-[480px] group z-10 mx-auto lg:mx-0 relative"
            >
              <img 
                src={data.settings.heroImage || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"} 
                alt={data.settings.name[language]}
                className="w-full h-auto object-contain object-bottom filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Soft organic bottom vignette to seamlessly merge into the dark background, no harsh rectangular wireframes */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none opacity-60 lg:opacity-30" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Selected Work Section */}
      <section id="work" className="scroll-mt-20 pt-6 sm:pt-8 pb-20 sm:pb-24 px-3 sm:px-6 lg:px-12 bg-[#0a0a0a] text-[#f4f4f0] border-t border-neutral-900 relative">
        <div className="max-w-[1600px] mx-auto">
          {/* Sticky Section Header (Matches top navbar glassmorphism, blur, and bottom border effect) */}
          <div className="sticky top-[58px] sm:top-[73px] z-35 bg-[#0a0a0a]/85 backdrop-blur-md -mx-3 px-3 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12 pt-4 pb-4 mb-8 sm:mb-10 border-b border-neutral-900/90 transition-all">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
                    {getLocalizedText(data.settings.ui?.workIndex, language, { ua: '01 // INDEXED CASE STUDIES', en: '01 // INDEXED CASE STUDIES' })}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
                    {getLocalizedText(data.settings.ui?.workTitle, language, { ua: 'Вибрані Роботи', en: 'Selected Works' })}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Masonry vs Structured Grid View Toggle - hidden on mobile since both modes render single-column */}
                  <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 p-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('bento-masonry')}
                      title={getLocalizedText(data.settings.ui?.layoutCascade, language, { ua: 'Каскадний вигляд (Masonry)', en: 'Masonry View' })}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all ${
                        layoutMode === 'bento-masonry'
                          ? 'bg-[#f4f4f0] text-black font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Columns3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {getLocalizedText(data.settings.ui?.layoutCascade, language, { ua: 'Каскад', en: 'Masonry' })}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode('bento-grid')}
                      title={getLocalizedText(data.settings.ui?.layoutGrid, language, { ua: 'Модульна сітка (Grid)', en: 'Grid View' })}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all ${
                        layoutMode === 'bento-grid'
                          ? 'bg-[#f4f4f0] text-black font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {getLocalizedText(data.settings.ui?.layoutGrid, language, { ua: 'Сітка', en: 'Grid' })}
                      </span>
                    </button>
                  </div>

                  <span className="text-sm sm:text-base font-mono text-neutral-400 sm:border-l sm:border-neutral-800 sm:pl-4">
                    ( {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length} / {data.projects.length} )
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Axis Filter Bar: Category & Status */}
          <div className="mb-8 sm:mb-14 space-y-3 sm:space-y-4 font-mono text-xs">
            {/* Category Filter Axis */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-neutral-500 uppercase tracking-wider mr-2 hidden sm:inline">
                {getLocalizedText(data.settings.ui?.filterCategoryLabel, language, { ua: 'Напрямок:', en: 'Discipline:' })}
              </span>
              {categoryLabels.map((cat, catIdx) => (
                <button
                  key={`${cat.id || 'cat'}-${catIdx}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-white bg-[#f4f4f0] text-black font-semibold'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  {cat[language]}
                </button>
              ))}
            </div>

            {/* Status Filter Axis */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-neutral-900">
              <span className="text-neutral-500 uppercase tracking-wider mr-2 hidden sm:inline">
                {getLocalizedText(data.settings.ui?.filterStatusLabel, language, { ua: 'Статус:', en: 'Status:' })}
              </span>
              {statusLabels.map((st, stIdx) => (
                <button
                  key={`${st.id || 'st'}-${stIdx}`}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] border transition-all cursor-pointer ${
                    selectedStatus === st.id
                      ? 'border-neutral-400 bg-neutral-800 text-white font-medium'
                      : 'border-neutral-900 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                  }`}
                >
                  {st[language]}
                </button>
              ))}
            </div>
          </div>

          {/* Project List: Pinterest Bento Masonry or Bento Grid */}
          {filteredProjects.length > 0 ? (
            layoutMode === 'bento-masonry' ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 [column-fill:_balance]">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={`${project.id || 'project'}-${index}`}
                    project={project}
                    index={index}
                    featuredIndex={featuredIndices.get(project.id) ?? 0}
                    language={language}
                    onSelect={setActiveProject}
                    isBentoGrid={false}
                    ui={data.settings.ui}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [grid-auto-flow:_dense] gap-4 sm:gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={`${project.id || 'project'}-${index}`}
                    project={project}
                    index={index}
                    featuredIndex={featuredIndices.get(project.id) ?? 0}
                    language={language}
                    onSelect={setActiveProject}
                    isBentoGrid={true}
                    ui={data.settings.ui}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="py-20 text-center border border-neutral-900 bg-neutral-950/40 p-8 sm:p-12 text-neutral-400 font-mono text-sm space-y-4">
              <p>
                {language === 'ua'
                  ? 'За вибраними критеріями проєктів не знайдено.'
                  : 'No projects match the selected criteria.'}
              </p>
              {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-white bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors"
                >
                  <span>{language === 'ua' ? 'Скинути фільтри' : 'Reset filters'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Expertise & Architecture (Bento Grid) */}
      <BentoExpertise language={language} expertise={data.settings.expertise} ui={data.settings.ui} />

      {/* Experience Timeline */}
      <ExperienceTimeline experience={data.experience} language={language} ui={data.settings.ui} />

      {/* Workflow & Process Pipeline */}
      <WorkflowSection
        workflow={data.workflow}
        language={language}
        ui={data.settings.ui}
      />

      {/* Frequently Asked Questions */}
      <FAQSection
        faq={data.faq}
        language={language}
        ui={data.settings.ui}
        contactEmail={data.contacts?.email || data.settings?.email}
        telegram={data.contacts?.telegram || data.settings?.telegram}
      />

      {/* Massive Footer with legal modals trigger */}
      <Footer
        settings={data.settings}
        contacts={data.contacts}
        language={language}
        onOpenLegal={(doc) => setLegalDoc(doc)}
        onOpenCookies={() => setIsCookieBannerOpen(true)}
      />

      {/* Case Study Deep Modal */}
      <CaseStudyModal
        project={activeProject}
        allProjects={filteredProjects.length > 0 ? filteredProjects : data.projects}
        testimonial={activeTestimonial}
        language={language}
        ui={data.settings.ui}
        onClose={() => setActiveProject(null)}
        onSelectProject={setActiveProject}
      />

      {/* Legal Documents Modal ("Політика конфіденційності" & "Умови використання") */}
      <LegalModal
        isOpen={legalDoc !== null}
        onClose={() => {
          setLegalDoc(null);
          if (window.location.hash === '#privacy' || window.location.hash === '#terms') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        initialDoc={legalDoc || 'privacy'}
        language={language}
        legalData={data.legalAndBanners}
      />

      {/* Floating Back to Top Button */}
      <BackToTop language={language} />

      {/* Cookie & Compliance Banner with granular interactive toggles */}
      <CookieBanner
        language={language}
        cookieData={data.legalAndBanners?.cookieBanner}
        onOpenPrivacy={() => setLegalDoc('privacy')}
        isOpen={isCookieBannerOpen}
        isSuppressed={legalDoc !== null || activeProject !== null || isSheetsModalOpen}
        onClose={() => setIsCookieBannerOpen(false)}
      />

      {/* Google Sheets Sync & Legal_And_Banners Management Modal */}
      <SheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        language={language}
        portfolioData={data}
        onDataUpdated={(fresh) => setData(fresh)}
      />
    </div>
  );
}
