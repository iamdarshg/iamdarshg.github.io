# Handoff — iamdarshg.github.io

**Written:** 2026-11-10 · **Repo:** `iamdarshg/iamdarshg.github.io` · **Live:** https://iamdarshg.github.io/
**Branch:** `main` — every push deploys to GitHub Pages.

This document is harness-agnostic. It states **outcomes and constraints**, then gives one
worked wiring (OpenCode) as a reference. Any agent with file access, a shell, and
subagent support can execute it; an agent without subagents runs in degraded mode (§9.4).

§13 is the kickoff line. Everything before it is why that line is enough.

---

## 0. The job in one sentence

Make the first viewport look like a **product**, not a CAD export. The current hero is a
**322 × 502 px** render scaled up ~2.2×, and that — not the CSS — is the ceiling on
quality. The rest of the site is serviceable. Do not rebuild it.

---

## 1. What the site is

A static portfolio that sells **Darsh Gupta** (Grade 12, NPS HSR, Bengaluru, CBSE PCMC)
to **university admissions readers**. Not a link hub, not a résumé. The homepage is a
product launch; Projects is an engineering journal.

| File | Role |
|---|---|
| `index.html` | Product launch: pinned hero, evidence, work index, about, reviewer close |
| `projects.html` | Build log / engineering journal (repo feed + case notes) |
| `education.html` | Grade 12, coursework, timeline, research rows |
| `interests.html` | Ruled editorial essay |
| `contact.html` | Contact |

Shared: `assets/css/shared.css` (tokens, header, footer, furniture),
`assets/js/app.js` (all behaviour), `_config.yml` (Jekyll + publish `exclude` list).

**Preview:** serve the repo root over HTTP on port 8899 (`python -m http.server 8899`).
There is no Ruby/Jekyll locally; Pages does the real build. Never call a local preview
"the live site".

---

## 2. Art direction — decided, not up for debate

**Technical publication on ink.** A printed engineering brief: paper-white figure plates,
one cyan accent for claims and measures, an editorial serif for the human voice, mono for
every number.

- Ink `#05080f`, hero field `#050b12`. Text `#eaf4ff`, muted `#93a4ba`, faint `#5c6b82`.
- `--accent: #2ad4ff`. One accent only.
- Type: `Space Grotesk` (display/sans), `Newsreader` (editorial), `IBM Plex Mono` (data).
- Container 1200px. Hero rail `max(24px, calc((100vw - 1200px)/2))` → 120px at 1440.
- Headline fixed: `I build it.<br /> Then I <em>prove it.</em>` — cyan `em`, `nowrap`.
- Motion: one scroll-driven scene, 180vh, pinned, reversible, fully suppressed under
  `prefers-reduced-motion` while content stays readable.

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
`--hero-pull`, drops it below 981px, re-measures on resize and `fonts.ready`. That is what
makes the scene start at y=0 instead of y=125. **Never hardcode it.**

`setupScrollMotion()` (≈110) derives progress from the scene rect; reduced motion
early-returns and restores visible state. `setupReveals()` deliberately excludes
`.launch-scene` — a transformed ancestor kills `position:sticky`. Never add `.reveal` or a
transform to the scene or its ancestors.

---

## 4. The real problem: the picture

`assets/images/field/hero-edf-stage.webp` is 1200×1040, 263 KB, alpha — composited in PIL
from `rotor-drum-clean.png`, which is **322 × 502 px**. At 1440 the object box is 709 CSS
px, so the source is upsampled ~2.2× and smoothed again by the browser. That is why it
reads soft, plastic and slightly fake. Rim light, grain, halo and vignette cannot fix a
322px source. **Fix the source.**

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
| `05_EDF_A_rotor_stator_closeup_R030.png` | 1500×950 RGB | white bg + burned-in CAD title block |
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
2. Never present a render, composite or generated image as a photograph of his hardware.
3. Green/copper/blue is default-CAD, not art direction. Lean in as *a parts diagram*, or
   replace with one material story. Not both.
4. Acceptance is visual at 1440 and 390, at scroll 0 **and** pinned.

Routes, best first:

- **A. Re-render from CAD.** Highest ceiling. The model is not in this repo — search the
  machine for `.step .stp .stl .obj .blend .3mf`. Blender may be absent, but
  `trimesh`/`vtk`/`pyvista`/`moderngl`/`torch` are usually present, so offscreen PBR in
  pure Python works: `pv.Plotter(off_screen=True, window_size=(2400,2400))` +
  `enable_ssao()` + PBR + explicit `camera_position` + a 3-light rig, saved with alpha.
