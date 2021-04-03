/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import ResetMapBounds, { getInitialMapBounds } from './ResetMapBounds';
import ZoomLevelDetection from './ZoomLevelDetection';
import EventLocation from './EventLocation';
import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEvent } from '../../../types/event';

interface EventLocationMapProps {
  currentUserId: string;
  selectedEvent: OEvent;
}

// simple map to show the location of a single event
const EventLocationMap: FunctionComponent<EventLocationMapProps> = ({
  currentUserId,
  selectedEvent,
}) => {
  const initialMapBounds = getInitialMapBounds(selectedEvent);
  return (
    <MapContainer
      className="event-location-map"
      bounds={initialMapBounds} // this prop will not reset map if selected event changes
    >
      <ResetMapBounds selectedEvent={selectedEvent}>
        <ZoomLevelDetection>
          <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
          <EventLocation currentUserId={currentUserId} selectedEvent={selectedEvent} />
        </ZoomLevelDetection>
      </ResetMapBounds>
    </MapContainer>
  );
};

export default EventLocationMap;
