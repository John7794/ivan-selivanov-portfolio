import { Project, ExperienceItem, Testimonial, GeneralSettings, LegalAndBannersData, ContactsData, WorkflowStep, FAQItem } from '../types';

export const DEFAULT_SETTINGS: GeneralSettings = {
  name: {
    ua: 'Іван Селіванов',
    en: 'Ivan Selivanov'
  },
  title: {
    ua: 'Мультидисциплінарний цифровий дизайнер',
    en: 'Multidisciplinary Digital Designer'
  },
  bioShort: {
    ua: 'Проєктую цифрові продукти, вебсайти та візуальну айдентику, поєднуючи академічну базу дизайну з інженерною логікою.',
    en: 'I design digital products, websites, and visual identities, combining academic design foundations with engineering logic.'
  },
  heroTag: {
    ua: 'Готовий до співпраці',
    en: 'Available for work'
  },
  heroTagline: {
    ua: 'Проєктую цифрові продукти, вебсайти та візуальну айдентику, поєднуючи академічну базу дизайну з інженерною логікою.',
    en: 'I design digital products, websites, and visual identities, combining academic design foundations with engineering logic.'
  },
  location: {
    ua: 'Львів, Україна (Доступний по всьому світу)',
    en: 'Lviv, Ukraine (Available Worldwide)'
  },
  email: 'ivanselivanov771994@gmail.com',
  telegram: '',
  linkedin: 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/',
  behance: '',
  github: '',
  heroImage: 'https://drive.google.com/uc?export=download&id=1jCDr21Fo4A_b8X4sIWeQHhOLG2LcJJnq',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbzWBH_tyMHYUEeaRM1u91hS1TWTKiQm3F2H6eFfQNN9oUBIKfbwZnF36kFERfZ9D1gLhA/exec',
  googleSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  lastSyncedAt: 'Live Google Sheets Connected',
  expertise: {
    heading: { ua: 'Експертиза', en: 'Expertise' },
    subtitle: { 
      ua: 'Мої ключові навички та напрямки роботи, в яких я створюю ефективні цифрові рішення.', 
      en: 'My core skills and areas of focus where I create effective digital solutions.' 
    },
    card1Title: { ua: 'UI/UX Дизайн', en: 'UI/UX Design' },
    card1Desc: { 
      ua: 'Проєктування зручних користувацьких інтерфейсів, створення прототипів та адаптивного дизайну з фокусом на користувацький досвід у Figma.', 
      en: 'Designing intuitive user interfaces, creating prototypes, and responsive web design with a focus on user experience in Figma.' 
    },
    card2Title: { ua: 'Графічний дизайн', en: 'Graphic Design' },
    card2Desc: { 
      ua: 'Створення логотипів, банерів та комп\'ютерної графіки. Застосування теорії кольору та основ композиції.', 
      en: 'Creating logos, banners, and computer graphics. Applying color theory and composition fundamentals.' 
    },
    card3Title: { ua: 'Веброзробка', en: 'Web Development' },
    card3Desc: { 
      ua: 'Верстка лендингів та розробка сайтів з використанням HTML, CSS, JavaScript, робота з SVG та розгортання проєктів на Vercel.', 
      en: 'Landing page markup and website development using HTML, CSS, JavaScript, working with SVG, and deploying projects on Vercel.' 
    },
    card4Title: { ua: 'Маркетинг та Аналітика', en: 'Marketing & Analytics' },
    card4Desc: {
      ua: 'Налаштування та оптимізація рекламних кампаній (Google Ads, Meta Ads) та вебаналітики через Google Tag Manager, робота з даними у Google Sheets.',
      en: 'Setting up and optimizing advertising campaigns (Google Ads, Meta Ads) and web analytics via Google Tag Manager, working with data in Google Sheets.'
    },
    heuristics: { 
      ua: [
        'Дизайн інтерфейсів', 
        'Візуальний дизайн', 
        'Фронтенд', 
        'Таргетинг'
      ], 
      en: [
        'Interface Design', 
        'Visual Design', 
        'Frontend', 
        'Targeting'
      ] 
    },
    techStackTitle: { ua: 'Інструменти та Технології', en: 'Tools & Technologies' },
    techStackItems: [
      'Figma',
      'HTML',
      'CSS',
      'JavaScript',
      'Vercel',
      'Google AI Studio',
      'Google Ads',
      'Meta Ads',
      'Google Tag Manager',
      'Google Sheets',
      'SVG',
      'Adobe Illustrator'
    ]
  },
  menu: {
    systemTitle: { ua: 'IS // СИСТЕМА НАВІГАЦІЇ', en: 'IS // NAVIGATION SYSTEM' },
    item1Title: { ua: 'Проєкти', en: 'Selected Work' },
    item1Desc: { ua: 'Вибрані кейси & інтерфейси', en: 'Featured cases & digital products' },
    item2Title: { ua: 'Експертиза', en: 'Core Expertise' },
    item2Desc: { ua: 'UI/UX, графіка та стек', en: 'UI/UX, visual design & tech' },
    item3Title: { ua: 'Досвід', en: 'Career Timeline' },
    item3Desc: { ua: 'Кар’єрний шлях та ролі', en: 'Professional trajectory & milestones' },
    item4Title: { ua: 'Контакти', en: 'Get In Touch' },
    item4Desc: { ua: 'Зв’язок для нових викликів', en: 'Direct collaboration inquiries' },
    itemWorkflowTitle: { ua: 'Процес', en: 'Workflow' },
    itemWorkflowDesc: { ua: '4 етапи від брифу до передачі в розробку', en: '4-phase delivery from brief to dev handoff' },
    itemFaqTitle: { ua: 'FAQ', en: 'FAQ' },
    itemFaqDesc: { ua: 'Формати співпраці, NDA та умови', en: 'Collaboration models, NDA & turnaround' },
    contactsTitle: { ua: 'Прямі контакти:', en: 'Direct Channels:' },
    copyBtn: { ua: 'Копія', en: 'Copy' },
    copiedBtn: { ua: 'Копія!', en: 'Copied!' }
  },
  ui: {
    heroCta: { ua: 'Дослідити кейси', en: 'Explore case studies' },
    workIndex: { ua: '01 // INDEXED CASE STUDIES', en: '01 // INDEXED CASE STUDIES' },
    workTitle: { ua: 'Вибрані Роботи', en: 'Selected Works' },
    layoutCascade: { ua: 'Каскад', en: 'Masonry' },
    layoutGrid: { ua: 'Сітка', en: 'Grid' },
    filterCategoryLabel: { ua: 'Напрямок:', en: 'Discipline:' },
    filterCategoryAll: { ua: 'Всі напрямки', en: 'All disciplines' },
    filterCategoryIdentity: { ua: 'Айдентика & Постери', en: 'Identity & Posters' },
    filterCategoryUiux: { ua: 'UI/UX / Web Design', en: 'UI/UX / Web Design' },
    filterCategoryPrint: { ua: 'Дизайн книжок / Друк', en: 'Editorial / Print Design' },
    filterCategoryAds: { ua: 'Реклама / Соціальні мережі', en: 'Advertising / Social Media' },
    filterCategory3d: { ua: '3D Моделювання', en: '3D Modeling' },
    filterStatusLabel: { ua: 'Статус:', en: 'Status:' },
    filterStatusAll: { ua: 'Всі статуси', en: 'All statuses' },
    filterStatusConceptual: { ua: 'Концепт', en: 'Concept' },
    filterStatusProduction: { ua: 'Реалізовані (Продакшн)', en: 'Live (Production)' },
    expertiseIndex: { ua: '02 // METHODOLOGY & CAPABILITIES', en: '02 // METHODOLOGY & CAPABILITIES' },
    quoteText: { 
      ua: '"Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials."', 
      en: '"Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials."' 
    },
    quoteAuthor: { 
      ua: '— Dieter Rams (Ten Principles for Good Design)', 
      en: '— Dieter Rams (Ten Principles for Good Design)' 
    },
    experienceIndex: { ua: '03 // TRACK RECORD', en: '03 // TRACK RECORD' },
    experienceTitle: { ua: 'Кар’єрний Шлях & Досвід', en: 'Career Track & Background' },
    experienceSubtitle: { 
      ua: 'Хронологія комерційних проєктів, артдирекції та фундаментальної академічної школи', 
      en: 'Timeline of design leadership, commercial execution, and academic honors' 
    },
    contactHeading: { ua: 'Маєте амбітний проєкт?', en: 'Have an ambitious project?' },
    contactCta: { ua: 'Обговорити', en: "Let's Talk" },
    contactEmailLabel: { ua: 'Прямий контакт', en: 'Direct Inquiries' },
    contactSocialLabel: { ua: 'Мережі', en: 'Networks' },
    contactLocationLabel: { ua: 'Локальний час', en: 'Local Time' },
    // Portfolio & Case Study Modal UI strings
    modalCaseStudy: { ua: 'CASE STUDY //', en: 'CASE STUDY //' },
    modalPrev: { ua: 'Попередній', en: 'Previous' },
    modalNext: { ua: 'Наступний', en: 'Next' },
    modalClose: { ua: 'Закрити', en: 'Close' },
    modalLive: { ua: 'Live', en: 'Live' },
    modalRole: { ua: 'Роль', en: 'Role' },
    modalTimeline: { ua: 'Період', en: 'Timeline' },
    modalCategory: { ua: 'Категорія', en: 'Category' },
    modalDeliverables: { ua: 'Результати', en: 'Deliverables' },
    modalInteractiveExperience: { ua: 'INTERACTIVE VISUAL EXPERIENCE', en: 'INTERACTIVE VISUAL EXPERIENCE' },
    modalMaxSpace: { ua: 'Максимум місця', en: 'Max space' },
    modalFitFrame: { ua: 'Вписати в екран', en: 'Fit frame' },
    modalFullscreen: { ua: 'На весь екран', en: 'Fullscreen' },
    modalOverview: { ua: 'Огляд проєкту', en: 'Project Overview' },
    modalChallenge: { ua: 'Виклик & Проблема', en: 'The Challenge' },
    modalSolution: { ua: 'Архітектурне Рішення', en: 'The Solution' },
    modalImpact: { ua: 'Результати & Бізнес-Метрики', en: 'Business Impact & Metrics' },
    modalDesignSystem: { ua: 'Дизайн-Система & Токени', en: 'Design Tokens & Typography' },
    modalFonts: { ua: 'Шрифти', en: 'Typography' },
    modalColors: { ua: 'Колірна палітра', en: 'Color Palette' },
    modalGrid: { ua: 'Тип сітки', en: 'Grid Architecture' },
    modalTools: { ua: 'Інструменти', en: 'Tooling' },
    modalClientReview: { ua: 'Відгук замовника', en: 'Client Endorsement' },
    modalVisitLive: { ua: 'Переглянути Live Проєкт', en: 'Explore Live Interface' },
    modalCopied: { ua: 'Скопійовано', en: 'Copied' },
    modalArtifacts: { ua: 'Екрани та Артефакти', en: 'Screens & Artifacts' },
    modalTabScreens: { ua: 'Макети', en: 'Screens' },
    modalTabFigma: { ua: 'Інтерактивна Figma', en: 'Interactive Figma' },
    modalFigmaTitle: { ua: 'ІНТЕРАКТИВНИЙ ПРОТОТИП FIGMA', en: 'INTERACTIVE FIGMA PROTOTYPE' },
    modalFigmaSubtitle: { ua: 'Клікабельний прототип у реальному часі', en: 'Live clickable prototype' },
    modalAllScreens: { ua: 'Всі макети та екрани', en: 'All Screens & Visual Assets' },
    modalActiveViewer: { ua: 'АКТИВНИЙ В СИМУЛЯТОРІ', en: 'ACTIVE IN VIEWER' },
    modalOpenFigma: { ua: 'Перейти в макет Figma', en: 'Open in Figma' },
    modalOpenLive: { ua: 'Відкрити live проєкт', en: 'Open live project' },
    modalTipFigma: { 
      ua: 'Порада: ви можете клікати по елементах всередині фрейму або масштабувати макет коліщатком миші.', 
      en: 'Tip: interact with prototype hot-spots directly inside the frame or zoom with mouse scroll.' 
    },
    badgeFeatured: { ua: 'Обрані', en: 'Selected' },
    badgeConcept: { ua: 'Концепт', en: 'Concept' },
    badgeProduction: { ua: 'Продакшн', en: 'Production' },
    cardViewCase: { ua: 'Відкрити кейс', en: 'Open case study' },
    // Workflow Section UI
    workflowIndex: { ua: '04 // WORKFLOW & PIPELINE', en: '04 // WORKFLOW & PIPELINE' },
    workflowTitle: { ua: 'Як Побудовано Робочий Процес', en: 'Design Execution & Delivery Pipeline' },
    workflowSubtitle: { 
      ua: 'Прозорий та передбачуваний 4-етапний пайплайн від первинного брифу до піксель-перфект системи, інтерактивних прототипів та продакшну.', 
      en: 'A transparent, structured 4-phase methodology from initial briefing to pixel-perfect design tokens, interactive prototypes, and production.' 
    },
    workflowDeliverablesLabel: { ua: 'Ключові результати:', en: 'Core Deliverables:' },
    workflowToolsLabel: { ua: 'Інструменти:', en: 'Tooling:' },
    // FAQ Section UI
    faqIndex: { ua: '05 // FREQUENTLY ASKED QUESTIONS', en: '05 // FREQUENTLY ASKED QUESTIONS' },
    faqTitle: { ua: 'Часті Запитання & Умови Співпраці', en: 'Frequently Asked Questions & Terms' },
    faqSubtitle: { 
      ua: 'Відповіді на ключові організаційні, технічні та юридичні питання перед стартом спільної роботи над проєктом.', 
      en: 'Direct answers on engagement models, confidentiality, developer handoff, and turnaround times.' 
    },
    faqContactPrompt: { ua: 'Залишились додаткові питання щодо вашого проєкту?', en: 'Have specific questions about your upcoming product?' },
    faqContactCta: { ua: 'Написати напряму', en: 'Get In Touch Directly' }
  }
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [];

export const DEFAULT_PROJECTS: Project[] = [
  {
    "id": "1",
    "slug": "1",
    "title": {
      "ua": "Логотип Inspace",
      "en": "Inspace Logo"
    },
    "title_ua": "Логотип Inspace",
    "title_en": "Inspace Logo",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "branding",
    "categoryLabel": {
      "ua": "Айдентика & Постери",
      "en": "Identity & Posters"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2018",
    "tagline": {
      "ua": "Мінімалістичний логотип з акцентом на геометрію та негативний простір.",
      "en": "Minimalist logo design emphasizing geometry and negative space."
    },
    "description": {
      "ua": "Візуальна концепція логотипа Inspace базується на чистому геометричному гротеску. Головним візуальним акцентом є літера «s», обрамлена тонким колом із пурпурово-рожевим градієнтом. Це рішення символізує фокус, динаміку космічної тематики та неперервність інноваційних процесів.",
      "en": "The visual concept of the Inspace logo is based on a clean geometric sans-serif. The main visual accent is the letter \"s\" framed by a thin circle with a purple-pink gradient. This solution symbolizes focus, the dynamics of the space theme, and the continuity of innovative processes."
    },
    "problemStatement": {
      "ua": "Розробити сучасний мінімалістичний логотип для космічного проєкту, передавши ідеї динаміки та інновацій без використання банальних візуальних штампів.",
      "en": "Develop a modern minimalist logo for a space project, conveying the ideas of dynamics and innovation without using cliché visual tropes."
    },
    "solution": {
      "ua": "Розроблено лаконічний знак, де літера «s» інтегрована у тонке коло з пурпурово-рожевим градієнтом, що візуалізує неперервність інноваційних процесів.",
      "en": "Developed a concise mark where the letter \"s\" is integrated into a thin circle with a purple-pink gradient, visualizing the continuity of innovative processes."
    },
    "businessImpact": {
      "ua": "Проєкт демонструє вміння працювати з мінімалізмом та абстрактними формами, пропонуючи перспективний візуальний бренд, що легко масштабується для цифрових продуктів.",
      "en": "The project demonstrates the ability to work with minimalism and abstract forms, offering a promising visual brand that easily scales for digital products."
    },
    "toolsUsed": [
      "Adobe Illustrator",
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Nonchalance"
      ],
      "fontsDescription": {
        "ua": "Геометрична чистота шрифту ідеально передає технологічність, інноваційність та космічну естетику.",
        "en": "The geometric clarity perfectly conveys a technological, innovative, and cosmic aesthetic."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#312F70"
        },
        {
          "name": "Color 2",
          "hex": "#AE166B"
        }
      ],
      "colorsDescription": {
        "ua": "Пурпурово-рожевий градієнт на темно-синьому тлі символізує глибину космосу, енергію відкриттів та неперервність інновацій.",
        "en": "The purple-pink gradient on a dark blue background symbolizes the depth of space, the energy of discovery, and the continuity of innovation."
      }
    },
    "thumbnailUrl": "/projects/inspace-logo.webp",
    "galleryUrls": [
      "/projects/inspace-logo.webp"
    ],
    "isFeatured": false,
    "sortOrder": 1
  },
  {
    "id": "2",
    "slug": "2",
    "title": {
      "ua": "Логотип Музею українських салезіян УГКЦ",
      "en": "Museum of Ukrainian Salesians UGCC Logo"
    },
    "title_ua": "Логотип Музею українських салезіян УГКЦ",
    "title_en": "Museum of Ukrainian Salesians UGCC Logo",
    "client": {
      "ua": "Музей українських салезіян УГКЦ імені Вл. Андрія Сапеляка",
      "en": "The Bishop Andriy Sapelak Museum of Ukrainian Salesians of the UGCC"
    },
    "client_ua": "Музей українських салезіян УГКЦ імені Вл. Андрія Сапеляка",
    "client_en": "The Bishop Andriy Sapelak Museum of Ukrainian Salesians of the UGCC",
    "category": "branding",
    "categoryLabel": {
      "ua": "Айдентика & Постери",
      "en": "Identity & Posters"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2019",
    "tagline": {
      "ua": "Логотип, що поєднує українську етніку та сучасну типографію.",
      "en": "A logo combining Ukrainian ethnic motifs with modern typography."
    },
    "description": {
      "ua": "Візуальна ідентифікація побудована навколо стилізованого геометричного орнаменту, що відсилає до традиційної української вишивки та сакральної символіки. Сувора гротескна типографія балансує цей складний графічний знак, створюючи сучасний, але водночас автентичний образ культурної інституції.",
      "en": "The visual identity is built around a stylized geometric ornament that references traditional Ukrainian embroidery and sacred symbolism. Strict sans-serif typography balances this complex graphic mark, creating a modern yet authentic image of the cultural institution."
    },
    "problemStatement": {
      "ua": "Поєднати традиційні українські сакральні та етнічні мотиви із сучасними трендами графічного дизайну для створення актуального образу культурної інституції.",
      "en": "Combine traditional Ukrainian sacred and ethnic motifs with modern graphic design trends to create a contemporary image for a cultural institution."
    },
    "solution": {
      "ua": "Створено стилізований геометричний орнамент на основі сакральної символіки, збалансований строгим сучасним гротеском.",
      "en": "Created a stylized geometric ornament based on sacred symbolism, balanced by a strict modern sans-serif."
    },
    "businessImpact": {
      "ua": "Розроблено потужну візуальну гіпотезу, яка показує, як релігійна та культурна інституція може комунікувати із сучасною аудиторією через актуальний дизайн.",
      "en": "A powerful visual hypothesis was developed, showing how a religious and cultural institution can communicate with a modern audience through contemporary design."
    },
    "toolsUsed": [
      "Adobe Illustrator",
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Montserrat"
      ],
      "fontsDescription": {
        "ua": "Нейтральний і сучасний гротеск урівноважує складний етнічний знак, додаючи логотипу інституційної поважності та стриманості.",
        "en": "A neutral, modern sans-serif balances the complex ethnic mark, providing institutional weight and restraint to the logo."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#1B0D0D"
        },
        {
          "name": "Color 2",
          "hex": "#292941"
        },
        {
          "name": "Color 3",
          "hex": "#55200E"
        },
        {
          "name": "Color 4",
          "hex": "#5D6F9D"
        },
        {
          "name": "Color 5",
          "hex": "#7398C5"
        },
        {
          "name": "Color 6",
          "hex": "#F28C1D"
        },
        {
          "name": "Color 7",
          "hex": "#FCC022"
        },
        {
          "name": "Color 8",
          "hex": "#FFDA3F"
        }
      ],
      "colorsDescription": {
        "ua": "Багата палітра глибоких відтінків символізує багатогранність української культури, відсилаючи до кольорів традиційної вишивки та сакрального мистецтва.",
        "en": "The rich palette of deep shades symbolizes the multifaceted nature of Ukrainian culture, referring to the colors of traditional embroidery and sacred art."
      }
    },
    "thumbnailUrl": "/projects/muzei-saleziian.webp",
    "galleryUrls": [
      "/projects/muzei-saleziian.webp"
    ],
    "isFeatured": false,
    "sortOrder": 2
  },
  {
    "id": "3",
    "slug": "3",
    "title": {
      "ua": "Логотип Cosmopedia",
      "en": "Cosmopedia Logo"
    },
    "title_ua": "Логотип Cosmopedia",
    "title_en": "Cosmopedia Logo",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "branding",
    "categoryLabel": {
      "ua": "Айдентика & Постери",
      "en": "Identity & Posters"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2020",
    "tagline": {
      "ua": "Градієнтний логотип, що символізує космічну орбіту.",
      "en": "A gradient logo symbolizing a cosmic orbit."
    },
    "description": {
      "ua": "Концепція айдентики базується на стилізованій літері «С», що нагадує орбіти планет або фази місяця. Плавний перехід кольорів від глибокого синього до яскравого кармінового передає енергію космосу, науки та безперервного технологічного розвитку.",
      "en": "The identity concept is based on a stylized letter \"C\" resembling planetary orbits or lunar phases. A smooth color transition from deep blue to bright carmine conveys the energy of space, science, and continuous technological development."
    },
    "problemStatement": {
      "ua": "Створити лаконічний графічний знак, який візуалізує концепцію орбітального руху та космічної енергії, зберігаючи простоту та впізнаваність форми.",
      "en": "Create a concise graphic mark that visualizes the concept of orbital motion and cosmic energy while maintaining simplicity and form recognition."
    },
    "solution": {
      "ua": "Спроєктовано мінімалістичний знак у формі літери «С», що нагадує орбіту, з використанням динамічного градієнта від глибокого синього до кармінового.",
      "en": "Designed a minimalist mark in the shape of the letter \"C\" resembling an orbit, using a dynamic gradient from deep blue to carmine."
    },
    "businessImpact": {
      "ua": "Концепт ілюструє навичку створення динамічної айдентики, яка здатна стати міцною візуальною основою для потенційного освітнього або наукового стартапу.",
      "en": "The concept illustrates the skill of creating dynamic identity, which can become a solid visual foundation for a potential educational or scientific startup."
    },
    "toolsUsed": [
      "Adobe Illustrator",
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Amsterdam"
      ],
      "fontsDescription": {
        "ua": "Додає динаміки та візуальної виразності, підкреслюючи концепцію орбітального руху в логотипі.",
        "en": "Adds dynamics and visual expressiveness, emphasizing the concept of orbital motion in the logo."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#002CC7"
        },
        {
          "name": "Color 2",
          "hex": "#FD003D"
        }
      ],
      "colorsDescription": {
        "ua": "Перехід від глибокого синього до кармінового уособлює енергію космосу та пульсацію безперервного технологічного розвитку.",
        "en": "The transition from deep blue to carmine embodies the energy of space and the pulsation of continuous technological development."
      }
    },
    "thumbnailUrl": "/projects/cosmopedia.svg",
    "galleryUrls": [
      "/projects/cosmopedia.svg"
    ],
    "isFeatured": false,
    "sortOrder": 3
  },
  {
    "id": "4",
    "slug": "4",
    "title": {
      "ua": "Фандрейзингова платформа НУЛП",
      "en": "LPNU Fundraising Platform"
    },
    "title_ua": "Фандрейзингова платформа НУЛП",
    "title_en": "LPNU Fundraising Platform",
    "client": {
      "ua": "Національний університет «Львівська політехніка»",
      "en": "Lviv Polytechnic National University"
    },
    "client_ua": "Національний університет «Львівська політехніка»",
    "client_en": "Lviv Polytechnic National University",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Web Design",
      "en": "UI/UX / Web Design"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2023",
    "tagline": {
      "ua": "Концепт платформи для фандрейзингової кампанії університету.",
      "en": "Platform concept for the university's fundraising campaign."
    },
    "description": {
      "ua": "Дизайн платформи розроблено для залучення благодійних внесків від випускників та партнерів. Структура головної сторінки побудована на принципах сторітелінгу: від історій впливу до інформації про фонди. Академічна стилістика з бордовим кольором покликана підкреслити довіру до інституції.",
      "en": "The platform design was developed to attract charitable contributions from alumni and partners. The homepage structure is built on storytelling principles: from impact stories to information about funds. The academic visual style featuring a burgundy color aims to emphasize trust in the institution."
    },
    "problemStatement": {
      "ua": "Спроєктувати статусний лендинг для фандрейзингової кампанії, який викликатиме довіру у меценатів та ефективно комунікуватиме цінності університету через сторітелінг.",
      "en": "Design a premium landing page for a fundraising campaign that builds trust among patrons and effectively communicates the university's values through storytelling."
    },
    "solution": {
      "ua": "Побудовано структуру платформи на принципах сторітелінгу з використанням фірмового бордового кольору для підкреслення статусу, надійності та академічності.",
      "en": "Built the platform's structure on storytelling principles, using the signature burgundy color to emphasize status, reliability, and academicism."
    },
    "businessImpact": {
      "ua": "Запропоновано концептуальне бачення платформи, що демонструє, як грамотний UX та сторітелінг здатні потенційно підвищити рівень довіри та залучення меценатів.",
      "en": "A conceptual vision of the platform is proposed, demonstrating how well-executed UX and storytelling can potentially increase the level of trust and engagement of patrons."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Exo 2",
        "Bitter"
      ],
      "fontsDescription": {
        "ua": "Bitter створює атмосферу академічної довіри у текстах, а Exo 2 забезпечує чистий, сучасний та зручний UI платформи.",
        "en": "Bitter creates an atmosphere of academic trust in the text, while Exo 2 ensures a clean, modern, and user-friendly UI for the platform."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#5E2128"
        },
        {
          "name": "Color 2",
          "hex": "#1E1E1E"
        }
      ],
      "colorsDescription": {
        "ua": "Фірмовий бордовий колір виступає символом інституційної надійності, багаторічних традицій та високого академічного статусу університету.",
        "en": "The signature burgundy color serves as a symbol of institutional reliability, long-standing traditions, and the high academic status of the university."
      }
    },
    "thumbnailUrl": "/projects/fundraising-lp.webp",
    "galleryUrls": [
      "/projects/fundraising-lp.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/eJCs1VuROXVmG0vAWh86kQ/Fundraising-Landing-page-for-NULP?node-id=1-4&t=vS6kEHXpcUYyOZEJ-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/eJCs1VuROXVmG0vAWh86kQ/Fundraising-Landing-page-for-NULP?node-id=1-4&embed-host=share",
    "isFeatured": true,
    "sortOrder": 4
  },
  {
    "id": "5",
    "slug": "5",
    "title": {
      "ua": "Сайт Bee Protect",
      "en": "Bee Protect Site"
    },
    "title_ua": "Сайт Bee Protect",
    "title_en": "Bee Protect Site",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Web Design",
      "en": "UI/UX / Web Design"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2019",
    "tagline": {
      "ua": "Концепт яскравого лендингу для екологічної ініціативи із захисту бджіл.",
      "en": "Vibrant landing page concept for an ecological initiative protecting bees."
    },
    "description": {
      "ua": "Дизайн візуальної концепції будується на використанні яскраво-жовтого кольору та графічного патерну стільників. Виразна типографія та інтерактивні елементи створюють сміливий образ, що привертає увагу до екологічної проблеми.",
      "en": "The visual concept design is based on the use of bright yellow color and a graphic honeycomb pattern. Expressive typography and interactive elements create a bold image that draws attention to the environmental issue."
    },
    "problemStatement": {
      "ua": "Створити емоційно заряджений та яскравий вебдизайн, який миттєво привертатиме увагу до екологічної проблеми та мотивуватиме користувачів до дій.",
      "en": "Create an emotionally charged and vibrant web design that instantly draws attention to an environmental issue and motivates users to take action."
    },
    "solution": {
      "ua": "Застосовано контрастну палітру з домінуванням яскраво-жовтого кольору та графічного патерну стільників для створення емоційно виразного та сміливого образу.",
      "en": "Applied a contrasting palette dominated by bright yellow and a graphic honeycomb pattern to create an emotionally expressive and bold image."
    },
    "businessImpact": {
      "ua": "Концепт презентує навички роботи з емоційним дизайном, пропонуючи дієвий візуальний інструмент для привернення уваги до соціальних та екологічних ініціатив.",
      "en": "The concept presents skills in working with emotional design, offering an effective visual tool for drawing attention to social and environmental initiatives."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Rubik"
      ],
      "fontsDescription": {
        "ua": "Злегка заокруглені форми шрифту створюють дружній, природний та емоційно теплий образ для екоініціативи.",
        "en": "The slightly rounded forms create a friendly, organic, and emotionally warm image for the eco-initiative."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#FFF500"
        },
        {
          "name": "Color 2",
          "hex": "#282828"
        }
      ],
      "colorsDescription": {
        "ua": "Жовто-чорна гама прямо символізує бджолине забарвлення, водночас транслюючи відчуття тривоги за екологію та заклик до активних дій.",
        "en": "The yellow-black color scheme directly symbolizes bee coloration while simultaneously conveying a sense of environmental anxiety and a call to action."
      }
    },
    "thumbnailUrl": "/projects/bee-protect-lp.webp",
    "galleryUrls": [
      "/projects/bee-protect-lp.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/uoBMyBi7RddWb0gFGJbkU2/Fundraising-Landing-page-for-BeeProtect?node-id=1-18&t=rlI5lQDWgutAiGD8-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/uoBMyBi7RddWb0gFGJbkU2/Fundraising-Landing-page-for-BeeProtect?node-id=1-18&embed-host=share",
    "isFeatured": true,
    "sortOrder": 5
  },
  {
    "id": "6",
    "slug": "6",
    "title": {
      "ua": "Сайт Inspace",
      "en": "Inspace Site"
    },
    "title_ua": "Сайт Inspace",
    "title_en": "Inspace Site",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Web Design",
      "en": "UI/UX / Web Design"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2019",
    "tagline": {
      "ua": "Інтерактивний сайт космічної тематики для освітнього проєкту.",
      "en": "Interactive space-themed site for an educational project."
    },
    "description": {
      "ua": "Концепт вебсайту для освітнього космічного проєкту. Головний фокус зосереджено на логічній структуризації науково-популярного контенту. Інтерфейс забезпечує інтуїтивну навігацію розділами та використовує темну тематичну палітру для створення сучасного й зручного користувацького досвіду без зайвого візуального перевантаження.",
      "en": "A website concept for an educational space project. The main focus is on the logical structuring of popular science content. The interface provides intuitive navigation through sections and uses a dark thematic palette to create a modern and clear user experience without visual clutter."
    },
    "problemStatement": {
      "ua": "Розробити зрозумілу архітектуру освітнього вебресурсу космічної тематики, збалансувавши великі обсяги тексту з візуальними матеріалами для зручної навігації.",
      "en": "Develop a clear architecture for a space-themed educational web resource, balancing large volumes of text with visual materials for convenient navigation."
    },
    "solution": {
      "ua": "Спроєктовано модульну структуру з темною тематичною палітрою та контрастною типографікою, що розбиває масиви інформації на зручні для сканування блоки.",
      "en": "Designed a modular structure with a dark thematic palette and contrasting typography, breaking down arrays of information into easy-to-scan blocks."
    },
    "businessImpact": {
      "ua": "Концепт демонструє вміння працювати з інформаційною архітектурою, перетворюючи складний науковий контент на доступний та зручний для користувача освітній продукт.",
      "en": "The concept demonstrates the ability to work with information architecture, transforming complex scientific content into an accessible and user-friendly educational product."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Montserrat"
      ],
      "fontsDescription": {
        "ua": "Забезпечує відмінну читабельність масивів наукових текстів на темному фоні завдяки ідеальній геометрії.",
        "en": "Ensures excellent readability of scientific text blocks on a dark background due to its perfect geometry."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#332966"
        },
        {
          "name": "Color 2",
          "hex": "#332966"
        }
      ],
      "colorsDescription": {
        "ua": "Темна синьо-фіолетова палітра символізує безмежність космічного простору, створюючи ефект глибокого занурення у Всесвіт.",
        "en": "The dark blue-purple palette symbolizes the boundlessness of outer space, creating the effect of deep immersion into the Universe."
      }
    },
    "thumbnailUrl": "/projects/inspace-lp-d.webp",
    "mobileThumbnailUrl": "/projects/inspace-lp-m.webp",
    "mobilePreviewUrl": "/projects/inspace-lp-m.webp",
    "galleryUrls": [
      "/projects/inspace-lp-d.webp"
    ],
    "mobileGalleryUrls": [
      "/projects/inspace-lp-m.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/Oyi7RfDZP6HuhJArb3TRBe/InSpace?node-id=2-515&t=0ZNRPkBB6txdEtv7-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/Oyi7RfDZP6HuhJArb3TRBe/InSpace?node-id=2-515&embed-host=share",
    "isFeatured": false,
    "sortOrder": 6
  },
  {
    "id": "7",
    "slug": "7",
    "title": {
      "ua": "Редизайн британського паспорта",
      "en": "British Passport Redesign"
    },
    "title_ua": "Редизайн британського паспорта",
    "title_en": "British Passport Redesign",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "book-design",
    "categoryLabel": {
      "ua": "Editorial / Print Design",
      "en": "Editorial / Print Design"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2017",
    "tagline": {
      "ua": "Концепт редизайну паспорта Великої Британії з акцентом на культурну спадщину.",
      "en": "British Passport redesign concept focusing on cultural heritage."
    },
    "description": {
      "ua": "Концептуальний редизайн британського паспорта. Внутрішні сторінки містять захисні патерни (гільйош) та напівпрозорі ілюстрації ключових символів країни: від історичних постатей до ікон попкультури. Дизайн використовує пастельну гаму прапора Union Jack, адаптовану для безпечного друку.",
      "en": "A conceptual redesign of the British passport. The inner pages feature security patterns (guilloche) and translucent illustrations of the country's key symbols: from historical figures to pop culture icons. The design uses a pastel color palette based on the Union Jack flag, adapted for security printing."
    },
    "problemStatement": {
      "ua": "Переосмислити дизайн офіційного документа, зробивши його сучасним, глибоко символічним та захищеним від підробок за допомогою складних графічних патернів.",
      "en": "Rethink the design of an official document, making it modern, deeply symbolic, and protected from forgery using complex graphic patterns."
    },
    "solution": {
      "ua": "Розроблено складні захисні гільйош-патерни та напівпрозорі ілюстрації національних символів у пастельній гамі Union Jack, адаптованій для безпекового друку.",
      "en": "Developed complex security guilloche patterns and translucent illustrations of national symbols in the pastel palette of the Union Jack, adapted for security printing."
    },
    "businessImpact": {
      "ua": "Проєкт ілюструє здатність поєднувати суворі технічні вимоги до безпекової поліграфії із сучасною естетикою державного брендингу.",
      "en": "The project illustrates the ability to combine strict technical requirements for security printing with the modern aesthetics of state branding."
    },
    "toolsUsed": [
      "Adobe Illustrator",
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Gill Sans MT"
      ],
      "fontsDescription": {
        "ua": "Класичний британський шрифт, що глибоко підкреслює національну спадщину та офіційність документа.",
        "en": "A classic British typeface that deeply emphasizes national heritage and the official nature of the document."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#004791"
        }
      ],
      "colorsDescription": {
        "ua": "Пастельний синій уособлює британську національну ідентичність, будучи концептуальним переосмисленням кольору з прапора Union Jack.",
        "en": "The pastel blue embodies British national identity, being a conceptual reimagining of the color from the Union Jack flag."
      }
    },
    "thumbnailUrl": "/projects/uk-passport-redesign.webp",
    "galleryUrls": [
    "/projects/uk-passport-01.webp",
    "/projects/uk-passport-02.webp",
    "/projects/uk-passport-03.webp",
    "/projects/uk-passport-04.webp",
    "/projects/uk-passport-05.webp"
],
    "isFeatured": true,
    "sortOrder": 7
  },
  {
    "id": "8",
    "slug": "8",
    "title": {
      "ua": "Рекламні банери Petsbro",
      "en": "Petsbro Ad Banners"
    },
    "title_ua": "Рекламні банери Petsbro",
    "title_en": "Petsbro Ad Banners",
    "client": {
      "ua": "Petsbro",
      "en": "Petsbro"
    },
    "client_ua": "Petsbro",
    "client_en": "Petsbro",
    "category": "advertising",
    "categoryLabel": {
      "ua": "Advertising / Social Media",
      "en": "Advertising / Social Media"
    },
    "status": "реалізовані-продакшн",
    "statusLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "statusBadgeLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2024",
    "tagline": {
      "ua": "Серія рекламних креативів для соціальних мереж бренду Petsbro.",
      "en": "Social media advertising creatives for the Petsbro pet brand."
    },
    "description": {
      "ua": "Серія рекламних креативів для соцмереж болгарського зообренду Petsbro. Банери демонструють різні моделі кігтеточок. Візуальний акцент зроблено на чіткій презентації продукту, його ціни та габаритів за допомогою контрастного бірюзового фону та динамічної композиції.",
      "en": "A series of social media advertising creatives for the Bulgarian pet brand Petsbro. The banners showcase different models of scratching posts. The visual focus is on the clear presentation of the product, its price, and dimensions using a contrasting turquoise background and dynamic composition."
    },
    "problemStatement": {
      "ua": "Створити серію рекламних банерів з високим CTR, які чітко комунікують переваги товару (ціна, габарити) та виділяються у стрічці соцмереж.",
      "en": "Create a series of high-CTR advertising banners that clearly communicate the product's benefits (price, dimensions) and stand out in the social media feed."
    },
    "solution": {
      "ua": "Використано контрастний бірюзовий фон та динамічну композицію для миттєвого зчитування зовнішнього вигляду продукту, його габаритів та акційної ціни.",
      "en": "Used a contrasting turquoise background and dynamic composition for instant reading of the product's appearance, dimensions, and promotional price."
    },
    "businessImpact": {
      "ua": "Чітка та контрастна візуальна подача продукту допомогла замовнику виділитися у стрічці, що позитивно вплинуло на результативність рекламних кампаній зоомагазину в соцмережах.",
      "en": "A clear and contrasting visual presentation of the product helped the client stand out in the feed, which positively impacted the performance of the pet store's social media advertising campaigns."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Days One",
        "Roboto"
      ],
      "fontsDescription": {
        "ua": "Days One привертає увагу до масивних акцентних заголовків, а Roboto забезпечує зручне зчитування деталей.",
        "en": "Days One draws attention to massive headline accents, while Roboto ensures easy reading of details."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#29B5B2"
        }
      ],
      "colorsDescription": {
        "ua": "Насичений бірюзовий колір символізує життєрадісність та турботу про домашніх улюбленців, формуючи позитивний емоційний зв'язок із брендом.",
        "en": "The rich turquoise color symbolizes cheerfulness and care for pets, forming a positive emotional connection with the brand."
      }
    },
    "thumbnailUrl": "/projects/facebook-post-6.webp",
    "galleryUrls": [
    "/projects/petsbro-ads-01.webp",
    "/projects/petsbro-ads-02.webp",
    "/projects/petsbro-ads-03.webp"
],
    "isFeatured": false,
    "sortOrder": 8
  },
  {
    "id": "9",
    "slug": "9",
    "title": {
      "ua": "3D-модель «Тисячолітнього сокола»",
      "en": "Millennium Falcon 3D Model"
    },
    "title_ua": "3D-модель «Тисячолітнього сокола»",
    "title_en": "Millennium Falcon 3D Model",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "3d-render",
    "categoryLabel": {
      "ua": "3D Modeling",
      "en": "3D Modeling"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "3D-моделер",
      "en": "3D Modeler"
    },
    "timeline": "2018",
    "tagline": {
      "ua": "Деталізована високополігональна 3D-модель легендарного корабля Millennium Falcon.",
      "en": "Detailed high-poly 3D model of the legendary Millennium Falcon spaceship."
    },
    "description": {
      "ua": "Створення високополігональної 3D-моделі легендарного корабля Millennium Falcon із всесвіту Star Wars. Робота велася на основі детальних візуальних референсів, концепт-артів та креслень. Особливу увагу приділено текстурам, опрацюванню дрібних деталей корпусу та відтворенню автентичної атмосфери кінофраншизи.",
      "en": "Creation of a high-poly 3D model of the legendary Millennium Falcon spaceship from the Star Wars universe. The work was based on detailed visual references, concept art, and blueprints. Special attention was paid to textures, detailing of the hull, and recreating the authentic atmosphere of the film franchise."
    },
    "problemStatement": {
      "ua": "Відтворити надзвичайно складну геометрію та деталізацію (greebles) легендарного кінокорабля, зберігаючи точність пропорцій за візуальними референсами.",
      "en": "Recreate the highly complex geometry and detailing (greebles) of the legendary cinematic spaceship, maintaining accurate proportions based on visual references."
    },
    "solution": {
      "ua": "Виконано скрупульозне моделювання корпусу з високою деталізацією технічних елементів на основі автентичних кінематографічних референсів.",
      "en": "Performed meticulous modeling of the hull with high detailing of technical elements based on authentic cinematic references."
    },
    "businessImpact": {
      "ua": "Робота підтверджує навички точного відтворення надскладної геометрії за референсами та високу увагу до найдрібніших деталей у 3D-середовищі.",
      "en": "The work confirms the skills of accurately recreating highly complex geometry from references and high attention to the smallest details in a 3D environment."
    },
    "toolsUsed": [
      "Autodesk 3ds Max"
    ],
    "designSystem": {
      "fonts": [
        "—"
      ],
      "colors": []
    },
    "thumbnailUrl": "/projects/mfalcon-3d.webp",
    "galleryUrls": [
    "/projects/mfalcon-3d-01.webp",
    "/projects/mfalcon-3d-02.webp",
    "/projects/mfalcon-3d-03.webp",
    "/projects/mfalcon-3d-04.webp",
    "/projects/mfalcon-3d-05.webp",
    "/projects/mfalcon-3d-06.webp",
    "/projects/mfalcon-3d-07.webp",
    "/projects/mfalcon-3d-08.webp",
    "/projects/mfalcon-3d-09.webp",
    "/projects/mfalcon-3d-10.webp"
],
    "isFeatured": true,
    "sortOrder": 9
  },
  {
    "id": "10",
    "slug": "10",
    "title": {
      "ua": "Вебзастосунок Cosmopedia",
      "en": "Cosmopedia Web App"
    },
    "title_ua": "Вебзастосунок Cosmopedia",
    "title_en": "Cosmopedia Web App",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / EdTech",
      "en": "UI/UX Product"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2020",
    "tagline": {
      "ua": "Інтерактивний освітній вебзастосунок для дослідження масштабів Всесвіту.",
      "en": "Interactive educational web application for exploring the scale of the universe."
    },
    "description": {
      "ua": "Концепт інтерактивної освітньої енциклопедії, яка візуалізує розміри об'єктів Всесвіту від квантового до мегамасштабу. Інтерфейс дозволяє користувачеві зручно скролити та наочно порівнювати габарити всього існуючого: від планківської довжини та кварків до розмірів галактик і надскупчень.",
      "en": "An interactive educational encyclopedia concept that visualizes the sizes of objects in the Universe from the quantum to the mega-scale. The interface allows users to easily scroll and visually compare the dimensions of everything in existence: from the Planck length and quarks to the sizes of galaxies and superclusters."
    },
    "problemStatement": {
      "ua": "Розробити зрозумілу навігацію та візуальну мову для безшовного відображення колосального діапазону масштабів (від квантів до галактик) в єдиному інтерфейсі.",
      "en": "Develop clear navigation and visual language for the seamless display of a colossal range of scales (from quanta to galaxies) in a single interface."
    },
    "solution": {
      "ua": "Створено інтерактивний інтерфейс зі зручним скролінгом, який забезпечує плавний перехід та наочне порівняння об'єктів від квантового світу до макрокосмосу.",
      "en": "Created an interactive interface with convenient scrolling, ensuring smooth transitions and visual comparisons of objects from the quantum world to the macrocosm."
    },
    "businessImpact": {
      "ua": "Концепт презентує інноваційний підхід до UX-архітектури, показуючи, як колосальні масиви наукових даних можуть бути легко сприйняті через грамотну інтерактивну візуалізацію.",
      "en": "The concept presents an innovative approach to UX architecture, showing how colossal arrays of scientific data can be easily perceived through competent interactive visualization."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Ubuntu"
      ],
      "fontsDescription": {
        "ua": "Технологічний, але водночас м'який шрифт, який робить складні наукові дані візуально привітнішими.",
        "en": "A technological yet soft typeface that makes complex scientific data visually approachable."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#10ADB7"
        },
        {
          "name": "Color 2",
          "hex": "#3F00FF"
        },
        {
          "name": "Color 3",
          "hex": "#FFFF00"
        }
      ],
      "colorsDescription": {
        "ua": "Неонові акценти на темному тлі символізують технологічність, світло зірок та передовий науковий підхід до дослідження мікро- та макросвітів.",
        "en": "Neon accents on a dark background symbolize technological advancement, starlight, and a cutting-edge scientific approach to exploring the micro- and macrocosm."
      }
    },
    "thumbnailUrl": "/projects/cosmopedia-app.webp",
    "galleryUrls": [
    "/projects/cosmopedia-app-01.webp",
    "/projects/cosmopedia-app-02.webp",
    "/projects/cosmopedia-app-03.webp",
    "/projects/cosmopedia-app-04.webp",
    "/projects/cosmopedia-app-05.webp",
    "/projects/cosmopedia-app-06.webp",
    "/projects/cosmopedia-app-07.webp"
],
    "isFeatured": true,
    "sortOrder": 10
  },
  {
    "id": "11",
    "slug": "11",
    "title": {
      "ua": "Цифровий архів «Родоводи шляхти»",
      "en": "Nobility Genealogy Digital Archive"
    },
    "title_ua": "Цифровий архів «Родоводи шляхти»",
    "title_en": "Nobility Genealogy Digital Archive",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Web Design",
      "en": "UI/UX / Web Design"
    },
    "status": "реалізовані-продакшн",
    "statusLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "statusBadgeLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2026",
    "tagline": {
      "ua": "Вебплатформа для збереження та дослідження генеалогії шляхетних родів.",
      "en": "Web platform for preserving and researching the genealogy of noble families."
    },
    "description": {
      "ua": "Розробка UI/UX дизайну для цифрового архіву поколінних розписів. Інтерфейс сфокусовано на чистій типографіці та грамотній структурі текстових блоків, що забезпечує зручне читання та зрозумілу навігацію родинними деревами.",
      "en": "UI/UX design development for a digital archive of genealogical records. The interface focuses on clean typography and well-structured text blocks, ensuring convenient reading and clear navigation through family trees."
    },
    "problemStatement": {
      "ua": "Спроєктувати зручний текстовий інтерфейс для багаторівневої генеалогічної інформації, забезпечивши легке зчитування поколінних розписів без візуального перевантаження.",
      "en": "Design a user-friendly text interface for multi-level genealogical information, ensuring easy reading of generational charts without visual clutter."
    },
    "solution": {
      "ua": "Розроблено мінімалістичний дизайн із чіткою типографічною ієрархією та системою відступів, що візуально структурує складні текстові списки та робить їх зручними для сканування.",
      "en": "Developed a minimalist design with a clear typographic hierarchy and spacing system, visually structuring complex text lists and making them easy to scan."
    },
    "businessImpact": {
      "ua": "Спроєктовано чистий текстовий інтерфейс, який завдяки продуманій типографіці та системі відступів структурує багаторівневі дані, роблячи поколінні розписи зручними для читання та сканування.",
      "en": "A clean text interface was designed, which, thanks to thoughtful typography and a spacing system, structures multi-level data, making generational charts easy to read and scan."
    },
    "toolsUsed": [
      "Google AI Studio"
    ],
    "designSystem": {
      "fonts": [
        "Playfair Display",
        "Inter"
      ],
      "fontsDescription": {
        "ua": "Playfair Display транслює історичну елегантність у заголовках, а Inter ідеально структурує масиви даних.",
        "en": "Playfair Display conveys historical elegance in headings, while Inter perfectly structures large datasets."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#8B0000"
        },
        {
          "name": "Color 2",
          "hex": "#C5A059"
        },
        {
          "name": "Color 3",
          "hex": "#2B2B2B"
        }
      ],
      "colorsDescription": {
        "ua": "Поєднання глибокого бордового, золотого та графітового символізує шляхетність, аристократизм та повагу до історичної спадщини.",
        "en": "The combination of deep burgundy, gold, and graphite symbolizes nobility, aristocracy, and respect for historical heritage."
      }
    },
    "thumbnailUrl": "/projects/rodovody-archive.webp",
    "galleryUrls": [
    "/projects/rodovody-archive-01.webp",
    "/projects/rodovody-archive-02.webp",
    "/projects/rodovody-archive-03.webp"
],
    "liveLink": "https://rodowod.vercel.app/?lang=ua",
    "isFeatured": false,
    "sortOrder": 11
  },
  {
    "id": "12",
    "slug": "12",
    "title": {
      "ua": "Айдентика конференції з дизайну",
      "en": "Design Conference Identity"
    },
    "title_ua": "Айдентика конференції з дизайну",
    "title_en": "Design Conference Identity",
    "client": {
      "ua": "Національний університет «Львівська політехніка»",
      "en": "Lviv Polytechnic National University"
    },
    "client_ua": "Національний університет «Львівська політехніка»",
    "client_en": "Lviv Polytechnic National University",
    "category": "branding",
    "categoryLabel": {
      "ua": "Event Identity / Print",
      "en": "Identity & Posters"
    },
    "status": "реалізовані-продакшн",
    "statusLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "statusBadgeLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "role": {
      "ua": "Графічний дизайнер",
      "en": "Graphic Designer"
    },
    "timeline": "2022",
    "tagline": {
      "ua": "Айдентика всеукраїнської науково-практичної конференції.",
      "en": "Visual identity for an all-Ukrainian scientific and practical conference."
    },
    "description": {
      "ua": "Комплексна візуальна ідентифікація для всеукраїнської науково-практичної конференції «Теорія та практика дизайну: Нові виклики в умовах війни» в Національному університеті «Львівська політехніка». Розроблена айдентика включає логотип та поліграфічні матеріали, які відображають сучасні виклики дизайну в умовах війни, зберігаючи строгу академічну естетику заходу.",
      "en": "Comprehensive visual identity for the all-Ukrainian scientific and practical conference \"Theory and Practice of Design: New Challenges in Wartime\" at Lviv Polytechnic National University. The developed identity includes a logo and printed materials reflecting modern design challenges in wartime while maintaining the strict academic aesthetics of the event."
    },
    "problemStatement": {
      "ua": "Створити візуальну ідентичність, яка б органічно поєднувала академічну строгість наукового заходу із відображенням сучасних воєнних реалій.",
      "en": "Create a visual identity that organically combines the academic strictness of a scientific event with the reflection of modern wartime realities."
    },
    "solution": {
      "ua": "Розроблено комплексну візуальну систему, яка поєднує строгу академічну подачу з актуальними візуальними метафорами викликів воєнного часу.",
      "en": "Developed a comprehensive visual system combining a strict academic presentation with relevant visual metaphors of wartime challenges."
    },
    "businessImpact": {
      "ua": "Забезпечено професійне візуальне супроводження реальної події, що підкреслило її академічний статус та допомогло ефективно комунікувати із великою кількістю учасників.",
      "en": "Professional visual support for a real event was provided, which emphasized its academic status and helped effectively communicate with a large number of participants."
    },
    "toolsUsed": [
      "Adobe Illustrator"
    ],
    "designSystem": {
      "fonts": [
        "Inter",
        "Bahnshift"
      ],
      "fontsDescription": {
        "ua": "Bahnschrift задає строгий індустріальний тон воєнних викликів, який гармонійно врівноважується нейтральним Inter.",
        "en": "Bahnschrift sets a strict industrial tone for wartime challenges, harmoniously balanced by the neutral Inter."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#49453A"
        }
      ],
      "colorsDescription": {
        "ua": "Приглушений хакі символізує суворі реалії воєнного часу, відображаючи стійкість українського суспільства та актуальний контекст для дизайну.",
        "en": "The muted khaki symbolizes the harsh realities of wartime, reflecting the resilience of Ukrainian society and the current context for design."
      }
    },
    "thumbnailUrl": "/projects/conference-identity.webp",
    "galleryUrls": [
      "/projects/conference-identity.webp"
    ],
    "isFeatured": false,
    "sortOrder": 12
  },
  {
    "id": "13",
    "slug": "13",
    "title": {
      "ua": "Мобільний застосунок Kavomolka",
      "en": "Kavomolka Mobile App"
    },
    "title_ua": "Мобільний застосунок Kavomolka",
    "title_en": "Kavomolka Mobile App",
    "client": {
      "ua": "Кавомолка",
      "en": "Kavomolka"
    },
    "client_ua": "Кавомолка",
    "client_en": "Kavomolka",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Mobile App",
      "en": "UI/UX Product"
    },
    "status": "реалізовані-продакшн",
    "statusLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "statusBadgeLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2024",
    "tagline": {
      "ua": "Деталізований користувацький флоу мобільного застосунку для кав'ярні з програмою лояльності.",
      "en": "Detailed user flow for a coffee shop mobile app with a loyalty program."
    },
    "description": {
      "ua": "Проєктування повноцінного UX/UI для мобільного застосунку мережі кав'ярень. Робота охоплює створення деталізованих схем переходів (user flow), екранів реєстрації, меню замовлень та інтеграцію програми лояльності. Інтерфейс сфокусований на швидкому та інтуїтивному процесі купівлі кави чи випічки зі смартфона.",
      "en": "Designing a complete UX/UI for a coffee shop chain's mobile application. The work covers the creation of detailed transition schemes (user flow), registration screens, order menus, and loyalty program integration. The interface is focused on a fast and intuitive process of purchasing coffee or pastries from a smartphone."
    },
    "problemStatement": {
      "ua": "Продумати безшовний користувацький досвід та логіку взаємодії, щоб максимально спростити та пришвидшити процес замовлення кави зі смартфона.",
      "en": "Design a seamless user experience and interaction logic to maximally simplify and speed up the coffee ordering process from a smartphone."
    },
    "solution": {
      "ua": "Створено деталізовані схеми переходів та інтуїтивні інтерфейси відповідних екранів для максимально швидкого оформлення замовлення та використання бонусів.",
      "en": "Created detailed transition flows and intuitive interfaces for the respective screens to maximize the speed of placing an order and using bonuses."
    },
    "businessImpact": {
      "ua": "Деталізований UX-флоу дозволив розробникам швидко імплементувати дизайн, а бізнесу — отримати діючий мобільний інструмент для підвищення лояльності та продажів.",
      "en": "The detailed UX flow allowed developers to quickly implement the design, and the business to receive a working mobile tool for increasing loyalty and sales."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Lato"
      ],
      "fontsDescription": {
        "ua": "Чистий та теплий гротеск, що допомагає перенести дружню та затишну атмосферу кав'ярні у цифровий формат.",
        "en": "A clean and warm sans-serif that helps translate the friendly and cozy coffee shop atmosphere into a digital format."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#187453"
        },
        {
          "name": "Color 2",
          "hex": "#3A3A3A"
        }
      ],
      "colorsDescription": {
        "ua": "Глибокий зелений колір символізує натуральність кавових зерен та екологічність, передаючи атмосферу спокою і затишку кав'ярні.",
        "en": "The deep green color symbolizes the naturalness of coffee beans and eco-friendliness, conveying the calm and cozy atmosphere of a coffee shop."
      }
    },
    "thumbnailUrl": "/projects/kavomolka-app.webp",
    "mobileThumbnailUrl": "/projects/kavomolka-app.webp",
    "mobilePreviewUrl": "/projects/kavomolka-app.webp",
    "galleryUrls": [
      "/projects/kavomolka-app.webp"
    ],
    "mobileGalleryUrls": [
      "/projects/kavomolka-app.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/crKf8UWo40COKK2aT6ggBX/KAVOMOLKA?node-id=1-56283&t=wgGCFjO5QnCGh7m5-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/crKf8UWo40COKK2aT6ggBX/KAVOMOLKA?node-id=1-56283&embed-host=share",
    "isFeatured": false,
    "sortOrder": 13
  },
  {
    "id": "14",
    "slug": "14",
    "title": {
      "ua": "Лендинг лікаря-стоматолога",
      "en": "Dentist Landing Page"
    },
    "title_ua": "Лендинг лікаря-стоматолога",
    "title_en": "Dentist Landing Page",
    "client": {
      "ua": "Лікар Уляна Чернієнко",
      "en": "Dr. Uliana Cherniienko"
    },
    "client_ua": "Лікар Уляна Чернієнко",
    "client_en": "Dr. Uliana Cherniienko",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / Web Design",
      "en": "UI/UX / Web Design"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2024",
    "tagline": {
      "ua": "Дизайн лендингу для просування послуг професійної гігієни зубів.",
      "en": "Landing page design promoting professional dental hygiene services."
    },
    "description": {
      "ua": "Розробка дизайну лендингу для лікаря-пародонтолога. Сторінка спроєктована з акцентом на довіру та професіоналізм, включаючи блоки з презентацією послуг, відгуками та формою запису. Чистий медичний UI з легкими акцентними кольорами допомагає пацієнтам швидко знаходити потрібну інформацію.",
      "en": "Landing page design development for a periodontist. The page is designed with an emphasis on trust and professionalism, including service presentation blocks, reviews, and an appointment booking form. The clean medical UI with light accent colors helps patients quickly find the necessary information."
    },
    "problemStatement": {
      "ua": "Створити привітний та зрозумілий медичний інтерфейс, який зніматиме тривожність пацієнтів, формуватиме довіру до лікаря та стимулюватиме до запису на прийом.",
      "en": "Create a welcoming and clear medical interface that reduces patient anxiety, builds trust in the doctor, and encourages appointment bookings."
    },
    "solution": {
      "ua": "Використано чистий світлий UI з медичними блакитними відтінками, структуровано блоки послуг та додано соціальні докази з простою формою для швидкого запису.",
      "en": "Used a clean, light UI with medical blue hues, structuring service blocks and adding social proof along with a simple form for quick appointment booking."
    },
    "businessImpact": {
      "ua": "Створено продуманий прототип інструменту лідогенерації, який демонструє розуміння медичної ніші та способів підвищення довіри пацієнтів через чистий UI.",
      "en": "A well-thought-out prototype of a lead generation tool was created, demonstrating an understanding of the medical niche and ways to increase patient trust through a clean UI."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Montserrat"
      ],
      "fontsDescription": {
        "ua": "Створює відчуття чистоти, стерильності та професіоналізму, що є критично необхідним для медичного UI.",
        "en": "Creates a sense of cleanliness, sterility, and professionalism, which is critical for a medical UI."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#02404F"
        },
        {
          "name": "Color 2",
          "hex": "#FFC700"
        },
        {
          "name": "Color 3",
          "hex": "#3E6C8F"
        }
      ],
      "colorsDescription": {
        "ua": "Синьо-блакитна палітра символізує стерильність, медичну безпеку та спокій, допомагаючи зняти тривожність пацієнтів перед прийомом.",
        "en": "The blue and cyan palette symbolizes sterility, medical safety, and calmness, helping to relieve patient anxiety before an appointment."
      }
    },
    "thumbnailUrl": "/projects/dentist-landing-page-d.webp",
    "mobileThumbnailUrl": "/projects/dentist-landing-page-m.webp",
    "mobilePreviewUrl": "/projects/dentist-landing-page-m.webp",
    "galleryUrls": [
      "/projects/dentist-landing-page-d.webp"
    ],
    "mobileGalleryUrls": [
      "/projects/dentist-landing-page-m.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/LtO0hLZxnX9MgKLwyveMJm/%D0%9F%D1%80%D0%BE%D1%84%D0%B5%D1%81%D1%96%D0%B9%D0%BD%D0%B0-%D0%93%D1%96%D0%B3%D1%96%D1%94%D0%BD%D0%B0?node-id=1-118&t=gbofnTWIJx30Sreg-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/LtO0hLZxnX9MgKLwyveMJm/%D0%9F%D1%80%D0%BE%D1%84%D0%B5%D1%81%D1%96%D0%B9%D0%BD%D0%B0-%D0%93%D1%96%D0%B3%D1%96%D1%94%D0%BD%D0%B0?node-id=1-118&embed-host=share",
    "isFeatured": false,
    "sortOrder": 14
  },
  {
    "id": "15",
    "slug": "15",
    "title": {
      "ua": "LUNA e-commerce",
      "en": "LUNA E-commerce"
    },
    "title_ua": "LUNA e-commerce",
    "title_en": "LUNA E-commerce",
    "client": {
      "ua": "—",
      "en": "N/A"
    },
    "client_ua": "—",
    "client_en": "N/A",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / E-commerce",
      "en": "UI/UX Product"
    },
    "status": "концепт",
    "statusLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "statusBadgeLabel": {
      "ua": "Концепт",
      "en": "Concept"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2020",
    "tagline": {
      "ua": "Дизайн мобільної версії інтернет-магазину домашнього текстилю.",
      "en": "Mobile UX/UI design for a home textile e-commerce store."
    },
    "description": {
      "ua": "Створення мобільного UI/UX дизайну для інтернет-магазину домашнього текстилю LUNA. Опрацьовано ключові сторінки для забезпечення належного рівня користувацького досвіду: від зручної головної сторінки з каталогом до кошика та процесу чекауту. Мінімалістичний інтерфейс підкреслює естетику товарів та забезпечує безшовний досвід мобільних покупок.",
      "en": "Creation of a mobile UI/UX design for the LUNA home textile online store. Key pages were developed to ensure a high level of user experience: from a convenient homepage with a catalog to the shopping cart and checkout process. The minimalist interface emphasizes the aesthetics of the products and provides a seamless mobile shopping experience."
    },
    "problemStatement": {
      "ua": "Оптимізувати e-commerce інтерфейс для мобільних пристроїв, створивши зручну навігацію каталогом та максимально простий процес оформлення замовлення.",
      "en": "Optimize the e-commerce interface for mobile devices by creating convenient catalog navigation and the simplest possible checkout process."
    },
    "solution": {
      "ua": "Спроєктовано мінімалістичний мобільний інтерфейс зі зручним бургер-меню, акцентом на естетиці товарів та оптимізованим односторінковим процесом чекауту.",
      "en": "Designed a minimalist mobile interface featuring a convenient hamburger menu, an emphasis on product aesthetics, and an optimized single-page checkout process."
    },
    "businessImpact": {
      "ua": "Візуальний концепт показує ефективне вирішення типових проблем мобільного e-commerce: оптимізацію навігації каталогом та зменшення бар'єрів при оформленні замовлення.",
      "en": "The visual concept shows an effective solution to typical mobile e-commerce problems: optimizing catalog navigation and reducing barriers during checkout."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Philosopher",
        "Montserrat"
      ],
      "fontsDescription": {
        "ua": "Philosopher додає естетичної витонченості домашньому текстилю, а Montserrat відповідає за зручний мобільний UI.",
        "en": "Philosopher adds aesthetic refinement for home textiles, while Montserrat ensures a convenient mobile UI."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#2E4E4D"
        },
        {
          "name": "Color 2",
          "hex": "#96C9DA"
        },
        {
          "name": "Color 3",
          "hex": "#F0F5FF"
        }
      ],
      "colorsDescription": {
        "ua": "М'які, приглушені пастельні тони символізують домашній затишок, ніжність текстильних матеріалів та спокійний відпочинок.",
        "en": "Soft, muted pastel tones symbolize home comfort, the tenderness of textile materials, and peaceful relaxation."
      }
    },
    "thumbnailUrl": "/projects/luna-m.webp",
    "mobileThumbnailUrl": "/projects/luna-m.webp",
    "mobilePreviewUrl": "/projects/luna-m.webp",
    "galleryUrls": [
      "/projects/luna-m.webp"
    ],
    "mobileGalleryUrls": [
      "/projects/luna-m.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/u72RbUgBD3zZv7ov8QXHpo/Ecommerce-LUNA--mobile-version-?node-id=0-43&t=4SoJ2oKxbofHnQ8S-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/u72RbUgBD3zZv7ov8QXHpo/Ecommerce-LUNA--mobile-version-?node-id=0-43&embed-host=share",
    "isFeatured": false,
    "sortOrder": 15
  },
  {
    "id": "16",
    "slug": "16",
    "title": {
      "ua": "B2B платформа Parad Obuvi",
      "en": "Parad Obuvi B2B Platform"
    },
    "title_ua": "B2B платформа Parad Obuvi",
    "title_en": "Parad Obuvi B2B Platform",
    "client": {
      "ua": "Парад Взуття",
      "en": "Parad Obuvi"
    },
    "client_ua": "Парад Взуття",
    "client_en": "Parad Obuvi",
    "category": "ui-ux",
    "categoryLabel": {
      "ua": "UI/UX / E-commerce (B2B)",
      "en": "UI/UX Product"
    },
    "status": "реалізовані-продакшн",
    "statusLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "statusBadgeLabel": {
      "ua": "Реалізовані (Продакшн)",
      "en": "Live (Production)"
    },
    "role": {
      "ua": "UI/UX-дизайнер",
      "en": "UI/UX Designer"
    },
    "timeline": "2023",
    "tagline": {
      "ua": "Дизайн гуртової B2B-платформи взуття зі складною системою замовлень.",
      "en": "B2B e-commerce design for a wholesale shoe brand featuring a complex ordering system."
    },
    "description": {
      "ua": "Комплексний UI/UX редизайн оптового B2B-майданчика Parad Obuvi. Опрацьовано розгалужену систему користувацьких сценаріїв: від складної фільтрації та сторінок категорій до багатокрокового кошика. Інтерфейси враховують специфіку гуртових закупівель, включаючи логіку замовлення півящиків, керування шаблонами замовлення та адаптивні мобільні версії.",
      "en": "A comprehensive UI/UX redesign of the wholesale B2B platform Parad Obuvi. An extensive system of user scenarios was developed: from complex filtering and category pages to a multi-step cart. The interfaces consider the specifics of wholesale purchases, including half-box ordering logic, order template management, and adaptive mobile versions."
    },
    "problemStatement": {
      "ua": "Спростити обробку складних B2B-даних (оптові партії, комплектація коробок) та розробити зрозумілі користувацькі сценарії для масових гуртових закупівель.",
      "en": "Simplify the processing of complex B2B data (wholesale batches, box configurations) and develop clear user scenarios for mass wholesale purchases."
    },
    "solution": {
      "ua": "Реалізовано гнучку систему карток товарів для опту, зручний кабінет користувача та адаптивну таблицю замовлень з чіткою індикацією статусів оплати й логістики.",
      "en": "Implemented a flexible wholesale product card system, a convenient user dashboard, and an adaptive order table with clear indication of payment and logistics statuses."
    },
    "businessImpact": {
      "ua": "Впроваджений редизайн суттєво знизив когнітивне навантаження на клієнтів, зменшив кількість помилок при замовленнях та оптимізував процеси обробки гуртових закупівель.",
      "en": "The implemented redesign significantly reduced the cognitive load on clients, decreased the number of order errors, and optimized wholesale purchase processing."
    },
    "toolsUsed": [
      "Figma"
    ],
    "designSystem": {
      "fonts": [
        "Montserrat"
      ],
      "fontsDescription": {
        "ua": "Універсальний шрифт із високою читабельністю, який ідеально впорядковує складні B2B-таблиці без зайвого візуального шуму.",
        "en": "A highly readable, versatile typeface that perfectly organizes complex B2B tables without visual noise."
      },
      "colors": [
        {
          "name": "Color 1",
          "hex": "#F0F5FF"
        },
        {
          "name": "Color 2",
          "hex": "#282828"
        }
      ],
      "colorsDescription": {
        "ua": "Світлий монохромний фон символізує прозорість бізнес-процесів, системність та порядок, необхідні для серйозної B2B-платформи.",
        "en": "The light monochrome background symbolizes the transparency of business processes, systematicity, and order necessary for a serious B2B platform."
      }
    },
    "thumbnailUrl": "/projects/parad-obuvi-d.webp",
    "galleryUrls": [
      "/projects/parad-obuvi-d.webp"
    ],
    "figmaUrl": "https://www.figma.com/design/8FRCLOq6KsmZH7T8CqYtKx/Parad-Vzuttia?node-id=1-91658&t=2EN4LZdr1ybSptWs-4",
    "figmaEmbedUrl": "https://embed.figma.com/design/8FRCLOq6KsmZH7T8CqYtKx/Parad-Vzuttia?node-id=1-91658&embed-host=share",
    "isFeatured": false,
    "sortOrder": 16
  }
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    type: 'education',
    company: {
      ua: 'Національний університет «Львівська політехніка»',
      en: 'Lviv Polytechnic National University'
    },
    location: {
      ua: 'Львів, Україна',
      en: 'Lviv, Ukraine'
    },
    role: {
      ua: 'Старший викладач',
      en: 'Senior Lecturer'
    },
    period: {
      ua: 'Сер 2026 — Зараз',
      en: 'Aug 2026 — Present'
    },
    description: {
      ua: [
        'Викладання в Інституті архітектури та дизайну, кафедра візуального дизайну та мистецтв.'
      ],
      en: [
        'Teaching at the Institute of Architecture and Design, Department of Visual Design and Art.'
      ]
    },
    technologies: ['Design Theory', 'Visual Arts', 'Architecture & Design', 'Academic Mentorship']
  },
  {
    id: 'exp-2',
    type: 'education',
    company: {
      ua: 'Національний університет «Львівська політехніка»',
      en: 'Lviv Polytechnic National University'
    },
    location: {
      ua: 'Львів, Україна',
      en: 'Lviv, Ukraine'
    },
    role: {
      ua: 'Асистент кафедри',
      en: 'Assistant Lecturer'
    },
    period: {
      ua: 'Жов 2022 — Сер 2026',
      en: 'Oct 2022 — Aug 2026'
    },
    description: {
      ua: [
        'Викладання в Інституті архітектури та дизайну, кафедра візуального дизайну та мистецтв.'
      ],
      en: [
        'Teaching at the Institute of Architecture and Design, Department of Visual Design and Art.'
      ]
    },
    technologies: ['Visual Design', 'Art Direction', 'Typography', 'Color Theory']
  },
  {
    id: 'exp-3',
    type: 'education',
    company: {
      ua: 'Національний університет «Львівська політехніка»',
      en: 'Lviv Polytechnic National University'
    },
    location: {
      ua: 'Львів, Україна',
      en: 'Lviv, Ukraine'
    },
    role: {
      ua: 'Аспірант',
      en: 'Postgraduate Student'
    },
    period: {
      ua: 'Вер 2021 — Сер 2025',
      en: 'Sep 2021 — Aug 2025'
    },
    description: {
      ua: [
        'Проведення науково-дослідницької роботи, розвиток дослідницьких навичок у сфері дизайну та архітектури.'
      ],
      en: [
        'Conducting academic research, developing research skills in the field of design and architecture.'
      ]
    },
    technologies: ['Academic Research', 'Design Systems', 'Architectural Design']
  },
  {
    id: 'exp-4',
    type: 'commercial',
    company: {
      ua: 'Фриланс',
      en: 'Freelance'
    },
    location: {
      ua: 'Віддалено',
      en: 'Remote'
    },
    role: {
      ua: 'UI/UX Дизайнер & Веброзробник',
      en: 'UI/UX Designer & Web Developer'
    },
    period: {
      ua: 'Гру 2019 — Зараз',
      en: 'Dec 2019 — Present'
    },
    description: {
      ua: [
        'Проєктування користувацького досвіду, дослідницька робота та створення інтерактивних прототипів у Figma.',
        'Розробка вебсайтів, лендингів та фронтенд-інтерфейсів з використанням HTML, JavaScript, CSS та розгортанням на Vercel.'
      ],
      en: [
        'Designing user experiences, research, and interactive prototyping using Figma and UI/UX methodologies.',
        'Developing websites, landing pages, and frontend interfaces using HTML, JavaScript, CSS, and deploying to Vercel.'
      ]
    },
    technologies: ['Figma', 'UI/UX', 'HTML/CSS', 'JavaScript', 'Vercel']
  },
  {
    id: 'exp-5',
    type: 'commercial',
    company: {
      ua: 'Фриланс',
      en: 'Freelance'
    },
    location: {
      ua: 'Віддалено',
      en: 'Remote'
    },
    role: {
      ua: 'Спеціаліст з реклами & таргетингу',
      en: 'Paid Ads Specialist / Targeting Specialist'
    },
    period: {
      ua: 'Чер 2020 — Зараз',
      en: 'Jun 2020 — Present'
    },
    description: {
      ua: [
        'Налаштування та оптимізація рекламних кампаній за допомогою Google Ads, аналітика даних через Google Analytics та GTM.'
      ],
      en: [
        'Setting up and optimizing advertising campaigns using Google Ads, analyzing data with Google Analytics and GTM.'
      ]
    },
    technologies: ['Google Ads', 'Google Analytics', 'Google Tag Manager', 'Data Modeling']
  }
];

