import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import EventLinkedItem from './EventLinkedItem';

const EventLinked = ({
  canEdit,
  eventLinkMode,
  isAdmin,
  language,
  linkData,
  selectedEvent,
  selectEvent,
  setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  const { _id: eventId } = selectedEvent;
  if (!eventId) return null;
  if (!linkData) {
    return (
      <div className="ui warning message">
        <Trans>Event link details not found</Trans>
      </div>
    );
  }
  const { _id: linkId, displayName, includes } = linkData;
  const sortedLinkedEventArray = [...includes].sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
  const linkedEventArrayToDisplay = sortedLinkedEventArray.map((linkedEvent) => {
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
  linkData: PropTypes.objectOf(PropTypes.any),
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectEvent: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};
EventLinked.defaultProps = {
  canEdit: false,
  eventLinkMode: 'view',
  isAdmin: false,
  linkData: {},
  selectedEvent: {},
};

export default EventLinked;
