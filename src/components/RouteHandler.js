import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Welcome from './Welcome';
import Authenticate from './auth/Authenticate';
import Logout from './auth/Logout';
import ChangePassword from './auth/ChangePassword';
import Feature from './Feature'; // to remove later
import MyMapsViewList from './event/MyMapsViewList';
import MyMapsViewMap from './event/MyMapsViewMap';
import EventViewList from './event/EventViewList';
import EventViewMap from './event/EventViewMap';
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
        <Route path="/events" component={EventViewList} />
        <Route path="/eventsmap" component={EventViewMap} />
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
