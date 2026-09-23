import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Check, ChevronDown, ChevronUp, Sliders, ExternalLink } from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';
import { playClickSound, setSoundEnabled } from '../utils/audio';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  personalization: boolean;
  updatedAt?: string;
}

interface CookieBannerProps {
  language: Language;
  cookieData?: LegalAndBannersData['cookieBanner'];
  onOpenPrivacy?: () => void;
  isOpen?: boolean;
  isSuppressed?: boolean;
  onClose?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  language,
  cookieData,
  onOpenPrivacy,
  isOpen: forceOpen,
  isSuppressed,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Granular toggle states
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always locked to true
    functional: true,
    analytics: true,
    personalization: false,
  });

  useEffect(() => {
    // If explicitly opened via props
    if (forceOpen) {
      setIsVisible(true);
      setIsExpanded(true);
      return;
    }

    // Check saved preferences
    try {
      const saved = localStorage.getItem('ivan_portfolio_cookie_consent');
      if (saved) {
        if (saved === 'all') {
          setPreferences({ essential: true, functional: true, analytics: true, personalization: true });
        } else if (saved === 'essential') {
          setPreferences({ essential: true, functional: false, analytics: false, personalization: false });
          setSoundEnabled(false);
        } else {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setPreferences({
              essential: true,
              functional: parsed.functional ?? true,
              analytics: parsed.analytics ?? true,
              personalization: parsed.personalization ?? false,
            });
            if (parsed.functional === false) {
              setSoundEnabled(false);
            }
          }
        }
      } else {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
      setIsVisible(true);
    }
  }, [forceOpen]);

  const saveConsent = (prefs: CookiePreferences) => {
    playClickSound();
    try {
      localStorage.setItem('ivan_portfolio_cookie_consent', JSON.stringify({
        ...prefs,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // Ignore localStorage errors
    }

    // Sync sound setting with functional preference
    setSoundEnabled(prefs.functional);

    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleAcceptAll = () => {
    const allOn: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      personalization: true,
    };
    setPreferences(allOn);
    saveConsent(allOn);
  };

  const handleAcceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      personalization: false,
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  const toggleCategory = (key: keyof Omit<CookiePreferences, 'essential' | 'updatedAt'>) => {
    playClickSound();
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const t = {
    badge: cookieData?.badge?.[language] || 'PRIVACY & COMPLIANCE // GDPR & ЗУ «ПРО ЗАХИСТ ПЕРСОНАЛЬНИХ ДАНИХ»',
    title: cookieData?.title[language] || (language === 'ua' ? 'Конфіденційність & Обробка даних' : 'Privacy & Data Processing'),
    desc: cookieData?.description[language] || (language === 'ua'
      ? 'Цей веб-сайт використовує виключно безпечне локальне сховище вашого браузера (LocalStorage) для підтримки персональних налаштувань. Жодних сторонніх трекерів, спам-куків чи передачі даних третім особам.'
      : 'This portfolio utilizes minimal client-side browser storage (LocalStorage) strictly to retain your viewing preferences. Zero third-party ad pixels or commercial data harvesting.'),
    acceptAll: cookieData?.acceptAll[language] || (language === 'ua' ? 'Прийняти всі' : 'Accept All'),
    essentialOnly: cookieData?.onlyNecessary[language] || (language === 'ua' ? 'Лише необхідні' : 'Essential Only'),
    saveCustom: cookieData?.savePreferences[language] || (language === 'ua' ? 'Зберегти мій вибір' : 'Save Selected'),
    configure: cookieData?.configureBtn?.[language] || (language === 'ua' ? 'Налаштувати тогли' : 'Customize Toggles'),
    collapse: cookieData?.collapseBtn?.[language] || (language === 'ua' ? 'Згорнути' : 'Collapse'),
    policy: cookieData?.policyLink[language] || (language === 'ua' ? 'Політика конфіденційності' : 'Privacy Policy'),
    active: language === 'ua' ? 'Активно' : 'Active',
    off: language === 'ua' ? 'Вимкнено' : 'Off',
    alwaysActive: language === 'ua' ? 'Завжди активні' : 'Always Active',
    required: language === 'ua' ? 'Обов’язково' : 'Required',
  };

  const toggleItems = [
    {
      id: 'essential' as const,
      num: '01',
      title: cookieData?.essentialTitle?.[language] || (language === 'ua' ? 'Необхідні технічні дані' : 'Strictly Necessary Data'),
      storage: cookieData?.essentialStorage?.[language] || 'LocalStorage',
      desc: cookieData?.essentialDesc?.[language] || (language === 'ua'
        ? 'Збереження обраної мови інтерфейсу (UA/EN), стану згоди та критичних параметрів сесії.'
        : 'Preserving chosen language (UA/EN), consent choices, and core session accessibility parameters.'),
      isLocked: true,
      value: true
    },
    {
      id: 'functional' as const,
      num: '02',
      title: cookieData?.functionalTitle?.[language] || cookieData?.preferencesLabel?.[language] || (language === 'ua' ? 'Функціональні параметри' : 'Functional Preferences'),
      storage: cookieData?.functionalStorage?.[language] || 'LocalStorage / Audio API',
      desc: cookieData?.functionalDesc?.[language] || cookieData?.preferencesDesc?.[language] || (language === 'ua'
        ? 'Тактильний звуковий супровід кліків (Web Audio API), збереження вибраного вигляду проєктів (Каскад / Сітка).'
        : 'Tactile sound feedback for micro-interactions, layout view density memory (Masonry / Grid).'),
      isLocked: false,
      value: preferences.functional
    },
    {
      id: 'analytics' as const,
      num: '03',
      title: cookieData?.analyticsLabel?.[language] || (language === 'ua' ? 'Телеметрія швидкодії' : 'Performance Telemetry'),
      storage: cookieData?.analyticsStorage?.[language] || 'Client Runtime',
      desc: cookieData?.analyticsDesc?.[language] || (language === 'ua'
        ? 'Анонімізована діагностика швидкості ініціалізації WebGL-шейдерів та плавності анімацій (60 FPS).'
        : 'Anonymized monitoring of client shader frame rates and responsiveness to guarantee silky smooth rendering.'),
      isLocked: false,
      value: preferences.analytics
    },
    {
      id: 'personalization' as const,
      num: '04',
      title: cookieData?.personalizationTitle?.[language] || (language === 'ua' ? 'Персоналізація перегляду' : 'Experience Personalization'),
      storage: cookieData?.personalizationStorage?.[language] || 'LocalStorage Cache',
      desc: cookieData?.personalizationDesc?.[language] || (language === 'ua'
        ? 'Запам’ятовування останніх переглянутих кейсів та збереженого масштабу зображень (Fill / Contain).'
        : 'Retaining previously viewed project deep-dives and preferred image viewport presentation modes.'),
      isLocked: false,
      value: preferences.personalization
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && !isSuppressed && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-end sm:items-end justify-start p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full max-w-xl bg-[#0c0c0c]/98 backdrop-blur-xl border border-neutral-800 text-[#f4f4f0] p-5 sm:p-6 shadow-2xl space-y-4"
          >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-neutral-900 pb-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  {t.badge}
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase text-white mt-0.5">
                  {t.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsExpanded(!isExpanded);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                title={isExpanded ? t.collapse : t.configure}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] hidden xs:inline">{isExpanded ? t.collapse : t.configure}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            {t.desc}
          </p>

          {/* Expanded Granular Toggles List */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-2.5 border-t border-neutral-900 pt-3"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-400 px-1">
                  <span>{language === 'ua' ? 'Категорії обробки даних' : 'Data Processing Categories'}</span>
                  <span>{language === 'ua' ? 'Перемикачі (4)' : 'Toggles (4)'}</span>
                </div>

                <div className="space-y-2">
                  {toggleItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-neutral-400">
                            {item.num} //
                          </span>
                          <span className="font-mono text-xs font-semibold text-neutral-100">
                            {item.title}
                          </span>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400">
                            {item.storage}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-light leading-snug">
                          {item.desc}
                        </p>
                      </div>

                      {/* Interactive Switch or Locked Indicator */}
                      <div className="shrink-0 flex items-center">
                        {item.isLocked ? (
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-[10px] uppercase tracking-wider cursor-not-allowed select-none"
                            title={t.alwaysActive}
                          >
                            <Lock className="w-3 h-3 text-emerald-400" />
                            <span className="hidden sm:inline">{t.required}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.value}
                            onClick={() => {
                              if (item.id !== 'essential') {
                                toggleCategory(item.id);
                              }
                            }}
                            className={`group flex items-center gap-2 p-1 border transition-all cursor-pointer select-none font-mono text-[10px] ${
                              item.value
                                ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300'
                                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <span className="text-[10px] px-1 font-mono uppercase hidden sm:inline">
                              {item.value ? t.active : t.off}
                            </span>
                            {/* Swiss Brutalist Toggle Pill */}
                            <div className={`relative w-8 h-4 transition-colors ${
                              item.value ? 'bg-emerald-500' : 'bg-neutral-800'
                            }`}>
                              <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white transition-transform duration-200 ${
                                item.value ? 'translate-x-4.5' : 'translate-x-0.5'
                              }`} />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions Bar */}
          <div className="pt-2 border-t border-neutral-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {onOpenPrivacy && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onOpenPrivacy();
                  }}
                  className="text-[11px] font-mono text-neutral-400 hover:text-white underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{t.policy}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 font-mono text-xs justify-end">
              {isExpanded ? (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptEssential}
                    className="px-3 py-2 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {t.essentialOnly}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.saveCustom}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptEssential}
                    className="px-3 py-2 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {t.essentialOnly}
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-[#f4f4f0] hover:bg-white text-black font-semibold transition-colors cursor-pointer"
                  >
                    {t.acceptAll}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
