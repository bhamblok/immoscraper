import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MAX_PRICE } = process.env;
const url = `https://immo.notaris.be/nl/vastgoed-te-koop/2600-antwerpen-belgie?area=2600+Antwerpen%2C+Belgi%C3%AB&geocoding=51.1923982_4.434799100000001&latitude=51.1923982&longitude=4.434799100000001&gender=SALE&type=HOUSE&max_price=${MAX_PRICE}&radius=5`;
const title = 'immo.notaris.be | 2600 Berchem';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.property__item'),
    elementHandler: async e => e.evaluate(element => ({
      link: element.querySelector('a')?.href?.split('?')[0],
      title: element.querySelector('.property__item--textlink .h3')?.innerText,
      price: element.querySelector('.property__item--price')?.innerText,
      info: element.querySelector('.property__item--textlink .h5')?.innerText,
      image_url: element.querySelector('.container--img img')?.src?.replace('-webp', ''),
    })),
  });

  expect(newImmo?.length).toBe(0);
});
