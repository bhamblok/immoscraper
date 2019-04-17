import fetchCurl from '../helpers/fetchCurl.js';
import getContent from '../helpers/getContent.js';

export default async (site) => {
  try {
    const dom = await fetchCurl(site);
    const data = dom.window.document.querySelectorAll('.search-results-list-2 article');
    if (data) {
      return [...data].map((child) => {
        const link = (child.querySelector('a') || {}).href;
        const id = link;
        const title = getContent(child, '.search-result-title');
        const address = getContent(child, '.search-result-info:nth-child(1)');
        const info1 = getContent(child, '.search-result-info:nth-child(2)');
        const info2 = getContent(child, '.search-result-info:nth-child(3)');
        const info3 = getContent(child, '.search-result-info:nth-child(4)');
        const msg = {
          text: 'Nieuw pand op Immoscoop',
          attachment: {
            title: `${title}${address}`,
            title_link: link,
            text: `${info1}${info2}${info3}`,
          },
        };
        const image = child.querySelector('a').getAttribute('style');
        if (image && image.indexOf('http') !== -1) {
          Object.assign(msg.attachment, { image_url: image.slice(image.indexOf('(') + 1, image.lastIndexOf(')')) });
        }
        return { id, msg };
      }).filter(Boolean);
    }
    return (new Error(`NO DATA from ${site.name}`));
  } catch (error) {
    return error;
  }
};
