# Handoff — iamdarshg.github.io

**Written:** 2026-11-10 · **Repo:** `iamdarshg/iamdarshg.github.io` · **Live:** https://iamdarshg.github.io/
**Branch:** `main` (pushes deploy straight to GitHub Pages) · **Last commit:** `git log -3`

This file is written to be sufficient on its own: no prior conversation needed.
Read it end to end before touching a file, then follow §10 → §12 in order.

---

## 0. The job, in one sentence

Make the first viewport of this site look like a **product**, not a CAD export —
the picture and the object are the ceiling on quality, and the current hero is a
322-pixel render blown up 2.2×.

Everything else on the site is already in reasonable shape. Do not rebuild it.

---

## 1. What this site is, and what job it does

A static personal site that sells **Darsh Gupta** (Grade 12, NPS HSR, Bengaluru,
CBSE PCMC) to **university admissions readers**. It is not a link hub and not a
resume. The homepage is a product launch; the Projects page is an engineering
journal. Every claim must be traceable to something he actually built.

| File | Role |
|---|---|
| `index.html` | Product launch: pinned hero, evidence, work index, about, reviewer close |
| `projects.html` | Build log / engineering journal (repo feed + case notes) |
| `education.html` | Grade 12, coursework, timeline, research rows |
| `interests.html` | Ruled editorial essay |
| `contact.html` | Contact |

Shared: `assets/css/shared.css` (tokens, header, footer, page furniture),
`assets/js/app.js` (all behaviour), `_config.yml` (Jekyll).

**Preview:** `python -m http.server 8899 --bind 127.0.0.1` from the repo root, then
`http://127.0.0.1:8899/`. There is **no Ruby/Jekyll here** (`bundle`, `jekyll`
absent, no Gemfile) — local preview is a plain file server and GitHub Pages does
the real Jekyll build. Never call a local preview "the live site".

---

## 2. Art direction — decided, do not re-litigate

**Technical publication on ink.** A printed engineering brief: paper-white figure
plates, one cyan accent used only for claims and measures, an editorial serif for
the human voice, mono for every number.

- Ink `#05080f` / hero field `#050b12`. Text `#eaf4ff`, muted `#93a4ba`, faint `#5c6b82`.
- `--accent: #2ad4ff` — used for *prove it.*, counters, rules, hovers. **One accent only.**
- Type: `Space Grotesk` (display/sans), `Newsreader` (editorial), `IBM Plex Mono`
  (data). One `@import` at the top of `shared.css`.
- Container 1200px. Hero copy rail: `left: max(24px, calc((100vw - 1200px)/2))` → 120px at 1440.
- Headline is fixed positioning, in this exact shape:
  `I build it.<br /> Then I <em>prove it.</em>` (`<em>` is cyan + `white-space:nowrap`).
  Do not rewrite it.
- Motion: one scroll-driven scene, 180vh, pinned; reversible; fully suppressed
  under `prefers-reduced-motion` while remaining readable.

Banned: stat cards, invented metrics, decorative gradients, glassmorphism
overload, stock photography, dashboard chrome, "passionate developer" copy.

---

## 3. The hero, mechanically

`index.html:617` → `<section class="launch-scene">` > `.launch-stage` (sticky,
`100svh`, `min-height:640px`, `overflow:hidden`, `isolation:isolate`) containing:

```
.launch-grid                cyan grid, masked, z-index -1
.launch-object              absolute, right rail, z-index 2
  img.object-part--main     THE SUBJECT — the single swap point (line 636)
  .object-ring--one/two     thin cyan reticles
.launch-copy--top           eyebrow, h1, deck, 2 CTAs, spec strip
.launch-copy--bottom        "FIG. 01 — EDF intake study · rotor, stator, split inlet"
```

CSS is inline in `index.html`: scene ≈ lines 384–470, ≤980px flattening ≈ 540–580.
Measured at 1440×900 today:

