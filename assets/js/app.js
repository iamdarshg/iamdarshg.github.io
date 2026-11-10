/* ============================================================
   Darsh Gupta — portfolio app.js
   Theme, smooth scroll, live GitHub repo feed, project modal,
   scroll reveals, easter eggs.
   ============================================================ */

/* ---------------- theme ---------------- */
function initTheme() {
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-color-scheme', savedTheme);
}

function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/* ---------------- smooth scroll ---------------- */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------------- scroll reveal ---------------- */
function setupReveals() {
  const automaticTargets = document.querySelectorAll(
    'main > section:not(.hero):not(.launch-scene):not(.projects-hero):not(.flight-story):not(.project-film), .blog-section, .timeline-row, .paper-row, .track-card, .contact-method, .vision-box, .references-box'
  );
  automaticTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
  });
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

/* ---------------- hero offset ---------------- */
/* The hero is a sticky, full-viewport scene. Pull it up so its top edge
   meets the viewport instead of starting below the sticky header. */
function setupHeroOffset() {
  const scene = document.querySelector('.launch-scene');
  if (!scene) return;
  const root = document.documentElement;
  const apply = () => {
    root.style.setProperty('--hero-pull', '0px');
    if (window.matchMedia('(max-width: 980px)').matches) {
      root.style.removeProperty('--hero-pull');
      return;
    }
    const top = scene.getBoundingClientRect().top + window.scrollY;
    root.style.setProperty('--hero-pull', Math.max(0, Math.round(top)) + 'px');
  };
  apply();
  window.addEventListener('resize', apply);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(apply);
  }
}

