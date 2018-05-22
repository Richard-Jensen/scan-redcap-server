import { scanData } from '../data';
import { getNextItemByKey, items } from '../items';
import routing from '../items/3.0/section.2.routing.json';
import Main from '../data/Main';

let initialState = {
  id: window.scanInfo.record_id,
  activeKey: items[0],
  responses: {},
  notes: {}
};

if (scanData.data) {
  initialState = scanData.data;
}

const interview = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      const { responses } = state;
      const { key } = action.payload;

      if (routing[key]) {
        const evaluator = Main.runAlgorithms(responses, routing);
        if (evaluator.evaluated[key]) {
          if (
            window.confirm(
              `Item ${
                action.payload.key
              } is disabled. Do you want to see it anyway?`
            )
          ) {
            return {
              ...state,
              activeKey: action.payload.key
            };
          } else {
            return {
              ...state,
              activeKey: getNextItemByKey(action.payload.key).key
            };
          }
        }
      }

      return {
        ...state,
        activeKey: action.payload.key
      };

    case 'SET_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.key]: action.payload.value
        }
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
