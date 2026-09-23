import { Project, ExperienceItem, Testimonial, GeneralSettings, LegalAndBannersData, ContactsData } from '../types';

export const DEFAULT_SETTINGS: GeneralSettings = {
  name: {
    ua: 'Іван Селіванов',
    en: 'Ivan Selivanov'
  },
  title: {
    ua: 'Артдиректор & UI/UX Архітектор',
    en: 'Art Director & UI/UX Architect'
  },
  bioShort: {
    ua: 'Проєктую сучасні вебсайти та цифрові продукти, поєднуючи чисту візуальну естетику з продуманою логікою.',
    en: 'I design modern websites and digital products, combining clean visual aesthetics with thoughtful logic.'
  },
  heroTag: {
    ua: 'Готовий до співпраці',
    en: 'Available for work'
  },
  heroTagline: {
    ua: 'Проєктую сучасні вебсайти та цифрові продукти, поєднуючи чисту візуальну естетику з продуманою логікою.',
    en: 'I design modern websites and digital products, combining clean visual aesthetics with thoughtful logic.'
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
    contactsTitle: { ua: 'Прямі контакти:', en: 'Direct Channels:' },
    copyBtn: { ua: 'Копія', en: 'Copy' },
    copiedBtn: { ua: 'Копія!', en: 'Copied!' }
  }
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    projectId: 'fintech-liquidity-os',
    author: 'Марк Оксфорд (Mark Oxford)',
    company: 'FinPulse Capital (London)',
    role: {
      ua: 'VP of Product Engineering',
      en: 'VP of Product Engineering'
    },
    text: {
      ua: 'Іван трансформував наш перевантажений біржовий термінал у бездоганну дизайн-систему. Час прийняття рішень трейдерами скоротився на 38%. Рідкісне поєднання художнього смаку рівня Awwwards і суворої продуктової інженерії.',
      en: 'Ivan transformed our cluttered trading terminal into a pristine, high-frequency design system. Trader decision latency dropped by 38%. A rare blend of Awwwards-caliber art direction and rigorous product engineering.'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 't-2',
    projectId: 'swiss-grid-manifesto',
    author: 'Олена Ковальчук',
    company: 'Artisan Press Publishing',
    role: {
      ua: 'Головна редакторка видавництва',
      en: 'Editor-in-Chief, Artisan Press'
    },
    text: {
      ua: 'Робота Івана з модульними сітками та типографікою для арт-буку викликала справжній фурор на Книжковому Арсеналі. Він відчуває кожен міліметр шпальти та глибину шрифтового контрасту.',
      en: 'Ivan’s mastery over modular grid systems and typographic rhythm created an absolute sensation. He commands every millimeter of negative space and typographic contrast with total precision.'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p-1',
    slug: 'fintech-liquidity-os',
    title: 'Aura Capital: Liquidity OS',
    category: 'ui-ux',
    categoryLabel: {
      ua: 'UI/UX Продукт',
      en: 'UI/UX Product'
    },
    status: 'realized',
    role: {
      ua: 'Lead Product Designer & Design Architect',
      en: 'Lead Product Designer & Design Architect'
    },
    timeline: '2024 (6 місяців)',
    tagline: {
      ua: 'Корпоративна трейдингова екосистема для мульти-активних ринків',
      en: 'Enterprise algorithmic trading ecosystem for multi-asset markets'
    },
    description: {
      ua: 'Повний редизайн та архітектура інституційного фінтех-терміналу з потоковою передачею біржових склянок, інтерактивними матрицями ризику та темною палітрою, оптимізованою для багатогодинних сесій аналітиків.',
      en: 'Full architecture and redesign of an institutional trading workspace featuring real-time depth order books, dynamic risk matrices, and an OLED-optimized low-fatigue dark interface for professional market makers.'
    },
    problemStatement: {
      ua: 'Попередній інтерфейс страждав від критичного когнітивного перевантаження: трейдери губилися між 14 плаваючими вікнами, а швидкість реакції на аномалії ліквідності падала через хаотичну типографічну ієрархію.',
      en: 'The legacy system suffered from severe cognitive friction: operators navigated up to 14 disjointed floating windows with zero typographic hierarchy, resulting in costly reaction delays during market volatility spikes.'
    },
    solution: {
      ua: 'Спроєктовано модульну 16-колонкову гнучку сітку на основі концепції «Command Central». Впроваджено єдину систему токенів дизайн-системи, клавіатурну навігацію першого класу та мікроанімації статусів замовлень.',
      en: 'Engineered a unified 16-column adaptive grid anchored around a Command Central layout. Introduced tokenized atomic design, zero-latency keyboard shortcuts, and subtle micro-feedback loops for order confirmation states.'
    },
    businessImpact: {
      ua: 'Зниження часу виконання ордерів на 38%, підвищення задоволеності користувачів (CSAT) з 54% до 92%, успішне залучення $14M Series-A інвестицій за рахунок демонстрації продуктової зрілості.',
      en: '38% decrease in order entry latency, user satisfaction (CSAT) surged from 54% to 92%, and enabled a successful $14M Series-A funding round driven by enterprise product maturity.'
    },
    metrics: [
      { value: '-38%', label: { ua: 'Час виконання операцій', en: 'Execution Latency' } },
      { value: '92%', label: { ua: 'CSAT Показник', en: 'CSAT Score' } },
      { value: '$14M', label: { ua: 'Залучено інвестицій', en: 'Series-A Raised' } }
    ],
    toolsUsed: ['Figma', 'React', 'Tailwind CSS', 'TypeScript', 'Tokens Studio'],
    designSystem: {
      fonts: ['PP Neue Montreal', 'JetBrains Mono'],
      colors: [
        { name: 'Terminal Void', hex: '#0B0D11' },
        { name: 'Surface Low', hex: '#161A22' },
        { name: 'Signal Emerald', hex: '#10B981' },
        { name: 'Alert Crimson', hex: '#EF4444' },
        { name: 'Accent Cyber', hex: '#3B82F6' }
      ],
      gridType: '16-Column Liquid Flex Grid / 4px Baseline'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1400'
    ],
    liveLink: 'https://aura-capital.demo',
    isFeatured: true,
    sortOrder: 1,
    testimonialId: 't-1'
  },
  {
    id: 'p-2',
    slug: 'spatial-monoliths-render',
    title: 'Spatial Monoliths: 3D Artifacts',
    category: '3d-render',
    categoryLabel: {
      ua: '3D Рендеринг & Візуалізація',
      en: '3D Render & Art Direction'
    },
    status: 'concept',
    role: {
      ua: '3D Concept Artist & Visual Director',
      en: '3D Concept Artist & Visual Director'
    },
    timeline: '2024 (Концептуальне дослідження)',
    tagline: {
      ua: 'Дослідження архітектурної брутальності та скульптурного світла',
      en: 'Sculptural light exploration and architectural brutalism'
    },
    description: {
      ua: 'Серія статичних високодеталізованих рендерів, які вивчають взаємодію масивних титанових і базальтових геометричних тіл із розсіяним атмосферним освітленням. Оживлено через WebGL шейдери деформації та паралакс глибини.',
      en: 'A curated cycle of high-fidelity volumetric renders exploring the tension between monolithic basalt forms and diffuse directional radiance. Re-animated on the web using real-time canvas displacement and interactive lighting tilt.'
    },
    problemStatement: {
      ua: 'Технічний виклик полягав у тому, що оригінальні 3D сцени (.c4d / .blend) були втрачені, залишилися лише бездоганні статичні TIFF рендери високої роздільної здатності. Необхідно було змусити статику дихати.',
      en: 'Creative dilemma: original 3D geometry scene files were lost, leaving only pristine ultra-res 4K renders. The goal was to imbue flat raster graphics with visceral, reactive 3D spatial presence.'
    },
    solution: {
      ua: 'Створено спеціальний WebGL-компонент із картою нормалей та мікродеформацією при переміщенні курсора. Додано оптичний ефект аберації лінзи та динамічний зум на скролі.',
      en: 'Developed an interactive displacement shader using mouse coordinates as a virtual light and normal tilt engine. Paired with chromatic aberration edge shifts and scroll-driven scale choreography.'
    },
    businessImpact: {
      ua: 'Проєкт отримав відзнаку Behance Featured у категорії 3D Art та став візуальним референсом для стилістики двох міжнародних фінансових брендів.',
      en: 'Recognized as Behance Curated 3D Pick, establishing a signature aesthetic that generated 4 enterprise consulting inquiries.'
    },
    metrics: [
      { value: '4K', label: { ua: 'Роздільна здатність рендерів', en: 'Master Output Res' } },
      { value: '60 FPS', label: { ua: 'Частота шейдерної анімації', en: 'WebGL Shader Rate' } }
    ],
    toolsUsed: ['Cinema 4D (Legacy)', 'Octane Render', 'WebGL', 'Framer Motion', 'Adobe Photoshop'],
    designSystem: {
      fonts: ['Monument Extended', 'Neue Haas Grotesk'],
      colors: [
        { name: 'Obsidian Black', hex: '#050505' },
        { name: 'Titanium Raw', hex: '#8A8D93' },
        { name: 'Caustic White', hex: '#F9FAFB' }
      ],
      gridType: 'Single Column Focus / Golden Ratio Margins'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1400'
    ],
    isFeatured: true,
    sortOrder: 2
  },
  {
    id: 'p-3',
    slug: 'swiss-grid-manifesto',
    title: 'Die Raster: Swiss Typography & Print',
    category: 'book-design',
    categoryLabel: {
      ua: 'Книжковий Дизайн & Препрес',
      en: 'Editorial & Book Design'
    },
    status: 'realized',
    role: {
      ua: 'Editorial Designer & Pre-press Specialist',
      en: 'Editorial Designer & Pre-press Specialist'
    },
    timeline: '2023 (3 місяці)',
    tagline: {
      ua: 'Фундаментальне видання про швейцарські модульні сітки',
      en: 'Fundamental editorial study on rationalist Swiss grid systems'
    },
    description: {
      ua: 'Академічне видання на 240 сторінок із математично вивіреною системою полів (за канонами Віллема Сандберга та Йозефа Мюллера-Брокманна), шовкодрук на тактильному швейцарському папері Munken Pure.',
      en: 'A 240-page hardcover monograph adhering strictly to golden canon proportions. Features silkscreen cover accents, duplex color separations, and printed on tactile FSC-certified Munken Pure paper stock.'
    },
    problemStatement: {
      ua: 'Необхідно було структурувати масивний історичний архів текстів трьома мовами так, щоб складні багаторівневі виноски та схеми залишалися синхронними з базовим шрифтовим інтерліньяжем.',
      en: 'The challenge required synchronizing complex multilingual parallel essays with technical diagrams without violating strict baseline grid continuity across facing spreads.'
    },
    solution: {
      ua: 'Розроблено 12-колонкову комбіновану модульну сітку з вертикальним кроком 11pt. Всі заголовки, підписи та маргіналії підпорядковані суворій геометричній пропорції 1:1.414 (DIN).',
      en: 'Engineered a composite 12-column modular grid with a rigid 11pt baseline rhythm. Applied ISO-216 proportional scaling for subheadings, marginalia, and typographic markers.'
    },
    businessImpact: {
      ua: 'Тираж 1,500 примірників розпродано за перші два тижні. Нагорода "Кращий книжковий дизайн року" на галузевому форумі.',
      en: 'Full 1,500 limited first edition sold out within 14 days; awarded Book Design of the Year by the National Graphic Syndicate.'
    },
    metrics: [
      { value: '240', label: { ua: 'Сторінок видання', en: 'Pages Designed' } },
      { value: '11 pt', label: { ua: 'Базовий інтерліньяж', en: 'Rigid Baseline' } },
      { value: '1,500', label: { ua: 'Тираж розпродано', en: 'Copies Sold Out' } }
    ],
    toolsUsed: ['Adobe InDesign', 'Adobe Illustrator', 'Pre-Press Acrobat Pro', 'Enfocus PitStop'],
    designSystem: {
      fonts: ['Univers 55 Roman', 'Univers 65 Bold'],
      colors: [
        { name: 'Munken Cream', hex: '#F6F5EE' },
        { name: 'Swiss Vermilion', hex: '#FF2A00' },
        { name: 'Deep Carbon', hex: '#121212' }
      ],
      gridType: '12-Module Swiss Editorial Grid'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1600868856403-51829e2fa930?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600868856403-51829e2fa930?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1400'
    ],
    liveLink: 'https://artisan-press.example/raster',
    isFeatured: true,
    sortOrder: 3,
    testimonialId: 't-2'
  },
  {
    id: 'p-4',
    slug: 'synapse-ai-platform',
    title: 'Synapse: Neuromorphic Cloud Console',
    category: 'ui-ux',
    categoryLabel: {
      ua: 'UI/UX Продукт',
      en: 'UI/UX SaaS Product'
    },
    status: 'concept',
    role: {
      ua: 'Product Architect & Creative Director',
      en: 'Product Architect & Creative Director'
    },
    timeline: '2024 (Концепт B2B платформи)',
    tagline: {
      ua: 'Платформа керування нейромережевими кластерами та GPU фермами',
      en: 'Next-gen console for neuromorphic model training & GPU clusters'
    },
    description: {
      ua: 'Концепт панелі моніторингу для AI-інженерів: наочна топологія тензорних ядер, відстеження теплових карт пам’яті та мікроінтерактивна консоль конфігурації тренування LLM.',
      en: 'Next-generation web console for deep learning teams: interactive tensor topology graph, memory distribution heatmaps, and low-latency micro-interactive deployment pipelines.'
    },
    problemStatement: {
      ua: 'Сучасні інструменти типу AWS/GCP страждають від надлишкової складності та застарілого інтерфейсу зразка 2012 року, де інженерам важко діагностувати "застрягання" тренування моделей.',
      en: 'Incumbent cloud dashboards (AWS/GCP) feel fragmented and outdated, causing ML researchers to lose hours detecting stalled gradient descent pipelines across clusters.'
    },
    solution: {
      ua: 'Створено просторову модель кластера у вигляді інтерактивного графа зв’язків із кольоровим кодуванням пропускної здатності та нативною темною темою з високим контрастом.',
      en: 'Designed an interactive SVG node topology visualization with dynamic link weight coloring and contextual side-drawers for zero-navigation diagnostic workflows.'
    },
    businessImpact: {
      ua: 'Концепт продемонстрував можливості скорочення часу виявлення збоїв у розподіленому тренуванні на 45% порівняно зі стандартними консолями.',
      en: 'Simulated 45% faster fault isolation in multi-GPU distributed runs compared to industry benchmark consoles.'
    },
    metrics: [
      { value: '45%', label: { ua: 'Швидша діагностика збоїв', en: 'Faster Issue Isolation' } },
      { value: '100%', label: { ua: 'Dark Mode Контрастність (AAA)', en: 'WCAG AAA Contrast' } }
    ],
    toolsUsed: ['Figma', 'Next.js', 'Lucide Icons', 'D3.js Topology Engine'],
    designSystem: {
      fonts: ['Geist Sans', 'Geist Mono'],
      colors: [
        { name: 'OLED Pitch', hex: '#000000' },
        { name: 'Neural Indigo', hex: '#4F46E5' },
        { name: 'Synapse Cyan', hex: '#06B6D4' }
      ],
      gridType: 'Modular High-Density Data Grid'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1400'
    ],
    isFeatured: false,
    sortOrder: 4
  },
  {
    id: 'p-5',
    slug: 'kinetica-sound-identity',
    title: 'Kinetica: Generative Sound Identity',
    category: 'branding',
    categoryLabel: {
      ua: 'Айдентика & Постери',
      en: 'Visual Identity & Posters'
    },
    status: 'realized',
    role: {
      ua: 'Art Director & Graphic System Designer',
      en: 'Art Director & Graphic System Designer'
    },
    timeline: '2023',
    tagline: {
      ua: 'Динамічна графічна система міжнародного фестивалю електронної музики',
      en: 'Generative modular visual identity for avant-garde electronic music'
    },
    description: {
      ua: 'Колекція з 12 широкоформатних постерів, де шрифтові композиції деформуються в такт низькочастотним звуковим хвилям за допомогою кастомного JS-генератора.',
      en: 'A collection of 12 monumental posters where typographic glyphs deform algorithmically driven by raw sub-bass frequencies and kinetic script modules.'
    },
    problemStatement: {
      ua: 'Статична айдентика попередніх років не передавала драйв та інноваційність саунд-дизайну учасників фестивалю.',
      en: 'Prior static festival collateral failed to express the visceral tension and digital avant-garde sonic textures of modern electronic music.'
    },
    solution: {
      ua: 'Створено систему варіативного шрифту, що реагує на спектральний аудіо-вхід, та розроблено серію постерів на преміальному матовому папері з УФ-лакуванням.',
      en: 'Engineered an audio-reactive generative script exporting ready-to-print vector assets with spot-UV varnished typographical highlights.'
    },
    businessImpact: {
      ua: 'Sold out фестивалю за 48 годин після запуску рекламної кампанії. Постери виставлялися в галереї сучасного мистецтва.',
      en: 'Festival tickets sold out within 48 hours of poster rollout; visual series selected for contemporary gallery exhibition.'
    },
    metrics: [
      { value: '48h', label: { ua: 'Повний Sold Out квитків', en: 'Total Sold Out Time' } },
      { value: '12', label: { ua: 'Авторських постерів', en: 'Collector Edition Posters' } }
    ],
    toolsUsed: ['Processing / p5.js', 'Adobe Illustrator', 'Custom Variable Font'],
    designSystem: {
      fonts: ['Kinetic Grotesk Display', 'Suisse Int’l'],
      colors: [
        { name: 'Pure White', hex: '#FFFFFF' },
        { name: 'Acid Acid Lime', hex: '#D4FF00' },
        { name: 'Absolute Dark', hex: '#000000' }
      ],
      gridType: 'Dynamic Asymmetric Soundwave Grid'
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1400'
    ],
    isFeatured: false,
    sortOrder: 5
  }
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    type: 'art-direction',
    company: {
      ua: 'Monolith Design Labs',
      en: 'Monolith Design Labs'
    },
    location: {
      ua: 'Київ / Віддалено',
      en: 'Kyiv / Remote'
    },
    role: {
      ua: 'Lead UI/UX Architect & Art Director',
      en: 'Lead UI/UX Architect & Art Director'
    },
    period: {
      ua: '2023 — Зараз',
      en: '2023 — Present'
    },
    description: {
      ua: [
        'Керування дизайн-стратегією складних фінтех та Web3 платформ для клієнтів з Лондона, Берліна та Нью-Йорка.',
        'Побудова дизайн-систем з підтримкою мульти-брендів та токенізацією для великих команд розробки.',
        'Впровадження суворих продуктових метрик (SUS, CSAT, task success rate) у креативний дизайн-процес.'
      ],
      en: [
        'Directing UI/UX architecture and visual strategy for high-stakes fintech and enterprise clients across EU & US.',
        'Architecting multi-brand design systems with unified design tokens for 30+ engineer cross-functional squads.',
        'Infusing quantitative product metrics (SUS, CSAT, task latency) into award-winning art direction.'
      ]
    },
    technologies: ['Figma', 'Design Systems', 'Design Tokens', 'Next.js', 'Awwwards Mentorship']
  },
  {
    id: 'exp-2',
    type: 'commercial',
    company: {
      ua: 'Apex Digital Systems',
      en: 'Apex Digital Systems'
    },
    location: {
      ua: 'Київ',
      en: 'Kyiv'
    },
    role: {
      ua: 'Senior Product Designer',
      en: 'Senior Product Designer'
    },
    period: {
      ua: '2021 — 2023',
      en: '2021 — 2023'
    },
    description: {
      ua: [
        'Створення інтерфейсів SaaS платформ, аналітичних дашбордів та мобільних додатків із мільйонною аудиторією.',
        'Тісна колаборація з продуктовими менеджерами, проведення поглиблених інтерв’ю та тестування зручності користування.',
        'Оптимізація конверсійних воронок (CRO) з вимірюваним зростанням ключових показників на 24-40%.'
      ],
      en: [
        'Designed mission-critical SaaS dashboards, enterprise portals, and consumer mobile apps serving 1M+ active users.',
        'Conducted qualitative customer discovery, usability benchmarks, and end-to-end user journey mapping.',
        'Drove conversion rate optimization initiatives yielding 24% to 40% lifts in key funnel milestones.'
      ]
    },
    technologies: ['User Research', 'Information Architecture', 'Figma', 'Prototyping', 'WCAG 2.1 AAA']
  },
  {
    id: 'exp-3',
    type: 'education',
    company: {
      ua: 'Kyiv National Academy of Media Arts (KAMA)',
      en: 'Kyiv National Academy of Media Arts (KAMA)'
    },
    location: {
      ua: 'Київ',
      en: 'Kyiv'
    },
    role: {
      ua: 'Art Direction & Digital Design Honors',
      en: 'Art Direction & Digital Design Honors'
    },
    period: {
      ua: '2019 — 2021',
      en: '2019 — 2021'
    },
    description: {
      ua: [
        'Поглиблене вивчення історії швейцарської типографіки, структурної семіотики, кольорознавства та кінетичного дизайну.',
        'Дипломна робота з інтерактивного вебдизайну відзначена міжнародним журі.'
      ],
      en: [
        'Specialized studies in Swiss rationalist typography, semiotic visual narrative, chromatic theory, and motion systems.',
        'Graduation capstone interactive design project acclaimed by international jury.'
      ]
    },
    technologies: ['Swiss Typography', 'Structural Semiotics', 'Grid Systems', 'Book Pre-press']
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
      ua: 'Тактильний звуковий супровід кліків (Web Audio API), збереження вибраного вигляду проєктів (Каскад / Сітка).',
      en: 'Tactile sound feedback for micro-interactions, layout view density memory (Masonry / Grid).'
    },
    functionalStorage: {
      ua: 'LocalStorage / Audio API',
      en: 'LocalStorage / Audio API'
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
      ua: 'Тактильний звуковий супровід кліків (Web Audio API), збереження вибраного вигляду проєктів (Каскад / Сітка).',
      en: 'Tactile sound feedback for micro-interactions, layout view density memory (Masonry / Grid).'
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
      ua: 'Останнє оновлення: 2025 // Версія 2.4',
      en: 'Last Updated: 2025 // Version 2.4'
    },
    contactEmail: 'ivan.selivanov.design@gmail.com',
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
          ua: 'Ця Політика конфіденційності регламентує порядок обробки та захисту персональних даних користувачів персонального веб-сайту та цифрового портфоліо артдиректора й UI/UX дизайнера Івана Селіванова. Ми поважаємо вашу приватність і прагнемо забезпечити найвищий рівень безпеки та прозорості під час взаємодії з нашими ресурсами.',
          en: 'This Privacy Policy governs the processing and safeguarding of personal data collected through the digital portfolio and portfolio website of Art Director & UI/UX Architect Ivan Selivanov. We hold user privacy to the highest standard and implement minimal-footprint data practices across all client-side and server-side components.'
        }
      },
      {
        id: 's2',
        title: {
          ua: '02 // Які дані ми збираємо',
          en: '02 // Information Collected'
        },
        content: {
          ua: 'Веб-сайт збирає мінімально необхідний обсяг інформації: прямі контактні дані (ім’я, email, повідомлення, які ви добровільно надсилаєте через форму зв’язку), технічні параметри відвідування (анонімізована роздільна здатність та тип браузера для оптимізації рендерингу) та локальні сховища (збереження мови UA/EN та сітки).',
          en: 'We process only strictly necessary operational data: direct inquiry data (name, business email, and message contents when you reach out regarding commissions), technical telemetry (anonymized viewport dimensions and performance metrics for WebGL scaling), and local client state (language preference UA/EN and grid density).'
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
          ua: 'Якщо у вас виникли запитання щодо цієї Політики або захисту даних, звертайтесь безпосередньо: ivan.selivanov.design@gmail.com (Львів, Україна).',
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
      ua: 'Останнє оновлення: 2025 // Версія 2.4',
      en: 'Last Updated: 2025 // Version 2.4'
    },
    contactEmail: 'ivan.selivanov.design@gmail.com',
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
          ua: '03 // Заборонені дії',
          en: '03 // Prohibited Activities'
        },
        content: {
          ua: 'Категорично заборонено копіювати або видавати за власні концепції (плагіат), використовувати матеріали сайту в комерційних продуктах або для продажу без письмового дозволу Автора, а також здійснювати автоматизований збір даних (scraping) для навчання AI-моделей.',
          en: 'You explicitly agree not to reproduce or misrepresent any design concepts as your own work (strict anti-plagiarism), extract or sell graphical assets for commercial distribution without prior written consent, or execute automated scraping targeting AI training sets.'
        }
      },
      {
        id: 't4',
        title: {
          ua: '04 // Концептуальні проєкти та торговельні марки',
          en: '04 // Trademarks & Third-Party Marks'
        },
        content: {
          ua: 'Усі логотипи та торговельні марки третіх сторін, згадані в контексті кейсів, належать їхнім законним власникам і використовуються виключно в інформаційних цілях портфоліо (Fair Use).',
          en: 'All third-party brand names, client emblems, and registered trademarks displayed within case studies are properties of their respective holders and referenced purely for professional retrospective and nominative fair use.'
        }
      },
      {
        id: 't5',
        title: {
          ua: '05 // Відмова від гарантій та обмеження відповідальності',
          en: '05 // Warranty Disclaimer & Limitation of Liability'
        },
        content: {
          ua: 'Сайт надається на умовах «як є» (AS IS). Автор не несе відповідальності за можливі тимчасові перебої в роботі хостингу або несумісність окремих WebGL-функцій із застарілими пристроями користувача.',
          en: 'This portfolio is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. The author assumes no liability for device-specific WebGL incompatibilities or external network latency.'
        }
      },
      {
        id: 't6',
        title: {
          ua: '06 // Ліцензування та комерційні запити',
          en: '06 // Commissioning & Licensing Inquiries'
        },
        content: {
          ua: 'Для придбання ліцензій на концептуальні розробки, замовлення оригінального дизайну або узгодження публікацій звертайтесь: ivan.selivanov.design@gmail.com.',
          en: 'To acquire commercial rights, commission tailored design systems, or discuss publication features: ivan.selivanov.design@gmail.com.'
        }
      }
    ]
  },
  announcementBanner: {
    enabled: false,
    badge: {
      ua: 'СТАТУС // 2025',
      en: 'STATUS // 2025'
    },
    text: {
      ua: 'Доступний для нових викликів, дизайн-систем та артдирекшну',
      en: 'Available for design systems, senior product architecture & art direction'
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

