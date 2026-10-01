import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { ExperienceItem, Language, GeneralSettings } from '../types';
import { BorderTrace } from './BorderTrace';
import { getLocalizedText, getLocalizedArray } from '../utils/i18n';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  language: Language;
  ui?: GeneralSettings['ui'];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experience, language, ui }) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const t = {
    index: getLocalizedText(ui?.experienceIndex, language, { ua: '03 // TRACK RECORD', en: '03 // TRACK RECORD' }),
    title: getLocalizedText(ui?.experienceTitle, language, {
      ua: 'Кар’єрний Шлях & Досвід',
      en: 'Career Track & Background'
    }),
    subtitle: getLocalizedText(ui?.experienceSubtitle, language, {
      ua: 'Хронологія комерційних проєктів, артдирекції та фундаментальної академічної школи',
      en: 'Timeline of design leadership, commercial execution, and academic honors'
    }),
    present: language === 'ua' ? 'Зараз' : 'Present'
  };

  return (
    <section 
      id="experience" 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative scroll-mt-20 pt-8 pb-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#0a0a0a] text-[#f4f4f0]"
    >
      {/* Subtle background ambient grid with softened spotlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Base ambient grid - softened */}
        <div
          className="w-full h-full opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)',
            backgroundSize: '5rem 5rem'
          }}
        />

        {/* Soft interactive illuminated grid layer with radial spotlight */}
        <div
          className="w-full h-full absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 0.6 : 0,
            backgroundImage:
              'linear-gradient(#444444 1px, transparent 1px), linear-gradient(90deg, #444444 1px, transparent 1px)',
            backgroundSize: '5rem 5rem',
            maskImage: `radial-gradient(340px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)`,
            WebkitMaskImage: `radial-gradient(340px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)`,
          }}
        />

        {/* Delicate ambient aura */}
        <div
          className="w-full h-full absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 0.2 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.02), transparent 70%)`
          }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Sticky Section Header (Matches top navbar glassmorphism, blur, and bottom border effect) */}
        <div className="sticky top-[58px] sm:top-[73px] z-30 bg-[#0a0a0a]/85 backdrop-blur-md -mx-6 px-6 lg:-mx-12 lg:px-12 pt-4 pb-4 mb-8 sm:mb-12 border-b border-neutral-900/90 transition-all">
          <div className="max-w-[1600px] mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
              {t.index}
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
              {t.title}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light mt-2 max-w-2xl">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Timeline List: Desktop has centered vertical rail from first to last node; Mobile has full-width cards connected by unbroken vertical axis */}
        <div className="space-y-0 md:space-y-8 relative before:hidden md:before:block md:before:absolute md:before:top-[34px] md:before:bottom-[34px] md:before:left-1/2 md:before:w-[1px] md:before:bg-neutral-800">
          {experience.map((item, idx) => {
            const isCardOnRight = idx % 2 === 0;

            return (
              <React.Fragment key={`${item.id || 'exp'}-${idx}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isCardOnRight ? 'md:flex-row-reverse' : ''
                  } gap-0 md:gap-16 w-full`}
                >
                  {/* Desktop Center Node Marker & Seamless Axis Connector */}
                  <div className="hidden md:flex absolute md:left-1/2 -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#0a0a0a] border-2 border-neutral-500 items-center justify-center z-20 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  </div>

                  {/* Desktop Horizontal Branch: Spans with 0px gap from central node directly into the card's edge */}
                  <div 
                    aria-hidden="true"
                    className={`hidden md:block absolute top-[34px] h-[1px] bg-neutral-700 z-10 ${
                      isCardOnRight 
                        ? 'left-1/2 w-8' 
                        : 'right-1/2 w-8'
                    }`} 
                  />

                  {/* Content Box (Symmetrically centered on mobile without left shift, 50% on desktop) */}
                  <div className="group relative w-full md:w-[calc(50%-2rem)] bg-[#101010]/95 hover:bg-[#141414] border border-neutral-800/80 transition-colors duration-500 rounded-sm overflow-hidden p-5 sm:p-7 md:p-8 shadow-xl hover:shadow-2xl">
                    {/* Unified Signature Perimeter Border Tracing Hover Effect */}
                    <BorderTrace color="bg-neutral-500" />

                    <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-3 gap-2">
                      <span className="flex items-center gap-2 min-w-0">
                        {/* Mobile Chronological Node Marker */}
                        <span className="md:hidden flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" />
                        <span className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 shrink-0">
                          {item.type === 'art-direction' ? (
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          ) : item.type === 'education' ? (
                            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </span>
                        <span className="uppercase tracking-wider truncate font-medium text-neutral-200">
                          {getLocalizedText(item.company, language, { ua: 'Studio', en: 'Studio' })}
                        </span>
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded-[2px] bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
                        {getLocalizedText(item.period, language, { ua: '2022 — Зараз', en: '2022 — Present' })}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight uppercase text-white mb-2 leading-snug">
                      {getLocalizedText(item.role, language, { ua: 'Дизайнер', en: 'Designer' })}
                    </h3>
                    <span className="text-xs font-mono text-neutral-500 block mb-4">
                      {getLocalizedText(item.location, language, { ua: 'Львів, Україна', en: 'Lviv, Ukraine' })}
                    </span>

                    {getLocalizedArray(item.description, language, { ua: [], en: [] }).length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {getLocalizedArray(item.description, language, { ua: [], en: [] }).map((desc, dIdx) => (
                          <li key={`desc-${idx}-${dIdx}`} className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed flex items-start gap-2">
                            <span className="text-neutral-600 select-none">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-800/80">
                        {item.technologies.map((tech, tIdx) => (
                          <span
                            key={`tech-${idx}-${tech}-${tIdx}`}
                            className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Continuous chronological axis connector between cards on mobile - spans directly from bottom of card to top of next card */}
                {idx < experience.length - 1 && (
                  <div className="md:hidden w-full flex justify-center h-8 relative z-0" aria-hidden="true">
                    <div className="w-[1px] h-full bg-neutral-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
