import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUserAction } from '../actions';
import noAvatar from '../no-avatar.png';
import { OMAPFOLDER_SERVER } from '../config';

const Header = ({
  location,
  auth,
  currentUser,
  getCurrentUser,
  currentMap,
}) => {
  if (auth && !currentUser) { // check here because Header is always rendered
    // console.log('No current user found in state, get details corresponding to auth token.');
    setTimeout(() => getCurrentUser(), 1000); // simulate network delay
    // getCurrentUser();
  }

  const userDetails = (currentUser)
    ? (
      <div>
        <img
          className="ui avatar image"
          alt="avatar"
          src={(currentUser && currentUser.profileImage) ? `${OMAPFOLDER_SERVER}/${currentUser.profileImage}` : noAvatar}
        />
        {`  ${currentUser.displayName}`}
      </div>
    )
    : '...';
  // const userDetails = (currentUser)
  //   ? `${avatar} logged in as: ${currentUser.displayName}`
  //   : '...';
  const isHome = (location.pathname === '/');
  const isSignup = (location.pathname === '/signup');
  const isLogin = (location.pathname === '/login');
  const isMyMapsList = (location.pathname === '/mymaps');
  const isMyMapsMap = (location.pathname === '/mymapsmap');
  const isFeature = (location.pathname === '/feature');
  const isMyMapsGroup = isMyMapsList || isMyMapsMap || isFeature;
  const isEventsList = (location.pathname === '/events');
  const isEventsMap = (location.pathname === '/eventsmap');
  const isEventsGroup = isEventsList || isEventsMap;
  const isMaps = (location.pathname === '/maps');
  const isUsers = (location.pathname === '/users');
  const isClubs = (location.pathname === '/clubs');
  const isCurrentUser = (location.pathname === '/me');

  const myMapsSubMenu = (isMyMapsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/mymaps" className={(isMyMapsList) ? 'active item' : 'item'}>List view</Link>
        <Link to="/mymapsmap" className={(isMyMapsMap) ? 'active item' : 'item'}>Map view</Link>
        <Link to="/feature" className={(isFeature) ? 'active item' : 'item'}>Feature (Leaflet API test)</Link>
      </div>
    )
    : null;

  const eventsSubMenu = (isEventsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/events" className={(isEventsList) ? 'active item' : 'item'}>List view</Link>
        <Link to="/eventsmap" className={(isEventsMap) ? 'active item' : 'item'}>Map view</Link>
      </div>
    )
    : null;

  if (auth) {
    return (
      <div>
        <div className="ui menu secondary pointing">
          <Link to="/" className={(isHome) ? 'active item' : 'item'}><i className="icon home" /></Link>
          <Link to="/mapview" className={(isMaps) ? 'active blue item' : 'item'}>Map View</Link>
          <Link to="/mymaps" className={(isMyMapsGroup) ? 'active blue item' : 'item'}>My Maps</Link>
          <Link to="/events" className={(isEventsGroup) ? 'active blue item' : 'item'}>Events</Link>
          <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>Users</Link>
          <Link to="/clubs" className={(isClubs) ? 'active blue item' : 'item'}>Clubs</Link>
          <div className="right menu">
            <Link to="/me" className={(isCurrentUser) ? 'active blue item header-current-user' : 'item header-current-user'}>{userDetails}</Link>
            <Link to="/logout" className="item right ">Log Out</Link>
          </div>
        </div>
        {myMapsSubMenu}
        {eventsSubMenu}
      </div>
    );
  }
  return (
    <div>
      <div className="ui menu secondary pointing">
        <Link to="/" className={(isHome) ? 'active blue item' : 'item'}><i className="icon home" /></Link>
        <Link to="/events" className={(isEventsGroup) ? 'active blue item' : 'item'}>Browse Public Maps</Link>
        <div className="right menu">
          <Link to="/signup" className={(isSignup) ? 'active blue item' : 'item'}>Sign Up</Link>
          <Link to="/login" className={(isLogin) ? 'active blue item' : 'item'}>Log In</Link>
        </div>
      </div>
      {eventsSubMenu}
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  getCurrentUser: PropTypes.func.isRequired,
  currentMap: PropTypes.string,
};
Header.defaultProps = {
  auth: '',
  currentUser: null,
  currentMap: '',
};

const mapStateToProps = ({ auth, user, oevent }) => {
  return { auth: auth.authenticated, currentUser: user.current, currentMap: oevent.selectedMap };
};

export default connect(mapStateToProps, { getCurrentUser: getCurrentUserAction })(Header);
