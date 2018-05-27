let initialState = {
  showGlossary: true
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case 'FLIP_SETTING':
      return {
        ...state,
        [action.payload.setting]: !state[action.payload.setting]
      };
    default:
      return state;
  }
};

export default settings;
