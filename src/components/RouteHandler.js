import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Welcome from './Welcome';
import Authenticate from './auth/Authenticate';
import Logout from './auth/Logout';
// import MyMapsViewList from './event/MyMapsViewList';
// import MyMapsViewMap from './event/MyMapsViewMap';
import EventView from './event/EventView';
import MapView from './event/MapView';
import UserView from './user/UserView';
import ClubView from './club/ClubView';
import MyProfile from './user/MyProfile';

// This component limits access to certain components for users who are not logged in
const RouteHandler = ({ user }) => {
  const { current } = user;
  if (current) {
    return (
      <div>
        <Route path="/" component={Header} />
        <Switch>
          <Route path="/" exact component={Welcome} />
          <Route path="/signup" component={Authenticate} />
          <Route path="/login" component={Authenticate} />
          <Route path="/logout" component={Logout} />
          <Route path="/events" component={EventView} />
          <Route path="/eventsmap" render={props => <EventView {...props} showMap />} />
          <Route path="/mymaps" render={props => <EventView {...props} mineOnly />} />
          <Route path="/mymapsmap" render={props => <EventView {...props} showMap mineOnly />} />
          <Route path="/mapview" component={MapView} />
          <Route path="/users" component={UserView} />
          <Route path="/clubs" component={ClubView} />
          <Route path="/me" component={MyProfile} />
          <Route path="/editprofile" component={MyProfile} />
          <Route path="/profile/:userid" component={MyProfile} />
          <Route component={Welcome} />
        </Switch>
        <Route path="/" component={Footer} />
      </div>
    );
  }
  return (
    <div>
      <Route path="/" component={Header} />
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/signup" component={Authenticate} />
        <Route path="/login" component={Authenticate} />
        <Route path="/events" component={EventView} />
        <Route path="/eventsmap" render={props => <EventView {...props} showMap />} />
        <Route path="/mapview" component={MapView} />
        <Route component={Welcome} />
      </Switch>
      <Route path="/" component={Footer} />
    </div>
  );
};

RouteHandler.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps)(RouteHandler);
