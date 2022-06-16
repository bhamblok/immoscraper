import isNewImmo from './isNewImmo.js';

export default async ({ page, url, title, selectList, elementHandler }) => {
  try {
    await page.goto(url);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const elementHandles = await selectList(page).elementHandles();
    const content = await elementHandles.reduce(async (resolvePrevious, elementHandle) => {
      const data = await resolvePrevious;
      await elementHandle.scrollIntoViewIfNeeded();
      await new Promise(res => setTimeout(res, 150));
      data.push(await elementHandler(elementHandle));
      return data;
    }, Promise.resolve([]));
    const newImmo = await isNewImmo(title, content);
    // const l = content?.length || 0;
    // const p = l === 1 ? 'pand' : 'panden';
    // const n = newImmo?.length === 1 ? 'nieuw' : 'nieuwe';
    // const message = `${l} ${p} gevonden, waarvan ${newImmo?.length} ${n}, voor ${title}`;
    // console.log(message); // eslint-disable-line no-console
    return newImmo;
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    return [];
  }
};
