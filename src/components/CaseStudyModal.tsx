import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Check, Copy, Laptop, Smartphone, ExternalLink, ChevronLeft, ChevronRight, Quote, Maximize2, Minimize2, Expand, Images } from 'lucide-react';
import { Project, Language, Testimonial } from '../types';
import { Interactive3DViewer } from './Interactive3DViewer';
import { BookSpreadViewer } from './BookSpreadViewer';

interface CaseStudyModalProps {
  project: Project | null;
  allProjects: Project[];
  testimonial?: Testimonial;
  language: Language;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  allProjects,
  testimonial,
  language,
  onClose,
  onSelectProject
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [fitMode, setFitMode] = useState<'fill' | 'fit'>('fill');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  const allImages = React.useMemo(() => {
    if (!project) return [];
    const list: string[] = [];
    if (project.thumbnailUrl) list.push(project.thumbnailUrl);
    if (Array.isArray(project.galleryUrls)) {
      project.galleryUrls.forEach((url) => {
        if (url && !list.includes(url)) list.push(url);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600'];
  }, [project]);

  const currentImage = allImages[activeImageIndex] || allImages[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (isFullscreen) {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, allImages.length]);

  if (!project) return null;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const t = {
    overview: language === 'ua' ? 'Огляд проєкту' : 'Project Overview',
    challenge: language === 'ua' ? 'Виклик & Проблема' : 'The Challenge',
    solution: language === 'ua' ? 'Архітектурне Рішення' : 'The Solution',
    impact: language === 'ua' ? 'Результати & Бізнес-Метрики' : 'Business Impact & Metrics',
    designSystem: language === 'ua' ? 'Дизайн-Система & Токени' : 'Design Tokens & Typography',
    fonts: language === 'ua' ? 'Шрифти' : 'Typography',
    colors: language === 'ua' ? 'Колірна палітра' : 'Color Palette',
    grid: language === 'ua' ? 'Тип сітки' : 'Grid Architecture',
    tools: language === 'ua' ? 'Інструменти' : 'Tooling',
    clientReview: language === 'ua' ? 'Відгук замовника' : 'Client Endorsement',
    visitLive: language === 'ua' ? 'Переглянути Live Проєкт' : 'Explore Live Interface',
    copied: language === 'ua' ? 'Скопійовано' : 'Copied',
    prev: language === 'ua' ? 'Попередній' : 'Previous',
    next: language === 'ua' ? 'Наступний' : 'Next',
    maxSpace: language === 'ua' ? 'Максимум місця' : 'Max width',
    fitFrame: language === 'ua' ? 'Вмістити' : 'Fit to frame',
    fullscreen: language === 'ua' ? 'На весь екран' : 'Fullscreen'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-8">
        {/* Modal Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[#0e0e0e] text-[#f4f4f0] border border-neutral-800 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Top Bar / Navigation */}
          <div className="sticky top-0 z-40 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                CASE STUDY // {project.slug.toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                project.status === 'realized' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}>
                {project.status === 'realized' ? (language === 'ua' ? 'Реалізовано' : 'Production') : (language === 'ua' ? 'Концепт' : 'Concept')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => onSelectProject(prevProject)}
                  className="px-2.5 py-1.5 border border-neutral-800 hover:border-neutral-600 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.prev}</span>
                </button>
                <button
                  onClick={() => onSelectProject(nextProject)}
                  className="px-2.5 py-1.5 border border-neutral-800 hover:border-neutral-600 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.next}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-neutral-700 hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto px-6 py-8 md:px-12 md:py-12 space-y-16">
            {/* Header / Hero */}
            <div className="space-y-6 border-b border-neutral-800 pb-12">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {project.categoryLabel[language]} — {project.timeline}
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight uppercase leading-[0.95]">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl font-light leading-snug">
                {project.tagline[language]}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 font-mono text-xs border-t border-neutral-800/80">
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block mb-1">Role</span>
                  <span className="text-neutral-200">{project.role[language]}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block mb-1">Timeline</span>
                  <span className="text-neutral-200">{project.timeline}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block mb-1">Category</span>
                  <span className="text-neutral-200">{project.categoryLabel[language]}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block mb-1">Deliverables</span>
                  <span className="text-neutral-200">{project.toolsUsed.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Specialized Interactive Viewer */}
            <div id="project-interactive-viewer" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>INTERACTIVE VISUAL EXPERIENCE</span>
                  <span className="text-[10px] text-neutral-500 hidden sm:inline">
                    [{fitMode === 'fill' ? t.maxSpace : t.fitFrame}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Multi-screen Switcher */}
                  {allImages.length > 1 && (
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5">
                      <button
                        onClick={handlePrevImage}
                        title={language === 'ua' ? 'Попередній макет' : 'Previous screen'}
                        className="px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-[11px] font-mono text-cyan-300 font-medium whitespace-nowrap">
                        {activeImageIndex + 1} / {allImages.length}
                      </span>
                      <button
                        onClick={handleNextImage}
                        title={language === 'ua' ? 'Наступний макет' : 'Next screen'}
                        className="px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {project.category === 'ui-ux' && (
                    <>
                      {/* Device switch */}
                      <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5">
                        <button
                          onClick={() => setDeviceView('desktop')}
                          className={`px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                            deviceView === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          <span>Desktop</span>
                        </button>
                        <button
                          onClick={() => setDeviceView('mobile')}
                          className={`px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                            deviceView === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Mobile</span>
                        </button>
                      </div>

                      {/* Display Mode: Maximum Space vs Fit */}
                      <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5">
                        <button
                          onClick={() => setFitMode('fill')}
                          title={t.maxSpace}
                          className={`px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                            fitMode === 'fill' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.maxSpace}</span>
                        </button>
                        <button
                          onClick={() => setFitMode('fit')}
                          title={t.fitFrame}
                          className={`px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                            fitMode === 'fit' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.fitFrame}</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Fullscreen Lightbox Button */}
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
                    title={t.fullscreen}
                  >
                    <Expand className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.fullscreen}</span>
                  </button>
                </div>
              </div>

              {/* Format-Specific Render */}
              {project.category === '3d-render' ? (
                <Interactive3DViewer
                  imageUrl={currentImage}
                  title={project.title}
                />
              ) : project.category === 'book-design' ? (
                <BookSpreadViewer
                  imageUrl={currentImage}
                />
              ) : (
                /* UI/UX Simulated Interactive Device Frame */
                <div className="bg-neutral-950 border border-neutral-800 p-1 sm:p-2 md:p-3 flex justify-center items-center shadow-inner">
                  <div
                    className={`transition-all duration-500 overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-900 ${
                      deviceView === 'desktop'
                        ? 'w-full rounded-t-lg'
                        : 'w-full max-w-[360px] aspect-[9/19] rounded-3xl p-2 border-4 border-neutral-700'
                    }`}
                  >
                    {/* Simulated browser/device chrome */}
                    {deviceView === 'desktop' ? (
                      <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          <span className="text-[10px] font-mono text-neutral-400 ml-2 hidden md:inline truncate max-w-[200px]">
                            {project.title}
                          </span>
                        </div>
                        <div className="bg-neutral-950 px-4 py-0.5 rounded text-[10px] font-mono text-neutral-400 border border-neutral-800/80 max-w-sm truncate text-center">
                          https://{project.slug}.internal/terminal
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsFullscreen(true)}
                            title={t.fullscreen}
                            className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                          >
                            <Expand className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-4 flex justify-center items-center">
                        <div className="w-16 h-2 bg-neutral-700 rounded-full" />
                      </div>
                    )}

                    {/* Viewport Frame with Smart Sizing */}
                    <div
                      className={`relative group/viewer w-full bg-neutral-950 transition-all ${
                        deviceView === 'desktop'
                          ? fitMode === 'fill'
                            ? 'h-[550px] sm:h-[680px] md:h-[800px] overflow-y-auto overscroll-contain'
                            : 'aspect-[16/10] max-h-[75vh] flex items-center justify-center p-2'
                          : 'h-full overflow-y-auto rounded-2xl overscroll-contain'
                      }`}
                    >
                      {/* Interactive Next/Prev arrows on hover inside viewer */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                            title={language === 'ua' ? 'Попередній макет' : 'Previous screen'}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-0 group-hover/viewer:opacity-100 transition-opacity cursor-pointer shadow-lg rounded-sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                            title={language === 'ua' ? 'Наступний макет' : 'Next screen'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-0 group-hover/viewer:opacity-100 transition-opacity cursor-pointer shadow-lg rounded-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <img
                        src={currentImage}
                        alt={`${project.title} - screen ${activeImageIndex + 1}`}
                        className={`transition-all ${
                          deviceView === 'desktop'
                            ? fitMode === 'fill'
                              ? 'w-full h-auto block'
                              : 'w-full h-full object-contain'
                            : 'w-full h-auto block rounded-xl'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail Quick Navigator for Multiple Images */}
              {allImages.length > 1 && (
                <div className="bg-neutral-950 border border-neutral-800/80 p-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 shrink-0">
                    <Images className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'ua' ? 'Макети проєкту:' : 'Project screens:'}</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                    {allImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`group flex items-center gap-2 p-1 border transition-all cursor-pointer shrink-0 ${
                          activeImageIndex === i
                            ? 'border-white bg-neutral-800 text-white shadow-md'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                        }`}
                      >
                        <div className="w-10 h-7 bg-neutral-950 overflow-hidden border border-white/10 shrink-0">
                          <img src={imgUrl} alt={`Screen ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-mono text-[11px] pr-1.5 font-medium">0{i + 1}</span>
                      </button>
                    ))}
                  </div>

                  <div className="font-mono text-[11px] text-neutral-500 hidden sm:block shrink-0">
                    {activeImageIndex + 1} {language === 'ua' ? 'з' : 'of'} {allImages.length}
                  </div>
                </div>
              )}
            </div>

            {/* Strategic Product Pillars: Challenge -> Solution -> Impact */}
            {(() => {
              const challengeText = project.problemStatement?.[language] || project.problemStatement?.ua || project.problemStatement?.en || '';
              const solutionText = project.solution?.[language] || project.solution?.ua || project.solution?.en || '';
              const impactText = project.businessImpact?.[language] || project.businessImpact?.ua || project.businessImpact?.en || '';
              const hasPillars = Boolean(challengeText || solutionText || impactText);

              if (!hasPillars) return null;

              const pillarCount = [challengeText, solutionText, impactText].filter(Boolean).length;
              const gridCols = pillarCount === 1 ? 'grid-cols-1 max-w-2xl' : pillarCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

              return (
                <div className={`grid ${gridCols} gap-8 md:gap-12 border-t border-neutral-800 pt-12`}>
                  {/* Pillar 1: Challenge */}
                  {challengeText && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-red-400 border border-red-500/40 px-2 py-0.5">01 // CHALLENGE</span>
                      </div>
                      <h3 className="text-xl font-medium uppercase tracking-tight">{t.challenge}</h3>
                      <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {challengeText}
                      </p>
                    </div>
                  )}

                  {/* Pillar 2: Solution */}
                  {solutionText && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-cyan-400 border border-cyan-500/40 px-2 py-0.5">02 // SOLUTION</span>
                      </div>
                      <h3 className="text-xl font-medium uppercase tracking-tight">{t.solution}</h3>
                      <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {solutionText}
                      </p>
                    </div>
                  )}

                  {/* Pillar 3: Impact */}
                  {impactText && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-emerald-400 border border-emerald-500/40 px-2 py-0.5">03 // IMPACT</span>
                      </div>
                      <h3 className="text-xl font-medium uppercase tracking-tight">{t.impact}</h3>
                      <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {impactText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Metrics Callout Strip */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="bg-[#121212] border border-neutral-800 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="border-l-2 border-neutral-700 pl-4">
                    <div className="text-3xl md:text-5xl font-semibold tracking-tighter text-white">
                      {m.value}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
                      {m.label[language]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Deep Dive Gallery: All Project Screens */}
            {allImages.length > 1 && (
              <div className="border-t border-neutral-800 pt-12 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-2xl font-medium uppercase tracking-tight">
                        {language === 'ua' ? 'Всі макети та екрани' : 'All Screens & Visual Assets'}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-400 font-light mt-1">
                      {language === 'ua' 
                        ? `У проєкті доступно ${allImages.length} візуальних макетів. Натисніть для перегляду в повному розмірі.` 
                        : `${allImages.length} visual assets available in this project. Click to expand in full resolution.`}
                    </p>
                  </div>

                  <span className="font-mono text-xs text-neutral-500">
                    {allImages.length} {language === 'ua' ? 'МАКЕТІВ' : 'SCREENS'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsFullscreen(true);
                      }}
                      className={`group relative bg-neutral-950 border overflow-hidden cursor-pointer transition-all duration-300 ${
                        activeImageIndex === idx ? 'border-neutral-500 ring-1 ring-neutral-500' : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                        <img
                          src={imgUrl}
                          alt={`${project.title} - screen ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <span className="px-3 py-1.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 shadow-lg">
                            <Expand className="w-3.5 h-3.5" />
                            <span>{t.fullscreen}</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">SCREEN // 0{idx + 1}</span>
                          {activeImageIndex === idx && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {language === 'ua' ? 'АКТИВНИЙ В СИМУЛЯТОРІ' : 'ACTIVE IN VIEWER'}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(idx);
                            const viewer = document.getElementById('project-interactive-viewer');
                            if (viewer) viewer.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-neutral-400 hover:text-white transition-colors text-[11px] underline underline-offset-2 cursor-pointer"
                        >
                          {language === 'ua' ? 'В симулятор ↑' : 'Open in viewer ↑'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Design Tokens & Typography Specimen */}
            {(() => {
              const fontList = project.designSystem?.fonts || [];
              const colorList = project.designSystem?.colors || [];
              const gridName = project.designSystem?.gridType || '';
              const hasDesignSystem = fontList.length > 0 || colorList.length > 0 || Boolean(gridName);

              if (!hasDesignSystem) return null;

              return (
                <div className="border-t border-neutral-800 pt-12 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-medium uppercase tracking-tight">{t.designSystem}</h3>
                    {gridName && (
                      <span className="font-mono text-xs text-neutral-500">
                        {gridName}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Font Hierarchy Specimen */}
                    {fontList.length > 0 && (
                      <div className={`bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 ${colorList.length === 0 ? 'md:col-span-2' : ''}`}>
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                          {t.fonts}
                        </span>
                        {fontList.map((f, i) => (
                          <div key={i} className="border-b border-neutral-800/80 pb-3">
                            <div className="text-2xl font-semibold tracking-tight">{f}</div>
                            <div className="text-xs font-mono text-neutral-500 mt-1">
                              ABCDEFGHIJKLMOPQRSTUVWXYZ 0123456789
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Color Token Swatches */}
                    {colorList.length > 0 && (
                      <div className={`bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 ${fontList.length === 0 ? 'md:col-span-2' : ''}`}>
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                          {t.colors} (Click to copy hex)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {colorList.map((c, i) => (
                            <button
                              key={i}
                              onClick={() => handleCopyHex(c.hex)}
                              className="group flex flex-col p-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-600 text-left transition-all cursor-pointer"
                            >
                              <div
                                className="w-full aspect-[2/1] rounded-xs mb-2 border border-white/10"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="text-[11px] font-medium text-neutral-300 truncate">{c.name}</span>
                              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-0.5">
                                <span>{c.hex}</span>
                                {copiedHex === c.hex ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Client Testimonial Social Proof */}
            {testimonial && (
              <div className="bg-[#121212] border-l-4 border-neutral-200 p-6 md:p-8 space-y-4">
                <Quote className="w-8 h-8 text-neutral-600" />
                <p className="text-lg md:text-xl font-light italic leading-relaxed text-neutral-200">
                  "{testimonial.text[language]}"
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                  <div>
                    <div className="font-medium text-sm text-white">{testimonial.author}</div>
                    <div className="text-xs font-mono text-neutral-400">{testimonial.role[language]} — {testimonial.company}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions inside modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 pt-8">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#f4f4f0] text-[#0a0a0a] font-medium text-sm uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{t.visitLive}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <div className="flex items-center gap-4 font-mono text-xs text-neutral-400 ml-auto">
                <button
                  onClick={() => onSelectProject(prevProject)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ← {prevProject.title}
                </button>
                <span>/</span>
                <button
                  onClick={() => onSelectProject(nextProject)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {nextProject.title} →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex flex-col p-3 sm:p-6"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between text-neutral-300 mb-3 px-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">{project.title}</span>
              <span className="text-neutral-600">//</span>
              <span className="text-neutral-400">{t.fullscreen}</span>
              {allImages.length > 1 && (
                <span className="text-cyan-400 font-medium ml-1">
                  [{activeImageIndex + 1} / {allImages.length}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {allImages.length > 1 && (
                <div className="flex items-center gap-1 font-mono text-xs bg-neutral-900 border border-neutral-800 p-0.5">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Previous screen"
                    title={language === 'ua' ? 'Попередній (←)' : 'Previous (←)'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-[11px] text-neutral-300 font-medium">
                    {activeImageIndex + 1} / {allImages.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Next screen"
                    title={language === 'ua' ? 'Наступний (→)' : 'Next (→)'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full border border-neutral-700 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image & Floating Arrows */}
          <div
            className="flex-1 w-full h-full overflow-auto flex items-start sm:items-center justify-center relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/70 hover:bg-black text-white border border-neutral-700 rounded-full cursor-pointer transition-all hover:scale-110 shadow-2xl"
                  aria-label="Previous"
                  title={language === 'ua' ? 'Попередній' : 'Previous'}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/70 hover:bg-black text-white border border-neutral-700 rounded-full cursor-pointer transition-all hover:scale-110 shadow-2xl"
                  aria-label="Next"
                  title={language === 'ua' ? 'Наступний' : 'Next'}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              key={currentImage}
              src={currentImage}
              alt={`${project.title} - screen ${activeImageIndex + 1}`}
              className="max-w-full h-auto max-h-none sm:max-h-[82vh] object-contain mx-auto shadow-2xl rounded-sm transition-opacity duration-200"
            />
          </div>

          {/* Bottom Thumbnail Navigation in Fullscreen */}
          {allImages.length > 1 && (
            <div
              className="mt-2 flex items-center justify-center gap-2 overflow-x-auto py-2 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-10 border transition-all overflow-hidden cursor-pointer shrink-0 ${
                    activeImageIndex === i
                      ? 'border-white scale-105 shadow-lg ring-1 ring-white'
                      : 'border-neutral-800 opacity-50 hover:opacity-100 hover:border-neutral-500'
                  }`}
                >
                  <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
