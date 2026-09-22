import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { ExperienceItem, Language } from '../types';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
  language: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experience, language }) => {
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
    title: language === 'ua' ? 'Кар’єрний Шлях & Досвід' : 'Career Track & Background',
    subtitle: language === 'ua'
      ? 'Хронологія комерційних проєктів, артдирекції та фундаментальної академічної школи'
      : 'Timeline of design leadership, commercial execution, and academic honors',
    present: language === 'ua' ? 'Зараз' : 'Present'
  };

  return (
    <section 
      id="experience" 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#0a0a0a] text-[#f4f4f0]"
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
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
            03 // TRACK RECORD
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight uppercase">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl font-light mt-4 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Timeline List */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 md:before:left-1/2 before:w-[1px] before:bg-neutral-800">
          {experience.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start ${
                  isLeft ? 'md:flex-row-reverse' : ''
                } gap-8 md:gap-16`}
              >
                {/* Center Node Marker */}
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-[#0a0a0a] border-2 border-neutral-600 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Content Box */}
                <div className="ml-10 md:ml-0 w-full md:w-[calc(50%-2rem)] bg-[#121212] border border-neutral-800/90 p-6 md:p-8 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-3">
                    <span className="flex items-center gap-2">
                      {item.type === 'art-direction' ? (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      ) : item.type === 'education' ? (
                        <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className="uppercase tracking-wider">{item.company[language]}</span>
                    </span>
                    <span>
                      {item.period[language]}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-medium tracking-tight uppercase text-white mb-2">
                    {item.role[language]}
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 block mb-4">
                    {item.location[language]}
                  </span>

                  {item.description[language]?.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {item.description[language].map((desc, dIdx) => (
                        <li key={dIdx} className="text-neutral-400 text-sm font-light leading-relaxed flex items-start gap-2">
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
                          key={tIdx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
