---
status: active
project_id: aha-website-refresh
source_of_truth: figma
figma_section: Motion Reveals
figma_node_id: "2138:29721"
sync_status: synced_with_figma
last_synced_from_figma: 2026-04-17
content_version: 0.3.0
---

# Motion Reveals

## Live board status
Section is present on the workbench with header instance `2138:29722`, a two-state hero comparison in `2267:995`, and a three-step button reveal rationale strip in `2267:1007`.

## Direction
Use motion reveals so content enters as if it already lives in the same lit space as the rest of the interface. As people scroll, larger modules can rise slightly, sharpen from a soft blur, and fade into full presence.

## Reasoning
- Motion reveals make the interface feel like one continuous environment instead of a stack of disconnected blocks.
- They give depth a job beyond styling by helping surfaces arrive with position and focus.
- Used well, they improve hierarchy by pacing what reaches attention first.
- The effect should stay coordinated at the module level; if every small element animates on its own, comprehension drops fast.

## Working default
- Let modules rise slightly, fade in, and resolve from a soft blur as one motion group rather than as separate atoms.
- Keep travel modest at roughly `24px`, duration around `300-360ms`, and intra-module staggers very short.
- Avoid scale or `z`-axis tricks; the board annotation is pointing toward blur-and-fade rather than zoom.

## Guardrail
- Dense article copy, forms, alerts, and other task-heavy modules should stay mostly static.
- Reduced-motion behavior should keep the order of information without blur or travel.
