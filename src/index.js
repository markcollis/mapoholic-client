import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import 'focus-visible';

import reducers from './reducers';
import RouteHandler from './components/RouteHandler';
import App from './components/App';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(reduxThunk)),
);
/* eslint-enable */

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <RouteHandler />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);
