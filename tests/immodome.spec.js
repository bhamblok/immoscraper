import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const title = 'Immodôme';
const url = `https://www.immodome.be/nl?price-from=${MIN_PRICE}&price-to=${MAX_PRICE}&type%5B%5D=huis&region%5B%5D=Antwerpen+centrum&region%5B%5D=Randgemeenten`;

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('#grid-estates .estate-item'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.getAttribute('data-id'),
      link: element.querySelector('.link-block a')?.href,
      title: element.querySelector('.grid-item-wrapper h2')?.innerText,
      price: element.querySelector('.price')?.innerText,
      info: element.querySelector('.city')?.innerText,
      image_url: element.querySelector('.image-container img')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
