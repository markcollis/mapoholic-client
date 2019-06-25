import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestampDateOnly } from '../../common/conversions';

const EventLinkedDelete = ({
  deleteEventLink,
  getEventById,
  getEventList,
  getEventLinkList,
  language,
  linkDetails,
  selectedEventDetails,
  selectedEventDisplay,
  selectedEventLink,
  setEventViewModeEventLink,
}) => {
  if (!selectedEventLink) return null;
  const selectedEventLinkDetails = linkDetails[selectedEventLink];
  const { _id: eventLinkId, displayName, includes } = selectedEventLinkDetails;
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
              // re-fetch full details to capture changes to event links
              if (selectedEventDetails !== '') getEventById(selectedEventDetails);
              if (selectedEventDisplay !== '' && selectedEventDisplay !== selectedEventDetails) {
                getEventById(selectedEventDisplay);
              }
              getEventList(null, () => {
                setEventViewModeEventLink('view');
                getEventLinkList();
              });
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
  getEventById: PropTypes.func.isRequired,
  getEventList: PropTypes.func.isRequired,
  getEventLinkList: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  linkDetails: PropTypes.objectOf(PropTypes.any),
  selectedEventDetails: PropTypes.string,
  selectedEventDisplay: PropTypes.string,
  selectedEventLink: PropTypes.string,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};
EventLinkedDelete.defaultProps = {
  linkDetails: {},
  selectedEventDetails: '',
  selectedEventDisplay: '',
  selectedEventLink: null,
};

export default EventLinkedDelete;
