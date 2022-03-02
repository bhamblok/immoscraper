import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

// https://www.deboerenpartners.be/te-koop/huis/2600%7Cantwerpen/alle-prijzen?term=&status=te+koop&bedrooms=&view=list&sort=null

test('immo test', async ({ page }) => {
  const newImmo = await scrape({
    page,
    url: 'https://www.deboerenpartners.be/te-koop/huis/2600%7Cantwerpen/alle-prijzen?term=&status=te+koop&bedrooms=&view=list&sort=null',
    title: 'De Boer en Partners | 2600 Berchem',
    selectList: p => p.locator('.estates > .row'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.querySelector('.pand-image > a')?.href?.split('?')[0],
      title: element.querySelector('.pand-omschrijving h2').innerText,
      price: element.querySelector('.pand-info h2').innerText,
      info: element.querySelector('.pand-omschrijving p')?.innerText,
      image_url: element.querySelector('.pand-image-container img')?.src,
    })),
  });

  expect(newImmo.length).toBe(0);
});
