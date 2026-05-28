/* =========================================================
   Hamza Memon — Portfolio script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 60 });

  initNav();
  initSpotlight();
  initScrollProgress();
  initYear();
  initProjects();
  initCounters();
  initSkillBars();
  initTilt();
  initContactForm();
});

/* ---------- Contact form (FormSubmit.co — works on any static host) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  const setBusy = (btn, busy, originalHTML) => {
    if (!btn) return;
    btn.disabled = busy;
    btn.innerHTML = busy
      ? '<span>Sending…</span> <i class="fa-solid fa-spinner fa-spin"></i>'
      : originalHTML;
  };

  const buildMailto = (formData) => {
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const type = formData.get('project_type') || '';
    const message = formData.get('message') || '';
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject type: ${type}\n\n${message}`
    );
    return `mailto:hamza.memon262830@gmail.com?subject=${subject}&body=${body}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.form-submit');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';
    setBusy(submitBtn, true, originalHTML);

    const formData = new FormData(form);
    // Honeypot — if bot fills it, silently no-op
    if (formData.get('bot-field')) {
      setBusy(submitBtn, false, originalHTML);
      form.hidden = true;
      success.hidden = false;
      return;
    }

    const payload = Object.fromEntries(formData);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Form service responded ' + res.status);
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      // Fallback: open the user's email client with everything pre-filled
      console.warn('Form POST failed, falling back to mailto:', err);
      window.location.href = buildMailto(formData);
      // Still show success state after a beat so the UX completes
      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
      }, 600);
    } finally {
      setBusy(submitBtn, false, originalHTML);
    }
  });
}

/* ---------- 3D tilt on cards ---------- */
function initTilt() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  if (reduce || touch) return;
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) {
      document.querySelectorAll('.project-card.tilt-active').forEach(c => {
        c.classList.remove('tilt-active');
        c.style.removeProperty('--rx');
        c.style.removeProperty('--ry');
        c.style.removeProperty('--mx');
        c.style.removeProperty('--my');
      });
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 8;
    const ry = (x - 0.5) * 10;
    card.classList.add('tilt-active');
    card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  });
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.project-card.tilt-active').forEach(c => {
      c.classList.remove('tilt-active');
    });
  });
}

/* ---------- Nav ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------- Spotlight ---------- */
function initSpotlight() {
  const sp = document.getElementById('spotlight');
  if (!sp) return;
  window.addEventListener('mousemove', e => {
    sp.style.left = e.clientX + 'px';
    sp.style.top = e.clientY + 'px';
    sp.style.opacity = '1';
  });
}

/* ---------- Scroll progress ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Year ---------- */
function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count || '0', 10);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => io.observe(c));
}

