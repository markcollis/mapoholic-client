import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import 'focus-visible';

import reducers from './reducers';
import App from './components/App';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Authenticate from './components/auth/Authenticate';
import Logout from './components/auth/Logout';
import ChangePassword from './components/auth/ChangePassword';
import Feature from './components/Feature'; // to remove later
// import TestMap from './components/TestMap';
import MyMaps from './components/event/MyMaps';
import EventView from './components/event/EventView';
import EventViewMap from './components/event/EventViewMap';
import UserView from './components/user/UserView';
import ClubView from './components/club/ClubView';
import MyProfile from './components/user/MyProfile';

// import Formik from './components/auth/FormikExample';

const store = createStore(
  reducers,
  {},
  applyMiddleware(reduxThunk),
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" component={Header} />
        <Route path="/" exact component={Welcome} />
        <Route path="/signup" component={Authenticate} />
        <Route path="/login" component={Authenticate} />
        <Route path="/logout" component={Logout} />
        <Route path="/pwchange" component={ChangePassword} />
        <Route path="/events" component={EventView} />
        <Route path="/eventsmap" component={EventViewMap} />
        <Route path="/users" component={UserView} />
        <Route path="/clubs" component={ClubView} />
        <Route path="/me" component={MyProfile} />
        <Route path="/editprofile" component={MyProfile} />
        <Route path="/mymaps" component={MyMaps} />
        <Route path="/mymapsmap" component={MyMaps} />
        <Route path="/profile/:userid" component={MyProfile} />
        <Route path="/feature" component={Feature} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);
