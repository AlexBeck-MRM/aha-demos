# master styleframe prompt usage

this file is a usage note, not an execution prompt.

the only prompts you should actually paste into nano banana are the route sections inside:

- `styleframe-01.md`
- `styleframe-02.md`

## how to use the prompt set

for each deliverable:
1. attach the matching structural wireframe image first
2. attach the cleaned visual reference image second
3. attach the direct illustration style reference image next when illustration appears in the board
4. attach the palette swatch image after that when useful
5. use one route section only

do not combine multiple route sections together.

## why it is written this way

the route sections are written for nano banana specifically:
- structure first
- palette second
- case rule third
- route behavior after that
- trust and negative constraints at the end

this order is deliberate. the model needs to lock the board geometry and contrast behavior before it starts inventing content or styling.

## background and contrast rule across all four prompts

- the board background should be white-first or pale neutral, using `#ffffff`, `#f4f3f3`, `#f5f4f2`, `#eeece9`, or `#e1e0dc` as the main field
- the cards should sit lighter on top using `#ffffff`, `#f4f3f3`, or `#f5f4f2`
- the cards should not become taupe, brown, or muddy
- do not use a red ambient bloom, red haze, or inflammatory red gradient in the background
- the outer bento tiles should sit flat on the board field with little or no cast shadow
- bring depth into the ui elements inside the tiles instead: inset panels, floating chips, mini cards, toggles, segmented controls, overlays, charts, input fields, and button surfaces
- use depth through overlap, float, inset panels, layered surfaces, and controlled shadow inside the ui, not on the whole tile containers

## imagery balance across all four prompts

- illustration should be a support layer, not the dominant visual strategy
- aim for roughly `25-35%` illustration presence across the board
- keep roughly `65-75%` of the board driven by photography, ui moments, icons, and content surfaces
- use illustration where it explains, softens, guides, or adds branded ownership
- do not let the board drift into an illustration-led campaign poster

## wireframe guidance

the current wireframes are useful for structure, but because they are very light and flat they can bias the model toward low-contrast outputs.

the prompt system compensates for that by explicitly telling the model:
- the pale neutral system belongs in the background
- the cards should stay lighter
- one red gradient should help energize the board
- visible depth should be present

if the wireframes are revised later, a better direction would be:
- keep the geometry the same
- lightly tone the board background
- keep cards lighter than the field
- add subtle tonal separation only
- do not make the wireframes feel like finished visual designs

## illustration guidance

yes, include direct illustration reference images when you want the illustration style to hold.

text is not enough on its own here. the model needs a visual reference for:
- no-outline flat-fill construction
- scale behavior from icon to editorial scene
- chunkiness of shapes
- organic curve behavior
- scene simplicity
- the relationship between icons and larger illustrations

the intended illustration direction is:
- one shared family from icons to scenes
- no-outline flat vector construction
- slightly chunky shapes
- controlled organic curves
- simple clean scenes or icon-derived object compositions
- broad white, off-white, cool bone, light stone grey, taupe-grey, and charcoal fills
- one controlled AHA-red action or emotional signal
- secondary pastel tints only when tied to the subject: water or air, nature, soft red support, food, or sleep
- scene identity carried by recognizable topic symbols, silhouette, gesture, and context rather than portrait rendering
- minimal broad shading only
- editorial scenes can be more magazine-like through crop, rhythm, and layered composition, not through extra detail
- colour concentrated into one or two broad focal areas rather than many small accents
- avoid brown, beige, taupe, oat, or warm stone becoming the dominant scene colour
- no stroked outlines around people, props, furniture, backplates, or ground planes
- no glossy modelling of faces, hair, hands, or fabric

for healthy living topic grids:
- start from the wireframe icon subjects: apple or balanced plate, shoe or movement path, crescent moon, calm/stress symbol, no-smoking or no-vaping mark, scale or progress cue
- people are optional, not required; prefer symbolic still-life/topic compositions unless the brief explicitly asks for human scenes
- if image generation is unavailable, provide the prompt and stop; do not create SVG, PIL, or code-drawn fallback artwork

best practice image order:
1. structural wireframe
2. cleaned visual board reference
3. direct illustration style reference
4. palette swatch image

if illustration is important in the output, attach at least one direct illustration style image. two is better than one if they are tightly consistent.
