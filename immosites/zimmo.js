import fetchCurl from '../helpers/fetchCurl.js';
import getContent from '../helpers/getContent.js';

export default async (site) => {
  try {
    const dom = await fetchCurl(site);
    const data = dom.window.document.querySelectorAll('.property-item');
    if (data) {
      return [...data].map((child) => {
        const link = `https://www.zimmo.be${(child.querySelector('a.property-item_link') || {}).href}`;
        const id = link;
        const title = getContent(child, '.property-item_title');
        const address = getContent(child, '.property-item_address');
        const price = getContent(child, '.property-item_price');
        const image = child.querySelector('.property-item-slider img');
        let alt = '';
        let image_url = '';
        if (image) {
          alt = image.getAttribute('alt');
          image_url = image.getAttribute('src');
        }
        const msg = {
          text: 'Nieuw pand op Zimmo',
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
