import { scanData } from '../data';
import { getNextItemByKey, getPreviousItemByKey, items } from '../items';
import routing from '../items/3.0/section.2.routing.json';
import Algorithms from '../data/Algorithms';

let initialState = {
  id: window.scanInfo && window.scanInfo.record_id,
  activeKey: items[0].key,
  responses: {},
  sliderValues: {},
  disabledItems: [],
  notes: {},
  settings: {
    showGlossary: true
  }
};

console.log('initialState')
console.log(initialState)

if (scanData.data) {
  initialState = scanData.data;
}

console.log('initialState')
console.log(initialState)

export const nextItemIsDisabled = (state, key) => state.disabledItems.includes(getNextItemByKey(key).key);
export const previousItemIsDisabled = (state, key) => state.disabledItems.includes(getPreviousItemByKey(key).key);

export const getNextValidKey = (state, key) => {
  const nextItem = getNextItemByKey(key);

  if (nextItemIsDisabled(state, key)) {
   return getNextValidKey(state, nextItem.key);
 } else {
  return nextItem.key;
}
};

export const getPreviousValidKey = (state, key) => {
  const previousItem = getPreviousItemByKey(key);

  if (previousItemIsDisabled(state, key)) {
   return getPreviousValidKey(state, previousItem.key);
 } else {
  return previousItem.key;
}
};

const interview = (state = initialState, action) => {
  const { responses } = state;
  const sliderValues = state;
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
    const { key } = action.payload;

    return {
      ...state,
      activeKey: key
    };
    case 'SET_RESPONSE':
    let mergedResponses;
    let mergedSliderValues;
    if (false) {
      let period = action.payload.period === 1 ? 'period_one' : 'period_two';

      mergedResponses = {
        ...responses,
        [action.payload.key]: {
          ...responses[action.payload.key],
          [period]: action.payload.value
        }
      };
    } else {
      mergedResponses = {
        ...responses,
        [action.payload.key]: action.payload.value
      };

    }

    const { matched } = Algorithms.run(mergedResponses, routing);
    let disabledItems = [];
    Object.keys(matched).forEach(key => {
      const algorithm = matched[key];
      if (algorithm.skip_items) {
        disabledItems = [disabledItems, ...algorithm.skip_items];
      }
    });

    const matchedKeys = Object.keys(matched);
    console.log(responses);
    console.log(mergedResponses);
    return {
      ...state,
      disabledItems: [...matchedKeys, ...disabledItems],
      responses: mergedResponses
    };
    case 'SET_NOTE':
    return {
      ...state,
      notes: {
        ...state.notes,
        [action.payload.key]: action.payload.value
      }
    };
    default:
    return state;
  }
};

export default interview;
