import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import {
  reformatTimestamp,
  reformatTimestampDateOnly,
} from '../../common/conversions';
import {
  selectClubToDisplayAction,
  selectEventIdEventsAction,
  selectEventIdMapViewAction,
  selectRunnerToDisplayAction,
  selectUserToDisplayAction,
  setClubViewModeAction,
  setEventViewModeEventEventsAction,
  setEventViewModeEventMapViewAction,
  setUserViewModeAction,
} from '../../actions';

// The HomeRecentListItem component renders an individual activity as a line of text
class HomeRecentListItem extends Component {
  static propTypes = {
    activity: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    language: PropTypes.string.isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventIdEvents: PropTypes.func.isRequired,
    selectEventIdMapView: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    setEventViewModeEventEvents: PropTypes.func.isRequired,
    setEventViewModeEventMapView: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    userList: PropTypes.arrayOf(PropTypes.any),
  };

  static defaultProps = {
    userList: null,
  };

  redirectToClub = (clubId) => {
    const {
      history,
      selectClubToDisplay,
      setClubViewMode,
    } = this.props;
    selectClubToDisplay(clubId);
    setClubViewMode('view');
    history.push('/clubs');
    window.scrollTo(0, 0);
  }

  redirectToEvent = (eventId) => {
    const {
      history,
      selectEventIdEvents,
      setEventViewModeEventEvents,
    } = this.props;
    selectEventIdEvents(eventId);
    setEventViewModeEventEvents('view');
    history.push('/events');
    window.scrollTo(0, 0);
  }

  redirectToEventRunner = (eventId, userId) => {
    const {
      history,
      selectEventIdMapView,
      selectRunnerToDisplay,
      setEventViewModeEventMapView,
    } = this.props;
    selectEventIdMapView(eventId);
    setEventViewModeEventMapView('view');
    selectRunnerToDisplay(userId);
    history.push('./mapview');
    window.scrollTo(0, 0);
  }

  redirectToUser = (userId) => {
    const {
      history,
      selectUserToDisplay,
      setUserViewMode,
    } = this.props;
    selectUserToDisplay(userId);
    setUserViewMode('view');
    history.push('/users');
    window.scrollTo(0, 0);
  }

  renderActionByLink = (activity, userList) => {
    const { actionBy, eventRunner, user } = activity;
    const { active, _id: userId, displayName } = actionBy;
    if (user) {
      const { _id: targetUserId } = user;
      if (targetUserId === userId) return <Trans>themselves</Trans>;
    }
    if (eventRunner) {
      const { _id: eventRunnerId } = eventRunner;
      if (eventRunnerId === userId) return <Trans>themselves</Trans>;
    }
    if (!active) return displayName;
    // specifically for actionBy, it is possible that the current user will
    // not have permission to view this particular user's profile - need to check
    const inUserList = userList.find((eachUser) => {
      const { _id: eachUserId } = eachUser;
      return eachUserId === userId;
    });
    if (!inUserList) return displayName;
    return (
      <a
        href="/users"
        onClick={(e) => {
          e.preventDefault();
          this.redirectToUser(userId);
        }}
      >
        {displayName}
      </a>
    );
  };

  renderClubLink = (activity) => {
    const { club } = activity;
    if (!club) return '...';
    const { active, _id: clubId, shortName } = club;
    if (!active) return shortName;
    return (
      <a
        href="/clubs"
        onClick={(e) => {
          e.preventDefault();
          this.redirectToClub(clubId);
        }}
      >
        {shortName}
      </a>
    );
  };

  renderEventDetailsLink = (activity, language) => {
    const { event } = activity;
    if (!event) return '...';
    const {
      active,
      _id: eventId,
      date,
      name,
    } = event;
    const eventName = `${name} (${reformatTimestampDateOnly(date, language)})`;
    if (!active) return eventName;
    return (
      <a
        href="/events"
        onClick={(e) => {
          e.preventDefault();
          this.redirectToEvent(eventId);
        }}
      >
        {eventName}
      </a>
    );
  };

  renderEventRunnerLink = (activity) => {
    const { eventRunner } = activity;
    if (!eventRunner) return '...';
    const { active, _id: eventRunnerId, displayName } = eventRunner;
    if (!active) return displayName;
    return (
      <a
        href="/users"
        onClick={(e) => {
          e.preventDefault();
          this.redirectToUser(eventRunnerId);
        }}
      >
        {displayName}
      </a>
    );
  };

  renderEventLink = (activity) => {
    const { eventLink } = activity;
    if (!eventLink) return '...';
    const { displayName } = eventLink;
    return displayName; // no obvious page to link to, we don't know what events are included
  };

  renderUserLink = (activity) => {
    const { user } = activity;
    const { active, _id: userId, displayName } = user;
    if (!active) return displayName;
    return (
      <a
        href="/users"
        onClick={(e) => {
          e.preventDefault();
          this.redirectToUser(userId);
        }}
      >
        {displayName}
      </a>
    );
  };

