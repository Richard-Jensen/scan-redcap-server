import { createStore, applyMiddleware, compose } from 'redux';
import { loggerMiddleware } from './middlewares';
import rootReducer from '../reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

export default persistedState => {
  const enhancer = composeEnhancers(applyMiddleware(loggerMiddleware));

  return createStore(rootReducer, persistedState, enhancer);
};
