import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import { typesOptionsLocale } from '../../common/formData';
import { reformatTimestampDateOnly } from '../../common/conversions';
import missingMapExtract from '../../graphics/missingMapExtract.jpg';

// The EventListItem component renders key information about an event as a selectable list item
const EventListItem = ({
  currentUserId,
  handleSelectEvent,
  language,
  oevent,
  selectedEventId,
}) => {
  const {
    _id: eventId,
    date,
    name,
    mapName,
    locPlace,
    locCountry,
    organisedBy,
    runners,
    types,
    tags,
  } = oevent;
  const typesOptions = typesOptionsLocale[language];
  let mapExtractToDisplay = null;
  const currentRunnerTags = [];
  if (runners && runners.length > 0) {
    runners.forEach((runner) => {
      if (!mapExtractToDisplay && runner.mapExtract) {
        mapExtractToDisplay = runner.mapExtract;
      }
      if (runner.user === currentUserId) {
        currentRunnerTags.push(...runner.tags);
      }
    });
  }
  const cardStyle = (mapExtractToDisplay)
    ? (
      {
        backgroundImage: `url(${mapExtractToDisplay}), url(${missingMapExtract})`,
        backgroundSize: 'cover',
      }
    )
    : {};
  const cardClass = (selectedEventId === eventId)
    ? 'ui fluid centered card card-list--item-selected'
    : 'ui fluid centered card';
  const contentClass = (mapExtractToDisplay)
    ? 'content event-list-item__with-map'
    : 'content';

  const place = (locPlace && locPlace !== '') ? locPlace : null;
  const country = (locCountry && locCountry !== '') ? locCountry : null;
  const renderPlace = (place || country)
    ? (
      <div>
        <span className="event-list-item--text">
          <Trans>Place</Trans>
          {`: ${place || ''}${(place && country) ? ', ' : ''}${country || ''}`}
        </span>
      </div>
    )
    : null;
  const renderMapName = (mapName && mapName !== '')
    ? (
      <div>
        <span className="event-list-item--text">
          <Trans>Map</Trans>
          {`: ${mapName}`}
        </span>
      </div>
    )
    : null;
  const renderOrganisedBy = (organisedBy && organisedBy.length > 0)
    ? (
      <span>
        {organisedBy.map((club) => {
          const { _id: clubId, shortName } = club;
          return <div key={clubId} className="ui teal label">{shortName}</div>;
        })}
      </span>
    )
    : null;
  const renderTypes = (types && types.length > 0)
    ? (
      <span>
        {types.map((type) => {
          const matchingType = typesOptions.find(el => el.value === type);
          return <div key={type} className="ui blue label">{matchingType.label}</div>;
        })}
      </span>
    )
    : null;
  const renderTags = (tags && tags.length > 0)
    ? (
      <span>
        {tags.map((tag) => {
          return <div key={tag} className="ui violet label">{tag}</div>;
        })}
      </span>
    )
    : null;
  const renderRunnerTags = (currentRunnerTags && currentRunnerTags.length > 0)
    ? (
      <span>
        {currentRunnerTags.map((tag) => {
          return <div key={tag} className="ui purple label">{tag}</div>;
        })}
      </span>
    )
    : null;
  const renderTotalRunners = (runners && runners.length > 0)
    ? (
      <span className="floatedright">
        <div className="ui label black circular">{runners.length}</div>
      </span>
    )
    : (
      <span className="floatedright">
        <div className="ui label black"><Trans>none</Trans></div>
      </span>
    );
  return (
    <div
      className={cardClass}
      role="button"
      style={cardStyle}
      onClick={() => handleSelectEvent(eventId)}
      onKeyPress={() => handleSelectEvent(eventId)}
      tabIndex="0"
    >
      <div className={contentClass}>
        <div className="header">
          <span className="event-list-item--text">
            {`${reformatTimestampDateOnly(date, language)} - ${name}`}
          </span>
        </div>
        <div className="meta">
          {renderPlace}
          {renderMapName}
          <div className="tags-group">
            {renderOrganisedBy}
            {renderTypes}
            {renderTags}
            {renderRunnerTags}
            {renderTotalRunners}
          </div>
        </div>
      </div>
    </div>
  );
};

EventListItem.propTypes = {
  currentUserId: PropTypes.string,
  handleSelectEvent: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  oevent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedEventId: PropTypes.string.isRequired,
};
EventListItem.defaultProps = {
  currentUserId: null,
};

export default EventListItem;
