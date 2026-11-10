# Handoff — iamdarshg.github.io

**Written:** 2026-11-10 · **Repo:** `iamdarshg/iamdarshg.github.io` · **Live:** https://iamdarshg.github.io/
**Branch:** `main` — every push deploys to GitHub Pages.

This document is the operating manual for one autonomous run. It assumes no prior
conversation. §13 contains the kickoff prompt; everything before it is why the prompt
says what it says.

---

## 0. The job in one sentence

Make the first viewport look like a **product**, not a CAD export. The current hero is a
**322 × 502 px** render scaled up ~2.2×, and that — not the CSS — is the ceiling on
quality. Everything else on the site is already serviceable. Do not rebuild it.

---

## 1. What the site is

A static portfolio that sells **Darsh Gupta** (Grade 12, NPS HSR, Bengaluru, CBSE PCMC)
to **university admissions readers**. It is not a link hub and not a résumé. The homepage
is a product launch; Projects is an engineering journal.

| File | Role |
|---|---|
| `index.html` | Product launch: pinned hero, evidence, work index, about, reviewer close |
| `projects.html` | Build log / engineering journal (repo feed + case notes) |
| `education.html` | Grade 12, coursework, timeline, research rows |
| `interests.html` | Ruled editorial essay |
| `contact.html` | Contact |

Shared: `assets/css/shared.css` (tokens, header, footer, furniture),
`assets/js/app.js` (all behaviour), `_config.yml` (Jekyll, with the publish `exclude` list).

**Preview:** `python -m http.server 8899 --bind 127.0.0.1` from the repo root →
`http://127.0.0.1:8899/`. There is no Ruby/Jekyll locally; GitHub Pages does the real
build. Never call a local preview "the live site".

---

## 2. Art direction — decided, not up for debate

**Technical publication on ink.** A printed engineering brief: paper-white figure plates,
one cyan accent used only for claims and measures, an editorial serif for the human voice,
mono for every number.

- Ink `#05080f`, hero field `#050b12`. Text `#eaf4ff`, muted `#93a4ba`, faint `#5c6b82`.
- `--accent: #2ad4ff`. One accent only. Cyan marks claims, counters, rules, hovers.
- Type: `Space Grotesk` (display/sans), `Newsreader` (editorial), `IBM Plex Mono` (data),
  one `@import` at the top of `shared.css`.
- Container 1200px. Hero rail: `left: max(24px, calc((100vw - 1200px)/2))` → 120px at 1440.
- Headline is fixed in this exact shape:
  `I build it.<br /> Then I <em>prove it.</em>` — `<em>` cyan + `white-space:nowrap`.
- Motion: one scroll-driven scene, 180vh, pinned, reversible, fully suppressed under
  `prefers-reduced-motion` while leaving content readable.

Banned: stat cards, invented metrics, decorative gradients, glassmorphism, stock
photography, dashboard chrome, "passionate developer" copy.

---

## 3. Hero anatomy

`index.html:617` → `<section class="launch-scene">` > `.launch-stage` (sticky, `100svh`,
`min-height:640px`, `overflow:hidden`, `isolation:isolate`):

```
.launch-grid                cyan grid, masked, z-index -1
.launch-object              absolute, right rail, z-index 2
  img.object-part--main     THE SUBJECT — single swap point (index.html:636)
  .object-ring--one/two     thin cyan reticles
.launch-copy--top           eyebrow, h1, deck, 2 CTAs, spec strip
.launch-copy--bottom        "FIG. 01 — EDF intake study · rotor, stator, split inlet"
```

CSS is inline in `index.html`: scene ≈ 384–470, ≤980px flattening ≈ 540–580.
Measured at 1440×900:

| element | box |
|---|---|
| `.launch-stage` | 0 → 900 (pinned) |
| `.launch-object` | top 168, bottom 840, left 740, **709 × 673** |
| `h1` | y ≈ 171 |
| `.hero-spec` | y 594 → 607 |
| `.launch-copy--bottom` | 812 → 828 |

Swap = one `data-src` plus `width="1200" height="1040"`. Change the integers with the
asset or the layout shifts.

`.launch-scene` is `height:180vh; margin-top:calc(-1 * var(--hero-pull))`.
`setupHeroOffset()` (`app.js` ≈ 65) measures the scene's document offset, writes
`--hero-pull`, drops it below 981px, and re-measures on resize and `fonts.ready`. That is
what makes the scene start at y=0 instead of y=125. **Never hardcode it.**

