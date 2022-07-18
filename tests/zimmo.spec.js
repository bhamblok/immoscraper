import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'Zimmo';
const url = 'https://www.zimmo.be/nl/zoeken/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIl19LCJwbGFjZUlkIjp7ImluIjpbMzI3MCwzMjcxLDYwMl19LCJjYXRlZ29yeSI6eyJpbiI6WyJIT1VTRSJdfSwicHJpY2UiOnsidW5rbm93biI6dHJ1ZSwicmFuZ2UiOnsibWluIjozMDAwMDAsIm1heCI6ODAwMDAwfX19LCJwYWdpbmciOnsiZnJvbSI6MCwic2l6ZSI6MTd9LCJzb3J0aW5nIjpbeyJ0eXBlIjoiREFURSIsIm9yZGVyIjoiREVTQyJ9XX0%3D&p=1#gallery';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.property-item'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.querySelector('.property-item_link')?.href?.split('?')[0],
      title: element.querySelector('.property-item_title')?.innerText,
      price: element.querySelector('.property-item_price')?.innerText,
      info: element.querySelector('.property-item_address')?.innerText,
      image_url: element.querySelector('.property-thumb')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
