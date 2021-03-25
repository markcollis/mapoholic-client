import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import 'focus-visible';
import GitInfo from 'react-git-info/macro';

import reducers from './reducers';
import RouteHandler from './components/RouteHandler';
import App from './components/App';
import ErrorBoundary from './components/generic/ErrorBoundary';

const gitInfo = GitInfo();
/* eslint-disable no-console */
console.log('Git details\n-----------\ncommit hash:', gitInfo.commit.hash, '\ndate:', gitInfo.commit.date, '\nmessage:', gitInfo.commit.message, '\nbranch:', gitInfo.branch);

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
      <ErrorBoundary>
        <App>
          <RouteHandler />
        </App>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root'),
);
