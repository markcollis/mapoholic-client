import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

const EventDelete = ({
  deleteEvent,
  // getEventLinkList,
  // getEventList,
  selectedEvent,
  setEventViewModeEvent,
}) => {
  if (!selectedEvent) return null;
  const { _id: eventId, name, date } = selectedEvent;
  return (
    <div className="ui segment">
      <h3><Trans>{`Delete Event: ${name} (${date})`}</Trans></h3>
      <p>
        <Trans>
        Note: Deletion is only permitted by standard users if there are no runners
        at the event, or you are the only runner. Deleting an event
        also removes all references to it in linked events.
        </Trans>
      </p>
      <button
        type="button"
        className="ui red button"
        onClick={() => {
          deleteEvent(eventId, (didSucceed) => {
            if (didSucceed) {
              setEventViewModeEvent('none');
              // getEventList(null, () => { // want to eliminate this in reducer
              //   getEventLinkList(); // want to eliminate this in reducer
              //   // reset selectedEventId whether viewing or not - moved to reducer
              //   // if (eventId === selectedEventIdEvents) selectEventIdEvents('');
              //   // if (eventId === selectedEventIdMyMaps) selectEventIdMyMaps('');
              //   // if (eventId === selectedEventIdMapView) selectEventIdMapView('');
              // });
            }
          });
        }}
      >
        <Trans>Delete Event?</Trans>
      </button>
      <button
        type="button"
        className="ui button right floated"
        onClick={() => setEventViewModeEvent('view')}
      >
        <Trans>Cancel</Trans>
      </button>
    </div>
  );
};

EventDelete.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  // getEventList: PropTypes.func.isRequired,
  // getEventLinkList: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventDelete.defaultProps = {
  selectedEvent: null,
};

export default EventDelete;
