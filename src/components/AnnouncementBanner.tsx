import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Sparkles } from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';

interface AnnouncementBannerProps {
  bannerData: LegalAndBannersData['announcementBanner'];
  language: Language;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ bannerData, language }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('ivan_portfolio_announcement_dismissed') === 'true';
  });

  if (!bannerData || !bannerData.enabled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ivan_portfolio_announcement_dismissed', 'true');
  };

  const badge = bannerData.badge[language] || 'ANNOUNCEMENT';
  const text = bannerData.text[language] || '';
  const link = bannerData.link || '#contact';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#111111] border-b border-neutral-800 text-[#f4f4f0] relative z-40 overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 sm:px-6 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-[10px] tracking-widest uppercase font-semibold text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {badge}
            </span>
            <span className="truncate text-neutral-300 font-light">
              {text}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {link && (
              <a
                href={link}
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white hover:text-emerald-400 transition-colors underline underline-offset-4"
              >
                <span>{language === 'ua' ? 'Детальніше' : 'Details'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-white cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
