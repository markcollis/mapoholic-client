import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { AuthState } from '../types/auth';

import Header from './Header';
import Footer from './Footer';
import HomeView from './home/HomeView';
import Authenticate from './auth/Authenticate';
import Logout from './auth/Logout';
import EventView from './event/EventView';
import MapView from './event/MapView';
import UserView from './user/UserView';
import ClubView from './club/ClubView';

const mapStateToProps = (state: AuthState) => ({ auth: state.authenticated });
const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector>;

// The RouteHandler component renders the appropriate view for a given path
// (access to some of them depends on whether the the user is logged in)
const RouteHandler: FunctionComponent<Props> = ({ auth }: Props) => {
  if (auth) {
    return ( // available views for currently logged in users
      <div>
        <Route path="/" component={Header} />
        <Switch>
          <Route path="/" exact component={HomeView} />
          <Route path="/signup" component={Authenticate} />
          <Route path="/login" component={Authenticate} />
          <Route path="/logout" component={Logout} />
          <Route path="/events" component={EventView} />
          <Route path="/eventsmap" render={(props) => <EventView {...props} showMap />} />
          <Route path="/mymaps" render={(props) => <EventView {...props} mineOnly />} />
          <Route path="/mymapsmap" render={(props) => <EventView {...props} showMap mineOnly />} />
          <Route path="/mapview" component={MapView} />
          <Route path="/users" component={UserView} />
          <Route path="/clubs" component={ClubView} />
          <Route path="/me" render={(props) => <UserView {...props} ownProfile />} />
          <Route component={HomeView} />
        </Switch>
        <Route path="/" component={Footer} />
      </div>
    );
  }

  // include logout to provide an escape route in case of 'unclean' logout
  // that does not empty localStorage, leaving an invalid token
  return ( // available views if not currently logged in
    <div>
      <Route path="/" component={Header} />
      <Switch>
        <Route path="/" exact component={HomeView} />
        <Route path="/signup" component={Authenticate} />
        <Route path="/login" component={Authenticate} />
        <Route path="/logout" component={Logout} />
        <Route path="/events" component={EventView} />
        <Route path="/eventsmap" render={(props) => <EventView {...props} showMap />} />
        <Route path="/mapview" component={MapView} />
        <Route component={HomeView} />
      </Switch>
      <Route path="/" component={Footer} />
    </div>
  );
};

export default connector(RouteHandler);
