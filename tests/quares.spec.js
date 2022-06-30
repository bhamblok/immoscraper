import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const title = 'QUARES';
const url = `https://immo.quares.be/nl/te-koop?category%5B%5D=8&zip%5B%5D=2000&zip%5B%5D=2018&zip%5B%5D=2600&minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}&bedrooms=&neighbourhood=&reference=&keyword=`;

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.gallcell .estate-container'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: `https://immo.quares.be${element.querySelector('.item')?.getAttribute('data-href')}`,
      title: element.querySelector('.info-top h3')?.innerText,
      price: element.querySelector('.price')?.innerText,
      info: element.querySelector('.city')?.innerText,
      image_url: element.querySelector('.image')?.getAttribute('style')?.replace('background-image: url("', '')?.replace('");', ''),
    })),
  });

  expect(newImmo?.length).toBe(0);
});
