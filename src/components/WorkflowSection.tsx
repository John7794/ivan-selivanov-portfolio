import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Layers, 
  Sparkles, 
  Terminal, 
  CheckCircle2 
} from 'lucide-react';
import { Language, WorkflowStep, GeneralSettings } from '../types';
import { getLocalizedText } from '../utils/i18n';
import { playClickSound } from '../utils/audio';
import { BorderTrace } from './BorderTrace';

interface WorkflowSectionProps {
  workflow: WorkflowStep[];
  language: Language;
  ui?: GeneralSettings['ui'];
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  workflow,
  language,
  ui
}) => {
  const indexLabel = getLocalizedText(ui?.workflowIndex, language, {
    ua: '04 // WORKFLOW & PIPELINE',
    en: '04 // WORKFLOW & PIPELINE'
  });

  const sectionTitle = getLocalizedText(ui?.workflowTitle, language, {
    ua: 'Як Побудовано Робочий Процес',
    en: 'Design Execution & Delivery Pipeline'
  });

  const sectionSubtitle = getLocalizedText(ui?.workflowSubtitle, language, {
    ua: 'Прозорий та передбачуваний 4-етапний пайплайн від первинного брифу до піксель-перфект системи, інтерактивних прототипів та передачі у розробку.',
    en: 'A transparent, structured 4-phase methodology from initial briefing to pixel-perfect design tokens, interactive prototypes, and production.'
  });

  const deliverablesLabel = getLocalizedText(ui?.workflowDeliverablesLabel, language, {
    ua: 'Ключові результати:',
    en: 'Core Deliverables:'
  });

  const toolsLabel = getLocalizedText(ui?.workflowToolsLabel, language, {
    ua: 'Інструменти:',
    en: 'Tooling:'
  });

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 2:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 3:
      default:
        return <Terminal className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="workflow" className="scroll-mt-20 pt-8 pb-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#0a0a0a] text-[#f4f4f0] relative">
      <div className="max-w-[1600px] mx-auto">
        {/* Sticky Section Header (Matches top navbar glassmorphism, blur, and bottom border effect) */}
        <div className="sticky top-[58px] sm:top-[73px] z-30 bg-[#0a0a0a]/85 backdrop-blur-md -mx-6 px-6 lg:-mx-12 lg:px-12 pt-4 pb-4 mb-8 sm:mb-12 border-b border-neutral-900/90 transition-all">
          <div className="max-w-[1600px] mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
              {indexLabel}
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
              {sectionTitle}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light mt-2 max-w-2xl">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Process Pipeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {workflow.map((step, index) => {
            return (
              <motion.div
                key={`${step.id || 'wf'}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => playClickSound()}
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-[#101010]/95 hover:bg-[#141414] border border-neutral-800/80 hover:border-neutral-700 transition-all duration-500 rounded-sm overflow-hidden shadow-xl hover:shadow-2xl"
              >
                {/* Unified Perimeter Border Tracing Hover Effect (same as all other blocks) */}
                <BorderTrace color="bg-neutral-500" />

                {/* Top Number & Indicator Bar */}
                <div>
                  <div className="flex items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                        {getStepIcon(index)}
                      </div>
                      <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-neutral-200">
                        {step.stepNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                      <span>{language === 'ua' ? 'Етап' : 'Phase'}</span>
                      <span className="text-neutral-400 font-semibold">{index + 1}/4</span>
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg sm:text-xl font-medium uppercase tracking-tight text-[#f4f4f0] group-hover:text-white transition-colors mt-6 leading-snug">
                    {step.title[language] || step.title.ua || step.title.en}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                    {step.description[language] || step.description.ua || step.description.en}
                  </p>

                  {/* Deliverables List */}
                  {step.deliverables && (
                    <div className="mt-6 pt-5 border-t border-neutral-900/80 space-y-2">
                      <div className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400/80 shrink-0" />
                        <span>{deliverablesLabel}</span>
                      </div>
                      <ul className="space-y-1.5 pl-1">
                        {(step.deliverables[language] || step.deliverables.ua || []).map((item, dIdx) => (
                          <li key={`deliverable-${index}-${dIdx}`} className="text-xs text-neutral-300 flex items-start gap-2">
                            <span className="text-neutral-600 select-none">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Tools & Technologies Bar */}
                <div className="mt-8 pt-4 border-t border-neutral-800/80">
                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
                    <span>{toolsLabel}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(step.tools || []).map((tool, tIdx) => (
                      <span
                        key={`tool-${index}-${tool}-${tIdx}`}
                        className="font-mono text-[11px] px-2.5 py-1 bg-neutral-900/90 text-neutral-300 border border-neutral-800 rounded-[2px]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
