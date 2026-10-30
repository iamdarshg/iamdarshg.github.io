# Portfolio redesign handoff

## Current state

This is a static personal portfolio hosted from the repository root at
`https://iamdarshg.github.io/`. Work in the repository is intentionally
unfinished but has been pushed to `main` at the user's request as a better-than-
nothing checkpoint. The public site will update through GitHub Pages after its
deployment workflow completes; do not report it as live until the Pages
deployment is green and the public URL has been checked.

The local preview is `http://localhost:8899/` when the temporary Python preview
server is running. It serves the repository directory directly and is not a
Jekyll build. To reproduce locally, run `python -m http.server 8899` from the
repository root. A Jekyll preview should also be run before any substantial
deployment change.

## User's original goal

Redesign the portfolio so that it feels exceptional, interactive, cinematic,
polished, and emotionally engaging. The homepage is the highest priority and
should make an immediate impression. The desired experience is a scroll-led
product reveal in the spirit of Apple or Gigabyte product launches: an object
enters, transforms, reveals its engineering detail, then connects to simulation
evidence and active programs. The user explicitly asked for review as a
scroll-through video, not just screenshots.

The user authorized artistic liberty and trusts the implementer to make design
decisions. Avoid generic cards, token hover effects, and a routine content-page
hero. Use compelling real project material, but only when the artifact works as
visual storytelling. CAD/CFD plots are engineering evidence, not automatically
hero art. The bleak ESP-32 photo was explicitly rejected as hero imagery.

## Prior work already in the repository

- `index.html` now has a full-width pinned `launch-scene` and a following
  `flight-story` section; do not recreate these from scratch without first
  reviewing them and the user-approved constraints.
- The launch scene uses `assets/images/field/hero-edf-composite.png`, a locally
  composited design based on an EDF CAD asset. Other real engineering images
  and transformed cutouts are in `assets/images/field/`.
- `assets/js/app.js` drives the launch scene, flight story, and project-film
  transforms from scroll progress, and also contains shared reveal/portfolio
  behavior.
- `assets/css/shared.css` contains the portfolio-wide visual system, reveal
  effects, and reduced-motion styles.
- The project, education, interests, contact, README, and configuration files
  have prior uncommitted/recent redesign edits. Preserve and inspect rather
  than overwrite them.
- Historical screenshots and QA captures are under `output/`. Especially
  inspect `output/scroll-0.png` through `output/scroll-4.png`,
  `output/current-scroll-0.png`, `output/current-scroll-2.png`,
  `output/current-state-check.png`, and the earlier `output/qa/` and
  `output/playwright/` captures. `output/` is excluded from the Jekyll build
  and should not be treated as production content.

## Honest visual assessment / known issues

The current work is a checkpoint, not a finished redesign. The launch image
still reads too much like a technical CAD screenshot with a dark graphic
treatment, rather than a premium, art-directed product image. At desktop size,
the headline, CAD labels, and object compete and overlap. The composited inset
resembles a window layered onto the scene, metadata overlaps at some scroll
positions, and the transitions do not yet make a convincing product-reveal
narrative. Previous scroll captures show the hero's title fading while the
large visual remains, but that alone is not sufficient choreography.

Do not claim that the hero or overall portfolio meets the requested quality
bar. Do not publish a polished-design claim based on the current capture.

## Scroll / accessibility finding

The user's report that scrolling “doesn't work anymore” must be taken
seriously. Earlier captures and browser instrumentation did demonstrate that
document scrolling and the JavaScript progress transforms were advancing in
one Chrome session when `prefers-reduced-motion` was explicitly set to
`no-preference`. A separate automated browser reported reduced motion, and
`setupScrollMotion()` returned before updating scene transforms. This explains
why some captures looked frozen, but does not prove that every user's physical
scroll input or browser configuration is healthy.

A minimal accessibility safety fix was made in `assets/js/app.js`: when reduced
motion is active, animated elements are restored to visible/untransformed
states so no content stays hidden, and changes in the media preference are
observed. Verify this change in both reduced-motion and normal-motion modes.
Reduced motion must not be “fixed” by ignoring the user's OS preference; make
content readable and allow ordinary browser scrolling while suppressing
decorative transitions.

