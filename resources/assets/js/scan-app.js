import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Scan from './components/Scan';
import configureStore from './store/configureStore';
import throttle from 'lodash/throttle';
import { saveInterview } from './data';

const store = configureStore();

store.subscribe(
  throttle(() => {
    const state = store.getState();
    localStorage.setItem(state.interview.id, JSON.stringify(state.interview));
    saveInterview(state.interview.id, state.interview);
  }, 1000)
);

ReactDOM.render(
  <Provider store={store}>
    <Scan />
  </Provider>,
  document.getElementById('scan-app')
);