/* ---------------- boot ---------------- */
window.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('is-loaded');
  initTheme();
  setupHeroOffset();
  setupSmoothScroll();
  setupReveals();
  setupScrollMotion();
  setupCardTilt();
  document.getElementById('year').textContent = new Date().getFullYear();
  setupEasterEggs();
  if (document.body.classList.contains('interests-page')) {
    setupInterestsScrollEffects();
  }
  if (window.location.pathname.includes('education')) {
    setupEducationScrollEffects();
  }
  if (window.location.pathname.includes('projects')) {
    loadAllRepositories();
  }
});
/* ---------------- surf-through motion ---------------- */
function setupScrollMotion() {
  const root = document.documentElement;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = motionPreference.matches;
  const launch = document.querySelector('.launch-scene');
  const story = document.querySelector('.flight-story');
  const film = document.querySelector('.project-film');
  const beats = [...document.querySelectorAll('.story-beat, .film-step')];
  let ticking = false;
  let lastScrollY = -1;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const update = () => {
    ticking = false;
    if (lastScrollY === window.scrollY && document.readyState === 'complete') return;
    lastScrollY = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty('--scroll-progress', `${(progress * 100).toFixed(2)}%`);

    if (reduce) {
      // Keep the narrative legible when motion is reduced; the page itself
      // remains scrollable and no content is hidden behind animated states.
      [launch, story, film].filter(Boolean).forEach(scene => {
        scene.querySelectorAll('.launch-object, .launch-copy--top, .launch-copy--bottom, .launch-stage-caption, .object-part, .flight-frame, .film-visual')
          .forEach(element => {
            const isCaption = element.classList.contains('launch-stage-caption');
            const showCaption = element.classList.contains('launch-stage-caption--one');
            element.style.opacity = isCaption ? (showCaption ? '1' : '0') : '';
            element.style.transform = '';
          });
      });
      beats.forEach(beat => { beat.style.opacity = '1'; });
      return;
    }

    if (launch && window.innerWidth <= 560) {
      const object = launch.querySelector('.launch-object');
      const topCopy = launch.querySelector('.launch-copy--top');
      if (object) { object.style.transform = 'translateX(-50%)'; object.style.opacity = '1'; }
      if (topCopy) { topCopy.style.transform = ''; topCopy.style.opacity = '1'; }
      launch.querySelectorAll('.object-part').forEach((part, index) => {
        part.style.transform = '';
        part.style.opacity = index === 0 ? '1' : '0';
      });
    } else if (launch) {
      const rect = launch.getBoundingClientRect();
      const span = Math.max(1, launch.offsetHeight - window.innerHeight);
      const t = clamp(-rect.top / span, 0, 1);
      const object = launch.querySelector('.launch-object');
      const parts = [...launch.querySelectorAll('.object-part')];
      const topCopy = launch.querySelector('.launch-copy--top');
      const bottomCopy = launch.querySelector('.launch-copy--bottom');
      const captions = [...launch.querySelectorAll('.launch-stage-caption')];
      const workLink = launch.querySelector('.launch-work-link');
      const ease = value => 1 - Math.pow(1 - value, 4);
      const phase = (start, end) => ease(clamp((t - start) / (end - start), 0, 1));
      if (object) {
        const approach = phase(0, .24);
        const assembly = phase(.24, .64);
        const evidence = phase(.64, .9);
        const x = 5 - approach * 5;
        const y = 7 - approach * 12;
        const scale = .88 + approach * .2;
        const rotate = -2 + approach * 2;
        object.style.transform = `translateX(calc(-50% + ${x}vw)) translateY(${y}vh) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
        object.style.opacity = String(.88 + approach * .12);
        if (parts.length >= 3) {
          parts[1].style.transform = `translate(${assembly * 9}%, ${-assembly * 8}%) rotate(${5 + assembly * 7}deg) scale(${(1 - assembly * .08).toFixed(3)})`;
          parts[1].style.opacity = String(assembly * (1 - evidence * .35));
          parts[2].style.transform = `translate(${-assembly * 10}%, ${assembly * 10}%) rotate(${-8 - assembly * 10}deg) scale(${(1 - assembly * .06).toFixed(3)})`;
          parts[2].style.opacity = String(assembly * .86);
        }
        launch.style.setProperty('--launch-progress', t.toFixed(4));
        launch.style.setProperty('--evidence-progress', evidence.toFixed(4));
      }
      if (topCopy) {
        const copyProgress = phase(.08, .4);
        topCopy.style.transform = `translateY(${-copyProgress * 8}vh)`;
        topCopy.style.opacity = String(1 - copyProgress * .45);
      }
      if (bottomCopy) {
        const bottomProgress = phase(.18, .5);
        bottomCopy.style.transform = `translateY(${bottomProgress * 22}px)`;
        bottomCopy.style.opacity = String(1 - bottomProgress);
      }
      if (workLink) {
        const linkProgress = phase(.16, .42);
        workLink.style.opacity = String(1 - linkProgress * .7);
        workLink.style.transform = `translateY(${-linkProgress * 6}px)`;
      }
      captions.forEach((caption, index) => {
        const ranges = [[.03, .24], [.27, .56], [.6, .86]][index] || [.03, .24];
        const enter = phase(ranges[0], ranges[0] + .08);
        const exit = phase(ranges[1] - .08, ranges[1]);
        caption.style.opacity = String(enter * (1 - exit));
        caption.style.transform = `translateY(${(1 - enter) * 18 - exit * 10}px)`;
      });
    }

    if (story) {
      const rect = story.getBoundingClientRect();
      const span = Math.max(1, story.offsetHeight - window.innerHeight);
      const t = clamp(-rect.top / span, 0, 1);
      const main = story.querySelector('.flight-frame--main');
      const detail = story.querySelector('.flight-frame--detail');
      if (main) {
        const stage = clamp(t * 1.2, 0, 1);
        main.style.transform = `translateY(${(18 - stage * 18).toFixed(1)}px) rotate(${(-7 + stage * 7).toFixed(2)}deg) scale(${(.72 + stage * .32).toFixed(3)})`;
        main.style.opacity = String(.35 + stage * .65);
      }
      if (detail) {
        const stage = clamp(t * 1.4, 0, 1);
        detail.style.transform = `translate(${(26 - stage * 26).toFixed(1)}%, ${(18 - stage * 18).toFixed(1)}%) rotate(${(14 - stage * 9).toFixed(2)}deg) scale(${(.48 + stage * .52).toFixed(3)})`;
        detail.style.opacity = String(.1 + stage * .9);
      }
    }

    if (film) {
      const rect = film.getBoundingClientRect();
      const span = Math.max(1, film.offsetHeight - window.innerHeight);
      const t = clamp(-rect.top / span, 0, 1);
      const visuals = [...film.querySelectorAll('.film-visual')];
      const count = Math.max(1, visuals.length - 1);
      visuals.forEach((visual, index) => {
        const focus = clamp(1 - Math.abs(t * count - index) * 1.15, 0, 1);
        visual.style.opacity = String(0.08 + focus * 0.92);
        visual.style.transform = `translateY(${((index - t * count) * 3).toFixed(1)}%) rotate(${([-5, 3, -2][index] ?? 0)}deg) scale(${(.84 + focus * .16).toFixed(3)})`;
        visual.style.zIndex = String(Math.round(focus * 10) + 1);
      });
    }

    beats.forEach((beat) => {
      const rect = beat.getBoundingClientRect();
      const focus = clamp(1 - Math.abs((rect.top + rect.height / 2) - window.innerHeight * .52) / (window.innerHeight * .48), 0, 1);
      beat.style.opacity = reduce ? '1' : String(.25 + focus * .75);
      beat.style.setProperty('--focus', focus.toFixed(3));
    });
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  motionPreference.addEventListener?.('change', event => {
    reduce = event.matches;
    requestUpdate();
  });
  requestUpdate();
}

function setupCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.project-card, .pipeline-card, .card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 1.8).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   LIVE GITHUB REPO FEED
   ============================================================ */

const GITHUB_USER = 'iamdarshg';

/* GitHub linguist colors — subset for this profile */
const langColors = {
  'Python': '#3572A5',
  'C++': '#f34b7d',
  'C': '#555555',
  'Verilog': '#b2b7f8',
  'Rust': '#dea584',
  'TypeScript': '#3178c6',
  'HTML': '#e34c26',
  'Kotlin': '#A97BFF',
  'Prolog': '#74283c',
  'AGS Script': '#B9D9FF',
  'JavaScript': '#f1e05a',
  'CSS': '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  'Shell': '#89e051',
  'TeX': '#3D6117'
};

function langColor(lang) {
  return langColors[lang] || '#8b949e';
}

/* The live repo index is typographic on purpose: this repository has no
   per-repository images, so mismatched lab shots are not used as decoration. */
const repoArtwork = {};

const fallbackRepoData = [
  { name: 'wing3d', description: 'Transonic small-disturbance (TSD) wing solver benchmark program — target: OpenFOAM-matched accuracy at 3-5x lower runtime.', language: 'Python', updated_at: '2026-10-28', html_url: 'https://github.com/iamdarshg/wing3d', archived: false },
  { name: 'copperline', description: 'Headless C++20 PCB autorouter for agents. CLI-only, JSON-first.', language: 'C++', updated_at: '2026-10-28', html_url: 'https://github.com/iamdarshg/copperline', archived: false },
  { name: 'aero-multiphysics-workbench', description: 'Local-first strongly coupled multiphysics engineering workbench.', language: 'Python', updated_at: '2026-09-25', html_url: 'https://github.com/iamdarshg/aero-multiphysics-workbench', archived: false },
  { name: 'Code-SDR', description: 'FPGA-based ultra-wideband software defined radio — hardware and software implementations.', language: 'Verilog', updated_at: '2026-09-19', html_url: 'https://github.com/iamdarshg/Code-SDR', archived: false },
  { name: 'esp-radar', description: 'Compact 2.4 GHz WiFi CSI motion radar — three fixed ESP32s (TX AP + fusion, two CSI RX stations).', language: 'Rust', updated_at: '2026-08-17', html_url: 'https://github.com/iamdarshg/esp-radar', archived: false },
  { name: 'rustymd', description: 'Ultra-lightweight native Windows Markdown viewer — raw Win32/GDI, ~15-40MB RAM, no Electron.', language: 'Rust', updated_at: '2026-07-21', html_url: 'https://github.com/iamdarshg/rustymd', archived: false },
  { name: 'research-paper', description: 'Hybrid diffusion networks applied to aircraft design optimization.', language: 'Python', updated_at: '2026-09-03', html_url: 'https://github.com/iamdarshg/research-paper', archived: false },
  { name: 'drone-v2', description: 'Newer hardware-software stack for a general purpose avionics control board.', language: 'AGS Script', updated_at: '2026-01-15', html_url: 'https://github.com/iamdarshg/drone-v2', archived: false }
];
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRepoArtwork(repoName) {
  return repoArtwork[repoName] || '';
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now - d) / 86400000);
  if (days < 1) return 'updated today';
  if (days < 7) return days + 'd ago';
  if (days < 30) return Math.floor(days / 7) + 'w ago';
  if (days < 365) return Math.floor(days / 30) + 'mo ago';
  return d.getFullYear();
}

function stripReadmeNoise(markdown) {
  return markdown
    .replace(/\r/g, '')
    .replace(/^---[\s\S]*?---\n+/m, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<picture[\s\S]*?<\/picture>/gi, '')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/^\s*\|.*\|\s*$/gm, '')
    .replace(/https?:\/\/[^\s)]+/g, '')
    .trim();
}

function cleanMarkdownLine(line) {
  return line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateSentence(text, maxLength = 180) {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('; '));
  const cutoff = lastStop > maxLength * 0.55 ? lastStop + 1 : slice.lastIndexOf(' ');
  return `${slice.slice(0, cutoff > 0 ? cutoff : maxLength).trim()}...`;
}

function extractReadmeSnapshot(markdown, fallbackDescription = '') {
  const cleaned = stripReadmeNoise(markdown);
  const lines = cleaned.split('\n').map(cleanMarkdownLine).filter(Boolean);
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map(block => cleanMarkdownLine(block.replace(/\n/g, ' ')))
    .filter(block => block.length > 35);
  const bulletLines = cleaned
    .split('\n')
    .filter(line => /^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line))
    .map(cleanMarkdownLine)
    .filter(line => line.length > 22)
    .slice(0, 3);

  const summarySource = paragraphs[0] || lines.find(line => line.length > 50) || fallbackDescription || 'Repository notes available on GitHub.';

  return {
    summary: truncateSentence(summarySource, 190),
    points: bulletLines.length
      ? bulletLines
      : paragraphs.slice(1, 3).map(point => truncateSentence(point, 110))
  };
}

function prepareReadmeForDisplay(markdown) {
  const cleaned = stripReadmeNoise(markdown)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned || 'README preview unavailable.';
}
/* ---------------- live repo feed ---------------- */
async function loadAllRepositories() {
  const repoContainer = document.getElementById('repo-feed');
  if (!repoContainer) return;

  repoContainer.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--faint);font-family:var(--font-mono);font-size:12px;">Loading live repository feed from GitHub…</p>';

  /* cached in session to dodge rate limits */
  const cached = sessionStorage.getItem('github_repos_cache');
  if (cached) {
    try {
      const results = JSON.parse(cached);
      renderRepos(results, repoContainer);
      return;
    } catch (e) {
      sessionStorage.removeItem('github_repos_cache');
    }
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = await res.json();

    /* filter out the portfolio repo itself and forks */
    const filtered = repos
      .filter(r => !r.fork)
      .filter(r => r.name !== 'iamdarshg.github.io')
      .slice(0, 24);

    const results = [];
    for (const repo of filtered) {
      results.push({ repo, readme: '' });
    }

    sessionStorage.setItem('github_repos_cache', JSON.stringify(results));
    renderRepos(results, repoContainer);

    /* fetch readmes in background, render again when ready */
    for (let i = 0; i < results.length; i++) {
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${results[i].repo.name}/readme`, {
          headers: { 'Accept': 'application/vnd.github.v3.raw' }
        });
        if (readmeRes.ok) {
          results[i].readme = await readmeRes.text();
          sessionStorage.setItem('github_repos_cache', JSON.stringify(results));
        }
      } catch (err) {
        /* keep going */
      }
      if (i === results.length - 1 || i % 4 === 3) renderRepos(results, repoContainer);
    }
  } catch (error) {
    console.error('Repo feed failed, using fallback:', error);
    renderRepos(fallbackRepoData.map(r => ({ repo: r, readme: '' })), repoContainer);
  }
}

