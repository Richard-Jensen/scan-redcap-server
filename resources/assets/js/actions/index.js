export const setActiveItem = ({ key }) => ({
  type: 'SET_ACTIVE_ITEM',
  payload: {
    key
  }
});

export const setResponse = ({ key, value, period }) => ({
  type: 'SET_RESPONSE',
  payload: {
    key,
    value,
    period
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
