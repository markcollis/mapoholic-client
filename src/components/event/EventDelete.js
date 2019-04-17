import React from 'react';
import PropTypes from 'prop-types';

const EventDelete = ({
  selectedEvent,
  selectedEventDisplay,
  deleteEvent,
  getEventList,
  getEventLinkList,
  setEventViewModeEvent,
  selectEventForDetails,
  selectEventToDisplay,
}) => {
  // console.log('selectedEvent:', selectedEvent);
  if (!selectedEvent) return null;
  const { _id: eventId, name, date } = selectedEvent;
  return (
    <div className="ui segment">
      <h3>Delete Event</h3>
      <p>
      Note: Deletion is only permitted if there are no runners at the event, or the user attempting
      to delete is the only runner. Deleting an event also removes all references in linked events.
      </p>
      <button
        type="button"
        className="ui red button"
        onClick={() => {
          setTimeout(() => deleteEvent(eventId, (didSucceed) => {
            if (didSucceed) {
              getEventList(null, () => {
                setEventViewModeEvent('none');
                selectEventForDetails('');
                getEventLinkList();
                if (eventId === selectedEventDisplay) selectEventToDisplay('');
              });
            }
          }), 1000); // simulate network delay
        }}
      >
        {`Delete ${name} (${date})?`}
      </button>
      <button
        type="button"
        className="ui button right floated"
        onClick={() => setEventViewModeEvent('view')}
      >
      Cancel
      </button>
    </div>
  );
};

EventDelete.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedEventDisplay: PropTypes.string,
  getEventList: PropTypes.func.isRequired,
  getEventLinkList: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  selectEventToDisplay: PropTypes.func.isRequired,
};
EventDelete.defaultProps = {
  selectedEvent: null,
  selectedEventDisplay: '',
};

export default EventDelete;
