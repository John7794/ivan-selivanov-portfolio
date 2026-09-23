import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield } from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';
import { playClickSound } from '../utils/audio';

interface CookieBannerProps {
  language: Language;
  cookieData?: LegalAndBannersData['cookieBanner'];
  onOpenPrivacy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ language, cookieData, onOpenPrivacy }) => {
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

  const title = cookieData?.title[language] || (language === 'ua' ? 'Конфіденційність & Cookies' : 'Privacy & Cookie Preferences');
  const desc = cookieData?.description[language] || (language === 'ua'
    ? 'Цей веб-сайт використовує виключно локальне сховище (LocalStorage) для збереження мови інтерфейсу (UA/EN), режиму сітки та мінімальної телеметрії рендерингу. Жодних сторонніх рекламних трекерів або продажу даних.'
    : 'This portfolio utilizes local browser storage strictly to preserve your selected interface language (UA/EN), grid layout density, and shader performance telemetry. Zero third-party ad trackers or commercial data sharing.');

  const acceptAllText = cookieData?.acceptAll[language] || (language === 'ua' ? 'Прийняти всі' : 'Accept All');
  const essentialOnlyText = cookieData?.onlyNecessary[language] || (language === 'ua' ? 'Лише необхідні' : 'Essential Only');
  const policyLinkText = cookieData?.policyLink[language] || (language === 'ua' ? 'Політика' : 'Policy');
  const analyticsLabel = cookieData?.analyticsLabel[language] || (language === 'ua' ? 'Аналітика рендерингу' : 'Render Telemetry');
  const analyticsDesc = cookieData?.analyticsDesc[language] || (language === 'ua' ? 'Анонімізовані метрики швидкості завантаження шейдерів' : 'Anonymized shader frame rates');
  const preferencesLabel = cookieData?.preferencesLabel[language] || (language === 'ua' ? 'Локальні параметри' : 'Client Preferences');
  const preferencesDesc = cookieData?.preferencesDesc[language] || (language === 'ua' ? 'Збереження активної мови та типу сітки' : 'Language and grid density state');

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
              {title}
            </h4>
          </div>
        </div>

        <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
          {desc}
        </p>

        {showDetails && (
          <div className="text-[11px] font-mono text-neutral-400 border-t border-neutral-800 pt-3 mb-4 space-y-2.5">
            <div>
              <div className="flex items-center justify-between text-white font-medium">
                <span>● {preferencesLabel}:</span>
                <span className="text-emerald-400">LocalStorage</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">{preferencesDesc}</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-white font-medium">
                <span>● {analyticsLabel}:</span>
                <span className="text-neutral-400">Optional</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-0.5">{analyticsDesc}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
            >
              {showDetails ? (language === 'ua' ? 'Згорнути' : 'Less') : (language === 'ua' ? 'Параметри' : 'Preferences')}
            </button>
            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[11px] font-mono text-neutral-400 hover:text-emerald-400 underline cursor-pointer"
              >
                {policyLinkText}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 cursor-pointer transition-colors"
            >
              {essentialOnlyText}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 bg-[#f4f4f0] text-black font-semibold hover:bg-white cursor-pointer transition-colors"
            >
              {acceptAllText}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
