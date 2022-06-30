import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'Biddit';
const url = 'https://www.biddit.be/nl/search?postalCodes=2000&postalCodes=2018&postalCodes=2600&types=HOUSE&priceMax=700000&priceMin=200000&sortVal=sortAndRanking.firstPublicationDateTime,desc&sortKey=searchcomponent.order.date&page=1&maps=false';

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('app-property-display-v2'),
    elementHandler: async e => e.evaluate(element => ({
      link: element.querySelector('a')?.href?.split('?')[0],
      title: element.querySelector('.property-title')?.innerText,
      price: element.querySelector('.property-price')?.innerText,
      info: element.querySelector('.property-address')?.innerText,
      image_url: element.querySelector('.image-prop')?.getAttribute('style')?.replace('background-image: url("', '')?.replace('");', ''),
    })),
  });

  expect(newImmo?.length).toBe(0);
});