| element | box |
|---|---|
| `.launch-stage` | 0 → 900 (pinned) |
| `.launch-object` | top 168, bottom 840, left 740, **709 × 673** |
| `h1` | y ≈ 171 |
| `.hero-spec` | y 594 → 607 |
| `.launch-copy--bottom` | 812 → 828 |

**Swap point:** `index.html:636`, one `<img data-src="…">` with
`width="1200" height="1040"`. Change the integers with the asset or the layout
shifts. `.object-part--main` is `object-fit:contain`,
`filter: contrast(1.04) saturate(1.04)`.

**Scroll math:** `.launch-scene` is `height:180vh; margin-top:calc(-1 * var(--hero-pull))`.
`setupHeroOffset()` (`app.js` ≈ line 65) measures the scene's document offset,
writes `--hero-pull`, and removes it below 981px; it re-measures on `resize` and
`document.fonts.ready`. That pull is what makes the scene start at y=0 instead of
y=125 (header + margin). **If the header height changes, this self-corrects — never
hardcode 125px.**

`setupScrollMotion()` (`app.js` ≈ line 110) derives progress from the scene rect
and transforms `.launch-copy`, `.launch-object` and the story sections; reduced
motion early-returns and restores visible/untransformed state. `setupReveals()`
deliberately **excludes** `.launch-scene` — a transformed ancestor kills
`position:sticky`. Never add `.reveal` or a transform to the scene or its ancestors.

At ≤980px: `height:auto`, stage static, object becomes
`position:relative; width:min(92vw,400px); aspect-ratio:1200/1040`, caption hides.

---

## 4. The actual problem: the picture

**The hero is a 322×502 PNG upscaled ~2.2×.** `assets/images/field/hero-edf-stage.webp`
(1200×1040, 263 KB, alpha) was composited in PIL from
`assets/images/field/rotor-drum-clean.png`, which is **322 × 502 px**. At 1440 the
object box is 709 CSS px wide, so the source is resampled upward ~2.2× and then
smoothed again by the browser. That is why the subject reads soft, plastic and
slightly fake. Rim light, grain, halo and vignette cannot fix a 322px source.
**The fix is upstream — a better source image, not more CSS.**

What the subject is: a **five-stage electric ducted fan stack** — five rotor/stator
discs on a central hub, white casing shells, **green rotor blades**, **copper/brown
stator vanes**, **three thin blue rods** hanging below (mounting/wiring). A real
sub-assembly of a real build. There is **no product photograph of it in this repo**.

Inventory, `assets/images/field/` (dimensions verified):

| file | size | what it is |
|---|---|---|
| `rotor-drum-clean.png` | **322×502 RGBA** | current hero source; too small |
| `rotor-stack-clean.png` | 368×555 RGBA | taller stack, same problem |
| `edf-cutout.png` | **1649×1011 RGBA** | largest single-object cutout, isometric |
| `05_EDF_A_rotor_stator_closeup_R030-cutout.png` | 1568×1014 RGBA | closeup, transparent |
| `05_EDF_A_rotor_stator_closeup_R030.png` | 1500×950 RGB | same with **white bg + burned-in CAD title block** |
| `07_rotor_R1_hub_blade_assembly_detail_R030-cutout.png` | 1570×977 RGBA | detail cutout |
| `edf-b-rotor-closeup.png` | 1500×950 RGB | white bg, annotation burned in |
| `edf-front-projection.png` | 1500×950 RGB | orthographic rotor plan — a figure, not a hero |
| `edf-inlet-side/top.png` | 1500×950 | 2D routing schematics, near-empty |
| `01_full_assembly_isometric_R030.png` | 1500×950 RGB | whole aircraft, small, on white |
| `polar_compare.png` | 1210×440 | **CL vs α, Wing3d vs OpenFOAM** — the evidence plot |
| `smoke_cp.png` | 900×600 | Cp surface, false colour |
| `IMG_9F899C38-…jpeg` | 1178×1571 | ESP-32 breadboard photo — **rejected as hero** |
| `airshow_*` | 1473×1213 / 1587×542 | generated geometry + metrics panels |