`setupScrollMotion()` (≈110) derives progress from the scene rect and transforms
`.launch-copy`, `.launch-object` and the story sections; reduced motion early-returns and
restores visible state. `setupReveals()` deliberately excludes `.launch-scene` — a
transformed ancestor kills `position:sticky`. Never add `.reveal` or a transform to the
scene or its ancestors.

---

## 4. The real problem: the picture

`assets/images/field/hero-edf-stage.webp` is 1200×1040, 263 KB, alpha — but it was
composited in PIL from `rotor-drum-clean.png`, which is **322 × 502 px**. At 1440 the
object box is 709 CSS px wide, so the source is upsampled ~2.2× and then smoothed again by
the browser. That is why it reads soft, plastic and slightly fake. Rim light, grain, halo
and vignette cannot fix a 322px source; **fix the source**.

The subject is a **five-stage electric ducted fan**: five rotor/stator discs on a central
hub, white casings, **green blades**, **copper vanes**, **three blue rods** below. A real
sub-assembly of a real build. There is **no product photograph of it in this repo**.

Inventory, `assets/images/field/` (verified):

| file | size | what it is |
|---|---|---|
| `rotor-drum-clean.png` | **322×502 RGBA** | current hero source; too small |
| `rotor-stack-clean.png` | 368×555 RGBA | taller stack, same problem |
| `edf-cutout.png` | **1649×1011 RGBA** | largest single-object cutout, isometric |
| `05_EDF_A_rotor_stator_closeup_R030-cutout.png` | 1568×1014 RGBA | closeup, transparent |
| `05_EDF_A_rotor_stator_closeup_R030.png` | 1500×950 RGB | same with white bg + burned-in CAD title block |
| `07_rotor_R1_hub_blade_assembly_detail_R030-cutout.png` | 1570×977 RGBA | detail cutout |
| `edf-b-rotor-closeup.png` | 1500×950 RGB | white bg, annotation burned in |
| `edf-front-projection.png` | 1500×950 RGB | orthographic rotor plan — a figure, not a hero |
| `edf-inlet-side/top.png` | 1500×950 | 2D routing schematics, near-empty |
| `01_full_assembly_isometric_R030.png` | 1500×950 RGB | whole aircraft, small, on white |
| `polar_compare.png` | 1210×440 | **CL vs α, Wing3d vs OpenFOAM** — the evidence plot |
| `smoke_cp.png` | 900×600 | Cp surface, false colour |
| `IMG_9F899C38-…jpeg` | 1178×1571 | ESP-32 breadboard photo — **rejected as hero** |
| `airshow_*` | 1473×1213 / 1587×542 | generated geometry + metrics panels |

Rules:

1. Never build a hero from a white-background render with a burned-in CAD title block.
   The annotation is in the pixels; cropping leaves a tilted object.
2. Never present a render, composite or generated image as a photograph of his hardware.
   If it is a render, the caption says render.
3. Green/copper/blue is default-CAD, not art direction. Either lean in as *a parts
   diagram* (flat, labelled, ink-on-paper) or replace with one material story. Not both.
4. Acceptance is visual at 1440 and 390, at scroll 0 **and** pinned.

Routes, best first:

- **A. Re-render from CAD.** Highest ceiling. The model is not in this repo — search the
  machine for `.step .stp .stl .obj .blend .3mf`. Blender is not installed by default, but
  `trimesh`, `vtk`, `pyvista`, `moderngl` and `torch` usually are, so an offscreen PBR
  render is achievable in pure Python:
  `pv.Plotter(off_screen=True, window_size=(2400,2400))` + `enable_ssao()` + PBR +
  explicit `camera_position` + a 3-light rig, saved with alpha.
- **B. Real photograph.** One 2400px frame of the printed drum on a dark surface under a
  single hard light beats every render here. Cost: one `data-src` and two integers.
- **C. Technical plate.** If A and B are impossible, stop pretending: single ink + cyan
  duotone, fine halftone or hard threshold, CAD section lines as design, typography
  carrying the drama. Honest, distinctive, buildable with PIL today.

---

## 5. Verified machine facts (reference machine)

| tool | status |
|---|---|
| Python 3.12 + PIL 10.3 | yes — the workhorse |
| numpy 2.2, scipy 1.16, matplotlib 3.9 | yes |
| trimesh 4.10, pyvista 0.46, vtk 9.3, moderngl 5.12 | **yes — offscreen 3D is possible** |
| torch 2.9 (+cu130), opencv 4.12 | yes |
| Node 22 | yes — `node --check assets/js/app.js` is a real gate |
| ffmpeg | yes |
| Blender / ImageMagick / Ruby / Jekyll / Bundler | **no** |

