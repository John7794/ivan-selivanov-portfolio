/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, Language } from './types';
import { getStoredData, PortfolioData, syncWithGoogleSheets } from './services/googleSheets';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { CaseStudyModal } from './components/CaseStudyModal';
import { BentoExpertise } from './components/BentoExpertise';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => getStoredData());
  const [language, setLanguage] = useState<Language>('ua');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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

  // Keyboard shortcut (Esc for closing project modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        if (activeProject) setActiveProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  // Filter projects based on Category & Status
  const filteredProjects = data.projects.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const categoryLabels: { id: ProjectCategory; ua: string; en: string }[] = [
    { id: 'all', ua: 'Всі напрямки', en: 'All Disciplines' },
    { id: 'ui-ux', ua: 'UI/UX Продукт', en: 'UI/UX Product' },
    { id: '3d-render', ua: '3D Рендери', en: '3D Renders' },
    { id: 'book-design', ua: 'Книжковий дизайн', en: 'Book Design' },
    { id: 'branding', ua: 'Айдентика & Постери', en: 'Identity & Posters' },
  ];

  const statusLabels: { id: ProjectStatus; ua: string; en: string }[] = [
    { id: 'all', ua: 'Всі статуси', en: 'All' },
    { id: 'realized', ua: 'Реалізовані (Продакшн)', en: 'Production' },
    { id: 'concept', ua: 'Концепти & R&D', en: 'Concept' },
  ];

  const activeTestimonial = activeProject?.testimonialId
    ? data.testimonials.find(t => t.id === activeProject.testimonialId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f0] font-sans selection:bg-[#f4f4f0] selection:text-[#0a0a0a] relative">
      {/* Global Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        name={data.settings.name[language]}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full flex flex-col p-6 pb-12 lg:p-12 lg:pb-24 overflow-x-hidden pt-36">
        {/* Subtle background ambient line structure */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)',
              backgroundSize: '5rem 5rem'
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
          <div className="mb-6 flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {data.settings.title[language] || (language === 'ua' ? 'Відкритий для нових викликів' : 'Available for global inquiries')}
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-neutral-500">
              {data.settings.location[language] || (language === 'ua' ? 'Львів — Remote / Worldwide' : 'Lviv — Remote / Worldwide')}
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
              {/* Animated Line with Neon Shine */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="absolute top-0 left-0 h-[1px] bg-neutral-800 origin-left w-full overflow-hidden"
              >
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
                  className="w-1/3 h-full absolute top-0 bg-gradient-to-r from-transparent via-neutral-300 to-transparent shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] opacity-70"
                />
              </motion.div>

              <p className="text-lg sm:text-xl md:text-2xl max-w-xl font-light leading-snug text-neutral-300 pointer-events-auto min-h-[75px] sm:min-h-[84px] md:min-h-[100px]">
                {data.settings.bioShort[language]}
              </p>

              <div className="flex items-center gap-6 pointer-events-auto mt-2">
                <a
                  href="#work"
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
      <section id="work" className="py-24 px-6 lg:px-12 bg-[#0d0d0d] text-[#f4f4f0] border-t border-neutral-900">
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header & Total Count */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
                01 // INDEXED CASE STUDIES
              </span>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight uppercase">
                {language === 'ua' ? 'Вибрані Роботи' : 'Selected Works'}
              </h2>
            </div>
            <span className="text-lg font-mono text-neutral-400">
              ( {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length} / {data.projects.length} )
            </span>
          </div>

          {/* Two-Axis Filter Bar: Category & Status */}
          <div className="mb-16 space-y-4 font-mono text-xs">
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

          {/* Project List */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  language={language}
                  onSelect={setActiveProject}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-neutral-900 p-12 text-neutral-500 font-mono text-sm">
              {language === 'ua'
                ? 'За вибраними критеріями проєктів не знайдено.'
                : 'No projects match the selected criteria.'}
            </div>
          )}
        </div>
      </section>

      {/* Expertise & Architecture (Bento Grid) */}
      <BentoExpertise language={language} />

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

      {/* Massive Footer with discreet CMS trigger */}
      <Footer
        settings={data.settings}
        language={language}
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

      {/* Cookie & Compliance Banner */}
      <CookieBanner language={language} />
    </div>
  );
}
