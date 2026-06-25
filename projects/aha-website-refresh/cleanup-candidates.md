# Cleanup Candidates

## Job
- Tag old, generated, duplicated, or misplaced files.
- Keep this as a review register.
- Do not treat this file as deletion approval.

## Status Values
- `keep`: keep in place.
- `relocate`: move after references are updated.
- `archive`: keep only for traceability, not current use.
- `remove`: delete after owner confirms no active use.
- `defer`: needs more review before action.
- `done`: action completed.

## Candidates
| Status | Path | Reason | Suggested next |
| --- | --- | --- | --- |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/` | Current HBP prototype was in a UUID output folder. | Relocated from `outputs/` on 2026-05-07. |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/preview-*.png` | Intermediate page-state screenshots duplicated the final live prototype. | Deleted on 2026-05-07. |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/figma-captures/` | Figma transfer captures were intermediate exports, not final source. | Deleted on 2026-05-07. |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/figma-push/` | Figma push captures were intermediate exports, not final source. | Deleted on 2026-05-07. |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/home-blood-pressure-monitoring.html` | Redirect stub from an earlier detail-page test. | Deleted on 2026-05-07. |
| done | `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/assets/icon-*.png` | Unused icon placeholders after the final guide moved to scene illustrations and text links. | Deleted on 2026-05-07. |
| done | `reference/evidence/mockups/aha-condition-guide-navigation-boards-2026-05-07/` | Current companion boards were hidden under the same UUID output folder. | Relocated from `outputs/` on 2026-05-07. |
| done | `reference/slides/condition-guide-six-section-narrative/` | Presentation artifact was outside `reference/slides/` and hard to discover. | Relocated from `outputs/` on 2026-05-07. |
| archive | `reference/evidence/mockups/aha-high-blood-pressure-authority-page-2026-04/` | Early HBP concept is superseded by later condition guide work. | Keep while cited by the April 20 note; remove later only if source note no longer needs image evidence. |
| keep | `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/` | Older than current prototype but still source-backed support for the page model. | Keep and label as supporting in artifact index. |
| defer | `reference/evidence/screenshots/aha-healthy-eating-topic-network-2026-04-29/` | Large screenshot pack. Useful, but heavy. | Keep manifests and cited screenshots; review full pack after decisions settle. |
| defer | `reference/evidence/screenshots/aha-high-blood-pressure-topic-network-2026-04-20/` | Large screenshot pack. Useful, but heavy. | Keep manifests and cited screenshots; review full pack after decisions settle. |
| defer | `reference/evidence/logos/` | Raw logos and review sheets may duplicate data and screenshots. | Keep until brand matrix references are stable. |
| done | `.playwright-cli/` | Ignored browser logs and screenshots. | Deleted on 2026-05-07; ignore and clean policy refreshed on 2026-06-25. |
| done | `.playwright-mcp/` | Ignored browser logs and snapshots. | Deleted on 2026-05-07; added back to `.gitignore` and `npm run clean` on 2026-06-25 because the tool can recreate it. |
| done | `.tmp/` | Ignored temporary slide output. | Deleted on 2026-05-07. |
| done | `output/` | Ignored generated image output. | Deleted on 2026-05-07. |
| done | `output/imagegen/` | Current icon review sheets were only in ignored generated output. | Review copies added to `design/generated/review/2026-06-17-icon-style-exploration/`; keep `output/` disposable. |
| done | `design/generated/review/2026-06-24-one-colour-topic-icons/*chromakey*` and `*raw*` | Processing files were useful provenance but too noisy for durable lookup surfaces. | Kept in the manifest only; removed from artifact-index supporting files on 2026-06-25. |
| defer | `output/playwright/criticalmass/` | `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` cites this ignored capture folder as durable `capture_artifacts`. | Promote the cited captures to `reference/evidence/` and update the note, or rewrite the note so scratch stays scratch. |
| defer | `.artifacts/` | Ignored build and output artifacts; some may be useful visual review material. | Promote durable assets into `reference/` or `design/`, then clean. |
| defer | `tmp/health-topic-taxonomy-audit.md` | Temporary file is cited by the condition authority source note. | Move to `knowledge/sources/current-site-audit/` or remove the citation after summary is complete. |
| defer | `tmp/hbp-live-page-extracts.json` | Temporary HBP extraction data may be raw source evidence. | Move to `reference/evidence/` if needed; delete if absorbed into source notes. |
| defer | `tmp/aha-nav-ia/` | Navigation IA mockups are in scratch but may contain useful board work. | Promote if still useful; otherwise delete. |
| defer | `experiments/visualisers/` | Self-contained experiment; not clearly tied to current work. | Keep only if a design doc references the learning. |

## Removal Check
- Run `rg "<path-or-filename>"`.
- Check `projects/aha-website-refresh/artifact-index.yaml`.
- Check `projects/aha-website-refresh/session-log.md`.
- Check source notes under `knowledge/sources/`.
- Ask before deleting or moving.
