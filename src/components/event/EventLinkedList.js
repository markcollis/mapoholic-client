import React from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from '@lingui/macro';
import { reformatTimestampDateOnly } from '../../common/conversions';

// The EventLinkedList component renders a list of event links from which one
// can be selected for viewing
const EventLinkedList = ({
  isAdmin,
  language,
  linkList,
  setEventViewModeEventLink,
}) => {
  if (linkList.length === 0) return <p><Trans>Sorry, no event links found.</Trans></p>;
  const linkArray = linkList
    .map((link) => { // process event summary data
      const { includes } = link;
      const eventCount = includes.length;
      const eventDates = (eventCount > 0)
        ? includes.map(includedEvent => includedEvent.date).sort()
        : null;
      const dateRange = (eventDates)
        ? ` (${reformatTimestampDateOnly(eventDates[0], language)} - ${reformatTimestampDateOnly(eventDates[eventCount - 1], language)})`
        : null;
      return {
        ...link,
        eventCount,
        eventDates,
        dateRange,
      };
    })
    .sort((a, b) => { // sort by name (consider option to sort by date later)
      return a.displayName.localeCompare(b.displayName, language);
      // return b.eventDates[0].localeCompare(a.eventDates[0]); // most recent first
    })
    .map((link) => { // generate elements to render
      const {
        _id: eventLinkId,
        dateRange,
        displayName,
        eventCount,
      } = link;
      const eventCountText = (
        <Plural
          value={eventCount}
          one="# event"
          other="# events"
        />
      );
      const detailsToDisplay = (
        <span>
          {eventCountText}
          {dateRange}
        </span>
      );
      return (
        <div key={eventLinkId} className="item">
          <div className="content">
            {(isAdmin) // only administrators are able to delete event links
              ? (
                <button
                  type="button"
                  className="ui red tiny button right floated"
                  onClick={() => setEventViewModeEventLink('delete', eventLinkId)}
                >
                  <Trans>Delete</Trans>
                </button>
              )
              : null}
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
    <div className="ui celled list event-linked-list">
      {linkArray}
    </div>
  );
};

EventLinkedList.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  linkList: PropTypes.arrayOf(PropTypes.any).isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedList;
