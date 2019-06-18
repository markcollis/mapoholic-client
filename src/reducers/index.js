import { combineReducers } from 'redux';
import activityReducer from './activity';
import authReducer from './auth';
import clubReducer from './club';
import configReducer from './config';
import eventReducer from './event';
import userReducer from './user';

export default combineReducers({
  activity: activityReducer,
  auth: authReducer,
  club: clubReducer,
  config: configReducer,
  oevent: eventReducer, // avoid event, restricted keyword
  user: userReducer,
});
