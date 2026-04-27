/**
 * script.js — Portfolio dynamic layer
 *
 * Structure:
 *  1. DATA  — single source of truth for all content
 *  2. RENDER — pure functions that build DOM from data
 *  3. NAV    — scroll-aware navbar + mobile drawer
 *  4. REVEAL — IntersectionObserver for scroll animations
 *  5. INIT   — wire everything together on DOMContentLoaded
 */

/* ─────────────────────────────────────────────
   1. DATA
   Edit here to update site content—no HTML needed.
───────────────────────────────────────────── */

const SKILLS = [
  { label: 'Python', icon: '🐍' },
  { label: 'JavaScript', icon: '⚡' },
  { label: 'TypeScript', icon: '🔷' },
  { label: 'Next.js', icon: '▲' },
  { label: 'HTML / CSS', icon: '🎨' },
  { label: 'Flask', icon: '🌶' },
  { label: 'OpenCV', icon: '👁' },
  { label: 'AI / ML', icon: '🤖' },
  { label: 'Docker', icon: '🐳' },
  { label: 'Git & GitHub', icon: '🔀' },
  { label: 'REST APIs', icon: '🔌' },
];

const PROJECTS = [
  {
    title: 'RootSight',
    description: 'An AI-powered incident responder that automates cognitive tasks for engineers. It reconstructs timelines, generates root-cause hypotheses, and drafts follow-up actions in under 3 minutes.',
    stack: ['Python', 'TypeScript', 'Next.js', 'Node.js'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/RootSight',
  },
  {
    title: 'MiraiAI',
    description: 'A visually stunning studio for generating cinematic images and dynamic motion videos from prompts. Features a modern UI with GSAP animations and seamless creative workflows.',
    stack: ['HTML5', 'CSS3', 'GSAP', 'Python', 'Flask'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/MiraiAI',
  },
  {
    title: 'RailCascade',
    description: 'A deterministic railway simulation environment for modeling traffic management under track conflicts and cascading delays. Built for training AI agents in railway coordination.',
    stack: ['Python', 'Docker', 'OpenEnv'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/RailCascade',
  },
  {
    title: 'SmartFlow (Traffic Optimizer)',
    description: 'An intelligent traffic control dashboard for real-time monitoring and visualization. Features algorithmic lane ranking, emergency overrides, and intersection optimization.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Simulation'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/Traffic-Optimizer',
  },
  {
    title: 'EduTrack Pro',
    description: 'AI-powered Chrome extension that logs into ERPs to detect upcoming academic tasks. Syncs with Notion and uses AI to provide study plans and resolve scheduling conflicts.',
    stack: ['JavaScript', 'Chrome Extension', 'Notion API', 'AI'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/EduTrackProV1',
  },
  {
    title: 'FocusSense AI',
    description: 'Real-time focus and emotion tracker using webcam input. Features a comprehensive dashboard to visualize session trends, productivity levels, and emotion distribution.',
    stack: ['Python', 'OpenCV', 'DeepFace', 'Pandas'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/FocusSenseAI',
  },
  {
    title: '10KICKS — Premium Sneaker Catalogue',
    description: 'A premium sneaker catalogue featuring a sleek glassmorphism UI. Includes smooth animations for browsing, cart management, and a modern checkout flow.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/10kicks',
  },
  {
    title: 'Real-time Face Recognition',
    description: 'A comprehensive face detection and identification system using webcam input. Employs Haar cascade classifiers for live recognition and data collection.',
    stack: ['Python', 'OpenCV'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/face-detector',
  },
  {
    title: 'Currency Converter',
    description: 'A Flask web app that fetches real-time exchange rates from an external API and converts between currencies with a clean, minimal interface.',
    stack: ['Python', 'Flask', 'REST API', 'HTML/CSS'],
    live: null,
    repo: null,
  },
  {
    title: 'Developer Portfolio',
    description: 'The very site you are viewing — a modern, data-driven portfolio showcasing projects and skills with zero dependencies and a premium dark aesthetic.',
    stack: ['HTML5', 'CSS3', 'Vanilla JS'],
    live: null,
    repo: 'https://github.com/IrfanCodesBTW/PortFolioV2',
  },
];

const CONTACT_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/IrfanCodesBTW',
    icon:  /* GitHub SVG */ `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" id="github"><path fill="#b2b1ff" d="M8.854 21.57a9.91 9.91 0 0 0 6.29.001.493.493 0 0 1-.644-.475c0-.338.013-1.413.013-2.75a2.368 2.368 0 0 0-.675-1.85c2.225-.25 4.562-1.1 4.562-4.938a3.87 3.87 0 0 0-1.025-2.687 3.594 3.594 0 0 0-.1-2.65s-.838-.275-2.75 1.025a9.427 9.427 0 0 0-5 0C7.612 5.958 6.775 6.22 6.775 6.22a3.593 3.593 0 0 0-.1 2.65 3.892 3.892 0 0 0-1.025 2.687c0 3.825 2.325 4.688 4.55 4.938-.368.354-.594.829-.638 1.337a2.137 2.137 0 0 1-2.91-.82l-.002-.005a2.001 2.001 0 0 0-1.538-1.025c-.837.013-.337.475.013.663.451.38.803.865 1.025 1.412.2.563.85 1.638 3.362 1.175 0 .838.013 1.625.013 1.863 0 .259-.185.551-.67.475z"></path><path fill="#6563ff" d="M12 2.083c-5.523 0-10 4.477-10 10 0 4.423 2.875 8.169 6.855 9.488.485.075.67-.216.67-.475 0-.238-.012-1.025-.012-1.863-2.513.463-3.163-.612-3.363-1.175a3.637 3.637 0 0 0-1.025-1.412c-.35-.188-.85-.65-.013-.663.65.07 1.223.453 1.538 1.025l.003.006a2.137 2.137 0 0 0 2.91.82c.043-.51.27-.984.637-1.338-2.225-.25-4.55-1.113-4.55-4.938a3.892 3.892 0 0 1 1.025-2.687 3.594 3.594 0 0 1 .1-2.65s.837-.263 2.75 1.025a9.427 9.427 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025.37.838.406 1.786.1 2.65a3.87 3.87 0 0 1 1.025 2.687c0 3.838-2.338 4.688-4.562 4.938.482.49.729 1.164.675 1.85 0 1.337-.013 2.412-.013 2.75a.493.493 0 0 0 .643.476C19.124 20.253 22 16.507 22 12.083c0-5.523-4.477-10-10-10z"></path></svg>`,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shaik-irfan-basha-b73abb325/',
    icon:  /* LinkedIn SVG */ `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rex_af0/',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  },
  {
    label: 'Email',
    href: 'mailto:91infocus@gmail.com',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>`,
  },
];



/* ─────────────────────────────────────────────
   2. RENDER
   Pure functions — each returns a DOM element.
───────────────────────────────────────────── */

/**
 * Build a skill chip element.
 * The `reveal` animation is triggered by the IntersectionObserver later.
 */
function buildSkillChip({ label, icon }, index) {
  const chip = document.createElement('span');
  chip.className = 'skill-chip reveal';
  // Stagger chips with a delay proportional to their position
  chip.style.transitionDelay = `${index * 40}ms`;
  chip.innerHTML = `<span class="skill-chip-icon" aria-hidden="true">${icon}</span>${label}`;
  return chip;
}

/**
 * Build a project card element.
 * Cards show: index number, title, description, stack tags, and optional links.
 */
function buildProjectCard(project, index) {
  const card = document.createElement('article');
  card.className = 'project-card reveal';
  card.style.transitionDelay = `${index * 80}ms`;

  const tagsHTML = project.stack
    .map(t => `<span class="project-tag">${t}</span>`)
    .join('');

  // Only render links section if there's at least one URL
  const hasLinks = project.live || project.repo;
  const linksHTML = hasLinks ? `
    <div class="project-links">
      ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="project-link">↗ Live</a>` : ''}
      ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noopener" class="project-link">⟨⟩ Code</a>` : ''}
    </div>` : '';

  card.innerHTML = `
    <p class="project-number">0${index + 1}</p>
    <h3 class="project-name">${project.title}</h3>
    <p class="project-desc">${project.description}</p>
    <div class="project-tags">${tagsHTML}</div>
    ${linksHTML}
  `;
  return card;
}

/**
 * Build a contact link element.
 */
function buildContactItem({ label, href, icon }) {
  const a = document.createElement('a');
  a.className = 'contact-item reveal';
  a.href = href;
  if (!href.startsWith('mailto:')) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.innerHTML = `${icon}<span>${label}</span>`;
  return a;
}


/* ─────────────────────────────────────────────
   3. NAV — scroll + mobile drawer
───────────────────────────────────────────── */

function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Create overlay element for the drawer backdrop
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  document.body.appendChild(overlay);

  /* ── Scrolled class for navbar backdrop ── */
  const updateNavbarOnScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
  updateNavbarOnScroll(); // run once on load

  /* ── Active link highlighting ──
     Uses IntersectionObserver on each section; whichever section
     occupies most of the viewport wins the "active" class. */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Mobile drawer toggle ── */
  const openDrawer = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    overlay.style.display = 'block';
    // Next tick so CSS transition fires
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden'; // prevent body scroll
  };

  const closeDrawer = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    overlay.classList.remove('open');
    overlay.addEventListener('transitionend', () => { overlay.style.display = ''; }, { once: true });
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  // Close drawer when a mobile nav link is tapped
  mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}


/* ─────────────────────────────────────────────
   4. REVEAL — IntersectionObserver scroll animations
   Any element with class "reveal" fades in when
   it enters the viewport.
───────────────────────────────────────────── */

function initScrollReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal — no need to track it further
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,           // trigger when 15% visible
    rootMargin: '0px 0px -40px 0px'  // slightly before it fully enters
  });

  // Observe all current .reveal elements (more may be added during render)
  const observe = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      revealObserver.observe(el);
    });
  };

  // Initial pass; called again after dynamic content is rendered
  return observe;
}


/* ─────────────────────────────────────────────
   5. INIT
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Set footer year dynamically ── */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* ── Render skills ── */
  const skillsGrid = document.getElementById('skillsGrid');
  SKILLS.forEach((skill, i) => skillsGrid.appendChild(buildSkillChip(skill, i)));

  /* ── Render projects ── */
  const projectsGrid = document.getElementById('projectsGrid');
  PROJECTS.forEach((project, i) => projectsGrid.appendChild(buildProjectCard(project, i)));

  /* ── Render contact links ── */
  const contactLinks = document.getElementById('contactLinks');
  CONTACT_LINKS.forEach(item => contactLinks.appendChild(buildContactItem(item)));

  /* ── Hero entrance animation ──
     Trigger by adding .visible after a short delay so the
     browser has painted and transitions fire correctly. */
  const heroEls = document.querySelectorAll('.hero-name, .hero-tagline, .hero-bio, .hero-cta');
  setTimeout(() => heroEls.forEach(el => el.classList.add('visible')), 100);

  /* ── Scroll reveal ── */
  const observeRevealElements = initScrollReveal();
  // Observe once after all dynamic content is rendered
  observeRevealElements();

  /* ── Navbar ── */
  initNav();

});
