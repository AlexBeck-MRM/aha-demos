# Healthy Living Guide System High Fidelity 2026-04-28

## Scope
- replace the earlier Healthy Living wireframe approach
- remove the separate pillar hub layer
- define the new model as:
  - directional Super Hub
  - evergreen Guide
  - linked Article, Resource, Recipe, Tool, Video, or Infographic
- create a high-fidelity visual overview with indicative AHA content

## Retired artifacts
- removed the earlier Healthy Living wireframe notes
- removed the earlier Healthy Living wireframe mockup folders
- removed the earlier wireframe references from source indexes

## Evidence
- current Healthy Living page: `https://www.heart.org/en/healthy-living`
- current Healthy Eating page: `https://www.heart.org/en/healthy-living/healthy-eating`
- current Eat Smart page: `https://www.heart.org/en/healthy-living/healthy-eating/eat-smart`
- current Nutrition Basics page: `https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics`
- current Fitness page: `https://www.heart.org/en/healthy-living/fitness`
- current Sleep page: `https://www.heart.org/en/healthy-living/healthy-lifestyle/sleep`
- current Stress Management page: `https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management`
- current Quit Smoking, Vaping and Tobacco Use page: `https://www.heart.org/en/healthy-living/healthy-lifestyle/quit-smoking-tobacco`
- current Losing Weight page: `https://www.heart.org/en/healthy-living/healthy-eating/losing-weight`
- canonical brief: `knowledge/distilled/canonical-brief.md`
- experience research: `knowledge/sources/experience-insights-mergers/hypotheses-and-conclusions.md`
- board source: `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/board.html`
- board renderer: `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/render.mjs`
- board image: `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/healthy-living-guide-system-high-fidelity.png`

## Direction
Use two navigational page layers plus one supporting content layer.

```text
Super Hub
  Guide
    Supporting content
```

Do not use a separate Pillar Hub.

The guide is the destination. It should feel like a book, course, or handbook on the subject.

Supporting content should not create another navigational layer. It should be referenced from the relevant guide chapter and can be promoted to the Super Hub when useful.

## Content model

```text
/healthy-living
  directional Super Hub

/healthy-living/healthy-eating
  evergreen guide
  chapters:
    1. Start with a heart-healthy pattern
    2. Build your plate
    3. Read labels and choose foods
    4. Cook, plan, and shop
    5. Adjust sodium, sugar, fats, and alcohol
    6. Make it stick
    7. Tools, recipes, and sources

/healthy-living/exercise-and-fitness
  evergreen guide
  chapters:
    1. Start moving safely
    2. Know how much activity helps
    3. Choose walking, strength, balance, or flexibility
    4. Build activity into daily life
    5. Stay motivated
    6. Tools and trackers

/healthy-living/sleep
  evergreen guide
  chapters:
    1. Why sleep matters for heart health
    2. Know how much sleep you need
    3. Build a bedtime routine
    4. Adjust light, screens, caffeine, and timing
    5. Know when sleep problems need care
    6. Tools and sources

/healthy-living/mental-wellbeing
  evergreen guide
  chapters:
    1. Stress, mental health, and your heart
    2. Notice stress signals
    3. Use movement, breathing, and mindfulness
    4. Build gratitude and connection
    5. Know when to get help
    6. Tools and sources

/healthy-living/quit-smoking-and-vaping
  evergreen guide
  chapters:
    1. Why quitting matters now
    2. Make a quit plan
    3. Manage cravings and setbacks
    4. Understand vaping and nicotine
    5. Stay tobacco-free
    6. Support and sources

/healthy-living/weight-management
  evergreen guide
  chapters:
    1. Understand healthy weight and heart health
    2. Build food, movement, sleep, and stress habits
    3. Use substitutions and planning
    4. Track patterns without shame
    5. Support children and families
    6. Tools and sources
```

## Super Hub behavior
The Super Hub is directional.

Primary job:
- get users to the right guide

Core module:
- `Find your healthy living guide`

Inputs:
- `I want to eat better`
- `I want to move more`
- `I want to sleep better`
- `I want to manage stress`
- `I want to quit tobacco or vaping`
- `I want to manage weight`

Secondary filters:
- `Lower blood pressure`
- `Lower cholesterol`
- `Have more energy`
- `Cook for my family`
- `Recover after a heart event`
- `Start small`

Output:
- recommended guide
- three chapter starting points
- two supporting resources

The page should still show the six guide cards below the finder so browsing remains possible.

## Guide behavior
The Guide is evergreen.

It should read as:
- structured learning
- clear chapters
- progress through a subject
- repeat-use reference
- AHA authority and practical support

Required pieces:
- guide title and promise
- chapter navigation
- chapter cards
- key takeaways
- linked resources inside each chapter
- tools and recipes where relevant
- sources and review cues

## Supporting content behavior
Supporting content includes:
- articles
- recipes
- tools
- videos
- infographics
- PDFs

It should:
- keep its editorial or utility format
- show the guide and chapter it belongs to
- link back to that guide
- support one clear next action
- be eligible for promotion on the Super Hub

It should not:
- become a sub-hub
- carry a large independent sidebar
- compete with the guide as the canonical learning structure

## High-fidelity board read
The board shows three layers:
1. Directional Super Hub
2. Evergreen Guide
3. Linked Article or Resource

The board uses `Healthy Eating` as the worked example because current AHA content gives enough real labels to demonstrate the model.

Real content examples used:
- `Eat Smart`
- `Nutrition Basics`
- `The American Heart Association Diet and Lifestyle Recommendations`
- `Are Ultraprocessed Foods Good or Bad?`
- `5 Heart-Healthy Eating Habits`
- `Making the Most of the Nutrition Facts Label Infographic`
- `Heart-Healthy Recipes`
- `Heart-Check Foods`

## Design rationale
- The Super Hub should feel like a helpful routing surface, not an archive.
- The Guide should feel like the main destination, not an intermediate listing page.
- Supporting content should add depth, freshness, and specificity without weakening the guide.
- This model keeps evergreen guidance stable while letting timely or specific content move around the system.
- It fits the project principle that navigation, search, local wayfinding, and recovery paths should work together.

## Retrieval note
Use this note when discussing the simplified Healthy Living model, the removal of the pillar hub layer, high-fidelity Healthy Living overview design, or evergreen guide versus supporting content behavior.
