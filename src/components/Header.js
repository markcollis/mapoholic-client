import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUserAction } from '../actions';

const Header = ({
  location,
  auth,
  currentUser,
  getCurrentUser,
}) => {
  if (auth && !currentUser) { // check here because Header is always rendered
    console.log('No current user found in state!');
    getCurrentUser();
  }
  const userDetails = (currentUser)
    ? `logged in as: ${currentUser.displayName}`
    : '...';
  const isHome = (location.pathname === '/');
  const isSignup = (location.pathname === '/signup');
  const isLogin = (location.pathname === '/login');
  const isMyMaps = (location.pathname === '/mymaps');
  const isMyMapsMap = (location.pathname === '/mymapsmap');
  const isFeature = (location.pathname === '/feature');
  const isMyMapsGroup = isMyMaps || isMyMapsMap || isFeature;
  const isEvents = (location.pathname === '/events');
  const isEventsMap = (location.pathname === '/eventsmap');
  const isEventsGroup = isEvents || isEventsMap;
  const isUsers = (location.pathname === '/users');
  const isClubs = (location.pathname === '/clubs');
  const isCurrentUser = (location.pathname === '/me');
  const isEditProfile = (location.pathname === '/editprofile');
  const isChangePassword = (location.pathname === '/pwchange');
  const isCurrentUserGroup = isCurrentUser || isEditProfile || isChangePassword;

  const myMapsSubMenu = (isMyMapsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/mymaps" className={(isMyMaps) ? 'active item' : 'item'}>List view</Link>
        <Link to="/mymapsmap" className={(isMyMapsMap) ? 'active item' : 'item'}>Map view</Link>
        <Link to="/feature" className={(isFeature) ? 'active item' : 'item'}>Feature (Leaflet API test)</Link>
      </div>
    )
    : null;

  const eventsSubMenu = (isEventsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/events" className={(isEvents) ? 'active item' : 'item'}>List view</Link>
        <Link to="/eventsmap" className={(isEventsMap) ? 'active item' : 'item'}>Map view</Link>
      </div>
    )
    : null;

  const currentUserSubMenu = (isCurrentUserGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/me" className={(isCurrentUser) ? 'active item' : 'item'}>View Profile</Link>
        <Link to="/editprofile" className={(isEditProfile) ? 'active item' : 'item'}>Edit Profile</Link>
        <Link to="/pwchange" className={(isChangePassword) ? 'active item' : 'item'}>Change Password</Link>
      </div>
    )
    : null;

  if (auth) {
    return (
      <div>
        <div className="ui menu secondary pointing">
          <Link to="/" className={(isHome) ? 'active item' : 'item'}><i className="icon home" /></Link>
          <Link to="/mymaps" className={(isMyMapsGroup) ? 'active blue item' : 'item'}>My Maps</Link>
          <Link to="/events" className={(isEventsGroup) ? 'active blue item' : 'item'}>Events</Link>
          <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>Users</Link>
          <Link to="/clubs" className={(isClubs) ? 'active blue item' : 'item'}>Clubs</Link>
          <div className="right menu">
            <Link to="/me" className="item">{userDetails}</Link>
            <Link to="/logout" className="item right ">Log Out</Link>
          </div>
        </div>
        {myMapsSubMenu}
        {eventsSubMenu}
        {currentUserSubMenu}
      </div>
    );
  }
  return (
    <div className="ui menu secondary pointing">
      <Link to="/" className={(isHome) ? 'active blue item' : 'item'}><i className="icon home" /></Link>
      <Link to="/signup" className={(isSignup) ? 'active blue item' : 'item'}>Sign Up</Link>
      <Link to="/login" className={(isLogin) ? 'active blue item' : 'item'}>Log In</Link>
      <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>User List</Link>
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  getCurrentUser: PropTypes.func.isRequired,
};
Header.defaultProps = {
  auth: '',
  currentUser: null,
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, currentUser: user.current };
};

export default connect(mapStateToProps, { getCurrentUser: getCurrentUserAction })(Header);
