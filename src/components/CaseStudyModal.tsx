import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Check, Copy, Laptop, Smartphone, ExternalLink, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
    next: language === 'ua' ? 'Наступний' : 'Next'
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
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-neutral-400">
                <span>INTERACTIVE VISUAL EXPERIENCE</span>
                {project.category === 'ui-ux' && (
                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1">
                    <button
                      onClick={() => setDeviceView('desktop')}
                      className={`px-2 py-1 flex items-center gap-1.5 cursor-pointer ${
                        deviceView === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setDeviceView('mobile')}
                      className={`px-2 py-1 flex items-center gap-1.5 cursor-pointer ${
                        deviceView === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Format-Specific Render */}
              {project.category === '3d-render' ? (
                <Interactive3DViewer
                  imageUrl={project.thumbnailUrl}
                  title={project.title}
                />
              ) : project.category === 'book-design' ? (
                <BookSpreadViewer
                  imageUrl={project.thumbnailUrl}
                />
              ) : (
                /* UI/UX Simulated Interactive Device Frame */
                <div className="bg-neutral-950 border border-neutral-800 p-4 md:p-8 flex justify-center items-center shadow-inner">
                  <div
                    className={`transition-all duration-500 overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-900 ${
                      deviceView === 'desktop'
                        ? 'w-full max-w-4xl aspect-[16/10] rounded-t-lg'
                        : 'w-[320px] aspect-[9/19] rounded-3xl p-2 border-4 border-neutral-700'
                    }`}
                  >
                    {/* Simulated browser/device chrome */}
                    {deviceView === 'desktop' ? (
                      <div className="h-7 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <div className="mx-auto bg-neutral-950 px-6 py-0.5 rounded text-[10px] font-mono text-neutral-400">
                          https://{project.slug}.internal/terminal
                        </div>
                      </div>
                    ) : (
                      <div className="h-4 flex justify-center items-center">
                        <div className="w-16 h-2 bg-neutral-700 rounded-full" />
                      </div>
                    )}
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Strategic Product Pillars: Challenge -> Solution -> Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-neutral-800 pt-12">
              {/* Pillar 1: Challenge */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-red-400 border border-red-500/40 px-2 py-0.5">01 // CHALLENGE</span>
                </div>
                <h3 className="text-xl font-medium uppercase tracking-tight">{t.challenge}</h3>
                <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                  {project.problemStatement[language]}
                </p>
              </div>

              {/* Pillar 2: Solution */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan-400 border border-cyan-500/40 px-2 py-0.5">02 // SOLUTION</span>
                </div>
                <h3 className="text-xl font-medium uppercase tracking-tight">{t.solution}</h3>
                <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                  {project.solution[language]}
                </p>
              </div>

              {/* Pillar 3: Impact */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-emerald-400 border border-emerald-500/40 px-2 py-0.5">03 // IMPACT</span>
                </div>
                <h3 className="text-xl font-medium uppercase tracking-tight">{t.impact}</h3>
                <p className="text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                  {project.businessImpact[language]}
                </p>
              </div>
            </div>

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

            {/* Design Tokens & Typography Specimen */}
            <div className="border-t border-neutral-800 pt-12 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-medium uppercase tracking-tight">{t.designSystem}</h3>
                <span className="font-mono text-xs text-neutral-500">
                  {project.designSystem.gridType || 'Swiss Modular Grid'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Font Hierarchy Specimen */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-6 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                    {t.fonts}
                  </span>
                  {project.designSystem.fonts.map((f, i) => (
                    <div key={i} className="border-b border-neutral-800/80 pb-3">
                      <div className="text-2xl font-semibold tracking-tight">{f}</div>
                      <div className="text-xs font-mono text-neutral-500 mt-1">
                        ABCDEFGHIJKLMOPQRSTUVWXYZ 0123456789
                      </div>
                    </div>
                  ))}
                </div>

                {/* Color Token Swatches */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-6 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                    {t.colors} (Click to copy hex)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.designSystem.colors.map((c, i) => (
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
              </div>
            </div>

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
    </AnimatePresence>
  );
};
