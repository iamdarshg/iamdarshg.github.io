# Darsh Gupta Portfolio

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://github.com/iamdarshg/iamdarshg.github.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

Professional portfolio website built for GitHub Pages. Multi-page structure with projects, education, and contact information.

## Site Structure

```
├── index.html              Landing page - quick overview
├── projects.html           Showcase of featured projects
├── education.html          Technical skills and experience timeline
├── contact.html            Contact information and references
├── _config.yml            Jekyll configuration
└── assets/
    ├── css/
    │   └── shared.css     Shared styles and design tokens
    ├── js/
    │   └── app.js         Theme toggle and navigation
    └── images/            Stock photos and project visuals
```

## Features

- **Light & Dark Mode**: Toggle theme with switch in header (preference saved to localStorage)
- **Responsive Design**: Mobile-first approach, tested on all device sizes
- **No Comments**: Clean HTML/CSS/JS with zero code comments
- **Minimal Wordcount**: Reduced AI-adjacent language, technical terminology
- **Multiple Pages**: Split into dedicated pages for projects, education, and contact
- **GitHub Pages Ready**: Built with Jekyll, served directly from repository

## Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/iamdarshg/iamdarshg.github.io
   cd iamdarshg.github.io
   ```

2. **Optional: Local Testing with Jekyll**
   ```bash
   gem install jekyll bundler
   jekyll serve
   ```
   Visit `http://localhost:4000`

3. **Deploy to GitHub Pages**
   - Push to `main` branch
   - GitHub automatically builds and deploys
   - Site available at `https://iamdarshg.github.io`

## Images

All images in `assets/images/` are non-licensed stock photos from Unsplash:

- `hero-workspace.jpg` - Workspace with electronics
- `code-sdr.jpg` - RF development board
- `drone-v2.svg` - Placeholder for aircraft platform (replace with photo)
- `physics-sim.svg` - Placeholder for simulation (replace with screenshot)

To replace placeholder SVGs:
1. Get your own high-contrast photo
2. Save as JPEG/PNG to `assets/images/`
3. Update image path in `projects.html`

## Customization

### Colors & Typography
Edit `assets/css/shared.css` - all design tokens defined as CSS variables

### Content
Update text in individual HTML files. Each page is self-contained.

### Theme Toggle
Works automatically - no setup needed. Preference stored in `localStorage`

## Compliance

- ✅ Split into multiple pages
- ✅ Light & dark mode with toggle
- ✅ No HTML comments
- ✅ Reduced AI-adjacent language
- ✅ Local, non-licensed images
- ✅ GitHub Pages compatible
- ✅ Minimal text, focused content

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Graceful degradation without JavaScript

## License

Personal portfolio. © 2026 Darsh Gupta.
