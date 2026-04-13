# Technology Playback Notes

## Source
- `/Users/alexanderbeck/Desktop/AHA - Discovery Playback - Technology.pdf`

## What the source establishes
- The technology and operating model directly constrain the future heart.org experience.
- Current maturity is mostly `Developing` or `Ad Hoc` across platform, content operations, personalization, engineering, and data.

## Current-state pain points
- Code and functionality are distributed across multiple repositories and integrations, increasing complexity.
- Template and component strategy lacks maturity.
- CMS workflows and publishing processes rely on manual workarounds.
- Tagging is inconsistent, search is basic, and metadata requirements are not enforced consistently.
- Governance is uneven across tracking, standards, and delivery practices.

## Recommended direction
- Use composable architecture with `SitecoreAI` at the center.
- Prefer `Sitecore Search` for the future stack, while supporting near-term AI-search pilots.
- Refresh the Bynder integration rather than forcing an immediate DAM replacement.
- Use `Dataweavers Arc` as the managed Azure-oriented infrastructure path.
- Use `Next.js` with the `Content SDK`, plus `Storybook` and automated testing.

## Experience-level implications
- Search, tagging, template maturity, and content operations are not backend-only concerns; they directly shape trust and usability.
- Better governance and structured briefs are required to make content quality and consistency real.
- Personalization ambition depends on better data maturity and lower operational overhead.

## Critical detail for the brain
- The future site should not be designed as if content, search, and templates are already strong. The design must help expose, simplify, and govern these systems.
