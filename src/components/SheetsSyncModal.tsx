import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Mail,
  Briefcase,
  Compass,
  HelpCircle,
  Tag
} from 'lucide-react';
import { Language, LegalAndBannersData } from '../types';
import { DEFAULT_WORKFLOW, DEFAULT_FAQ } from '../data/defaultData';
import { 
  getGoogleAppsScriptTemplate, 
  getLegalSheetTsvTemplate, 
  getGeneralSheetTsvTemplate,
  getContactsSheetTsvTemplate,
  getStatusesSheetTsvTemplate,
  generateProjectsTSV,
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
  const [activeTab, setActiveTab] = useState<'projects' | 'statuses' | 'contacts' | 'general' | 'workflow' | 'faq' | 'legal' | 'sync' | 'script'>('projects');
  const [copiedProjectsHeaders, setCopiedProjectsHeaders] = useState(false);
  const [copiedProjectsTsv, setCopiedProjectsTsv] = useState(false);
  const [copiedStatusesHeaders, setCopiedStatusesHeaders] = useState(false);
  const [copiedStatusesTsv, setCopiedStatusesTsv] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [copiedGeneralTsv, setCopiedGeneralTsv] = useState(false);
  const [copiedContactsTsv, setCopiedContactsTsv] = useState(false);
  const [copiedWorkflowTsv, setCopiedWorkflowTsv] = useState(false);
  const [copiedWorkflowHeaders, setCopiedWorkflowHeaders] = useState(false);
  const [copiedFaqTsv, setCopiedFaqTsv] = useState(false);
  const [copiedFaqHeaders, setCopiedFaqHeaders] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState(portfolioData.settings.appsScriptUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  useEffect(() => {
    if (!isOpen) return;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const projectsHeadersRow = 'id\ttitle_ua\ttitle_en\tyear\trole_ua\trole_en\tclient_ua\tclient_en\tcategory\tstatus\tstatus_ua\tstatus_en\tfeatured\tthumbnailUrl\tmobileThumbnailUrl\theroImage\tliveLink\ttagline_ua\ttagline_en\toverview_ua\toverview_en\ttools\tchallenge_ua\tchallenge_en\tsolution_ua\tsolution_en\timpact_ua\timpact_en\tfonts\tfonts_ua\tfonts_en\tpalette\tcolors_ua\tcolors_en\tfigmaUrl\tfigmaEmbedUrl';

  const handleCopyProjectsHeaders = () => {
    navigator.clipboard.writeText(projectsHeadersRow);
    setCopiedProjectsHeaders(true);
    setTimeout(() => setCopiedProjectsHeaders(false), 2200);
  };

  const handleCopyProjectsTsv = () => {
    const tsv = generateProjectsTSV(portfolioData.projects);
    navigator.clipboard.writeText(tsv);
    setCopiedProjectsTsv(true);
    setTimeout(() => setCopiedProjectsTsv(false), 2200);
  };

  const statusesHeadersRow = 'id\tua\ten\tbadge_ua\tbadge_en';

  const handleCopyStatusesHeaders = () => {
    navigator.clipboard.writeText(statusesHeadersRow);
    setCopiedStatusesHeaders(true);
    setTimeout(() => setCopiedStatusesHeaders(false), 2200);
  };

  const handleCopyStatusesTsv = () => {
    const tsv = getStatusesSheetTsvTemplate();
    navigator.clipboard.writeText(tsv);
    setCopiedStatusesTsv(true);
    setTimeout(() => setCopiedStatusesTsv(false), 2200);
  };

  const handleCopyContactsTsv = () => {
    const tsv = getContactsSheetTsvTemplate();
    navigator.clipboard.writeText(tsv);
    setCopiedContactsTsv(true);
    setTimeout(() => setCopiedContactsTsv(false), 2200);
  };

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

  const workflowHeadersRow = 'id\tstepNumber\ttitle_ua\ttitle_en\tdescription_ua\tdescription_en\tdeliverables_ua\tdeliverables_en\ttools\thighlightTool';

  const handleCopyWorkflowHeaders = () => {
    navigator.clipboard.writeText(workflowHeadersRow);
    setCopiedWorkflowHeaders(true);
    setTimeout(() => setCopiedWorkflowHeaders(false), 2200);
  };

  const handleCopyWorkflowTsv = () => {
    const rows = [
      workflowHeadersRow,
      ...DEFAULT_WORKFLOW.map(w => [
        w.id,
        w.stepNumber,
        w.title.ua,
        w.title.en,
        w.description.ua,
        w.description.en,
        (w.deliverables?.ua || []).join('; '),
        (w.deliverables?.en || []).join('; '),
        (w.tools || []).join(', '),
        w.highlightTool || ''
      ].join('\t'))
    ].join('\n');
    navigator.clipboard.writeText(rows);
    setCopiedWorkflowTsv(true);
    setTimeout(() => setCopiedWorkflowTsv(false), 2200);
  };

  const faqHeadersRow = 'id\tquestion_ua\tquestion_en\tanswer_ua\tanswer_en\tcategory';

  const handleCopyFaqHeaders = () => {
    navigator.clipboard.writeText(faqHeadersRow);
    setCopiedFaqHeaders(true);
    setTimeout(() => setCopiedFaqHeaders(false), 2200);
  };

  const handleCopyFaqTsv = () => {
    const rows = [
      faqHeadersRow,
      ...DEFAULT_FAQ.map(f => [
        f.id,
        f.question.ua,
        f.question.en,
        f.answer.ua.replace(/\n/g, ' '),
        f.answer.en.replace(/\n/g, ' '),
        f.category?.ua || 'Загальне'
      ].join('\t'))
    ].join('\n');
    navigator.clipboard.writeText(rows);
    setCopiedFaqTsv(true);
    setTimeout(() => setCopiedFaqTsv(false), 2200);
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
    { key: 'telegram', label: 'Telegram', valUa: portfolioData.contacts?.telegram || portfolioData.settings.telegram || 'https://t.me/ivanselivanov', valEn: portfolioData.contacts?.telegram || portfolioData.settings.telegram || 'https://t.me/ivanselivanov' },
    { key: 'linkedin', label: 'LinkedIn', valUa: portfolioData.settings.linkedin, valEn: portfolioData.settings.linkedin },
    { key: 'behance', label: 'Behance', valUa: portfolioData.contacts?.behance || portfolioData.settings.behance || 'https://behance.net/ivanselivanov', valEn: portfolioData.contacts?.behance || portfolioData.settings.behance || 'https://behance.net/ivanselivanov' },
    { key: 'github', label: 'GitHub', valUa: portfolioData.contacts?.github || portfolioData.settings.github || 'https://github.com/ivanselivanov', valEn: portfolioData.contacts?.github || portfolioData.settings.github || 'https://github.com/ivanselivanov' },
    { key: 'phone', label: language === 'ua' ? 'Телефон' : 'Phone', valUa: portfolioData.contacts?.phone || '', valEn: portfolioData.contacts?.phone || '' },
    { key: 'address', label: language === 'ua' ? 'Адреса' : 'Address', valUa: portfolioData.contacts?.address?.ua || portfolioData.settings.location.ua, valEn: portfolioData.contacts?.address?.en || portfolioData.settings.location.en },
    { key: 'expertise_card1_title', label: language === 'ua' ? 'Експертиза 1' : 'Expertise 1', valUa: portfolioData.settings.expertise?.card1Title.ua, valEn: portfolioData.settings.expertise?.card1Title.en },
    { key: 'expertise_card4_title', label: language === 'ua' ? 'Експертиза 4' : 'Expertise 4', valUa: portfolioData.settings.expertise?.card4Title.ua, valEn: portfolioData.settings.expertise?.card4Title.en },
    { key: 'expertise_tech_items', label: language === 'ua' ? 'Стек інструментів' : 'Tech Stack', valUa: 'Figma, HTML, CSS, JavaScript, Vercel...', valEn: 'Figma, HTML, CSS, JavaScript, Vercel...' },
    { key: 'menu_system_title', label: language === 'ua' ? 'Меню: Шапка' : 'Menu: System Title', valUa: portfolioData.settings.menu?.systemTitle?.ua || 'IS // СИСТЕМА НАВІГАЦІЇ', valEn: portfolioData.settings.menu?.systemTitle?.en || 'IS // NAVIGATION SYSTEM' },
    { key: 'menu_item1_title', label: language === 'ua' ? 'Меню: Пункт 1' : 'Menu: Item 1', valUa: portfolioData.settings.menu?.item1Title?.ua || 'Проєкти', valEn: portfolioData.settings.menu?.item1Title?.en || 'Selected Work' },
    { key: 'menu_item1_desc', label: language === 'ua' ? 'Меню: Опис 1' : 'Menu: Desc 1', valUa: portfolioData.settings.menu?.item1Desc?.ua || 'Вибрані кейси & інтерфейси', valEn: portfolioData.settings.menu?.item1Desc?.en || 'Featured cases & digital products' },
    { key: 'menu_workflow_title', label: language === 'ua' ? 'Меню: Процес' : 'Menu: Workflow', valUa: portfolioData.settings.menu?.itemWorkflowTitle?.ua || 'Процес', valEn: portfolioData.settings.menu?.itemWorkflowTitle?.en || 'Workflow' },
    { key: 'menu_workflow_desc', label: language === 'ua' ? 'Меню: Опис процесу' : 'Menu: Workflow Desc', valUa: portfolioData.settings.menu?.itemWorkflowDesc?.ua || '4 етапи від брифу до передачі в розробку', valEn: portfolioData.settings.menu?.itemWorkflowDesc?.en || '4-phase delivery from brief to dev handoff' },
    { key: 'menu_faq_title', label: language === 'ua' ? 'Меню: FAQ' : 'Menu: FAQ', valUa: portfolioData.settings.menu?.itemFaqTitle?.ua || 'FAQ', valEn: portfolioData.settings.menu?.itemFaqTitle?.en || 'FAQ' },
    { key: 'menu_faq_desc', label: language === 'ua' ? 'Меню: Опис FAQ' : 'Menu: FAQ Desc', valUa: portfolioData.settings.menu?.itemFaqDesc?.ua || 'Формати співпраці, NDA та умови', valEn: portfolioData.settings.menu?.itemFaqDesc?.en || 'Collaboration models, NDA & turnaround' },
    { key: 'menu_contacts_title', label: language === 'ua' ? 'Меню: Заголовок контактів' : 'Menu: Contacts Heading', valUa: portfolioData.settings.menu?.contactsTitle?.ua || 'Прямі контакти:', valEn: portfolioData.settings.menu?.contactsTitle?.en || 'Direct Channels:' },
    { key: 'hero_cta_btn', label: language === 'ua' ? 'Кнопка "Дослідити кейси"' : 'Hero CTA Button', valUa: portfolioData.settings.ui?.heroCta?.ua || 'Дослідити кейси', valEn: portfolioData.settings.ui?.heroCta?.en || 'Explore Portfolio' },
    { key: 'work_index', label: language === 'ua' ? 'Індекс розділу робіт' : 'Work Section Index', valUa: portfolioData.settings.ui?.workIndex?.ua || '01 // INDEXED CASE STUDIES', valEn: portfolioData.settings.ui?.workIndex?.en || '01 // INDEXED CASE STUDIES' },
    { key: 'work_title', label: language === 'ua' ? 'Заголовок "Вибрані Роботи"' : 'Work Section Title', valUa: portfolioData.settings.ui?.workTitle?.ua || 'Вибрані Роботи', valEn: portfolioData.settings.ui?.workTitle?.en || 'Selected Works' },
    { key: 'layout_cascade', label: language === 'ua' ? 'Кнопка "Каскад"' : 'Layout Masonry', valUa: portfolioData.settings.ui?.layoutCascade?.ua || 'Каскад', valEn: portfolioData.settings.ui?.layoutCascade?.en || 'Masonry' },
    { key: 'layout_grid', label: language === 'ua' ? 'Кнопка "Сітка"' : 'Layout Grid', valUa: portfolioData.settings.ui?.layoutGrid?.ua || 'Сітка', valEn: portfolioData.settings.ui?.layoutGrid?.en || 'Grid' },
    { key: 'filter_category_label', label: language === 'ua' ? 'Мітка "Напрямок:"' : 'Filter Category Label', valUa: portfolioData.settings.ui?.filterCategoryLabel?.ua || 'Напрямок:', valEn: portfolioData.settings.ui?.filterCategoryLabel?.en || 'Discipline:' },
    { key: 'filter_category_all', label: language === 'ua' ? 'Фільтр "Всі напрямки"' : 'Filter Category All', valUa: portfolioData.settings.ui?.filterCategoryAll?.ua || 'Всі напрямки', valEn: portfolioData.settings.ui?.filterCategoryAll?.en || 'All disciplines' },
    { key: 'filter_category_identity', label: language === 'ua' ? 'Фільтр "Айдентика & Постери"' : 'Filter "Identity & Posters"', valUa: portfolioData.settings.ui?.filterCategoryIdentity?.ua || 'Айдентика & Постери', valEn: portfolioData.settings.ui?.filterCategoryIdentity?.en || 'Identity & Posters' },
    { key: 'filter_category_uiux', label: language === 'ua' ? 'Фільтр "UI/UX / Web Design"' : 'Filter "UI/UX / Web Design"', valUa: portfolioData.settings.ui?.filterCategoryUiux?.ua || 'UI/UX / Web Design', valEn: portfolioData.settings.ui?.filterCategoryUiux?.en || 'UI/UX / Web Design' },
    { key: 'filter_category_print', label: language === 'ua' ? 'Фільтр "Editorial / Print Design"' : 'Filter "Editorial / Print Design"', valUa: portfolioData.settings.ui?.filterCategoryPrint?.ua || 'Editorial / Print Design', valEn: portfolioData.settings.ui?.filterCategoryPrint?.en || 'Editorial / Print Design' },
    { key: 'filter_category_ads', label: language === 'ua' ? 'Фільтр "Advertising / Social Media"' : 'Filter "Advertising / Social Media"', valUa: portfolioData.settings.ui?.filterCategoryAds?.ua || 'Advertising / Social Media', valEn: portfolioData.settings.ui?.filterCategoryAds?.en || 'Advertising / Social Media' },
    { key: 'filter_category_3d', label: language === 'ua' ? 'Фільтр "3D Modeling"' : 'Filter "3D Modeling"', valUa: portfolioData.settings.ui?.filterCategory3d?.ua || '3D Modeling', valEn: portfolioData.settings.ui?.filterCategory3d?.en || '3D Modeling' },
    { key: 'filter_status_label', label: language === 'ua' ? 'Мітка "Статус:"' : 'Filter Status Label', valUa: portfolioData.settings.ui?.filterStatusLabel?.ua || 'Статус:', valEn: portfolioData.settings.ui?.filterStatusLabel?.en || 'Status:' },
    { key: 'filter_status_all', label: language === 'ua' ? 'Фільтр "Всі статуси"' : 'Filter Status All', valUa: portfolioData.settings.ui?.filterStatusAll?.ua || 'Всі статуси', valEn: portfolioData.settings.ui?.filterStatusAll?.en || 'All statuses' },
    { key: 'filter_status_production', label: language === 'ua' ? 'Фільтр "Реалізовані"' : 'Filter "Live (Production)"', valUa: portfolioData.settings.ui?.filterStatusProduction?.ua || 'Реалізовані', valEn: portfolioData.settings.ui?.filterStatusProduction?.en || 'Live (Production)' },
    { key: 'filter_status_conceptual', label: language === 'ua' ? 'Фільтр "Концепти"' : 'Filter "Concepts"', valUa: portfolioData.settings.ui?.filterStatusConceptual?.ua || 'Концепти', valEn: portfolioData.settings.ui?.filterStatusConceptual?.en || 'Concepts' },
    { key: 'expertise_index', label: language === 'ua' ? 'Індекс розділу експертизи' : 'Expertise Section Index', valUa: portfolioData.settings.ui?.expertiseIndex?.ua || '02 // METHODOLOGY & CAPABILITIES', valEn: portfolioData.settings.ui?.expertiseIndex?.en || '02 // METHODOLOGY & CAPABILITIES' },
    { key: 'experience_index', label: language === 'ua' ? 'Індекс розділу досвіду' : 'Experience Section Index', valUa: portfolioData.settings.ui?.experienceIndex?.ua || '03 // TRACK RECORD', valEn: portfolioData.settings.ui?.experienceIndex?.en || '03 // TRACK RECORD' },
    { key: 'experience_title', label: language === 'ua' ? 'Заголовок "Кар’єрний Шлях"' : 'Experience Title', valUa: portfolioData.settings.ui?.experienceTitle?.ua || 'Кар’єрний Шлях & Досвід', valEn: portfolioData.settings.ui?.experienceTitle?.en || 'Career Track & Background' },
    { key: 'contact_heading', label: language === 'ua' ? 'Футер: "Маєте амбітний проєкт?"' : 'Footer Heading', valUa: portfolioData.settings.ui?.contactHeading?.ua || 'Маєте амбітний проєкт?', valEn: portfolioData.settings.ui?.contactHeading?.en || 'Have an ambitious project?' },
    { key: 'contact_cta', label: language === 'ua' ? 'Футер: "Обговорити"' : 'Footer CTA', valUa: portfolioData.settings.ui?.contactCta?.ua || 'Обговорити', valEn: portfolioData.settings.ui?.contactCta?.en || "Let's Talk" },
    { key: 'modal_case_study', label: language === 'ua' ? 'Модалка: Шапка' : 'Modal: Header Label', valUa: portfolioData.settings.ui?.modalCaseStudy?.ua || 'CASE STUDY //', valEn: portfolioData.settings.ui?.modalCaseStudy?.en || 'CASE STUDY //' },
    { key: 'modal_prev', label: language === 'ua' ? 'Модалка: Кнопка Попередній' : 'Modal: Prev Button', valUa: portfolioData.settings.ui?.modalPrev?.ua || 'Попередній', valEn: portfolioData.settings.ui?.modalPrev?.en || 'Previous' },
    { key: 'modal_next', label: language === 'ua' ? 'Модалка: Кнопка Наступний' : 'Modal: Next Button', valUa: portfolioData.settings.ui?.modalNext?.ua || 'Наступний', valEn: portfolioData.settings.ui?.modalNext?.en || 'Next' },
    { key: 'modal_close', label: language === 'ua' ? 'Модалка: Закрити (ESC)' : 'Modal: Close Button', valUa: portfolioData.settings.ui?.modalClose?.ua || 'Закрити', valEn: portfolioData.settings.ui?.modalClose?.en || 'Close' },
    { key: 'modal_role', label: language === 'ua' ? 'Модалка: Мітка "Роль"' : 'Modal: Role Label', valUa: portfolioData.settings.ui?.modalRole?.ua || 'Роль', valEn: portfolioData.settings.ui?.modalRole?.en || 'Role' },
    { key: 'modal_timeline', label: language === 'ua' ? 'Модалка: Мітка "Період"' : 'Modal: Timeline Label', valUa: portfolioData.settings.ui?.modalTimeline?.ua || 'Період', valEn: portfolioData.settings.ui?.modalTimeline?.en || 'Timeline' },
    { key: 'modal_category', label: language === 'ua' ? 'Модалка: Мітка "Категорія"' : 'Modal: Category Label', valUa: portfolioData.settings.ui?.modalCategory?.ua || 'Категорія', valEn: portfolioData.settings.ui?.modalCategory?.en || 'Category' },
    { key: 'modal_deliverables', label: language === 'ua' ? 'Модалка: Мітка "Результати"' : 'Modal: Deliverables Label', valUa: portfolioData.settings.ui?.modalDeliverables?.ua || 'Результати', valEn: portfolioData.settings.ui?.modalDeliverables?.en || 'Deliverables' },
    { key: 'modal_interactive_title', label: language === 'ua' ? 'Модалка: Заголовок інтерактиву' : 'Modal: Interactive Title', valUa: portfolioData.settings.ui?.modalInteractiveExperience?.ua || 'INTERACTIVE VISUAL EXPERIENCE', valEn: portfolioData.settings.ui?.modalInteractiveExperience?.en || 'INTERACTIVE VISUAL EXPERIENCE' },
    { key: 'modal_fullscreen', label: language === 'ua' ? 'Модалка: Кнопка "На весь екран"' : 'Modal: Fullscreen Button', valUa: portfolioData.settings.ui?.modalFullscreen?.ua || 'На весь екран', valEn: portfolioData.settings.ui?.modalFullscreen?.en || 'Fullscreen' },
    { key: 'modal_max_space', label: language === 'ua' ? 'Модалка: "Максимум місця"' : 'Modal: Max Space', valUa: portfolioData.settings.ui?.modalMaxSpace?.ua || 'Максимум місця', valEn: portfolioData.settings.ui?.modalMaxSpace?.en || 'Max space' },
    { key: 'modal_fit_frame', label: language === 'ua' ? 'Модалка: "Вписати в екран"' : 'Modal: Fit Frame', valUa: portfolioData.settings.ui?.modalFitFrame?.ua || 'Вписати в екран', valEn: portfolioData.settings.ui?.modalFitFrame?.en || 'Fit frame' },
    { key: 'modal_visit_live', label: language === 'ua' ? 'Модалка: "Відвідати живий сайт"' : 'Modal: Visit Live', valUa: portfolioData.settings.ui?.modalVisitLive?.ua || 'Переглянути Live Проєкт', valEn: portfolioData.settings.ui?.modalVisitLive?.en || 'Explore Live Interface' },
    { key: 'modal_artifacts', label: language === 'ua' ? 'Модалка: "Екрани та Артефакти"' : 'Modal: Artifacts Heading', valUa: portfolioData.settings.ui?.modalArtifacts?.ua || 'Екрани та Артефакти', valEn: portfolioData.settings.ui?.modalArtifacts?.en || 'Screens & Artifacts' },
    { key: 'modal_tab_screens', label: language === 'ua' ? 'Модалка: Вкладка "Макети"' : 'Modal: Screens Tab', valUa: portfolioData.settings.ui?.modalTabScreens?.ua || 'Макети', valEn: portfolioData.settings.ui?.modalTabScreens?.en || 'Screens' },
    { key: 'modal_tab_figma', label: language === 'ua' ? 'Модалка: Вкладка "Інтерактивна Figma"' : 'Modal: Figma Tab', valUa: portfolioData.settings.ui?.modalTabFigma?.ua || 'Інтерактивна Figma', valEn: portfolioData.settings.ui?.modalTabFigma?.en || 'Interactive Figma' },
    { key: 'modal_open_figma', label: language === 'ua' ? 'Модалка: Кнопка "Перейти в макет Figma"' : 'Modal: Open Figma Button', valUa: portfolioData.settings.ui?.modalOpenFigma?.ua || 'Перейти в макет Figma', valEn: portfolioData.settings.ui?.modalOpenFigma?.en || 'Open in Figma' },
    { key: 'modal_open_live', label: language === 'ua' ? 'Модалка: Кнопка "Відкрити live проєкт"' : 'Modal: Open Live Button', valUa: portfolioData.settings.ui?.modalOpenLive?.ua || 'Відкрити live проєкт', valEn: portfolioData.settings.ui?.modalOpenLive?.en || 'Open live project' },
    { key: 'badge_featured', label: language === 'ua' ? 'Бейдж картки "★ Обрані"' : 'Card Badge "★ Selected"', valUa: portfolioData.settings.ui?.badgeFeatured?.ua || 'Обрані', valEn: portfolioData.settings.ui?.badgeFeatured?.en || 'Selected' },
    { key: 'card_view_case', label: language === 'ua' ? 'Кнопка на картці "Відкрити кейс"' : 'Card Hover Button "Open Case Study"', valUa: portfolioData.settings.ui?.cardViewCase?.ua || 'Відкрити кейс', valEn: portfolioData.settings.ui?.cardViewCase?.en || 'Open case study' }
  ];

  const legalPreviewRows = [
    { key: 'cookie_title', label: language === 'ua' ? 'Заголовок Cookie-банера' : 'Cookie Banner Title', valUa: portfolioData.legalAndBanners.cookieBanner.title.ua, valEn: portfolioData.legalAndBanners.cookieBanner.title.en },
    { key: 'cookie_desc', label: language === 'ua' ? 'Текст опису Cookie' : 'Cookie Description', valUa: portfolioData.legalAndBanners.cookieBanner.description.ua, valEn: portfolioData.legalAndBanners.cookieBanner.description.en },
    { key: 'cookie_essential_title', label: language === 'ua' ? 'Тогл 01: Назва' : 'Toggle 01: Title', valUa: portfolioData.legalAndBanners.cookieBanner.essentialTitle?.ua || 'Необхідні технічні дані', valEn: portfolioData.legalAndBanners.cookieBanner.essentialTitle?.en || 'Strictly Necessary Data' },
    { key: 'cookie_essential_desc', label: language === 'ua' ? 'Тогл 01: Опис' : 'Toggle 01: Description', valUa: portfolioData.legalAndBanners.cookieBanner.essentialDesc?.ua || '', valEn: portfolioData.legalAndBanners.cookieBanner.essentialDesc?.en || '' },
    { key: 'cookie_functional_title', label: language === 'ua' ? 'Тогл 02: Назва' : 'Toggle 02: Title', valUa: portfolioData.legalAndBanners.cookieBanner.functionalTitle?.ua || 'Функціональні параметри', valEn: portfolioData.legalAndBanners.cookieBanner.functionalTitle?.en || 'Functional Preferences' },
    { key: 'cookie_functional_desc', label: language === 'ua' ? 'Тогл 02: Опис' : 'Toggle 02: Description', valUa: portfolioData.legalAndBanners.cookieBanner.functionalDesc?.ua || '', valEn: portfolioData.legalAndBanners.cookieBanner.functionalDesc?.en || '' },
    { key: 'cookie_analytics_label', label: language === 'ua' ? 'Тогл 03: Назва' : 'Toggle 03: Title', valUa: portfolioData.legalAndBanners.cookieBanner.analyticsLabel.ua, valEn: portfolioData.legalAndBanners.cookieBanner.analyticsLabel.en },
    { key: 'cookie_analytics_desc', label: language === 'ua' ? 'Тогл 03: Опис' : 'Toggle 03: Description', valUa: portfolioData.legalAndBanners.cookieBanner.analyticsDesc.ua, valEn: portfolioData.legalAndBanners.cookieBanner.analyticsDesc.en },
    { key: 'cookie_personalization_title', label: language === 'ua' ? 'Тогл 04: Назва' : 'Toggle 04: Title', valUa: portfolioData.legalAndBanners.cookieBanner.personalizationTitle?.ua || 'Персоналізація перегляду', valEn: portfolioData.legalAndBanners.cookieBanner.personalizationTitle?.en || 'Experience Personalization' },
    { key: 'cookie_personalization_desc', label: language === 'ua' ? 'Тогл 04: Опис' : 'Toggle 04: Description', valUa: portfolioData.legalAndBanners.cookieBanner.personalizationDesc?.ua || '', valEn: portfolioData.legalAndBanners.cookieBanner.personalizationDesc?.en || '' },
    { key: 'privacy_title', label: language === 'ua' ? 'Заголовок Політики' : 'Privacy Title', valUa: portfolioData.legalAndBanners.privacyPolicy.title.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.title.en },
    { key: 'privacy_subtitle', label: language === 'ua' ? 'Підзаголовок Політики' : 'Privacy Subtitle', valUa: portfolioData.legalAndBanners.privacyPolicy.subtitle.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.subtitle.en },
    { key: 'privacy_s1_title', label: language === 'ua' ? 'Політика // Розділ 01' : 'Privacy // Section 01', valUa: portfolioData.legalAndBanners.privacyPolicy.sections[0]?.title.ua, valEn: portfolioData.legalAndBanners.privacyPolicy.sections[0]?.title.en },
    { key: 'terms_title', label: language === 'ua' ? 'Заголовок Умов' : 'Terms Title', valUa: portfolioData.legalAndBanners.termsOfUse.title.ua, valEn: portfolioData.legalAndBanners.termsOfUse.title.en },
    { key: 'terms_s1_title', label: language === 'ua' ? 'Умови // Розділ 01' : 'Terms // Section 01', valUa: portfolioData.legalAndBanners.termsOfUse.sections[0]?.title.ua, valEn: portfolioData.legalAndBanners.termsOfUse.sections[0]?.title.en },
    { key: 'announcement_text', label: language === 'ua' ? 'Текст верхнього банера' : 'Top Banner Text', valUa: portfolioData.legalAndBanners.announcementBanner.text.ua, valEn: portfolioData.legalAndBanners.announcementBanner.text.en },
  ];

  const contactsPreviewRows = [
    { key: 'email', label: language === 'ua' ? 'Електронна пошта' : 'Email Address', valUa: portfolioData.contacts?.email || portfolioData.settings.email, valEn: portfolioData.contacts?.email || portfolioData.settings.email },
    { key: 'telegram', label: language === 'ua' ? 'Telegram' : 'Telegram Link', valUa: portfolioData.contacts?.telegram || portfolioData.settings.telegram, valEn: portfolioData.contacts?.telegram || portfolioData.settings.telegram },
    { key: 'linkedin', label: language === 'ua' ? 'LinkedIn' : 'LinkedIn Link', valUa: portfolioData.contacts?.linkedin || portfolioData.settings.linkedin, valEn: portfolioData.contacts?.linkedin || portfolioData.settings.linkedin },
    { key: 'behance', label: language === 'ua' ? 'Behance' : 'Behance Link', valUa: portfolioData.contacts?.behance || 'https://behance.net/ivanselivanov', valEn: portfolioData.contacts?.behance || 'https://behance.net/ivanselivanov' },
    { key: 'github', label: language === 'ua' ? 'GitHub' : 'GitHub Link', valUa: portfolioData.contacts?.github || 'https://github.com/ivanselivanov', valEn: portfolioData.contacts?.github || 'https://github.com/ivanselivanov' },
    { key: 'phone', label: language === 'ua' ? 'Телефон' : 'Phone Number', valUa: portfolioData.contacts?.phone || '', valEn: portfolioData.contacts?.phone || '' },
    { key: 'address', label: language === 'ua' ? 'Адреса / Локація' : 'Address / Location', valUa: portfolioData.contacts?.address?.ua || portfolioData.contacts?.location?.ua || portfolioData.settings.location?.ua || 'Львів, Україна (Доступний по всьому світу)', valEn: portfolioData.contacts?.address?.en || portfolioData.contacts?.location?.en || portfolioData.settings.location?.en || 'Lviv, Ukraine (Available Worldwide)' },
  ];

  return (
    <AnimatePresence>
      <div key="sheets-sync-modal-backdrop" className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
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
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'projects'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка Projects' : 'Projects Tab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('statuses')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'statuses'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка Statuses' : 'Statuses Tab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'contacts'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка Contacts' : 'Contacts Tab'}</span>
            </button>

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
              onClick={() => setActiveTab('workflow')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'workflow'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка Workflow' : 'Workflow Tab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 font-medium cursor-pointer transition-colors shrink-0 ${
                activeTab === 'faq'
                  ? 'border-emerald-400 text-white bg-neutral-900/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'ua' ? 'Вкладка FAQ' : 'FAQ Tab'}</span>
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
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Вкладка "Projects" (Усі кейси та роботи)' : '"Projects" Tab (All Cases & Works)'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? 'Колонка ролі тепер підтримується: додайте "role_ua" та "role_en" (або просто "role" для обох мов). Вона автоматично відображається в блоці Role у перегляді кейсу.'
                          : 'Role column is now fully supported: add "role_ua" & "role_en" (or single "role" for both). It displays inside the Role block in the case study view.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyProjectsHeaders}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                        title={language === 'ua' ? 'Скопіювати лише рядок назв колонок' : 'Copy only the header row'}
                      >
                        {copiedProjectsHeaders ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>
                          {copiedProjectsHeaders
                            ? (language === 'ua' ? 'Заголовки скопійовано!' : 'Headers Copied!')
                            : (language === 'ua' ? 'Скопіювати рядок колонок' : 'Copy Header Row')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyProjectsTsv}
                        className="px-4 py-2 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedProjectsTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>
                          {copiedProjectsTsv
                            ? (language === 'ua' ? 'Кейси скопійовано!' : 'Projects Copied!')
                            : (language === 'ua' ? 'Скопіювати шаблон Projects' : 'Copy Projects Template')}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800">
                    <p className="text-neutral-400 text-xs mb-2 font-mono">
                      {language === 'ua' ? 'Повний перелік колонок вкладки Projects:' : 'Complete list of columns for Projects tab:'}
                    </p>
                    <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre select-all">
                      {projectsHeadersRow}
                    </div>
                    <div className="mt-3 text-xs text-neutral-400 space-y-1.5">
                      <p>
                        <strong className="text-emerald-400">client_ua / client_en</strong> — {language === 'ua' ? 'Назва клієнта/замовника окремо українською та англійською мовами (також підтримується спільна колонка "client").' : 'Client name in Ukrainian and English (single "client" column also supported).'}
                      </p>
                      <p>
                        <strong className="text-emerald-400">mobileThumbnailUrl</strong> — {language === 'ua' ? 'Посилання на мобільне прев’ю/скріншот для веб- та UI/UX-дизайнів. Якщо є обидві версії — виводяться кнопки [Desktop / Mobile]; якщо завантажено лише мобільну — виводиться тільки [Mobile]; для інших категорій (3D, книги, брендинг) ці кнопки приховані.' : 'URL to mobile preview/screenshot for web and UI/UX designs. If both versions exist — [Desktop / Mobile] switcher appears; if only mobile is uploaded — only [Mobile] appears; for other design categories (3D, books, branding) device buttons remain hidden.'}
                      </p>
                      <p>
                        <strong className="text-emerald-400">role_ua / role_en</strong> — {language === 'ua' ? 'Ваша посада чи роль у проєкті окремо українською та англійською (наприклад: "Провідний дизайнер" / "Lead Designer"). Також підтримується спільна колонка "role".' : 'Your position or role in the project.'}
                      </p>
                      <p>
                        <strong className="text-[#0acf83]">figmaUrl / figmaEmbedUrl</strong> — {language === 'ua' ? 'Посилання на макет або інтерактивний прототип Figma (наприклад: https://www.figma.com/design/... або https://embed.figma.com/proto/...). Забезпечує інтерактивний перегляд та кнопку переходу в сам макет.' : 'URL to Figma file or prototype. Enables interactive Figma prototype preview and direct open button.'}
                      </p>
                      <p>
                        <strong className="text-emerald-400">fonts_ua / fonts_en</strong> — {language === 'ua' ? 'Шрифтові гарнітури та їх призначення двома мовами (наприклад, "Druk Wide (Акцентний), Inter (Тіло)" / "Druk Wide (Display), Inter (Body)"). Також підтримується спільна колонка "fonts".' : 'Bilingual typography specimens. Single "fonts" is also supported.'}
                      </p>
                      <p>
                        <strong className="text-emerald-400">colors_ua / colors_en</strong> — {language === 'ua' ? 'Назви кольорових токенів та HEX-коди (наприклад, "Вугільний: #0F0F11, Електрик: #00E5FF" / "Carbon: #0F0F11, Electric: #00E5FF"). Також підтримуються спільні "colors" або "palette".' : 'Bilingual color palette with names and HEX codes. Single "colors" or "palette" also supported.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'statuses' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Окрема вкладка "Statuses" (або "Статуси"):' : 'Dedicated "Statuses" tab (id | ua | en | badge_ua | badge_en):'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? '1. Створіть у вашій Google-таблиці нову вкладку з назвою '
                          : '1. Create a new tab in your Google Sheet named '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">Statuses</strong>
                        {language === 'ua' ? ' (або Статуси).' : ' (or Statuses).'}
                      </p>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                        {language === 'ua'
                          ? '2. Натисніть кнопку "Скопіювати шаблон Statuses", виберіть клітинку A1 і вставте (Ctrl+V / Cmd+V).'
                          : '2. Click "Copy Statuses Template", select cell A1, and paste (Ctrl+V / Cmd+V).'}
                      </p>
                      <p className="text-neutral-400 text-xs mt-1">
                        {language === 'ua'
                          ? '3. Дозволяє налаштувати тексти статусів для верхнього фільтра та бейджів карток окремо українською та англійською мовами.'
                          : '3. Controls filter labels and project card badges for all statuses in both Ukrainian and English.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyStatusesHeaders}
                        className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedStatusesHeaders ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{language === 'ua' ? 'Скопіювати заголовки' : 'Copy Headers'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyStatusesTsv}
                        className="px-4 py-2.5 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedStatusesTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{language === 'ua' ? 'Скопіювати шаблон Statuses' : 'Copy Statuses TSV'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Statuses Preview Table */}
                <div className="border border-neutral-800 bg-neutral-950 overflow-hidden">
                  <div className="bg-neutral-900/60 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                      {language === 'ua' ? 'Зразок колонок та даних вкладки "Statuses":' : 'Statuses Tab Columns & Rows Preview:'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">5 COLUMNS (TSV)</span>
                  </div>
                  <div className="overflow-x-auto max-h-[340px]">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead className="bg-neutral-900 text-neutral-400 sticky top-0 border-b border-neutral-800">
                        <tr>
                          <th className="p-3 font-semibold text-emerald-400">id</th>
                          <th className="p-3 font-semibold text-white">ua (Фільтр)</th>
                          <th className="p-3 font-semibold text-white">en (Filter)</th>
                          <th className="p-3 font-semibold text-amber-300">badge_ua (Бейдж)</th>
                          <th className="p-3 font-semibold text-amber-300">badge_en (Badge)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                        <tr className="hover:bg-neutral-900/40">
                          <td className="p-3 font-semibold text-emerald-400">all</td>
                          <td className="p-3">Всі статуси</td>
                          <td className="p-3 text-neutral-400">All statuses</td>
                          <td className="p-3 text-amber-300/80">Всі</td>
                          <td className="p-3 text-neutral-400">All</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40">
                          <td className="p-3 font-semibold text-emerald-400">concept</td>
                          <td className="p-3">Концепт</td>
                          <td className="p-3 text-neutral-400">Concept</td>
                          <td className="p-3 text-amber-300/80">Концепт</td>
                          <td className="p-3 text-neutral-400">Concept</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40">
                          <td className="p-3 font-semibold text-emerald-400">realized</td>
                          <td className="p-3">Реалізовані (Продакшн)</td>
                          <td className="p-3 text-neutral-400">Live (Production)</td>
                          <td className="p-3 text-amber-300/80">Продакшн</td>
                          <td className="p-3 text-neutral-400">Production</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40">
                          <td className="p-3 font-semibold text-emerald-400">wip</td>
                          <td className="p-3">В роботі</td>
                          <td className="p-3 text-neutral-400">In Progress</td>
                          <td className="p-3 text-amber-300/80">В процесі</td>
                          <td className="p-3 text-neutral-400">WIP</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800/80 p-4 space-y-2 text-xs text-neutral-300">
                  <h5 className="font-mono text-emerald-400 uppercase tracking-wider font-medium">
                    {language === 'ua' ? 'Альтернативні способи перекладу статусів:' : 'Alternative ways to localize statuses:'}
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>
                      <strong className="text-white">{language === 'ua' ? 'У вкладці Projects:' : 'In Projects tab:'}</strong> {language === 'ua' ? 'можна додати колонки status_ua та status_en безпосередньо у рядок кожного проєкту (наприклад: status_ua: "Концепт", status_en: "Concept").' : 'add status_ua and status_en columns directly to each project row.'}
                    </li>
                    <li>
                      <strong className="text-white">{language === 'ua' ? 'У вкладці General_Data:' : 'In General_Data tab:'}</strong> {language === 'ua' ? 'можна змінити ключі filter_status_conceptual, filter_status_production, badge_concept, badge_production, filter_status_all.' : 'configure keys filter_status_conceptual, filter_status_production, badge_concept, badge_production, filter_status_all.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Окрема вкладка "Contacts" (key | ua | en):' : 'Dedicated "Contacts" tab (key | ua | en):'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? '1. Створіть у вашій Google-таблиці нову вкладку з назвою '
                          : '1. Create a new tab in your Google Sheet named '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">Contacts</strong>
                        {language === 'ua' ? ' (або contacts).' : ' (or contacts).'}
                      </p>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1">
                        {language === 'ua'
                          ? '2. Натисніть кнопку "Скопіювати шаблон Contacts", виберіть клітинку A1 і вставте (Ctrl+V / Cmd+V).'
                          : '2. Click "Copy Contacts Template", select cell A1, and paste (Ctrl+V / Cmd+V).'}
                      </p>
                      <p className="text-neutral-400 text-xs mt-1">
                        {language === 'ua'
                          ? '3. З цієї вкладки зчитуються виключно прямі контакти та адреса/локація для футера та меню сайту.'
                          : '3. This tab strictly supplies direct contact channels and location/address for the footer and navigation.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyContactsTsv}
                      className="px-4 py-2.5 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shrink-0 shadow"
                    >
                      {copiedContactsTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>
                        {copiedContactsTsv
                          ? (language === 'ua' ? 'Скопійовано!' : 'Copied!')
                          : (language === 'ua' ? 'Скопіювати шаблон Contacts' : 'Copy Contacts Template')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Structure preview table */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    {language === 'ua' ? 'Поля вкладки Contacts (key | ua | en):' : 'Contacts Tab Fields (key | ua | en):'}
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
                        {contactsPreviewRows.map((row, idx) => (
                          <tr key={`${row.key}-${idx}`} className="hover:bg-neutral-900/50">
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
                      ? 'Всі поля підтримують двомовність. Зміна email або посилань одразу оновлює меню "IS", футер і копіювання контактів.'
                      : 'All fields support bilingual texts. Modifying emails or social links dynamically updates the "IS" menu, footer, and clipboard action.'}
                  </p>
                </div>
              </div>
            )}

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
                        {generalPreviewRows.map((row, idx) => (
                          <tr key={`${row.key}-${idx}`} className="hover:bg-neutral-900/50">
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

            {activeTab === 'workflow' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Вкладка "Workflow" (4 етапи робочого процесу)' : '"Workflow" Tab (4-phase delivery process)'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? 'Створіть у вашій Google-таблиці окрему вкладку з назвою '
                          : 'Create a new tab in your Google Sheet named '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">Workflow</strong>
                        {language === 'ua' ? ' (або Process).' : ' (or Process).'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyWorkflowHeaders}
                        className="px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-colors font-mono text-xs flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedWorkflowHeaders ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWorkflowHeaders ? (language === 'ua' ? 'Скопійовано' : 'Copied') : (language === 'ua' ? 'Заголовки' : 'Headers')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyWorkflowTsv}
                        className="px-4 py-2 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedWorkflowTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedWorkflowTsv ? (language === 'ua' ? 'Скопійовано!' : 'Copied!') : (language === 'ua' ? 'Скопіювати шаблон' : 'Copy Template')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre select-all">
                    {workflowHeadersRow}
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    {language === 'ua' ? 'Попередній перегляд етапів:' : 'Workflow phases preview:'}
                  </h5>
                  <div className="border border-neutral-800 bg-neutral-950 font-mono text-xs overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                        <tr>
                          <th className="p-2.5">stepNumber</th>
                          <th className="p-2.5">title_ua</th>
                          <th className="p-2.5">title_en</th>
                          <th className="p-2.5">tools</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {DEFAULT_WORKFLOW.map((w, idx) => (
                          <tr key={`${w.id}-${idx}`} className="hover:bg-neutral-900/50">
                            <td className="p-2.5 font-bold text-cyan-400">{w.stepNumber}</td>
                            <td className="p-2.5 font-medium">{w.title.ua}</td>
                            <td className="p-2.5 text-neutral-400">{w.title.en}</td>
                            <td className="p-2.5 text-emerald-400">{(w.tools || []).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 mt-2">
                    {language === 'ua'
                      ? 'Підказка: колонка highlightTool дозволяє виділити бейджем інструмент (наприклад, Stitch як сучасний AI-інструмент швидкого прототипування).'
                      : 'Tip: highlightTool column displays an accent badge for the selected tool (e.g. Stitch).'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                        {language === 'ua' ? 'Вкладка "FAQ" (Часті запитання та умови співпраці)' : '"FAQ" Tab (Frequently asked questions)'}
                      </h4>
                      <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
                        {language === 'ua'
                          ? 'Створіть у вашій Google-таблиці окрему вкладку з назвою '
                          : 'Create a new tab in your Google Sheet named '}
                        <strong className="text-white font-mono bg-black px-2 py-0.5 border border-neutral-700">FAQ</strong>
                        {language === 'ua' ? ' (або Questions).' : ' (or Questions).'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyFaqHeaders}
                        className="px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-colors font-mono text-xs flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedFaqHeaders ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedFaqHeaders ? (language === 'ua' ? 'Скопійовано' : 'Copied') : (language === 'ua' ? 'Заголовки' : 'Headers')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyFaqTsv}
                        className="px-4 py-2 bg-[#f4f4f0] text-black hover:bg-white transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow"
                      >
                        {copiedFaqTsv ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedFaqTsv ? (language === 'ua' ? 'Скопійовано!' : 'Copied!') : (language === 'ua' ? 'Скопіювати шаблон' : 'Copy Template')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-black border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre select-all">
                    {faqHeadersRow}
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                    {language === 'ua' ? 'Попередній перегляд запитань:' : 'Questions preview:'}
                  </h5>
                  <div className="border border-neutral-800 bg-neutral-950 font-mono text-xs overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                        <tr>
                          <th className="p-2.5">question_ua</th>
                          <th className="p-2.5">question_en</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {DEFAULT_FAQ.map((f, idx) => (
                          <tr key={`${f.id}-${idx}`} className="hover:bg-neutral-900/50">
                            <td className="p-2.5 font-medium">{f.question.ua}</td>
                            <td className="p-2.5 text-neutral-400">{f.question.en}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                        {legalPreviewRows.map((row, idx) => (
                          <tr key={`${row.key}-${idx}`} className="hover:bg-neutral-900/50">
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

                {portfolioData.hasLegalDataInEndpoint === false && (
                  <div className="p-4 bg-amber-950/30 border border-amber-500/50 space-y-2 text-xs font-mono text-amber-200">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{language === 'ua' ? 'Поточний URL Apps Script ще не віддає Legal_And_Banners' : 'Active Apps Script URL has not delivered Legal_And_Banners yet'}</span>
                    </div>
                    <p className="text-neutral-300 font-sans text-xs leading-relaxed">
                      {language === 'ua' ? (
                        <>
                          Google Apps Script повернув відповідь (ключі: <code className="text-white bg-black px-1">{portfolioData.rawEndpointResponseKeys?.join(', ')}</code>), але в ній відсутня секція <code className="text-white bg-black px-1">legalAndBanners</code>.
                          <br />
                          <strong>Два швидкі рішення:</strong>
                          <br />
                          1. <strong>Перенести рядок у General_Data:</strong> додайте рядок <code className="text-emerald-400 bg-black px-1">cookie_title</code> у вже працюючу вкладку <strong>General_Data</strong>. Вона зчитується автоматично без оновлення розгортань!
                          <br />
                          2. <strong>Оновити URL:</strong> якщо ви обрали «Нове розгортання» в Google, скопіюйте новий отриманий URL веб-додатка в поле вгорі.
                        </>
                      ) : (
                        <>
                          Google Apps Script returned keys: <code className="text-white bg-black px-1">{portfolioData.rawEndpointResponseKeys?.join(', ')}</code> without <code className="text-white bg-black px-1">legalAndBanners</code>.
                          <br />
                          1. Either paste <code className="text-emerald-400 bg-black px-1">cookie_title</code> directly into your active <strong>General_Data</strong> tab.
                          <br />
                          2. Or if you created a New Deployment, copy the newly issued Web App URL into the field above.
                        </>
                      )}
                    </p>
                    {endpointUrl && (
                      <a
                        href={endpointUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-white underline pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'ua' ? 'Перевірити відповідь Google Apps Script у новій вкладці' : 'Check raw Google Apps Script JSON in new tab'}</span>
                      </a>
                    )}
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
                {/* Critical Deployment Tip Alert */}
                <div className="bg-amber-950/30 border border-amber-500/50 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{language === 'ua' ? 'Важливо: як опублікувати оновлення в Google Apps Script' : 'Crucial: How to publish updates in Google Apps Script'}</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">
                    {language === 'ua' ? (
                      <>
                        Якщо ви змінили код скрипта або додали нову вкладку, просто зберегти файл (Ctrl+S) <strong>недостатньо</strong> — веб-додаток продовжить віддавати старі дані.
                        <br />
                        <strong>Обов’язковий крок:</strong> в Apps Script натисніть{' '}
                        <span className="text-amber-300 font-semibold">«Розгорнути» (Deploy) ➔ «Керування розгортаннями» (Manage deployments)</span> ➔ натисніть іконку <strong>Олівця (Редагувати)</strong> ➔ у випадаючому списку «Версія» виберіть <span className="text-emerald-400 font-semibold">«Нова версія» (New version)</span> ➔ натисніть <strong>«Розгорнути» (Deploy)</strong>.
                      </>
                    ) : (
                      <>
                        Saving changes in the editor (Ctrl+S) only saves the draft. The live web app URL continues serving the previous version.
                        <br />
                        <strong>Required step:</strong> in Apps Script click{' '}
                        <span className="text-amber-300 font-semibold">Deploy ➔ Manage deployments</span> ➔ click the <strong>Pencil icon (Edit)</strong> ➔ under Version select <span className="text-emerald-400 font-semibold">New version</span> ➔ click <strong>Deploy</strong>.
                      </>
                    )}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
                    💡 {language === 'ua' 
                      ? 'Швидкий лайфхак: ви також можете вставити рядки cookie_* прямо в кінець вашої існуючої вкладки General_Data, і сайт зчитає їх автоматично!' 
                      : 'Quick tip: You can also append the cookie_* rows directly into your existing General_Data sheet!'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-400 font-mono">
                    {language === 'ua'
                      ? 'Повний код скрипта для оновлення (підтримує Projects, General_Data, Contacts, Experience, Testimonials, Legal_And_Banners):'
                      : 'Complete script code to paste (supports Projects, General_Data, Contacts, Experience, Testimonials, Legal_And_Banners):'}
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
