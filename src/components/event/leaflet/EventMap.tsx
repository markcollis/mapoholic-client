/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Popup,
} from 'react-leaflet';
import { Map, LatLngBounds } from 'leaflet';
import EventListItem from '../EventListItem';
import ResetMapBoundsGroup from './ResetMapBoundsGroup';
import EventLocation from './EventLocation';
import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEventPosition, OEventSummary } from '../../../types/event';

const DEFAULT_MAP_BOUNDS: OEventPosition[] = [[49.5, 14], [50.5, 15]];
// sensible default for Prague, should probably be user-configurable

interface EventMapProps {
  currentUserId?: string;
  events?: OEventSummary[];
  handleSelectEvent: (eventId: string) => void;
  language: string;
  mapBounds?: LatLngBounds;
  setMapBounds: (mapBounds: LatLngBounds) => void;
}

const EventMap: FunctionComponent<EventMapProps> = ({
  currentUserId,
  events = [],
  handleSelectEvent,
  language,
  mapBounds,
  setMapBounds,
}) => {
  const mapRef = useRef<Map>();
  useEffect(() => {
    return () => {
      const finalMapBounds = mapRef.current?.getBounds();
      if (finalMapBounds) setMapBounds(finalMapBounds);
    };
  }, []);
  const eventsWithLocation = events
    .filter((eventDetails) => eventDetails.locLat && eventDetails.locLong);
  // console.log('eventsWithLocation', eventsWithLocation);
  const eventsGroupedByLocation: { [key: string]: OEventSummary[] } = {};
  eventsWithLocation.forEach((event) => {
    const locKey = `${event.locLat && event.locLat.toFixed(3)}:${event.locLong && event.locLong.toFixed(3)}`;
    if (eventsGroupedByLocation[locKey]) {
      eventsGroupedByLocation[locKey].push(event);
    } else {
      eventsGroupedByLocation[locKey] = [event];
    }
  });
  // console.log('eventsGroupedByLocation', eventsGroupedByLocation);
  const leafletGroupedMapLocations = Object.keys(eventsGroupedByLocation).map((locKey) => {
    const eventDetailsArray = eventsGroupedByLocation[locKey];
    const eventListItemArray = eventDetailsArray.map((eventDetails) => (
      <EventListItem
        key={eventDetails._id}
        currentUserId={currentUserId}
        handleSelectEvent={handleSelectEvent}
        language={language}
        oevent={eventDetails}
        selectedEventId={eventDetails._id}
      />
    ));
    const popup = <Popup className="event-map__popup">{eventListItemArray}</Popup>;
    const eventBasicDetailsArray = eventDetailsArray.map((eventDetails) => {
      return <li key={eventDetails._id}>{`${eventDetails.date} - ${eventDetails.name}`}</li>;
    });
    const tooltip = (
      <Tooltip
        direction="right"
        offset={[20, 0]}
        className="event-map__tooltip"
      >
        <ul>
          {eventBasicDetailsArray}
        </ul>
        <p>click for more details and to select</p>
      </Tooltip>
    );
    return eventDetailsArray.map((eventDetails) => (
      <EventLocation
        key={eventDetails._id}
        currentUserId={currentUserId || ''}
        selectedEvent={eventDetails}
      >
        {popup}
        {tooltip}
      </EventLocation>
    ));
  });

  return (
    <div className="ui segment">
      <MapContainer
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        bounds={mapBounds || DEFAULT_MAP_BOUNDS}
      >
        <ResetMapBoundsGroup events={events} />
        <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
        {leafletGroupedMapLocations}
      </MapContainer>
    </div>
  );
};

export default EventMap;
