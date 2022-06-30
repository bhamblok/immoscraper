import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const title = 'UGLY';
const url = 'https://ugly.be/aanbod/?_sfm_pand_filterwaarde=te%20koop&sort_order=_sfm_pand_gemeente+asc+alpha';

test.only(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('.aanbod-wrapper a.aanbod-block'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.href,
      link: element.href,
      title: element.querySelector('.aanbod-block-text h3')?.innerText,
      price: element.querySelector('.aanbod-block-prijs')?.innerText,
      info: element.querySelector('.aanbod-block-hover')?.innerText,
      image_url: element.querySelector('.aanbod-block-image')?.getAttribute('style')?.replace("background-image:url('", '')?.replace("');", ''),
    })),
  });

  expect(newImmo?.length).toBe(0);
});
