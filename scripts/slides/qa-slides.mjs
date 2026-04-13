import { chromium } from 'playwright';

const url = process.argv[2] || 'http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1960, height: 1200 } });
await page.goto(url);
await page.waitForTimeout(300);

const report = await page.evaluate(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const overflow = [];

  for (const slide of slides) {
    const content = slide.querySelector('.content');
    if (!content) continue;
    const c = content.getBoundingClientRect();
    let outside = 0;

    for (const el of content.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.left < c.left - 0.5 || r.top < c.top - 0.5 || r.right > c.right + 0.5 || r.bottom > c.bottom + 0.5) {
        outside += 1;
      }
    }

    if (outside) overflow.push({ id: slide.dataset.layoutId, outside });
  }

  return {
    slideCount: slides.length,
    overflow,
    hasInlineStyles: document.querySelectorAll('[style]').length,
    nonRegularBodyCount: [...document.querySelectorAll('.body,.body-lg,.body-xl,.list-block,.card p,.band p')].filter((el) => parseInt(getComputedStyle(el).fontWeight, 10) >= 500).length,
    nonBlackIcons: [...document.querySelectorAll('.mdi')].filter((i) => getComputedStyle(i).color !== 'rgb(0, 0, 0)').length,
    nonRedAccentClasses: document.querySelectorAll('.accent-orange, .accent-teal, .accent-slate').length,
    hasPlaceholderMedia: document.querySelectorAll('img.placeholder-media, .image-hero img, .image-duo img, .flow-mini img, .chart-area img').length
  };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
