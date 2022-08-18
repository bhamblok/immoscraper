import fs from 'fs';
import notifyMe from './notifyMe.js';


export default async (title, content) => {
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(`./data/immoscraper-${title}.json`, 'utf8') || '[]');
  } catch (err) {
    /* silently ignore err */
  }
  const newImmo = content.filter((immo) => {
    if (!immo.link) {
      return false;
    }
    if (data.includes(immo.link)) {
      return false;
    }
    data.push(immo.link);
    try {
      fs.writeFileSync(`./data/immoscraper-${title}.json`, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      /* silently ignore err */
    }
    return true;
  });
  await newImmo.reduce(async (prev, immo) => {
    await prev;
    return notifyMe({ title, immo });
  }, Promise.resolve());

  return newImmo;
};
