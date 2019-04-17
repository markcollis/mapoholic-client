import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
import EventLinkedItem from './EventLinkedItem';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventLinked = ({
  isAdmin,
  canEdit,
  selectedEvent,
  link,
  eventLinkMode,
  linkDetails,
  selectEventForDetails,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  const { _id: linkId, displayName } = link;
  const { _id: eventId } = selectedEvent;
  // console.log('selectedEvent:', selectedEvent);
  // console.log('linkId:', linkId);
  if (!selectedEvent._id) return null;
  if (!linkId) {
    return (
      <div className="ui segment">
        <h3 className="header">Linked events</h3>
        <p>This event is not currently linked to any others.</p>
      </div>
    );
  }
  if (!linkDetails[linkId]) {
    return (
      <div className="ui warning message">{`Event link details not found for ${linkId}`}</div>
    );
  }
  // console.log('includes', linkListDetails[linkId].includes);
  const linkedEventArray = [...linkDetails[linkId].includes].map((linkedEvent) => {
    // console.log('linkedEvent in array generator:', linkedEvent);
    return (
      <EventLinkedItem
        key={linkedEvent._id}
        eventId={eventId}
        linkedEvent={linkedEvent}
        setEventViewModeEvent={setEventViewModeEvent}
        setEventViewModeEventLink={setEventViewModeEventLink}
        selectEventForDetails={selectEventForDetails}
      />
    );
  });

  const deleteButton = (isAdmin)
    ? (
      <button
        type="button"
        className={(eventLinkMode === 'delete')
          ? 'ui red tiny button right floated disabled'
          : 'ui red tiny button right floated'}
        onClick={() => setEventViewModeEventLink('delete')}
      >
      Delete link
      </button>
    )
    : null;
  const showEdit = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        {deleteButton}
        <button
          type="button"
          className={(eventLinkMode === 'edit')
            ? 'ui primary tiny button disabled'
            : 'ui primary tiny button'}
          onClick={() => setEventViewModeEventLink('edit')}
        >
          Edit link details
        </button>
      </div>
    )
    : null;

  return (
    <div className="ui segment">
      <Collapse title={`Linked events: ${displayName}`}>
        <div className="ui link cards card-list">
          {linkedEventArray}
        </div>
        {showEdit}
      </Collapse>
    </div>
  );
};

EventLinked.propTypes = {
  isAdmin: PropTypes.bool,
  canEdit: PropTypes.bool,
  eventLinkMode: PropTypes.string,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  link: PropTypes.objectOf(PropTypes.any),
  linkDetails: PropTypes.objectOf(PropTypes.any),
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};
EventLinked.defaultProps = {
  isAdmin: false,
  canEdit: false,
  eventLinkMode: 'view',
  selectedEvent: {},
  link: {},
  linkDetails: {},
};

export default EventLinked;
