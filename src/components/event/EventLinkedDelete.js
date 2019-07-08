import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestampDateOnly } from '../../common/conversions';

const EventLinkedDelete = ({
  deleteEventLink,
  // getEventList,
  // getEventLinkList,
  language,
  linkData,
  setEventViewModeEventLink,
}) => {
  const { _id: eventLinkId, displayName, includes } = linkData;
  const eventListToDisplay = includes.map((includedEvent) => {
    const { name, date } = includedEvent;
    return (
      <li key={name.concat(date)}>{`${name} (${reformatTimestampDateOnly(date, language)})`}</li>
    );
  });
  return (
    <div>
      <h4><Trans>{`Are you sure you want to delete "${displayName}"?`}</Trans></h4>
      <p><Trans>It links the following events:</Trans></p>
      <ul>{eventListToDisplay}</ul>
      <button
        type="button"
        className="ui tiny red button"
        onClick={() => {
          deleteEventLink(eventLinkId, (didSucceed) => {
            if (didSucceed) {
              setEventViewModeEventLink('view');
              // getEventList(null, () => { // want to eliminate this using reducer
              //   getEventLinkList(); // want to eliminate this using reducer
              // });
            }
          });
        }}
      >
        <Trans>Delete</Trans>
      </button>
      <button
        type="button"
        className="ui tiny button right floated"
        onClick={() => setEventViewModeEventLink('view')}
      >
        <Trans>Cancel</Trans>
      </button>
    </div>
  );
};

EventLinkedDelete.propTypes = {
  deleteEventLink: PropTypes.func.isRequired,
  // getEventList: PropTypes.func.isRequired,
  // getEventLinkList: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  linkData: PropTypes.objectOf(PropTypes.any).isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedDelete;