- **B. Real photograph.** One 2400px frame of the printed drum on a dark surface under a
  single hard light beats every render. Swap = one `data-src` plus two integers.
- **C. Technical plate.** If A and B are impossible, stop pretending: ink + cyan duotone,
  fine halftone or hard threshold, CAD section lines as design, typography carrying the
  drama. Honest, distinctive, buildable with PIL today.

---

## 5. Concrete gates — the only legitimate source of work

A gate is a script that prints `PASS`/`FAIL` and a number. Gates, not opinions, decide
what gets dispatched. A FAIL with a number needs no debate; an opinion needs a critic and
a ranking.

| # | Gate | Threshold | Measurement |
|---|---|---|---|
| **G1** | Hero source ratio | `naturalWidth / boxWidth ≥ 2.0` at 1440 | `naturalWidth` of `.object-part--main` ÷ rect width |
| **G2** | Hero real detail | ≥ 1418 px of real detail | asset originated as a render/photo at that size, **not** an upscale |
| **G3** | Layout integrity | `scrollWidth − clientWidth = 0` | 5 pages × 4 viewports (1440/1024/768/390) |
| **G4** | Runtime integrity | 0 console errors, 0 responses ≥ 400, 0 broken images | listeners during load + scroll |
| **G5** | Semantics | exactly 1 `h1`; both hero CTAs tab-reachable with visible ring | DOM count + keyboard walk |
| **G6** | Fold composition | 390: CTA bottom < 700px. 1440: gap `.hero-spec`→caption < 120px | rects |
| **G7** | Motion | reduced-motion leaves h1/deck/CTAs/spec visible and untransformed; reversible at scroll 0 | `reduced_motion="reduce"` + scroll diff |
| **G8** | Honesty | no metric without a source; polar copy states the gap; render captioned as render | read of the rendered page |
| **G9** | Publish | live URL passes G3–G7; `/handoff.md` 404; no asset 4xx | live run after deploy |

G1 and G2 are the point of the run. G1 currently reads **1.69**; G2 fails because the real
detail is 322 px. Nothing else outweighs fixing those two.

---

## 6. Known defects, ranked

1. **G1/G2 fail** — hero upscaled 2.2× (§4). *The* defect.
2. **G6 at 1440** — ~200px of dead ink between the spec strip (y≈600) and the FIG. 01
   caption (y≈812). Fix with composition, never filler.
3. **G6 at 390** — the drum occupies ~269px of a 359px box; it does not own the fold.
4. **Caption contrast** — `#c7d5e2` at 10.5px; legible, not strong.
5. **Hero is dark-mode-only** (`#050b12`) while the rest themes to `#f5f8fc` in light mode.
6. **Spec strip at 360px** wraps against the edge with no separators.

---

## 7. Do not

- Do not reset, clean or discard working-tree changes; `git status` first.
- Do not replace the homepage layout or add sections.
- Do not use the ESP-32 breadboard photo as hero imagery.
- Do not claim Wing3d matches OpenFOAM. On the polar plot the OpenFOAM RANS points sit
  **below every Wing3d curve** and the mesh is coarse. The copy states a gap; it stays.
- Do not invent metrics, awards or numbers. Real facts only: Grade 12 · NPS HSR · CBSE
  PCMC; Wing3d (TSD vs OpenFOAM, CL ± band); Copperline (C++20 PCB autorouter); Code-SDR
  (LIF-MD6000, 105 MSPS); RCS surrogate paper draft; HMUN 2023/2024; IIT Techfest MUN;
  Astro Space Camp 2023/2024; Skill Titans top-50; Minvayu FabLab internship; cAIpher
  hackathon.
- Do not add tracking, frameworks or a build step. Plain HTML/CSS/JS, Jekyll-safe,
  root-relative paths (`baseurl` empty).
- Do not publish `output/`, `reels-notes.md`, `handoff.md`, `tools/`, `.opencode/`,
  `node_modules/`, or any harness config.

---

## 8. Model topology

