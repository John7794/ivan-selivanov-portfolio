import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Check, Copy, Laptop, Smartphone, ExternalLink, ChevronLeft, ChevronRight, Quote, Maximize2, Minimize2, Expand, Images, ZoomIn, ZoomOut, Figma } from 'lucide-react';
import { Project, Language, Testimonial } from '../types';
import { formatImageUrl } from '../services/googleSheets';
import { getLocalizedText } from '../utils/i18n';
import { getFigmaEmbedSrc, getFigmaDirectUrl, isFigmaUrl } from '../utils/figma';

interface CaseStudyModalProps {
  project: Project | null;
  allProjects: Project[];
  testimonial?: Testimonial;
  language: Language;
  ui?: Record<string, any>;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  allProjects,
  testimonial,
  language,
  ui,
  onClose,
  onSelectProject
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [fitMode, setFitMode] = useState<'fill' | 'fit'>('fill');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenZoom, setFullscreenZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'screens' | 'figma'>('screens');

  const modalBodyRef = useRef<HTMLDivElement>(null);

  const rawMobileImages = React.useMemo(() => {
    if (!project) return [];
    const list: string[] = [];
    const mobileFirst = project.mobileThumbnailUrl || project.mobilePreviewUrl;
    if (mobileFirst) {
      const formatted = formatImageUrl(mobileFirst);
      if (formatted) list.push(formatted);
    }
    if (Array.isArray(project.mobileGalleryUrls)) {
      project.mobileGalleryUrls.forEach((url) => {
        if (url) {
          const formatted = formatImageUrl(url);
          if (formatted && !list.includes(formatted)) list.push(formatted);
        }
      });
    }
    return list;
  }, [project]);

  const rawDesktopImages = React.useMemo(() => {
    if (!project) return [];
    const list: string[] = [];
    const normalize = (u: string) => formatImageUrl(u).toLowerCase().trim().replace(/\/+$/, '');
    const mobileNorms = new Set(rawMobileImages.map(normalize));

    // Desktop gallery images
    if (Array.isArray(project.galleryUrls)) {
      project.galleryUrls.forEach((url) => {
        if (url) {
          const formatted = formatImageUrl(url);
          if (formatted && !list.includes(formatted)) {
            // Only add if not identical to a mobile preview image
            if (!mobileNorms.has(normalize(formatted))) {
              list.push(formatted);
            }
          }
        }
      });
    }

    // Thumbnail URL:
    // If thumbnailUrl is set, but is identical to one of the mobile preview images
    // (which occurs because Google Sheets or data helpers populate thumbnailUrl with the mobile image as a fallback for the project card preview on the main page),
    // do NOT treat it as a desktop screenshot when mobile images are present!
    if (project.thumbnailUrl) {
      const formatted = formatImageUrl(project.thumbnailUrl);
      if (formatted && !list.includes(formatted)) {
        if (!mobileNorms.has(normalize(formatted))) {
          list.unshift(formatted);
        }
      }
    }

    return list;
  }, [project, rawMobileImages]);

  // Is this project an interactive digital interface / website / app?
  const isWebOrApp = React.useMemo(() => {
    if (!project) return false;
    const cat = (project.category || '').toLowerCase();
    const labelUa = (project.categoryLabel?.ua || '').toLowerCase();
    const labelEn = (project.categoryLabel?.en || '').toLowerCase();
    return (
      cat === 'ui-ux' ||
      cat === 'website' ||
      cat === 'web' ||
      cat === 'mobile' ||
      cat === 'app' ||
      cat === 'product' ||
      cat.includes('ui') ||
      cat.includes('ux') ||
      cat.includes('web') ||
      cat.includes('app') ||
      labelUa.includes('сайт') ||
      labelUa.includes('веб') ||
      labelUa.includes('ui/ux') ||
      labelUa.includes('інтерфейс') ||
      labelUa.includes('додаток') ||
      labelEn.includes('site') ||
      labelEn.includes('web') ||
      labelEn.includes('ui/ux') ||
      labelEn.includes('interface') ||
      labelEn.includes('app')
    );
  }, [project]);

  const hasDesktopImages = rawDesktopImages.length > 0;
  const hasMobileImages = rawMobileImages.length > 0;

  const hasMobilePreview = hasMobileImages;
  const hasDesktopPreview = hasDesktopImages;

  // Safe effective device view that guarantees no desktop frame is forced when only mobile exists
  const effectiveDeviceView = (hasMobilePreview && !hasDesktopPreview)
    ? 'mobile'
    : ((hasDesktopPreview && !hasMobilePreview) ? 'desktop' : deviceView);

  // Fallback if no images were provided at all
  const fallbackImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=90&w=2400';

  const desktopImages = hasDesktopImages 
    ? rawDesktopImages 
    : (hasMobileImages ? rawMobileImages : [fallbackImage]);

  const mobileImages = hasMobileImages 
    ? rawMobileImages 
    : (hasDesktopImages ? rawDesktopImages : [fallbackImage]);

  useEffect(() => {
    setActiveImageIndex(0);
    setFullscreenZoom(false);
    setActiveTab('screens');
    // If project only has mobile images, default directly to mobile view
    if (hasMobileImages && !hasDesktopImages) {
      setDeviceView('mobile');
    } else {
      setDeviceView('desktop');
    }
  }, [project?.id, hasMobileImages, hasDesktopImages]);

  // Selected images based on effectiveDeviceView
  const allImages = (effectiveDeviceView === 'mobile' && hasMobilePreview) 
    ? mobileImages 
    : desktopImages;

