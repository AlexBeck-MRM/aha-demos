---
name: design-brain-auditor
description: Audit the AHA design-brain repo for retrieval quality, grounding gaps, duplication risk, missing logs, weak prompts, and broken reference wiring. Use when the user asks how to improve the repo as a better design partner or when repo health itself is the task.
---

# Design Brain Auditor

Use this skill when the task is to evaluate or improve the repository as a grounded collaborator.

## Audit order
1. `AGENTS.md`
2. `knowledge/sources/`
3. `knowledge/distilled/`
4. `logs/`
5. `design/ui-style-inventory/`
6. `design/routes/`
7. `prompts/`
8. reference manifests and evidence links
9. verification scripts and package commands

## What to check
- Is the declared retrieval order matched by real source material?
- Are summaries traceable back to source files?
- Are decisions, route changes, and open questions logged with usable IDs?
- Do prompts require citation, ambiguity handling, and file updates?
- Do references point to real source files?
- Does the repo have a working health-check command?

## Output rules
- Prioritize the highest-risk grounding failures first.
- Cite exact files.
- Distinguish missing source material from weak summaries.
- Propose the smallest set of changes that materially improves collaboration quality.