function renderRepos(results, container) {
  if (!container) return;
  container.innerHTML = '';
  results.forEach(({ repo, readme }) => {
    const repoName = repo.name;
    const card = document.createElement('article');
    card.className = 'project-card repo-card';
    card.onclick = () => openProjectDetail(repoName);

    const snapshot = extractReadmeSnapshot(readme || '', repo.description || '');
    const previewPoints = snapshot.points
      .filter(Boolean)
      .slice(0, 2)
      .map(point => `<li>${escapeHtml(point)}</li>`)
      .join('');
    const statusClass = repo.archived ? 'badge-status--archived' : 'badge-status--active';
    const statusLabel = repo.archived ? 'Archived' : (repo.language || 'Repo');
    const color = langColor(repo.language);
    const updated = formatDate(repo.updated_at);

    const artwork = getRepoArtwork(repoName);
    const media = artwork
      ? `<figure class="repo-card-media"><img src="${escapeHtml(artwork)}" alt="${escapeHtml(repoName)} project artifact" loading="lazy" />
        <figcaption>
          <div>
            <strong>${escapeHtml(repoName)}</strong>
            <span style="display:block;margin-top:2px;">${escapeHtml(repo.description || '')}</span>
          </div>
          <span class="badge-status ${statusClass}">${escapeHtml(statusLabel)}</span>
        </figcaption>
      </figure>`
      : `<figure class="repo-card-media repo-card-media--empty">
        <div class="repo-art-note"><span>${escapeHtml(repo.language || 'CODE')}</span><strong>${escapeHtml(repoName)}</strong><small>${escapeHtml(repo.description || 'Repository on GitHub')}</small></div>
        <figcaption>
          <span class="badge-status ${statusClass}">${escapeHtml(statusLabel)}</span>
        </figcaption>
      </figure>`;

    card.innerHTML = `
      ${media}
      <div class="project-content compact-content">
        <div class="compact-header">
          <h4>${escapeHtml(repoName)}</h4>
        </div>
        <div class="project-meta">
          <span><span class="lang-dot" style="background:${color};"></span>${escapeHtml(repo.language || 'Docs')}</span>
          <span>★ ${repo.stargazers_count || 0}</span>
          <span>${updated}</span>
        </div>
        <div class="readme-preview">
          <span class="readme-kicker">README snapshot</span>
          <p class="readme-summary">${escapeHtml(snapshot.summary)}</p>
          ${previewPoints ? `<ul class="readme-points">${previewPoints}</ul>` : ''}
        </div>
        <div class="project-footer">
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">GitHub →</a>
            <span class="hint">Click card for details</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
/* ---------------- education / interests scroll effects ---------------- */
function setupEducationScrollEffects() {
  const items = document.querySelectorAll('.timeline-row');
  const observerOptions = { threshold: 0.5, rootMargin: "-10% 0% -10% 0%" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);
  items.forEach(item => observer.observe(item));
}

function setupInterestsScrollEffects() {
  const sections = document.querySelectorAll('.entry');
  const navLinks = document.querySelectorAll('.interests-nav a');
  const observerOptions = { threshold: 0.35 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);
  sections.forEach(section => observer.observe(section));
}
/* ============================================================
   PROJECT DETAIL MODAL
   ============================================================ */
const projectDetails = {
  'wing3d': {
    title: 'Wing3d: Transonic Small-Disturbance Solver',
    tag: 'Aerospace / CFD / Numerical Methods',
    status: 'Active Research',
    timeline: '2026 — ongoing benchmark program',
    github: 'https://github.com/iamdarshg/wing3d',
    overview: 'A transonic small-disturbance (TSD) solver program built to benchmark against OpenFOAM on (geometry, Mach) case pairs. The target is 3-5x faster than OpenFOAM at matched accuracy, with every result reported as a CL ± uncertainty band derived from the hyperparameter ensemble.',
    sections: [
      {
        title: 'Core Method',
        content: `
          <ul>
            <li><strong>TSD formulation:</strong> transonic small-disturbance equations for wing flows — the physics/code coupling that keeps solve times a fraction of full Navier-Stokes.</li>
            <li><strong>Benchmark philosophy:</strong> per-case speed target of 3-5x versus OpenFOAM at matched accuracy, measured on (geometry, Mach) pairs.</li>
            <li><strong>Uncertainty-bound reporting:</strong> CL reported as a band, not a point — the ensemble drives the claim.</li>
          </ul>
        `
      },
      {
        title: 'Hyperparameter Ensemble (UQ)',
        content: `
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-label">Grid family</div><div class="stat-value">80 / 120 / 140 / 160</div></div>
            <div class="stat-item"><div class="stat-label">Epochs</div><div class="stat-value">8 / 16 / 24</div></div>
            <div class="stat-item"><div class="stat-label">Supersonic mask</div><div class="stat-value">small / large</div></div>
            <div class="stat-item"><div class="stat-label">k-imprint</div><div class="stat-value">on / off</div></div>
          </div>
          <p style="margin-top:14px;">The envelope over these hyperparameters defines the reported uncertainty bound. Ablations from the commit audit populate a sensitivity table, and each measurement feeds the band.</p>
        `
      },
      {
        title: 'Honesty Rules',
        content: `
          <ul>
            <li>Physically unsupportable fixes that improve scores are logged as <strong>BAD BUT HELPS</strong> with measured cost — never silently kept.</li>
            <li>Anything whose removal lowers error is removed permanently.</li>
            <li>Accuracy claims are always relative to OpenFOAM uncertainty, ideally centered on truth.</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">Python</span>
            <span class="tech-badge">OpenFOAM (baseline)</span>
            <span class="tech-badge">Numerical PDE</span>
            <span class="tech-badge">Hyperparameter ensembles</span>
          </div>
        `
      }
    ]
  },
  'copperline': {
    title: 'Copperline: Headless PCB Autorouter for Agents',
    tag: 'C++20 / PCB / Tooling',
    status: 'Active Development',
    timeline: '2026 — ongoing',
    github: 'https://github.com/iamdarshg/copperline',
    overview: 'A headless C++20 PCB autorouter built for agent-driven workflow: CLI-only, JSON-first. Board routing becomes a scriptable, repeatable operation rather than a GUI session.',
    sections: [
      {
        title: 'Design Goals',
        content: `
          <ul>
            <li><strong>Agent-first interface:</strong> JSON problem definitions in, JSON solutions out.</li>
            <li><strong>Headless by design:</strong> no GUI dependency — usable from CI, scripts, and agents.</li>
            <li><strong>C++20 performance:</strong> real board sizes without scripting-language overhead.</li>
          </ul>
        `
      },
      {
        title: 'Why It Matters',
        content: `
          <p>If an agent can read a schematic, it should be able to drive layout too. Copperline is the routing side of that loop — making the last manual step of PCB work automatable.</p>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">C++20</span>
            <span class="tech-badge">JSON</span>
            <span class="tech-badge">CLI</span>
            <span class="tech-badge">KiCad ecosystem</span>
          </div>
        `
      }
    ]
  },
  'aero-mpw': {
    title: 'Aero-Multiphysics Workbench',
    tag: 'Simulation / Python / Engineering',
    status: 'In Design',
    timeline: '2026 — ongoing',
    github: 'https://github.com/iamdarshg/aero-multiphysics-workbench',
    overview: 'A local-first, strongly coupled multiphysics engineering workbench. Built for design loops that refuse to live inside a single solver — coupling the physics that actually interact.',
    sections: [
      {
        title: 'Approach',
        content: `
          <ul>
            <li><strong>Strong coupling:</strong> physics modules exchange state every iteration, not just at the end.</li>
            <li><strong>Local-first:</strong> simulation data and workflows stay on the machine — no cloud lock-in.</li>
            <li><strong>Workbench philosophy:</strong> open modules instead of black boxes.</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">Python</span>
            <span class="tech-badge">SciPy / NumPy</span>
            <span class="tech-badge">Multiphysics</span>
            <span class="tech-badge">Local compute</span>
          </div>
        `
      }
    ]
  }
};
const legacyProjectDetails = {
  'drone-v2': {
    title: 'Drone-v2: Autonomous Aircraft Platform',
    tag: 'Aerospace / RF / Embedded Systems',
    status: 'In Active Development',
    timeline: 'December 2024 to Q2 2026',
    github: 'https://github.com/iamdarshg/drone-v2',
    overview: 'Complete autonomous aircraft development from PCB design through firmware validation. Multi-layer hardware with integrated RF frontend, sensor fusion, and real-time control systems.',
    sections: [
      {
        title: 'Technical Architecture',
        content: `
          <ul>
            <li><strong>Hardware Platform:</strong> Custom multi-layer PCB with integrated power distribution, RF frontend, and precision analog interfaces</li>
            <li><strong>Sensor Integration:</strong> IMU (9-DOF), GPS module, barometric pressure sensor, all with dedicated signal conditioning</li>
            <li><strong>RF Design:</strong> Antenna geometry optimized and tested for telemetry, impedance-matched transmission lines</li>
            <li><strong>Power Management:</strong> Multi-rail regulation with protection circuitry and efficient switching converters</li>
          </ul>
        `
      },
      {
        title: 'Firmware Development',
        content: `
          <ul>
            <li><strong>Real-time OS:</strong> Pure C implementation with minimal middleware for predictable timing</li>
            <li><strong>Sensor Fusion:</strong> Kalman filter integration of IMU, GPS, and barometric data</li>
            <li><strong>Control Loops:</strong> PID controllers for stabilization with tuning framework</li>
            <li><strong>Telemetry System:</strong> Bidirectional communication protocol with ground station</li>
            <li><strong>Safety Features:</strong> Watchdog timers, failsafe modes, geofencing</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">C (Firmware)</span>
            <span class="tech-badge">Python (Ground Station)</span>
            <span class="tech-badge">KiCad (PCB Design)</span>
            <span class="tech-badge">STM32/ARM Cortex</span>
            <span class="tech-badge">RF Design</span>
            <span class="tech-badge">Real-time Systems</span>
          </div>
        `
      }
    ]
  },
  'code-sdr': {
    title: 'Code-SDR: Ultra-Wideband Software Defined Radio',
    tag: 'FPGA / RF / Digital Signal Processing',
    status: 'Board Routing Stage',
    timeline: 'November 2025 to Q1 2026',
    github: 'https://github.com/iamdarshg/Code-SDR',
    overview: 'High-performance FPGA-accelerated SDR system with a real-time processing pipeline. Complete implementation from Verilog HDL through computer interface, targeting 105 MSPS throughput with sub-10 microsecond latency.',
    sections: [
      {
        title: 'FPGA Processing Pipeline',
        content: `
          <ul>
            <li><strong>Platform:</strong> LIF-MD6000-6UMG64I FPGA with 100% logic utilization (16,000 LE)</li>
            <li><strong>ADC Interface:</strong> AD9215BCPZ-105 (10-bit, 105 MSPS) with parallel data acquisition and overflow detection</li>
            <li><strong>Digital Downconversion:</strong> NCO mixing with CIC decimation filters for flexible IF processing</li>
            <li><strong>FFT Engine:</strong> 1024-point complex FFT with Hamming windowing for spectral analysis</li>
            <li><strong>Clock Domains:</strong> 100 MHz processing, 105 MHz ADC, 125 MHz Ethernet with synchronized cross-domain transfers</li>
          </ul>
        `
      },
      {
        title: 'Performance Specifications',
        content: `
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-label">Sample Rate</div><div class="stat-value">105 MSPS</div></div>
            <div class="stat-item"><div class="stat-label">Latency</div><div class="stat-value">&lt;10µs</div></div>
            <div class="stat-item"><div class="stat-label">Ethernet</div><div class="stat-value">750 Mbps</div></div>
            <div class="stat-item"><div class="stat-label">FFT</div><div class="stat-value">1024-point</div></div>
          </div>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">Verilog HDL</span>
            <span class="tech-badge">FPGA (LIF-MD6000)</span>
            <span class="tech-badge">Python/NumPy</span>
            <span class="tech-badge">GNU Radio</span>
            <span class="tech-badge">C++ (Plugins)</span>
            <span class="tech-badge">Gigabit Ethernet</span>
          </div>
        `
      }
    ]
  },
  'research-paper': {
    title: 'Aircraft Diffusion CFD: Generative Aerodynamic Design',
    tag: 'Research / AI-ML / Computational Fluid Dynamics',
    status: 'Active Research',
    timeline: 'December 2025 to ongoing',
    github: 'https://github.com/iamdarshg/research-paper',
    overview: 'GPU-accelerated generative design system combining hybrid diffusion networks with lattice Boltzmann CFD. Progressive training pipeline automatically generates and optimizes aircraft structures for aerodynamic efficiency with structural connectivity constraints.',
    sections: [
      {
        title: 'Technical Approach',
        content: `
          <ul>
            <li><strong>Generative Model:</strong> Diffusion-based architecture with hierarchical representation for 3D volumetric structures</li>
            <li><strong>CFD Integration:</strong> GPU-accelerated Lattice Boltzmann Method (LBM) for real-time aerodynamic evaluation</li>
            <li><strong>Structural Constraints:</strong> Connectivity penalty ensures generated designs are physically viable and manufacturable</li>
            <li><strong>Progressive Training:</strong> Multi-resolution approach from 16 cubed to 24 cubed to 32 cubed balances quality and computational efficiency</li>
          </ul>
        `
      },
      {
        title: 'Performance Characteristics',
        content: `
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-label">Training Time</div><div class="stat-value">14-18 hrs</div></div>
            <div class="stat-item"><div class="stat-label">GPU Memory</div><div class="stat-value">8 to 13 GB</div></div>
            <div class="stat-item"><div class="stat-label">Grid Resolution</div><div class="stat-value">32³ voxels</div></div>
            <div class="stat-item"><div class="stat-label">CFD per step</div><div class="stat-value">&lt;100 µs</div></div>
          </div>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">PyTorch 2.0+</span>
            <span class="tech-badge">CUDA</span>
            <span class="tech-badge">NumPy/SciPy</span>
            <span class="tech-badge">Trimesh</span>
            <span class="tech-badge">CFD/LBM</span>
            <span class="tech-badge">Diffusion Models</span>
          </div>
        `
      }
    ]
  },
  'research-paper-2': {
    title: 'ML-Based Rapid RCS Estimation for UAV Stealth',
    tag: 'Research / ML Regression / Electromagnetic Simulation',
    status: 'Drafted Research',
    timeline: 'Research Paper - 2',
    document: 'https://docs.google.com/document/d/1HaOFb65H8sa6XP68lDQqKQvD1LLnsXuSL4ejdr_u0k8',
    overview: 'A research paper on using machine-learning regression models to estimate UAV radar cross-section from electromagnetic simulation data. The work positions ML as a rapid screening layer for stealth-design exploration, with full-wave simulation retained for final validation.',
    sections: [
      {
        title: 'Research Focus',
        content: `
          <ul>
            <li><strong>Core question:</strong> Can trained regressors estimate radar cross-section fast enough to support early-stage UAV stealth design?</li>
            <li><strong>Engineering framing:</strong> ML as a practical surrogate for design exploration, not a replacement for electromagnetic solvers.</li>
            <li><strong>RCS scope:</strong> Monostatic and bistatic RCS, aspect-angle effects, frequency dependence, polarization, geometry, and material influences.</li>
          </ul>
        `
      },
      {
        title: 'Modeling Approaches',
        content: `
          <ul>
            <li><strong>Baselines:</strong> SVMs and random forests for smaller or medium-sized datasets.</li>
            <li><strong>Neural models:</strong> Dense networks, volumetric CNNs, recurrent models for frequency sweeps, and hybrid CNN-transformer architectures.</li>
            <li><strong>Physics-informed:</strong> PINN-style losses as regularization for sparse-data behavior.</li>
          </ul>
        `
      },
      {
        title: 'Evaluation Plan',
        content: `
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-label">Split</div><div class="stat-value">70/15/15</div></div>
            <div class="stat-item"><div class="stat-label">Target RMSE</div><div class="stat-value">0.5-2 dB</div></div>
            <div class="stat-item"><div class="stat-label">Speedup</div><div class="stat-value">50-100x</div></div>
            <div class="stat-item"><div class="stat-label">Validation</div><div class="stat-value">Full-wave EM</div></div>
          </div>
        `
      },
      {
        title: 'Tools Mentioned',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">PyTorch</span>
            <span class="tech-badge">TensorFlow</span>
            <span class="tech-badge">JAX</span>
            <span class="tech-badge">CST Microwave Studio</span>
            <span class="tech-badge">HFSS</span>
            <span class="tech-badge">FEKO</span>
            <span class="tech-badge">gprMax</span>
            <span class="tech-badge">FEniCS</span>
          </div>
        `
      }
    ]
  }
};

