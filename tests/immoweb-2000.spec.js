import 'dotenv/config';
import { test, expect } from '@playwright/test';
import isNewImmo from '../helpers/isNewImmo.js';

const { MIN_PRICE, MAX_PRICE, MIN_SURFACE } = process.env;

// https://www.immoweb.be/nl/zoeken/huis/te-koop/Antwerpen/2000?countries=BE&maxPrice=750000&minPrice=350000&minSurface=170&page=1&orderBy=newest

// const scrape = () => {

// };

test('immo test', async ({ page }) => {
  await page.goto(
    `https://www.immoweb.be/nl/zoeken/huis/te-koop/Antwerpen/2000?countries=BE&minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}&minSurface=${MIN_SURFACE}&page=1&orderBy=newest`,
  );
  const [title, ids] = await Promise.all([
    page.locator('html > head > title').evaluate(el => el.innerText),
    page.locator('.card--result').evaluateAll(list => list.map(el => el.id)),
  ]);
  const content = await ids.reduce(async (resolvePrevious, id) => {
    const data = await resolvePrevious;
    const elementHandle = await page.locator(`#${id}`);
    await elementHandle.scrollIntoViewIfNeeded();
    await new Promise(res => setTimeout(res, 250));
    data.push(Object.assign({ id }, await elementHandle.evaluate((element) => {
      const removeScreenReader = (sr) => {
        sr.querySelectorAll('.sr-only').forEach(el => el.parentNode.removeChild(el));
        return sr;
      };
      return {
        link: element.querySelector('.card__title a').href?.split('?')[0],
        title: element.querySelector('.card__title').innerText,
        price: removeScreenReader(element.querySelector('.card--result__price')).innerText,
        info: removeScreenReader(element.querySelector('.card__information--property'))?.innerText,
        image_url: element.querySelector('.card__media-picture')?.src,
      };
    })));
    return data;
  }, Promise.resolve([]));

  const newImmo = await isNewImmo(title, content);

  expect(newImmo.length).toBe(0);
});
