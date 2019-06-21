import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import {
  reformatDate,
  reformatTimestamp,
  // reformatTimestampDateOnly,
} from '../../common/conversions';
import {
  selectClubToDisplayAction,
  selectEventForDetailsEventsAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  selectUserToDisplayAction,
  setClubViewModeAction,
  setEventViewModeEventEventsAction,
  setEventViewModeEventMapViewAction,
  setUserViewModeAction,
} from '../../actions';

class HomeRecentListItem extends Component {
  static propTypes = {
    activity: PropTypes.objectOf(PropTypes.any).isRequired,
    // clubList: PropTypes.arrayOf(PropTypes.object).isRequired,
    // config: PropTypes.objectOf(PropTypes.any).isRequired,
    // eventList: PropTypes.arrayOf(PropTypes.object).isRequired,
    // eventLinkList: PropTypes.arrayOf(PropTypes.object).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    // userList: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventForDetailsEvents: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    setEventViewModeEventEvents: PropTypes.func.isRequired,
    setEventViewModeEventMapView: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
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
      selectEventForDetailsEvents,
      setEventViewModeEventEvents,
    } = this.props;
    selectEventForDetailsEvents(eventId);
    setEventViewModeEventEvents('view');
    history.push('/events');
    window.scrollTo(0, 0);
  }

  redirectToEventRunner = (eventId, userId) => {
    const {
      history,
      selectEventToDisplay,
      selectRunnerToDisplay,
      setEventViewModeEventMapView,
    } = this.props;
    selectEventToDisplay(eventId);
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

  renderActionByLink = (activity) => {
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
    if (!active) return displayName; // will it show 'deleted'?
    // specifically for actionBy, it is possible that the current user will
    // not have permission to view this particular user's profile - need to check
    const canSee = true; // temp
    if (!canSee) return displayName;
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

  renderEventLink = (activity) => {
    const { event } = activity;
    if (!event) return '...';
    const {
      active,
      _id: eventId,
      date,
      name,
    } = event;
    const eventName = `${name} (${reformatDate(date)})`;
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
    if (!active) return displayName; // will it show 'deleted'?
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

  renderLinkedEventLink = (activity) => {
    const { linkedEvent } = activity;
    if (!linkedEvent) return '!!!';
    const { displayName } = linkedEvent;
    return displayName; // no obvious page to link to, we don't know what events are included
  };

  renderUserLink = (activity) => {
    const { user } = activity;
    const { active, _id: userId, displayName } = user;
    if (!active) return displayName; // will it show 'deleted'?
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

  renderActivityDetail = memoize((activity) => {
    const {
      // actionBy,
      actionType,
      // timestamp,
      // club,
      // comment,
      // event,
      // eventRunner,
      // linkedEvent,
      // user,
    } = activity;

    switch (actionType) {
      case 'CLUB_CREATED':
        // The new club [club name] was created by [user name]
        return (
          <>
            <Trans>The new club</Trans>
            &nbsp;
            {this.renderClubLink(activity)}
            &nbsp;
            <Trans>was created by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'CLUB_UPDATED':
        // The club [club name] was updated by [user name]
        return (
          <>
            <Trans>The club</Trans>
            &nbsp;
            {this.renderClubLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'CLUB_DELETED':
        // The club [club name] was deleted by [user name]
        return (
          <>
            <Trans>Club</Trans>
            &nbsp;
            {this.renderClubLink(activity)}
            &nbsp;
            <Trans>deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'COMMENT_POSTED':
        // A new comment was posted about [runner name]'s run at [event name (date)] by [user name]
        return (
          <>
            <Trans>A new comment was posted about</Trans>
            &nbsp;
            {this.renderEventRunnerLink(activity)}
            <Trans>&apos;s run at</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'COMMENT_UPDATED':
        // A comment about [runner name]'s run at [event name (date)] was updated by [user name]
        return (
          <>
            <Trans>A comment about</Trans>
            &nbsp;
            {this.renderEventRunnerLink(activity)}
            <Trans>&apos;s run at</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'COMMENT_DELETED':
      // A comment about [runner name]'s run at [event name (date)] was deleted by [user name]
        return (
          <>
            <Trans>A comment about</Trans>
            &nbsp;
            {this.renderEventRunnerLink(activity)}
            <Trans>&apos;s run at</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_CREATED':
        // The new event [event name (date)] was created by [user name]
        return (
          <>
            <Trans>The new event</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was created by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_UPDATED':
        // The event [event name (date)] was updated by [user name]
        return (
          <>
            <Trans>The event</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_DELETED':
        // The event [event name (date)] was deleted by [user name]
        return (
          <>
            <Trans>The event</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_MAP_UPLOADED':
        // [runner name] uploaded a map from [event name (date)]
        // note: if an administrator uploads a map for another user it would not show here
        return (
          <>
            {this.renderEventRunnerLink(activity)}
            &nbsp;
            <Trans>uploaded a map from</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
          </>
        );
      case 'EVENT_MAP_DELETED':
        // [runner name] deleted a map from [event name (date)]
        // note: if an administrator deletes another user's map it would not show here
        return (
          <>
            {this.renderEventRunnerLink(activity)}
            &nbsp;
            <Trans>deleted a map from</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
          </>
        );
      case 'EVENT_RUNNER_ADDED':
        // [runner name] ran at [event name (date)]
        return (
          <>
            {this.renderEventRunnerLink(activity)}
            &nbsp;
            <Trans>ran at</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
          </>
        );
      case 'EVENT_RUNNER_UPDATED':
        // [runner name]'s record for [event name (date)] was updated by [user name]
        return (
          <>
            {this.renderEventRunnerLink(activity)}
            <Trans>&apos;s record for</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_RUNNER_DELETED':
        // [runner name]'s record for [event name (date)] was deleted by [user name]
        return (
          <>
            {this.renderEventRunnerLink(activity)}
            <Trans>&apos;s record for</Trans>
            &nbsp;
            {this.renderEventLink(activity)}
            &nbsp;
            <Trans>was deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'USER_CREATED':
        // [user name] created an account
        return (
          <>
            {this.renderUserLink(activity)}
            &nbsp;
            <Trans>created an account</Trans>
          </>
        );
      case 'USER_UPDATED':
        // The user [user name] was updated by [user name]
        return (
          <>
            <Trans>The user</Trans>
            &nbsp;
            {this.renderUserLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'USER_DELETED':
        // The user [user name] was deleted by [user name]
        return (
          <>
            <Trans>The user</Trans>
            &nbsp;
            {this.renderUserLink(activity)}
            &nbsp;
            <Trans>was deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_LINK_CREATED':
        // A new link between events [event link name] was updated by [user name]
        return (
          <>
            <Trans>A new link between events</Trans>
            &nbsp;
            {this.renderLinkedEventLink(activity)}
            &nbsp;
            <Trans>was created by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_LINK_UPDATED':
        // The link between events [event link name] was updated by [user name]
        return (
          <>
            <Trans>The link between events</Trans>
            &nbsp;
            {this.renderLinkedEventLink(activity)}
            &nbsp;
            <Trans>was updated by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      case 'EVENT_LINK_DELETED':
        // The link between events [event link name] was deleted by [user name]
        return (
          <>
            <Trans>The link between events</Trans>
            &nbsp;
            {this.renderLinkedEventLink(activity)}
            &nbsp;
            <Trans>was deleted by</Trans>
            &nbsp;
            {this.renderActionByLink(activity)}
          </>
        );
      default:
        return 'not defined yet';
    }
  });

  render() {
    console.log('props in HomeRecentListItem:', this.props);
    const { activity } = this.props;
    const { timestamp } = activity;
    const activityTime = reformatTimestamp(timestamp);

    return (
      <li>
        {`${activityTime}: `}
        {this.renderActivityDetail(activity)}
      </li>
    );
  }
}
// const mapStateToProps = ({
//   club,
//   config,
//   oevent,
//   user,
// }) => {
//   return {
//     clubList: club.list,
//     config,
//     eventList: oevent.list,
//     eventLinkList: oevent.linkList,
//     userList: user.list,
//   };
// };
const mapDispatchToProps = {
  selectClubToDisplay: selectClubToDisplayAction,
  selectEventForDetailsEvents: selectEventForDetailsEventsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setClubViewMode: setClubViewModeAction,
  setEventViewModeEventEvents: setEventViewModeEventEventsAction,
  setEventViewModeEventMapView: setEventViewModeEventMapViewAction,
  setUserViewMode: setUserViewModeAction,
};

export default connect(null, mapDispatchToProps)(withRouter(HomeRecentListItem));