export const DEFAULT_LEGAL_AND_BANNERS: LegalAndBannersData = {
  cookieBanner: {
    title: {
      ua: 'Конфіденційність & Обробка даних',
      en: 'Privacy & Data Processing'
    },
    description: {
      ua: 'Цей веб-сайт використовує виключно безпечне локальне сховище вашого браузера (LocalStorage) для підтримки персональних налаштувань. Жодних сторонніх трекерів, спам-куків чи передачі даних третім особам.',
      en: 'This portfolio utilizes minimal client-side browser storage (LocalStorage) strictly to retain your viewing preferences. Zero third-party ad pixels or commercial data harvesting.'
    },
    badge: {
      ua: 'PRIVACY & COMPLIANCE // GDPR & ЗУ «ПРО ЗАХИСТ ПЕРСОНАЛЬНИХ ДАНИХ»',
      en: 'PRIVACY & COMPLIANCE // GDPR & PRIVACY ACT'
    },
    configureBtn: {
      ua: 'Налаштувати тогли',
      en: 'Customize Toggles'
    },
    collapseBtn: {
      ua: 'Згорнути',
      en: 'Collapse'
    },
    essentialTitle: {
      ua: 'Необхідні технічні дані',
      en: 'Strictly Necessary Data'
    },
    essentialDesc: {
      ua: 'Збереження обраної мови інтерфейсу (UA/EN), стану згоди та критичних параметрів сесії.',
      en: 'Preserving chosen language (UA/EN), consent choices, and core session accessibility parameters.'
    },
    essentialStorage: {
      ua: 'LocalStorage',
      en: 'LocalStorage'
    },
    functionalTitle: {
      ua: 'Функціональні параметри',
      en: 'Functional Preferences'
    },
    functionalDesc: {
      ua: 'Збереження вибраного вигляду проєктів (Каскад / Сітка).',
      en: 'Layout view density memory (Masonry / Grid).'
    },
    functionalStorage: {
      ua: 'LocalStorage',
      en: 'LocalStorage'
    },
    analyticsLabel: {
      ua: 'Телеметрія швидкодії',
      en: 'Performance Telemetry'
    },
    analyticsDesc: {
      ua: 'Анонімізована діагностика швидкості ініціалізації WebGL-шейдерів та плавності анімацій (60 FPS).',
      en: 'Anonymized monitoring of client shader frame rates and responsiveness to guarantee silky smooth rendering.'
    },
    analyticsStorage: {
      ua: 'Client Runtime',
      en: 'Client Runtime'
    },
    preferencesLabel: {
      ua: 'Функціональні параметри',
      en: 'Functional Preferences'
    },
    preferencesDesc: {
      ua: 'Збереження вибраного вигляду проєктів (Каскад / Сітка).',
      en: 'Layout view density memory (Masonry / Grid).'
    },
    personalizationTitle: {
      ua: 'Персоналізація перегляду',
      en: 'Experience Personalization'
    },
    personalizationDesc: {
      ua: 'Запам’ятовування останніх переглянутих кейсів та збереженого масштабу зображень (Fill / Contain).',
      en: 'Retaining previously viewed project deep-dives and preferred image viewport presentation modes.'
    },
    personalizationStorage: {
      ua: 'LocalStorage Cache',
      en: 'LocalStorage Cache'
    },
    acceptAll: {
      ua: 'Прийняти всі',
      en: 'Accept All'
    },
    onlyNecessary: {
      ua: 'Лише необхідні',
      en: 'Essential Only'
    },
    savePreferences: {
      ua: 'Зберегти мій вибір',
      en: 'Save Selected'
    },
    policyLink: {
      ua: 'Політика конфіденційності',
      en: 'Privacy Policy'
    }
  },
  privacyPolicy: {
    title: {
      ua: 'Політика конфіденційності',
      en: 'Privacy Policy'
    },
    subtitle: {
      ua: 'Відповідно до Закону України «Про захист персональних даних» та Загального регламенту захисту даних (GDPR, EU 2016/679).',
      en: 'Compliant with the EU General Data Protection Regulation (GDPR) and international privacy frameworks.'
    },
    lastUpdated: {
      ua: 'Останнє оновлення: 2026 // Версія 1.0',
      en: 'Last Updated: 2026 // Version 1.0'
    },
    contactEmail: 'ivanselivanov771994@gmail.com',
    contactLocation: {
      ua: 'Львів, Україна',
      en: 'Lviv, Ukraine'
    },
    sections: [
      {
        id: 's1',
        title: {
          ua: '01 // Загальні положення та Володілець',
          en: '01 // Introduction & Controller'
        },
        content: {
          ua: 'Ця Політика конфіденційності регламентує порядок обробки та захисту персональних даних користувачів персонального вебсайту та цифрового портфоліо UI/UX дизайнера Івана Селіванова. Ми поважаємо вашу приватність і прагнемо забезпечити найвищий рівень безпеки та прозорості під час взаємодії з нашими ресурсами.',
          en: 'This Privacy Policy governs the processing and safeguarding of personal data collected through the digital portfolio and portfolio website of UI/UX Designer Ivan Selivanov. We hold user privacy to the highest standard and implement minimal-footprint data practices across all client-side and server-side components.'
        }
      },
      {
        id: 's2',
        title: {
          ua: '02 // Які дані ми збираємо',
          en: '02 // Information Collected'
        },
        content: {
          ua: 'Вебсайт збирає мінімально необхідний обсяг інформації: прямі контактні дані (email та зміст повідомлення, які ви добровільно надсилаєте під час прямого звернення на електронну пошту або через месенджери), технічні параметри відвідування (анонімізована роздільна здатність та тип браузера для оптимізації рендерингу) та локальні сховища (збереження мови UA/EN та режиму перегляду проєктів).',
          en: 'We process only strictly necessary operational data: direct inquiry data (email, name, and message contents when you reach out directly via email or messaging platforms), technical telemetry (anonymized viewport dimensions and performance metrics for WebGL scaling), and local client state (language preference UA/EN and grid density).'
        }
      },
      {
        id: 's3',
        title: {
          ua: '03 // Мета та правові підстави обробки',
          en: '03 // Purpose & Legal Basis'
        },
        content: {
          ua: 'Обробка даних здійснюється виключно з метою: надання відповідей на ваші професійні запити щодо дизайну, замовлень та співпраці; коректного відображення інтерактивних прототипів та 3D-рендерів; забезпечення стабільної технічної роботи та синхронізації портфоліо з базою даних.',
          en: 'Processing is anchored strictly in: responding to commercial inquiries and negotiating creative/technical service contracts; ensuring uninterrupted delivery of high-resolution interactive case studies; and maintaining web application security and responsiveness.'
        }
      },
      {
        id: 's4',
        title: {
          ua: '04 // Сторонні сервіси та безпека',
          en: '04 // Third-Party Infrastructure'
        },
        content: {
          ua: 'Сайт не передає ваші персональні дані маркетинговим агенціям і не використовує сторонні трекери. Для забезпечення роботи використовуються виключно надійні інфраструктурні провайдери: Google Cloud & Google Sheets API для синхронізації кейсів через зашифровані TLS 1.3 з’єднання та CDN з дотриманням ISO/IEC 27001.',
          en: 'We do not sell, rent, or monetize your information. We rely solely on enterprise-grade infrastructure providers adhering to ISO/IEC 27001 standards: Google Cloud & Sheets API for encrypted TLS 1.3 data exchange, and high-speed CDNs for visual asset streaming.'
        }
      },
      {
        id: 's5',
        title: {
          ua: '05 // Ваші права (GDPR)',
          en: '05 // Your Rights (GDPR)'
        },
        content: {
          ua: 'Ви маєте право отримати інформацію про наявність та обсяг ваших даних, вимагати їх виправлення або повного видалення («право бути забутим»), а також відкликати згоду на комунікацію в будь-який момент, надіславши лист на контактний email.',
          en: 'Under GDPR and applicable privacy legislation, you hold the right to access, correct, or request total erasure of any retained messages; object to data processing or withdraw contact consent at any point; or lodge a complaint with your supervisory authority.'
        }
      },
      {
        id: 's6',
        title: {
          ua: '06 // Контакти щодо конфіденційності',
          en: '06 // Data Protection Contact'
        },
        content: {
          ua: 'Якщо у вас виникли запитання щодо цієї Політики або захисту даних, звертайтесь безпосередньо: ivanselivanov771994@gmail.com (Львів, Україна).',
          en: 'For any privacy-related inquiries, data erasure requests, or audits, contact: ivan.selivanov.design@gmail.com (Location: Lviv, Ukraine).'
        }
      }
    ]
  },
  termsOfUse: {
    title: {
      ua: 'Умови використання',
      en: 'Terms of Use'
    },
    subtitle: {
      ua: 'Правила доступу до інтелектуальної власності, візуальних матеріалів та інтерактивних систем портфоліо.',
      en: 'Governing intellectual property rights, attribution requirements, and terms of portfolio access.'
    },
    lastUpdated: {
      ua: 'Останнє оновлення: 2026 // Версія 1.0',
      en: 'Last Updated: 2026 // Version 1.0'
    },
    contactEmail: 'ivanselivanov771994@gmail.com',
    sections: [
      {
        id: 't1',
        title: {
          ua: '01 // Авторське право та інтелектуальна власність',
          en: '01 // Intellectual Property & Copyright'
        },
        content: {
          ua: 'Усі матеріали сайту, включаючи графічні інтерфейси (UI), дизайн-системи, макети, типографічні композиції, 3D-моделі та рендери, вихідний код і фірмову монограму «IS», є об’єктами інтелектуальної власності Івана Селіванова або відповідних брендів-замовників. Всі права захищені Бернською конвенцією.',
          en: 'All content hosted on this domain—including user interfaces (UI), user experience frameworks (UX), component design tokens, typographic layouts, 3D assets and renders, interactive canvas shaders, and the "IS" identity mark—is the exclusive intellectual property of Ivan Selivanov or respective commissioning partners.'
        }
      },
      {
        id: 't2',
        title: {
          ua: '02 // Дозволене використання',
          en: '02 // Permitted Fair Use'
        },
        content: {
          ua: 'Користувачам дозволяється переглядати матеріали в особистих ознайомчих, освітніх та рекрутингових цілях, а також ділитися прямими посиланнями на кейси з обов’язковим зазначенням авторства (Іван Селіванов / Ivan Selivanov).',
          en: 'Visitors are granted a limited, revocable, non-exclusive license to review case studies for personal, educational, or professional evaluation, and share direct links with explicit attribution to Ivan Selivanov.'
        }
      },
      {
        id: 't3',
        title: {
          ua: '03 // Комерційні обмеження',
          en: '03 // Commercial Restrictions'
        },
        content: {
          ua: 'Суворо забороняється копіювання, модифікація, декомпіляція або використання графічних та кодових рішень портфоліо з комерційною метою без попередньої письмової згоди правовласника.',
          en: 'Strictly prohibited are unauthorized copying, code reverse-engineering, component extraction, or commercial repackaging of design assets without express prior written consent.'
        }
      },
      {
        id: 't4',
        title: {
          ua: '04 // Зовнішні посилання та сторонні платформи',
          en: '04 // External Links & 3P Platforms'
        },
        content: {
          ua: 'Портфоліо містить прямі посилання на сторонні платформи (LinkedIn, Telegram, Behance, GitHub). Ми не несемо відповідальності за зміст або політику конфіденційності зовнішніх сайтів.',
          en: 'The portfolio provides direct outbound links to third-party services (Behance, GitHub, LinkedIn, Telegram). We assume no liability for the policies, accessibility, or terms of third-party platforms.'
        }
      },
      {
        id: 't5',
        title: {
          ua: '05 // Зміни до Умов',
          en: '05 // Revisions to Terms'
        },
        content: {
          ua: 'Ми залишаємо за собою право оновлювати ці Умови в будь-який час. Продовження користування сайтом після внесення змін означає вашу автоматичну згоду з оновленими умовами.',
          en: 'We reserve the right to revise or update these Terms as the portfolio expands. Continued interaction with the site post-update constitutes acceptance of revised terms.'
        }
      },
      {
        id: 't6',
        title: {
          ua: '06 // Контактні дані',
          en: '06 // Inquiries & Contact'
        },
        content: {
          ua: 'З усіх питань щодо авторських прав, ліцензування чи комерційної співпраці звертайтесь: ivanselivanov771994@gmail.com.',
          en: 'For all IP, licensing, or commercial inquiries: ivan.selivanov.design@gmail.com.'
        }
      }
    ]
  },
  announcementBanner: {
    enabled: true,
    badge: {
      ua: 'NEW // СИНХРОНІЗАЦІЯ',
      en: 'NEW // CLOUD SYNC'
    },
    text: {
      ua: 'Доступний для нових викликів: UI/UX дизайн, айдентика та складні веб-інтерфейси',
      en: 'Available for contract engagements: UI/UX architecture, brand identity & full-stack web'
    },
    link: '#contact'
  }
};

