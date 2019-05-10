import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import 'focus-visible';

import reducers from './reducers';
import RouteHandler from './components/RouteHandler';
import App from './components/App';

const store = createStore(
  reducers,
  {},
  applyMiddleware(reduxThunk),
);

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
