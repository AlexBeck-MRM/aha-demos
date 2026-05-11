# Healthy Living Navigation Approaches 2026-04-30

## Scope
- Test whether current `Healthy Eating`, `Sleep`, and `Quit Smoking / Vaping / Tobacco` topics fit a universal Healthy Living guide sequence.
- Compare navigation approaches for guide pages and supporting subpages.
- Keep focus on current IA strategy, not final visual design.

## Evidence
- Healthy Eating capture note: `knowledge/sources/current-site-audit/healthy-eating-topic-network-2026-04-29.md`
- Healthy Eating manifest: `reference/evidence/screenshots/aha-healthy-eating-topic-network-2026-04-29/manifest.json`
- Current Sleep branch checked from: `https://www.heart.org/en/healthy-living/healthy-lifestyle/sleep`
- Current Quit Smoking / Vaping / Tobacco branch checked from: `https://www.heart.org/en/healthy-living/healthy-lifestyle/quit-smoking-tobacco`
- Board source: `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/board.html`
- Board renderer: `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/render.mjs`
- Board image: `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/healthy-living-navigation-approaches.png`

## Universal sequence
- `Start Here`
- `Learn Basics`
- `Know What Matters`
- `Make a Plan`
- `Practice Daily`
- `Solve Problems`
- `Connect Health`
- `Tools & Support`

## Healthy Eating fit
- `Start Here`: what heart-healthy eating means, diet and lifestyle recommendations, healthy eating habits that stick
- `Learn Basics`: nutrition basics, nutrient-dense foods, protein, grains, dairy, portions
- `Know What Matters`: food labels, ingredients, packaging claims, ultraprocessed foods, Heart-Check
- `Make a Plan`: budget, grocery shopping, meal planning, pantry basics
- `Practice Daily`: cooking skills, healthy substitutions, recipes, school lunch, family meals
- `Solve Problems`: picky eaters, takeout, cravings, eating when not hungry, time pressure
- `Connect Health`: blood pressure, cholesterol, diabetes, CKM health, weight management, prevention
- `Tools & Support`: recipes, cookbooks, Spanish infographics, Together Tuesdays, Nutrition Security

## Sleep fit
- `Start Here`: what good sleep is, how much sleep people need
- `Learn Basics`: how sleep affects health, brain health, sleep and heart health
- `Know What Matters`: timing, consistency, weekend sleep, naps, technology
- `Make a Plan`: bedtime routine, wake-up routine, lifestyle habits
- `Practice Daily`: sleep hygiene, tech tweaks, evening and morning routines
- `Solve Problems`: weekend catch-up, napping trade-offs, common barriers
- `Connect Health`: brain health, cardiovascular health, chronic stress, blood pressure
- `Tools & Support`: sleep infographics and quick tips

## Quit Smoking / Vaping / Tobacco fit
- `Start Here`: why quitting matters now, benefits of quitting
- `Learn Basics`: how smoking and nicotine damage the body, vaping basics, youth and tobacco
- `Know What Matters`: cigarettes, vaping, nicotine pouches, menthol marketing, product risks
- `Make a Plan`: five steps to quit, help to quit, readiness to quit vaping
- `Practice Daily`: living tobacco-free, managing routines and triggers
- `Solve Problems`: friends and family support, teens, relapse risk, vaping versus smoking confusion
- `Connect Health`: heart health, stroke risk, youth prevention, regulation and public health
- `Tools & Support`: infographics, quit support, policy and science resources

## Navigation approaches tested
- `Persistent Chapter Rail`: stable guide context, chapter-only navigation, subarticles shown inside active chapter.
- `Chapter Tabs + Resource Drawer`: lighter guide page with optional resource layer.
- `Journey Stepper`: behavior-change path for topics where sequence matters.
- `Chapter Cards + Article Shelves`: browseable guide chapters with curated support articles.
- `Guide + Filtered Library`: secondary resource layer for large asset sets.
- `Minimal Progress + More in Chapter`: quiet reading flow with local recovery at chapter/article level.

## Recommendation
- Use a persistent chapter navigation on guide pages.
- Keep the persistent nav chapter-only.
- Place supporting articles, recipes, infographics, tools, and programs inside chapter sections.
- On subpages, use:
  - breadcrumb back to the guide
  - compact chapter context
  - `More in this chapter`
  - related guide cross-links where relevant
- Avoid a full article tree sidebar because it recreates the current archive problem.

## Retrieval note
- Use this note when discussing Healthy Living guide navigation, subpage findability, article consolidation, or the universal Healthy Living sequence.
