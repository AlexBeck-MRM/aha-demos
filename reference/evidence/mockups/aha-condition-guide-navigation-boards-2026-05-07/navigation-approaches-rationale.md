# Condition Guide Navigation Approaches

Date: 2026-05-06

Worked example: High Blood Pressure

Reusable frame: The same navigation logic should be able to support Healthy Living guide pages, with different section labels and task routes.

## Board Files

- `board-01-parent-desktop-navigation.png` - parent condition guide, desktop
- `board-02-detail-desktop-navigation.png` - detail subpage, desktop
- `board-03-parent-mobile-navigation.png` - parent condition guide, mobile
- `board-04-detail-mobile-navigation.png` - detail subpage, mobile

All boards are normalized to `1600 x 1000` so individual panels can be cropped consistently.

## Parent Page Navigation Approaches

### 1. Sticky Chapter Rail

The current model: one complete long guide with a small persistent section rail.

Pros:
- Keeps the guide feeling complete and authoritative.
- Lets users scan without choosing the right page first.
- Supports anchors, browser find, and long-form reading.
- Easy to reuse for Healthy Living pages with different labels.

Cons:
- Can feel long if sections are not tightly chunked.
- Mobile needs a different treatment because a left rail does not translate.
- Contextual subpage links need discipline so the rail does not become a sitemap.

### 2. Hub And Spoke

The parent becomes a high-level landing page with five section cards that open subpages.

Pros:
- Short parent page.
- Clear section destinations.
- Good if each chapter is large enough to deserve a full page.

Cons:
- Recreates the current maze problem if users must keep jumping.
- Makes AHA feel less like it has one canonical answer.
- More clicks for basic understanding.
- Weak for users who do not know which section they need.

### 3. Hybrid Summary Plus Deep Links

The parent keeps all five sections as summaries, with each summary linking to a fuller chapter page.

Pros:
- Good compromise between authority page and SEO subpages.
- Keeps the full mental model visible.
- Gives deeper routes without forcing them.

Cons:
- Risk of duplicated content between parent and chapter pages.
- Requires editorial rules for what stays on parent versus subpage.
- Can become visually repetitive if every section uses the same card pattern.

### 4. Sticky Chapter Tabs

Five tabs sit across the top and either jump to sections or swap section content.

Pros:
- Compact and familiar.
- Good for quick switching between fixed categories.
- Can work for both condition and Healthy Living guide pages.

Cons:
- If tabs swap content in place, SEO, browser find, and deep linking suffer.
- On mobile, five tabs can become cramped.
- Tabs can make a serious health guide feel more like a settings panel.

### 5. Task-First Navigation

The page starts with user intents: understand my reading, check urgency, build care plan, find tools.

Pros:
- Strong for stressed or task-driven users.
- Good bridge for patients, caregivers, and health-conscious consumers.
- Works well above the five-section structure.

Cons:
- Should not replace chapter navigation because tasks vary by condition.
- Needs careful content mapping so task cards do not create duplicate routes.
- Could become too promotional if overdesigned.

### 6. Guided Pathway

The guide behaves like a stepper with progress, next, and previous chapter controls.

Pros:
- Good for onboarding or newly diagnosed journeys.
- Gives a clear sense of sequence.
- Useful when the content must be read in order.

Cons:
- Too linear for repeat users.
- Poor for quick lookup.
- Can hide the fact that users may only need one section.

## Detail Page Navigation Approaches

### 1. Parent Return And Lightweight Contents

Focused subpage with breadcrumb, parent chapter context, a strong return to the condition parent page, and optional inline contents. It should not use a sticky local nav because that competes with the parent guide's sticky navigation model.

Best use: `Home Blood Pressure Monitoring`, `Resistant Hypertension`, `High Blood Pressure in Children and Teens`.

### 2. More In This Chapter

Detail page includes a contextual shelf of related subpages from the same parent chapter.

Best use: when the user is already inside `Signs`, `Care`, or `Support` and needs adjacent detail pages.

### 3. Focused Explainer

Simple article with a compact contents control and a strong answer-first structure.

Best use: clinically specific explainer pages.

### 4. Task Or Tool Page

