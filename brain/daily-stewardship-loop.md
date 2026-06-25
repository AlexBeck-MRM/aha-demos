# Daily Brain Stewardship Loop

## Job
- Merge Daily Brain Sync and library maintenance into one loop.
- Keep retrieval fast.
- Keep repo state verifiable.
- Keep generated assets in stable destinations.
- Reduce owner questions to real design, source, or destructive choices.
- Keep Figma out of this loop unless the user asks.

## Read
- `AGENTS.md`
- `brain/router.yaml`
- `brain/ops-language.md`
- `projects/current-project.yaml`
- `projects/aha-website-refresh/project.yaml`
- `projects/aha-website-refresh/retrieval-index.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`
- `package.json`

## Artifact Destinations
- Scratch renders: `output/`.
- Generated review assets: `design/generated/review/<yyyy-mm-dd>-<topic>/`.
- Accepted generated assets: `design/generated/<topic-or-system>/`.
- Accepted icon sets: `design/generated/icons/<style-or-set>/`.
- Source evidence: `reference/evidence/`.
- Reusable prompts: `prompts/image-generation/`.

## Verify
- `git status --short`
- `npm run verify:brain`
- `find . -name .DS_Store -print`
- check artifact-index and quick-map references through the verifier

## Write
- Fix verifier failures only when safe.
- Remove Finder metadata files.
- Update current-state memory.
- Update lookup files from existing evidence.
- Copy generated review assets out of ignored `output/` when they should remain findable.
- Add manifests for generated review folders.
- Add or update cleanup rows when a storage rule is clear.
- Close inbox items when the policy is recorded elsewhere.
- Append compact session history.
- Log blocked owner decisions.
- Do not stage, commit, push, or create PRs.

## Learn
- Add a rule here when the same maintenance issue recurs and the fix is low-risk.
- Add one stable inbox item when the issue needs an owner decision.
- Do not ask the same unresolved question in every run.
- Close repeated questions when a repo policy now covers the answer.
- Keep uncited `output/playwright/` captures in scratch.
- Add cleanup or inbox only when a durable note points at scratch.
- Keep the final report focused on new deltas, not repeated blockers.

## Escalate
- Deletion, except Finder metadata.
- `npm run clean` or other destructive cleanup commands.
- Figma reads or writes.
- Accepted design direction.
- Final production asset status.
- Canonical source or brief changes.

## History
- `2026-06-17 06:02 BST`: baseline verify passed; no Finder metadata found; restored maintenance state files; registered icon prompt assets; final verify passed.
- `2026-06-17 08:40 BST`: merged daily sync and library maintenance rules; added generated asset destinations; promoted icon review sheets from ignored output to `design/generated/review/`.
- `2026-06-17 08:55 BST`: added learning and stuck-loop rules; expanded verifier coverage for daily-librarian files.
- `2026-06-17 09:05 BST`: added verifier checks for artifact-index and quick-map path references.
- `2026-06-21 08:04 BST`: keep uncited `output/playwright/` QA captures in scratch unless a durable note cites them.
- `2026-06-25 09:28 BST`: renamed this file from the old hourly maintenance filename so the filename matches the actual daily maintenance contract.
