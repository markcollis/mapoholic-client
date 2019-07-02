import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { typesOptionsLocale } from '../../common/data';
import { reformatTimestampDateOnly } from '../../common/conversions';
import { MAPOHOLIC_SERVER } from '../../config';

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
        // console.log('runner:', runner);
        currentRunnerTags.push(...runner.tags);
      }
    });
  }
  const extractUrl = (mapExtractToDisplay)
    ? `${MAPOHOLIC_SERVER}/${mapExtractToDisplay}`
    : null;
  const cardStyle = (mapExtractToDisplay)
    ? (
      {
        backgroundImage: `url(${extractUrl})`,
        backgroundSize: 'cover',
      }
    )
    : {};
  const cardClass = (selectedEventId === eventId)
    ? 'ui fluid centered card item-selected'
    : 'ui fluid centered card';
  const textClass = (mapExtractToDisplay)
    ? 'event-list-text'
    : '';

  const place = (locPlace && locPlace !== '') ? locPlace : null;
  const country = (locCountry && locCountry !== '') ? locCountry : null;
  const renderPlace = (place || country)
    ? (
      <div>
        <span className={textClass}>
          <Trans>Place</Trans>
          {`: ${place || ''}${(place && country) ? ', ' : ''}${country || ''}`}
        </span>
      </div>
    )
    : null;
  const renderMapName = (mapName && mapName !== '')
    ? (
      <div>
        <span className={textClass}>
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
      <div className="content">
        <div className="header">
          <span className={textClass}>{`${reformatTimestampDateOnly(date, language)} - ${name}`}</span>
        </div>
        <div className="meta">
          {renderPlace}
          {renderMapName}
          <div className="list-item-tags">
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
  language: PropTypes.string.isRequired,
  oevent: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSelectEvent: PropTypes.func.isRequired,
  selectedEventId: PropTypes.string.isRequired,
};
EventListItem.defaultProps = {
  currentUserId: null,
};

export default EventListItem;
