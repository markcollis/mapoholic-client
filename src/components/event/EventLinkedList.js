import React from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from '@lingui/macro';
import { reformatDate } from '../../common/conversions';

const EventLinkedList = ({
  linkList,
  setEventViewModeEventLink,
}) => {
  // console.log('linkList in EventLinkedList:', linkList);
  if (linkList.length === 0) return <p><Trans>Sorry, no event links found.</Trans></p>;
  const linkArray = linkList.map((link) => {
    const { _id: eventLinkId, displayName, includes } = link;
    const eventCount = includes.length;
    const eventCountText = (
      <Plural
        value={eventCount}
        one="# event"
        other="# events"
      />
    );
    const eventDates = (eventCount > 0)
      ? includes.map(includedEvent => includedEvent.date).sort()
      : null;
    const dateRange = (eventDates)
      ? ` (${reformatDate(eventDates[0])} - ${reformatDate(eventDates[eventCount - 1])})`
      : null;
    const detailsToDisplay = (
      <span>
        {eventCountText}
        {dateRange}
      </span>
    );
    return (
      <div key={eventLinkId} className="item">
        <div className="content">
          <button
            type="button"
            className="ui red tiny button right floated"
            onClick={() => setEventViewModeEventLink('delete', eventLinkId)}
          >
            <Trans>Delete</Trans>
          </button>
          <button
            type="button"
            className="ui tiny primary button right floated"
            onClick={() => setEventViewModeEventLink('edit', eventLinkId)}
          >
            <Trans>Edit</Trans>
          </button>
          <div className="header">{displayName}</div>
          {detailsToDisplay}
        </div>
      </div>
    );
  });

  return (
    <div className="ui celled list">
      {linkArray}
    </div>
  );
};

EventLinkedList.propTypes = {
  linkList: PropTypes.arrayOf(PropTypes.any).isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedList;