export const DEFAULT_CONTACTS: ContactsData = {
  email: 'ivanselivanov771994@gmail.com',
  telegram: '',
  linkedin: 'https://www.linkedin.com/in/ivan-selivanov-4bb884183/',
  behance: '',
  github: '',
  phone: '',
  address: {
    ua: 'Львів, Україна (Доступний по всьому світу)',
    en: 'Lviv, Ukraine (Available Worldwide)'
  },
  location: {
    ua: 'Львів, Україна (Доступний по всьому світу)',
    en: 'Lviv, Ukraine (Available Worldwide)'
  }
};

export const DEFAULT_WORKFLOW: WorkflowStep[] = [
  {
    id: 'wf-1',
    stepNumber: '01',
    title: {
      ua: 'Дослідження & Стратегічний Бриф',
      en: 'Discovery & Strategic Briefing'
    },
    description: {
      ua: 'Глибоке занурення в бізнес-завдання, аудиторію та контекст ринку. Формування чітких цілей проєкту, функціональних вимог і прозорих очікувань.',
      en: 'Deep dive into business goals, user audience, and competitive benchmarks. Defining crystal-clear scope, technical constraints, and strategic milestones.'
    },
    deliverables: {
      ua: [
        'Структурований бриф проєкту',
        'Аналіз конкурентів та референсів',
        'Карта сайту та ключові сценарії'
      ],
      en: [
        'Structured Project Brief',
        'Competitive & Style Benchmarking',
        'Information Architecture Sitemap'
      ]
    },
    tools: ['Notion', 'FigJam', 'Miro']
  },
  {
    id: 'wf-2',
    stepNumber: '02',
    title: {
      ua: 'UX-архітектура & Вайрфрейми',
      en: 'UX Architecture & Wireframing'
    },
    description: {
      ua: 'Проєктування користувацьких сценаріїв (User Flows) та низькодеталізованих вайрфреймів. Усунення логічних помилок і тестування зручності до початку візуалу.',
      en: 'Designing intuitive user journey flows and monochrome structural wireframes. Eliminating friction points and stress-testing logic prior to visual styling.'
    },
    deliverables: {
      ua: [
        'Сценарії взаємодії (User Flows)',
        'Чорно-білі вайрфрейми екранів',
        'Базова сітка та лейаут'
      ],
      en: [
        'User Journey & Interaction Flows',
        'Low-Fidelity UX Wireframes',
        'Structural Grid Systems'
      ]
    },
    tools: ['Figma', 'FigJam']
  },
  {
    id: 'wf-3',
    stepNumber: '03',
    title: {
      ua: 'UI-дизайн & Прототипування у Stitch',
      en: 'UI Craft & Stitch Prototyping'
    },
    description: {
      ua: 'Створення виразного візуального стилю, типографічної ієрархії та дизайн-токенів. Швидка генерація концепцій та сучасне інтерактивне прототипування за допомогою інструменту Stitch у поєднанні з Figma.',
      en: 'Crafting distinctive visual identity, typographic scales, and design tokens. Rapid layout synthesis, ideation, and modern UI prototyping powered by Stitch alongside Figma.'
    },
    deliverables: {
      ua: [
        'Піксель-перфект UI-макети',
        'Дизайн-токени (кольори, шрифти, відступи)',
        'Адаптивні екрани (Desktop & Mobile)'
      ],
      en: [
        'High-Fidelity Interface Screens',
        'Semantic Design Tokens Architecture',
        'Responsive Layouts (Desktop & Mobile)'
      ]
    },
    tools: ['Figma', 'Stitch', 'Tokens Studio']
  },
  {
    id: 'wf-4',
    stepNumber: '04',
    title: {
      ua: 'Прототип & Передача в розробку',
      en: 'Prototyping & Developer Handoff'
    },
    description: {
      ua: 'Складання клікабельного інтерактивного прототипу, пакування компонентів з Auto Layout та підготовка детальних специфікацій для розробників без зайвих питань.',
      en: 'Interactive clickable prototypes, modular component architecture with Auto Layout, and detailed specifications for smooth, frictionless engineering.'
    },
    deliverables: {
      ua: [
        'Клікабельний інтерактивний прототип',
        'Компонентна бібліотека (Auto Layout)',
        'Авторський нагляд та QA-ревʼю верстки'
      ],
      en: [
        'Interactive Figma Prototype',
        'Component Library with Auto Layout',
        'Engineering Specs & QA Review'
      ]
    },
    tools: ['Figma Dev Mode', 'GitHub', 'Vercel']
  }
];

