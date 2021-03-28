import React, { FunctionComponent } from 'react';
// import { connect, ConnectedProps } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import { AuthState } from '../types/auth';

import Header from './Header';
import Footer from './Footer';
import HomeView from './home/HomeView';
import Authenticate from './auth/Authenticate';
import Logout from './auth/Logout';
import EventView from './event/EventView';
import MapView from './event/MapView';
import UserView from './user/UserView';
import ClubView from './club/ClubView';

// const mapStateToProps = (state: AuthState) => ({ auth: state.authenticated });
// const connector = connect(mapStateToProps);
// type Props = ConnectedProps<typeof connector>;

// The RouteHandler component renders the appropriate view for a given path
// (access to some of them depends on whether the the user is logged in)
const RouteHandler: FunctionComponent = () => (
  <BrowserRouter>
    <Route path="/" component={Header} />
    <Switch>
      <Route path="/signup"><Authenticate isSignUp /></Route>
      <Route path="/login"><Authenticate /></Route>
      <Route path="/logout"><Logout /></Route>
      <Route path="/events"><EventView /></Route>
      <Route path="/eventsmap"><EventView showMap /></Route>
      <Route path="/mymaps"><EventView mineOnly /></Route>
      <Route path="/mymapsmap"><EventView showMap mineOnly /></Route>
      <Route path="/mapview"><MapView /></Route>
      <Route path="/users"><UserView /></Route>
      <Route path="/clubs"><ClubView /></Route>
      <Route path="/me"><UserView ownProfile /></Route>
      <Route><HomeView /></Route>
    </Switch>
    <Footer />
  </BrowserRouter>
);

export default RouteHandler;
// export default connector(RouteHandler);