Three tiers, three jobs. Do not collapse them. Canonical IDs on Anthropic:
`claude-opus-5-5`, `claude-sonnet-5-5`, `claude-fable-5-2`. Resolve to whatever your
provider exposes (`.../claude-opus-5.5`, `surplus/...`, `openrouter/...`); the tier
matters, the vendor string does not.

| tier | model | role |
|---|---|---|
| **Lead** | Opus 5.5 | Gate sweep, ranking, dispatch, commits, final report. Writes no code while a worker is mid-edit on the same file. |
| **Orchestrators** | Opus 5.5 | One per workstream (hero subject / composition / copy). Owns its stream's gates, dispatches workers, decides escalation. Max 3 concurrent. |
| **Workers** | Sonnet 5.5 | Exactly one gate failure or one critic finding, minimum diff, then verify and report the number. |
| **Critics** | Sonnet 5.5 | Three lenses, read-only, parallel. Never the same brief twice. |
| **Fable fixer** | Fable 5.2 | Taste surgery only, on escalation. Max 2 per run. |
| **Fable advisor** | Fable 5.2 | Counsel when stuck or when the call is taste. Read-only. Max 3 consults per run. |

### 8.1 Escalation ladder — exactly when Fable runs

```
gate FAIL with a number        -> Sonnet worker. No escalation possible.
Sonnet critic P0/P1            -> Sonnet worker.
same finding fails 2x          -> its Opus orchestrator takes it directly.
same finding fails 3x, OR the  -> Fable FIXER, once. Brief must carry both failed
  fix is a taste judgement        diffs and the measured result of each.
(composition, material, palette,
 type scale, copy voice)
direction ambiguous, or two    -> Fable ADVISOR. One dense brief: goal, constraints,
  orchestrators disagree          evidence, 2-3 candidate directions, one sharp question.
```

Hard budget: **2 Fable-fixer deployments, 3 Fable-advisor consults per run.** When spent,
Opus decides and logs `TASTE-DECISION | what | why | reverse how`. If a Fable model is
unavailable, log `FABLE-UNAVAILABLE`, fall back to Opus, continue — never stall.

Every Fable call is a **single dense brief**, not a conversation. It returns a decision or
a patch, not an essay. Advisory only: the lead owns the commit.

### 8.2 Model roles must be enforced, not implied

If your harness supports named agents/subagents, define them explicitly and pin the model
per role. If it does not, state the tier at the top of every delegated task and keep the
work streams separate by file, so the discipline survives even without enforcement.

---

## 9. Capability contract — what the harness must provide

The doc is written against five capabilities. Names differ per harness; the outcomes do
not. §9.1–9.3 give the requirement; §9.4 is the degraded mode.

| capability | requirement | why it is not optional |
|---|---|---|
| **C1 Shell + file write** | run commands, edit files | nothing here is doable without it |
| **C2 Browser automation** | headless Chromium, screenshots, console + network capture | every gate is measured on a rendered page |
| **C3 Unattended execution** | no approval prompt on shell/edit/network | the loop cannot stop for a human |
| **C4 Subagents** | spawn ≥2 child agents, ≥2 levels deep | critic/fix swarm needs isolation + depth |
| **C5 Web fetch** | fetch URLs | docs, and live-site verification |

### 9.1 Servers to add

