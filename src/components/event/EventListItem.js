import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { typesOptionsLocale } from '../data';

const EventListItem = ({
  language,
  oevent,
  selectEventForDetails,
  setEventViewModeEvent,
}) => {
  const {
    _id: eventId,
    date,
    name,
    mapName,
    locPlace,
    locCountry,
    organisedBy,
    totalRunners,
    types,
    tags,
  } = oevent;
  const reformattedDate = date.slice(8)
    .concat('/')
    .concat(date.slice(5, 7))
    .concat('/')
    .concat(date.slice(0, 4));
  const typesOptions = typesOptionsLocale[language];
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
  const renderTotalRunners = (totalRunners > 0)
    ? <span className="ui label circular floatedright">{totalRunners}</span>
    : <span className="ui label floatedright"><Trans>none</Trans></span>;

  return (
    <div
      className="ui fluid centered card"
      role="button"
      onClick={() => {
        selectEventForDetails(eventId);
        setEventViewModeEvent('view');
      }}
      onKeyPress={() => {
        selectEventForDetails(eventId);
        setEventViewModeEvent('view');
      }}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">{`${reformattedDate} - ${name}`}</div>
        <div className="meta">
          <div>
            <Trans>Place</Trans>
            {`: ${locPlace}, ${locCountry}`}
          </div>
          <p>
            <Trans>Map</Trans>
            {`: ${mapName}`}
          </p>
          {renderOrganisedBy}
          {renderTypes}
          {renderTags}
          {renderTotalRunners}
        </div>
      </div>
    </div>
  );
};

EventListItem.propTypes = {
  language: PropTypes.string,
  oevent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventListItem.defaultProps = {
  language: 'en',
};

export default EventListItem;
