import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import clubReducer from './club';
import eventReducer from './event';

export default combineReducers({
  auth: authReducer,
  club: clubReducer,
  oevent: eventReducer, // avoid event, restricted keyword
  user: userReducer,
});