/* merge legacy + new so all cards can open detail modals */
Object.assign(projectDetails, legacyProjectDetails);
function openProjectDetail(projectId) {
  const details = projectDetails[projectId];

  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('detail-body');
  if (!modal || !body) return;

  if (details) {
    const detailSections = (details.sections || []).map(section => `
      <div class="detail-section">
        <h3>${section.title}</h3>
        ${section.content}
      </div>
    `).join('');

    const readmeSection = details.github ? `
      <div class="detail-section" id="readme-section">
        <h3>GitHub README</h3>
        <div id="readme-content" class="readme-content">
          Loading repository data…
        </div>
      </div>
    ` : '';

    const links = [
      details.github ? `<a href="${details.github}" target="_blank" rel="noopener noreferrer" style="font-size:13px;">View on GitHub →</a>` : '',
      details.document ? `<a href="${details.document}" target="_blank" rel="noopener noreferrer" style="font-size:13px;">Open source document →</a>` : ''
    ].filter(Boolean).join('');

    body.innerHTML = `
      <div class="detail-header">
        <h2>${details.title}</h2>
        <span class="project-tag">${details.tag}</span>
        <div class="project-meta" style="margin-top:12px;">
          <span>${details.timeline}</span>
          <span class="badge-status badge-status--active">${details.status}</span>
        </div>
      </div>

      <div class="detail-section">
        <h3>Overview</h3>
        <p>${details.overview}</p>
      </div>

      ${detailSections}
      ${readmeSection}

      <div class="detail-section">
        <div class="project-links">
          ${links}
        </div>
      </div>
    `;

    if (details.github) {
      fetchRepoData(details.github, { preserveSummary: true });
    }
  } else {
    /* unknown repo — generic modal with live README */
    body.innerHTML = `
      <div class="detail-header">
        <h2>${escapeHtml(projectId)}</h2>
      </div>
      <div class="detail-section" id="readme-section">
        <h3>GitHub README</h3>
        <div id="readme-content" class="readme-content">
          Loading repository data…
        </div>
      </div>
      <div class="detail-section">
        <div class="project-links">
          <a href="https://github.com/iamdarshg/${encodeURIComponent(projectId)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;">View on GitHub →</a>
        </div>
      </div>
    `;
    fetchRepoData(projectId);
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

async function fetchRepoData(githubUrlOrSlug, options = {}) {
  const repoPath = githubUrlOrSlug.includes('github.com')
    ? githubUrlOrSlug.replace('https://github.com/', '')
    : `${GITHUB_USER}/${githubUrlOrSlug}`;

  const readmeContainer = document.getElementById('readme-content');
  const summaryContainer = document.getElementById('llm-summary');

  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
    if (!response.ok) throw new Error(`README fetch failed: ${response.status}`);
    const readmeText = await response.text();
    if (readmeContainer) {
      readmeContainer.innerHTML = marked.parse(prepareReadmeForDisplay(readmeText));
    }
    if (!options.preserveSummary && summaryContainer) {
      const snapshot = extractReadmeSnapshot(readmeText);
      summaryContainer.innerText = snapshot.summary;
    }
  } catch (error) {
    if (readmeContainer) {
      readmeContainer.innerHTML = '<em>Error loading README. Please check the link.</em>';
    }
    if (!options.preserveSummary && summaryContainer) {
      summaryContainer.innerText = 'Technical summary unavailable.';
    }
  }
}

function closeProjectDetail(event) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeProjectDetail();
  }
});
/* ============================================================
   EASTER EGGS (kept from previous version)
   ============================================================ */
