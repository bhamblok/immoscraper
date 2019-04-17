export default (parent, selectors) => {
  const child = selectors.split(',').map(selector => parent.querySelector(selector.trim())).find(Boolean);
  if (child) {
    child.innerHTML = child.innerHTML.replace('<br>', ' ').replace('<br />', ' ');
  }
  return (child
    && child.textContent
    && (`${child.textContent.trim().replace(/[\r\n\t]+|\s{2,}/ig, ' ')} `))
    || '';
};
