import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';
import { playClickSound } from '../utils/audio';

interface BackToTopProps {
  language: Language;
}

export const BackToTop: React.FC<BackToTopProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollTop > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (scrollHeight > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const label = language === 'ua' ? 'ДО ГОРИ' : 'TOP';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label={language === 'ua' ? 'Прокрутити до гори' : 'Scroll to top'}
          title={`${label} (${scrollProgress}%)`}
          className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 group flex items-center gap-2.5 bg-[#0e0e0e]/90 hover:bg-[#161616] text-[#f4f4f0] border border-neutral-800 hover:border-neutral-600 px-3.5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer select-none"
        >
          {/* Subtle scroll progress ring */}
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="#262626"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="#f4f4f0"
                strokeWidth="2"
                strokeDasharray="56.54"
                strokeDashoffset={56.54 - (56.54 * scrollProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </svg>
            <ArrowUp className="w-3 h-3 absolute group-hover:-translate-y-0.5 transition-transform text-[#f4f4f0]" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-300 group-hover:text-white transition-colors">
            {label}
          </span>
          <span className="font-mono text-[9px] text-neutral-500 tabular-nums">
            {scrollProgress}%
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
