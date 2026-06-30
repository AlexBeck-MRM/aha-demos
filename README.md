# AHA Design Brain

This repo is the working design brain for the American Heart Association website refresh.
It is structured so Codex can act like a grounded design partner: source-aware, decision-aware, route-aware, and able to carry project memory forward instead of starting from scratch each session.

## Labs

Run `npm run play` from the repo root, then open these pages:

| Lab | Link | What it tests |
| --- | --- | --- |
| Living gradient lab | [`reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`](reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html) | AHA red/orange flame-gradient behavior across logo, card, button, and background surfaces, with export and parameter controls. |
| Living UI cards and tabs lab | [`reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`](reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html) | Card and tab states where four presets tune surface, copy anchoring, depth, timing, and subtle chevron response; default copy translates without scale, with diagnostic modes for text-blur tradeoffs. |

Local preview URLs:
- `http://127.0.0.1:4173/reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/`
- `http://127.0.0.1:4173/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/`

## Source priority

Codex should retrieve in this order:
1. `knowledge/sources/`
2. `knowledge/distilled/`
3. `logs/decision-log.md`
4. `logs/route-evolution.md`
5. `design/ui-style-inventory/`
6. `design/routes/`
7. `prompts/`

## Repository map

### Core design-brain layers
- `AGENTS.md` root operating contract for Codex.
- `brain/` deterministic routing rules, required reads, allowed write targets, and the daily stewardship loop.
- `projects/` active-project registry, retrieval indexes, open questions, and session state.
- `knowledge/` source intake, distilled summaries, and glossary.
- `language/` voice, messaging, taxonomy, and microcopy patterns.
- `design/` north star, principles, styleframes, routes, UI inventory, and reference manifest.
- `prompts/` reusable image-generation prompt systems plus prompt inputs such as wireframes.
- `logs/` decision memory and route evolution only.
- `templates/` starter formats for future entries.

### Operational language
- `brain/ops-language.md` defines the controlled language for operational files.
- Use it for `brain/`, `projects/`, `logs/`, and operational templates.
- Keep design and brand-writing files outside this controlled dialect.

### Reference layer
- `reference/assets/` canonical binary brand assets that are worth keeping in-repo.
- `reference/data/` source CSV inputs and recapture target lists.
- `reference/docs/` source documents retained because they are still cited.
- `reference/evidence/` selected committed evidence only. Keep the AHA-current-state pack here, not every exploratory capture.
- `reference/slides/` the current slide-system deliverable set only. Older versions live in git history.
- `scripts/` automation grouped by `dev/`, `slides/`, `ppt/`, `brand/`, and `docs/`.

### Scratch and experiments
- `design/generated/` curated generated images worth committing because they support the live design brain.
- `output/` throwaway local generations, exports, and previews. Ignore it; do not treat it as source of truth.
- `experiments/` self-contained prototypes or visualisers that are useful to revisit. If an experiment stops teaching us anything, delete it instead of archiving more files.

## Placement rules

### Sources
- Put factual source notes, ingest summaries, and evidence interpretation in `knowledge/sources/`.
- Put binary source assets, recordings, docs, and recapture inputs in `reference/`.
- If something is raw evidence but not actively cited, prefer not to commit it. Keep the recipe to regenerate it instead.

### Generated images
- Put curated generated board assets in `design/generated/`.
- Put local image generation runs, comparison exports, and one-off renders in `output/`.
- If a generated image is not referenced by a design doc, inventory entry, or board workflow, keep it out of the repo.

### Prompt material
- Keep canonical reusable prompt systems in `prompts/image-generation/`.
- Keep prompt inputs such as wireframes in `prompts/wireframes/`.
- Do not commit compiled prompt derivatives when the canonical prompt file can hold the route variants directly.

### UI inventory
- Keep board-linked interface guidance in `design/ui-style-inventory/`, one topic per file.
- Treat each inventory file as the cached companion to the live Figma section, not a second independent source of truth.

### Project state
- Keep active-project routing, open questions, and session continuity in `projects/<slug>/`.
- Keep project folders lean. If a fact belongs in `knowledge/`, `design/`, or `logs/`, store it there and reference it from the project folder.

### Experiments
- Keep experiments in `experiments/<slug>/` as self-contained sandboxes.
- Promote only the durable learning into `design/`, `knowledge/`, or `reference/`.
- Delete experiments that are superseded instead of creating archive stacks.

## Working loop

Use the repo like this:
1. Resolve the active project through `projects/current-project.yaml`.
2. Read the matching `projects/<slug>/retrieval-index.yaml` and `brain/router.yaml`.
3. Start from `knowledge/sources/` when facts or historical context matter.
4. Update `knowledge/distilled/` once the source material is stable enough to summarize.
5. Record decisions in `logs/decision-log.md` and route changes in `logs/route-evolution.md`.
6. Capture UI direction in `design/ui-style-inventory/` and route-specific changes in `design/routes/`.
7. Use `prompts/` when you need repeatable generation workflows, and keep the route variants inside the canonical prompt files.

## Common commands

Install dependencies:

```bash
npm install
```

Verify the design-brain structure:

```bash
npm run verify:brain
```

Bootstrap a new project state folder:

```bash
npm run project:init -- --title "Project Title" --id project-slug --set-current
```

Run the repo test hook:

```bash
npm test
```

Clean generated output:

```bash
npm run clean
```

This removes disposable local roots only: `.artifacts/`, `.playwright-cli/`, `.playwright-mcp/`, `.tmp/`, `output/`, `tmp/`, and `.aha-server.pid`.

Run the local visual preview launcher:

```bash
npm run play
```

Stop the managed preview server:

```bash
npm run stop
```

Preview the latest slide system directly:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
open "http://127.0.0.1:4173/reference/slides/deck-v1.6-all-layouts.html"
```

## Slide workflow

Rebuild token CSS:

```bash
node scripts/slides/build-slide-token-css.mjs reference/slides/tokens-v1.6.json reference/slides/deck-v1.6-tokens.css
```

Run slide QA:

```bash
node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/reference/slides/deck-v1.6-all-layouts.html
```

## PPT pilot workflow

```bash
npm run ppt:pilot
```

This writes generated artifacts into ignored folders under `.artifacts/build/`, `.artifacts/dist/`, and `.artifacts/reports/`.

## Housekeeping rules

- The live repo should stay compact enough to browse without archive archaeology.
- If a folder is mainly generated output, it should be ignored or deleted after the useful result is promoted.
- Use `repo-housekeeping` for rare structural cleanup that touches root docs, ignore rules, package scripts, verifier checks, or lookup policy.
- If a file only duplicates content already preserved in markdown or git history, prefer deleting it.
- If a source pack is large but only one or two files are actually cited, keep the cited files and the regeneration inputs.
- Derived project documents should carry an explicit `project_id` in front matter so retrieval and logging stay project-bound.

## Immediate next ingestion

- Add official AHA brand-guideline source files to `knowledge/sources/brand-guidelines/`.
- Add real discovery playback exports to `knowledge/sources/discovery-playback/`.
- Turn the most relevant current-site and comparator captures into tagged reference entries under `design/references/`.
