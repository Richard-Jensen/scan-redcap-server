import { createStore, applyMiddleware, compose } from 'redux';
import { loggerMiddleware } from './middlewares';
import rootReducer from '../reducers';

export default persistedState => {
  const enhancer = compose(
    applyMiddleware(loggerMiddleware),
    window.devToolsExtension()
  );

  return createStore(rootReducer, persistedState, enhancer);
};
