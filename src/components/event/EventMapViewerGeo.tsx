/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { LatLng } from 'leaflet';

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
  const [triggerSelect, setTriggerSelect] = useState(0);
  const [triggerUpdateCorners, setTriggerUpdateCorners] = useState(0);
  const [triggerResetCorners, setTriggerResetCorners] = useState(0);
  const [corners, setCorners] = useState<LatLng[]>([]);
  console.log('corners in EvGeoMap', corners);

  const handleTriggerSelect = () => {
    setTriggerSelect(triggerSelect + 1);
  };

  const handleTriggerUpdateCorners = () => {
    setTriggerUpdateCorners(triggerUpdateCorners + 1);
  };

  const handleTriggerResetCorners = () => {
    setTriggerResetCorners(triggerResetCorners + 1);
  };

  const handleUpdateCorners = (updatedCorners: LatLng[]): void => {
    setCorners(updatedCorners);
  };

  return (
    <div className="event-map-viewer-geo ui grid">
      <div className="eight wide column">
        <EventViewerGeoMap
          selectedEvent={selectedEvent}
          runnerId={selectedRunner}
          triggerSelect={triggerSelect}
          triggerUpdateCorners={triggerUpdateCorners}
          triggerResetCorners={triggerResetCorners}
          updateCorners={handleUpdateCorners}
        />
      </div>
      <div className="event-map-viewer-geo-right-panel eight wide column">
        <h3>{selectedEvent.name}</h3>
        <p>{selectedRunner}</p>
        <button type="button" onClick={handleTriggerSelect}>select</button>
        <button type="button" onClick={handleTriggerUpdateCorners}>update corners</button>
        <button type="button" onClick={handleTriggerResetCorners}>reset corners</button>
        <p>Corners:</p>
        <p>{JSON.stringify(corners)}</p>

        <p>Features to add</p>
        <ul>
          <li>Overlay all scanned maps on Leaflet/OSM</li>
          <li>Simple distortion (corners) for best fit - use imageCorners as is?</li>
          <li>Display tracks (hotlines, configurable)</li>
          <li>Choose which of several maps/tracks are shown</li>
        </ul>
      </div>
    </div>
  );
};

export default EventMapViewerGeo;
