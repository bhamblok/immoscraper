import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const url = `https://www.walls.be/wonen/te-koop?query={%22minPrice%22:%22${MIN_PRICE}%22,%22maxPrice%22:%22${MAX_PRICE}%22,%22category%22:%221%22,%22zips%22:[%222000%22,%222018%22,%222600%22]}`;
const title = 'WALLS';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.galcell'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.href,
      title: element.querySelector('.item--info h2')?.innerText,
      price: element.querySelector('.item--price')?.innerText,
      info: `${element.querySelector('.item--city')?.innerText} ${element.querySelector('.item--street')?.innerText} - ${element.querySelector('.item--surface')?.innerText}`,
      image_url: element.querySelector('img')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
