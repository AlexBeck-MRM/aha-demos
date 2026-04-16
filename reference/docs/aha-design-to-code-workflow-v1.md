# AHA Design to Code Workflow

## Working draft

This document sets out the current direction for how AHA could connect design, requirements, backlog refinement, implementation, and parity review.

It is still a working draft. The overall process direction is clear, but some technical and delivery decisions still need to be confirmed with Andy and James.

## Questions To Resolve First

These questions should be answered before the workflow is treated as final.

1. Can we confirm the exact client-facing Sitecore wording and product naming?
2. Can we confirm the rendering host as `Next.js + React`, or is that still provisional?
3. Can the frontend realistically use `Tailwind`, or is that a non-starter?
4. Can we lock `Storybook` as the preview surface for parity review?
5. Which accelerator gives the strongest build parity in the chosen framework: `Untitled UI`, `Flowbite`, or another option?
6. What is the exact split of ownership between `Figma`, `tickets`, and `implementation notes / wiki`?
7. What is the minimum component contract every shared component must carry?
8. What authoring constraints need to be designed in from the start?
9. What is the exact `Ready for dev` checklist?
10. What is the first pilot slice that will prove this process is real?

## Why This Matters Now

AHA needs a repeatable way to move from design intent to production code without losing fidelity, speed, or governance, and to do that at a standard that reflects current workflow practice in April 2026.

Current design-system practice has moved on from treating a system as a static UI kit. The stronger view now is that design systems are operating infrastructure for delivery, reuse, and consistency.