- Playwright MCP is broken there (`ENOTDIR: … mkdir '…\ms-playwright'`). Workaround:
  Python Playwright with system Edge. On a fresh machine, install it properly (§10.1).
- **Playwright MCP is not optional.** No browser evidence = no verification = no claims.
- `gh` is authenticated as `iamdarshg` with `repo` scope. **`tannmay-python` holds write
  (push) access** — invite pending at
  `https://github.com/iamdarshg/iamdarshg.github.io/invitations`.
- `output/` is gitignored; it currently holds a large Playwright profile dump. Ignore it.

---

## 6. Concrete gates — the only legitimate source of work

A gate is a script that prints `PASS`/`FAIL` and a number. Gates, not opinions, decide
what gets dispatched. A FAIL with a number needs no debate; an opinion needs a critic
and a ranking.

| # | Gate | Threshold | How it is measured |
|---|---|---|---|
| **G1** | Hero source ratio | `naturalWidth / boxWidth ≥ 2.0` at 1440 | `naturalWidth` of `.object-part--main` ÷ its rect width |
| **G2** | Hero real detail | source rendered/photographed ≥ 1418 px wide | the asset's origin is a render/photo at that size, **not** an upscale |
| **G3** | Layout integrity | `scrollWidth − clientWidth = 0` | 5 pages × 4 viewports (1440/1024/768/390) |
| **G4** | Runtime integrity | 0 console errors, 0 responses ≥ 400, 0 broken images | page listeners during load + scroll |
| **G5** | Semantics | exactly 1 `h1`; both hero CTAs tab-reachable with a visible ring | DOM count + keyboard walk |
| **G6** | Fold composition | at 390: CTA bottom < 700px. At 1440: gap between `.hero-spec` bottom and `.launch-copy--bottom` < 120px | rects |
| **G7** | Motion | reduced-motion load leaves h1, deck, CTAs, spec visible and untransformed; transforms reversible on scroll back to 0 | `emulate_media(reduced_motion="reduce")` + scroll diff |
| **G8** | Honesty | no metric without a source; polar copy states the gap; a render is captioned as a render | manual read of the rendered page |
| **G9** | Publish | live URL passes G3–G7; `/handoff.md` returns 404; no 4xx on assets | live run after deploy |

G1 and G2 are the point of the whole run. G1 currently reads **1.69**, and G2 fails
because the real detail is 322 px. Nothing else you do outweighs fixing those two.

---

## 7. Known defects, ranked

1. **G1/G2 fail** — hero upscaled 2.2× (§4). *The* defect.
2. **G6 at 1440** — ~200px of dead ink between the spec strip (y≈600) and the FIG. 01
   caption (y≈812). Fix with composition (raise the object, add a measure, move the
   caption), never filler.
3. **G6 at 390** — the drum occupies ~269px of a 359px box and does not own the fold.
4. **Caption contrast** — `#c7d5e2` at 10.5px; legible, not strong.
5. **Hero is dark-mode-only** (`#050b12`) while the rest themes to `#f5f8fc` in light mode.
   Verify the bottom seam still reads as intentional.
6. **Spec strip at 360px** wraps against the edge with no separators. Add a wrap rule
   before adding a fourth item.

---

## 8. Do not

- Do not reset, clean or discard working-tree changes; `git status` first.
- Do not replace the homepage layout or add sections.
- Do not use the ESP-32 breadboard photo as hero imagery.
- Do not claim Wing3d matches OpenFOAM. On the polar plot the OpenFOAM RANS points sit
  **below every Wing3d curve** and the mesh is coarse. The copy states a gap; the gap stays.
- Do not invent metrics, awards or numbers. Real facts only: Grade 12 · NPS HSR · CBSE
  PCMC; Wing3d (TSD vs OpenFOAM, CL ± band); Copperline (C++20 PCB autorouter); Code-SDR
  (LIF-MD6000, 105 MSPS); RCS surrogate paper draft; HMUN 2023/2024; IIT Techfest MUN;
  Astro Space Camp 2023/2024; Skill Titans top-50; Minvayu FabLab internship; cAIpher
  hackathon.
- Do not add tracking, frameworks or a build step. Plain HTML/CSS/JS, Jekyll-safe,
  root-relative paths (`baseurl` is empty).
- Do not publish `output/`, `reels-notes.md`, `handoff.md`, `tools/`, `.opencode/`,
  `opencode.jsonc`, `node_modules/`.

