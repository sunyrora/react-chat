import { combineReducers } from 'redux';
import authState from './authReducer';

const AppReducer = combineReducers({
  authState,
});

export default AppReducer;