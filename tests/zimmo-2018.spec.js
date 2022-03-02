import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE, MIN_SURFACE } = process.env;

// https://www.zimmo.be/nl/panden/?status=1&type%5B0%5D=5&hash=a4d2c3f21f946f46da9e1403424cf48b&priceMin=400000&priceMax=750000&priceIncludeUnknown=1&priceChangedOnly=0&bedroomsIncludeUnknown=1&bathroomsIncludeUnknown=1&constructionIncludeUnknown=1&livingAreaMin=170&livingAreaIncludeUnknown=1&landAreaIncludeUnknown=1&commercialAreaIncludeUnknown=1&yearOfConstructionIncludeUnknown=1&epcIncludeUnknown=1&queryCondition=and&includeNoPhotos=1&includeNoAddress=1&onlyRecent=0&onlyRecentlyUpdated=0&isPlus=0&region=list&city=MzAYBQMHDAE%253D&sort=recent&sort_order=desc#gallery

test('immo test', async ({ page }) => {
  const newImmo = await scrape({
    page,
    url: `https://www.zimmo.be/nl/panden/?status=1&type%5B0%5D=5&hash=a4d2c3f21f946f46da9e1403424cf48b&priceMin=${MIN_PRICE}&priceMax=${MAX_PRICE}&priceIncludeUnknown=1&priceChangedOnly=0&bedroomsIncludeUnknown=1&bathroomsIncludeUnknown=1&constructionIncludeUnknown=1&livingAreaMin=${MIN_SURFACE}&livingAreaIncludeUnknown=1&landAreaIncludeUnknown=1&commercialAreaIncludeUnknown=1&yearOfConstructionIncludeUnknown=1&epcIncludeUnknown=1&queryCondition=and&includeNoPhotos=1&includeNoAddress=1&onlyRecent=0&onlyRecentlyUpdated=0&isPlus=0&region=list&city=MzAYBQMHDAE%253D&sort=recent&sort_order=desc#gallery`,
    getTitle: p => p.locator('html > head > title').evaluate(el => el.innerText),
    selectList: p => p.locator('.property-item'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.id,
      link: element.querySelector('.property-item_link').href?.split('?')[0],
      title: element.querySelector('.property-item_title').innerText,
      price: element.querySelector('.property-item_price').innerText,
      info: element.querySelector('.property-item_address')?.innerText,
      image_url: element.querySelector('.property-thumb')?.src,
    })),
  });

  expect(newImmo.length).toBe(0);
});
