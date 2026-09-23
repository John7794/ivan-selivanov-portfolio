import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Check, Copy } from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';
import { DEFAULT_LEGAL_AND_BANNERS } from '../data/defaultData';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
  language: Language;
  legalData?: LegalAndBannersData;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'privacy',
  language: initialLanguage,
  legalData
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [copiedLink, setCopiedLink] = useState(false);

  const data = legalData || DEFAULT_LEGAL_AND_BANNERS;
  const privacy = data.privacyPolicy || DEFAULT_LEGAL_AND_BANNERS.privacyPolicy;
  const terms = data.termsOfUse || DEFAULT_LEGAL_AND_BANNERS.termsOfUse;

  useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc]);

  useEffect(() => {
    setLang(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${activeDoc}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const t = {
    privacyTab: privacy.title[lang] || (lang === 'ua' ? 'Політика конфіденційності' : 'Privacy Policy'),
    termsTab: terms.title[lang] || (lang === 'ua' ? 'Умови використання' : 'Terms of Use'),
    close: lang === 'ua' ? 'Закрити (ESC)' : 'Close (ESC)',
    copyLink: lang === 'ua' ? 'Скопіювати посилання' : 'Copy link',
    copied: lang === 'ua' ? 'Скопійовано' : 'Copied'
  };

  const currentDocMeta = activeDoc === 'privacy' ? privacy : terms;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto">
          {/* Backdrop click */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[#0e0e0e] text-[#f4f4f0] border border-neutral-800 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-30 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              {/* Document Tabs */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveDoc('privacy')}
                  className={`px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-all ${
                    activeDoc === 'privacy'
                      ? 'bg-[#f4f4f0] text-black font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.privacyTab}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDoc('terms')}
                  className={`px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-all ${
                    activeDoc === 'terms'
                      ? 'bg-[#f4f4f0] text-black font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.termsTab}</span>
                </button>
              </div>

              {/* Actions & Language */}
              <div className="flex items-center gap-3">
                {/* Language Switch */}
                <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setLang('ua')}
                    className={`px-2 py-1 cursor-pointer transition-colors ${
                      lang === 'ua' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    UA
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-2 py-1 cursor-pointer transition-colors ${
                      lang === 'en' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Direct Link button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Direct link"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors font-mono text-xs cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? t.copied : t.copyLink}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-neutral-700 hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-neutral-300 hover:text-white"
                  aria-label={t.close}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="overflow-y-auto custom-scrollbar px-6 sm:px-10 py-8 space-y-8 text-neutral-300 leading-relaxed font-light text-sm sm:text-base">
              {/* Meta bar */}
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 font-mono text-xs text-neutral-500">
                <span>LEGAL SPECIFICATION // {activeDoc.toUpperCase()}</span>
                <span>{currentDocMeta.lastUpdated[lang]}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tight text-white mb-2">
                  {currentDocMeta.title[lang]}
                </h2>
                <p className="text-neutral-400 text-sm font-mono">
                  {currentDocMeta.subtitle[lang]}
                </p>
              </div>

              {/* Sections from Google Sheet */}
              <div className="space-y-6">
                {currentDocMeta.sections.map((section, idx) => (
                  <section key={section.id || idx} className="space-y-3">
                    <h3 className="text-lg font-medium text-white uppercase tracking-wider font-mono text-xs text-emerald-400">
                      {section.title[lang]}
                    </h3>
                    <div className="space-y-2 whitespace-pre-line text-neutral-300 leading-relaxed">
                      {section.content[lang]}
                    </div>
                  </section>
                ))}
              </div>

              {/* Inquiries / Direct Contact banner inside document */}
              {currentDocMeta.contactEmail && (
                <section className="space-y-2 border-t border-neutral-800 pt-6 font-mono text-xs text-neutral-400">
                  <div className="text-neutral-500 uppercase tracking-widest">
                    {lang === 'ua' ? 'Прямий контакт для запитів:' : 'Direct Inquiries:'}
                  </div>
                  <div>
                    <a
                      href={`mailto:${currentDocMeta.contactEmail}`}
                      className="text-white hover:text-emerald-400 underline underline-offset-4 text-sm"
                    >
                      {currentDocMeta.contactEmail}
                    </a>
                  </div>
                </section>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0e0e0e] border-t border-neutral-800 px-6 py-3 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>© {new Date().getFullYear()} IVAN SELIVANOV // ALL RIGHTS RESERVED</span>
              <button
                onClick={onClose}
                className="hover:text-white transition-colors cursor-pointer px-3 py-1 border border-neutral-800 hover:border-neutral-600 bg-neutral-900"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
