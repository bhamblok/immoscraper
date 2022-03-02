import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE, MIN_SURFACE } = process.env;

// https://immo.vlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&towns=2600-berchem&propertytypes=huis&minlivablesurface=170&minprice=400000&maxprice=750000&noindex=1

test('immo test', async ({ page }) => {
  const newImmo = await scrape({
    page,
    url: `https://immo.vlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&towns=2600-berchem&propertytypes=huis&minlivablesurface=${MIN_SURFACE}&minprice=${MIN_PRICE}&maxprice=${MAX_PRICE}&noindex=1`,
    title: 'Immovlan | 2600 Berchem',
    selectList: p => p.locator('article.list-view-item'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.querySelector('.card-title a').href?.split('?')[0],
      title: element.querySelector('.card-title').innerText,
      price: element.querySelector('.list-item-price').innerText,
      info: element.querySelector('.list-item-description')?.innerText,
      image_url: element.querySelector('.card-image img')?.src?.replace('-webp', ''),
    })),
  });

  expect(newImmo.length).toBe(0);
});