Rules that fall out of that table:

1. **Never build a hero from a white-background render with a burned-in CAD title
   block.** The annotation is in the pixels; cropping leaves a tilted object.
2. **Never present a generated or composited image as a photograph of his
   hardware.** If the hero is a render, the caption says render. "EDF intake
   study" stays truthful.
3. Green/copper/blue is default-CAD, not art direction. Either lean into it as
   *a parts diagram* (flat, labelled, ink-on-paper) or replace it with one
   controlled material story. Do not half-do both.
4. Acceptance is visual at 1440 and 390, at scroll 0 **and** pinned — not "the CSS looks right".

Routes, best first:

- **A. Re-render from the CAD source.** Highest ceiling. The model is *not* in
  this repo — search `D:\CodeProjects\{cfd, drone-mech, drone-v2, edf-esc,
  drone_main, maker-portfolio}` (or the other machine's equivalent) for
  `.step/.stp/.stl/.blend/.obj`. Render ≥2000px, studio key + rim, one material
  (anodised aluminium + carbon), transparent bg, 3/4 view from just below the
  intake lip. **Blender is NOT installed** on the reference machine — but
  `trimesh`, `vtk`, `pyvista`, `moderngl`, `torch` and `opencv` are, so an
  offscreen PBR render is possible in pure Python:
  `pv.Plotter(off_screen=True, window_size=(2400,2400))` + `enable_ssao()` +
  PBR shading + `camera_position` + a 4-light rig, saved with alpha.
- **B. Real photograph.** One 2400px frame of the printed drum on a dark surface
  under a single hard light beats every render here. Cost: one `data-src` and
  two integers.
- **C. Graphic, not photographic.** If A and B are both impossible, stop
  pretending: make it a **technical plate** — single-ink + cyan duotone, fine
  halftone or hard threshold, let the CAD annotation and section lines become the
  design, and let typography carry the drama. Honest, distinctive, achievable
  with PIL today. Strictly better than a soft upscaled pseudo-photo.

Whichever route: silhouette on the hero's optical centre line, the three rods
must not run into the fold, spec strip keeps clear air beneath it.

---

## 5. Machine reality (verified on the reference machine)

| tool | status |
|---|---|
| Python 3.12 + PIL 10.3 | **yes** — the workhorse for compositing/knocking out |
| numpy 2.2, scipy 1.16, matplotlib 3.9 | yes |
| trimesh 4.10, pyvista 0.46, vtk 9.3, moderngl 5.12 | **yes — offscreen 3D rendering is possible** |
| torch 2.9 (+cu130), opencv 4.12 | yes |
| Node 22 | yes — `node --check assets/js/app.js` is a real gate |
| ffmpeg | yes (screen recordings) |
| **Blender / ImageMagick / Ruby / Jekyll / Bundler** | **no** |

- The only image *generator* is an OpenCode experimental tool — see §11.3. Do not
  claim an image was generated unless it actually was.
- **Playwright MCP is broken on the reference machine**:
  `ENOTDIR: not a directory, mkdir 'C:\Users\Darsh Gupta\AppData\Local\ms-playwright'`.
  Workaround there: Python Playwright with system Edge,
  `executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`.
  On a fresh machine install Playwright MCP properly (§10) so this workaround is unnecessary.
- `gh` is authenticated as `iamdarshg` with `repo` scope.
  **`tannmay-python` has been invited with write (push) permission** — pending
  acceptance at `https://github.com/iamdarshg/iamdarshg.github.io/invitations`.
  Nothing else is needed for him to push to `main`.
- `output/` is gitignored (contains a large Playwright profile dump — ignore it).

---

## 6. Verification protocol — run it, paste the output

All six must pass before any pass is reported done.

1. `node --check assets/js/app.js`
2. Five pages × two viewports (1440×900, 390×844), asserting:
   `scrollWidth === clientWidth` (zero horizontal overflow), exactly one `h1`,
   zero `img[complete && naturalWidth===0]`, zero 4xx responses, zero console errors.
3. Hero at scroll 0 **and** after ~300px: `.launch-object` fully inside the stage;
   `.launch-copy--bottom` bottom < viewport height in both states.
4. Keyboard: tab reaches both hero CTAs with a visible focus ring.
5. Reduced motion (`page.emulate_media(reduced_motion="reduce")`): headline, deck,
   CTAs and spec strip visible and untransformed.
6. **Open the screenshots.** Full page at both widths, plus hero at 1440/1024/768/390.
   If you did not look at the image, you did not verify it.

Snippet to reuse (Python Playwright, works on any machine with browsers installed):

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()          # reference machine: executable_path=…msedge.exe
    for w, h in [(1440, 900), (390, 844)]:
        pg = b.new_page(viewport={"width": w, "height": h})
        errs, bad = [], []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("response", lambda r: bad.append((r.status, r.url)) if r.status >= 400 else None)
        pg.goto("http://127.0.0.1:8899/", wait_until="networkidle")
        print(w, pg.evaluate("""() => ({
          ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          h1: document.querySelectorAll('h1').length,
          broken: [...document.images].filter(i => i.complete && !i.naturalWidth).length
        })"""), errs, bad)
```

---

## 7. Known defects, in priority order

1. **Hero subject is a 322px source upscaled 2.2×** (§4). *The* defect. Everything
   else is polish.
2. **Hero dead space:** ~200px of empty ink between the spec strip (y≈600) and the
   figure caption (y≈812) at 1440. Resolve with composition (raise the object, add
   a measure, move the caption), never with filler.
3. **Mobile drum too small:** at 390 the drum occupies ~269px of a 359px box and
   does not own the fold.
4. **`FIG. 01` caption** is `#c7d5e2` at 10.5px — legible, not strong.
5. **Hero is dark-mode-only** (`#050b12`) while the rest themes to `#f5f8fc` in
   light mode. Verify the bottom seam still reads as intentional.
6. **Spec strip at 360px** wraps against the right edge with no separators. Add a
   wrap rule before adding a fourth item.

---

## 8. Do not

- Do not reset, clean or discard working-tree changes; `git status` first.
- Do not replace the homepage layout. It was rebuilt deliberately; improve the
  picture and the composition.
- Do not use the ESP-32 breadboard photo as hero imagery.
- Do not claim Wing3d matches OpenFOAM. On the polar plot the OpenFOAM RANS points
  sit **below every Wing3d curve** and the mesh is coarse. The copy states a gap;
  the copy stays.
- Do not invent metrics, awards or numbers. Real facts only: Grade 12 · NPS HSR ·
  CBSE PCMC; Wing3d (TSD vs OpenFOAM, CL ± band); Copperline (C++20 PCB autorouter);
  Code-SDR (LIF-MD6000, 105 MSPS); RCS surrogate paper draft; HMUN 2023/2024;
  IIT Techfest MUN; Astro Space Camp 2023/2024; Skill Titans top-50; Minvayu FabLab
  internship; cAIpher hackathon.
- Do not add tracking, frameworks, or a build step. Plain HTML/CSS/JS, Jekyll-safe,
  root-relative paths (empty `baseurl`).
- Do not publish `output/` or `reels-notes.md` (both gitignored).

---

## 9. Definition of done

- Hero subject crisp at 1440 on a 2× display (no visible upscaling), reads as one
  deliberate object, honest about being a render.
- First viewport: one focal point, one statement, two CTAs, no dead interval
  longer than ~120px.
- At 390 the subject owns the upper third and the CTAs sit above 700px.
- No overflow, no clipped text, no console errors, one `h1` per page.
- Reduced motion readable; motion reversible.
- Pushed to `main`, and the live URL re-checked with §6's assertions — a green
  `git push` is not proof that Pages deployed.

---

## 10. Bootstrap a fresh machine (do this first)

### 10.1 MCP servers

Install globally so the loop works from any directory:

```sh
opencode mcp add playwright  --global -- bunx @playwright/mcp@latest
opencode mcp add filesystem  --global -- npx -y @modelcontextprotocol/server-filesystem "$HOME/code"
opencode mcp add thinking    --global -- npx -y @modelcontextprotocol/server-sequential-thinking
opencode mcp add context7    --global --url https://mcp.context7.com/mcp
opencode mcp list
```

Optional, only if the relevant tool exists locally:

```sh
# GitHub issues/PRs without shelling out (PAT in env, never in the file)
opencode mcp add github --global --url https://api.githubcopilot.com/mcp/ \
  --header 'Authorization=Bearer {env:GITHUB_PAT}'

# Real 3D control, ONLY if Blender is installed and the addon is set up
uvx blender-mcp        # ahujasid/blender-mcp — verify the repo before installing
```

Rules: `opencode mcp list` must show every server `connected` **before** the loop
starts. Remote servers with OAuth need one interactive `/mcps` sign-in — do it now,
not mid-loop. If a server refuses to connect, disable it with `"disabled": true`
rather than leaving a half-configured entry. Do not add MCPs you will not call;
each one costs context.

### 10.2 `opencode.jsonc` — autonomy + swarm

Project file at the repo root. Merge, do not clobber an existing config.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // Never stop to ask. Base policy already allows everything; these three
  // lines close the only two gaps: the question tool and .env reads.
  "permissions": [
    { "action": "question", "resource": "*", "effect": "deny" },
    { "action": "read", "resource": "*.env", "effect": "allow" },
    { "action": "read", "resource": "*.env.*", "effect": "allow" }
  ],

  "experimental": { "subagent_depth": 3, "todo": true },

  "agents": {
    // Read-only critic. Never edits, never asks; returns findings + severity.
    "critic": {
      "description": "Adversarial visual + code critic for the hero and page composition",
      "mode": "subagent",
      "system": "You are a hostile design critic. Judge the rendered page, not the source. Report only defects that a paying client would notice, each with file:line, severity (P0/P1/P2), and a one-line fix. Never edit files. Never ask questions. If the render is good, say so and stop.",
      "permissions": [
        { "action": "edit", "resource": "*", "effect": "deny" },
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    },
    // Narrow implementer. One finding at a time, then verify and report.
    "fixer": {
      "description": "Implements exactly one critic finding, then verifies it",
      "mode": "subagent",
      "system": "Implement exactly one assigned finding. Touch the minimum number of files. Then run the verification protocol and report the measured before/after. Do not refactor unrelated code. Never ask questions.",
      "permissions": [
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    },
    // Evidence runner: screenshots, console, overflow, live URL.
    "verifier": {
      "description": "Runs browser evidence and returns measurements, not opinions",
      "mode": "subagent",
      "system": "Collect evidence: screenshots at 1440/1024/768/390, console errors, 4xx, scrollWidth vs clientWidth, h1 count, broken images, hero box geometry at scroll 0 and pinned. Return numbers and image paths. Never edit files. Never ask questions.",
      "permissions": [
        { "action": "edit", "resource": "*", "effect": "deny" },
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    }
  }
}
```

Notes that matter:

- `"action": "question", "effect": "deny"` is what makes "never asks" true — it
  removes the question tool entirely. **Deny it last** so it overrides anything global.
- The base policy already allows `shell`, `edit`, `webfetch`, `subagent`, and every
  MCP tool. Do not add per-tool allow rules; they only create gaps.
- `experimental.subagent_depth: 3` lets a critic spawn a verifier that spawns a
  fixer. Without it, depth defaults to 1 and swarms collapse into a single call.
- The shipped `general` agent denies subagents and questions — build your roster on
  `build` or on the named agents above, never on `general`.

### 10.3 Optional: real image generation

If the other machine has an image model configured, OpenCode exposes
`experimental_image_generate`:

```jsonc
{ "experimental": { "image_generate": { "model": "openai/gpt-image-2" } } }
```

Use it **only** for abstract plates (backgrounds, material studies, a lighting
pass), never to fabricate the student's hardware. A generated "photo" of an EDF he
built is a lie the admissions reader cannot check and Darsh cannot defend.

### 10.4 Skills — write them, do not shop for them

Skills are directories with a `SKILL.md` carrying YAML frontmatter (`name`,
`description`). OpenCode auto-discovers `.opencode/skills/`; also register the path
explicitly so it survives a config rewrite:

```jsonc
{ "skills": ["./.opencode/skills"] }
```

Create exactly three. They exist to stop the loop from drifting, not to look busy.

`.opencode/skills/hero-art-direction/SKILL.md`
```markdown
---
name: hero-art-direction
description: Rules for rendering and judging the EDF hero subject. Use before
  generating, cropping, compositing or swapping any hero image.
---
- Source must be >= 1418 px wide (2x the 709 px object box) of REAL detail, not
  upscaled pixels. If the source is smaller, the fix is a new render, not a filter.
- One material story. Anodised aluminium + carbon, neutral white balance. Green
  rotors + copper vanes + blue rods is CAD default, not a palette; do not ship it
  unchanged as the hero.
- Light: one key at ~35 deg camera-left-above, one cool rim from behind-right, one
  fill at 8%. Contact shadow, slight floor occlusion. No lens flare, no bloom halo.
- Background: transparent alpha over the hero field. Never composite onto white.
- Framing: silhouette centred on the hero optical line; the three base rods must
  terminate above the fold; 8-12% empty margin on the right so the object does not
  touch the reticles.
- Honesty: caption says render if it is a render. Never claim a photograph.
```

`.opencode/skills/critic-rubric/SKILL.md`
```markdown
---
name: critic-rubric
description: Scoring rubric for judging the rendered page. Use for every critic
  pass, and for self-review before claiming a pass is done.
---
Score 1-5, cite evidence from a screenshot, never from source:
1. Focal hierarchy - one subject, one statement, two CTAs, in that order.
2. Craft - resolution, edge quality, material believability, no visible upscaling.
3. Composition - dead space, optical centre, fold, balance of ink and subject.
4. Sales read - does the first screen make an admissions reader continue?
5. Honesty - every claim checkable, every render labelled.
A P0 is anything scoring 1-2 that a paying client would notice. Max 3 fixes per cycle.
```

`.opencode/skills/browser-evidence/SKILL.md`
```markdown
---
name: browser-evidence
description: Collect screenshots and hard measurements from the local preview or the
  live site. Use for every verification pass.
---
- Serve: `python -m http.server 8899 --bind 127.0.0.1` from the repo root.
- Viewports: 1440x900, 1024x800, 768x900, 390x844. Capture scroll 0 and pinned
  (~300 px). Save to `output/pass-<n>/`.
- Assert: scrollWidth === clientWidth; exactly one h1; zero images with
  `complete && !naturalWidth`; zero responses >= 400; zero console errors.
- Measure the hero: `.launch-object` and `.launch-copy--bottom` rects, plus
  `naturalWidth` of `.object-part--main`. Report `naturalWidth / boxWidth`.
- Open every screenshot before reporting. Unopened evidence is not evidence.
- Reduced motion: `page.emulate_media(reduced_motion="reduce")` must leave the
  headline, deck, CTAs and spec strip visible and untransformed.
```

Do not install third-party skill packs unless the host publishes a real manifest
at `/.well-known/skills/` and the SKILL.md files parse. A malformed skill silently
does nothing, which is worse than no skill.

### 10.5 Other tooling

```sh
python -m pip install --upgrade pillow numpy scipy pyvista trimesh opencv-python
python -m playwright install chromium          # browser for both Python and MCP
npx --yes playwright@latest install chromium   # if node-side Playwright is used
ffmpeg -version                                # screen recordings
```

Optional, only if already available or trivially installable: Blender (route A),
ImageMagick (`magick` for fast knockouts/thresholds), `optipng`. Do not install a
package manager to install a tool you will not use.

**Tooling must not be published.** `_config.yml` currently excludes `.git`,
`.gitignore`, `README.md`, `LICENSE`, `output`. Add the new working files:

```yaml
exclude:
  - .git
  - .gitignore
  - README.md
  - LICENSE
  - output
  - tools
  - node_modules
  - .opencode
  - opencode.jsonc
  - handoff.md
```

Verify after the next deploy: `https://iamdarshg.github.io/handoff.md` must 404.

---

## 11. Execution model: critic → fix swarm, not vibes

Do not "make it look nice" in one pass. Run a loop of *measure → accuse → repair →
re-measure*, with a hard cap so it terminates.

**One cycle:**

1. **Render.** Capture hero at 1440×900, 1024×800, 768×900, 390×844; scroll 0 and
   pinned; plus full-page. Save under `output/pass-<n>/`.
2. **Critic (parallel, 2–3 instances, different lenses).** Same screenshots, distinct
   briefs — never the same brief twice:
   - *Composition critic*: focal point, weight, dead space, eye path, fold.
   - *Craft critic*: resolution, halation, edge quality, material believability,
     colour cast, "does this look like a product photo or a screenshot".
   - *Copy/CTA critic*: does the first screen sell in one read; do the CTAs promise
     something the page actually delivers.
3. **Merge.** Dedupe, rank P0/P1/P2. Any P0 (illegible, broken, dishonest, overflow)
   jumps the queue. Cap the batch at **3 P0/P1 fixes per cycle** — more than that and
   you cannot attribute what worked.
4. **Fix (parallel where files do not overlap).** One `fixer` per finding. Findings
   touching `index.html` hero CSS must run **serially** — concurrent edits to the same
   region corrupt the file.
5. **Verify.** `verifier` + §6. Compare before/after numerically. If a fix does not
   measurably improve or is not visible in the screenshot, **revert it**.
6. **Log.** Append to `output/pass-log.md`: cycle, findings, fix, measurement,
   verdict (kept / reverted). This file is the audit trail and is gitignored.
7. **Commit** when the tree is green, with a message naming the measured change.

Stop conditions (any one): zero P0/P1 remaining; three consecutive cycles with no
measurable improvement; or the hero source resolution ceiling is hit (§4 route A/B
required and unavailable). Then report and stop — do not keep polishing.

---

## 12. The un-attended loop

Objective function, in priority order. Never lose sight of it:
**(1) hero looks like a product; (2) nothing is broken; (3) the page is honest.**

Operating rules for the loop:

- **Never ask.** No clarifying questions, no "shall I proceed", no permission
  negotiation. The `question` permission is denied in config; treat a would-be
  question as a decision you must make and record in `output/pass-log.md`
  (decision + rationale + how to reverse).
- **Never idle.** If a task is blocked (missing asset, broken tool), pick the next
  item from §7 and proceed. Record the blocker; do not wait for a human.
- **Never widen scope.** Only §7 defects and §4's picture. Not a redesign.
- **Never lie.** If the hero is still soft, say so in the final report with the
  number (source px vs rendered px).
- **Always verify with your own eyes.** Screenshot, open it, then claim.
- **Always commit green.** Broken tree at the end of a cycle is a P0.

Cycle shape, repeated:

```
while (defects remain && cycles < 8):
    capture  →  3 critics  →  merge+rank  →  ≤3 fixes  →  verify  →  log  →  commit
    if no measurable change for 2 cycles: change approach (§4 route A→B→C)
```

Re-entry after a context reset: re-read this file, `git log -3`,
`output/pass-log.md`, `output/` latest screenshots. Resume at the first unmet
condition in §9. Do not re-derive the design system.

Termination report must contain: source-image dimensions and rendered display size,
which §4 route was used, the four hero screenshots, the §6 pass/fail table, the
commit SHA, and the live-URL re-check result.