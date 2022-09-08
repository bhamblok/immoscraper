import 'dotenv/config';
import { test, expect } from '@playwright/test';
import scrape from '../helpers/scrape.js';

const { MIN_PRICE, MAX_PRICE } = process.env;
const title = 'DEWAELE';
const url = `https://www.dewaele.com/nl/te-koop/alle?filter%5Bcity_ids%5D%5B%5D=272&filter%5Bcity_ids%5D%5B%5D=273&filter%5Bcity_ids%5D%5B%5D=378&filter%5Bcity_ids%5D%5B%5D=6342&filter%5Bstatuses%5D%5B%5D=Te+koop&filter%5Btypes%5D%5B%5D=Huis&filter%5Bprice%5D%5Bmin%5D=${MIN_PRICE}&filter%5Bprice%5D%5Bmax%5D=${MAX_PRICE}&filter%5Bbedrooms%5D%5Bmin%5D=&filter%5Bbedrooms%5D%5Bmax%5D=&filter%5Bsurface_built%5D%5Bmin%5D=&filter%5Bsurface_built%5D%5Bmax%5D=&filter%5Bsurface_plot%5D%5Bmin%5D=&filter%5Bsurface_plot%5D%5Bmax%5D=&filter%5Bsurface_livable%5D%5Bmin%5D=&filter%5Bsurface_livable%5D%5Bmax%5D=&filter%5Bsurface_trading%5D%5Bmin%5D=&filter%5Bsurface_trading%5D%5Bmax%5D=&filter%5Bterrace%5D=&filter%5Bsea_view%5D=&filter%5Belevator%5D=&filter%5Bgarden%5D=&filter%5Bgarage%5D=&filter%5Bparking_spots%5D%5Bmin%5D=&filter%5Bparking_spots%5D%5Bmax%5D=&filter%5Bloading_docks%5D%5Bmin%5D=&filter%5Bloading_docks%5D%5Bmax%5D=`;

test(title, async ({ page }) => {
  const newImmo = await scrape({
    page,
    url,
    title,
    selectList: p => p.locator('[class^="property-"]'),
    elementHandler: async e => e.evaluate(element => ({
      id: element.querySelector('a')?.href,
      link: element.querySelector('a')?.href,
      title: element.querySelector('h3')?.innerText,
      price: element.querySelector('.property-price')?.innerText,
      info: element.querySelector('h3 + div span')?.innerText,
      image_url: element.querySelector('img')?.src,
    })),
  });

  expect(newImmo?.length).toBe(0);
});
