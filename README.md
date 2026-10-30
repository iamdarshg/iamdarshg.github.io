# Darsh Gupta Portfolio

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://github.com/iamdarshg/iamdarshg.github.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

Professional portfolio website for Darsh Gupta — aerospace, RF, and embedded systems builder. Built for GitHub Pages as a multi-page static site with a live repository feed synced from the GitHub API.

## Site Structure

```
├── index.html              Landing page — hero, build pipeline, research threads
├── projects.html           Featured builds + live GitHub repository feed
├── education.html          Academic track, research, experience timeline
├── interests.html          Personal interests (gym, swimming, MUNs, gaming)
├── contact.html            Contact methods, references, what I'm seeking
├── _config.yml             Jekyll configuration
└── assets/
    ├── css/
    │   └── shared.css     Design system: tokens, components, both themes
    ├── js/
    │   └── app.js         Theme toggle, live repo feed, project modal, reveals
    └── images/            Project visuals and workbench photography
```

## Features

- **Live GitHub feed** — the Projects page fetches all public repos from `api.github.com/users/iamdarshg/repos`, filters forks and the portfolio repo itself, and renders cards with language colors, star counts, freshness, and README snapshots (fetched in background). Falls back to a static list if the API is unreachable.
- **Light & Dark Mode** — toggle in the header, preference saved to `localStorage`. The system is token-driven (`data-color-scheme` on `<html>`), so both themes share one component system.
- **Design system** — Space Grotesk display + IBM Plex Mono data type, single electric-cyan accent, blueprint-grid background, tinted shadows, unified radius scale, scroll-reveal motion (honors `prefers-reduced-motion`).
- **Project detail modals** — click any repo card to open a modal with curated detail sections plus the live README, rendered via `marked`.
- **Responsive** — mobile-first collapse for every grid, tested down to 360px.
- **No build step** — plain HTML/CSS/JS, served directly by GitHub Pages. No comments in the HTML (per project convention).

## Setup Instructions

1. **Clone**
   ```bash
   git clone https://github.com/iamdarshg/iamdarshg.github.io
   cd iamdarshg.github.io
   ```

2. **Local testing** (any static server works; Python is easiest)
   ```bash
   python -m http.server 8000
   ```
   Visit `http://localhost:8000`. Jekyll also works (`jekyll serve`) but is not required.

3. **Deploy**
   - Push to `main` — GitHub Pages builds and deploys automatically.
   - Site: `https://iamdarshg.github.io`

## Keeping the feed current

The repo feed is live by design — it reads the GitHub API on page load, so new public repos appear automatically (session-cached to stay well under rate limits). No manual lists to maintain.

Curated content that *does* need manual love:

- **Featured projects** on `projects.html` and the **status board** on `index.html` — update these when a new project becomes the main thread.
- **Modal detail sections** in `assets/js/app.js` (`projectDetails`) — add a curated entry for any repo you want a rich detail view for.
- **Artwork mapping** in `assets/js/app.js` (`repoArtwork`) — point new repos at the right image.

## Content rules

- Public-facing signal only: projects, education, activity. No private schedules, scores, or planning notes.
- Every repo card that links to GitHub must exist on the profile — no dead links (this is why the feed is API-driven).

## License

Personal portfolio. © 2026 Darsh Gupta.