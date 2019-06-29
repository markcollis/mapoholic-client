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
import noAvatar from '../graphics/no-avatar.png';
import { MAPOHOLIC_SERVER } from '../config';

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
      console.log('getting current user details');
      this.setState({ isGettingCurrentUser: true });
      getCurrentUser(() => this.setState({ isGettingCurrentUser: false }));
    }
    if (!clubList && clubErrorMessage === '' && !isGettingClubList) {
      console.log('retrieving list of clubs');
      this.setState({ isGettingClubList: true });
      getClubList(null, () => this.setState({ isGettingClubList: false }));
    }
    if (!userList && userErrorMessage === '' && !isGettingUserList) {
      console.log('retrieving list of users');
      this.setState({ isGettingUserList: true });
      getUserList(null, () => this.setState({ isGettingUserList: false }));
    }
    if (!list && eventErrorMessage === '' && !isGettingEventList) {
      console.log('retrieving list of events');
      this.setState({ isGettingEventList: true });
      getEventList(null, () => this.setState({ isGettingEventList: false }));
    }
    if (!linkList && eventErrorMessage === '' && !isGettingEventLinkList) {
      console.log('retrieving list of event links');
      this.setState({ isGettingEventLinkList: true });
      getEventLinkList(null, () => this.setState({ isGettingEventLinkList: false }));
    }
  };

  render() {
    const {
      linkEvents,
      linkMyMaps,
    } = this.state;
    // console.log('props in Header:', this.props);
    // console.log('state in Header:', this.state);
    const {
      auth,
      location,
      oevent,
      user,
      setLanguage,
    } = this.props;
    const { current } = user;
    const { selectedEventDisplay, selectedRunner } = oevent;
    const userDetails = (current)
      ? (
        <div>
          <img
            className="ui avatar image"
            alt="avatar"
            src={(current && current.profileImage) ? `${MAPOHOLIC_SERVER}/${current.profileImage}` : noAvatar}
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

    // const linkEvents = '/events';
    // const linkMyMaps = '/mymaps';

    const selectLanguage = (
      <div className="item">
        <i
          className="uk flag"
          role="button"
          onClick={() => setLanguage('en')}
          onKeyPress={() => setLanguage('en')}
          tabIndex="0"
        />
        <i
          className="cz flag"
          role="button"
          onClick={() => setLanguage('cs')}
          onKeyPress={() => setLanguage('cs')}
          tabIndex="0"
        />
      </div>
    );

    const myMapsSubMenu = (isMyMapsGroup)
      ? (
        <div className="ui top attached tabular menu">
          <Link to="/mymaps" className={(isMyMapsList) ? 'active item' : 'item'}>
            <Trans>List view</Trans>
          </Link>
          <Link to="/mymapsmap" className={(isMyMapsMap) ? 'active item' : 'item'}>
            <Trans>Map view</Trans>
          </Link>
        </div>
      )
      : null;

    const eventsSubMenu = (isEventsGroup)
      ? (
        <div className="ui top attached tabular menu">
          <Link to="/events" className={(isEventsList) ? 'active item' : 'item'}>
            <Trans>List view</Trans>
          </Link>
          <Link to="/eventsmap" className={(isEventsMap) ? 'active item' : 'item'}>
            <Trans>Map view</Trans>
          </Link>
        </div>
      )
      : null;

    if (auth) {
      return (
        <div>
          <div className="ui menu secondary pointing">
            <Link to="/" className={(isHome) ? 'active item' : 'item'}><i className="icon home" /></Link>
            {(selectedEventDisplay && selectedRunner)
              ? (
                <Link to="/mapview" className={(isMapView) ? 'active blue item' : 'item'}>
                  <Trans>Current Map</Trans>
                </Link>
              )
              : null}
            <Link to={linkMyMaps} className={(isMyMapsGroup) ? 'active blue item' : 'item'}>
              <Trans>My Maps</Trans>
            </Link>
            <Link to={linkEvents} className={(isEventsGroup) ? 'active blue item' : 'item'}>
              <Trans>Events</Trans>
            </Link>
            <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>
              <Trans>Users</Trans>
            </Link>
            <Link to="/clubs" className={(isClubs) ? 'active blue item' : 'item'}>
              <Trans>Clubs</Trans>
            </Link>
            <div className="right menu">
              <Link to="/me" className={(isCurrentUser) ? 'active blue item header-current-user' : 'item header-current-user'}>{userDetails}</Link>
              <Link to="/logout" className="item right ">
                <Trans>Log Out</Trans>
              </Link>
              {selectLanguage}
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
          <Link to={linkEvents} className={(isEventsGroup) ? 'active blue item' : 'item'}>
            <Trans>Browse Public Maps</Trans>
          </Link>
          <div className="right menu">
            <Link to="/signup" className={(isSignup) ? 'active blue item' : 'item'}>
              <Trans>Sign Up</Trans>
            </Link>
            <Link to="/login" className={(isLogin) ? 'active blue item' : 'item'}>
              <Trans>Log In</Trans>
            </Link>
            {selectLanguage}
          </div>
        </div>
        {eventsSubMenu}
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
