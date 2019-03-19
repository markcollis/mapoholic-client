import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import App from './components/App';
import Header from './components/Header';
import Welcome from './components/Welcome';
// import Signup from './components/auth/Signup';
import Authenticate from './components/auth/Authenticate';
import Logout from './components/auth/Logout';
import Feature from './components/Feature';
import TestMap from './components/TestMap';
import UserProfile from './components/user/UserProfile';
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
        <Route path="/profile/:userid?" component={UserProfile} />
        <Route path="/feature" component={Feature} />
        <Route path="/testmap" component={TestMap} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);
