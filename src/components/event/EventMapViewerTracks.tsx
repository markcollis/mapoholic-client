/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';

import { OEvent, OEventMap } from '../../types/event';

interface EventMapViewerTracksProps {
  selectedEvent: OEvent;
  selectedRunner: string;
  updateEventRunner: (eventId: string, userId: string, maps: OEventMap[]) => void;
}

const EventMapViewerTracks: FunctionComponent<EventMapViewerTracksProps> = ({
  selectedEvent,
  selectedRunner,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  updateEventRunner, // hopefully this can update geo.tracks? need to check API
}) => {
  return (
    <div className="event-map-viewer-tracks">
      <h3>{selectedEvent.name}</h3>
      <p>{selectedRunner}</p>
      <p>Features to add</p>
      <ul>
        <li>List maps/tracks with basic stats (type, length, waypoint count)</li>
        <li>Support upload (GPX)</li>
        <li>Trim or delete existing tracks?</li>
        <li>Charts - speed, HR, etc. with either distance or time as X axis</li>
        <li>Add/edit split times (will need data model extension) - is ORIS import possible?</li>
        <li>Exploit split times: e.g. min/km column, distance and climb per leg</li>
      </ul>
    </div>
  );
};

export default EventMapViewerTracks;
