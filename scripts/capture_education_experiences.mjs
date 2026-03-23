#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const VIEWPORT = { width: 1280, height: 1080 };
const OUTPUT_ROOT = 'evidence/discovery_playback';

const targets = [
  {
    company: 'cleveland_clinic',
    page: 'health_library_hypertension',
    url: 'https://my.clevelandclinic.org/health/diseases/4314-hypertension-high-blood-pressure',
    rationale: 'Medical education article with chunked sections, quick facts blocks, and scannable headings.',
    formats: ['chunked text', 'structured headings', 'callout blocks'],
  },
  {
    company: 'kidshealth',
    page: 'how_the_heart_works',
    url: 'https://kidshealth.org/en/kids/heart.html',
    rationale: 'Kid-friendly medical biology explanation using short paragraphs and illustrations.',
    formats: ['kid-friendly language', 'illustrations', 'bite-sized sections'],
  },
  {
    company: 'khan_academy',
    page: 'circulatory_system_video_lesson',
    url: 'https://www.khanacademy.org/science/health-and-medicine/human-anatomy-and-physiology/circulatory-pulmonary/a/circulatory-system-and-the-heart',
    rationale: 'Blended learning experience combining lesson narrative with embedded video and progress structure.',
    formats: ['video + text', 'modular lesson flow', 'progressive disclosure'],
  },
  {
    company: 'osmosis',
    page: 'atherosclerosis_topic_overview',
    url: 'https://www.osmosis.org/learn/Atherosclerosis',
    rationale: 'Concept-first medical topic page mixing visuals, concise explainer text, and media-forward layout.',
    formats: ['illustrated diagrams', 'concise summaries', 'media-forward layout'],
  },
  {
    company: 'johns_hopkins_medicine',
    page: 'coronary_artery_disease',
    url: 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronary-artery-disease',
    rationale: 'Condition explainer with clearly separated sections for causes, symptoms, diagnosis, and treatment.',
    formats: ['sectioned content', 'navigation aids', 'plain-language summaries'],
  },
  {
    company: 'cdc',
    page: 'about_heart_disease',
    url: 'https://www.cdc.gov/heartdisease/about.htm',
    rationale: 'Public-health educational pattern with concise bullets, data snippets, and clear hierarchy.',
    formats: ['bullet summaries', 'fact-oriented content', 'public health framing'],
  },
  {
    company: 'brainpop',
    page: 'circulatory_system',
    url: 'https://www.brainpop.com/health/bodysystems/circulatorysystem/',
    rationale: 'K-12 educational model centered on animation/video-first learning and guided supporting resources.',
    formats: ['animation/video-first', 'supporting quizzes', 'multi-modal learning'],
  },
  {
    company: 'nhs',
    page: 'high_blood_pressure_overview',
    url: 'https://www.nhs.uk/conditions/high-blood-pressure-hypertension/',
    rationale: 'Service-oriented condition page with tightly chunked sections and strong scannability.',
    formats: ['task-based layout', 'short content blocks', 'clear information architecture'],
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function waitForStable(page) {
  await page.waitForLoadState('domcontentloaded', { timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}

async function dismissCommonOverlays(page) {
  const selectors = [
    '#onetrust-accept-btn-handler',
    'button:has-text("Accept")',
    'button:has-text("I agree")',
    'button:has-text("Agree")',
    'button[aria-label*="close" i]',
  ];

  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    const visible = await loc.isVisible().catch(() => false);
    if (visible) {
      await loc.click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(150);
    }
  }
}

async function capture() {
  await ensureDir(OUTPUT_ROOT);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });

  const notes = [];

  for (const target of targets) {
    const companyDir = path.join(OUTPUT_ROOT, target.company);
    await ensureDir(companyDir);
    const page = await context.newPage();

    let status = 'ok';
    let error = '';
    const filename = `${target.company}__${target.page}__1280x1080.png`;
    const filePath = path.join(companyDir, filename);

    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await waitForStable(page);
      await dismissCommonOverlays(page);
      await page.screenshot({ path: filePath, fullPage: false });
    } catch (err) {
      status = 'failed';
      error = String(err.message || err);
    } finally {
      await page.close();
    }

    notes.push({ ...target, status, error, screenshot: path.relative(process.cwd(), filePath) });
    console.log(`[${status}] ${target.company} -> ${filePath}`);
  }

  await browser.close();

  const md = [
    '# Discovery Playback Research — Educational Experiences',
    '',
    'This set focuses on digital patterns that teach health/biology concepts without relying on long lists of links.',
    '',
    '| Company | Page focus | Primary content patterns | Screenshot | Status |',
    '| --- | --- | --- | --- | --- |',
    ...notes.map((n) => `| ${n.company} | ${n.page} | ${n.formats.join(', ')} | ${n.screenshot} | ${n.status}${n.error ? ` (${n.error.replace(/\|/g, '/')})` : ''} |`),
    '',
    '## Design Signals to Potentially Bring into AHA Discovery Playback',
    '',
    '- **Chunking over link-heavy layouts:** Most successful pages separate concepts into short labeled blocks.',
    '- **Multimodal learning:** Video/animation paired with concise text improves comprehension and retention, especially for visual learners.',
    '- **Progressive learning flow:** Start with a plain-language summary, then allow deeper exploration into causes/symptoms/treatment.',
    '- **Accessibility-oriented structure:** Clear heading hierarchy, short paragraphs, and supportive visuals reduce cognitive load.',
    '- **Action scaffolding:** Good experiences include “what this means for me” next steps rather than only encyclopedic definitions.',
  ].join('\n');

  await fs.writeFile(path.join(OUTPUT_ROOT, 'research_notes.md'), `${md}\n`, 'utf8');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
