import fs from 'fs';
import notifyMe from './notifyMe.js';


export default async (title, content) => {
  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(`./data/immoscraper-${title}.json`, 'utf8') || '[]');
  } catch (err) {
    console.log(err);
  }
  console.log(data.length);
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
      console.error('!!! ERROR WRITEFILESYNC');
      console.error(err);
    }
    return true;
  });
  await newImmo.reduce(async (prev, immo) => {
    await prev;
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('notify:', immo.link);
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
