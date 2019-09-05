import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import EventListItem from '../event/EventListItem';

// The UserEvents component renders a list of events that a user has attended
const UserEvents = ({
  eventsList,
  history,
  language,
  selectedUser,
  selectEventIdMapView,
  selectRunnerToDisplay,
}) => {
  if (eventsList.length === 0) {
    return null;
  }
  const { _id: userId } = selectedUser;
  const handleSelectEvent = (eventId) => {
    selectEventIdMapView(eventId);
    selectRunnerToDisplay(userId);
    history.push('/mapview');
  };
  const userEventsArray = [...eventsList]
    .sort((a, b) => {
      return (a.date < b.date) ? 0 : -1;
    })
    .map((oevent) => {
      const { _id: eventId } = oevent;
      return (
        <EventListItem
          key={eventId}
          language={language}
          oevent={oevent}
          handleSelectEvent={handleSelectEvent}
          selectedEventId=""
        />
      );
    });
  const title = <Trans>Events</Trans>;

  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {userEventsArray}
        </div>
      </Collapse>
    </div>
  );
};

UserEvents.propTypes = {
  eventsList: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  language: PropTypes.string.isRequired,
  selectedUser: PropTypes.objectOf(PropTypes.any).isRequired,
  selectEventIdMapView: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};
UserEvents.defaultProps = {
  eventsList: [],
};

export default withRouter(UserEvents);
