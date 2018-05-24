import { scanData } from '../data';
import { getNextItemByKey, items } from '../items';
import routing from '../items/3.0/section.2.routing.json';
import Main from '../data/Main';

let initialState = {
  id: window.scanInfo.record_id,
  activeKey: items[0],
  responses: {},
  disabledItems: [],
  notes: {}
};

if (scanData.data) {
  initialState = scanData.data;
}

const nextItemIsDisabled = (state, key) => state.disabledItems.includes(key);

const getNextValidKey = (state, key) => {
  const nextItem = getNextItemByKey(key);

  if (nextItemIsDisabled(state, key)) {
    return getNextValidKey(state, nextItem.key);
  } else {
    return key;
  }
};

const interview = (state = initialState, action) => {
  const { responses } = state;

  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      const { key } = action.payload;

      const nextValidKey = getNextValidKey(state, key);

      return {
        ...state,
        activeKey: nextValidKey
      };
    case 'SET_RESPONSE':
      const mergedResponses = {
        ...responses,
        [action.payload.key]: action.payload.value
      };

      const { matched } = Main.runAlgorithms(mergedResponses, routing);
      let disabledItems = [];
      Object.keys(matched).forEach(key => {
        const algorithm = matched[key];
        if (algorithm.skip_items) {
          disabledItems = [disabledItems, ...algorithm.skip_items];
        }
      });

      const matchedKeys = Object.keys(matched);

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
