import { Project, ExperienceItem, Testimonial, GeneralSettings } from '../types';

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
    ua: 'Проєктую складні цифрові екосистеми, масштабовані дизайн-системи та виразні візуальні концепції на перетині швейцарської типографіки та продуктової логіки.',
    en: 'Architecting complex digital ecosystems, scalable design systems, and expressive visual concepts at the intersection of Swiss typography and product logic.'
  },
  location: {
    ua: 'Львів, Україна (Доступний по всьому світу)',
    en: 'Lviv, Ukraine (Available Worldwide)'
  },
  email: 'ivan.selivanov.design@gmail.com',
  telegram: 'https://t.me/ivanselivanov',
  linkedin: 'https://linkedin.com/in/ivanselivanov',
  behance: 'https://behance.net/ivanselivanov',
  github: 'https://github.com/ivanselivanov',
  heroImage: 'https://drive.google.com/uc?export=download&id=1jCDr21Fo4A_b8X4sIWeQHhOLG2LcJJnq',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbzWBH_tyMHYUEeaRM1u91hS1TWTKiQm3F2H6eFfQNN9oUBIKfbwZnF36kFERfZ9D1gLhA/exec',
  googleSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  lastSyncedAt: 'Live Google Sheets Connected'
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
    company: 'Monolith Design Labs',
    location: 'Kyiv / Remote',
    position: {
      ua: 'Lead UI/UX Architect & Art Director',
      en: 'Lead UI/UX Architect & Art Director'
    },
    startDate: '2023',
    endDate: 'Зараз',
    isCurrent: true,
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
    company: 'Apex Digital Systems',
    location: 'Kyiv',
    position: {
      ua: 'Senior Product Designer',
      en: 'Senior Product Designer'
    },
    startDate: '2021',
    endDate: '2023',
    isCurrent: false,
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
    company: 'Kyiv National Academy of Media Arts (KAMA)',
    location: 'Kyiv',
    position: {
      ua: 'Art Direction & Digital Design Honors',
      en: 'Art Direction & Digital Design Honors'
    },
    startDate: '2019',
    endDate: '2021',
    isCurrent: false,
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
