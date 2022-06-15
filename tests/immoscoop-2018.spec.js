import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const url = `https://www.immoscoop.be/zoeken/te-koop/2018-antwerpen/all/woonhuis?minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}&sort=date%2CDESC`;
const title = 'Immoscoop | 2018 Antwerpen';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('[data-component="property-card"]'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.getAttribute('data-property-id'),
      link: element.querySelector('[data-component~="property-card__title"] a')?.href?.split('?')[0],
      title: element.querySelector('[data-component~="property-card__title"]')?.innerText,
      price: element.querySelector('[data-component~="property-card__price"]')?.innerText,
      info: element.querySelector('[data-component~="property-card__address"]')?.innerText,
      image_url: element.querySelector('[data-component~="property-card__image"]')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
