import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  ArrowUpRight, 
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { Language, FAQItem, GeneralSettings } from '../types';
import { getLocalizedText } from '../utils/i18n';
import { playClickSound } from '../utils/audio';
import { BorderTrace } from './BorderTrace';

interface FAQSectionProps {
  faq: FAQItem[];
  language: Language;
  ui?: GeneralSettings['ui'];
  contactEmail?: string;
  telegram?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faq,
  language,
  ui,
  contactEmail,
  telegram
}) => {
  const [openIds, setOpenIds] = useState<string[]>([faq[0]?.id || 'faq-1']);

  const toggleItem = (id: string) => {
    playClickSound();
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const indexLabel = getLocalizedText(ui?.faqIndex, language, {
    ua: '05 // FREQUENTLY ASKED QUESTIONS',
    en: '05 // FREQUENTLY ASKED QUESTIONS'
  });

  const sectionTitle = getLocalizedText(ui?.faqTitle, language, {
    ua: 'Часті Запитання & Умови Співпраці',
    en: 'Frequently Asked Questions & Terms'
  });

  const sectionSubtitle = getLocalizedText(ui?.faqSubtitle, language, {
    ua: 'Відповіді на ключові організаційні, технічні та юридичні питання перед стартом спільної роботи над проєктом.',
    en: 'Direct answers on engagement models, confidentiality, developer handoff, and turnaround times.'
  });

  const promptText = getLocalizedText(ui?.faqContactPrompt, language, {
    ua: 'Залишились додаткові питання щодо вашого проєкту?',
    en: 'Have specific questions about your upcoming product?'
  });

  const ctaText = getLocalizedText(ui?.faqContactCta, language, {
    ua: 'Написати напряму',
    en: 'Get In Touch Directly'
  });

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playClickSound();
    const element = document.getElementById('contact');
    if (element) {
      const navOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="faq" className="scroll-mt-20 pt-8 pb-24 px-6 lg:px-12 border-t border-neutral-900 bg-[#0a0a0a] text-[#f4f4f0] relative">
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

        {/* Accordions List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faq.map((item, idx) => {
            const isOpen = openIds.includes(item.id);
            const questionText = item.question[language] || item.question.ua || item.question.en;
            const answerText = item.answer[language] || item.answer.ua || item.answer.en;
            const itemNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <div
                key={`${item.id || 'faq'}-${idx}`}
                className={`group relative border transition-all duration-300 rounded-sm overflow-hidden ${
                  isOpen 
                    ? 'border-neutral-700 bg-[#121212] shadow-2xl' 
                    : 'border-neutral-800/80 bg-[#101010]/95 hover:bg-[#141414] hover:border-neutral-700'
                }`}
              >
                {/* Unified Perimeter Border Tracing Hover Effect */}
                <BorderTrace color="bg-neutral-500" />

                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors select-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-500 shrink-0">
                      {itemNumber} //
                    </span>
                    <span className={`text-base sm:text-lg font-medium transition-colors ${
                      isOpen ? 'text-white' : 'text-neutral-200 group-hover:text-white'
                    }`}>
                      {questionText}
                    </span>
                  </div>

                  <div className={`p-2 rounded bg-neutral-900 border border-neutral-800 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-neutral-800 border-neutral-700 text-white' : 'text-neutral-400'
                  }`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`faq-content-${item.id || idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-neutral-800/60 ml-0 sm:ml-12 mr-2">
                        <div className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-line space-y-2">
                          {answerText}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Callout */}
        <div className="group relative max-w-4xl mx-auto mt-12 sm:mt-16 p-6 sm:p-8 bg-[#101010]/95 hover:bg-[#141414] border border-neutral-800/80 transition-colors duration-500 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl hover:shadow-2xl overflow-hidden">
          <BorderTrace color="bg-neutral-500" />

          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm shrink-0">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-medium text-white">
                {promptText}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                {language === 'ua' ? 'Швидка відповідь протягом 2–4 годин' : 'Typically replies within 2–4 hours'}
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={scrollToContact}
            className="flex items-center gap-3 px-6 py-3.5 bg-[#f4f4f0] text-black hover:bg-white text-xs font-mono uppercase tracking-wider font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shrink-0 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
