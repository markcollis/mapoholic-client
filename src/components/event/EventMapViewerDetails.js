import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventMapViewerEdit from './EventMapViewerEdit';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const EventMapViewerDetails = ({
  deleteMap,
  postMap,
  selectedEvent,
  selectedRunner,
  updateEventRunner,
  updateMapImageArray,
}) => {
  const eventId = selectedEvent._id;
  const selectedRunnerMaps = (eventId)
    ? selectedEvent.runners.find(runner => runner.user._id === selectedRunner).maps
    : [];
  const mapViewerEditArray = selectedRunnerMaps.map((map) => {
    const {
      title,
      course,
      route,
    } = map;
    return (
      <EventMapViewerEdit
        key={title}
        courseImg={course}
        deleteMap={deleteMap}
        eventId={eventId}
        mapTitle={title}
        postMap={postMap}
        routeImg={route}
        selectedRunnerMaps={selectedRunnerMaps}
        updateEventRunner={updateEventRunner}
        updateMapImageArray={updateMapImageArray}
        userId={selectedRunner}
      />
    );
  });
  if (eventId) {
    mapViewerEditArray.push(
      <EventMapViewerEdit
        key="newMapToBeAdded"
        deleteMap={deleteMap}
        eventId={eventId}
        postMap={postMap}
        updateMapImageArray={updateMapImageArray}
        userId={selectedRunner}
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
  deleteMap: PropTypes.func.isRequired,
  postMap: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedRunner: PropTypes.string.isRequired,
  updateEventRunner: PropTypes.func.isRequired,
  updateMapImageArray: PropTypes.func.isRequired,
};

export default EventMapViewerDetails;
