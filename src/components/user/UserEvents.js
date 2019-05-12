import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Collapse from '../Collapse';
import EventListItem from '../event/EventListItem';

const UserEvents = ({
  eventsList,
  history,
  language,
  selectedUser,
  selectEventToDisplay,
  selectRunnerToDisplay,
}) => {
  if (eventsList.length === 0) {
    return null;
  }
  const { _id: userId } = selectedUser;
  const handleSelectEvent = (eventId) => {
    selectEventToDisplay(eventId);
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
        />
      );
    });

  return (
    <div className="ui segment">
      <Collapse title="Events">
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
  selectEventToDisplay: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};
UserEvents.defaultProps = {
  eventsList: [],
};

export default withRouter(UserEvents);
