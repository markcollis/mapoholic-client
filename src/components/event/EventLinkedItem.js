import React from 'react';
import PropTypes from 'prop-types';
import { reformatDate } from '../../common/conversions';

const EventLinkedItem = ({
  eventId,
  linkedEvent,
  selectEvent,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  if (!linkedEvent) return null;
  const { _id: linkedEventId, name, date } = linkedEvent;
  if (linkedEventId === eventId) {
    return (
      <div className="ui fluid centered card event-link-current">
        <div className="content">
          <div className="header">{`${reformatDate(date)} - ${name}`}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ui fluid centered card"
      role="button"
      onClick={() => {
        selectEvent(linkedEventId);
        setEventViewModeEvent('view');
        setEventViewModeEventLink('view');
      }}
      onKeyPress={() => {
        selectEvent(linkedEventId);
        setEventViewModeEvent('view');
        setEventViewModeEventLink('view');
      }}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">{`${reformatDate(date)} - ${name}`}</div>
      </div>
    </div>
  );
};

EventLinkedItem.propTypes = {
  eventId: PropTypes.string.isRequired,
  linkedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedItem;
