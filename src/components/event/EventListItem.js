import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { typesOptionsLocale } from '../../common/data';
import { reformatDate } from '../../common/conversions';
import { OMAPFOLDER_SERVER } from '../../config';

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
  let mapExtractToDisplay = null;
  if (runners && runners.length > 0) {
    runners.forEach((runner) => {
      if (!mapExtractToDisplay && runner.mapExtract) {
        mapExtractToDisplay = runner.mapExtract;
      }
    });
  }
  const extractUrl = (mapExtractToDisplay)
    ? `${OMAPFOLDER_SERVER}/${mapExtractToDisplay}`
    : null;
  const cardStyle = (mapExtractToDisplay)
    ? (
      {
        backgroundImage: `url(${extractUrl})`,
        backgroundSize: 'cover',
      }
    )
    : {};
  const textClassName = (mapExtractToDisplay)
    ? 'event-list-text'
    : '';
  // const renderExtract = (mapExtractToDisplay)
  //   ? (
  //     <img
  //       className="ui image"
  //       alt="map extract"
  //       src={`${OMAPFOLDER_SERVER}/${mapExtractToDisplay}`}
  //     />
  //   )
  //   : null;

  return (
    <div
      className="ui fluid centered card"
      role="button"
      style={cardStyle}
      onClick={() => handleSelectEvent(eventId)}
      onKeyPress={() => handleSelectEvent(eventId)}
      tabIndex="0"
    >
      <div className="content">
        <div className="header"><span className={textClassName}>{`${reformatDate(date)} - ${name}`}</span></div>
        <div className="meta">
          <div>
            <span className={textClassName}>
              <Trans>Place</Trans>
              {`: ${locPlace}, ${locCountry}`}
            </span>
          </div>
          <p>
            <span className={textClassName}>
              <Trans>Map</Trans>
              {`: ${mapName}`}
            </span>
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
