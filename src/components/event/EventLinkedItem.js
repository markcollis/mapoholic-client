import React from 'react';
import PropTypes from 'prop-types';
import { reformatTimestampDateOnly } from '../../common/conversions';

const EventLinkedItem = ({
  eventId,
  language,
  linkedEvent,
  selectEvent,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  if (!linkedEvent) return null;
  const { _id: linkedEventId, name, date } = linkedEvent;
  if (linkedEventId === eventId) {
    return (
      <div className="ui fluid centered card item-selected">
        <div className="content">
          <div className="header">{`${reformatTimestampDateOnly(date, language)} - ${name}`}</div>
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
        <div className="header">{`${reformatTimestampDateOnly(date, language)} - ${name}`}</div>
      </div>
    </div>
  );
};

EventLinkedItem.propTypes = {
  eventId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  linkedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedItem;
