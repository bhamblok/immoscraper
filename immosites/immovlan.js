import jsdom from 'jsdom';

import fetchCurl from '../helpers/fetchCurl.js';
import getContent from '../helpers/getContent.js';

const { JSDOM } = jsdom;

export default async (site) => {
  try {
    const dom = await fetchCurl(site);
    const container = dom.window.document.querySelector('.container');
    const noscript = container.querySelector('noscript');
    if (noscript) {
      const noscriptDom = new JSDOM(noscript.innerHTML);
      return [...noscriptDom.window.document.querySelectorAll('.card')].map((child) => {
        const link = `https://immo.vlan.be${(child.querySelector('h2 a') || {}).href}`;
        const id = link;
        const title = getContent(child, 'h2 a');
        const address = getContent(child, '.property-item_address');
        const price = getContent(child, '.float-right');
        const image = child.querySelector('img');
        let alt = '';
        let image_url = '';
        if (image) {
          alt = image.getAttribute('alt');
          image_url = image.getAttribute('src');
        }
        const msg = {
          text: 'Nieuw pand op Immovlan',
          attachment: {
            title: `${title}${address}`,
            title_link: link,
            text: `${price}${alt}`,
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