---

## 9. Model topology

Three tiers, three jobs. Do not collapse them.

| tier | model | role |
|---|---|---|
| **Lead** | `anthropic/claude-opus-5-5` | Owns the gate sweep, ranking, dispatch, commits, final report. Writes no code except glue, and never while a worker is mid-edit on the same file. |
| **Orchestrators** | `anthropic/claude-opus-5-5` | One per workstream (hero subject / composition / copy). Owns its stream's gates, dispatches Sonnet workers, decides when to escalate. Max 3 concurrent. |
| **Workers** | `anthropic/claude-sonnet-5-5` | Implements exactly one gate failure or one critic finding, then verifies it. Also runs the gates and the screenshots. |
| **Critics** | `anthropic/claude-sonnet-5-5` | Three lenses, read-only, parallel. Never the same brief twice. |
| **Fable fixer** | `anthropic/claude-fable-5-2` | Taste surgery. Deployed only on escalation (see ladder). Max 2 per run. |
| **Fable advisor** | `anthropic/claude-fable-5-2` | Counsel when stuck or when the call is a matter of taste. Read-only. Max 3 consults per run. |

`anthropic/` is canonical; `opencode/claude-*` and `surplus/claude-*` are the same models
on other providers. Resolve at runtime with `opencode models | grep -i opus`, and drop
`#variant` if the provider needs one.

### Escalation ladder — exactly when Fable is allowed to run

```
gate FAIL with a number            -> Sonnet worker. No escalation possible.
Sonnet critic P0/P1                -> Sonnet worker.
same finding fails 2x              -> its Opus orchestrator takes it directly.
same finding fails 3x, OR the fix   -> Fable FIXER, once. Brief must include the two
  needs a taste judgement            failed diffs and the measured result of each.
(composition, material, palette,
 type scale, copy voice)
direction genuinely ambiguous, or   -> Fable ADVISOR. Brief must include: goal,
  two orchestrators disagree          constraints, evidence, 2-3 candidate directions,
                                      and one sharp question.
```

Hard budget: **2 Fable-fixer deployments and 3 Fable-advisor consults per run.** When the
budget is spent, Opus decides and the decision is logged as
`TASTE-DECISION | what | why | reversible how`. If a Fable model is unavailable on the
provider, log `FABLE-UNAVAILABLE`, fall back to Opus, and continue — never stall.

Every Fable call must be a **single, dense brief**, not a conversation. It returns a
decision or a patch, not an essay. Its output is advisory: the lead owns the commit.

---

## 10. Bootstrap — install before you design

### 10.1 MCP servers

```sh
opencode mcp add playwright --global -- bunx @playwright/mcp@latest
opencode mcp add filesystem --global -- npx -y @modelcontextprotocol/server-filesystem "$HOME"
opencode mcp add thinking   --global -- npx -y @modelcontextprotocol/server-sequential-thinking
opencode mcp add context7   --global --url https://mcp.context7.com/mcp
opencode mcp list
```

Conditional, only if you will actually call them:

```sh
# GitHub PR/issue access without shelling out (token from env, never hardcoded)
opencode mcp add github --global --url https://api.githubcopilot.com/mcp/ \
  --header 'Authorization=Bearer {env:GITHUB_PAT}'
# Real 3D authoring, ONLY if Blender is installed and the addon is running
uvx blender-mcp
```

- `opencode mcp list` must show every server **connected** before design work starts.
  Complete any OAuth sign-in now, once, via `/mcps`, or disable the server with
  `"disabled": true`. Never leave a server that will prompt mid-run.
- Do not add an MCP you will not call; each costs context on every turn.
- If a package name is unverifiable, skip it and say so.
- Confirm the tool surface appears after connecting, not just that the process started.

### 10.2 Skills

Create `.opencode/skills/` with three skills; the full text is in §12. Register the path:

```jsonc
{ "skills": ["./.opencode/skills"] }
```

Do not install third-party skill packs unless the host publishes a real manifest at
`/.well-known/skills/` and every `SKILL.md` parses. A malformed skill silently does
nothing, which is worse than none.

### 10.3 Tooling

```sh
python -m pip install --upgrade pillow numpy scipy matplotlib pyvista trimesh opencv-python playwright
python -m playwright install chromium
npx --yes playwright@latest install chromium
ffmpeg -version
```

Optional, only if already available or trivially installable: Blender (route A),
ImageMagick (`magick`), `optipng`. Do not install a package manager to install a tool you
will not use.

