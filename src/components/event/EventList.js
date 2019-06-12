import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventListItem from './EventListItem';
import Collapse from '../Collapse';

const EventList = ({
  language,
  events,
  handleSelectEvent,
  // selectEventForDetails,
  // setEventViewModeEvent,
}) => {
  const noMatchingEventsMessage = <Trans>{'Sorry, there aren\'t any matching events to display!'}</Trans>;
  const title = <Trans>Event List</Trans>;
  if (events.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">{noMatchingEventsMessage}</div>
      </div>
    );
  }
  // const handleSelectEvent = (eventId) => {
  //   selectEventForDetails(eventId);
  //   setEventViewModeEvent('view');
  // };
  const eventsArray = [...events]
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
          // selectEventForDetails={selectEventForDetails}
          // setEventViewModeEvent={setEventViewModeEvent}
        />
      );
    });
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div
          className="ui link cards card-list"
          role="button"
          onClick={(e) => {
            if (e.target.classList.contains('cards')) {
              handleSelectEvent('');
              // selectEventForDetails('');
              // setEventViewModeEvent('none');
            }
          }}
          onKeyPress={(e) => {
            if (e.target.classList.contains('cards')) {
              handleSelectEvent('');
              // selectEventForDetails('');
              // setEventViewModeEvent('none');
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
  language: PropTypes.string,
  handleSelectEvent: PropTypes.func.isRequired,
  // selectEventForDetails: PropTypes.func.isRequired,
  // setEventViewModeEvent: PropTypes.func.isRequired,
};
EventList.defaultProps = {
  events: [],
  language: 'en',
};

export default EventList;