  const currentImage = allImages[activeImageIndex] || allImages[0] || desktopImages[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const currentIndex = project ? allProjects.findIndex(p => p.id === project.id) : 0;
  const prevProject = allProjects.length > 0 ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length] : null;
  const nextProject = allProjects.length > 0 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  const resolvedProjectTitle = getLocalizedText(project?.title, language, { ua: 'Без назви', en: 'Untitled' });
  const prevProjectTitle = prevProject ? getLocalizedText(prevProject.title, language, { ua: 'Попередній', en: 'Previous' }) : '';
  const nextProjectTitle = nextProject ? getLocalizedText(nextProject.title, language, { ua: 'Наступний', en: 'Next' }) : '';

  const isValidLiveLink = (link?: string | null): boolean => {
    if (!link) return false;
    const trimmed = String(link).trim();
    if (!trimmed || trimmed === '-' || trimmed === '–' || trimmed === '—' || trimmed === '#') return false;
    const lower = trimmed.toLowerCase();
    if (
      lower === 'none' ||
      lower === 'n/a' ||
      lower === 'na' ||
      lower === 'null' ||
      lower === 'undefined' ||
      lower === 'false' ||
      lower === 'no' ||
      lower === 'ні' ||
      lower === 'немає' ||
      lower === 'http://' ||
      lower === 'https://' ||
      lower === 'http://...' ||
      lower === 'https://...'
    ) {
      return false;
    }
    return trimmed.length > 3;
  };

