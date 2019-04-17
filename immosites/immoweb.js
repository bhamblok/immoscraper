import fetchCurl from '../helpers/fetchCurl.js';
import getContent from '../helpers/getContent.js';

const formatPrice = price => price && `€${price} `;

export default async (site) => {
  try {
    const dom = await fetchCurl(site, Math.round(Math.random() * 5000) + 5000);
    const data = dom.window.document.querySelector('#result');
    if (data) {
      return [...data.children].map((child) => {
        const { id } = child;
        if (id) {
          const link = (child.querySelector('a') || {}).href;
          const title = getContent(child, '.title-bar-left');
          const address = getContent(child, '.title-bar-right');
          const price = parseInt(getContent(child, '.m-price, .l-price, .xl-price').replace(/\./ig, ''), 10);
          if (price > site.maxPrice) {
            return null;
          }
          const info1 = getContent(child, '.m-surface-ch, .l-surface-ch, .xl-surface-ch');
          const info2 = getContent(child, '.m-desc, .l-desc, .xl-desc');
          const msg = {
            text: 'Nieuw pand op Immoweb',
            attachment: {
              title: `${title}${address}`,
              title_link: link,
              text: `${info1}${info2}${formatPrice(price)}`,
            },
          };
          const image = child.querySelector('.photo-bien').getAttribute('style');
          if (image && image.indexOf('http') !== -1) {
            Object.assign(msg.attachment, { image_url: image.slice(image.indexOf("'") + 1, image.lastIndexOf("'")) });
          }
          return { id, msg };
        }
        return null;
      }).filter(Boolean);
    }
    return (new Error(`NO DATA from ${site.name}`));
  } catch (error) {
    return error;
  }
};