Important implementation caution: sticky scenes need a non-transformed
ancestor. `setupReveals()` now excludes `.launch-scene` for this reason. Avoid
adding `.reveal` or transforms to `.launch-scene` or ancestors of sticky scene
elements. Use the scroll progress already measured by the JS instead of mixing
native scroll timelines on the same properties, which previously made the
result hard to diagnose.

## Jekyll and GitHub Pages constraints

- This is a static-site repository with a root `_config.yml`, `index.html`,
  `projects.html`, `education.html`, `interests.html`, and `contact.html`.
- `_config.yml` declares `jekyll-seo-tag`, `url: https://iamdarshg.github.io`,
  and an empty `baseurl`, appropriate for a user-site repository named
  `iamdarshg.github.io`.
- There is no Jekyll front matter requirement for ordinary static `.html`
  files; Pages can serve them directly. If using Liquid or Jekyll plugins in a
  page, add valid front matter and ensure the plugin is supported by the chosen
  Pages build path.
- The configured `jekyll-seo-tag` plugin is supported by GitHub Pages' default
  dependency set, but any build-system change should be verified against the
  actual Pages workflow and the repository's deployment settings.
- Root-relative URLs such as `/assets/...` and `/projects.html` are appropriate
  for this user-site's empty `baseurl`. If this is ever deployed as a project
  site with a nonempty `baseurl`, convert paths to use `relative_url` or another
  baseurl-aware approach.
- Keep `output/` excluded from production. Do not add temporary browser
  profiles, capture scripts, or debug captures to the published site.
- Verify links and images in the generated `_site/` output, not just in a
  Python server that bypasses Jekyll.

Suggested checks (depending on locally installed tools):

1. `bundle exec jekyll build` (or the repository's GitHub Pages-compatible
   build command) and inspect build output for errors/warnings.
2. `bundle exec jekyll serve` and check the five pages plus static assets.
3. `node --check assets/js/app.js`.
4. Browser test at desktop and mobile dimensions, with normal motion and
   reduced motion. Confirm wheel/touch/keyboard scrolling moves the document,
   sticky scenes progress, no sections become inaccessible, and no assets 404.
5. Record and inspect a full scroll-through video as requested. Screenshots
   alone are not the acceptance test.
6. Check the GitHub Pages Actions/deployment status and the live URL after a
   push; a successful `git push` is not proof that Pages built or deployed.

## Next work, in priority order

1. Reproduce the reported scroll failure on the user's actual browser/device
   if possible. Test wheel, trackpad/touch, keyboard, reduced-motion on/off,
   and normal-motion. Distinguish actual document-scroll failure from motion
   suppression or a pinned section that merely feels static.
2. Verify Jekyll build compatibility and local Jekyll preview. Confirm root
   paths and asset references in generated output.
3. Fix only concrete scroll/accessibility defects and regressions, with a
   before/after reproduction. Keep reduced-motion content visible.
4. Re-art-direct the first viewport based on the screenshots and source
   project assets. Avoid enlarging CAD annotations or wrapping the CAD image in
   more faux UI. If no strong genuine visual is available, choose a more
   restrained typographic/graphic treatment rather than pretending technical
   output is product photography.
5. Replace the current linear transform with deliberate staged choreography:
   clear opening composition; visible object movement that is tied to scroll;
   meaningful separation/reveal; transition into evidence and project work;
   controlled pacing and a legible final state. Ensure the transitions are
   reversible when scrolling back and do not trap the visitor in a long blank
   pinned interval.
6. Review the entire page at phone and desktop widths. Check contrast, nav,
   content order, reduced motion, and image loading.
7. Make a real-time screen recording of a complete homepage scroll-through,
   watch it, and iterate until it meets the user's quality bar.
8. Confirm the Pages deployment status and live website. The user authorized
   pushing this checkpoint to `main`; do not assume authorization for later
   changes beyond the explicit request.

## Preserve / avoid

- Preserve all existing edits and user work; inspect `git status` and diffs
  before staging.
- Do not reset, clean, or discard workspace changes.
- Do not use the rejected bleak ESP-32 image as the hero.
- Do not silently keep physically misleading or fabricated project claims.
- Do not push further changes unless authorized or clearly within the current
  explicit request.
- Clearly distinguish local preview (`http://localhost:8899/`) from public
  deployment (`https://iamdarshg.github.io/`).
