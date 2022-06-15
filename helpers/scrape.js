import isNewImmo from './isNewImmo.js';
import notifyMe from './notifyMe.js';

export default async ({ page, url, title, selectList, elementHandler }) => {
  try {
    await page.goto(url);
    const elementHandles = await selectList(page).elementHandles();
    const content = await elementHandles.reduce(async (resolvePrevious, elementHandle) => {
      const data = await resolvePrevious;
      await elementHandle.scrollIntoViewIfNeeded();
      await new Promise(res => setTimeout(res, 150));
      data.push(await elementHandler(elementHandle));
      return data;
    }, Promise.resolve([]));
    const newImmo = await isNewImmo(title, content);
    return newImmo;
  } catch (e) {
    console.log(e);
    notifyMe({ text: e.message });
  }
};
