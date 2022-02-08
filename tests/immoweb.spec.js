import { test } from '@playwright/test';
import notify from '../helpers/notify.js';

const MIN_PRICE = 350000;
const MAX_PRICE = 750000;

// // https://www.immoweb.be/nl/zoeken/huis/te-koop/Antwerpen/2000?countries=BE&minPrice=350000&maxPrice=750000&page=1&orderBy=newest
let content = null;

test('basic test', async ({ page }) => {
  await page.goto(
    `https://www.immoweb.be/nl/zoeken/huis/te-koop/Antwerpen/2000?countries=BE&minPrice=${MIN_PRICE}&maxPrice=${MAX_PRICE}&page=1&orderBy=newest`,
    { waitUntil: 'networkidle' },
  );
  content = await page.locator('.card--result').evaluateAll(list => list.map((element) => {
    const removeScreenReader = (sr) => {
      sr.querySelectorAll('.sr-only').forEach(el => el.parentNode.removeChild(el));
      return sr;
    };
    const data = {
      id: element.id,
      link: element.querySelector('.card__title a').href,
      title: element.querySelector('.card__title').innerText,
      price: removeScreenReader(element.querySelector('.card--result__price')).innerText,
      info: removeScreenReader(element.querySelector('.card__information--property'))?.innerText,
    };
    return data;
  }));

  await content.reduce(async (resolvePrevious, data) => {
    await resolvePrevious;
    const elementHandle = await page.locator(`#${data.id}`);
    await elementHandle.scrollIntoViewIfNeeded({ timeout: 500 });
    const src = await elementHandle.evaluate((el) => {
      el.scrollIntoView();
      return el.querySelector('.card__media-picture')?.src;
    });
    Object.assign(data, { image_url: src });
  }, Promise.resolve());
  console.log('FOUND');
  console.log(content);
});

test.afterAll(async () => {
  // await Promise.all(content.map((data, i) => new Promise((resolve) => {
  //   setTimeout(() => {
  //     notify({
  //       text: 'Nieuw pand op Immoweb',
  //       attachment: {
  //         title: data.title,
  //         title_link: data.link,
  //         text: `${data.info} ${data.price}`,
  //         image_url: data.image_url,
  //       },
  //     });
  //     console.log(data.id, data.title);
  //     resolve();
  //   }, i * 500);
  // })));
});
