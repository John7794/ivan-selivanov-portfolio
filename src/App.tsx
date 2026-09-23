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
import { getLocalizedText } from './utils/i18n';
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
import { AnimatedDivider } from './components/AnimatedDivider';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => getStoredData());
  const [language, setLanguage] = useState<Language>('ua');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [layoutMode, setLayoutMode] = useState<'bento-masonry' | 'bento-grid'>('bento-masonry');
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
    const list: FilterOption[] = [
      { id: 'all', ua: 'Всі напрямки', en: 'All Disciplines' }
    ];

    // 1. If explicit categories sheet was provided
    if (data.categories && data.categories.length > 0) {
      data.categories.forEach(cat => {
        if (!list.some(item => item.id === cat.id)) {
          list.push(cat);
        }
      });
    }

    // 2. Scan every project from table to guarantee all existing disciplines are present
    const seenCatIds = new Set(list.map(c => c.id));
    data.projects.forEach(p => {
      const catId = p.category;
      if (catId && !seenCatIds.has(catId)) {
        seenCatIds.add(catId);
        list.push({
          id: catId,
          ua: p.categoryLabel?.ua || catId,
          en: p.categoryLabel?.en || catId
        });
      }
    });

    // 3. Fallback defaults if no projects loaded yet
    if (list.length === 1) {
      list.push(
        { id: 'ui-ux', ua: 'UI/UX Продукт', en: 'UI/UX Product' },
        { id: '3d-render', ua: '3D Рендери', en: '3D Renders' },
        { id: 'book-design', ua: 'Книжковий дизайн', en: 'Book Design' },
        { id: 'branding', ua: 'Айдентика & Постери', en: 'Identity & Posters' }
      );
    }

    return list;
  }, [data.projects, data.categories]);

  // Dynamic Statuses derived directly from Google Sheets Projects & custom tabs
  const statusLabels = useMemo(() => {
    const list: FilterOption[] = [
      { id: 'all', ua: 'Всі статуси', en: 'All' }
    ];

    // 1. If explicit statuses sheet was provided
    if (data.statuses && data.statuses.length > 0) {
      data.statuses.forEach(st => {
        if (!list.some(item => item.id === st.id)) {
          list.push(st);
        }
      });
    }

    // 2. Scan every project from table to guarantee all existing statuses are present
    const seenStatusIds = new Set(list.map(s => s.id));
    data.projects.forEach(p => {
      const stId = p.status;
      if (stId && !seenStatusIds.has(stId)) {
        seenStatusIds.add(stId);
        const uaDefault = stId === 'realized' ? 'Реалізовані (Продакшн)' : stId === 'concept' ? 'Концепти & R&D' : stId;
        const enDefault = stId === 'realized' ? 'Production' : stId === 'concept' ? 'Concept & R&D' : stId;
        list.push({
          id: stId,
          ua: p.statusLabel?.ua || uaDefault,
          en: p.statusLabel?.en || enDefault
        });
      }
    });

    // 3. Fallback defaults
    if (list.length === 1) {
      list.push(
        { id: 'realized', ua: 'Реалізовані (Продакшн)', en: 'Production' },
        { id: 'concept', ua: 'Концепти & R&D', en: 'Concept & R&D' }
      );
    }

    return list;
  }, [data.projects, data.statuses]);

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
                          (normSelected.includes('ui') && normCat.includes('ui')) ||
                          (normSelected.includes('3d') && normCat.includes('3d')) ||
                          (normSelected.includes('book') && (normCat.includes('book') || normUa.includes('книг'))) ||
                          (normSelected.includes('brand') && (normCat.includes('brand') || normUa.includes('айдент')));
      }

      // Status match
      let matchesStatus = selectedStatus === 'all';
      if (!matchesStatus) {
        const normSelected = normalize(selectedStatus);
        const normStatus = normalize(p.status);
        const normUa = normalize(p.statusLabel?.ua);
        const normEn = normalize(p.statusLabel?.en);
        matchesStatus = normStatus === normSelected || 
                        normUa === normSelected || 
                        normEn === normSelected ||
                        (normSelected.includes('realiz') && (normStatus.includes('realiz') || normStatus.includes('prod') || normUa.includes('продакшн'))) ||
                        (normSelected.includes('concept') && (normStatus.includes('concept') || normUa.includes('концепт')));
      }

      return matchesCategory && matchesStatus;
    });
  }, [data.projects, selectedCategory, selectedStatus]);

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
      />

      {/* Hero Section with Interactive Ambient Grid */}
      <section 
        ref={heroRef} 
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full flex flex-col p-6 pb-12 lg:p-12 lg:pb-24 pt-36"
      >
        {/* Subtle background ambient line structure with softened interactive spotlight */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full max-w-[1600px] mx-auto relative pt-12 lg:pt-24"
        >
          {/* Status badge */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">
              {getLocalizedText(data.settings.heroTag, language, DEFAULT_SETTINGS.heroTag || { ua: 'Готовий до співпраці', en: 'Available for work' })}
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="text-neutral-300">
              {getLocalizedText(data.settings.title, language, DEFAULT_SETTINGS.title)}
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-neutral-500">
              {getLocalizedText(data.settings.location, language, DEFAULT_SETTINGS.location)}
            </span>
          </div>

          <div className="relative">
            {/* Main Monumental Heading: SEL over IVAN, IVAN solid fill, SEL & OV outline, OV after IVAN */}
            <h1 className="text-[13vw] lg:text-[11vw] xl:text-[12vw] leading-[0.82] font-black tracking-tighter uppercase select-none flex flex-col items-start shrink-0 mb-8 lg:mb-12">
              <span className="text-stroke-light inline-block">SEL</span>
              <span className="inline-flex items-baseline">
                <span className="text-[#f4f4f0]">IVAN</span>
                <span className="text-stroke-light">OV</span>
              </span>
            </h1>

            {/* Bio & CTA Row */}
            <div className="flex flex-col items-start gap-8 pt-8 w-full lg:w-[calc(100%-380px-2rem)] xl:w-[calc(100%-480px-2rem)] relative z-20 pointer-events-none">
              {/* Animated Line with Continuous Soft Ambient Sheen */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="absolute top-0 left-0 h-[1px] bg-neutral-800 origin-left w-full overflow-hidden"
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

              <p className="text-lg sm:text-xl md:text-2xl max-w-xl font-light leading-snug text-neutral-300 pointer-events-auto min-h-[75px] sm:min-h-[84px] md:min-h-[100px]">
                {getLocalizedText(data.settings.bioShort, language, DEFAULT_SETTINGS.bioShort)}
              </p>

              <div className="flex items-center gap-6 pointer-events-auto mt-2">
                <a
                  href="#work"
                  onClick={scrollToWork}
                  className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#f4f4f0] bg-[#0a0a0a]/70 hover:bg-[#0a0a0a] backdrop-blur-md px-6 py-4 border border-neutral-800 transition-colors group cursor-pointer"
                >
                  <span>{language === 'ua' ? 'Дослідити кейси' : 'Explore Portfolio'}</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Hero Image (Absolute on Desktop to overlap bio, static on mobile) */}
            <motion.div 
              style={{ y: heroImageY }}
              className="mt-12 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 w-full lg:w-[380px] xl:w-[480px] group z-10"
            >
              <img 
                src={data.settings.heroImage || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"} 
                alt={data.settings.name[language]}
                className="w-full h-auto object-contain object-bottom filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-neutral-800 pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Selected Work Section */}
      <section id="work" className="scroll-mt-20 pt-8 pb-24 px-6 lg:px-12 bg-[#0d0d0d] text-[#f4f4f0] border-t border-neutral-900 relative">
        <div className="max-w-[1600px] mx-auto">
          {/* Sticky Section Header */}
          <div className="sticky top-[58px] sm:top-[73px] z-30 bg-[#0d0d0d]/95 backdrop-blur-md -mx-6 px-6 lg:-mx-12 lg:px-12 pt-4 pb-0 mb-10 transition-all">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
                    01 // INDEXED CASE STUDIES
                  </span>
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
                    {language === 'ua' ? 'Вибрані Роботи' : 'Selected Works'}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Masonry vs Structured Grid View Toggle */}
                  <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('bento-masonry')}
                      title={language === 'ua' ? 'Каскадний вигляд (Masonry)' : 'Masonry View'}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all ${
                        layoutMode === 'bento-masonry'
                          ? 'bg-[#f4f4f0] text-black font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Columns3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'ua' ? 'Каскад' : 'Masonry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLayoutMode('bento-grid')}
                      title={language === 'ua' ? 'Модульна сітка (Grid)' : 'Grid View'}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all ${
                        layoutMode === 'bento-grid'
                          ? 'bg-[#f4f4f0] text-black font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'ua' ? 'Сітка' : 'Grid'}</span>
                    </button>
                  </div>

                  <span className="text-sm sm:text-base font-mono text-neutral-400 border-l border-neutral-800 pl-4">
                    ( {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length} / {data.projects.length} )
                  </span>
                </div>
              </div>

              {/* Animated divider line with gentle moving glint reflection */}
              <AnimatedDivider />
            </div>
          </div>

          {/* Two-Axis Filter Bar: Category & Status */}
          <div className="mb-14 space-y-4 font-mono text-xs">
            {/* Category Filter Axis */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-500 uppercase tracking-wider mr-2 hidden sm:inline">
                {language === 'ua' ? 'Напрямок:' : 'Discipline:'}
              </span>
              {categoryLabels.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
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
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-900">
              <span className="text-neutral-500 uppercase tracking-wider mr-2 hidden sm:inline">
                {language === 'ua' ? 'Статус:' : 'Status:'}
              </span>
              {statusLabels.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-3 py-1 text-[11px] border transition-all cursor-pointer ${
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
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    language={language}
                    onSelect={setActiveProject}
                    isBentoGrid={false}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    language={language}
                    onSelect={setActiveProject}
                    isBentoGrid={true}
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
      <BentoExpertise language={language} expertise={data.settings.expertise} />

      {/* Philosophy Quote */}
      <section className="py-32 px-6 lg:px-12 flex items-center justify-center bg-[#070707] border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[#f4f4f0]">
            "Good design is <span className="italic font-serif text-neutral-500">as little design</span> as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials."
          </p>
          <p className="mt-8 text-neutral-500 font-mono uppercase tracking-widest text-xs sm:text-sm">
            — Dieter Rams (Ten Principles for Good Design)
          </p>
        </div>
      </section>

      {/* Experience Timeline */}
      <ExperienceTimeline experience={data.experience} language={language} />

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