### 10.4 Config

Merge into `opencode.jsonc` at the repo root — never clobber an existing file.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "lead",

  // Never stop to ask. The base policy already allows shell/edit/webfetch/subagent
  // and every MCP tool; these rules close the only two gaps: the question tool and
  // .env reads.
  "permissions": [
    { "action": "question", "resource": "*", "effect": "deny" },
    { "action": "read", "resource": "*.env", "effect": "allow" },
    { "action": "read", "resource": "*.env.*", "effect": "allow" }
  ],

  "skills": ["./.opencode/skills"],
  "experimental": { "subagent_depth": 3, "todo": true },

  "agents": {
    "lead": {
      "mode": "primary",
      "model": "anthropic/claude-opus-5-5",
      "description": "Owns gates, ranking, dispatch, commits and the final report",
      "system": "You are the lead. You do not write feature code while workers are active. You run the gate sweep, rank failures, dispatch workers and orchestrators, enforce the Fable budget, and commit only green trees. Never ask questions. Never report unverified work.",
      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }]
    },
    "orchestrator": {
      "mode": "subagent",
      "model": "anthropic/claude-opus-5-5",
      "description": "Runs one workstream: hero subject, composition, or copy",
      "system": "You own one workstream. Dispatch Sonnet workers per gate failure. Escalate to the Fable fixer only after two failed attempts, and only for taste-level surgery. Report measurements, not impressions. Never ask questions.",
      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }]
    },
    "worker": {
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-5-5",
      "description": "Implements exactly one gate failure or critic finding, then verifies it",
      "system": "Implement exactly one assigned item with the minimum diff. Do not touch unrelated code. Then run the gate and report the before/after number. Never ask questions.",
      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }]
    },
    "critic": {
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-5-5",
      "description": "Adversarial critic, read-only, one lens per instance",
      "system": "Judge the rendered page, never the source. Report only defects a paying client would notice: file:line, severity P0/P1/P2, one-line fix, screenshot evidence. Never edit. Never ask questions. If it is good, say so and stop.",
      "permissions": [
        { "action": "edit", "resource": "*", "effect": "deny" },
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    },
    "verifier": {
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-5-5",
      "description": "Runs gates and browser evidence; returns numbers, not opinions",
      "system": "Run the gate suite and capture screenshots at 1440/1024/768/390, scroll 0 and pinned. Return PASS/FAIL with numbers and image paths. Never edit. Never ask questions.",
      "permissions": [
        { "action": "edit", "resource": "*", "effect": "deny" },
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    },
    "fable-fixer": {
      "mode": "subagent",
      "model": "anthropic/claude-fable-5-2",
      "description": "Taste-level repair after Sonnet and Opus have both failed",
      "system": "You receive one stuck finding, two failed diffs and their measurements. Produce the smallest change that makes the artifact good, not merely compliant. Return the patch or the exact CSS block. Do not refactor. Do not explain at length. Never ask questions.",
      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }]
    },
    "fable-advisor": {
      "mode": "subagent",
      "model": "anthropic/claude-fable-5-2",
      "description": "Counsel on direction and taste; read-only, max three consults",
      "system": "You receive a dense brief: goal, constraints, evidence, candidate directions and one sharp question. Answer with a decision and the two strongest reasons. Do not restate the brief. Never edit. Never ask questions.",
      "permissions": [
        { "action": "edit", "resource": "*", "effect": "deny" },
        { "action": "question", "resource": "*", "effect": "deny" }
      ]
    }
  }
}
```

Notes that matter:

- Denying the `question` action is what makes "never asks" true: it removes the tool.
- `subagent_depth: 3` is what lets an Opus orchestrator dispatch a Fable fixer; the
  default of 1 collapses the swarm into a single call.
- Build the swarm on these named agents. Never on `general`, which denies subagents and
  questions by design.
- If a Fable model is not available, the config still parses — the call fails at runtime.
  Detect it on the first attempt and log `FABLE-UNAVAILABLE`.

---

## 11. The loop

```
lead: capture -> gates -> rank -> dispatch -> verify -> log -> commit
      repeat while any P0/P1 remains, max 8 cycles