  const formatLiveUrl = (link?: string | null): string => {
    if (!link) return '#';
    const trimmed = String(link).trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const hasLiveLink = isValidLiveLink(project?.liveLink);
  const liveUrl = formatLiveUrl(project?.liveLink);

  const figmaEmbedSrc = project ? getFigmaEmbedSrc(project.figmaEmbedUrl || (project.liveLink && isFigmaUrl(project.liveLink) ? project.liveLink : project.figmaUrl)) : null;
  const figmaDirectUrl = project ? getFigmaDirectUrl(project) : null;
  const hasFigmaEmbed = Boolean(figmaEmbedSrc);
  const hasFigmaDirect = Boolean(figmaDirectUrl);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (allImages.length > 1) {
          handlePrevImage();
        } else if (prevProject) {
          onSelectProject(prevProject);
        }
      } else if (e.key === 'ArrowRight') {
        if (allImages.length > 1) {
          handleNextImage();
        } else if (nextProject) {
          onSelectProject(nextProject);
        }
      }
    };

    // Lock background page scroll while project modal is active
    if (project) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyPaddingRight = document.body.style.paddingRight;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, allImages.length, onClose, prevProject, nextProject, project]);

  if (!project) return null;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const t = {
    caseStudy: getLocalizedText(ui?.modalCaseStudy, language, { ua: 'CASE STUDY //', en: 'CASE STUDY //' }),
    prev: getLocalizedText(ui?.modalPrev, language, { ua: 'Попередній', en: 'Previous' }),
    next: getLocalizedText(ui?.modalNext, language, { ua: 'Наступний', en: 'Next' }),
    close: getLocalizedText(ui?.modalClose, language, { ua: 'Закрити', en: 'Close' }),
    clientLabel: getLocalizedText(ui?.modalClient, language, { ua: 'Клієнт', en: 'Client' }),
    live: getLocalizedText(ui?.modalLive, language, { ua: 'Live', en: 'Live' }),
    role: getLocalizedText(ui?.modalRole, language, { ua: 'Роль', en: 'Role' }),
    timeline: getLocalizedText(ui?.modalTimeline, language, { ua: 'Період', en: 'Timeline' }),
    category: getLocalizedText(ui?.modalCategory, language, { ua: 'Категорія', en: 'Category' }),
    deliverables: getLocalizedText(ui?.modalDeliverables, language, { ua: 'Результати', en: 'Deliverables' }),
    interactiveExperience: getLocalizedText(ui?.modalInteractiveExperience, language, { ua: 'INTERACTIVE VISUAL EXPERIENCE', en: 'INTERACTIVE VISUAL EXPERIENCE' }),
    maxSpace: getLocalizedText(ui?.modalMaxSpace, language, { ua: 'Повна довжина', en: 'Full Length' }),
    fitFrame: getLocalizedText(ui?.modalFitFrame, language, { ua: 'Вписати в екран', en: 'Fit frame' }),
    fullscreen: getLocalizedText(ui?.modalFullscreen, language, { ua: 'На весь екран', en: 'Fullscreen' }),
    overview: getLocalizedText(ui?.modalOverview, language, { ua: 'Огляд проєкту', en: 'Project Overview' }),
    challenge: getLocalizedText(ui?.modalChallenge, language, { ua: 'Виклик & Проблема', en: 'The Challenge' }),
    solution: getLocalizedText(ui?.modalSolution, language, { ua: 'Архітектурне Рішення', en: 'The Solution' }),
    impact: getLocalizedText(ui?.modalImpact, language, { ua: 'Результати та вплив', en: 'Results & Impact' }),
    designSystem: getLocalizedText(ui?.modalDesignSystem, language, { ua: 'Дизайн-Система & Токени', en: 'Design Tokens & Typography' }),
    fonts: getLocalizedText(ui?.modalFonts, language, { ua: 'Шрифти', en: 'Typography' }),
    colors: getLocalizedText(ui?.modalColors, language, { ua: 'Колірна палітра', en: 'Color Palette' }),
    grid: getLocalizedText(ui?.modalGrid, language, { ua: 'Тип сітки', en: 'Grid Architecture' }),
    tools: getLocalizedText(ui?.modalTools, language, { ua: 'Інструменти', en: 'Tooling' }),
    clientReview: getLocalizedText(ui?.modalClientReview, language, { ua: 'Відгук замовника', en: 'Client Endorsement' }),
    visitLive: getLocalizedText(ui?.modalVisitLive, language, { ua: 'Переглянути Live Проєкт', en: 'Explore Live Interface' }),
    copied: getLocalizedText(ui?.modalCopied, language, { ua: 'Скопійовано', en: 'Copied' }),
    artifacts: getLocalizedText(ui?.modalArtifacts, language, { ua: 'Екрани та Артефакти', en: 'Screens & Artifacts' }),
    tabScreens: getLocalizedText(ui?.modalTabScreens, language, { ua: 'Макети', en: 'Screens' }),
    tabFigma: getLocalizedText(ui?.modalTabFigma, language, { ua: 'Інтерактивна Figma', en: 'Interactive Figma' }),
    figmaTitle: getLocalizedText(ui?.modalFigmaTitle, language, { ua: 'ІНТЕРАКТИВНИЙ ПРОТОТИП FIGMA', en: 'INTERACTIVE FIGMA PROTOTYPE' }),
    figmaSubtitle: getLocalizedText(ui?.modalFigmaSubtitle, language, { ua: 'Клікабельний прототип у реальному часі', en: 'Live clickable prototype' }),
    allScreens: getLocalizedText(ui?.modalAllScreens, language, { ua: 'Всі макети та екрани', en: 'All Screens & Visual Assets' }),
    activeViewer: getLocalizedText(ui?.modalActiveViewer, language, { ua: 'АКТИВНИЙ В СИМУЛЯТОРІ', en: 'ACTIVE IN VIEWER' }),
    openFigma: getLocalizedText(ui?.modalOpenFigma, language, { ua: 'Перейти в макет Figma', en: 'Open in Figma' }),
    openLive: getLocalizedText(ui?.modalOpenLive, language, { ua: 'Відкрити live проєкт', en: 'Open live project' }),
    tipFigma: getLocalizedText(ui?.modalTipFigma, language, { 
      ua: 'Порада: ви можете клікати по елементах всередині фрейму або масштабувати макет коліщатком миші.', 
      en: 'Tip: interact with prototype hot-spots directly inside the frame or zoom with mouse scroll.' 
    })
  };

  return (
    <>
      <div 
        key={`case-study-modal-${project.id}`}
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar bg-black/90 backdrop-blur-md p-2 sm:p-6 md:p-8"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Modal Backdrop click */}
        <div className="fixed inset-0 -z-10" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          key={`case-study-window-${project.id}`}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[92vh] bg-[#0e0e0e] text-[#f4f4f0] border-0 sm:border sm:border-neutral-800 shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Top Bar / Navigation - Always pinned at top directly under the site header */}
          <div className="sticky top-0 z-40 bg-[#0e0e0e]/98 backdrop-blur-md border-b border-neutral-800 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 w-full max-w-full min-w-0 shadow-md">
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                {(() => {
                  const rawStatus = String(project.status || '').toLowerCase().trim();
                  const rawBadge = String(typeof project.statusBadgeLabel === 'object' ? (project.statusBadgeLabel?.ua || project.statusBadgeLabel?.en || '') : (project.statusBadgeLabel || '')).toLowerCase().trim();
                  const isConcept = rawStatus === 'concept' || rawStatus.includes('concept') || rawStatus.includes('концепт') || rawStatus.includes('r&d') || rawStatus.includes('rnd') || rawBadge.includes('concept') || rawBadge.includes('концепт');
                  const isRealized = rawStatus === 'realized' || rawStatus.includes('realiz') || rawStatus.includes('prod') || rawStatus.includes('live') || rawStatus.includes('продакшн') || rawStatus.includes('реліз') || rawBadge.includes('prod') || rawBadge.includes('realiz') || rawBadge.includes('live') || rawBadge.includes('продакшн');

                  return (
                    <>
                      <span className="relative flex h-2 w-2 shrink-0">
                        {isRealized && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 shrink-0 ${
                          isRealized ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-medium truncate max-w-[90px] xs:max-w-[140px] sm:max-w-[240px] md:max-w-none">
                        {t.caseStudy} {project.slug.toUpperCase()}
                      </span>
                    </>
                  );
                })()}
              </div>

              {(() => {
                const rawStatus = String(project.status || '').toLowerCase().trim();
                const rawBadge = String(typeof project.statusBadgeLabel === 'object' ? (project.statusBadgeLabel?.ua || project.statusBadgeLabel?.en || '') : (project.statusBadgeLabel || '')).toLowerCase().trim();
                const isConcept = rawStatus === 'concept' || rawStatus.includes('concept') || rawStatus.includes('концепт') || rawStatus.includes('r&d') || rawStatus.includes('rnd') || rawBadge.includes('concept') || rawBadge.includes('концепт');
                const isRealized = rawStatus === 'realized' || rawStatus.includes('realiz') || rawStatus.includes('prod') || rawStatus.includes('live') || rawStatus.includes('продакшн') || rawStatus.includes('реліз') || rawBadge.includes('prod') || rawBadge.includes('realiz') || rawBadge.includes('live') || rawBadge.includes('продакшн');

                const statusText = (() => {
                  // 1. Prioritize explicit project statusBadgeLabel from Google Sheets or project definitions
                  if (project.statusBadgeLabel) {
                    const text = getLocalizedText(project.statusBadgeLabel, language);
                    if (text && text.trim()) return text;
                  }
                  // 2. Prioritize project statusLabel
                  if (project.statusLabel) {
                    const text = getLocalizedText(project.statusLabel, language);
                    if (text && text.trim()) return text;
                  }
                  // 3. Fallback to concept badge / production badge from UI settings
                  if (isConcept) {
                    return getLocalizedText(ui?.badgeConcept || ui?.filterStatusConceptual, language, { ua: 'Концепт', en: 'Concept' });
                  }
                  if (isRealized) {
                    return getLocalizedText(ui?.badgeProduction || ui?.filterStatusProduction, language, { ua: 'Продакшн', en: 'Production' });
                  }
                  return getLocalizedText(ui?.badgeProduction || ui?.filterStatusProduction, language, { ua: 'Продакшн', en: 'Production' });
                })();

                return (
                  <span className={`hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                    isRealized
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  }`}>
                    {statusText}
                  </span>
                );
              })()}

              {allProjects.length > 0 && (
                <span className="hidden md:inline-block font-mono text-[11px] text-neutral-500 border-l border-neutral-800 pl-3 shrink-0">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {hasFigmaDirect && (
                <a
                  href={figmaDirectUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-200 hover:text-white border border-[#a259ff]/40 hover:border-[#a259ff] font-mono text-xs transition-colors shadow-sm shrink-0"
                  title={t.openFigma}
                >
                  <Figma className="w-3.5 h-3.5 text-[#0acf83]" />
                  <span className="hidden sm:inline">Figma</span>
                  <ExternalLink className="w-3 h-3 text-[#a259ff]" />
                </a>
              )}

              {hasLiveLink && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 font-mono text-xs transition-colors shrink-0"
                  title={t.openLive}
                >
                  <span>{t.live}</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              )}

              {/* Project Stepper */}
              {prevProject && nextProject && (
                <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 font-mono text-xs shrink-0">
                  <button
                    onClick={() => onSelectProject(prevProject)}
                    className="px-1.5 sm:px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-1 cursor-pointer transition-colors"
                    title={`${t.prev} (←)`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.prev}</span>
                  </button>
                  <div className="w-[1px] h-3.5 bg-neutral-800 my-auto" />
                  <button
                    onClick={() => onSelectProject(nextProject)}
                    className="px-1.5 sm:px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-1 cursor-pointer transition-colors"
                    title={`${t.next} (→)`}
                  >
                    <span className="hidden sm:inline">{t.next}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Prominent High-Contrast Close button */}
              <button
                type="button"
                onClick={onClose}
                className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white transition-all cursor-pointer rounded-sm shrink-0 font-mono text-xs uppercase shadow-sm"
                aria-label={t.close}
                title={`${t.close} (ESC)`}
              >
                <X className="w-4 h-4 text-neutral-300 group-hover:text-white" />
                <span className="font-semibold tracking-wider">{t.close}</span>
                <span className="hidden md:inline text-[10px] text-neutral-500 group-hover:text-neutral-400 font-normal ml-0.5">(ESC)</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div ref={modalBodyRef} className="overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 space-y-8 sm:space-y-12 w-full max-w-full">
            {/* Header / Hero */}
            <div className="space-y-6 border-b border-neutral-800 pb-10">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {getLocalizedText(project.categoryLabel, language, { ua: 'UI/UX Продукт', en: 'UI/UX Product' })} — {project.timeline}
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight uppercase leading-[0.95]">
                {getLocalizedText(project.title, language, { ua: 'Без назви', en: 'Untitled' })}
              </h1>
              <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl font-light leading-snug">
                {getLocalizedText(project.tagline, language, { ua: '', en: '' })}
              </p>

              {(() => {
                const descText = getLocalizedText(project.description, language, { ua: '', en: '' }).trim();
                const tagText = getLocalizedText(project.tagline, language, { ua: '', en: '' }).trim();
                if (!descText || descText === tagText) return null;
                return (
                  <p className="text-sm md:text-base text-neutral-400 max-w-3xl font-light leading-relaxed whitespace-pre-line pt-1">
                    {descText}
                  </p>
                );
              })()}

              {/* Meta Grid */}
              {(() => {
                const clientText = project.client
                  ? (typeof project.client === 'object'
                      ? getLocalizedText(project.client, language, { ua: '', en: '' })
                      : String(project.client))
                  : '';

                return (
                  <div className={`grid ${clientText ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} gap-6 pt-6 font-mono text-xs border-t border-neutral-800/80`}>
                    <div>
                      <span className="text-neutral-500 uppercase tracking-wider block mb-1">{t.role}</span>
                      <span className="text-neutral-200">{getLocalizedText(project.role, language, { ua: 'Lead Designer', en: 'Lead Designer' })}</span>
                    </div>
                    {clientText && (
                      <div>
                        <span className="text-neutral-500 uppercase tracking-wider block mb-1">{t.clientLabel}</span>
                        <span className="text-neutral-200 truncate block" title={clientText}>{clientText}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-500 uppercase tracking-wider block mb-1">{t.timeline}</span>
                      <span className="text-neutral-200">{project.timeline}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase tracking-wider block mb-1">{t.category}</span>
                      <span className="text-neutral-200">{getLocalizedText(project.categoryLabel, language, { ua: 'UI/UX Продукт', en: 'UI/UX Product' })}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase tracking-wider block mb-1">{t.deliverables}</span>
                      <span className="text-neutral-200">{project.toolsUsed.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Specialized Interactive Viewer */}
            <div id="project-interactive-viewer" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 font-mono text-xs uppercase tracking-widest text-neutral-400 w-full max-w-full">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="truncate">{t.interactiveExperience}</span>
                  {activeTab === 'screens' && (
                    <span className="text-[10px] text-neutral-500 hidden sm:inline">
                      [{fitMode === 'fill' ? t.maxSpace : t.fitFrame}]
                    </span>
                  )}
                  {activeTab === 'figma' && (
                    <span className="text-[10px] text-[#0acf83] font-medium hidden sm:inline">
                      [LIVE FIGMA PROTOTYPE]
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full w-full sm:w-auto">
                  {/* Mode switcher: Static Screens vs Live Figma Embed */}
                  {hasFigmaEmbed && (
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('screens')}
                        className={`px-2 sm:px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                          activeTab === 'screens' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <Images className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="hidden xs:inline">{t.tabScreens}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('figma')}
                        className={`px-2 sm:px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                          activeTab === 'figma' ? 'bg-[#1e1e1e] text-[#0acf83] font-medium border border-[#0acf83]/40' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Figma className="w-3.5 h-3.5 text-[#a259ff] shrink-0" />
                        <span className="hidden sm:inline">{t.tabFigma}</span>
                        <span className="sm:hidden text-xs">Figma</span>
                      </button>
                    </div>
                  )}

                  {/* Multi-screen Switcher (only in screens tab) */}
                  {activeTab === 'screens' && allImages.length > 1 && (
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 shrink-0">
                      <button
                        onClick={handlePrevImage}
                        title={language === 'ua' ? 'Попередній макет' : 'Previous screen'}
                        className="px-1.5 sm:px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-mono text-cyan-300 font-medium whitespace-nowrap">
                        {activeImageIndex + 1} / {allImages.length}
                      </span>
                      <button
                        onClick={handleNextImage}
                        title={language === 'ua' ? 'Наступний макет' : 'Next screen'}
                        className="px-1.5 sm:px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Device Switcher (Desktop / Mobile):
                      - Only displayed for websites, web & app digital interfaces (isWebOrApp)
                      - If only mobile is available: show only the Mobile button
                      - If only desktop is available: show only the Desktop button
                      - If both are available: show both Desktop and Mobile buttons
                      - For other categories (3D, books, branding, identity, etc.): completely hidden */}
                  {activeTab === 'screens' && isWebOrApp && (hasDesktopPreview || hasMobilePreview) && (
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 shrink-0">
                      {hasDesktopPreview && (
                        <button
                          onClick={() => {
                            setDeviceView('desktop');
                            setActiveImageIndex(0);
                          }}
                          className={`px-2 sm:px-2.5 py-1 flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs transition-colors ${
                            effectiveDeviceView === 'desktop' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title="Desktop view"
                        >
                          <Laptop className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden sm:inline">Desktop</span>
                        </button>
                      )}
                      {hasMobilePreview && (
                        <button
                          onClick={() => {
                            setDeviceView('mobile');
                            setActiveImageIndex(0);
                          }}
                          className={`px-2 sm:px-2.5 py-1 flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs transition-colors ${
                            effectiveDeviceView === 'mobile' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title="Mobile view"
                        >
                          <Smartphone className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden sm:inline">Mobile</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Display Mode: Maximum Space vs Fit (available in screens mode) */}
                  {activeTab === 'screens' && (
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 shrink-0">
                      <button
                        onClick={() => setFitMode('fill')}
                        title={t.maxSpace}
                        className={`px-2 sm:px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                          fitMode === 'fill' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{t.maxSpace}</span>
                      </button>
                      <button
                        onClick={() => setFitMode('fit')}
                        title={t.fitFrame}
                        className={`px-2 sm:px-2.5 py-1 flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                          fitMode === 'fit' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        <Minimize2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{t.fitFrame}</span>
                      </button>
                    </div>
                  )}

                  {/* Fullscreen Lightbox Button */}
                  {activeTab === 'screens' && (
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="px-2 sm:px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 flex items-center gap-1.5 cursor-pointer text-xs transition-colors shrink-0"
                      title={t.fullscreen}
                    >
                      <Expand className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{t.fullscreen}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View Container: Either Interactive Figma Embed or Visual Media Device */}
              {activeTab === 'figma' && hasFigmaEmbed ? (
                /* Interactive Figma Embed Canvas */
                <div className="bg-neutral-950 border border-neutral-800 p-2 sm:p-3 flex flex-col justify-center items-center shadow-2xl rounded-sm space-y-3">
                  <div className="w-full bg-neutral-900 border border-neutral-800 px-4 py-2.5 flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0acf83] animate-pulse" />
                      <span className="font-medium text-white">{t.figmaTitle}</span>
                      <span className="text-neutral-600">//</span>
                      <span className="text-neutral-400 hidden sm:inline">{t.figmaSubtitle}</span>
                    </div>

                    <span className="text-neutral-500 text-[11px] hidden sm:inline font-mono">
                      {language === 'ua' ? 'Масштаб 100% / Auto' : '100% / Auto Scale'}
                    </span>
                  </div>

                  <div className="w-full aspect-[16/10] min-h-[480px] sm:min-h-[600px] bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden shadow-inner relative">
                    <iframe
                      src={figmaEmbedSrc!}
                      title={`${resolvedProjectTitle} Figma Prototype`}
                      className="w-full h-full border-0 absolute inset-0"
                      allowFullScreen
                    />
                  </div>

                  <div className="w-full px-1 text-[11px] font-mono text-neutral-500">
                    {t.tipFigma}
                  </div>
                </div>
              ) : (
                /* Standard High-Fidelity Artwork / Device View */
                <>
                  {isWebOrApp ? (
                /* UI/UX Simulated Interactive Device Frame (Browser or Mobile) */
                <div className="bg-neutral-950 border border-neutral-800 p-1 sm:p-2 md:p-3 flex justify-center items-center shadow-inner rounded-sm">
                  <div
                    className={`transition-all duration-300 overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-900 ${
                      effectiveDeviceView === 'desktop'
                        ? 'w-full rounded-lg'
                        : 'w-full max-w-[360px] aspect-[9/19] rounded-[2.5rem] p-2.5 border-[6px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col'
                    }`}
                  >
                    {/* Simulated browser/device chrome */}
                    {effectiveDeviceView === 'desktop' ? (
                      <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-2 sm:px-4 gap-1.5 sm:gap-2 select-none shrink-0 min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          <span className="text-[10px] font-mono text-neutral-400 ml-1.5 hidden md:inline truncate max-w-[200px]">
                            {resolvedProjectTitle}
                          </span>
                        </div>
                        <div className="hidden xs:block bg-neutral-950 px-2 sm:px-4 py-0.5 rounded text-[10px] font-mono text-neutral-400 border border-neutral-800/80 max-w-[130px] sm:max-w-sm truncate text-center min-w-0">
                          https://{project.slug}.internal
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {allImages.length > 1 && (
                            <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400 bg-neutral-950 px-1.5 sm:px-2 py-0.5 rounded border border-neutral-800">
                              <button
                                onClick={handlePrevImage}
                                className="p-0.5 hover:text-white transition-colors cursor-pointer"
                                title={t.prev}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <span>{activeImageIndex + 1}/{allImages.length}</span>
                              <button
                                onClick={handleNextImage}
                                className="p-0.5 hover:text-white transition-colors cursor-pointer"
                                title={t.next}
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
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
                      <div className="h-6 flex justify-between items-center px-4 select-none shrink-0 border-b border-neutral-800/60 pb-1">
                        <span className="font-mono text-[10px] text-neutral-400 font-medium">9:41</span>
                        <div className="w-16 h-3.5 bg-black rounded-full border border-neutral-800 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/80" />
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">5G</span>
                        </div>
                      </div>
                    )}

                    {/* Viewport Frame with Conflict-Free Internal Scroll */}
                    <div
                      onWheel={(e) => {
                        const el = e.currentTarget;
                        const hasOverflow = el.scrollHeight > el.clientHeight;
                        if (!hasOverflow) return;

                        const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
                        const isAtBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight && e.deltaY > 0;

                        // Stop propagation so inner scrolling never accidentally pulls or jerks the outer modal
                        if (!isAtTop && !isAtBottom) {
                          e.stopPropagation();
                        }
                      }}
                      className={`relative group/viewer w-full bg-neutral-950 device-viewport-scroll ${
                        effectiveDeviceView === 'desktop'
                          ? fitMode === 'fill'
                            ? 'w-full max-h-[82vh] overflow-y-auto'
                            : 'w-full max-h-[80vh] flex items-center justify-center p-2 sm:p-4 overflow-hidden'
                          : fitMode === 'fill'
                          ? 'w-full flex-1 min-h-0 overflow-y-auto rounded-b-[1.75rem]'
                          : 'w-full flex-1 min-h-0 flex items-center justify-center p-2 overflow-hidden rounded-b-[1.75rem]'
                      }`}
                    >
                      {/* Interactive Next/Prev arrows on hover inside viewer */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                            title={language === 'ua' ? 'Попередній макет' : 'Previous screen'}
                            aria-label="Previous screen"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/viewer:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xl rounded-full flex items-center justify-center"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                            title={language === 'ua' ? 'Наступний макет' : 'Next screen'}
                            aria-label="Next screen"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/viewer:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xl rounded-full flex items-center justify-center"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <img
                        src={currentImage}
                        alt={`${resolvedProjectTitle} - screen ${activeImageIndex + 1}`}
                        loading="eager"
                        decoding="async"
                        style={{
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden'
                        }}
                        className={`transition-all ${
                          effectiveDeviceView === 'desktop'
                            ? fitMode === 'fill'
                              ? 'w-full h-auto block'
                              : 'max-h-[76vh] w-auto max-w-full h-auto object-contain block mx-auto'
                            : fitMode === 'fill'
                            ? 'w-full h-auto block'
                            : 'max-h-[76vh] w-auto max-w-full h-auto object-contain block mx-auto'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Clean High-Fidelity Artwork Showcase (3D Renders, Editorial Books, Graphic Art, Branding) */
                <div className="bg-neutral-950 border border-neutral-800 p-1 sm:p-2 md:p-3 flex justify-center items-center shadow-inner rounded-sm">
                  <div className="w-full transition-all duration-300 overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 rounded-sm">
                    {/* Sleek minimal showcase bar */}
                    <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-2 sm:px-4 gap-1.5 sm:gap-2 select-none font-mono text-[11px] min-w-0 shrink-0">
                      <div className="flex items-center gap-2 truncate text-neutral-300 min-w-0 flex-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        <span className="uppercase tracking-wider font-medium truncate">
                          {resolvedProjectTitle}
                        </span>
                        <span className="text-neutral-600 hidden sm:inline">//</span>
                        <span className="text-neutral-500 uppercase tracking-widest text-[10px] hidden sm:inline shrink-0">
                          {getLocalizedText(project.categoryLabel, language, { ua: 'Візуальний макет', en: 'Visual Asset' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {allImages.length > 1 && (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400 bg-neutral-950 px-1.5 sm:px-2 py-0.5 rounded border border-neutral-800">
                            <button
                              onClick={handlePrevImage}
                              className="p-0.5 hover:text-white transition-colors cursor-pointer"
                              title={t.prev}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="text-cyan-300 font-medium">
                              {activeImageIndex + 1}/{allImages.length}
                            </span>
                            <button
                              onClick={handleNextImage}
                              className="p-0.5 hover:text-white transition-colors cursor-pointer"
                              title={t.next}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => setIsFullscreen(true)}
                          title={t.fullscreen}
                          className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                        >
                          <Expand className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Viewport Frame with Clean Undistorted Image */}
                    <div
                      className={`relative group/viewer w-full bg-neutral-950 transition-all flex items-center justify-center ${
                        fitMode === 'fill'
                          ? 'w-full h-auto min-h-[300px]'
                          : 'max-h-[82vh] p-2 sm:p-4 overflow-hidden'
                      }`}
                    >
                      {/* Interactive Next/Prev arrows on hover */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                            title={language === 'ua' ? 'Попередній макет' : 'Previous image'}
                            aria-label="Previous image"
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/viewer:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xl rounded-full flex items-center justify-center"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                            title={language === 'ua' ? 'Наступний макет' : 'Next image'}
                            aria-label="Next image"
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-black/80 hover:bg-black text-white border border-neutral-700 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover/viewer:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xl rounded-full flex items-center justify-center"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <img
                        src={currentImage}
                        alt={`${resolvedProjectTitle} - screen ${activeImageIndex + 1}`}
                        loading="eager"
                        decoding="async"
                        style={{
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden'
                        }}
                        onClick={() => setIsFullscreen(true)}
                        title={language === 'ua' ? 'Натисніть для перегляду на весь екран' : 'Click to view fullscreen'}
                        className={`transition-all duration-300 block mx-auto cursor-zoom-in select-none ${
                          fitMode === 'fill'
                            ? 'w-full h-auto max-w-full'
                            : 'max-h-[76vh] w-auto max-w-full h-auto object-contain'
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

                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar max-w-full pb-1 sm:pb-0">
                    {allImages.map((imgUrl, i) => (
                      <button
                        key={`thumb-quick-${i}`}
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
                </>
              )}
            </div>

            {/* Strategic Product Pillars: Challenge -> Solution -> Impact */}
            {(() => {
              const challengeText = getLocalizedText(project.problemStatement, language, { ua: '', en: '' });
              const solutionText = getLocalizedText(project.solution, language, { ua: '', en: '' });
              const impactText = getLocalizedText(project.businessImpact, language, { ua: '', en: '' });
              const hasPillars = Boolean(challengeText || solutionText || impactText);

              if (!hasPillars) return null;

              const pillarCount = [challengeText, solutionText, impactText].filter(Boolean).length;
              const gridCols = pillarCount === 1 ? 'grid-cols-1 max-w-2xl' : pillarCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

              return (
                <div className={`grid ${gridCols} gap-8 md:gap-12 border-t border-neutral-800 pt-12`}>
                  {/* Pillar 1: Challenge */}
                  {challengeText && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                        <span className="font-mono text-[11px] text-neutral-500">01</span>
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
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        <span className="font-mono text-[11px] text-neutral-500">02</span>
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
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="font-mono text-[11px] text-neutral-500">03</span>
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

            {/* Deep Dive Gallery: All Project Screens */}
            {allImages.length > 1 && (
              <div className="border-t border-neutral-800 pt-12 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-2xl font-medium uppercase tracking-tight">
                        {t.allScreens}
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
                      key={`deep-dive-screen-${idx}`}
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
                          alt={`${resolvedProjectTitle} - screen ${idx + 1}`}
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
                              {t.activeViewer}
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
              const rawFonts = project.designSystem?.fonts;
              const fontList: string[] = Array.isArray(rawFonts)
                ? rawFonts
                : (rawFonts && typeof rawFonts === 'object' ? (rawFonts[language] || rawFonts.ua || rawFonts.en || []) : []);

              const fontsDescription = project.designSystem?.fontsDescription;
              const colorList = project.designSystem?.colors || [];
              const colorsDescription = project.designSystem?.colorsDescription;
              const gridName = project.designSystem?.gridType || '';
              const hasDesignSystem = fontList.length > 0 || colorList.length > 0 || Boolean(fontsDescription) || Boolean(colorsDescription) || Boolean(gridName);

              if (!hasDesignSystem) return null;

              const getColorName = (name: string | { ua: string; en: string }) => {
                if (typeof name === 'object' && name !== null) {
                  return name[language] || name.ua || name.en || '';
                }
                return String(name || '');
              };

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
                    {/* Font Hierarchy Specimen & Typography Description */}
                    {(fontList.length > 0 || fontsDescription) && (
                      <div className={`bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 ${colorList.length === 0 && !colorsDescription ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                            {t.fonts}
                          </span>
                        </div>

                        {fontsDescription && (
                          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-b border-neutral-800/80 pb-3">
                            {getLocalizedText(fontsDescription, language, { ua: '', en: '' })}
                          </p>
                        )}

                        {fontList.map((f, i) => (
                          <div key={`font-${f}-${i}`} className="border-b border-neutral-800/80 last:border-0 pb-3 last:pb-0">
                            <div className="text-2xl font-semibold tracking-tight">{f}</div>
                            <div className="text-xs font-mono text-neutral-500 mt-1">
                              ABCDEFGHIJKLMOPQRSTUVWXYZ 0123456789
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Color Token Swatches & Palette Description */}
                    {(colorList.length > 0 || colorsDescription) && (
                      <div className={`bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 ${fontList.length === 0 ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                            {t.colors} {colorList.length > 0 && <span className="text-neutral-500 font-normal lowercase">(click to copy hex)</span>}
                          </span>
                        </div>

                        {colorsDescription && (
                          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-b border-neutral-800/80 pb-3">
                            {getLocalizedText(colorsDescription, language, { ua: '', en: '' })}
                          </p>
                        )}

                        {colorList.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {colorList.map((c, i) => (
                              <button
                                key={`color-${c.hex}-${i}`}
                                onClick={() => handleCopyHex(c.hex)}
                                className="group flex flex-col p-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-600 text-left transition-all cursor-pointer"
                              >
                                <div
                                  className="w-full aspect-[2/1] rounded-xs mb-2 border border-white/10"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="text-[11px] font-medium text-neutral-300 truncate">{getColorName(c.name)}</span>
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
                        )}
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-neutral-800 pt-8 w-full max-w-full">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {hasFigmaDirect && (
                  <a
                    href={figmaDirectUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#1e1e1e] hover:bg-[#282828] text-white font-medium text-xs sm:text-sm uppercase tracking-wider border border-[#a259ff]/70 hover:border-[#a259ff] transition-all cursor-pointer shadow-lg"
                  >
                    <Figma className="w-4 h-4 text-[#0acf83]" />
                    <span>{language === 'ua' ? 'Figma Макет' : 'Open in Figma'}</span>
                    <ExternalLink className="w-4 h-4 text-[#a259ff]" />
                  </a>
                )}

                {hasLiveLink && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#f4f4f0] text-[#0a0a0a] font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    <span>{t.visitLive}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 font-mono text-xs text-neutral-400 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900 min-w-0">
                <button
                  onClick={() => onSelectProject(prevProject)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 max-w-[45%] truncate min-w-0"
                  title={prevProjectTitle}
                >
                  <span className="shrink-0">←</span>
                  <span className="truncate">{prevProjectTitle}</span>
                </button>
                <span className="text-neutral-700 shrink-0">/</span>
                <button
                  onClick={() => onSelectProject(nextProject)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 max-w-[45%] truncate min-w-0 text-right justify-end"
                  title={nextProjectTitle}
                >
                  <span className="truncate">{nextProjectTitle}</span>
                  <span className="shrink-0">→</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="case-study-fullscreen-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-xl flex flex-col p-3 sm:p-6"
            onClick={() => setIsFullscreen(false)}
          >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between text-neutral-300 mb-3 px-1 sm:px-2 select-none gap-2 min-w-0 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <span className="text-white font-medium truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[260px] md:max-w-none">{resolvedProjectTitle}</span>
              <span className="text-neutral-600 hidden xs:inline">//</span>
              <span className="text-neutral-400 hidden xs:inline">{t.fullscreen}</span>
              {allImages.length > 1 && (
                <span className="text-cyan-400 font-medium ml-1 shrink-0">
                  [{activeImageIndex + 1}/{allImages.length}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Zoom 100% / Fit Toggle */}
              <button
                type="button"
                onClick={() => setFullscreenZoom(!fullscreenZoom)}
                className={`p-1.5 border font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                  fullscreenZoom
                    ? 'bg-neutral-800 text-white border-neutral-600'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
                title={fullscreenZoom ? (language === 'ua' ? 'Вмістити у вікно' : 'Fit to window') : (language === 'ua' ? '100% Масштаб (чіткість)' : '100% Actual size')}
              >
                {fullscreenZoom ? <ZoomOut className="w-3.5 h-3.5 text-cyan-400" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{fullscreenZoom ? '100%' : 'FIT'}</span>
              </button>

              {allImages.length > 1 && (
                <div className="flex items-center gap-1 font-mono text-xs bg-neutral-900 border border-neutral-800 p-0.5">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-1 sm:p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Previous screen"
                    title={language === 'ua' ? 'Попередній (←)' : 'Previous (←)'}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="px-1.5 text-[10px] sm:text-[11px] text-neutral-300 font-medium">
                    {activeImageIndex + 1}/{allImages.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-1 sm:p-1.5 hover:text-white text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Next screen"
                    title={language === 'ua' ? 'Наступний (→)' : 'Next (→)'}
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 sm:p-2 rounded-full border border-neutral-700 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image & Floating Arrows */}
          <div
            className="flex-1 w-full h-full overflow-auto custom-scrollbar flex items-start sm:items-center justify-center relative select-none"
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
              key={`${currentImage}-${activeImageIndex}`}
              src={currentImage}
              alt={`${getLocalizedText(project.title, language, { ua: 'Проєкт', en: 'Project' })} - screen ${activeImageIndex + 1}`}
              loading="eager"
              decoding="async"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              className={`transition-all duration-200 mx-auto shadow-2xl rounded-sm ${
                fullscreenZoom
                  ? 'max-w-none w-auto h-auto cursor-zoom-out'
                  : 'max-w-full h-auto max-h-none sm:max-h-[82vh] object-contain cursor-zoom-in'
              }`}
              onClick={() => setFullscreenZoom(!fullscreenZoom)}
            />
          </div>

          {/* Bottom Thumbnail Navigation in Fullscreen */}
          {allImages.length > 1 && (
            <div
              className="mt-2 flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar py-2 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((url, i) => (
                <button
                  key={`fullscreen-thumb-${i}`}
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
    </>
  );
};
