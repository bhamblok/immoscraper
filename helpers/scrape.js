import isNewImmo from './isNewImmo.js';

export default async ({ page, url, getTitle, selectList, elementHandler }) => {
  await page.goto(url);
  const [title, elementHandles] = await Promise.all([
    getTitle(page),
    selectList(page).elementHandles(),
  ]);
  console.log(`Testing: ${title}...`);
  const content = await elementHandles.reduce(async (resolvePrevious, elementHandle) => {
    const data = await resolvePrevious;
    await elementHandle.scrollIntoViewIfNeeded();
    await new Promise(res => setTimeout(res, 250));
    data.push(await elementHandler(elementHandle));
    return data;
  }, Promise.resolve([]));

  const newImmo = await isNewImmo(title, content);

  if (newImmo.length) {
    console.log(newImmo.map(immo => immo.link));
  }

  return newImmo;
};
