import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
// import { I18nProvider } from '@lingui/react';
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
import MyMapsViewList from './components/event/MyMapsViewList';
import MyMapsViewMap from './components/event/MyMapsViewMap';
import EventViewList from './components/event/EventViewList';
import EventViewMap from './components/event/EventViewMap';
import MapView from './components/event/MapView';
import UserView from './components/user/UserView';
import ClubView from './components/club/ClubView';
import MyProfile from './components/user/MyProfile';
// import catalogCs from './locales/cs/messages';
// import catalogEn from './locales/en/messages';

// import Formik from './components/auth/FormikExample';

// const catalogs = { cs: catalogCs, en: catalogEn };
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
        <Route path="/mymaps" component={MyMapsViewList} />
        <Route path="/mymapsmap" component={MyMapsViewMap} />
        <Route path="/events" component={EventViewList} />
        <Route path="/eventsmap" component={EventViewMap} />
        <Route path="/mapview" component={MapView} />
        <Route path="/users" component={UserView} />
        <Route path="/clubs" component={ClubView} />
        <Route path="/me" component={MyProfile} />
        <Route path="/editprofile" component={MyProfile} />
        <Route path="/profile/:userid" component={MyProfile} />
        <Route path="/feature" component={Feature} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);
