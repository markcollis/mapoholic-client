import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Collapse from '../Collapse';
import EventListItem from '../event/EventListItem';

const ClubEvents = ({
  eventsList,
  history,
  language,
  selectEventForDetails,
  setEventViewModeEvent,
}) => {
  if (eventsList.length === 0) {
    return null;
  }
  const handleSelectEvent = (eventId) => {
    selectEventForDetails(eventId);
    setEventViewModeEvent('view');
    history.push('/events');
    window.scrollTo(0, 0);
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

ClubEvents.propTypes = {
  eventsList: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  language: PropTypes.string.isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
ClubEvents.defaultProps = {
  eventsList: [],
};

export default withRouter(ClubEvents);
