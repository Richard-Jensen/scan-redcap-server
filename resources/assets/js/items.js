// import { items as da } from './items/2.1/scan.2.1.items.da.json';
// import { items as en } from './items/2.1/scan.2.1.items.en.json';
import { items as section_2 } from './items/3.0/section.2.en.json';
import scales from './items/3.0/ratingscales.en.json';

let items = section_2;

// make sure every item's key is a string
items = items.map(item => {
  if (typeof item.key !== 'string') {
    return { ...item, key: item.key.toString() };
  }
  return item;
});

export const getItemByKey = key => items.find(item => item.key === key);
export const getItemByIndex = index => items[index];

export const getNextItemByKey = key => {
  let index = items.indexOf(getItemByKey(key)) + 1;
  if (!items[index]) index = 0;
  return items[index];
};
export const getPreviousItemByKey = key => {
  let index = items.indexOf(getItemByKey(key)) - 1;
  if (!items[index]) index = items.length - 1;
  return items[index];
};

export { items };
export { scales };
