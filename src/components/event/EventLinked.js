import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../Collapse';
import EventLinkedItem from './EventLinkedItem';

const EventLinked = ({
  canEdit,
  eventLinkMode,
  isAdmin,
  language,
  link,
  linkDetails,
  selectedEvent,
  selectEvent,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  // console.log('linkDetails:', linkDetails);
  const { _id: linkId, displayName } = link;
  const { _id: eventId } = selectedEvent;
  if (!eventId) return null;
  if (!linkId) {
    return (
      <div className="ui segment">
        <h3 className="header"><Trans>Linked events</Trans></h3>
        <p><Trans>This event is not currently linked to any others.</Trans></p>
      </div>
    );
  }
  if (!linkDetails[linkId]) {
    return (
      <div className="ui warning message">
        <Trans>{`Event link details not found for ${linkId}`}</Trans>
      </div>
    );
  }
  const sortedLinkedEventArray = [...linkDetails[linkId].includes].sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
  const linkedEventArrayToDisplay = sortedLinkedEventArray.map((linkedEvent) => {
    // console.log('linkedEvent in array generator:', linkedEvent);
    const { _id: linkedEventId } = linkedEvent;
    if (!linkedEventId) return null;
    return (
      <EventLinkedItem
        key={linkedEventId}
        eventId={eventId}
        language={language}
        linkedEvent={linkedEvent}
        selectEvent={selectEvent}
        setEventViewModeEvent={setEventViewModeEvent}
        setEventViewModeEventLink={setEventViewModeEventLink}
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
        onClick={() => setEventViewModeEventLink('delete', linkId)}
      >
        <Trans>Delete link</Trans>
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
          onClick={() => setEventViewModeEventLink('edit', linkId)}
        >
          <Trans>Edit link details</Trans>
        </button>
      </div>
    )
    : null;
  const title = <Trans>{`Linked events: ${displayName}`}</Trans>;

  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {linkedEventArrayToDisplay}
        </div>
        {showEdit}
      </Collapse>
    </div>
  );
};

EventLinked.propTypes = {
  canEdit: PropTypes.bool,
  eventLinkMode: PropTypes.string,
  isAdmin: PropTypes.bool,
  language: PropTypes.string.isRequired,
  link: PropTypes.objectOf(PropTypes.any),
  linkDetails: PropTypes.objectOf(PropTypes.any),
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};
EventLinked.defaultProps = {
  canEdit: false,
  eventLinkMode: 'view',
  isAdmin: false,
  link: {},
  linkDetails: {},
  selectedEvent: {},
};

export default EventLinked;
