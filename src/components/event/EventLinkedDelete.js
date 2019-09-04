import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestampDateOnly } from '../../common/conversions';

// The EventLinkedDelete component renders a confirmation dialogue for deleting an event link
const EventLinkedDelete = ({
  deleteEventLink,
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
  language: PropTypes.string.isRequired,
  linkData: PropTypes.objectOf(PropTypes.any).isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedDelete;
