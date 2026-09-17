import React from 'react';
import { motion } from 'motion/react';
import { Layout, Type, Box, Cpu, Compass, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface BentoExpertiseProps {
  language: Language;
}

export const BentoExpertise: React.FC<BentoExpertiseProps> = ({ language }) => {
  const t = {
    heading: language === 'ua' ? 'Експертиза & Архітектура' : 'Expertise & Architecture',
    subtitle: language === 'ua'
      ? 'Поєднання строгості швейцарського дизайну, продуктової психології та сучасного інженерного стеку'
      : 'Bridging Swiss rationalism, cognitive psychology, and cutting-edge engineering',
    card1Title: language === 'ua' ? 'Продуктовий UI/UX та Системи' : 'Product UI/UX & Systems',
    card1Desc: language === 'ua'
      ? 'Проєктування складних B2B/Enterprise інтерфейсів, біржових терміналів, аналітичних систем та мобільних додатків. Повний цикл: від дослідження користувачів та CJM до масштабованих Design Tokens у Figma та коді.'
      : 'Architecting complex B2B/Enterprise workspaces, trading terminals, and consumer platforms. End-to-end lifecycle: user research, journey mapping to production-ready design tokens in code.',
    card2Title: language === 'ua' ? 'Швейцарська Типографіка' : 'Swiss Typography & Grids',
    card2Desc: language === 'ua'
      ? 'Математичні пропорційні сітки (DIN, ISO-216), робота з базовим інтерліньяжем, мікротипографіка та препрес-підготовка.'
      : 'Rigid proportional grids (DIN canon), baseline rhythm synchronization, micro-typography, and high-spec prepress discipline.',
    card3Title: language === 'ua' ? '3D & Просторові Концепти' : '3D & Spatial Direction',
    card3Desc: language === 'ua'
      ? 'Об’ємне моделювання, скульптурне освітлення та втілення статичних рендерів у живому веб-середовищі за допомогою шейдерів.'
      : 'Volumetric exploration, sculptural lighting, and reviving static renders in live web environments using displacement shaders.',
    card4Title: language === 'ua' ? 'UX Евристики (Nielsen & Rams)' : 'UX Heuristics & Principles',
    heuristics: [
      language === 'ua' ? 'Прозорість системного статусу' : 'Visibility of system status',
      language === 'ua' ? 'Консистентність та стандарти' : 'Consistency and platform standards',
      language === 'ua' ? 'Менше дизайну — це більше дизайну' : 'Good design is as little design as possible',
      language === 'ua' ? 'Захист від критичних помилок' : 'Error prevention over error recovery'
    ],
    techStack: language === 'ua' ? 'Технологічний стек' : 'Technology Stack'
  };

  const technologies = [
    'Figma & Tokens Studio',
    'Next.js 15 (App Router)',
    'React 19 & TypeScript',
    'Tailwind CSS v4',
    'Motion & GSAP',
    'Three.js & WebGL',
    'Adobe InDesign & Prepress',
    'Google Sheets API / Apps Script',
    'Cinema 4D & Octane'
  ];

  return (
    <section id="expertise" className="py-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#080808] text-[#f4f4f0]">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
            02 // METHODOLOGY & CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight uppercase">
            {t.heading}
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl font-light mt-4 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Product UI/UX (Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                <Layout className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">CORE DISCIPLINE</span>
            </div>

            <div>
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
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-between hover:border-neutral-700 transition-colors relative overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 text-9xl font-serif italic text-neutral-900 pointer-events-none select-none">
              Aa
            </div>

            <div className="flex justify-between items-start mb-6 z-10">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                <Type className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">SWISS CANON</span>
            </div>

            <div className="z-10">
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-3">
                {t.card2Title}
              </h3>
              <p className="text-neutral-400 font-light text-sm leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
          </motion.div>

          {/* Card 3: 3D & Spatial (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
                <Box className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">SPATIAL R&D</span>
            </div>

            <div>
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
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">PSYCHOLOGY</span>
            </div>

            <div>
              <h3 className="text-2xl font-medium uppercase tracking-tight mb-4">
                {t.card4Title}
              </h3>
              <ul className="space-y-2 text-xs font-mono text-neutral-400">
                {t.heuristics.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
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
            className="bg-[#101010] border border-neutral-800/90 p-8 md:p-10 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-400">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-neutral-500">PRODUCTION READY</span>
            </div>

            <div>
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
