import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'CITYPLUS';
const url = 'https://www.cityplus.be/koop';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('[data-testid~="gallery-item-item"]'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.querySelector('[data-testid~="gallery-item-click-action-link"]')?.href,
      link: element.querySelector('[data-testid~="gallery-item-click-action-link"]')?.href,
      title: element.querySelector('[data-testid~="gallery-item-description"]')?.innerText,
      price: element.querySelector('[data-testid~="gallery-item-title"]')?.innerText,
      info: element.querySelector('[data-testid~="gallery-item-description"]')?.innerText,
      image_url: element.querySelector('wix-image img')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
