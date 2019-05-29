import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

const EventDelete = ({
  selectedEvent,
  selectedEventDetails,
  selectedEventDisplay,
  deleteEvent,
  getEventList,
  getEventLinkList,
  setEventViewModeEvent,
  selectEventForDetails,
  selectEventToDisplay,
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
              getEventList(null, () => {
                setEventViewModeEvent('none');
                getEventLinkList();
                if (eventId === selectedEventDetails) selectEventForDetails('');
                if (eventId === selectedEventDisplay) selectEventToDisplay('');
              });
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
  selectedEventDetails: PropTypes.string,
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
  selectedEventDetails: '',
  selectedEventDisplay: '',
};

export default EventDelete;