export const DEFAULT_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      ua: 'Які формати співпраці доступні?',
      en: 'What collaboration models do you offer?'
    },
    answer: {
      ua: 'Працюю у трьох прозорих форматах:\n• Fixed-Price — фіксована вартість за чітко погодженим обсягом робіт (найкраще для лендінгів, редизайнів або MVP);\n• Time & Material (погодинна ставка) — для гнучких задач, аудитів та консультацій;\n• Monthly Retainer — щомісячний супровід продукту для компаній, яким потрібен надійний дизайн-партнер на регулярній основі.',
      en: 'I provide three transparent engagement formats:\n• Fixed-Price — defined project scope with locked deliverables and milestone payments (ideal for MVPs, landings, or redesigns);\n• Time & Material (hourly rate) — for flexible, evolving design needs and consultations;\n• Monthly Retainer — ongoing product design partnership for companies requiring steady dedicated capacity.'
    }
  },
  {
    id: 'faq-2',
    question: {
      ua: 'Чи підписуєте ви договір про нерозголошення (NDA)?',
      en: 'Do you sign Non-Disclosure Agreements (NDA)?'
    },
    answer: {
      ua: 'Так, абсолютно. Будь-які ідеї, комерційні дані, напрацювання та інтелектуальна власність клієнта захищаються за замовчуванням. За потреби ми підписуємо двосторонній NDA ще до початку первинного детального обговорення чи аналізу матеріалів.',
      en: 'Yes, unconditionally. Proprietary business data, intellectual property, and product ideas are treated with strict confidentiality. A mutual NDA can be signed prior to any detailed briefing or asset sharing.'
    }
  },
  {
    id: 'faq-3',
    question: {
      ua: 'Як саме організовано передачу макетів розробникам?',
      en: 'How do you handle design handoff to developers?'
    },
    answer: {
      ua: 'Макет у Figma передається в ідеальному інженерному стані: компоненти побудовані на Auto Layout, організовані семантичні змінні (Variables / Design Tokens), винесені всі стани кнопок та полів (Hover, Active, Focus, Disabled, Error). Завдяки моєму розумінню веброзробки (HTML, CSS, Tailwind, TypeScript) розробники отримують макети, які легко й передбачувано верстаються.',
      en: 'Figma files are delivered fully production-ready: modular component hierarchy, Auto Layout, semantic design tokens (colors, typography, spacing), and comprehensive component states. My foundational front-end understanding (HTML, CSS, Tailwind CSS, TypeScript) ensures frictionless translation into real code.'
    }
  },
  {
    id: 'faq-4',
    question: {
      ua: 'Скільки часу зазвичай триває робота над проєктом?',
      en: 'What is the typical project turnaround time?'
    },
    answer: {
      ua: 'Терміни завжди залежать від обсягу та складності завдань:\n• Цільовий лендінг або концепт: 5–10 робочих днів;\n• Комплексний вебсайт або багатосторінковий інтерфейс: 2–4 тижні;\n• Повноцінний цифровий продукт, SaaS чи додаток із дизайн-системою: 4–6 тижнів.\nГрафік робіт та проміжні дедлайни завжди чітко фіксуються на старті.',
      en: 'Turnaround depends on project scope and system complexity:\n• High-impact landing page or concept: 5–10 business days;\n• Multi-page website or web interface: 2–4 weeks;\n• Full-scale SaaS product, mobile app, or design system: 4–6 weeks.\nMilestones and review cadences are locked in at project inception.'
    }
  },
  {
    id: 'faq-5',
    question: {
      ua: 'Що потрібно надати для старту співпраці?',
      en: 'What is required to get started?'
    },
    answer: {
      ua: 'Достатньо загального опису вашого проєкту, очікуваних бізнес-цілей, бажаних термінів та прикладів стилістики чи сайтів, які вам імпонують (якщо є). Якщо у вас ще немає детального технічного завдання — я допоможу його сформулювати та структурувати під час первинного зідзвону або в листуванні.',
      en: 'A high-level outline of your product, target audience, ideal timeline, and any visual benchmarks you appreciate. If you do not have an established specification yet, I will guide you through an efficient discovery questionnaire.'
    }
  },
  {
    id: 'faq-6',
    question: {
      ua: 'Які інструменти використовуються в роботі (Figma, Stitch тощо)?',
      en: 'What design tools and software are utilized (Figma, Stitch, etc.)?'
    },
    answer: {
      ua: 'Основним інструментом є Figma для UI/UX дизайну та побудови систем. Також активно інтегрую інструмент Stitch для надшвидкого концептуального прототипування, FigJam для інформаційної архітектури, Tokens Studio для дизайн-систем, а також практичні знання HTML/CSS/Tailwind для гарантії технічної здійсненності дизайну.',
      en: 'My primary environment is Figma for UI architecture and component systems. I also actively leverage Stitch for rapid AI-assisted ideation and interactive prototyping, FigJam for mapping, Tokens Studio for design tokens, and web engineering fluency (HTML/CSS/Tailwind) to guarantee technical feasibility.'
    }
  }
];

