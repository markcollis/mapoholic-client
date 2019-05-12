import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { typesOptionsLocale } from '../data';
import { reformatDate } from '../../common/conversions';

const EventListItem = ({
  handleSelectEvent,
  language,
  oevent,
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
  const renderTotalRunners = (runners && runners.length > 0)
    ? <span className="ui label circular floatedright">{runners.length}</span>
    : <span className="ui label floatedright"><Trans>none</Trans></span>;

  return (
    <div
      className="ui fluid centered card"
      role="button"
      onClick={() => handleSelectEvent(eventId)}
      onKeyPress={() => handleSelectEvent(eventId)}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">{`${reformatDate(date)} - ${name}`}</div>
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
  language: PropTypes.string.isRequired,
  oevent: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSelectEvent: PropTypes.func.isRequired,
};

export default EventListItem;
