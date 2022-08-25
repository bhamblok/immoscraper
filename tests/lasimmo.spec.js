import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'LAS IMMO';
const url = 'https://www.lasimmo.be/nl/te-koop/gemeente=antwerpen+sortering=new+type=huis';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.house'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.querySelector('a')?.href,
      link: element.querySelector('a')?.href,
      title: element.querySelector('.title')?.innerText,
      price: element.querySelector('.price')?.innerText,
      info: element.querySelector('.info')?.innerText,
      image_url: element.querySelector('.img-responsive')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
