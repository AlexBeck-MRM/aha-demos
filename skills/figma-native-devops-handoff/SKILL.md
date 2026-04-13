---
name: figma-native-devops-handoff
description: Read native Figma documentation features such as annotations, Ready for dev status, measurements, and component descriptions, then normalize them into a fixed schema for Azure DevOps or Jira-ready backlog drafts. Use when the user wants to turn Figma documentation into stories, acceptance criteria, implementation notes, or a BA-ready handoff.
---

# Figma Native DevOps Handoff

Use this skill when a user wants to convert structured documentation in Figma into delivery artefacts without rewriting requirements from scratch.

Read these references before drafting output:

- `references/figma-annotation-schema.md`
- `references/devops-output-template.md`
- `references/design-to-code-tutorial.md`

## Goal

Turn native Figma documentation into a consistent backlog draft while keeping Figma as the upstream source of truth.

The output should help a BA or delivery lead move faster in `ADO / Jira`, but it must not invent requirements that are missing from the design source.

## What to read in Figma

Collect documentation in this order of precedence:

1. `Ready for dev` status and status notes
2. frame, section, and component annotations
3. component, style, and variable descriptions
4. measurements used to call out critical exceptions
5. linked code references such as Code Connect when present

If direct extraction of annotations or descriptions is not available through the current tool path, use the closest available Figma context and clearly state what could not be read directly.

## Workflow

1. Get the Figma file, page, or node reference from the user.
2. Read the design context and screenshot for the target node or flow.
3. Normalize all native documentation into the fixed schema from `references/figma-annotation-schema.md`.
4. Draft the backlog output using `references/devops-output-template.md`.
5. Keep every requirement traceable back to the Figma source.
6. Move anything missing, contradictory, or not verifiable into `Open questions`.

## Design-to-code tutorial

Use this lightweight tutorial when guiding someone through the workflow or when the source selection is unclear.

### 1. Start from the documented section, not a random layer

The correct starting point is usually the smallest `section`, `frame`, or `component` that has been intentionally prepared for handoff.

That source should contain:

- the visible design
- the relevant annotations
- the states and variants that matter
- any local rules or exceptions

Do not start from:

- a detached screenshot-like frame
- a decorative child layer
- a partial instance with no surrounding context

### 2. Read the section before reading the details

First understand what the section is trying to do.

Look for:

- the section or frame title
- `Ready for dev` status and notes
- summary annotations
- linked descriptions on the reusable component or variables

Then move into the details.

### 3. Inspect states, variants, and behavior

For a component or pattern to be handoff-ready, the design source should show the relevant states and variants clearly.

That usually means checking:

- default
- hover
- active
- loading
- empty
- error
- disabled
- named variants such as size, theme, layout, or content mode

If a state is implied but not shown or documented, do not invent it. Move it to `Open questions`.

### 4. Separate page-level notes from reusable component notes

Use page or section annotations for local requirements and exceptions.

Use component, style, and variable descriptions for reusable-system intent, such as:

- what a component is for
- when to use it
- token meaning
- shared implementation constraints

### 5. Draft the backlog from the structured source

Once the section has been read, convert it into the fixed output template.

The transfer should preserve:

- what the user needs
- what the UI does
- what the CMS or data source must provide
- what still needs clarification

The output is an `AC seed` and handoff draft, not the final backlog wording.

## Output rules

- Keep one output per handoff-ready frame, section, or component unless the user asks for a larger rollup.
- Treat the result as an `AC seed`, not the final backlog wording.
- Preserve the distinction between:
  - acceptance criteria
  - CMS or authoring notes
  - implementation notes
  - open questions
- Do not add technical implementation assumptions unless they are explicitly documented or already established elsewhere in the task.
- If the same requirement appears in multiple annotations, consolidate it once.
- If a page or flow is too large for one ticket, produce:
  - one summary
  - a recommended ticket split
  - a backlog draft per slice

## Quality bar

The draft is only good if:

- a BA can copy it into `ADO / Jira` with light refinement
- a developer can see the intended states, dependencies, and constraints
- a designer can trace every important point back to Figma
- open gaps are explicit instead of hidden
