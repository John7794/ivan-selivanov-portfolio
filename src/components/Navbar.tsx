import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Menu, 
  ArrowUpRight, 
  Mail, 
  Send, 
  Linkedin, 
  Check, 
  Copy 
} from 'lucide-react';
import { Language, GeneralSettings } from '../types';
import { playClickSound } from '../utils/audio';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  name: string;
  settings?: GeneralSettings;
  onOpenLegal?: (doc: 'privacy' | 'terms') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  name,
  settings,
  onOpenLegal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Prevent body scroll when popup menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    playClickSound();
    setIsMenuOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = 76;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playClickSound();
    setIsMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    playClickSound();
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const navItems = [
    { id: 'work', num: '01', titleUa: 'Проєкти', titleEn: 'Selected Work', descUa: 'Вибрані кейси & інтерфейси', descEn: 'Featured cases & digital products' },
    { id: 'expertise', num: '02', titleUa: 'Експертиза', titleEn: 'Core Expertise', descUa: 'UI/UX, графіка та стек', descEn: 'UI/UX, visual design & tech' },
    { id: 'experience', num: '03', titleUa: 'Досвід', titleEn: 'Career Timeline', descUa: 'Кар’єрний шлях та ролі', descEn: 'Professional trajectory & milestones' },
    { id: 'contact', num: '04', titleUa: 'Контакти', titleEn: 'Get In Touch', descUa: 'Зв’язок для нових викликів', descEn: 'Direct collaboration inquiries' },
  ];

  const currentEmail = settings?.email || 'ivanselivanov771994@gmail.com';
  const currentTelegram = settings?.telegram || 'https://t.me/ivanselivanov';
  const currentLinkedin = settings?.linkedin || 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/';

  return (
    <>
      <header className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-40 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-neutral-900/90 transition-all">
        {/* Brand Monogram "IS" */}
        <a
          href="#"
          onClick={scrollToTop}
          className="group flex items-center gap-2.5 text-2xl font-bold tracking-tighter leading-none text-white hover:text-neutral-300 transition-colors"
        >
          <span className="relative font-mono tracking-widest group-hover:tracking-[0.25em] transition-all duration-300">
            IS
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-normal border-l border-neutral-800 pl-3">
            {(name || 'IVAN SELIVANOV').toUpperCase()}
          </span>
        </a>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-widest uppercase text-neutral-400">
          <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className="hover:text-white transition-colors cursor-pointer">
            {language === 'ua' ? 'Проєкти' : 'Work'}
          </a>
          <a href="#expertise" onClick={(e) => handleNavClick(e, 'expertise')} className="hover:text-white transition-colors cursor-pointer">
            {language === 'ua' ? 'Експертиза' : 'Expertise'}
          </a>
          <a href="#experience" onClick={(e) => handleNavClick(e, 'experience')} className="hover:text-white transition-colors cursor-pointer">
            {language === 'ua' ? 'Досвід' : 'Experience'}
          </a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors cursor-pointer">
            {language === 'ua' ? 'Контакт' : 'Contact'}
          </a>
        </nav>

        {/* Right Action Bar: Language Switcher + Designer Popup Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher with Crisp Vector Flags */}
          <div className="flex border border-neutral-800 p-0.5 bg-neutral-950">
            <button
              type="button"
              onClick={() => { playClickSound(); onLanguageChange('ua'); }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 sm:gap-2 ${
                language === 'ua' ? 'bg-[#f4f4f0] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Українська"
            >
              {/* Ukraine Flag */}
              <span className="w-3.5 h-2.5 sm:w-4 rounded-[1px] overflow-hidden flex flex-col border border-neutral-700/60 shrink-0">
                <span className="w-full h-1/2 bg-[#0057b7]" />
                <span className="w-full h-1/2 bg-[#ffd700]" />
              </span>
              <span className="text-[11px] font-mono">UA</span>
            </button>
            <button
              type="button"
              onClick={() => { playClickSound(); onLanguageChange('en'); }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 sm:gap-2 ${
                language === 'en' ? 'bg-[#f4f4f0] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="English"
            >
              {/* UK Flag */}
              <span className="w-3.5 h-2.5 sm:w-4 rounded-[1px] overflow-hidden flex shrink-0 border border-neutral-700/60">
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <clipPath id="nav-s">
                    <path d="M0,0 v30 h60 v-30 z"/>
                  </clipPath>
                  <clipPath id="nav-t">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                  </clipPath>
                  <g clipPath="url(#nav-s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#nav-t)" stroke="#C8102E" strokeWidth="4"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                  </g>
                </svg>
              </span>
              <span className="text-[11px] font-mono">EN</span>
            </button>
          </div>

          {/* Designer Popup Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-[#f4f4f0] border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer font-mono text-xs uppercase tracking-wider select-none shadow-sm"
          >
            <div className="w-4 h-3.5 flex flex-col justify-between items-center py-0.5">
              <span className={`w-full h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`w-full h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
            <span className="text-[11px] font-medium hidden xs:inline">
              {isMenuOpen 
                ? (language === 'ua' ? 'ЗАКРИТИ' : 'CLOSE') 
                : (language === 'ua' ? 'МЕНЮ' : 'MENU')}
            </span>
          </button>
        </div>
      </header>

      {/* Enhanced Popup Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col">
            {/* Dark Backdrop with High-Fidelity Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Menu Drawer Content Container */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-h-[95vh] overflow-y-auto custom-scrollbar bg-[#0c0c0c] border-b border-neutral-800 text-[#f4f4f0] shadow-2xl flex flex-col"
            >
              {/* Top Bar inside Menu */}
              <div className="p-4 sm:p-6 border-b border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    IS // NAVIGATION SYSTEM
                  </span>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline-block font-mono text-[11px] text-neutral-400">
                    {settings?.heroTag ? settings.heroTag[language] : (language === 'ua' ? 'Готовий до співпраці' : 'Available for work')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => { playClickSound(); setIsMenuOpen(false); }}
                  className="w-9 h-9 rounded-full border border-neutral-800 hover:border-neutral-600 bg-neutral-900/80 hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-neutral-300 hover:text-white"
                  aria-label="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content Grid: Monumental Navigation + Quick Details */}
              <div className="p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                {/* Left Column: Monumental Nav Items (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col divide-y divide-neutral-800/80">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      className="group py-5 sm:py-7 flex items-baseline justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs text-neutral-500 group-hover:text-emerald-400 transition-colors">
                          {item.num}
                        </span>
                        <div>
                          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight group-hover:text-white text-neutral-200 transition-colors">
                            {language === 'ua' ? item.titleUa : item.titleEn}
                          </h2>
                          <p className="font-mono text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors mt-1">
                            {language === 'ua' ? item.descUa : item.descEn}
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-800 group-hover:border-neutral-500 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all shrink-0">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Right Column: Context, Tools & Direct Contacts (lg:col-span-5) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-8 pt-4 lg:pt-0 lg:border-l lg:border-neutral-800/80 lg:pl-10">
                  {/* Status & Location Card */}
                  <div className="bg-neutral-950 border border-neutral-800/90 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {settings?.heroTag ? settings.heroTag[language] : (language === 'ua' ? 'Готовий до співпраці' : 'Available for work')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                      {settings?.heroTagline ? settings.heroTagline[language] : (settings?.bioShort ? settings.bioShort[language] : '')}
                    </p>
                    <div className="font-mono text-[11px] text-neutral-500 pt-1 border-t border-neutral-900">
                      📍 {settings?.location ? settings.location[language] : (language === 'ua' ? 'Львів, Україна' : 'Lviv, Ukraine')}
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="space-y-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
                      {language === 'ua' ? 'Прямі контакти:' : 'Direct Channels:'}
                    </span>

                    {/* Email Copy Box */}
                    <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-mono text-xs text-neutral-200 truncate">{currentEmail}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(currentEmail)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                        title={language === 'ua' ? 'Скопіювати email' : 'Copy email'}
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedEmail ? (language === 'ua' ? 'Копія!' : 'Copied!') : (language === 'ua' ? 'Копія' : 'Copy')}</span>
                      </button>
                    </div>

                    {/* Social quick links */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={currentTelegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-colors flex items-center justify-between font-mono text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <Send className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Telegram</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                      </a>

                      <a
                        href={currentLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-300 transition-colors flex items-center justify-between font-mono text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                          <span>LinkedIn</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                      </a>
                    </div>
                  </div>

                  {/* Legal Quick Actions */}
                  <div className="border-t border-neutral-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-4">
                      {onOpenLegal && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              setIsMenuOpen(false);
                              onOpenLegal('privacy');
                            }}
                            className="hover:text-white transition-colors cursor-pointer"
                          >
                            {language === 'ua' ? 'Політика' : 'Privacy'}
                          </button>
                          <span className="text-neutral-700">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              setIsMenuOpen(false);
                              onOpenLegal('terms');
                            }}
                            className="hover:text-white transition-colors cursor-pointer"
                          >
                            {language === 'ua' ? 'Умови' : 'Terms'}
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-600">
                      © {new Date().getFullYear()} IVAN SELIVANOV
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
