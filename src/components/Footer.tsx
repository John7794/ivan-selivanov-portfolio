import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Copy, Check, Clock, MoveRight } from 'lucide-react';
import { GeneralSettings, Language, ContactsData } from '../types';
import { getLocalizedText } from '../utils/i18n';

interface FooterProps {
  settings: GeneralSettings;
  contacts?: ContactsData;
  language: Language;
  onOpenLegal?: (doc: 'privacy' | 'terms') => void;
  onOpenCookies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, contacts, language, onOpenLegal, onOpenCookies }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [kyivTime, setKyivTime] = useState('');

  const activeEmail = (contacts?.email !== undefined ? contacts.email : (settings.email || 'ivanselivanov771994@gmail.com')).trim();
  const activeLinkedin = (contacts?.linkedin !== undefined ? contacts.linkedin : (settings.linkedin || 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/')).trim();
  const activeTelegram = (contacts?.telegram !== undefined ? contacts.telegram : (settings.telegram || '')).trim();
  const activeBehance = (contacts?.behance !== undefined ? contacts.behance : (settings.behance || '')).trim();
  const activeGithub = (contacts?.github !== undefined ? contacts.github : (settings.github || '')).trim();

  // Clock in Lviv (EET/UTC+2)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Kyiv',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setKyivTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const t = {
    haveProject: language === 'ua' ? 'Маєте амбітний проєкт?' : 'Have an ambitious project?',
    letsTalk: language === 'ua' ? 'Обговорити' : "Let's Talk",
    emailLabel: language === 'ua' ? 'Прямий контакт' : 'Direct Inquiries',
    socialLabel: language === 'ua' ? 'Мережі' : 'Networks',
    locationLabel: language === 'ua' ? 'Локальний час' : 'Local Time',
    copyHint: language === 'ua' ? 'Клікніть, щоб скопіювати' : 'Click to copy email',
    copied: language === 'ua' ? 'Скопійовано!' : 'Email copied!',
    privacy: language === 'ua' ? 'Політика конфіденційності' : 'Privacy Policy',
    terms: language === 'ua' ? 'Умови використання' : 'Terms & Conditions',
    rights: language === 'ua' ? 'Всі права захищено.' : 'All Rights Reserved.'
  };

  return (
    <footer id="contact" className="px-6 lg:px-12 pt-24 pb-12 bg-[#f4f4f0] text-[#0a0a0a] flex flex-col justify-between min-h-screen">
      <div className="flex-1 flex flex-col justify-center max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-[2px] bg-[#0a0a0a]" />
          <span className="uppercase tracking-widest font-mono text-xs font-semibold text-neutral-600">
            {t.haveProject}
          </span>
        </div>

        <a
          href={`mailto:${activeEmail}`}
          className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase mb-12 hover:italic transition-all inline-block select-none"
        >
          {t.letsTalk}
        </a>

        {/* Contact Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 lg:gap-12 border-t border-[#0a0a0a]/20 pt-12">
          {/* Email */}
          <div className="md:col-span-6 lg:col-span-5 min-w-0">
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">
              {t.emailLabel}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${activeEmail}`}
                className="text-lg lg:text-2xl font-medium hover:underline underline-offset-8 break-all"
              >
                {activeEmail}
              </a>
              <button
                onClick={handleCopyEmail}
                title={t.copyHint}
                className="p-2 border border-[#0a0a0a]/20 hover:bg-[#0a0a0a] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
              {copiedEmail ? t.copied : t.copyHint}
            </span>
          </div>

          {/* Social */}
          {(activeLinkedin || activeTelegram || activeBehance || activeGithub) && (
            <div className="md:col-span-3 lg:col-span-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">
                {t.socialLabel}
              </h4>
              <div className="flex flex-col gap-2 text-lg md:text-xl font-medium">
                {activeLinkedin && (
                  <a
                    href={activeLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  >
                    <span>LinkedIn</span> <MoveRight className="w-4 h-4" />
                  </a>
                )}
                {activeTelegram && (
                  <a
                    href={activeTelegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  >
                    <span>Telegram</span> <MoveRight className="w-4 h-4" />
                  </a>
                )}
                {activeBehance && (
                  <a
                    href={activeBehance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  >
                    <span>Behance</span> <MoveRight className="w-4 h-4" />
                  </a>
                )}
                {activeGithub && (
                  <a
                    href={activeGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                  >
                    <span>GitHub</span> <MoveRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Time & Location / Address */}
          <div className="md:col-span-3 lg:col-span-4 md:text-right">
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">
              {t.locationLabel}
            </h4>
            <div className="text-xl md:text-2xl font-medium flex md:justify-end items-center gap-2">
              <Clock className="w-5 h-5 text-neutral-500" />
              <span>Lviv // {kyivTime || '00:00:00'}</span>
            </div>
            <p className="text-sm font-mono text-neutral-500 mt-1">
              {getLocalizedText(contacts?.address || contacts?.location || settings.location, language, { ua: 'Львів, Україна (Доступний по всьому світу)', en: 'Lviv, Ukraine (Available Worldwide)' })}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row justify-between items-center pt-8 mt-16 border-t border-[#0a0a0a]/20 font-mono text-xs uppercase tracking-widest text-neutral-500">
        <p>© {new Date().getFullYear()} {getLocalizedText(settings.name, language, { ua: 'Іван Селіванов', en: 'Ivan Selivanov' })}. {t.rights}</p>
        <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
          {onOpenCookies && (
            <button
              type="button"
              onClick={onOpenCookies}
              className="hover:text-[#0a0a0a] transition-colors cursor-pointer"
            >
              {language === 'ua' ? 'Налаштування Cookies' : 'Cookie Settings'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenLegal ? onOpenLegal('privacy') : window.location.hash = 'privacy'}
            className="hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            {t.privacy}
          </button>
          <button
            type="button"
            onClick={() => onOpenLegal ? onOpenLegal('terms') : window.location.hash = 'terms'}
            className="hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            {t.terms}
          </button>
        </div>
      </div>
    </footer>
  );
};