Stepper, checklist, tracker, calculator, or guided worksheet.

Best use: BP tracker, reading log, healthy eating planner, activity plan.

### 5. Audience-Aware Support

Patient content remains primary, with optional caregiver and professional panels.

Best use: pages where caregiver/professional needs are genuinely distinct.

### 6. Related Condition Bridge

Core detail answer first, then a controlled bridge to related conditions and Healthy Living pathways.

Best use: pages connecting high blood pressure to stroke, heart failure, kidneys, diet, activity, or smoking.

## Long Page Versus Section Subpages

### Everything In One Long Page

Pros:
- Best for a complete guide feeling.
- Lowest cognitive overhead for patients.
- Strongest for scanning, browser find, and page anchors.
- Keeps emergency, care, and support content in one place.
- Good for trust because the page feels like a real handbook, not a list of teasers.

Cons:
- Can become heavy and hard to maintain.
- Mobile scrolling can feel endless if the content rhythm is weak.
- Deep specialist topics can clutter the main guide.
- SEO may miss some high-intent long-tail topics unless detail pages exist.

### Each Section As A Subpage

Pros:
- Shorter pages.
- More SEO landing pages.
- Easier to expand individual topics.
- Better for specialist content, tools, and audience-specific pages.

Cons:
- More clicks.
- Users may not know which section they need.
- More risk of duplicated or inconsistent content.
- The parent can become a signpost farm instead of an authority guide.
- The system starts to resemble the current fragmented topic network.

## Recommendation

Use a hybrid model.

The parent condition page should remain a complete guide with five fixed sections: `Overview`, `Signs`, `Causes`, `Care`, and `Support`.

Use the `Sticky Chapter Rail` as the default desktop model, enhanced by `Task-First Navigation` near the top.

On mobile, convert the rail into a sticky horizontal section bar or compact section drawer. The mobile nav should stay chapter-only, not become a nested sitemap.

Create selective detail pages only when a topic is:

- clinically distinct
- too detailed for the parent chapter
- audience-specific
- tool-like
- high-search-demand
- medically or legally review-heavy

For high blood pressure, likely detail pages include:

- Home Blood Pressure Monitoring
- Understanding Blood Pressure Readings
- Resistant Hypertension
- Pulmonary Hypertension
- High Blood Pressure Among Black Adults
- High Blood Pressure in Children and Teens
- Blood Pressure Health Lesson
- Blood Pressure Tracker

For Healthy Living, the same navigation system can work if the labels change. A nutrition guide, for example, could use `Start Here`, `Learn`, `Plan`, `Practice`, and `Support`, while still using the same parent guide plus selective detail-page model.

Detail-page navigation rule:

- Do not give detail pages their own sticky sidebar.
- Do give every detail page a clear parent return near the top and bottom.
- Do show the parent chapter context, for example `Deeper in Signs`.
- Use only lightweight inline contents if the detail page is long.
- Use contextual related links as modules, not as another navigation tree.

## Recommendation Explained In Five Levels

5: Keep one main guide, and add smaller helper pages only when the helper page has a clear job.

---

7: The main guide should feel like the whole map. Detail pages should feel like rooms you enter when you need more help with one thing.

---

9: If every section becomes its own page, people have to keep choosing where to go. If everything stays on one page, the guide can get too long. The best model is one complete parent page plus carefully chosen deeper pages.

---

12: The parent page should answer the core patient journey: what it is, how to know, why it happens, what to do, and where to get help. Subpages should handle depth: monitoring, specialist conditions, tools, population-specific guidance, and professional resources.

---

16: The recommended architecture is a hybrid authority-page model: a canonical parent guide with stable in-page chapter navigation, plus selective detail pages for topics that justify independent depth, search demand, or task flow. Detail pages should not introduce their own sticky navigation; they should prioritize a clear return to the condition parent page and use only lightweight inline contents when needed. This avoids the fragmentation of a pure hub-and-spoke model while preventing the parent page from becoming overloaded.

## Subagent Read

The second-opinion review recommended the same direction: keep the parent guide canonical, do not split all five sections into independent pages, and use selective subpages for clinically specific, tool-like, audience-specific, or high-search-demand topics.