Preferred: browser automation as an MCP server (or the harness's native equivalent).
Install, then prove the tool surface exists by calling it once — a running process is not
a working tool.

| purpose | package | notes |
|---|---|---|
| browser | `@playwright/mcp` (`bunx`/`npx`) | screenshots, console, network, emulate media |
| filesystem | `@modelcontextprotocol/server-filesystem` | scope it to the repo, not `$HOME` |
| structured thinking | `@modelcontextprotocol/server-sequential-thinking` | optional, cheap, helps ranking |
| docs lookup | remote MCP `https://mcp.context7.com/mcp` | optional |
| GitHub | remote MCP `https://api.githubcopilot.com/mcp/` | only for PR/issue work; token from env |
| Blender | `blender-mcp` | only if Blender is installed and the addon runs |

Rules: add only what you will call (each costs context every turn); complete any OAuth
**once, before** the loop; disable rather than leave half-configured; skip unverifiable
package names and say so.

If the harness has **no MCP support**, satisfy the same outcomes with plain tools: a
Playwright/Puppeteer script for C2, `curl`/`web_fetch` for C5, `gh` for GitHub. Log the
substitution.

### 9.2 Reference wiring — OpenCode (verified, use if available)

```sh
opencode mcp add playwright --global -- bunx @playwright/mcp@latest
opencode mcp add filesystem --global -- npx -y @modelcontextprotocol/server-filesystem "$PWD"
opencode mcp list
```

`opencode.jsonc` — merge, never clobber:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "lead",
  "permissions": [
    { "action": "question", "resource": "*", "effect": "deny" },
    { "action": "read", "resource": "*.env", "effect": "allow" },
    { "action": "read", "resource": "*.env.*", "effect": "allow" }
  ],
  "skills": ["./.opencode/skills"],
  "experimental": { "subagent_depth": 3, "todo": true },
  "agents": {
    "lead":         { "mode": "primary",  "model": "anthropic/claude-opus-5-5",
                      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }] },
    "orchestrator": { "mode": "subagent", "model": "anthropic/claude-opus-5-5",
                      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }] },
    "worker":       { "mode": "subagent", "model": "anthropic/claude-sonnet-5-5",
                      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }] },
    "critic":       { "mode": "subagent", "model": "anthropic/claude-sonnet-5-5",
                      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" },
                                      { "action": "question", "resource": "*", "effect": "deny" }] },
    "verifier":     { "mode": "subagent", "model": "anthropic/claude-sonnet-5-5",
                      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" },
                                      { "action": "question", "resource": "*", "effect": "deny" }] },
    "fable-fixer":  { "mode": "subagent", "model": "anthropic/claude-fable-5-2",
                      "permissions": [{ "action": "question", "resource": "*", "effect": "deny" }] },
    "fable-advisor":{ "mode": "subagent", "model": "anthropic/claude-fable-5-2",
                      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" },
                                      { "action": "question", "resource": "*", "effect": "deny" }] }
  }
}
```

Two lines carry all the weight: denying the `question` action is what makes "never asks"
true (it removes the tool); `subagent_depth: 3` is what lets an orchestrator dispatch a
Fable fixer. Without the second, the swarm collapses to a single call.

### 9.3 Other harnesses — achieve the same three outcomes

1. **Never prompt.** Put the session in its full-auto / never-approve mode, or add
   allow-rules for shell, edit, and network. Disable the "ask the user" tool if one exists.
   An agent that can ask will ask.
2. **Pin models per role.** Named agent files (`.claude/agents/*.md`, `.codex/agents/*`,
   `.opencode/agents/*`) with the model in frontmatter. Roles: lead, orchestrator, worker,
   critic, verifier, fable-fixer, fable-advisor.
3. **Allow nesting.** Raise subagent depth to ≥2 if the harness exposes it; otherwise run
   streams sequentially and never let two writers touch the same file.

Verify with `--help` or the harness docs rather than guessing flag names, and record what
you actually set in `output/pass-log.md`.

### 9.4 Degraded mode — no subagents, or one model

Run the roles sequentially in one session: gate sweep as the lead, then a critic pass with
a written rubric (never the same lens twice in a row), then a fix pass, then verification.
Keep three artefacts so the discipline does not evaporate: `output/pass-log.md` (decisions
and measurements), `output/pass-<n>/` (screenshots), and one commit per cycle. State in the
final report that the run was degraded and which capabilities were missing.

---

## 10. Skills (write them, do not shop for them)

Skills are directories with a `SKILL.md` carrying YAML frontmatter (`name`, `description`).
Place them in the harness's skill directory, or write the same rules into your instructions
file if there is no skill system. Three, exactly:

| skill | enforces |
|---|---|
| `hero-art-direction` | source resolution floor, one material story, light rig, framing, honesty |
| `critic-rubric` | 1–5 scoring, screenshot evidence only, P0 definition, max 3 fixes/cycle |
| `browser-evidence` | viewports, assertions, hero measurements, "open the screenshot" |

Full text in §12. Do not install third-party skill packs unless the host publishes a real
manifest at `/.well-known/skills/` and every `SKILL.md` parses — a malformed skill silently
does nothing, which is worse than none.

---

## 11. The loop

```
lead: capture -> gates -> rank -> dispatch -> verify -> log -> commit
      repeat while any P0/P1 remains, max 8 cycles
```

Each cycle:

1. **Capture.** 1440×900, 1024×800, 768×900, 390×844; scroll 0 and pinned (~300px); plus
   full page. Save to `output/pass-<n>/`.
2. **Gate.** Run G1–G8, numbers into `output/pass-log.md`. A FAIL is an instruction, not a
   discussion.
3. **Accuse.** Only where no gate fires: 3 critics in parallel, distinct briefs —
   *composition*, *craft*, *copy+CTA*. Each returns `file:line`, P0/P1/P2, one-line fix,
   screenshot evidence.
4. **Merge.** Dedupe, rank; P0 jumps the queue. Discard anything invisible in a screenshot.
   Cap the batch at **3 fixes per cycle** so the result is attributable.
5. **Dispatch.** One worker per item; parallel only across different files. Two agents in
   the same region of `index.html`'s inline CSS corrupt it — serialise those. Max 3 workers.
6. **Escalate** per §8.1. Budgets are hard.
7. **Verify.** Re-run gates, re-open screenshots. No number moved, or invisible at 1440 →
   **revert** and log `REVERTED`.
8. **Log.** `output/pass-log.md`: cycle, finding, fix, measurement, verdict, commit SHA,
   plus `DECISION` / `TASTE-DECISION` / `FABLE-UNAVAILABLE` markers.
9. **Commit** only green, message naming the measured change.

Stop when any is true: zero P0/P1; two consecutive cycles with no measurable improvement;
G1/G2 unfixable because routes A and B are both proven unavailable. Then write §14 and stop.

Re-entry after a context reset: read this file, `git log -3`, `output/pass-log.md`, and the
latest `output/pass-*/`. Resume at the first unmet gate.

---

## 12. Skill text (verbatim)

`hero-art-direction/SKILL.md`

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

`critic-rubric/SKILL.md`

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

`browser-evidence/SKILL.md`

```markdown
---
name: browser-evidence
description: Collect screenshots and hard measurements from the local preview or
  the live site. Use for every verification pass.
