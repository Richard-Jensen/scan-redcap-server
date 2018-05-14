import { scanData } from '../data';

let initialState = {
  id: window.scanInfo.record_id,
  activeKey: '1.001',
  responses: {}
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
    default:
      return state;
  }
};

export default interview;
