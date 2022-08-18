import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'De Boer en Partners';
const url = 'https://www.deboerenpartners.be/te-koop?term=&status=te+koop&category%5B%5D=huis&priceRange%5B%5D=250000-500000&priceRange%5B%5D=500000-750000&location%5B%5D=2000%7Cantwerpen&location%5B%5D=2018%7Cantwerpen&location%5B%5D=2600%7Cantwerpen&bedrooms=';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.estates > .row'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.querySelector('.pand-omschrijving > a')?.href?.split('?')[0]
        || element.querySelector('.pand-image > a')?.href?.split('?')[0],
      title: element.querySelector('.pand-omschrijving h2')?.innerText,
      price: element.querySelector('.pand-info h2')?.innerText,
      info: element.querySelector('.pand-omschrijving p')?.innerText,
      image_url: element.querySelector('.pand-image-container img')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
