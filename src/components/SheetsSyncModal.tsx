import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Table, 
  Code, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';
import { 
  getGoogleAppsScriptTemplate, 
  getLegalSheetTsvTemplate, 
  getGeneralSheetTsvTemplate,
  syncWithGoogleSheets, 
  PortfolioData 
} from '../services/googleSheets';

interface SheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  portfolioData: PortfolioData;
  onDataUpdated: (data: PortfolioData) => void;
}

export const SheetsSyncModal: React.FC<SheetsSyncModalProps> = ({
  isOpen,
  onClose,
  language,
  portfolioData,
  onDataUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'legal' | 'sync' | 'script'>('general');
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [copiedGeneralTsv, setCopiedGeneralTsv] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState(portfolioData.settings.appsScriptUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const handleCopyGeneralTsv = () => {
    const tsv = getGeneralSheetTsvTemplate();
    navigator.clipboard.writeText(tsv);
    setCopiedGeneralTsv(true);
    setTimeout(() => setCopiedGeneralTsv(false), 2200);
  };

  const handleCopyTsv = () => {
    const tsv = getLegalSheetTsvTemplate();
    navigator.clipboard.writeText(tsv);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 2200);
  };

  const handleCopyScript = () => {
    const script = getGoogleAppsScriptTemplate();
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2200);
  };

  const handleSyncNow = async () => {
    if (!endpointUrl.trim()) {
      setSyncStatus({ type: 'error', message: language === 'ua' ? 'Вкажіть URL Google Apps Script' : 'Please provide Apps Script URL' });
      return;
    }
    setIsSyncing(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      localStorage.setItem('ivan_portfolio_sheets_url', endpointUrl.trim());
      const fresh = await syncWithGoogleSheets(endpointUrl.trim());
      onDataUpdated(fresh);
      setSyncStatus({
        type: 'success',
        message: language === 'ua' 
          ? `Успішно синхронізовано! Оновлено: ${new Date().toLocaleTimeString('en-GB')}` 
          : `Successfully synchronized! Updated: ${new Date().toLocaleTimeString('en-GB')}`
      });
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        message: err?.message || (language === 'ua' ? 'Помилка з’єднання з таблицею' : 'Failed to connect to Google Sheets')
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const generalPreviewRows = [
    { key: 'name', label: language === 'ua' ? "Ім'я" : 'Name', valUa: portfolioData.settings.name.ua, valEn: portfolioData.settings.name.en },
    { key: 'title', label: language === 'ua' ? 'Посада' : 'Title', valUa: portfolioData.settings.title.ua, valEn: portfolioData.settings.title.en },
    { key: 'heroTag', label: language === 'ua' ? 'Бейдж Hero' : 'Hero Badge Tag', valUa: portfolioData.settings.heroTag?.ua || 'Готовий до співпраці', valEn: portfolioData.settings.heroTag?.en || 'Available for work' },
    { key: 'heroTagline', label: language === 'ua' ? 'Опис Hero' : 'Hero Tagline', valUa: portfolioData.settings.heroTagline?.ua || portfolioData.settings.bioShort.ua, valEn: portfolioData.settings.heroTagline?.en || portfolioData.settings.bioShort.en },
    { key: 'location', label: language === 'ua' ? 'Локація' : 'Location', valUa: portfolioData.settings.location.ua, valEn: portfolioData.settings.location.en },
    { key: 'email', label: 'Email', valUa: portfolioData.settings.email, valEn: portfolioData.settings.email },
    { key: 'linkedin', label: 'LinkedIn', valUa: portfolioData.settings.linkedin, valEn: portfolioData.settings.linkedin },
    { key: 'expertise_card1_title', label: language === 'ua' ? 'Експертиза 1' : 'Expertise 1', valUa: portfolioData.settings.expertise?.card1Title.ua, valEn: portfolioData.settings.expertise?.card1Title.en },
    { key: 'expertise_card4_title', label: language === 'ua' ? 'Експертиза 4' : 'Expertise 4', valUa: portfolioData.settings.expertise?.card4Title.ua, valEn: portfolioData.settings.expertise?.card4Title.en },
    { key: 'expertise_tech_items', label: language === 'ua' ? 'Стек інструментів' : 'Tech Stack', valUa: 'Figma, HTML, CSS, JavaScript, Vercel...', valEn: 'Figma, HTML, CSS, JavaScript, Vercel...' }
  ];

  const legalPreviewRows = [
    { key: 'cookie_title', label: language === 'ua' ? 'Заголовок Cookie-банера' : 'Cookie Banner Title', valUa: portfolioData.legalAndBanners.cookieBanner.title.ua, valEn: portfolioData.legalAndBanners.cookieBanner.title.en },
    { key: 'cookie_desc', label: language === 'ua' ? 'Текст опису Cookie' : 'Cookie Description', valUa: portfolioData.legalAndBanners.cookieBanner.description.ua, valEn: portfolioData.legalAndBanners.cookieBanner.description.en },
    { key: 'privacy_title', label: language === 'ua' ? 'Заголовок Політики' : 'Privacy Title', valUa: portfolioData.legalAndBanners.privacyPolicy.title.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.title.en },
    { key: 'privacy_subtitle', label: language === 'ua' ? 'Підзаголовок Політики' : 'Privacy Subtitle', valUa: portfolioData.legalAndBanners.privacyPolicy.subtitle.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.subtitle.en },
    { key: 'privacy_s1_title', label: language === 'ua' ? 'Політика // Розділ 01' : 'Privacy // Section 01', valUa: portfolioData.legalAndBanners.privacyPolicy.sections[0]?.title.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.sections[0]?.title.en },
    { key: 'terms_title', label: language === 'ua' ? 'Заголовок Умов' : 'Terms Title', valUa: portfolioData.legalAndBanners.termsOfUse.title.ua, valEn: portfolioData.legalAndBanners.termsOfUse.title.en },
    { key: 'terms_s1_title', label: language === 'ua' ? 'Умови // Розділ 01' : 'Terms // Section 01', valUa: portfolioData.legalAndBanners.termsOfUse.sections[0]?.title.ua, valEn: portfolioData.legalAndBanners.termsOfUse.sections[0]?.title.en },
    { key: 'announcement_text', label: language === 'ua' ? 'Текст верхнього банера' : 'Top Banner Text', valUa: portfolioData.legalAndBanners.announcementBanner.text.ua, valEn: portfolioData.legalAndBanners.announcementBanner.text.en },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0e0e0e] text-[#f4f4f0] border border-neutral-800 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0e0e0e]/95 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  DATA SYNCHRONIZATION // GOOGLE SHEETS
                </span>
                <h3 className="text-base font-medium uppercase tracking-tight text-white">
                  {language === 'ua' ? 'Керування таблицею та текстами' : 'Google Sheets & Content Sync'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-700 hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-neutral-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950 px-6 font-mono text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'general'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка General_Data' : 'General_Data Tab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'legal'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка Legal_And_Banners' : 'Legal_And_Banners Tab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'sync'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Синхронізація (Sync)' : 'Live Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('script')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'script'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Apps Script Код' : 'Apps Script Code'}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="overflow-y-auto custom-scrollbar p-6 space-y-6 text-sm">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Оновлена структура General_Data (key | ua | en):' : 'Updated General_Data structure (key | ua | en):'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? '1. Відкрийте вкладку '
                          : '1. Open the tab '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">General_Data</strong>
                        {language === 'ua' ? ' у вашій Гугл-таблиці.' : ' in your Google Sheet.'}
                      </p>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                        {language === 'ua'
                          ? '2. Натисніть кнопку "Скопіювати шаблон", виберіть клітинку A1 та вставте (Ctrl+V / Cmd+V).'
                          : '2. Click "Copy Template", select cell A1, and paste (Ctrl+V / Cmd+V).'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyGeneralTsv}
                      className="px-4 py-2.5 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shrink-0 shadow"
                    >
                      {copiedGeneralTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>
                        {copiedGeneralTsv
                          ? (language === 'ua' ? 'Скопійовано!' : 'Copied!')
                          : (language === 'ua' ? 'Скопіювати шаблон' : 'Copy Template')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Structure details */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    {language === 'ua' ? 'Колонки: key | ua | en (малими літерами)' : 'Columns: key | ua | en (lowercase)'}
                  </h5>
                  <div className="border border-neutral-800 bg-neutral-950 font-mono text-xs overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                        <tr>
                          <th className="p-2.5">key</th>
                          <th className="p-2.5">ua</th>
                          <th className="p-2.5">en</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {generalPreviewRows.map(row => (
                          <tr key={row.key} className="hover:bg-neutral-900/50">
                            <td className="p-2.5 font-bold text-emerald-400">{row.key}</td>
                            <td className="p-2.5 max-w-[280px] truncate">{row.valUa}</td>
                            <td className="p-2.5 max-w-[280px] truncate">{row.valEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 mt-2">
                    {language === 'ua' 
                      ? 'Всі текстові поля мають окремі колонки ua та en, а системні поля (email, linkedin, heroImage) однакові або локалізовані.' 
                      : 'All text fields have separated ua and en columns, while email, linkedin, and heroImage work seamlessly.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'legal' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Як додати вкладку в Гугл-таблицю:' : 'How to add tab to Google Sheet:'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? '1. Створіть у вашій Гугл-таблиці нову вкладку з назвою: '
                          : '1. Create a new tab in your Google Sheet named: '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">Legal_And_Banners</strong>
                      </p>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                        {language === 'ua'
                          ? '2. Натисніть кнопку праворуч, виберіть клітинку A1 у новій вкладці та вставте скопійовані дані (Ctrl+V / Cmd+V).'
                          : '2. Click the copy button, select cell A1 in the new sheet, and press Ctrl+V / Cmd+V.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTsv}
                      className="px-4 py-2.5 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shrink-0 shadow"
                    >
                      {copiedTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>
                        {copiedTsv
                          ? (language === 'ua' ? 'Скопійовано!' : 'Copied!')
                          : (language === 'ua' ? 'Скопіювати шаблон' : 'Copy Template')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Structure details */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    {language === 'ua' ? 'Структура колонок вкладки Legal_And_Banners:' : 'Column structure of Legal_And_Banners tab:'}
                  </h5>
                  <div className="border border-neutral-800 bg-neutral-950 font-mono text-xs overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                        <tr>
                          <th className="p-2.5">key</th>
                          <th className="p-2.5">ua</th>
                          <th className="p-2.5">en</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {legalPreviewRows.map(row => (
                          <tr key={row.key} className="hover:bg-neutral-900/50">
                            <td className="p-2.5 font-bold text-emerald-400">{row.key}</td>
                            <td className="p-2.5 max-w-[280px] truncate">{row.valUa}</td>
                            <td className="p-2.5 max-w-[280px] truncate">{row.valEn}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 mt-2">
                    {language === 'ua' 
                      ? 'Всього підтримується понад 30 параметрів: тексти Cookie-банера, всі 6 розділів Політики, всі 6 розділів Умов використання та верхній банер оголошень.' 
                      : 'Supports over 30 keys: full Cookie banner texts, all 6 Privacy sections, all 6 Terms of Use sections, and the announcement banner.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'sync' && (
              <div className="space-y-6">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">
                    {language === 'ua' ? 'URL веб-додатка Google Apps Script:' : 'Google Apps Script Web App URL:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 bg-neutral-950 border border-neutral-800 px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                      className="px-5 py-2 bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? (language === 'ua' ? 'Оновлення...' : 'Syncing...') : (language === 'ua' ? 'Синхронізувати' : 'Sync Now')}</span>
                    </button>
                  </div>
                </div>

                {syncStatus.message && (
                  <div className={`p-4 border font-mono text-xs flex items-center gap-3 ${
                    syncStatus.type === 'success' 
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}>
                    {syncStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{syncStatus.message}</span>
                  </div>
                )}

                <div className="border-t border-neutral-800 pt-4 font-mono text-xs text-neutral-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{language === 'ua' ? 'Джерело даних:' : 'Data Source:'}</span>
                    <span className="text-white uppercase">{portfolioData.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'ua' ? 'Остання синхронізація:' : 'Last Synced:'}</span>
                    <span className="text-white">{portfolioData.lastSyncedAt || 'Live'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'ua' ? 'Кількість робіт у базі:' : 'Loaded Projects:'}</span>
                    <span className="text-emerald-400 font-bold">{portfolioData.projects.length}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'script' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-400 font-mono">
                    {language === 'ua'
                      ? 'Оновіть код у Extensions > Apps Script у вашій Гугл-таблиці (включає парсинг нової вкладки Legal_And_Banners):'
                      : 'Update the code in Extensions > Apps Script of your Google Sheet (includes Legal_And_Banners parsing):'}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? (language === 'ua' ? 'Скопійовано' : 'Copied') : (language === 'ua' ? 'Скопіювати код' : 'Copy Code')}</span>
                  </button>
                </div>

                <pre className="bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs text-neutral-300 max-h-72 overflow-y-auto custom-scrollbar">
                  {getGoogleAppsScriptTemplate()}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#0e0e0e] border-t border-neutral-800 px-6 py-3 flex items-center justify-between font-mono text-xs text-neutral-500">
            <span>GOOGLE SHEETS INTEGRATION // V2.5</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white cursor-pointer"
            >
              {language === 'ua' ? 'Закрити' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
