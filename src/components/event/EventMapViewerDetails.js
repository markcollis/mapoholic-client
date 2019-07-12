import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventMapViewerEdit from './EventMapViewerEdit';

const EventMapViewerDetails = ({
  deleteMap,
  postMap,
  selectedEvent,
  selectedRunner,
  updateEventRunner,
}) => {
  // console.log('selectedEvent in EventMapViewerDetails', selectedEvent);
  const { _id: eventId, runners } = selectedEvent;
  const selectedRunnerDetails = (runners)
    ? runners.find((runner) => {
      const { user } = runner;
      const { _id: runnerId } = user;
      return (runnerId === selectedRunner);
    })
    : null;
  const selectedRunnerMaps = (selectedRunnerDetails) ? selectedRunnerDetails.maps : [];
  const mapViewerEditArray = selectedRunnerMaps.map((map) => {
    const {
      title,
    } = map;
    return (
      <EventMapViewerEdit
        key={title}
        deleteMap={deleteMap}
        eventId={eventId}
        map={map}
        postMap={postMap}
        selectedRunnerMaps={selectedRunnerMaps}
        updateEventRunner={updateEventRunner}
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
        selectedRunnerMaps={selectedRunnerMaps}
        updateEventRunner={() => {}} // no title to update if no map yet
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
};

export default EventMapViewerDetails;
