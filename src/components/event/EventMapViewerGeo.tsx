/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';

import EventViewerGeoMap from './leaflet/EventViewerGeoMap';
import { OEvent } from '../../types/event';

interface EventMapViewerGeoProps {
  selectedEvent: OEvent;
  selectedRunner: string;
}

const EventMapViewerGeo: FunctionComponent<EventMapViewerGeoProps> = ({
  selectedEvent,
  selectedRunner,
}) => {
  return (
    <div className="event-map-viewer-geo">
      <h3>{selectedEvent.name}</h3>
      <p>{selectedRunner}</p>
      <EventViewerGeoMap
        selectedEvent={selectedEvent}
        runnerId={selectedRunner}
      />
      <p>Features to add</p>
      <ul>
        <li>Overlay all scanned maps on Leaflet/OSM</li>
        <li>Simple distortion (corners) for best fit - need to extend data model to store this</li>
        <li>Display tracks (hotlines, configurable)</li>
        <li>Choose which of several maps/tracks are shown</li>
      </ul>
    </div>
  );
};

export default EventMapViewerGeo;
