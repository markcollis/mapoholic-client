import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import clubReducer from './club';
import eventReducer from './event';
import configReducer from './config';

export default combineReducers({
  auth: authReducer,
  club: clubReducer,
  config: configReducer,
  oevent: eventReducer, // avoid event, restricted keyword
  user: userReducer,
});