```

Each cycle:

1. **Capture.** Screenshots at 1440×900, 1024×800, 768×900, 390×844; scroll 0 and
   pinned (~300px); plus full page. Save to `output/pass-<n>/`.
2. **Gate.** Run G1–G8. Numbers into `output/pass-log.md`. A gate FAIL is an instruction,
   not a discussion.
3. **Accuse.** Only where no gate fires: 3 Sonnet critics in parallel with distinct briefs
   — *composition*, *craft*, *copy+CTA*. Each returns `file:line`, P0/P1/P2, one-line
   fix, screenshot evidence.
4. **Merge.** Dedupe, rank; P0 jumps the queue. Discard anything invisible in a screenshot.
   Cap the batch at **3 fixes per cycle** so you can attribute the result.
5. **Dispatch.** One `worker` per item. Parallel only if the files differ. Two agents in
   the same region of `index.html`'s inline CSS corrupt it — serialise those. Cap 3
   concurrent workers.
6. **Escalate** per §9's ladder. Fable fixer only on the third failure or a taste call;
   Fable advisor only when direction is genuinely ambiguous. Budgets are hard.
7. **Verify.** Re-run the gates, re-open the screenshots. If the fix does not move a
   number or is invisible at 1440, **revert it** and log `REVERTED`.
8. **Log.** `output/pass-log.md`: cycle, finding, fix, measurement, verdict, commit SHA,
   and any `DECISION`/`TASTE-DECISION`/`FABLE-UNAVAILABLE` markers.
9. **Commit** only green, with a message naming the measured change.

Stop when any is true: zero P0/P1; two consecutive cycles with no measurable improvement;
G1/G2 are unfixable because routes A and B are both proven unavailable. Then write the
notice in §14 and stop. Do not polish past the ceiling.

Re-entry after a context reset: read this file, `git log -3`, `output/pass-log.md`, and the
latest `output/pass-*/` screenshots. Resume at the first unmet gate.

---

## 12. Skill files (write verbatim)

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
- Light: one key ~35 deg camera-left-above, one cool rim from behind-right, one fill
  at 8%. Contact shadow, slight floor occlusion. No flare, no bloom halo.
- Background: transparent alpha over the hero field. Never composite onto white.
- Framing: silhouette centred on the hero optical line; the three base rods must
  terminate above the fold; 8-12% clear margin on the right so the object does not
  collide with the reticles.
- Honesty: the caption says render if it is a render. Never claim a photograph.
```

`.opencode/skills/critic-rubric/SKILL.md`

```markdown
---
name: critic-rubric
description: Scoring rubric for judging the rendered page. Use for every critic
  pass and for self-review before claiming a pass is done.
---
Score 1-5, cite a screenshot, never the source:
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
description: Collect screenshots and hard measurements from the local preview or
  the live site. Use for every verification pass.
---
- Serve: python -m http.server 8899 --bind 127.0.0.1 from the repo root.
- Viewports: 1440x900, 1024x800, 768x900, 390x844. Capture scroll 0 and pinned
  (~300 px). Save to output/pass-<n>/.
- Assert: scrollWidth === clientWidth; exactly one h1; zero images with
  complete && !naturalWidth; zero responses >= 400; zero console errors.
- Measure the hero: .launch-object and .launch-copy--bottom rects, plus
  naturalWidth of .object-part--main. Report naturalWidth / boxWidth.
- Open every screenshot before reporting. Unopened evidence is not evidence.
- Reduced motion: emulate_media(reduced_motion="reduce") must leave the headline,
  deck, CTAs and spec strip visible and untransformed.
```

---

## 13. Kickoff prompt

Paste this on the target machine, in a fresh session, with the repo cloned and the model
topology available.

