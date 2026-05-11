---
status: active
project_id: aha-website-refresh
source_of_truth: figma
figma_section: Responsiveness
figma_node_id: "2322:7612"
sync_status: synced_with_figma
last_synced_from_figma: 2026-04-17
content_version: 0.2.0
---

# Responsiveness

## Live board status
Section is present on the workbench with header instance `2322:7613`, plus two structural examples: `desktop` (`2322:7622`) and `mobile` (`2322:7627`), connected by directional vector `2322:7636`.

Machine-readable developer annotation payloads are not currently exposed for this node and its children through the available Figma MCP endpoints, so annotation-specific interpretation remains pending.

## Direction
Mobile should keep the same core story and priorities as desktop, but in a tighter, more disciplined frame. Scale components down, reduce visual overhead, and preserve the same reading order so smaller screens feel focused rather than stretched.

## Reasoning
- On narrow screens, oversized components create long pages that are harder to orient within.
- Preserving hierarchy matters more than preserving exact proportions; people still need the same signals in the same order.
- Tablet should stay closer to the desktop rhythm than the phone rhythm, especially for older audiences who may browse in larger touch formats.
- Responsive behavior should feel like a clearer edit of the same experience, not a separate design language.