function setupEasterEggs() {
  const technoTrigger = document.getElementById('technoblade-trigger');
  if (technoTrigger) {
    technoTrigger.addEventListener('click', () => {
      spawnCrownedPig();
      localStorage.setItem('technoblade_unlocked', 'true');
    });
  }

  const minecraftTrigger = document.getElementById('minecraft-trigger');
  if (minecraftTrigger) {
    minecraftTrigger.addEventListener('click', () => {
      triggerMinecraftEffect();
    });
  }

  if (localStorage.getItem('technoblade_unlocked') === 'true') {
    document.querySelectorAll('.technoblade-text').forEach(el => {
      el.addEventListener('click', spawnCrownedPig);
    });
  }
  if (localStorage.getItem('minecraft_unlocked') === 'true') {
    document.body.classList.add('minecraft-unlocked');
    document.querySelectorAll('.minecraft-text').forEach(el => {
      el.addEventListener('click', triggerMinecraftEffect);
    });
  }
}

function triggerMinecraftEffect() {
  createConfetti();
  document.body.classList.add('minecraft-unlocked');
  localStorage.setItem('minecraft_unlocked', 'true');
}

function spawnCrownedPig() {
  const pigCount = 5;
  for (let i = 0; i < pigCount; i++) {
    setTimeout(() => {
      const pig = document.createElement('div');
      pig.innerHTML = `<img src="https://media.tenor.com/C7YIu5Aonj4AAAAM/technoblade-minecraft-movie.gif" style="width: 100px; height: auto;" alt="Techno Pig">`;
      pig.style.position = 'fixed';
      pig.style.bottom = (10 + Math.random() * 80) + '%';
      pig.style.left = '-150px';
      pig.style.zIndex = '10000';
      pig.style.transition = `transform ${4 + Math.random() * 2}s linear`;
      pig.style.pointerEvents = 'none';
      document.body.appendChild(pig);
      pig.offsetHeight;
      pig.style.transform = `translateX(${window.innerWidth + 300}px) rotate(${Math.random() * 20 - 10}deg)`;
      setTimeout(() => pig.remove(), 7000);
    }, i * 300);
  }
}

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = (Math.random() * 12 + 8) + 'px';
    confetti.style.height = (Math.random() * 12 + 8) + 'px';
    confetti.style.backgroundColor = ['#77DD77', '#897451', '#3C2D22', '#BDB76B', '#559955'][Math.floor(Math.random() * 5)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.zIndex = '10000';
    confetti.style.opacity = Math.random();
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(confetti);
    const animation = confetti.animate([
      { transform: 'translateY(0) rotate(0)', opacity: 1 },
      { transform: `translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    });
    animation.onfinish = () => confetti.remove();
  }
}
