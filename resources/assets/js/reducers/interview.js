import { scanData } from '../data';
import { getNextItemByKey, getPreviousItemByKey, items } from '../items';
import routing from '../items/3.0/section.2.routing.json';
import Algorithms from '../data/Algorithms';

let initialState = {
  id: window.scanInfo && window.scanInfo.record_id,
  activeKey: items[0].key,
  responses: {},
  sliderValues: {},
  dropdownValues: {},
  invalidResponseItems: [],
  disabledItems: [],
  notes: {},
  settings: {
    showGlossary: true
  }
};

if (scanData.data) {
  initialState = scanData.data;
}

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
  switch (action.type) {
    case 'RESET_INTERVIEW':
    return ({
      id: window.scanInfo && window.scanInfo.record_id,
      activeKey: items[0].key,
      responses: {},
      sliderValues: {},
      dropdownValues: {},
      invalidResponseItems: [],
      disabledItems: [],
      notes: {},
      settings: {
        showGlossary: true
      }
    })

    case 'SET_ACTIVE_ITEM':
    const { key } = action.payload;

    return {
      ...state,
      activeKey: key
    };
    case 'SET_RESPONSE':
    let mergedResponses = responses;
    let sliderValues = state.sliderValues;
    let dropdownValues = state.dropdownValues;
    let invalidResponseItems = state.invalidResponseItems;

    if (action.payload.period && action.payload.value) {
      let period = action.payload.period === 1 ? 'period_one' : 'period_two';

      mergedResponses = {
        ...responses,
        [action.payload.key]: {
          ...responses[action.payload.key],
          [period]: action.payload.value
        }
      };
    }
    else if (action.payload.key && (action.payload.value || action.payload.value === '')) {
      mergedResponses = {
        ...responses,
        [action.payload.key]: action.payload.value
      };
    }
    else {
      mergedResponses = responses;
    }

    if (action.payload.sliderValue && action.payload.key) {
      sliderValues = {
        ...sliderValues,
        [action.payload.key]: action.payload.sliderValue
      };
    }
    if (action.payload.dropdownValue && action.payload.key) {
      dropdownValues = {
        ...dropdownValues,
        [action.payload.key]: action.payload.dropdownValue
      };
    }

    if (action.payload.invalidResponse && action.payload.key) {
      if (!invalidResponseItems.includes(action.payload.key)) {
        invalidResponseItems = [...invalidResponseItems, action.payload.key];
        invalidResponseItems.sort();
      }
    }
    else if (action.payload.key) {
      const index = invalidResponseItems.indexOf(action.payload.key);
      if (index !== -1) {
        invalidResponseItems.splice(index, 1);
      }
    }

    const { matched } = Algorithms.run(mergedResponses, routing);
    let disabledItems = [];
    Object.keys(matched).forEach(key => {
      const algorithm = matched[key];
      if (algorithm.skip_items) {
        disabledItems = [disabledItems, ...algorithm.skip_items];
      }
    });
    // For debugging only
    console.log('Slider values:')
    console.log(sliderValues)
    console.log('Dropdown values:')
    console.log(dropdownValues)
    console.log('Invalid response items')
    console.log(invalidResponseItems)

    const matchedKeys = Object.keys(matched);

    return {
      ...state,
      disabledItems: [...matchedKeys, ...disabledItems],
      responses: mergedResponses,
      sliderValues: sliderValues,
      dropdownValues: dropdownValues,
      invalidResponseItems: invalidResponseItems,
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
