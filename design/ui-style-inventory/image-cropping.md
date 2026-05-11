---
status: active
project_id: aha-website-refresh
source_of_truth: figma
figma_section: Image cropping
figma_node_id: "2138:29810"
sync_status: synced_with_figma
last_synced_from_figma: 2026-04-14
content_version: 0.3.0
---

# Image Cropping

## Live board status
Section is present on the workbench with header instance `2138:29811` and four crop examples showing a desktop `16:9` crop shifting to a mobile `4:3` crop.

## Direction
Let image ratios flex by breakpoint instead of forcing the desktop crop to shrink unchanged. Keep a protected focal zone so mobile crops can get tighter while the main subject still reads quickly and respectfully.

## Reasoning
- Taller mobile crops keep faces, hands, and action more legible than shallow banner slices.
- This makes image-led modules easier to scan in stacked layouts.
- A protected focal zone keeps responsive behavior predictable and reduces awkward truncation.
- We still need to judge when environmental context matters more than intimacy.

## Guardrail
- Do not crop through eyes, hands in action, assistive devices, or other medically meaningful details.
- Do not assume the subject is always dead center. The protected focal zone can shift when the composition needs it.
- If context is doing the explanatory work, keep a wider crop on mobile or swap to a different image.

## Annotation status
Section-level annotations are not exposed on the `SECTION` node through the current MCP path, and the child nodes in this section currently return empty annotation arrays.

## Sync note
Live Figma header synced on 2026-04-14 using `Arimo` as the closest loadable neutral sans fallback in the MCP runtime because `Helvetica` and `Helvetica Neue` were not available for edit operations.
