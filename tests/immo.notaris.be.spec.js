import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const title = 'immo.notaris.be';
const url = `https://immo.notaris.be/nl/vastgoed-te-koop/2000-antwerpen-belgie?latitude=51.2198771&longitude=4.4011356&area=2000+Antwerpen,+België&radius=5&gender=SALE&type=HOUSE&min_price_text=200000&${MIN_PRICE}=&max_price_text=${MAX_PRICE}&max_price=&min_bedroom_number=&filterDisplay=&order_by=distance:ASC&min_nbr_facades=&max_nbr_facades=&min_cadastral_area_text=&min_cadastral_area=&max_cadastral_area_text=&max_cadastral_area=&min_garden_surface_text=&min_garden_surface=&max_cadastral_income_text=&max_cadastral_income=&display_advanced_filters_input=`;

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.property__item'),
    elementHandler: async e => e.evaluate(element => ({
      link: element.querySelector('a')?.href?.split('?')[0],
      title: element.querySelector('.property__item--textlink .h3')?.innerText,
      price: element.querySelector('.property__item--price')?.innerText,
      info: element.querySelector('.property__item--textlink .h5')?.innerText,
      image_url: element.querySelector('.container--img img')?.src?.replace('-webp', ''),
    })),
  });

  expect(newImmo?.length).toBe(0);
});
