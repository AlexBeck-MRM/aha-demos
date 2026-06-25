# AHA One-Colour Topic Icon Sheet Prompt

## Use
Use this prompt to generate a large bitmap topic-icon sheet in the chunky one-colour AHA line style.

This sheet is intended for same-size cutouts. It uses the attached reference board for topic list and broad arrangement, not for style.

## Direction
Use one icon language only: `Chunky One-Colour Flat Line`.

The icons should be simple AHA-red line icons: chunky, rounded, mature, and clear at small UI sizes. Do not use a second colour, fills, shadows, or background fields.

## Prompt
Create a large bitmap raster icon sheet based on the attached reference board.

Use case: icon-system exploration.
Asset type: high-resolution bitmap PNG-style icon sheet for later same-size cutouts.
Input image role: reference for topic list and general arrangement only. Keep the same topic subjects and the same overall grid arrangement. Do not copy the original shaded/fill style, colours, black background, selection border, or exact artwork.

Primary request:
Extrapolate the latest AHA chunky flat-line approach into a larger one-colour topic icon sheet. Use one colour only: AHA red `#c8102e`. No warm grey, purple, blue, green, black, or multicolour details. Icons should be chunky red line icons, not filled illustrations.

Canvas and cutout grid:
Create the largest clean image possible. Use an 8-column by 7-row grid, matching the attached reference board. Use equal-size invisible cells. Keep every icon centered in its own cell, with consistent optical scale, generous padding, and enough gutters so each cell can be cut out at the same size. The bottom row has only 6 occupied cells, matching the reference; leave the two missing end cells empty. Do not draw visible cell borders, labels, numbers, headings, UI chrome, or watermarks.

Transparent-background preparation:
Create the whole sheet on a perfectly flat solid `#00ff00` chroma-key background for background removal. The background must be one uniform colour with no shadows, gradients, texture, floor plane, border, or lighting variation. Do not use `#00ff00` anywhere in the icons. Keep every icon fully separated from the background with crisp antialiased edges and generous padding. No cast shadows, contact shadows, or reflections.

Icon style:
Use one style only: `Chunky One-Colour Flat Line`. Use thick rounded monoline AHA-red strokes with rounded caps and rounded joins. Make the icons simple, mature, friendly, and AHA-like. Use simplified silhouettes and minimal internal detail. The line weight should be bold enough to read in small cards, but still clean. Use open linework and occasional simple red outline shapes. Avoid delicate fine-line detail.
Do not fill closed icon shapes with white, cream, pale red, or any other colour. Closed shapes must stay transparent inside after background removal. Every visible line must be red.

Subject arrangement, left to right by row:
- Row 1: checklist clipboard with heart; heart rhythm; blood pressure cuff and gauge; blood vessel with blood drop; heart alert; ECG pulse line; anatomical heart; apple.
- Row 2: walking shoe; sleep pillow; breathing person; vape or inhaler check; body weight scale check; heart in caring hands; two-person support/community; open guide book.
- Row 3: CPR action; shopping bag with heart; gift heart; raised hand with heart; medicine bottle; advocacy megaphone; support hand with heart; stacked stones with heart.
- Row 4: magnifying glass search; health calendar; emergency siren; bookmark with heart; volunteer ID badge; hospital building with heart; blood pressure arm/stethoscope; patient/person with heart badge.
- Row 5: two people with heart; chat bubble with heart; pulse wave signal; message bubble with heart; open education book; alert stop sign; information bubble; checklist clipboard.
- Row 6: information card; heart alert; alert speech bubble; document page; video player; first aid cross; play button; download document.
- Row 7: envelope with heart; blood pressure monitor; pills/capsules; medicine bottle; stethoscope with heart; pressure gauge.

Construction rules:
Each icon should be one clear subject cluster. Reduce human figures to simple symbolic forms with no faces, hair, skin tones, fingers, or clothing colour. Medical devices should be simplified outlines. Hearts can be red outline or simple red filled signal only if needed, but keep the overall style line-based. Avoid tiny tick marks, detailed anatomy, detailed hands, texture, dotted decoration, sparkles, filler shapes, and dense props.
Keep more negative space inside each icon than the stroke width. Avoid cramped internal details, touching lines, tangent edges, and small enclosed gaps that could merge when the bitmap is scaled down. Simplify dense subjects before adding detail.
Emergency, medicine, and device icons need especially clear internal spacing: the emergency siren cross must not touch the dome; pills and capsules must have clear air between forms; gauges should use sparse ticks only.

Avoid:
Multicolour icons, warm grey, purple, blue, green, black outlines, black background, transparent checkerboard, white sheet background, shaded 3D icons, filled clipart, gradients, shadows, bevels, texture, realistic rendering, stock icon-library sameness, labels, visible grid lines, boxes, circular backgrounds, blush fields, halos, backplates, decorative blobs, and pasted copies from the reference.

## Post-Processing
1. Copy the chroma-key source into the project.
2. Remove `#00ff00` with chroma-key alpha extraction.
3. Sanitize all visible pixels to AHA red `#c8102e`.
4. Sanitize fully transparent pixels to white RGB with alpha `0`.
5. Upscale to a grid-friendly transparent PNG size where width is divisible by 8 and height is divisible by 7.
6. Remove any generated white/off-white fills from closed icon shapes so the final asset is red linework only on alpha.
7. Cut separate same-size PNGs from the finished sheet. Use component-aware cropping if generated rows drift from the mathematical grid, so adjacent icon fragments do not appear in individual cutouts.
8. Record the final cutout cell size in the manifest.

## Quality Check
- Exactly 54 red icons in the same general 8-column by 7-row arrangement as the reference.
- One colour only.
- Flat chunky line style.
- Transparent background in the final file.
- No white fills in closed icon shapes.
- No green fringe after chroma-key removal.
- No line collisions in dense symbols such as the emergency siren and pills/capsules.
- Icons are evenly spaced and centered for same-size cutouts.
- Bottom row has 6 icons and 2 empty cells.
