import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE, MIN_SURFACE } = process.env;
const url = `https://www.immoweb.be/nl/zoeken/huis/te-koop/berchem/2600?countries=BE&minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}&minSurface=${MIN_SURFACE}&page=1&orderBy=newest`;
const title = 'Immoweb | 2600 Berchem';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.card--result'),
    elementHandler: async e => e.evaluate((element) => {
      const removeScreenReader = (sr) => {
        sr.querySelectorAll('.sr-only').forEach(el => el.parentNode.removeChild(el));
        return sr;
      };
      return {
        id: element.id,
        link: element.querySelector('.card__title a').href?.split('?')[0],
        title: element.querySelector('.card__title').innerText,
        price: removeScreenReader(element.querySelector('.card--result__price')).innerText,
        info: removeScreenReader(element.querySelector('.card__information--property'))?.innerText,
        image_url: element.querySelector('.card__media-picture')?.src,
      };
    }),
  });

  expect(newImmo.length).toBe(0);
});
