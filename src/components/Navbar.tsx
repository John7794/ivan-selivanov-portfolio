import React from 'react';
import { Language } from '../types';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  name: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  name
}) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
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
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-900">
      {/* Brand Monogram "IS" */}
      <a
        href="#"
        onClick={scrollToTop}
        className="group flex items-center gap-2 text-2xl font-bold tracking-tighter leading-none text-white hover:text-neutral-300 transition-colors"
      >
        <span className="relative font-mono tracking-widest group-hover:tracking-[0.25em] transition-all duration-300">
          IS
        </span>
        <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-normal border-l border-neutral-800 pl-3">
          {(name || '').toUpperCase()}
        </span>
      </a>

      {/* Main Nav Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-neutral-400">
        <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className="hover:text-white transition-colors">
          {language === 'ua' ? 'Проєкти' : 'Work'}
        </a>
        <a href="#expertise" onClick={(e) => handleNavClick(e, 'expertise')} className="hover:text-white transition-colors">
          {language === 'ua' ? 'Експертиза' : 'Expertise'}
        </a>
        <a href="#experience" onClick={(e) => handleNavClick(e, 'experience')} className="hover:text-white transition-colors">
          {language === 'ua' ? 'Досвід' : 'Experience'}
        </a>
        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors">
          {language === 'ua' ? 'Контакт' : 'Contact'}
        </a>
      </nav>

      {/* Language Switcher with Crisp Vector Flags */}
      <div className="flex items-center gap-2">
        <div className="flex border border-neutral-800 p-0.5 bg-neutral-950">
          <button
            onClick={() => onLanguageChange('ua')}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
              language === 'ua' ? 'bg-[#f4f4f0] text-black' : 'text-neutral-400 hover:text-white'
            }`}
            title="Українська"
          >
            {/* SVG Ukraine Flag */}
            <span className="w-4 h-2.5 rounded-[1px] overflow-hidden flex flex-col border border-neutral-700/60 shrink-0">
              <span className="w-full h-1/2 bg-[#0057b7]" />
              <span className="w-full h-1/2 bg-[#ffd700]" />
            </span>
            <span>UA</span>
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
              language === 'en' ? 'bg-[#f4f4f0] text-black' : 'text-neutral-400 hover:text-white'
            }`}
            title="English"
          >
            {/* SVG UK Flag (Union Jack) */}
            <span className="w-4 h-2.5 rounded-[1px] overflow-hidden flex shrink-0 border border-neutral-700/60">
              <svg viewBox="0 0 60 30" className="w-full h-full">
                <clipPath id="s">
                  <path d="M0,0 v30 h60 v-30 z"/>
                </clipPath>
                <clipPath id="t">
                  <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                </clipPath>
                <g clipPath="url(#s)">
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                </g>
              </svg>
            </span>
            <span>EN</span>
          </button>
        </div>
      </div>
    </header>
  );
};

