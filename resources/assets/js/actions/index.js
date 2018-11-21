export const setActiveItem = ({ key }) => ({
  type: 'SET_ACTIVE_ITEM',
  payload: {
    key
  }
});

export const setResponse = ({ key, value, sliderValue, dropdownValue, period,  }) => ({
  type: 'SET_RESPONSE',
  payload: {
    key,
    value,
    sliderValue,
    dropdownValue,
    period,
  }
});

export const setNote = ({ key, value }) => ({
  type: 'SET_NOTE',
  payload: {
    key,
    value
  }
});

export const flipSetting = ({ setting }) => ({
  type: 'FLIP_SETTING',
  payload: {
    setting
  }
});

export const resetInterview = () => ({type: 'RESET_INTERVIEW'});
