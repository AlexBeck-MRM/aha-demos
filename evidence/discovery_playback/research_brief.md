# AHA Discovery Playback — Educational Experience Research Brief

## Workstream split (sub-agent equivalent)
- **Workstream A: Clinical condition education patterns** (adult/general audiences)
- **Workstream B: Kids/visual learning patterns** (medical biology explainers)

## Selection criteria
- Teaches a condition or biology concept with **structured learning flow**, not just link lists.
- Demonstrates at least one of: **video**, **animation**, **illustrations**, **chunked micro-sections**, or **guided progression**.
- Provides transferable UX patterns for users with different literacy levels and learning preferences.

## Candidate experiences to capture
1. Cleveland Clinic — Hypertension health library page  
   URL: https://my.clevelandclinic.org/health/diseases/4314-hypertension-high-blood-pressure
2. KidsHealth — How the Heart Works (kids)  
   URL: https://kidshealth.org/en/kids/heart.html
3. Khan Academy — Circulatory system and heart lesson  
   URL: https://www.khanacademy.org/science/health-and-medicine/human-anatomy-and-physiology/circulatory-pulmonary/a/circulatory-system-and-the-heart
4. Osmosis — Atherosclerosis learning page  
   URL: https://www.osmosis.org/learn/Atherosclerosis
5. Johns Hopkins Medicine — Coronary artery disease overview  
   URL: https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronary-artery-disease
6. CDC — About heart disease  
   URL: https://www.cdc.gov/heartdisease/about.htm
7. BrainPOP — Circulatory system (K-12)  
   URL: https://www.brainpop.com/health/bodysystems/circulatorysystem/
8. NHS — High blood pressure condition page  
   URL: https://www.nhs.uk/conditions/high-blood-pressure-hypertension/

## Pattern hypotheses for AHA deck
- **Chunk first, detail later:** Start with plain-language summary cards, then expand into causes/symptoms/risk/actions.
- **Multimodal modules:** Pair short text with explanatory visuals, motion, and optional video.
- **Audience-adaptive framing:** Offer beginner, caregiver, and deeper-clinical tracks.
- **Cognitive-load aware writing:** Short paragraphs, strong headings, consistent iconography, and explicit “what to do next.”

## Capture specification
- Resolution target: **1280 × 1080**
- Naming pattern: `<company>__<experience>__1280x1080.png`
- Folder strategy: one company per folder under `evidence/discovery_playback/`

## Environment blocker
Automated capture script was prepared (`scripts/capture_education_experiences.mjs`), but this environment cannot download Chromium for Playwright (403 from Playwright CDN), so screenshots are currently marked `pending_capture` in `capture_plan.csv`.
