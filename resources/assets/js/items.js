import { items as da } from './items/2.1/scan.2.1.items.da.json';
import { items as en } from './items/2.1/scan.2.1.items.en.json';

const items = en;

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
