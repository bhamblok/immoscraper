import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;

// https://www.immoscoop.be/zoeken/te-koop/2000-antwerpen/all/woonhuis?minPrice=400000&maxPrice=750000

test('immo test', async ({ page }) => {
  const newImmo = await scrape({
    page,
    url: `https://www.immoscoop.be/zoeken/te-koop/2000-antwerpen/all/woonhuis?minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}`,
    getTitle: p => p.locator('html > head > title').evaluate(el => el.innerText),
    selectList: p => p.locator('[data-component="property-card"]'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.getAttribute('data-property-id'),
      link: element.querySelector('[data-component="property-card__title"] a').href?.split('?')[0],
      title: element.querySelector('[data-component="property-card__title"]').innerText,
      price: element.querySelector('[data-component="property-card__price"]').innerText,
      info: element.querySelector('[data-component="property-card__address"]')?.innerText,
      image_url: element.querySelector('[data-component="property-card__image"]')?.src,
    })),
  });

  expect(newImmo.length).toBe(0);
});
