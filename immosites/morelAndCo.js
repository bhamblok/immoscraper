import fetch from 'node-fetch';
import jsdom from 'jsdom';
import getContent from '../helpers/getContent.js';

const { JSDOM } = jsdom;
const formatPrice = price => price && `€${price} `;

export default async (site) => {
  console.log(`> fetching ${site.name} ...`);
  try {
    const dom = new JSDOM(await fetch(site.url).then(res => res.text()));
    const data = dom.window.document.querySelectorAll('.offers-item');
    if (data) {
      return [...data].map((child) => {
        const link = `https://www.immo-morelandco.com${(child.querySelector('a') || {}).href}`;
        const id = link;
        const title = getContent(child, '.offers-item--right-category');
        if ((/verkocht/ig).test(title)) {
          return null;
        }
        const address = `${getContent(child, '.offers-item--right-address-1')}${getContent(child, '.offers-item--right-address-2')}`;
        const price = parseInt(getContent(child, '.offers-item--right-price').replace(/€|\./ig, '') || 0, 10);
        if (price > site.maxPrice) {
          return null;
        }
        const text = getContent(child, '.offers-item--right-text');
        const image = child.querySelector('img');
        let image_url = '';
        if (image) {
          image_url = `https://www.immo-morelandco.com${image.getAttribute('src')}`;
        }
        const msg = {
          text: 'Nieuw pand op Morel&Co',
          attachment: {
            title: `${title}${address}`,
            title_link: link,
            text: `${formatPrice(price)}${text}`,
            image_url,
          },
        };
        return { id, msg };
      }).filter(Boolean);
    }
    return (new Error(`NO DATA from ${site.name}`));
  } catch (error) {
    return error;
  }
};
