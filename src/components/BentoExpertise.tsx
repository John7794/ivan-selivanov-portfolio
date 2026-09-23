import React from 'react';
import { motion } from 'motion/react';
import { Layout, Type, Box, Cpu, Compass, CheckCircle2 } from 'lucide-react';
import { Language, GeneralSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/defaultData';
import { AnimatedDivider } from './AnimatedDivider';

interface BentoExpertiseProps {
  language: Language;
  expertise?: GeneralSettings['expertise'];
}

// Helper to remove any FigJam mention from text
const removeFigJam = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\s*(?:та|and|,)\s*FigJam\b/gi, '')
    .replace(/\bFigJam\s*(?:та|and|,)?\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const BentoExpertise: React.FC<BentoExpertiseProps> = ({ language, expertise = DEFAULT_SETTINGS.expertise }) => {
  const data = expertise || DEFAULT_SETTINGS.expertise!;

  const t = {
    heading: data.heading[language],
    subtitle: data.subtitle[language],
    card1Title: data.card1Title[language],
    card1Desc: removeFigJam(data.card1Desc[language]),
    card2Title: data.card2Title[language],
    card2Desc: removeFigJam(data.card2Desc[language]),
    card3Title: data.card3Title[language],
    card3Desc: removeFigJam(data.card3Desc[language]),
    card4Title: data.card4Title[language],
    heuristics: data.heuristics[language],
    techStack: data.techStackTitle[language]
  };

  const rawTechnologies = data.techStackItems || DEFAULT_SETTINGS.expertise!.techStackItems;
  const technologies = rawTechnologies.filter(tech => !tech.toLowerCase().includes('figjam'));

  return (
    <section id="expertise" className="scroll-mt-20 pt-8 pb-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#080808] text-[#f4f4f0] relative">
      <div className="max-w-[1600px] mx-auto">
        {/* Sticky Section Header */}
        <div className="sticky top-[58px] sm:top-[73px] z-30 bg-[#080808]/95 backdrop-blur-md -mx-6 px-6 lg:-mx-12 lg:px-12 pt-4 pb-0 mb-12 transition-all">
          <div className="max-w-[1600px] mx-auto pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
              02 // METHODOLOGY & CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
              {t.heading}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light mt-2 max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          {/* Animated divider line with gentle moving glint reflection */}
          <AnimatedDivider />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Product UI/UX (Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Layout className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">CORE DISCIPLINE</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight mb-4">
                {t.card1Title}
              </h3>
              <p className="text-neutral-400 font-light leading-relaxed max-w-2xl text-base md:text-lg">
                {t.card1Desc}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Typography (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors relative overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 text-9xl font-serif italic text-neutral-900 pointer-events-none select-none">
              Aa
            </div>

            <div className="flex justify-between items-start mb-6 z-10">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                <Type className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">SWISS CANON</span>
            </div>

            <div className="z-10 flex-1">
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-3">
                {t.card2Title}
              </h3>
              <p className="text-neutral-400 font-light text-sm leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
          </motion.div>

          {/* Card 3: 3D & Spatial / Web dev (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Box className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">SPATIAL R&D</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-3">
                {t.card3Title}
              </h3>
              <p className="text-neutral-400 font-light text-sm leading-relaxed">
                {t.card3Desc}
              </p>
            </div>
          </motion.div>

          {/* Card 4: UX Heuristics & Principles (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400 shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">PSYCHOLOGY</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-2">
                {t.card4Title}
              </h3>
              {data.card4Desc && (
                <p className="text-neutral-400 font-light text-xs leading-relaxed mb-3">
                  {removeFigJam(data.card4Desc[language])}
                </p>
              )}
              <ul className="space-y-1.5 text-xs font-mono text-neutral-300">
                {t.heuristics.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 5: Technology Stack (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-start hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-400 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">PRODUCTION READY</span>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-4">
                {t.techStack}
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
