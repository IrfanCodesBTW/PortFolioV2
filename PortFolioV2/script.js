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
  { label: 'Python',         icon: '🐍' },
  { label: 'HTML / CSS',     icon: '🎨' },
  { label: 'JavaScript',     icon: '⚡' },
  { label: 'Bootstrap',      icon: '🅱' },
  { label: 'Flask',          icon: '🌶' },
  { label: 'OpenCV',         icon: '👁' },
  { label: 'AI / ML',        icon: '🤖' },
  { label: 'Git & GitHub',   icon: '🔀' },
  { label: 'REST APIs',      icon: '🔌' },
  { label: 'Web Design',     icon: '✏️' },
];

const PROJECTS = [
  {
    title:       'Sneaker E-Commerce',
    description: 'A front-end storefront for browsing sneakers with a clean product grid, cart interactions, and a responsive layout built without any framework.',
    stack:       ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    live:        null,
    repo:        null,
  },
  {
    title:       'Developer Portfolio',
    description: 'This very site — a personal portfolio showcasing projects and skills, rebuilt from scratch with a modern dark theme, CSS variables, and zero dependencies.',
    stack:       ['HTML', 'CSS', 'Vanilla JS'],
    live:        null,
    repo:        null,
  },
  {
    title:       'Currency Converter',
    description: 'A Flask web app that fetches real-time exchange rates from an external API and converts between currencies with a clean, minimal interface.',
    stack:       ['Python', 'Flask', 'REST API', 'HTML/CSS'],
    live:        null,
    repo:        null,
  },
];

const CONTACT_LINKS = [
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/in/shaik-irfan-basha-b73abb325/',
    icon:  /* LinkedIn SVG */ `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/rex_af0/',
    icon:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  },
  {
    label: 'Email',
    href:  'mailto:91infocus@gmail.com',
    icon:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>`,
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
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const allNavLinks  = document.querySelectorAll('.nav-link');

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
