import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE, MIN_SURFACE } = process.env;
const url = `https://www.era.be/nl/te-koop/antwerpen-2018/huis?price=${MIN_PRICE}+${MAX_PRICE}&bewoonb_opp=${MIN_SURFACE}+350`;
const title = 'ERA | 2018 Antwerpern';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.node-property'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.querySelector('.property-id-holder').getAttribute('data-property-id'),
      link: element.querySelector('.field-name-node-link a').href?.split('?')[0],
      title: element.querySelector('.field-name-title-field').innerText,
      price: element.querySelector('.field-name-era-actuele-vraagprijs--c').innerText,
      info: element.querySelector('.field-name-era-adres--c')?.innerText,
      image_url: element.querySelector('.field-name-field-property-main-visual img')?.src,
    })),
  });

  expect(newImmo.length).toBe(0);
});