- [Figma and the Design Executive Council](https://www.figma.com/reports/the-business-value-of-design-systems/) position design systems as business infrastructure tied to revenue, customer loyalty, and product strategy.
- [Figma's 2026 business case for design systems](https://www.figma.com/blog/the-new-business-case-for-design-systems/) makes the same point more plainly: fragmented systems create friction, duplication, and missed opportunities.
- [Figma's 2025 Dev Mode ROI analysis](https://www.figma.com/blog/forrester-analyzes-the-roi-of-dev-mode/) reports modeled gains of `20 to 30%` in developer output and more than `90 minutes` saved per developer per week when design-to-dev workflows reduce context switching and redundant work.
- [Figma Design Systems 103](https://www.figma.com/blog/design-systems-103-documentation-that-drives-adoption/) argues that documentation only drives adoption when it captures what teams actually need to build and maintain the system.
- [Figma's MCP and design-aware development guidance](https://www.figma.com/mcp-cc-ai-code/) points in the same direction: agentic workflows are useful when they pull from the real design source and preserve fidelity, not when they invent a parallel process.

For AHA, that means:

- inconsistency is not just a design problem, it is a delivery cost
- tickets written away from the design create rework
- weak component parity slows implementation and QA
- undocumented CMS constraints surface too late
- agentic capabilities should be used where they materially improve fidelity, speed, or handoff quality
- agentic workflows should reduce manual transfer work, but they should not replace the design source, backlog discipline, or technical review

## What This Workflow Is And Is Not

This workflow is:

- a connected operating model from `Figma` to backlog to implementation to parity review
- a way to keep one upstream design contract while still using delivery tools properly
- a practical bridge between design, BA, development, and content authoring

This workflow is not:

- just a UI kit
- just a brand guide
- just a ticketing convention
- just a Storybook instance
- a second source of truth competing with backlog or engineering documentation

## Current Direction

Based on the current discussion with Andy, the working direction is:

- `Sitecore XM Cloud` is the likely implementation route, while `SitecoreAI` appears to be the broader current product framing. This should still be confirmed in client-facing language.
- `Next.js + React` is the leading frontend recommendation.
- `Storybook` is the leading recommendation for the isolated frontend preview surface.
- The chosen kit should be both a design accelerator and a build accelerator.
- Figma should hold visual design plus the functional, non-functional, and data requirements that materially affect delivery quality.
- `ADO / Jira` still remains the backlog system for scope, slicing, status, QA, and release management.
- Implementation notes and authoring guides should stay separate from the design workflow and live in a durable wiki or engineering documentation space.

James should be brought into the process early enough that he helps shape the implementation route, constraints, and pilot rather than receiving a finished process second-hand.

Useful references:

- [Sitecore XM Cloud](https://developers.sitecore.com/products/xm-cloud)
- [Sitecore Developer Portal](https://developers.sitecore.com/)
- [Storybook](https://storybook.js.org/)

## Recommended Direction

The best current recommendation is:

- use a strong kit as an accelerator
- do not treat that kit as the final system
- build an `AHA-owned semantic layer` on top
- keep the design system portable until the rendering host is fully confirmed

Current accelerator position:

- [Untitled UI](https://www.untitledui.com/) is stronger if `Next.js + React` is confirmed, because the code parity story is better.
- [Flowbite](https://flowbite.com/docs/getting-started/introduction/) remains a useful fallback if the stack moves away from React or needs more flexibility.
- The chosen kit should speed up both design coverage and implementation, but it should not define the whole AHA system.

## Maturity Model

The simplest way to think about the workflow is as four layers.

1. `Foundations`
2. `Components and patterns`
3. `Connected delivery`
4. `Operational governance`

### Foundations

This is the base layer:

- tokens
- principles
- accessibility rules
- content rules
- motion rules

Where possible, token naming and export should align to the [Design Tokens Community Group format](https://www.designtokens.org/tr/format/) so the system stays portable across tools and code.

### Components and patterns

This is where reusable design actually becomes usable:

- components
- variants
- states
- usage guidance
- annotations
- page and flow patterns

### Connected delivery

This is where the workflow starts saving time:

- Figma annotations
- ticket links
- component contracts
- code-connected references
- preview environments
- coded prototypes where useful

Useful references:

- [Figma Dev Mode guide](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)
- [Figma annotations in Dev Mode](https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotate-designs-in-Dev-Mode)
- [Figma Ready for Dev view](https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view)
- [Jira and Figma](https://help.figma.com/hc/en-us/articles/360039827834-Jira-and-Figma)
- [Code Connect](https://help.figma.com/hc/en-us/articles/23918317064727-Guide-to-Code-Connect)

### Operational governance

This is the layer that stops drift:

- readiness gates
- change logs
- versioning
- ownership
- adoption tracking
- deprecation rules

The workflow does not need to perfect all four layers immediately. It does need to be designed so it can grow into them without rewriting itself later.

## Core Workflow

The workflow should operate like this:

1. Design is created and documented in `Figma`.
2. Figma provides the source material for ticket refinement and component contracts.
3. Tickets are created in `ADO / Jira` using the design as the requirement seed.
4. Components and patterns are implemented in the real stack.
5. Implementation is reviewed in `Storybook` or an equivalent preview surface.
6. Findings from review feed back into design, tickets, and implementation notes.

Status should be separated into:

- `Design approved`
- `Tech reviewed`
- `Ready for dev`

That is cleaner than one generic handoff status because it separates visual agreement from technical readiness.

## Figma Native Documentation Model

The workflow should use Figma's native documentation features as the first layer of handoff, not as an optional extra.

That means using:

- [annotations and measurements in Dev Mode](https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotate-designs-in-Dev-Mode)
- [Ready for dev statuses and views](https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view)
- [component, style, and variable descriptions](https://help.figma.com/hc/en-us/articles/7938814091287-Add-descriptions-to-styles-components-and-variables)

The intent is simple: the design file should contain enough structured context that an agent can turn it into a reliable backlog draft for Andy, rather than forcing requirements to be rewritten from scratch.

### Native feature rules

- use `Ready for dev` only on sections, frames, or components that are genuinely ready for technical review
- use annotations for UI-adjacent requirements and exceptions
- use measurements only for critical spacing or sizing that is easy to miss
- use component descriptions for reusable-system guidance
- use style and variable descriptions for token intent and usage rules
- use library publish notes for release-level changes, not for detailed implementation requirements

### Consistent annotation categories

The annotation model should stay fixed across files.

Use the default Figma categories:

- `Development`
- `Interaction`
- `Accessibility`
- `Content`

Add only these custom categories:

- `Data`
- `Analytics`
- `Open questions`

That keeps the system broad enough for delivery, but still easy to scan and automate.

### Consistent annotation content

Each annotation should be short, explicit, and single-purpose.

Good annotation examples:

- one rule
- one dependency
- one exception
- one state note

Avoid long paragraphs. If an annotation needs more than a few lines, it probably belongs in the ticket or implementation note instead.

### Consistent transfer format

The output format for the agent should always be the same.

For each handoff-ready frame, section, or component, the agent should produce:

- `Title`
- `Figma source`
- `Summary`
- `User story or intent`
- `Acceptance criteria seed`
- `Functional notes`
- `States and variants`
- `Accessibility`
- `Content and CMS`
- `Data and logic`
- `Analytics`
- `Dependencies`
- `Open questions`

That output can then be refined into `ADO / Jira` without losing traceability back to Figma.

### Agent skill

A dedicated agent skill should be part of this workflow. Its job is to read the native documentation structure in Figma, normalize it into a fixed schema, and draft DevOps-ready backlog content.

This is one of the key workflow improvements because it moves the team away from manual requirement re-typing and toward structured transfer from design into delivery.

Current draft skill:

- `skills/figma-native-devops-handoff/`

## Documentation Split

The workflow works best when each artefact owns a different job.

### What Figma should own

Figma should own:

- page and component design
- states and variants
- behavior, interactions, and motion notes
- layout-affecting content rules
- token usage
- functional requirements that need to be reviewed with the design
- non-functional requirements that materially affect UX or delivery
- data requirements that shape component or page behavior

### What tickets should own

Tickets should own:

- final acceptance criteria wording
- scope
- sequencing
- owner
- dependencies
- release planning
- the exact Figma link

The design should create the `AC seed`. The ticket should hold the final operational wording and sliced backlog items.

### What implementation notes should own

Implementation notes are the bridge between design and real CMS or frontend reality.

They should capture:

- rendering name
- datasource template
- required and optional fields
- field limits
- authoring guidance
- fallback behavior
- localization implications
- personalization implications
- integration dependencies

For now, the simplest rule is:

- keep the summary version in the ticket
- keep reusable per-component notes in a shared engineering note, component inventory, or client wiki
- link both back to the exact Figma component

Documentation should be updated as part of completing a component or pattern, not as a later cleanup task. That is consistent with the current best practice in [Figma Design Systems 103](https://www.figma.com/blog/design-systems-103-documentation-that-drives-adoption/).

## Coded Prototypes

Coded prototypes can be useful, but only if they are disciplined.

They are helpful when they:

- use the real tokens or token pipeline
- use the likely component structure
- reflect real interaction behavior
- are reviewable by design and BA
- can either become production code or clearly inform production code

They are harmful when they:

- bypass tokens
- invent a parallel design system
- use throwaway styling unrelated to the likely stack
- become a second source of truth beside Figma

The simple rule is:

- `Figma` stays the upstream design contract
- coded prototypes stay downstream as validation and acceleration

## System Model

The AHA system should be built around four stable building blocks.

### Tokens

Everything repeatable should be tokenized where sensible:

- color
- type
- spacing
- radius
- shadow
- motion
- breakpoints

Practical references:

- [Design Tokens Community Group format](https://www.designtokens.org/tr/format/)
- [Style Dictionary](https://styledictionary.com/)

### Semantic components

AHA should define its own semantic component layer even if it starts from an accelerator kit.

That means components should be named and structured around business and editorial meaning, not just around what came out of a starter library.

### Component contract

Every shared component should have a minimum contract:

- AHA component name and ID
- Figma link
- rendering name
- datasource template
- required fields
- optional fields
- authoring guidance
- fallback behavior
- variants and states
- dependencies
- owner

### Preview surface

The team needs an isolated preview layer. `Storybook` is the current leading recommendation, but that still needs to be locked with Andy and James.

Useful references:

- [Storybook for design systems](https://storybook.js.org/use-cases/design-systems)
- [Storybook for Web Components and Vite](https://storybook.js.org/docs/get-started/frameworks/web-components-vite)

### Component status tracking

Each shared component should also carry a visible status so the team can tell what is real and what is still moving.

The minimum useful statuses are:

- `Design only`
- `In build`
- `Ready for dev`
- `Released`
- `Deprecated`

## Website Requirements

This process has to support more than a simple marketing site.

It needs to work for:

- complex navigation
- deep information architecture
- editorial patterns
- news and blog structures
- search and listings
- localization
- region-specific variation
- personalization
- constrained authoring

Useful reading:

- [Sitecore XM Cloud](https://developers.sitecore.com/products/xm-cloud)
- [XM Cloud embedded personalization feature matrix](https://developers.sitecore.com/learn/faq/xm-cloud-embedded-personalization/feature-matrix)
- [XM Cloud page personalization guide](https://developers.sitecore.com/learn/accelerate/xm-cloud/optimization/user-experience-optimization/page-personalization)

## Success Measures

This workflow should be measured by whether it reduces friction, not by whether the document looks complete.

The most useful early measures are:

- time to create a ticket from design
- number of clarification loops
- number of missing states or fields found late
- number of parity defects found in review
- degree of visual and behavioral alignment
- whether tokens flow through cleanly
- whether approved components are being reused instead of rebuilt

This follows the current best-practice direction of measuring adoption through productivity, collaboration, and real usage rather than library size alone.

## Pilot

The pilot should prove the process end to end.

The smallest useful pilot should include:

- one reusable page pattern
- one or two shared components
- one ticket generated from Figma
- one coded implementation in the real stack or nearest possible stack
- one preview or parity review surface
- token flow from Figma into code

The pilot should produce:

- one annotated Figma slice
- one component contract
- one backlog ticket
- one coded prototype or implementation
- one parity review
- one editor or authoring walkthrough

James should have a meaningful role in shaping:

- the implementation route
- the preview workflow
- the realistic component contract
- the viability of the chosen accelerator

## Call Checklist For Andy And James

Use the call to leave with decisions, not just discussion.

### Confirm or close

- exact Sitecore wording
- whether `Next.js + React` is now confirmed
- whether `Storybook` is now confirmed
- whether `Tailwind` is viable
- whether `Untitled UI` or `Flowbite` is the leading accelerator

### Clarify ownership

- what lives in Figma
- what lives in tickets
- what lives in implementation notes
- how much design-side requirements content should sit in Figma

### Leave the call with

- a clearer stack position
- a clearer preview position
- a provisional accelerator choice
- a pilot slice
- a list of follow-ups if anything remains open
