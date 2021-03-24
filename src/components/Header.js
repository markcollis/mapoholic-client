import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import {
  getClubListAction,
  getCurrentUserAction,
  getEventListAction,
  getEventLinkListAction,
  getUserListAction,
  setLanguageAction,
} from '../actions';
import noAvatar from '../graphics/noAvatar.jpg';

// The Header component is always rendered at the top of every page
class Header extends Component {
  static propTypes = {
    auth: PropTypes.string,
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    getClubList: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    setLanguage: PropTypes.func.isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  static defaultProps = {
    auth: null,
  };

  state = {
    isGettingClubList: false,
    isGettingCurrentUser: false,
    isGettingEventList: false,
    isGettingEventLinkList: false,
    isGettingUserList: false,
    linkEvents: '/events',
    linkMyMaps: '/mymaps',
  }

  componentDidMount() {
    this.fetchDataIfRequired();
  }

  componentDidUpdate(prevProps) {
    this.fetchDataIfRequired();
    const { location: oldLocation } = prevProps;
    const { location: newLocation } = this.props;
    const newPath = newLocation.pathname;
    /* eslint react/no-did-update-set-state: 0 */
    if (oldLocation.pathname !== newPath) { // OK to use setState inside condition
      if (newPath === '/events' || newPath === '/eventsmap') {
        this.setState({ linkEvents: newPath });
      }
      if (newPath === '/mymaps' || newPath === '/mymapsmap') {
        this.setState({ linkMyMaps: newPath });
      }
    }
  }

  fetchDataIfRequired = () => {
    // fetch data to display if not already available
    const {
      isGettingClubList,
      isGettingCurrentUser,
      isGettingEventList,
      isGettingEventLinkList,
      isGettingUserList,
    } = this.state;
    const {
      auth,
      club,
      user,
      oevent,
      getClubList,
      getCurrentUser,
      getEventList,
      getEventLinkList,
      getUserList,
    } = this.props;
    const { list: clubList, errorMessage: clubErrorMessage } = club;
    const { current, list: userList, errorMessage: userErrorMessage } = user;
    const { list, linkList, errorMessage: eventErrorMessage } = oevent;
    if (auth && userErrorMessage === '' && !current && !isGettingCurrentUser) {
      // console.log('getting current user details');
      this.setState({ isGettingCurrentUser: true });
      getCurrentUser(() => this.setState({ isGettingCurrentUser: false }));
    }
    if (!clubList && clubErrorMessage === '' && !isGettingClubList) {
      // console.log('retrieving list of clubs');
      this.setState({ isGettingClubList: true });
      getClubList(null, () => this.setState({ isGettingClubList: false }));
    }
    if (!userList && userErrorMessage === '' && !isGettingUserList) {
      // console.log('retrieving list of users');
      this.setState({ isGettingUserList: true });
      getUserList(null, () => this.setState({ isGettingUserList: false }));
    }
    if (!list && eventErrorMessage === '' && !isGettingEventList) {
      // console.log('retrieving list of events');
      this.setState({ isGettingEventList: true });
      getEventList(null, () => this.setState({ isGettingEventList: false }));
    }
    if (!linkList && eventErrorMessage === '' && !isGettingEventLinkList) {
      // console.log('retrieving list of event links');
      this.setState({ isGettingEventLinkList: true });
      getEventLinkList(null, () => this.setState({ isGettingEventLinkList: false }));
    }
  };

  render() {
    const {
      linkEvents,
      linkMyMaps,
    } = this.state;
    const {
      auth,
      location,
      oevent,
      user,
      setLanguage,
    } = this.props;
    const { current } = user;
    const { selectedEventIdMapView, selectedRunner } = oevent;
    const userDetails = (current)
      ? (
        <div>
          <img
            className="ui avatar image"
            alt="avatar"
            src={(current && current.profileImage) ? current.profileImage : noAvatar}
            onError={(e) => {
              e.target.src = noAvatar; // if loading current.profileImage fails
            }}
          />
          {`  ${current.displayName}`}
        </div>
      )
      : '...';
    const isHome = (location.pathname === '/');
    const isSignup = (location.pathname === '/signup');
    const isLogin = (location.pathname === '/login');
    const isMyMapsList = (location.pathname === '/mymaps');
    const isMyMapsMap = (location.pathname === '/mymapsmap');
    const isMyMapsGroup = isMyMapsList || isMyMapsMap;
    const isEventsList = (location.pathname === '/events');
    const isEventsMap = (location.pathname === '/eventsmap');
    const isEventsGroup = isEventsList || isEventsMap;
    const isMapView = (location.pathname === '/mapview');
    const isUsers = (location.pathname === '/users');
    const isClubs = (location.pathname === '/clubs');
    const isCurrentUser = (location.pathname === '/me');

    const selectLanguage = (
      <div className="item">
        <i
          className="uk flag"
          role="button"
          label="English"
          onClick={() => setLanguage('en')}
          onKeyPress={() => setLanguage('en')}
          tabIndex={0}
        />
        <i
          className="cz flag"
          role="button"
          label="česky"
          onClick={() => setLanguage('cs')}
          onKeyPress={() => setLanguage('cs')}
          tabIndex={0}
        />
      </div>
    );

    const renderEvents = (isEventsGroup)
      ? (
        <>
          <Link to={linkEvents} className="active blue item header__menu--parent">
            <Trans>Events</Trans>
          </Link>
          <Link to="/events" className={(isEventsList) ? 'active blue item header__menu--child' : 'item header__menu--child'}>
            <Trans>&gt; List</Trans>
          </Link>
          <Link to="/eventsmap" className={(isEventsMap) ? 'active blue item header__menu--child-right' : 'item header__menu--child-right'}>
            <Trans>&gt; Map</Trans>
          </Link>
        </>
      )
      : (
        <Link to={linkEvents} className="item">
          <Trans>Events</Trans>
        </Link>
      );

    const renderMyMaps = (isMyMapsGroup)
      ? (
        <>
          <Link to={linkMyMaps} className="active blue item header__menu--parent">
            <Trans>My Maps</Trans>
          </Link>
          <Link to="/mymaps" className={(isMyMapsList) ? 'active blue item header__menu--child' : 'item header__menu--child'}>
            <Trans>&gt; List</Trans>
          </Link>
          <Link to="/mymapsmap" className={(isMyMapsMap) ? 'active blue item header__menu--child-right' : 'item header__menu--child-right'}>
            <Trans>&gt; Map</Trans>
          </Link>
        </>
      )
      : (
        <Link to={linkMyMaps} className="item">
          <Trans>My Maps</Trans>
        </Link>
      );

    if (auth) {
      return ( // header for logged in users
        <div>
          <div className="ui menu secondary pointing stackable">
            <Link to="/" className={(isHome) ? 'active item' : 'item'}><i className="icon home" /></Link>
            <span className="header__menu--divider" />
            {(selectedEventIdMapView && selectedRunner)
              ? (
                <>
                  <Link to="/mapview" className={(isMapView) ? 'active blue item' : 'item'}>
                    <Trans>Current Map</Trans>
                  </Link>
                  <span className="header__menu--divider" />
                </>
              )
              : null}
            {renderMyMaps}
            <span className="header__menu--divider" />
            {renderEvents}
            <span className="header__menu--divider" />
            <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>
              <Trans>Users</Trans>
            </Link>
            <span className="header__menu--divider" />
            <Link to="/clubs" className={(isClubs) ? 'active blue item' : 'item'}>
              <Trans>Clubs</Trans>
            </Link>
            <div className="right menu">
              <Link to="/me" className={(isCurrentUser) ? 'active blue item header__menu--current-user' : 'item header__menu--current-user'}>{userDetails}</Link>
              <span className="header__menu--divider" />
              <Link to="/logout" className="item right ">
                <Trans>Log Out</Trans>
              </Link>
              <span className="header__menu--divider" />
              {selectLanguage}
            </div>
          </div>
        </div>
      );
    }
    return ( // header if not logged in
      <div>
        <div className="ui menu secondary pointing">
          <Link to="/" className={(isHome) ? 'active blue item' : 'item'}><i className="icon home" /></Link>
          <span className="header__menu--divider" />
          {renderEvents}
          <div className="right menu">
            <Link to="/signup" className={(isSignup) ? 'active blue item' : 'item'}>
              <Trans>Sign Up</Trans>
            </Link>
            <span className="header__menu--divider" />
            <Link to="/login" className={(isLogin) ? 'active blue item' : 'item'}>
              <Trans>Log In</Trans>
            </Link>
            <span className="header__menu--divider" />
            {selectLanguage}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  club,
  oevent,
  user,
}) => {
  return {
    auth: auth.authenticated,
    club,
    oevent,
    user,
  };
};

export default connect(mapStateToProps, {
  getClubList: getClubListAction,
  getCurrentUser: getCurrentUserAction,
  getEventList: getEventListAction,
  getEventLinkList: getEventLinkListAction,
  getUserList: getUserListAction,
  setLanguage: setLanguageAction,
})(Header);
