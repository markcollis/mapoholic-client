import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import Table from '../generic/Table';

import { reformatTimestamp, reformatTimestampDateOnly } from '../../common/conversions';
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

// The HomeAdminActivity component renders a detailed table recording all site activity
// to inform administrative users
class HomeAdminActivity extends Component {
  static propTypes = {
    activityList: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    language: PropTypes.string.isRequired,
    refreshCollapse: PropTypes.number.isRequired,
    requestRefreshCollapse: PropTypes.func.isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventIdEvents: PropTypes.func.isRequired,
    selectEventIdMapView: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    setEventViewModeEventEvents: PropTypes.func.isRequired,
    setEventViewModeEventMapView: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activityList: [],
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

  renderActionByLink = (activity) => {
    const { actionBy } = activity;
    return this.renderSpecificUserLink(actionBy);
  }

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
    return this.renderSpecificUserLink(eventRunner);
  }

  renderUserLink = (activity) => {
    const { user } = activity;
    if (!user) return '...';
    return this.renderSpecificUserLink(user);
  }

  renderSpecificUserLink = (user) => {
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

  render() {
    const {
      activityList,
      language,
      refreshCollapse,
      requestRefreshCollapse,
    } = this.props;
    const tableHead = ['actionBy', 'actionType', 'club', 'event', 'eventRunner', 'eventLink', 'user', 'timestamp'];
    const tableData = (activityList)
      ? (
        activityList.map((activity) => {
          const {
            actionBy,
            actionType,
            club,
            event,
            eventRunner,
            eventLink, // originally linkedEvent, may cause issues with old data
            user,
            timestamp,
          } = activity;
          const actionByLink = this.renderActionByLink(activity);
          const actionByText = actionBy.displayName;
          const actionTypeText = actionType;
          const clubLink = (club) ? this.renderClubLink(activity) : '';
          const clubText = (club) ? club.shortName : '';
          const eventDetailsLink = (event) ? this.renderEventDetailsLink(activity, language) : '';
          const eventDetailsText = (event) ? `${event.name} (${event.date})` : '';
          const eventRunnerLink = (eventRunner) ? this.renderEventRunnerLink(activity) : '';
          const eventRunnerText = (eventRunner) ? eventRunner.displayName : '';
          const eventLinkText = (eventLink) ? eventLink.displayName : '';
          const timestampText = reformatTimestamp(timestamp, language);
          const userLink = (user) ? this.renderUserLink(activity) : '';
          const userText = (user) ? user.displayName : '';
          return {
            highlightRow: false,
            rowData: [
              { render: actionByLink, sort: actionByText },
              { render: actionTypeText },
              { render: clubLink, sort: clubText },
              { render: eventDetailsLink, sort: eventDetailsText },
              { render: eventRunnerLink, sort: eventRunnerText },
              { render: eventLinkText },
              { render: userLink, sort: userText },
              { render: timestampText },
            ],
          };
        })
      )
      : null;

    const title = <Trans>Site activity history</Trans>;
    return (
      <Collapse title={title} refreshCollapse={refreshCollapse}>
        <Table
          language={language}
          tableHead={tableHead}
          tableData={tableData}
          requestRefreshCollapse={requestRefreshCollapse}
        />
      </Collapse>
    );
  }
}

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

export default connect(null, mapDispatchToProps)(withRouter(HomeAdminActivity));
