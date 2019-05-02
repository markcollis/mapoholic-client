import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventMapViewerEdit from './EventMapViewerEdit';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const EventMapViewerDetails = ({
  selectedEvent,
  selectedRunner,
  mapTitleList,
  postMap,
  deleteMap,
  updateMapImageArray,
}) => {
  const eventId = selectedEvent._id;
  const selectedRunnerMaps = (eventId)
    ? selectedEvent.runners.find(runner => runner.user._id === selectedRunner).maps
    : [];
  // console.log('selectedEvent in EventMapViewerDetails:', selectedEvent);
  // console.log('selectedRunner in EventMapViewerDetails:', selectedRunner);
  // console.log('selectedRunnerMaps in EventMapViewerDetails:', selectedRunnerMaps);
  const mapViewerEditArray = selectedRunnerMaps.map((map) => {
    const {
      title,
      course,
      route,
    } = map;
    return (
      <EventMapViewerEdit
        key={title}
        eventId={eventId}
        userId={selectedRunner}
        mapTitle={title}
        courseImg={course}
        routeImg={route}
        postMap={postMap}
        deleteMap={deleteMap}
        updateMapImageArray={updateMapImageArray}
      />
    );
  });
  if (eventId) {
    mapViewerEditArray.push(
      <EventMapViewerEdit
        key="newMapToBeAdded"
        eventId={eventId}
        userId={selectedRunner}
        mapTitleList={mapTitleList}
        postMap={postMap}
        deleteMap={deleteMap}
        updateMapImageArray={updateMapImageArray}
      />,
    );
  }

  return (
    <div className="ui segment">
      <h3 className="header"><Trans>Add or change maps</Trans></h3>
      {mapViewerEditArray}
    </div>
  );
};

EventMapViewerDetails.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedRunner: PropTypes.string.isRequired,
  mapTitleList: PropTypes.arrayOf(PropTypes.string),
  postMap: PropTypes.func.isRequired,
  deleteMap: PropTypes.func.isRequired,
  updateMapImageArray: PropTypes.func.isRequired,
};
EventMapViewerDetails.defaultProps = {
  mapTitleList: [],
};

export default EventMapViewerDetails;