/* ---------- Skill bars ---------- */
function initSkillBars() {
  const fills = document.querySelectorAll('.bar-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
}

/* =========================================================
   Project data
   ========================================================= */
const projectsData = [
  // -------- Live SaaS landing pages --------
  {
    key: 'nexusai',
    title: 'NexusAI — AI Platform Landing',
    category: 'live',
    featured: true,
    live: 'https://nexusai-hamza.netlify.app/',
    icon: 'fa-solid fa-brain',
    images: ['images/Projects/nexusai/1.png', 'images/Projects/nexusai/2.png'],
    desc: 'A live, production-deployed landing page for an AI platform brand. Modern dark UI, animated hero, feature sections, pricing, and conversion-focused CTAs. Built mobile-first with smooth scroll animations.',
    features: [
      'Fully responsive modern dark theme with animated hero',
      'Conversion-focused pricing & feature sections',
      'SEO-optimized semantic HTML structure',
      'Deployed live on Netlify with CDN caching',
      'Smooth scroll animations & micro-interactions'
    ],
    tags: [['Live', 'tag-multitenant'], ['HTML', 'tag-html'], ['CSS', 'tag-html'], ['JavaScript', 'tag-js'], ['Netlify', 'tag-netlify']]
  },
  {
    key: 'stockflow',
    title: 'StockFlow AI — Inventory SaaS Landing',
    category: 'live',
    featured: true,
    live: 'https://stockflow-ai-hamza.netlify.app/',
    icon: 'fa-solid fa-boxes-stacked',
    images: ['images/Projects/stockflow/1.png', 'images/Projects/stockflow/2.png'],
    desc: 'Live marketing site for an AI-powered inventory & stock management SaaS. Showcases product features, pricing tiers, and customer benefits with a clean conversion-driven layout.',
    features: [
      'Hero with animated product demo & USP highlights',
      'Feature blocks for AI-powered stock predictions',
      'Pricing tiers with comparison table',
      'Customer testimonials & social proof sections',
      'Deployed on Netlify with automatic HTTPS'
    ],
    tags: [['Live', 'tag-multitenant'], ['HTML', 'tag-html'], ['CSS', 'tag-html'], ['JavaScript', 'tag-js'], ['Netlify', 'tag-netlify']]
  },
  {
    key: 'noor',
    title: 'Noor Platform — SaaS Landing',
    category: 'live',
    live: 'https://noor-platform.netlify.app/',
    icon: 'fa-regular fa-sun',
    images: ['images/Projects/noor/1.png', 'images/Projects/noor/2.png'],
    desc: 'Live SaaS landing page for the Noor Platform — clean, professional, and conversion-optimized. Focuses on premium typography, well-paced sections, and strong call-to-action funnel.',
    features: [
      'Premium typography and clean visual hierarchy',
      'Hero, features, testimonials and pricing sections',
      'Mobile-first responsive layout',
      'Form-driven lead capture section',
      'Deployed live on Netlify'
    ],
    tags: [['Live', 'tag-multitenant'], ['HTML', 'tag-html'], ['CSS', 'tag-html'], ['JavaScript', 'tag-js'], ['Netlify', 'tag-netlify']]
  },

  // -------- Full-stack enterprise apps --------
  {
    key: 'martpos',
    title: 'Mart POS — Multi-Tenant Retail Suite',
    category: 'fullstack',
    featured: true,
    icon: 'fa-solid fa-cash-register',
    images: ['images/Projects/martpos/1.png', 'images/Projects/martpos/2.png', 'images/Projects/martpos/3.png'],
    desc: 'A complete multi-tenant Point-of-Sale platform for retail marts. Includes inventory, accounting, sales, purchase, returns, supplier management, and rich reporting. Built with .NET API + Angular UI + Playwright e2e coverage.',
    features: [
      'Multi-tenant architecture with isolated tenant data',
      'Full accounting integration (ledger, journal, trial balance)',
      'Inventory, purchase, sales & return workflows',
      'Role-based access control and audit logging',
      'Playwright end-to-end test coverage',
      'Modern Angular UI with PrimeNG components'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql'], ['Multi-Tenant', 'tag-multitenant']]
  },
  {
    key: 'estatepro',
    title: 'EstatePro — Real Estate Agency System',
    category: 'fullstack',
    featured: true,
    icon: 'fa-solid fa-building',
    images: ['images/Projects/estatepro/1.png', 'images/Projects/estatepro/2.png', 'images/Projects/estatepro/3.png', 'images/Projects/estatepro/4.png'],
    desc: 'End-to-end real estate management platform covering properties, clients, agents, listings, collection registers, and financial reports. Multi-phase enterprise build with deep gap analysis and Playwright e2e validation.',
    features: [
      'Property & listing management with media uploads',
      'Client and agent CRM workflows',
      'Collection register and receipt generation',
      'Detailed financial and operational reports',
      'Phase-based delivery with full QA cycles',
      'Playwright automated test suite'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql']]
  },
  {
    key: 'clinic',
    title: 'Clinic Management System',
    category: 'fullstack',
    mobile: true,
    icon: 'fa-solid fa-stethoscope',
    images: ['images/Projects/clinic/1.png', 'images/Projects/clinic/2.png', 'images/Projects/clinic/3.png', 'images/Projects/clinic/4.png'],
    desc: 'Full clinic & healthcare management suite built using Clean Architecture — separate Core, Infrastructure, API, Web, and Mobile projects. Manages patients, appointments, prescriptions, billing, and pharmacy.',
    features: [
      'Clean Architecture (.Core / .Infrastructure / .API / .Web / .Mobile)',
      'Patient registration, appointments, and visit history',
      'Prescription, lab, and pharmacy modules',
      'Billing, invoicing, and insurance workflows',
      'Mobile companion app for on-the-go staff',
      'Live deployment via ngrok for client demos'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql']]
  },
  {
    key: 'sms',
    title: 'School Management System',
    category: 'fullstack',
    featured: true,
    live: 'https://schoolms-hamza.netlify.app/',
    icon: 'fa-solid fa-graduation-cap',
    images: [
      'images/Projects/sms/1.png', 'images/Projects/sms/2.png', 'images/Projects/sms/3.png',
      'images/Projects/sms/4.png', 'images/Projects/sms/5.png', 'images/Projects/sms/6.png',
      'images/Projects/sms/7.png', 'images/Projects/sms/8.png', 'images/Projects/sms/9.png',
      'images/Projects/sms/10.png'
    ],
    desc: 'Comprehensive School Management Suite (WAREERA) covering students, staff, attendance, fees, exams, timetables, and parent portals. Iteratively built with master prompts, gap analysis, and complete system flow specifications.',
    features: [
      'Student admission, profiles, and academic records',
      'Attendance, fees, and exam result management',
      'Staff and payroll management modules',
      'Timetable, class, and section assignment',
      'Parent portal with notifications and reports',
      'Full system blueprint and visual flow specification'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql']]
  },
  {
    key: 'accountingsystem',
    title: 'Business Manager — Orders, Inventory & Accounting',
    category: 'fullstack',
    featured: true,
    icon: 'fa-solid fa-chart-line',
    images: [
      'images/Projects/accountingsystem/1.png', 'images/Projects/accountingsystem/2.png',
      'images/Projects/accountingsystem/3.png', 'images/Projects/accountingsystem/4.png',
      'images/Projects/accountingsystem/5.png', 'images/Projects/accountingsystem/6.png',
      'images/Projects/accountingsystem/7.png', 'images/Projects/accountingsystem/8.png',
      'images/Projects/accountingsystem/9.png', 'images/Projects/accountingsystem/10.png'
    ],
    desc: 'A full-stack Business Manager platform that unifies orders, suppliers, products, stock, expenses, payments and accounting in one place. Clean SaaS-style dashboard with KPI cards, shipment/payment status charts, and revenue analytics — backed by a documented .NET AccountingAPI (Swagger / OpenAPI 3.0) and a responsive Angular UI on SQL Server.',
    features: [
      'Dashboard with KPIs: orders, revenue, net profit, cash balance, stock value',
      'Shipment & payment status donut charts + revenue/profit bars',
      'Full order lifecycle: create, track, fulfil, return',
      'Suppliers, Products, Stock Purchases & live Stock Levels',
      'Expenses & Payments modules with category breakdown',
      'Documented REST API via Swagger UI (OpenAPI 3.0)',
      'Admin reset-data endpoint for safe demo seeding',
      'Responsive Angular front-end with collapsible side nav'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql'], ['REST API', 'tag-azure']]
  },
  {
    key: 'eyeoptical',
    title: 'Optical Store Management',
    category: 'fullstack',
    icon: 'fa-regular fa-eye',
    images: ['images/Projects/eyeoptical/1.png', 'images/Projects/eyeoptical/2.png', 'images/Projects/eyeoptical/3.png', 'images/Projects/eyeoptical/4.png'],
    desc: 'A specialized management platform for optical stores — covers prescriptions, frames inventory, lenses, sales, customer history, and admin reporting. Separate customer & admin Angular front-ends.',
    features: [
      'Prescription capture and customer eye-history tracking',
      'Frames, lenses, and accessory inventory modules',
      'Sales, invoices, and returns workflow',
      'Dedicated Angular admin panel',
      'API-first architecture for future mobile expansion'
    ],
    tags: [['.NET Core', 'tag-net'], ['Angular', 'tag-angular'], ['SQL Server', 'tag-sql']]
  },
  {
    key: 'damcloth',
    title: 'DAM-Cloth — Cloth Manufacturing Suite',
    category: 'fullstack',
    icon: 'fa-solid fa-shirt',
    images: ['images/Projects/damcloth/1.png', 'images/Projects/damcloth/2.png', 'images/Projects/damcloth/3.png', 'images/Projects/damcloth/4.png'],
    desc: 'Manufacturing & distribution suite tailored for the cloth/textile industry — designed for fabric inventory, production runs, dyeing, dispatch, and ledger management. Includes UI/UX-focused refinement passes.',
    features: [
      'Fabric inventory and production tracking',
      'Dyeing and finishing job workflows',
      'Dispatch, sales and ledger modules',
      'Iterative UI/UX improvement plan',
      'Database-backed with full migration scripts'
    ],
    tags: [['.NET Core', 'tag-net'], ['SQL Server', 'tag-sql']]
  },

  // -------- Desktop / POS / WinForms --------
  {
    key: 'restaurant',
    title: 'Burger Bache — Restaurant POS and Inventory',
    category: 'desktop',
    icon: 'fa-solid fa-burger',
    images: ['images/Projects/restaurant/1.png', 'images/Projects/restaurant/2.png', 'images/Projects/restaurant/3.png'],
    desc: 'Full restaurant management system for Burger Bache — touch-friendly POS with visual menu, stock-in/out tracking, sale history with date filters, and printable sale reports. Built with C# WinForms on SQL Server.',
    features: [
      'Visual touch POS with product images by category',
      'Sale history with date-range filter and totals',
      'Stock-in entry and stock-in history',
      'Manage Products / Manage Customer modules',
      'Print Report for daily / monthly sales',
      'Multi-user with admin role and dashboard analytics'
    ],
    tags: [['C# WinForms', 'tag-winforms'], ['SQL Server', 'tag-sql']]
  },
  {
    key: 'inventorymanagement',
    title: 'Inventory Management & Trader POS',
    category: 'desktop',
    icon: 'fa-solid fa-warehouse',
    images: ['images/Projects/inventorymanagement/1.png', 'images/Projects/inventorymanagement/2.png', 'images/Projects/inventorymanagement/3.png'],
    desc: 'Complete desktop POS and inventory system for a wholesale trader (Faisal Javed Traders) — Bill Book for sale/purchase invoicing, Cash Book with dual receipt/payment sides, customer ledgers, product master, and end-of-day reports. Built with C# WinForms + SQL Server, with migration utilities and a flexible product schema.',
    features: [
      'Bill Book — sale and purchase invoicing per product',
      'Cash Book with receipt and payment sides + running balance',
      'Customer ledger with opening/closing balances',
      'Product master with code, price, and live stock',
      'Stock movement logging (in / out / adjustment)',
      'Low-stock alerts and reorder thresholds',
      'Per-counter login and role-based access'
    ],
    tags: [['C# WinForms', 'tag-winforms'], ['SQL Server', 'tag-sql']]
  },

  // -------- Landing pages --------
  {
    key: 'delgatruck',
    title: 'Delga Truck — Shopify Storefront',
    category: 'landing',
    icon: 'fa-solid fa-truck',
    images: ['images/Projects/delgatruck/1.png', 'images/Projects/delgatruck/2.png'],
    desc: 'Custom Shopify theme + client storefront for Delga Truck. Includes a packaged theme, custom client integrations, and an audit pipeline to validate the storefront before deployment.',
    features: [
      'Custom Shopify Liquid theme & sections',
      'Packaged theme zip ready for upload',
      'Client-side custom integrations',
      'Audit script for storefront validation',
      'Asset and screenshot library'
    ],
    tags: [['Shopify', 'tag-shopify'], ['HTML', 'tag-html'], ['CSS', 'tag-html'], ['JavaScript', 'tag-js']]
  },

  // -------- AI / Automation --------
  {
    key: 'trendflow',
    title: 'TrendFlow — Multi-Channel AI YouTube Automation',
    category: 'ai',
    featured: true,
    icon: 'fa-brands fa-youtube',
    images: [
      'images/Projects/trendflow/1.png', 'images/Projects/trendflow/2.png',
      'images/Projects/trendflow/3.png', 'images/Projects/trendflow/4.png',
      'images/Projects/trendflow/5.png', 'images/Projects/trendflow/6.png',
      'images/Projects/trendflow/7.png', 'images/Projects/trendflow/8.png'
    ],
    desc: 'A complete end-to-end Python automation platform that runs 5+ YouTube channels in parallel — researches trends, generates AI scripts, synthesises voiceovers, builds videos from stock clips, and uploads automatically on a schedule. Full pipeline orchestration with multi-account, multi-channel support.',
    features: [
      'Multi-channel parallel pipeline (5+ YouTube channels)',
      'Trend research → AI script → TTS → video assembly → upload',
      'Per-channel config: topic, voice, language, quality, schedule',
      'Cross-session resume with pipeline checkpoints',
      'Dry-run mode for safe content review',
      'Schedule manager with timezone-aware cron',
      'Built-in asset browser and content preview'
    ],
    tags: [['Python', 'tag-python'], ['AI / LLM', 'tag-ai'], ['Automation', 'tag-ai']]
  },
  {
    key: 'leedshunter',
    title: 'Leeds Hunter — Facebook Lead Scanner',
    category: 'ai',
    icon: 'fa-brands fa-facebook',
    images: ['images/Projects/leedshunter/1.png', 'images/Projects/leedshunter/2.png', 'images/Projects/leedshunter/3.png', 'images/Projects/leedshunter/4.png'],
    desc: 'Targeted Facebook lead-scanner desktop app built in Python — scans groups and pages with configurable keyword/scoring rules, AI-classifies posts as real opportunities, and surfaces qualified leads in a clean dashboard for one-click follow-up.',
    features: [
      'Keyword-driven scanning of Facebook groups/pages',
      'AI scoring & classification of posts (intent + quality)',
      'Leads dashboard with filtering, search and bulk actions',
      'Mark Read / Favorite / Contacted workflow',
      'Configurable scan settings (time range, max posts, scroll speed)',
      'Anti-detection random delay built in',
      'Session-persistent scan history and exports'
    ],
    tags: [['Python', 'tag-python'], ['AI / LLM', 'tag-ai'], ['Automation', 'tag-ai']]
  }
];

/* =========================================================
   Render projects
   ========================================================= */
function initProjects() {
  const grid = document.getElementById('projectsGrid');
  const filters = document.querySelectorAll('.filter-btn');
  const showMore = document.getElementById('showMoreBtn');
  if (!grid) return;

  let currentFilter = 'all';
  let expanded = false;
  const INITIAL = 6;

  const render = () => {
    grid.innerHTML = '';

    const filtered = currentFilter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === currentFilter);

    const visibleCount = expanded ? filtered.length : Math.min(INITIAL, filtered.length);

    filtered.forEach((p, i) => {
      const card = document.createElement('article');
      let cls = 'project-card';
      if (i >= visibleCount) cls += ' hidden';
      if (p.mobile) cls += ' project-card--mobile';
      card.className = cls;
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String((i % 3) * 80));

      const firstImg = (p.images && p.images[0]) || '';
      const liveBadge = p.live
        ? `<span class="project-live-badge"><span class="live-dot"></span>Live</span>` : '';
      const featuredBadge = p.featured
        ? `<span class="project-featured-badge"><i class="fa-solid fa-star"></i>Featured</span>` : '';

      const tagsHtml = p.tags.map(([label, cls]) =>
        `<span class="tag ${cls}">${escapeAttr(label)}</span>`).join('');

      const placeholder = buildPlaceholderHtml(p);

      const backdrop = (firstImg && p.mobile)
        ? `<div class="media-backdrop" style="background-image:url('${escapeAttr(firstImg)}')"></div>`
        : '';

      const mediaHtml = firstImg
        ? `${backdrop}<img src="${escapeAttr(firstImg)}" alt="${escapeAttr(p.title)}" loading="lazy"
             onerror="this.parentElement.innerHTML=this.dataset.fb;"
             data-fb="${escapeAttr(placeholder)}">`
        : placeholder;

      const urlText = p.live
        ? p.live.replace(/^https?:\/\//, '').replace(/\/$/, '')
        : `${p.key}.local`;

      card.innerHTML = `
        <div class="project-frame">
          <div class="frame-chrome">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
            <span class="frame-url">${escapeAttr(urlText)}</span>
          </div>
          <div class="project-media">
            ${mediaHtml}
            <div class="project-badges">
              ${featuredBadge}
              ${liveBadge}
            </div>
            <div class="project-overlay">
              <span class="view-btn">
                <i class="fa-regular fa-eye"></i> View Project
              </span>
            </div>
          </div>
        </div>
        <div class="project-info">
          <h3>${escapeAttr(p.title)}</h3>
          <p>${escapeAttr(p.desc)}</p>
          <div class="project-tags">${tagsHtml}</div>
        </div>
      `;

      card.addEventListener('click', () => openModal(p));
      grid.appendChild(card);
    });

    if (filtered.length <= INITIAL || expanded) {
      showMore.style.display = filtered.length <= INITIAL ? 'none' : 'inline-flex';
    } else {
      showMore.style.display = 'inline-flex';
    }

    AOS.refresh();
  };

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      expanded = false;
      showMore.classList.remove('expanded');
      showMore.querySelector('span').textContent = 'Show More Projects';
      render();
    });
  });

  showMore?.addEventListener('click', () => {
    expanded = !expanded;
    showMore.classList.toggle('expanded', expanded);
    showMore.querySelector('span').textContent = expanded ? 'Show Less' : 'Show More Projects';
    render();
  });

  render();
}

/* =========================================================
   Project modal with image gallery
   ========================================================= */
let modalState = { project: null, index: 0 };

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPlaceholderHtml(p) {
  return `<div class="media-placeholder">
    <div class="placeholder-content">
      <div class="placeholder-icon"><i class="${p.icon}"></i></div>
      <div class="placeholder-title">${escapeAttr(p.title)}</div>
    </div>
  </div>`;
}

function openModal(p) {
  const modal = document.getElementById('projectModal');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');
  const tagsEl = document.getElementById('modalTags');
  const features = document.getElementById('modalFeatures');
  const actions = document.getElementById('modalActions');
  const stage = document.getElementById('galleryStage');
  const thumbs = document.getElementById('galleryThumbs');

  if (!modal || !stage || !thumbs) return;

  modal.classList.toggle('modal--mobile', !!p.mobile);
  modalState = { project: p, index: 0 };

  title.textContent = p.title;
  desc.textContent = p.desc;

  tagsEl.innerHTML = p.tags.map(([l, c]) => `<span class="tag ${c}">${l}</span>`).join('');
  features.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

  const acts = [];
  if (p.live) {
    acts.push(`<a href="${p.live}" target="_blank" rel="noopener" class="btn btn-primary">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Site
    </a>`);
  }
  acts.push(`<a href="https://github.com/HAMZA-MEMON-0" target="_blank" rel="noopener" class="btn btn-ghost">
    <i class="fa-brands fa-github"></i> View GitHub
  </a>`);
  actions.innerHTML = acts.join('');

  const setMain = (i) => {
    modalState.index = i;
    const src = p.images[i];
    const placeholderHtml = buildPlaceholderHtml(p);

    const backdrop = (src && p.mobile)
      ? `<div class="media-backdrop" style="background-image:url('${escapeAttr(src)}')"></div>`
      : '';

    // Always rebuild stage contents from scratch — never mutate detached nodes
    stage.innerHTML = src
      ? `${backdrop}<img src="${escapeAttr(src)}" alt="${escapeAttr(p.title)}"
          onerror="this.parentElement.innerHTML = this.dataset.fb;"
          data-fb="${escapeAttr(placeholderHtml)}">`
      : placeholderHtml;

    thumbs.querySelectorAll('img, .thumb-ph').forEach((t, ti) => {
      t.classList.toggle('active', ti === i);
    });
  };

  thumbs.innerHTML = p.images.map((src, i) => {
    if (!src) {
      return `<div class="thumb-ph media-placeholder" data-i="${i}"></div>`;
    }
    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(p.title)} ${i + 1}" data-i="${i}"
       onerror="this.outerHTML='<div class=\\'thumb-ph media-placeholder\\' data-i=&quot;${i}&quot;></div>';">`;
  }).join('');

  // Use event delegation so it works even after onerror replaces thumb img with div
  thumbs.onclick = (e) => {
    const t = e.target.closest('[data-i]');
    if (t) setMain(parseInt(t.dataset.i, 10));
  };

  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  const showNav = p.images.length > 1;
  if (prevBtn) prevBtn.style.display = showNav ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = showNav ? 'inline-flex' : 'none';

  setMain(0);

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeModal();
});

document.querySelector('.gallery-prev')?.addEventListener('click', () => {
  const p = modalState.project;
  if (!p) return;
  const next = (modalState.index - 1 + p.images.length) % p.images.length;
  document.querySelector(`.gallery-thumbs img[data-i="${next}"]`)?.click();
});

document.querySelector('.gallery-next')?.addEventListener('click', () => {
  const p = modalState.project;
  if (!p) return;
  const next = (modalState.index + 1) % p.images.length;
  document.querySelector(`.gallery-thumbs img[data-i="${next}"]`)?.click();
});

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('projectModal');
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') document.querySelector('.gallery-prev')?.click();
  if (e.key === 'ArrowRight') document.querySelector('.gallery-next')?.click();
});
