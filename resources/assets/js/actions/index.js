import axios from 'axios';

export const setActiveItem = key => ({
  type: 'SET_ACTIVE_ITEM',
  payload: {
    key
  }
});

export const setResponse = (key, value) => ({
  type: 'SET_RESPONSE',
  payload: {
    key,
    value
  }
});

export const setNote = (key, value) => ({
  type: 'SET_NOTE',
  payload: {
    key,
    value
  }
});
