import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventDetails = ({
  selectedEvent,
  organisingClubs,
  canEdit,
  setEventViewModeEvent,
}) => {
  if (!selectedEvent._id) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader">Loading event details...</div>
      </div>
    );
  }
  const {
    owner,
    orisId,
    createdAt,
    updatedAt,
    date,
    name,
    mapName,
    locPlace,
    locRegions,
    locCountry,
    locLat,
    locLong,
    types,
    tags,
    website,
    results,
  } = selectedEvent;
  const showEdit = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <div className="">{`Owner: ${owner.displayName}`}</div>
        {(orisId)
          ? <div>{`ORIS ID: ${orisId}`}</div>
          : null}
        <div className="item">{`Created: ${createdAt.slice(0, 10)}`}</div>
        <div className="item">{`Last updated: ${updatedAt.slice(0, 10)}`}</div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setEventViewModeEvent('delete')}>
          Delete event
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setEventViewModeEvent('edit')}>
          Edit event details
        </button>
      </div>
    )
    : null;
  const reformattedDate = date.slice(8)
    .concat('/')
    .concat(date.slice(5, 7))
    .concat('/')
    .concat(date.slice(0, 4));
  const renderTypes = (types && types.length > 0)
    ? (
      <span>
        {types.map((type) => {
          return <div key={type} className="ui blue label">{type}</div>;
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
  const regionLabels = (locRegions && locRegions.length > 0)
    ? (
      locRegions.map((region) => {
        return <span key={region} className="ui basic label">{region}</span>;
      })
    )
    : null;
  const locUrl = (locLat && locLong)
    ? `https://www.google.com/maps/@?api=1&map_action=map&center=${locLat},${locLong}&zoom=13&basemap=terrain`
    : null;
  const displayEventDetails = (
    <div>
      <h3 className="header">
        {name}
        <br />
        {reformattedDate}
      </h3>
      <div className="ui list event-details">
        {(regionLabels)
          ? (
            <div className="item">
              {regionLabels}
            </div>
          )
          : null}
        {(locUrl)
          ? (
            <div className="item">
              <i className="marker icon" />
              <div className="content">
                <a href={locUrl} target="_blank" rel="noopener noreferrer">
                  {`${locPlace}, ${locCountry}`}
                </a>
              </div>
            </div>
          )
          : (
            <div className="item">
              <i className="marker icon" />
              <div className="content">
                {`${locPlace}, ${locCountry}`}
              </div>
            </div>
          )}
        {(mapName)
          ? (
            <div className="item">
              <i className="map outline icon" />
              <div className="content">
                {mapName}
              </div>
            </div>
          )
          : null}
        {(organisingClubs.length > 0)
          ? (
            <div className="item">
              <i className="users icon" />
              <div className="content">
                {organisingClubs.map((club) => {
                  if (!club) return null;
                  if (club.website && club.website !== '') {
                    return (
                      <a key={club._id} href={club.website} target="_blank" rel="noopener noreferrer">
                        {`${club.fullName} (${club.shortName})`}
                      </a>
                    );
                  }
                  return `${club.fullName} (${club.shortName})`;
                })}
              </div>
            </div>
          )
          : null}
        {(website)
          ? (
            <div className="item">
              <i className="linkify icon" />
              <div className="content">
                <a href={website} target="_blank" rel="noopener noreferrer">Event website</a>
              </div>
            </div>
          )
          : null}
        {(results)
          ? (
            <div className="item">
              <i className="linkify icon" />
              <div className="content">
                <a href={results} target="_blank" rel="noopener noreferrer">Results</a>
              </div>
            </div>
          )
          : null}
        <div>
          {renderTypes}
          {renderTags}
        </div>
        {showEdit}
      </div>
    </div>
  );
  return (
    <div className="ui segment">
      <Collapse title="Event details">
        {displayEventDetails}
      </Collapse>
    </div>
  );
};

EventDetails.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  organisingClubs: PropTypes.arrayOf(PropTypes.any),
  canEdit: PropTypes.bool,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventDetails.defaultProps = {
  selectedEvent: {},
  organisingClubs: [],
  canEdit: false,
};

export default EventDetails;
