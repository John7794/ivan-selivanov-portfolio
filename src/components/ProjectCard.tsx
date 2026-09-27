import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Box, BookOpen, Layers, Images, Figma } from 'lucide-react';
import { Project, Language, GeneralSettings } from '../types';
import { getLocalizedText } from '../utils/i18n';
import { getFigmaDirectUrl } from '../utils/figma';

interface ProjectCardProps {
  project: Project;
  index: number;
  featuredIndex?: number;
  language: Language;
  onSelect: (project: Project) => void;
  isBentoGrid?: boolean;
  ui?: GeneralSettings['ui'];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  featuredIndex = 0,
  language,
  onSelect,
  isBentoGrid = false,
  ui
}) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const featuredText = getLocalizedText(ui?.badgeFeatured, language, { ua: 'Флагман', en: 'Featured' });
  const viewCaseText = getLocalizedText(ui?.cardViewCase, language, { ua: 'Відкрити кейс', en: 'View Case' });

  const getStatusText = () => {
    if (project.statusBadgeLabel) {
      return getLocalizedText(project.statusBadgeLabel, language, { ua: 'Продакшн', en: 'Production' });
    }
    if (project.status === 'realized') {
      return getLocalizedText(ui?.badgeProduction, language, { ua: 'Продакшн', en: 'Production' });
    }
    if (project.status === 'concept') {
      return getLocalizedText(ui?.badgeConcept, language, { ua: 'Концепт', en: 'Concept' });
    }
    if (project.statusLabel) {
      return getLocalizedText(project.statusLabel, language, { ua: project.status, en: project.status });
    }
    return language === 'ua' ? 'Продакшн' : 'Production';
  };

  const getCategoryIcon = () => {
    switch (project.category) {
      case '3d-render':
        return <Box className="w-3.5 h-3.5 text-cyan-400" />;
      case 'book-design':
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'ui-ux':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  // Organic varied aspect ratios based on category & layout mode
  const getAspectRatioClass = () => {
    if (isBentoGrid) {
      if (project.isFeatured) {
        return 'aspect-[16/9] sm:aspect-[21/10] md:aspect-[16/9]';
      }
      return 'aspect-[4/3]';
    }
    if (project.category === 'book-design') {
      return 'aspect-[3/4]';
    }
    if (project.category === '3d-render') {
      return 'aspect-[16/11]';
    }
    if (project.category === 'ui-ux') {
      return index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[10/13]';
    }
    // Default rhythm variations for Masonry
    const ratios = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[1/1]', 'aspect-[10/13]'];
    return ratios[index % ratios.length];
  };

  const imagesList = React.useMemo(() => {
    const list: string[] = [];
    if (project.thumbnailUrl) list.push(project.thumbnailUrl);
    if (Array.isArray(project.galleryUrls)) {
      project.galleryUrls.forEach((u) => {
        if (u && !list.includes(u)) list.push(u);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600'];
  }, [project]);

  const currentDisplayImage = imagesList[activePreviewIndex] || imagesList[0];

  const isChessRight = isBentoGrid && project.isFeatured && (featuredIndex % 2 === 1);
  const bentoSpanClass = isBentoGrid
    ? project.isFeatured
      ? isChessRight
        ? 'md:col-span-2 lg:col-span-2 lg:col-start-2'
        : 'md:col-span-2 lg:col-span-2 lg:col-start-1'
      : 'col-span-1'
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActivePreviewIndex(0);
      }}
      onClick={() => onSelect(project)}
      style={{ WebkitColumnBreakInside: 'avoid', pageBreakInside: 'avoid', breakInside: 'avoid' }}
      className={`group relative cursor-pointer flex flex-col bg-[#101010]/95 hover:bg-[#141414] border border-neutral-800/80 transition-colors duration-500 rounded-sm overflow-hidden p-3 sm:p-4 shadow-xl hover:shadow-2xl select-none ${
        isBentoGrid ? 'mb-0 h-full' : 'mb-6 sm:mb-8'
      } ${bentoSpanClass}`}
    >
      {/* Smooth Perimeter Border Tracing Effect on Hover (Subtle Neutral Line) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 h-[1px] w-full bg-neutral-600 transform origin-left transition-transform duration-300 ease-out z-10 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{
          transitionDelay: isHovered ? '0ms' : '450ms',
        }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 right-0 w-[1px] h-full bg-neutral-600 transform origin-top transition-transform duration-300 ease-out z-10 ${
          isHovered ? 'scale-y-100' : 'scale-y-0'
        }`}
        style={{
          transitionDelay: isHovered ? '150ms' : '300ms',
        }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 right-0 h-[1px] w-full bg-neutral-600 transform origin-right transition-transform duration-300 ease-out z-10 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{
          transitionDelay: isHovered ? '300ms' : '150ms',
        }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 w-[1px] h-full bg-neutral-600 transform origin-bottom transition-transform duration-300 ease-out z-10 ${
          isHovered ? 'scale-y-100' : 'scale-y-0'
        }`}
        style={{
          transitionDelay: isHovered ? '450ms' : '0ms',
        }}
      />

      {/* Top Bento Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 font-mono text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-white font-medium">0{index + 1}</span>
          <span className="text-neutral-600">//</span>
          <span className="uppercase tracking-wider text-neutral-400 truncate">
            {getLocalizedText(project.categoryLabel, language, { ua: 'UI/UX Продукт', en: 'UI/UX Product' })}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {project.isFeatured && (
            <span className="text-[9px] font-mono text-amber-300 uppercase tracking-widest hidden xs:inline">
              ★ {featuredText}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            {getLocalizedText(project.timeline, language, { ua: '2024', en: '2024' })}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              project.status === 'realized' ? 'bg-emerald-400' : 'bg-neutral-600'
            }`}
          />
        </div>
      </div>

      {/* Visual Pinterest Container */}
      <div
        className={`relative w-full ${getAspectRatioClass()} bg-neutral-950 overflow-hidden border border-neutral-800/80 group-hover:border-neutral-600/70 transition-colors`}
      >
        {/* Floating Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {project.isFeatured && (
              <span className="bg-amber-400/10 text-amber-300 px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono border border-amber-400/30 flex items-center gap-1 shadow-md">
                <span>★</span>
                <span>{featuredText}</span>
              </span>
            )}

            <span className="bg-black/85 backdrop-blur-md text-white px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono border border-neutral-700/80 flex items-center gap-1.5 shadow-md">
              {getCategoryIcon()}
              <span>{getLocalizedText(project.categoryLabel, language, { ua: 'UI/UX Продукт', en: 'UI/UX Product' })}</span>
            </span>

            <span
              className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-mono border shadow-md ${
                project.status === 'realized'
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                  : 'bg-neutral-900/90 text-neutral-400 border-neutral-700'
              }`}
            >
              {getStatusText()}
            </span>

            {(project.figmaUrl || project.figmaEmbedUrl) && (
              <span className="bg-[#1e1e1e]/95 backdrop-blur-md text-[#0acf83] px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono border border-[#0acf83]/40 flex items-center gap-1 shadow-md">
                <Figma className="w-3 h-3 text-[#a259ff]" />
                <span className="text-white font-medium">Figma</span>
              </span>
            )}
          </div>

          {imagesList.length > 1 && (
            <span className="bg-black/90 backdrop-blur-md text-cyan-300 px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono border border-cyan-500/40 flex items-center gap-1 shadow-md shrink-0">
              <Images className="w-3 h-3 text-cyan-400" />
              <span>
                {activePreviewIndex + 1}/{imagesList.length}
              </span>
            </span>
          )}
        </div>

        {/* Floating "View Case" button appearing on hover like Pinterest */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 flex items-center justify-center">
          <div className="bg-white text-black font-mono text-xs uppercase tracking-wider font-medium px-4 py-2 border border-white flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span>{viewCaseText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Main Artwork Image */}
        <img
          src={currentDisplayImage}
          alt={getLocalizedText(project.title, language, { ua: 'Проєкт', en: 'Project' })}
          loading="lazy"
          className={`w-full h-full object-cover ${
            project.category === 'ui-ux' ? 'object-top' : 'object-center'
          } filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[0.16,1,0.3,1]`}
        />

        {/* Pinterest-like Multi-image preview dots/thumbnails bar on hover */}
        {imagesList.length > 1 && (
          <div
            className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-center gap-1.5 p-1 bg-black/75 backdrop-blur-md border border-neutral-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {imagesList.slice(0, 5).map((img, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActivePreviewIndex(i)}
                onClick={() => setActivePreviewIndex(i)}
                className={`w-6 h-4 border overflow-hidden cursor-pointer transition-all ${
                  activePreviewIndex === i
                    ? 'border-cyan-400 scale-110 shadow-sm'
                    : 'border-neutral-700 opacity-60 hover:opacity-100'
                }`}
                title={`Screen ${i + 1}`}
              >
                <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {imagesList.length > 5 && (
              <span className="font-mono text-[9px] text-neutral-400 pl-1">
                +{imagesList.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bento Card Meta Information */}
      <div className="pt-3.5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-medium uppercase tracking-tight text-neutral-100 group-hover:text-white transition-colors leading-tight">
              {getLocalizedText(project.title, language, { ua: 'Без назви', en: 'Untitled' })}
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-light mt-1.5 line-clamp-2 leading-relaxed">
              {getLocalizedText(project.tagline, language, { ua: '', en: '' })}
            </p>
          </div>

          <div className="w-8 h-8 shrink-0 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Bento Footer Tags (Tools Used & Figma Action) */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {project.toolsUsed && project.toolsUsed.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
              {project.toolsUsed.slice(0, 3).map((tool, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] px-2 py-0.5 bg-neutral-900/90 text-neutral-400 border border-neutral-800"
                >
                  {tool}
                </span>
              ))}
              {project.toolsUsed.length > 3 && (
                <span className="font-mono text-[10px] text-neutral-500">
                  +{project.toolsUsed.length - 3}
                </span>
              )}
            </div>
          )}

          {(() => {
            const figmaDirectUrl = getFigmaDirectUrl(project);
            if (!figmaDirectUrl) return null;
            return (
              <a
                href={figmaDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={language === 'ua' ? 'Відкрити макет у Figma' : 'Open in Figma'}
                className="shrink-0 font-mono text-[10px] px-2 py-0.5 bg-[#1e1e1e] hover:bg-[#252525] text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#a259ff]/60 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Figma className="w-3 h-3 text-[#f24e1e]" />
                <span>{language === 'ua' ? 'Figma' : 'Figma'}</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-neutral-400" />
              </a>
            );
          })()}
        </div>
      </div>
    </motion.article>
  );
};