```text
You are the LEAD of an autonomous run on a static portfolio that sells a 17-year-old
engineer to university admissions readers. Repo: https://github.com/iamdarshg/iamdarshg.github.io
Live: https://iamdarshg.github.io/   Branch: main (pushes deploy to GitHub Pages).

Clone, read handoff.md end to end, then read _config.yml, index.html (inline <style>
380-590, hero markup 617-646), assets/js/app.js, assets/css/shared.css. Then open the
live site at 1440x900 and 390x844 and look at it before writing anything.

=== OPERATING CONTRACT ===
You are autonomous. Never ask a question, never wait for approval, never say "shall I
proceed". There is no human until the final report.
Ambiguity -> decide, act, log `DECISION | what | why | reverse how` in output/pass-log.md.
Blocker -> log it, take the next gate, continue. Never stall on a missing tool: install it
or route around it and say which.
Never claim a fix without a before/after number. Never claim a pass without opening the
screenshot. Never present a render or generated image as a photograph. Never invent a
metric. Never rewrite the headline.

=== MODEL TOPOLOGY (you are the top of it) ===
LEAD = you, Opus 5.5. Gate sweep, ranking, dispatch, commits, final report. You do not
write feature code while a worker is editing the same file.
ORCHESTRATORS = Opus 5.5, max 3 concurrent, one per workstream: hero subject,
composition, copy. Dispatch Sonnet workers, own their stream's gates, decide escalation.
WORKERS = Sonnet 5.5. Exactly one gate failure or one critic finding each, minimum diff,
then verify and report the number.
CRITICS = Sonnet 5.5, read-only, three lenses in parallel: composition, craft, copy+CTA.
VERIFIER = Sonnet 5.5, read-only, numbers only.
FABLE FIXER = Fable 5.2, max 2 per run. Taste surgery after two failed Sonnet/Opus
attempts, or when the fix is genuinely a taste call (material palette, composition,
type scale, copy voice). Brief it with the two failed diffs and their measurements.
FABLE ADVISOR = Fable 5.2, max 3 per run. Only when direction is ambiguous or two
orchestrators disagree. One dense brief: goal, constraints, evidence, 2-3 candidate
directions, one sharp question. It answers with a decision and two reasons. Read-only.
If a Fable model is unavailable: log FABLE-UNAVAILABLE, fall back to Opus, continue.

=== PHASE 0 - AUDIT (paste into output/pass-log.md) ===
  uname -a || ver ; python --version ; node --version ; git --version ; gh auth status
  where blender || which blender ; where magick || which magick ; ffmpeg -version
  opencode --version ; opencode mcp list
  python -c "import PIL, numpy, trimesh, pyvista" 2>&1 | tail -3

=== PHASE 1 - TOOLING ===
  python -m pip install --upgrade pillow numpy scipy matplotlib pyvista trimesh opencv-python playwright
  python -m playwright install chromium
  npx --yes playwright@latest install chromium
Install ffmpeg if absent and you can. Optional and only if trivial: Blender (best hero
ceiling), ImageMagick, optipng. No frameworks, no bundlers, nothing added to the site.

=== PHASE 2 - MCP SERVERS ===
  opencode mcp add playwright --global -- bunx @playwright/mcp@latest
  opencode mcp add filesystem --global -- npx -y @modelcontextprotocol/server-filesystem "$HOME"
  opencode mcp add thinking   --global -- npx -y @modelcontextprotocol/server-sequential-thinking
  opencode mcp add context7   --global --url https://mcp.context7.com/mcp
  opencode mcp list
Conditional only: github (api.githubcopilot.com/mcp/, token from {env:GITHUB_PAT}) and
blender-mcp (only if Blender is installed). Every server must read `connected` before
design work starts. Complete OAuth once via /mcps now, or set "disabled": true. Never
leave a server that will prompt mid-run. If a package is unverifiable, skip it and say so.

=== PHASE 3 - SKILLS ===
Write exactly three, verbatim from handoff.md §12, under .opencode/skills/:
hero-art-direction, critic-rubric, browser-evidence. Frontmatter needs name and
description ("Use when ..."). Register: { "skills": ["./.opencode/skills"] }.
No third-party skill pack unless it publishes /.well-known/skills/ and every SKILL.md parses.

=== PHASE 4 - CONFIG ===
Merge handoff.md §10.4 into opencode.jsonc. Non-negotiables:
  permissions: deny question (this is what makes "never asks" real), allow .env reads
  experimental.subagent_depth: 3   (without it an orchestrator cannot dispatch a Fable fixer)
  agents: lead, orchestrator, worker, critic, verifier, fable-fixer, fable-advisor
  models: anthropic/claude-opus-5-5, anthropic/claude-sonnet-5-5, anthropic/claude-fable-5-2
Resolve IDs with `opencode models | grep -iE "opus|sonnet|fable"` if the provider differs.
Build the swarm on these agents, never on `general`.

=== PHASE 5 - BASELINE ===
Serve locally on 8899. Capture output/pass-0/: hero at 1440/1024/768/390, scroll 0 and
pinned; full page at 1440 and 390; all five pages at both widths. Record G1-G8 with
numbers. G1 is the headline number: naturalWidth / boxWidth for .object-part--main.
On the reference machine it is 1200/709 = 1.69 with only 322 px of real detail beneath.

=== PHASE 6 - THE HERO (80% of the value) ===
Do not fix softness with glow, grain, bloom, halo, vignette or a heavier shadow. Those
are what made it look fake. Fix the source, in this order:
A. RE-RENDER. Search the machine for .step .stp .stl .obj .blend .3mf. If found: >=2400 px,
   transparent alpha, 3/4 view from just below the intake lip, one material story
   (anodised aluminium + carbon, kill the green/copper/blue CAD palette), key ~35 deg
   camera-left-above + cool rim behind-right + 8% fill + contact shadow. pyvista/vtk
   offscreen PBR is acceptable: pv.Plotter(off_screen=True, window_size=(2400,2400)),
   enable_ssao(), explicit camera_position, save alpha. Check faceting and floaters.
B. PHOTOGRAPH. A single 2400 px frame on a dark surface under one hard light beats every
   render. Swap = one data-src plus the two width/height integers at index.html:636.
C. TECHNICAL PLATE. If A and B are impossible, stop pretending: ink + cyan duotone,
   halftone or hard threshold, CAD section lines as design. Honest beats fake.
Then composition: the ~200 px dead band at 1440 (G6), the drum not owning the fold at 390
(G6), the quiet 10.5px caption. Composition, never filler.

=== PHASE 7 - THE LOOP (max 8 cycles) ===
capture -> gates -> [3 Sonnet critics in parallel, only where no gate fires] -> merge and
rank -> dispatch <=3 workers (serialise edits to the same CSS region) -> escalate per the
ladder -> verify -> log -> commit green.
Escalation: gate FAIL -> worker. Critic P0/P1 -> worker. Same finding fails twice -> its
Opus orchestrator. Fails three times, or it is a taste call -> Fable fixer, once, with the
two failed diffs and their numbers. Ambiguous direction or orchestrators disagree ->
Fable advisor, one dense brief. Budgets: 2 fixer, 3 advisor, hard.
Revert anything that does not move a number or is invisible at 1440.
Stop on: zero P0/P1; two cycles with no measurable improvement; or G1/G2 proven
unfixable because routes A and B are unavailable. Then write the report and stop.

=== PHASE 8 - PUBLISH ===
Ensure _config.yml excludes tools, node_modules, .opencode, opencode.jsonc, handoff.md,
output. Commit per cycle, never force-push, never reset --hard, never clean. Push to main,
wait for Pages, then re-run the gate suite against the LIVE URL. A green push is not proof
of deployment. Confirm /handoff.md returns 404 and no assets 4xx.

=== HARD CONSTRAINTS ===
Headline fixed: "I build it." then "Then I prove it." (cyan on the claim).
One accent #2ad4ff. Field #050b12/#05080f. Space Grotesk + Newsreader + IBM Plex Mono.
1200px container, hero rail max(24px, (100vw-1200px)/2).
No new sections, no stat cards, no dashboards, no invented metrics, no stock imagery,
no tracking, no framework, no build step. Jekyll-safe, root-relative paths.
Never the ESP-32 breadboard photo as hero. Never claim Wing3d matches OpenFOAM: the
OpenFOAM RANS points sit below every Wing3d curve and the mesh is coarse; the gap stays.
Never add .reveal or a transform to .launch-scene or its ancestors; never hardcode
--hero-pull. Reduced motion must leave content visible and untransformed.

=== FINAL REPORT ===
HERO SOURCE   original px -> rendered CSS px -> ratio -> route used (A/B/C)
ROUTE PROOF   what exists now, real dimensions, file size
CLOSED        defects closed with before/after measurements
OPEN          defects open, why, what would close them
GATES         G1-G9 x 5 pages x 2 viewports, PASS/FAIL table
EVIDENCE      paths to hero screenshots (4 widths x 2 states) + full-page shots
DEPLOY        commit SHA, Pages status, live re-check result
LEDGER        Fable fixers used (n/2), advisors used (n/3), decisions logged
HONESTY       one paragraph, plainly: what still looks weak and why. Do not soften it.

Start now: clone, read handoff.md, audit, install, look at the page, then run the loop.
```

---

## 14. Definition of done

- **G2** passes: the hero's real detail is ≥1418 px wide, produced by a render or a
  photograph, not an upscale. **G1 ≥ 2.0.**
- One focal point, one statement, two CTAs in the first viewport; no dead interval
  longer than ~120px; subject owns the upper third at 390 and CTAs sit above 700px.
- G3–G8 pass on all five pages at 1440 and 390, live as well as local.
- Reduced motion readable; motion reversible; caption truthful.
- Pushed to `main`, Pages green, live URL re-verified, `/handoff.md` 404.
- Final report written in the shape above, including the honesty paragraph.

If G2 cannot be met because no CAD source and no photograph exist, the deliverable is
route C, and the report says so in the first line. A good technical plate is a pass. A
soft fake product shot is a fail.
