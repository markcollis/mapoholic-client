/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import ResetMapBounds, { getInitialMapBounds } from './leaflet/ResetMapBounds';
import EventLocation from './leaflet/EventLocation';
import { MAP_TILES, MAP_CREDIT } from '../../config';
import { OEvent } from '../../types/event';

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
      <ResetMapBounds selectedEvent={selectedEvent} />
      <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
      <EventLocation currentUserId={currentUserId} selectedEvent={selectedEvent} />
    </MapContainer>
  );
};

export default EventLocationMap;
