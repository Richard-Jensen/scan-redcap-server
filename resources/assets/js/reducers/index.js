import { combineReducers } from 'redux';
import interview from './interview';
import settings from './settings';

export default combineReducers({
  interview,
  settings
});
