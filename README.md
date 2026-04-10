# AHA Design Brain

This repo is the working design brain for the American Heart Association website refresh.
It is structured so Codex can act like a grounded design partner: source-aware, decision-aware, route-aware, and able to carry project memory forward instead of starting from scratch each session.

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
- `knowledge/` source intake, distilled summaries, and glossary.
- `language/` voice, messaging, taxonomy, and microcopy patterns.
- `design/` north star, principles, styleframes, routes, UI inventory, and reference manifest.
- `prompts/` reusable Codex, image-generation, and evaluation prompts.
- `logs/` decision memory, critique history, route evolution, session notes, and open questions.
- `templates/` starter formats for future entries.

### Legacy source archives retained for grounding
- `docs/` workflow and handoff drafts.
- `slides/` current and archived slide-system specs and assets.
- `evidence/` brand capture recordings, manifests, and QC outputs.
- `scripts/` automation grouped by `dev/`, `slides/`, `ppt/`, `brand/`, and `docs/`.
- `assets/` logo assets and shared brand files.
- `data/` source CSV inputs for capture work.

### Experimental surfaces retained for reference
- `css.html`, `shader.html`, `index.html`, `js/`, `styles.css`

## Working loop

Use the repo like this:
1. Start from `knowledge/sources/` when facts or historical context matter.
2. Update `knowledge/distilled/` once the source material is stable enough to summarize.
3. Record decisions in `logs/decision-log.md` and route changes in `logs/route-evolution.md`.
4. Capture UI direction in `design/ui-style-inventory/` and route-specific changes in `design/routes/`.
5. Use `prompts/` when you need repeatable critique, comparison, or generation workflows.

## Common commands

Install dependencies:

```bash
npm install
```

Verify the design-brain structure:

```bash
npm run verify:brain
```

Run the repo test hook:

```bash
npm test
```

Clean generated output:

```bash
npm run clean
```

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
open "http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html"
```

## Slide workflow

Rebuild token CSS:

```bash
node scripts/slides/build-slide-token-css.mjs slides/tokens-v1.6.json slides/deck-v1.6-tokens.css
```

Run slide QA:

```bash
node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html
```

## PPT pilot workflow

```bash
npm run ppt:pilot
```

This writes generated artifacts into ignored folders under `build/`, `dist/`, and `reports/`.

## Immediate next ingestion

- Add official AHA brand-guideline source files to `knowledge/sources/brand-guidelines/`.
- Add real discovery playback exports to `knowledge/sources/discovery-playback/`.
- Turn the most relevant current-site and comparator captures into tagged reference entries under `design/references/`.
