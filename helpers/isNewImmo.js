import fs from 'fs';
import notifyMe from './notifyMe.js';

const data = JSON.parse(fs.readFileSync('./data/immoscraper.json', 'utf8'));

export default async (title, content) => {
  const newImmo = content.filter((immo) => {
    if (!immo.link) {
      return false;
    }
    if (data.includes(immo.link)) {
      return false;
    }
    data.push(immo.link);
    fs.writeFileSync('./data/immoscraper.json', JSON.stringify(data, null, 2), 'utf8');
    return true;
  });
  await newImmo.reduce(async (prev, immo) => {
    await prev;
    return new Promise((resolve) => {
      setTimeout(() => {
        notifyMe({
          text: title,
          attachment: {
            title: immo.title,
            title_link: immo.link,
            text: `${immo.info} ${immo.price}`,
            image_url: immo.image_url,
          },
        });
        resolve();
      }, 250);
    });
  }, Promise.resolve());

  return newImmo;
};
