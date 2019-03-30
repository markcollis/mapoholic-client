import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import clubReducer from './club';

export default combineReducers({
  auth: authReducer,
  club: clubReducer,
  user: userReducer,
});
