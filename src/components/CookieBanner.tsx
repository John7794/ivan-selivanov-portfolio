import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { playClickSound } from '../utils/audio';

interface CookieBannerProps {
  language: Language;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ivan_portfolio_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    playClickSound();
    localStorage.setItem('ivan_portfolio_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    playClickSound();
    localStorage.setItem('ivan_portfolio_cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-6 right-6 md:left-12 md:right-auto md:max-w-lg z-50 bg-[#0e0e0e]/95 backdrop-blur-md border border-neutral-800 text-[#f4f4f0] p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3 mb-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              PRIVACY & COMPLIANCE // GDPR & ЗУ «ПРО ЗАХИСТ ПЕРСОНАЛЬНИХ ДАНИХ»
            </span>
            <h4 className="text-sm font-medium uppercase tracking-tight text-white mt-0.5">
              {language === 'ua' ? 'Конфіденційність & Файли Cookie' : 'Data Privacy & Analytical Cookies'}
            </h4>
          </div>
        </div>

        <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
          {language === 'ua'
            ? 'Ми використовуємо анонімні технічні та аналітичні файли cookie для покращення взаємодії, вимірювання залученості з 3D-шейдерами та забезпечення швидкої роботи сайту.'
            : 'We utilize strictly essential and aggregated telemetry cookies to benchmark WebGL performance and optimize user journeys, without storing personal identifiable tracking data.'}
        </p>

        {showDetails && (
          <div className="text-[11px] font-mono text-neutral-400 border-t border-neutral-800 pt-3 mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>● Essential Security & Local Storage:</span>
              <span className="text-emerald-400">Mandatory</span>
            </div>
            <div className="flex items-center justify-between">
              <span>● GTM WebGL / Scroll Telemetry:</span>
              <span className="text-neutral-300">Optional</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
          >
            {showDetails ? (language === 'ua' ? 'Згорнути' : 'Less') : (language === 'ua' ? 'Параметри' : 'Preferences')}
          </button>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 cursor-pointer"
            >
              {language === 'ua' ? 'Тільки базові' : 'Essential Only'}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 bg-[#f4f4f0] text-black font-semibold hover:bg-white cursor-pointer"
            >
              {language === 'ua' ? 'Прийняти всі' : 'Accept All'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
