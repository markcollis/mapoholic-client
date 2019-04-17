import React from 'react';
import PropTypes from 'prop-types';

const EventLinkedItem = ({
  eventId,
  linkedEvent,
  selectEventForDetails,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  // console.log('eventId', eventId);
  // console.log('linkedEvent', linkedEvent);
  // console.log('selectEventForDetails', selectEventForDetails);
  // console.log('setEventViewModeEvent', setEventViewModeEvent);
  if (!linkedEvent) return null;
  // console.log('linkedEvent in EventLinkedItem:', linkedEvent);
  const { _id: linkedEventId, name, date } = linkedEvent;
  if (linkedEventId === eventId) return null;
  const reformattedDate = date.slice(8)
    .concat('/')
    .concat(date.slice(5, 7))
    .concat('/')
    .concat(date.slice(0, 4));

  return (
    <div
      className="ui fluid centered card"
      role="button"
      onClick={() => {
        selectEventForDetails(linkedEventId);
        setEventViewModeEvent('view');
        setEventViewModeEventLink('view');
      }}
      onKeyPress={() => {
        selectEventForDetails(linkedEventId);
        setEventViewModeEvent('view');
        setEventViewModeEventLink('view');
      }}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">{`${reformattedDate} - ${name}`}</div>
      </div>
    </div>
  );
};

EventLinkedItem.propTypes = {
  eventId: PropTypes.string.isRequired,
  linkedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedItem;