  renderActivityDetail = memoize((activity, language, userList) => {
    const { actionType } = activity;
    switch (actionType) {
      case 'CLUB_CREATED':
        // The new club [club name] was created by [user name]
        return (
          <Trans>{`The new club ${this.renderClubLink(activity)} was created by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'CLUB_UPDATED':
        // The club [club name] was updated by [user name]
        return (
          <Trans>{`The club ${this.renderClubLink(activity)} was updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'CLUB_DELETED':
        // The club [club name] was deleted by [user name]
        return (
          <Trans>{`The club ${this.renderClubLink(activity)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'COMMENT_POSTED':
        // A new comment was posted about [runner name]'s run at [event name (date)] by [user name]
        return (
          <Trans>{`A new comment was posted about ${this.renderEventRunnerLink(activity)}'s run at ${this.renderEventDetailsLink(activity, language)} by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'COMMENT_UPDATED':
        // A comment about [runner name]'s run at [event name (date)] was updated by [user name]
        return (
          <Trans>{`A comment about ${this.renderEventRunnerLink(activity)}'s run at ${this.renderEventDetailsLink(activity, language)} was updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'COMMENT_DELETED':
      // A comment about [runner name]'s run at [event name (date)] was deleted by [user name]
        return (
          <Trans>{`A comment about ${this.renderEventRunnerLink(activity)}'s run at ${this.renderEventDetailsLink(activity, language)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_CREATED':
        // The new event [event name (date)] was created by [user name]
        return (
          <Trans>{`The new event ${this.renderEventDetailsLink(activity, language)} was created by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_UPDATED':
        // The event [event name (date)] was updated by [user name]
        return (
          <Trans>{`The event ${this.renderEventDetailsLink(activity, language)} was updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_DELETED':
        // The event [event name (date)] was deleted by [user name]
        return (
          <Trans>{`The event ${this.renderEventDetailsLink(activity, language)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_MAP_UPLOADED':
        // [runner name] uploaded a map from [event name (date)]
        // note: if an administrator uploads a map for another user that would not show here
        return (
          <Trans>{`${this.renderEventRunnerLink(activity)} uploaded a map from ${this.renderEventDetailsLink(activity, language)}`}</Trans>
        );
      case 'EVENT_MAP_DELETED':
        // [runner name] deleted a map from [event name (date)]
        // note: if an administrator deletes another user's map it would not show here
        return (
          <Trans>{`${this.renderEventRunnerLink(activity)} deleted a map from ${this.renderEventDetailsLink(activity, language)}`}</Trans>
        );
      case 'EVENT_RUNNER_ADDED':
        // [runner name] ran at [event name (date)]
        return (
          <Trans>{`${this.renderEventRunnerLink(activity)} ran at ${this.renderEventDetailsLink(activity, language)}`}</Trans>
        );
      case 'EVENT_RUNNER_UPDATED':
        // [runner name]'s details for [event name (date)] were updated by [user name]
        return (
          <Trans>{`${this.renderEventRunnerLink(activity)}'s details for ${this.renderEventDetailsLink(activity, language)} were updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_RUNNER_DELETED':
        // [runner name]'s record for [event name (date)] was deleted by [user name]
        return (
          <Trans>{`${this.renderEventRunnerLink(activity)}'s record for ${this.renderEventDetailsLink(activity, language)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'USER_CREATED':
        // [user name] created an account
        return (
          <Trans>{`${this.renderUserLink(activity)} created an account`}</Trans>
        );
      case 'USER_UPDATED':
        // The user [user name] was updated by [user name]
        return (
          <Trans>{`The user ${this.renderUserLink(activity)} was updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'USER_DELETED':
        // The user [user name] was deleted by [user name]
        return (
          <Trans>{`The user ${this.renderUserLink(activity)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_LINK_CREATED':
        // A new link between events [event link name] was updated by [user name]
        return (
          <Trans>{`A new link between events ${this.renderEventLink(activity)} was created by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_LINK_UPDATED':
        // The link between events [event link name] was updated by [user name]
        return (
          <Trans>{`The link between events ${this.renderEventLink(activity)} was updated by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      case 'EVENT_LINK_DELETED':
        // The link between events [event link name] was deleted by [user name]
        return (
          <Trans>{`The link between events ${this.renderEventLink(activity)} was deleted by ${this.renderActionByLink(activity, userList)}`}</Trans>
        );
      default:
        return <Trans>{`Unknown actionType ${actionType}`}</Trans>; // should never be needed
    }
  });

  render() {
    const { activity, language, userList } = this.props;
    const { timestamp } = activity;
    const activityTime = reformatTimestamp(timestamp, language);

    return (
      <li>
        {`${activityTime}: `}
        {this.renderActivityDetail(activity, language, userList)}
      </li>
    );
  }
}

const mapStateToProps = ({
  user,
}) => {
  return { userList: user.list };
};

const mapDispatchToProps = {
  selectClubToDisplay: selectClubToDisplayAction,
  selectEventIdEvents: selectEventIdEventsAction,
  selectEventIdMapView: selectEventIdMapViewAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setClubViewMode: setClubViewModeAction,
  setEventViewModeEventEvents: setEventViewModeEventEventsAction,
  setEventViewModeEventMapView: setEventViewModeEventMapViewAction,
  setUserViewMode: setUserViewModeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeRecentListItem));
