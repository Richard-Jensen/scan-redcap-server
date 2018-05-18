import { scanData } from '../data';
import { items } from '../items';

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