---
- Serve the repo root over HTTP on 8899.
- Viewports: 1440x900, 1024x800, 768x900, 390x844. Capture scroll 0 and pinned
  (~300 px). Save to output/pass-<n>/.
- Assert: scrollWidth === clientWidth; exactly one h1; zero images with
  complete && !naturalWidth; zero responses >= 400; zero console errors.
- Measure the hero: .launch-object and .launch-copy--bottom rects, plus
  naturalWidth of .object-part--main. Report naturalWidth / boxWidth.
- Open every screenshot before reporting. Unopened evidence is not evidence.
- Reduced motion: emulate reduce, then confirm the headline, deck, CTAs and spec
  strip are visible and untransformed.
```

---

## 13. Kickoff

One line. The agent reads this file and executes it.

> Clone `iamdarshg/iamdarshg.github.io`, read `handoff.md`, then execute it end to end
> autonomously — wire the harness, install the tooling/servers/skills it specifies, run its
> gate → critic → fix loop with its model topology, and push only green commits — without
> asking me anything until you deliver its final report.

---

## 14. Definition of done + report shape

- **G2** passes: hero real detail ≥1418 px, produced by a render or a photograph, not an
  upscale. **G1 ≥ 2.0.**
- One focal point, one statement, two CTAs in the first viewport; no dead interval longer
  than ~120px; subject owns the upper third at 390 with CTAs above 700px.
- G3–G8 pass on all five pages at 1440 and 390, live as well as local.
- Reduced motion readable; motion reversible; caption truthful.
- Pushed to `main`, Pages green, live URL re-verified, `/handoff.md` 404.

Final report, exactly this shape:

```
HARNESS       which harness, which capabilities were available, degraded mode or not
HERO SOURCE   original px -> rendered CSS px -> ratio -> route used (A/B/C)
ROUTE PROOF   what exists now, real dimensions, file size
CLOSED        defects closed, each with before/after measurement
OPEN          defects open, why, what would close them
GATES         G1-G9 x 5 pages x 2 viewports, PASS/FAIL
EVIDENCE      paths to hero screenshots (4 widths x 2 states) + full-page shots
DEPLOY        commit SHA, Pages status, live re-check result
LEDGER        Fable fixers used (n/2), advisors used (n/3), decisions logged
HONESTY       one paragraph, plainly: what still looks weak and why. Do not soften it.
```

If G2 cannot be met because no CAD source and no photograph exist, the deliverable is
route C and the report says so in its first line. A good technical plate is a pass. A soft
fake product shot is a fail.