import React from 'react';
import PropTypes from 'prop-types';
import EventListItem from './EventListItem';
import Collapse from '../Collapse';

const EventList = ({ events, selectEventForDetails, setEventViewModeEvent }) => {
  if (events.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">{'Sorry, there aren\'t any matching events to display!'}</div>
      </div>
    );
  }
  const eventsArray = [...events]
    .sort((a, b) => {
      return (a.date < b.date) ? 0 : -1;
    })
    .map((oevent) => {
      const { _id: eventId } = oevent;
      return (
        <EventListItem
          key={eventId}
          oevent={oevent}
          selectEventForDetails={selectEventForDetails}
          setEventViewModeEvent={setEventViewModeEvent}
        />
      );
    });
  return (
    <div className="ui segment">
      <Collapse title="Event list">
        <div
          className="ui link cards card-list"
          role="button"
          onClick={(e) => {
            if (e.target.classList.contains('cards')) {
              selectEventForDetails('');
              setEventViewModeEvent('none');
            }
          }}
          onKeyPress={(e) => {
            if (e.target.classList.contains('cards')) {
              selectEventForDetails('');
              setEventViewModeEvent('none');
            }
          }}
          tabIndex="0"
        >
          {eventsArray}
        </div>
      </Collapse>
    </div>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventList.defaultProps = {
  events: [],
};

export default EventList;
