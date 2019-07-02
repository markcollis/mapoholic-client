import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventListItem from './EventListItem';
import Collapse from '../generic/Collapse';

const EventList = ({
  currentUserId,
  language,
  events,
  handleSelectEvent,
  selectedEventId,
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
  const eventsArray = [...events]
    .sort((a, b) => {
      return (a.date < b.date) ? 0 : -1;
    })
    .map((oevent) => {
      const { _id: eventId } = oevent;
      return (
        <EventListItem
          key={eventId}
          currentUserId={currentUserId}
          language={language}
          oevent={oevent}
          handleSelectEvent={handleSelectEvent}
          selectedEventId={selectedEventId}
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
            }
          }}
          onKeyPress={(e) => {
            if (e.target.classList.contains('cards')) {
              handleSelectEvent('');
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
  currentUserId: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string,
  handleSelectEvent: PropTypes.func.isRequired,
  selectedEventId: PropTypes.string,
};
EventList.defaultProps = {
  currentUserId: null,
  events: [],
  language: 'en',
  selectedEventId: '',
};

export default EventList;
