---
status: active
project_id: aha-website-refresh
source_of_truth: local
figma_section: Icons
figma_node_id: "2138:29691"
sync_status: local_supersedes_figma
last_synced_from_figma: 2026-04-14
content_version: 2.0.0
---

# Icons

## Direction
Use `Medical Soft Spatial - Colour Block` as the base AHA icon style for topic, action, education, and support icons.

The icons should feel like small, softly dimensional medical UI objects: calm, useful, mature, and clearly built for white interface surfaces. They are not flat line glyphs, product renders, toy-like 3D objects, or decorative illustrations. Each icon should read through a strong object silhouette, a mostly neutral material field, one purposeful subject colour, and one clear AHA-red information signal where the subject needs it.

The system should be consistent enough that a new icon can be generated or drawn from the same rules without reinterpreting the style each time.

## Reasoning
- A white-first AHA interface needs icons that add recognition and warmth without adding visual noise.
- The accepted 12-icon sheet works because it uses broad matte forms, restrained colour, and soft depth rather than texture, outline detail, or symbolic clutter.
- Red is strongest when it marks the thing to notice, do, choose, or understand. It should not become a decorative surface treatment across the set.
- The style can scale across dense UI because each icon is built from a few readable masses, not from tiny internal detail.
- Some subjects need more structure than others. CPR needs the compression action; mental wellbeing needs an integrated emotional cue. Useful detail is allowed when it clarifies meaning.

## Accepted Reference
- Current accepted sheet: `design/generated/icons/medical-soft-spatial-colour-block/aha-medical-soft-spatial-colour-block-12-sheet-v4.png`
- Prompt source: `prompts/image-generation/medical-soft-spatial-colour-block-full-sheet.md`
- Earlier line/duo-hover studies are now historical board context. Use this spatial style for AHA-specific topic and action icons unless a surface explicitly requires a tiny functional UI glyph.

## Core Construction
- Build each icon as one dominant object cluster inside an invisible square container.
- Use a shallow three-quarter top view. The icon should have enough side plane and overlap to feel spatial, but not enough rendering to feel like a product shot.
- Use broad, matte, uninterrupted forms. Default to `2-3` main masses per icon.
- Allow `4-5` large semantic masses only when the subject would otherwise become unclear.
- Keep forms rounded, practical, and medical. Avoid novelty proportions, mascot energy, inflated toy shapes, or expressive character acting.
- Use soft close shadows only. Shadows should be pale, short, and tied to the object, not dramatic cast shadows.
- Keep icons visually isolated. Do not add scenes, rooms, background cards, decorative backplates, halos, blobs, puddles, slabs, or filler surfaces.

## Shape Validity Rule
Every visible shape must be one of four things:

- the subject itself
- a physically attached part of the subject
- the single information signal
- a pale contact shadow

If a shape does not pass that test, remove it. This is the rule that keeps the system from drifting into random support shapes.

## Colour System
- Keep `65-75%` of each icon neutral: white, off-white, cool bone, pale stone grey, soft silver, or taupe grey.
- Add one broad muted subject colour only when it improves recognition.
- Use muted blue-grey for fabric/device cues such as blood pressure cuffs, sleep blankets, care folders, or small movement details.
- Use muted sage for produce, calm, community, or wellbeing cues.
- Use pale cream for paper, food masses, cards, and soft support surfaces.
- Use tobacco tan only for smoking/vaping cues.
- Use AHA red as a separate information signal: pulse line, AED case, alert mark, quit slash, heart, reading marker, sample liquid, or selected action.
- Keep red visually separated from muddy neutrals, browns, and shadows. Do not bury it inside a dark or warm surface.
- Avoid black, saturated colour, rainbow palettes, colour gradients, tiny multicolour parts, and colour used as texture.

## Detail Rules
- Detail is acceptable when it explains the subject.
- Detail must be large, structural, and semantic. It should still read at `24-32 px`.
- Do not use detail for material realism: no glass shine, metal reflections, fabric weave, food grains, seeds, pores, bubbles, labels, measurement marks, or product markings.
- Do not use detail as decoration: no ellipsis dots, sparkles, texture speckles, tiny repeated marks, ornate cuts, or miniature props.
- Avoid outlines. Separate forms through silhouette, overlap, value, and soft dimensional planes.
- Avoid skin tones, hair, faces, individual fingers, or expressive body detail. If a person is necessary, reduce them to faceless neutral forms.

## Subject Patterns
- Blood pressure: blue-grey cuff, grey bulb/tube, pale gauge, one small red reading mark.
- Heart rhythm: off-white heart volume with one separated red rhythm line. No monitor unless the context specifically needs monitoring.
- CPR / AED: simplified faceless responder pressing joined hands onto a neutral mannequin, plus red AED case. The action is the meaning, so this icon can carry more large structural detail than the rest of the set.
- Acute warning signs: plain off-white rounded alert tile with one red exclamation mark. No triangle wedge, stacked card, blue backing slab, or extra warning construction.
- Healthy eating: off-white bowl, one sage produce mass, one red apple/tomato mass, one smooth pale cream food mass. No grains, seeds, florets, or tiny foods.
- Movement: plain neutral shoe standing directly on white with a pale contact shadow. Muted blue-grey may appear only as an attached sole stripe or heel tab.
- Sleep: neutral bed, pillow, and one blue-grey blanket block. No window, moon, panes, room scene, or decorative night backdrop.
- Mental wellbeing: neutral head profile with an integrated internal cue such as a sage thought shape plus restrained red heart or calm pulse. It must read as mental/emotional support, not an ear patch.
- Quit smoking / vaping: simplified cigarette or vape object in neutral/tobacco tan with a separate red slash cue. Avoid large prohibition rings and smoke wisps.
- Volunteer / community: simple support card or very reduced hands-like form with one red heart. Avoid detailed palms, fingers, people, or sentimental character acting.
- Research / science: soft grey microscope plus one simple flask/sample block with controlled red liquid. No glass highlights, bubbles, labels, or measurement marks.
- Donate / support: neutral card, coin, or rounded support object with one small red heart/tab. No currency symbols, donation slots, numbers, or multiple hearts.

## Failure Modes
- Overbuilding the icon with extra props because the subject feels important.
- Adding a random base, blob, support shape, or backplate to make composition easier.
- Letting red become a large decorative area rather than a signal.
- Making the system too cute through inflated proportions, oversized heads, soft toy styling, or emotional character poses.
- Making the system too realistic through glossy materials, detailed lighting, dark contact shadows, or object-true texture.
- Making subjects ambiguous by removing necessary action detail, especially CPR/AED and mental wellbeing.
- Turning utility icons back into a mixed line/solid/3D family. Keep the base language consistent.

## Generation Rule
When generating new icons, start from the accepted prompt source and the accepted sheet. Do not write a fresh style prompt from scratch unless the base style is being intentionally changed.

Required prompt anchors:
- `Medical Soft Spatial - Colour Block`
- white background
- invisible square containers
- one dominant object cluster
- neutral-first colour ratio
- one broad subject colour
- AHA red as a separated information signal
- shallow three-quarter top view
- broad matte forms
- no random support shapes
- useful detail only where it clarifies meaning

## Open Questions
- Which surfaces still need tiny functional line glyphs rather than spatial subject icons?
- How small can the spatial icons go before they need a simplified alternate cut?
- Which accepted subjects should become production SVG or 3D source assets first?
