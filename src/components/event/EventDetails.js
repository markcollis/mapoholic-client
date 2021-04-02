import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { typesOptionsLocale } from '../../common/formData';
import { reformatTimestampDateOnly } from '../../common/conversions';

import EventThumbnails from './EventThumbnails';
import EventLocationMap from './EventLocationMap';
import Collapse from '../generic/Collapse';

// The EventDetails component renders detailed information about a particular event
const EventDetails = ({
  canEdit,
  currentUserId,
  language,
  organisingClubs,
  refreshCollapse,
  requestRefreshCollapse,
  selectedEvent,
  setEventViewModeEvent,
}) => {
  // console.log('selectedEvent in EventDetails:', selectedEvent);
  const { _id: eventId } = selectedEvent;
  if (!eventId) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader"><Trans>Loading event details...</Trans></div>
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
    runners,
    types,
    tags,
    website,
    results,
  } = selectedEvent;
  const ownMapFiles = [];
  const otherMapFiles = [];
  runners.forEach((runner) => {
    const { maps, user } = runner;
    const { _id: runnerId } = user;
    maps.forEach((map) => {
      const {
        course,
        courseUpdated,
        route,
        routeUpdated,
      } = map;
      if (course && course !== '') {
        const mapFile = {
          mapType: 'course',
          file: course,
          updated: courseUpdated,
        };
        if (currentUserId && runnerId === currentUserId) ownMapFiles.push(mapFile);
        else otherMapFiles.push(mapFile);
      } else if (route && route !== '') { // only add route if there is no course
        const mapFile = {
          mapType: 'route',
          file: route,
          updated: routeUpdated,
        };
        if (currentUserId && runnerId === currentUserId) ownMapFiles.push(mapFile);
        else otherMapFiles.push(mapFile);
      }
    });
  });
  // console.log('mapFiles:', ownMapFiles, otherMapFiles);
  const mapFiles = [...ownMapFiles, ...otherMapFiles];

  const showEdit = (canEdit)
    ? (
      <div className="event-details__edit-block">
        <hr className="divider" />
        <div className=""><Trans>{`Owner: ${owner.displayName}`}</Trans></div>
        {(orisId)
          ? <div>{`ORIS ID: ${orisId}`}</div>
          : null}
        <div className="item">
          <Trans>
            {`Created: ${reformatTimestampDateOnly(createdAt.slice(0, 10), language)}`}
          </Trans>
        </div>
        <div className="item">
          <Trans>
            {`Last updated: ${reformatTimestampDateOnly(updatedAt.slice(0, 10), language)}`}
          </Trans>
        </div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setEventViewModeEvent('delete')}>
          <Trans>Delete event</Trans>
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setEventViewModeEvent('edit')}>
          <Trans>Edit event details</Trans>
        </button>
      </div>
    )
    : null;
  const typesOptions = typesOptionsLocale[language];
  const renderTypes = (types && types.length > 0)
    ? (
      <span>
        {types.map((type) => {
          const matchingType = typesOptions.find((el) => el.value === type);
          return <div key={type} className="ui blue label">{matchingType.label}</div>;
        })}
      </span>
    )
    : null;
  const renderTags = (tags && tags.length > 0)
    ? (
      <span className="tags-group">
        {tags.map((tag) => {
          return <div key={tag} className="ui violet label">{tag}</div>;
        })}
      </span>
    )
    : null;
  const regionLabels = (locRegions && locRegions.length > 0)
    ? (
      <span className="tags-group">
        {locRegions.map((region) => {
          return <span key={region} className="ui basic label">{region}</span>;
        })}
      </span>
    )
    : null;
  const locUrl = (locLat && locLong)
    ? `https://www.google.com/maps/@?api=1&map_action=map&center=${locLat},${locLong}&zoom=13&basemap=terrain`
    : null;
  const place = (locPlace && locPlace !== '') ? locPlace : null;
  const country = (locCountry && locCountry !== '') ? locCountry : null;
  const displayEventDetails = (
    <div>
      <EventThumbnails
        key={mapFiles.length} // to reset whenever mapFiles change
        mapFiles={mapFiles}
        requestRefreshCollapse={requestRefreshCollapse}
      />
      <h3 className="header">
        {name}
        <br />
        {reformatTimestampDateOnly(date, language)}
      </h3>
      <div className="ui list event-details">
        {(regionLabels)
          ? (
            <div className="item">
              {regionLabels}
            </div>
          )
          : null}
        {(place || country)
          ? (
            <div className="item">
              <i className="marker icon" />
              <div className="content">
                {(locUrl)
                  ? (
                    <a href={locUrl} target="_blank" rel="noopener noreferrer">
                      {`${place || ''}${(place && country) ? ', ' : ''}${country || ''}`}
                    </a>
                  )
                  : `${place || ''}${(place && country) ? ', ' : ''}${country || ''}`}
              </div>
            </div>
          )
          : null}
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
                {organisingClubs.map((club, index) => {
                  if (!club) return null;
                  const { _id: clubId } = club;
                  if (club.website && club.website !== '') {
                    return (
                      <span key={clubId}>
                        {(index > 0) ? ', ' : ''}
                        <a key={clubId} href={club.website} target="_blank" rel="noopener noreferrer">
                          {`${club.fullName} (${club.shortName})`}
                        </a>
                      </span>
                    );
                  }
                  return `${(index > 0) ? ', ' : ''}${club.fullName} (${club.shortName})`;
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
                <a href={website} target="_blank" rel="noopener noreferrer">
                  <Trans>Event website</Trans>
                </a>
              </div>
            </div>
          )
          : null}
        {(results)
          ? (
            <div className="item">
              <i className="linkify icon" />
              <div className="content">
                <a href={results} target="_blank" rel="noopener noreferrer">
                  <Trans>Results</Trans>
                </a>
              </div>
            </div>
          )
          : null}
        <div>
          {renderTypes}
          {renderTags}
        </div>
        <EventLocationMap selectedEvent={selectedEvent} currentUserId={currentUserId} />
        {showEdit}
      </div>
    </div>
  );
  const title = <Trans>Event details</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title} refreshCollapse={refreshCollapse}>
        {displayEventDetails}
      </Collapse>
    </div>
  );
};

EventDetails.propTypes = {
  canEdit: PropTypes.bool,
  currentUserId: PropTypes.string,
  language: PropTypes.string,
  organisingClubs: PropTypes.arrayOf(PropTypes.any),
  refreshCollapse: PropTypes.number.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventDetails.defaultProps = {
  canEdit: false,
  currentUserId: null,
  language: 'en',
  organisingClubs: [],
  selectedEvent: {},
};

export default EventDetails;
