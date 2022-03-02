import isNewImmo from './isNewImmo.js';

export default async ({ page, url, title, selectList, elementHandler }) => {
  await page.goto(url);
  const elementHandles = await selectList(page).elementHandles();
  const content = await elementHandles.reduce(async (resolvePrevious, elementHandle) => {
    const data = await resolvePrevious;
    await elementHandle.scrollIntoViewIfNeeded();
    await new Promise(res => setTimeout(res, 250));
    data.push(await elementHandler(elementHandle));
    return data;
  }, Promise.resolve([]));
  const newImmo = await isNewImmo(title, content);
  return newImmo;
};