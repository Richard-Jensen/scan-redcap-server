import { createStore } from 'redux';
import rootReducer from '../reducers';

export default persistedState => {
  return createStore(rootReducer, persistedState);
};
