/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Popup,
} from 'react-leaflet';
import EventListItem from '../EventListItem';
import ResetMapBoundsGroup from './ResetMapBoundsGroup';
import EventLocation from './EventLocation';
import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEventPosition, OEventSummary } from '../../../types/event';

const DEFAULT_MAP_BOUNDS: OEventPosition[] = [[50, 14], [50.2, 14.2]];

interface EventMapProps {
  currentUserId?: string;
  events?: OEventSummary[];
  handleSelectEvent: (eventId: string) => void;
  language: string;
  mapBounds?: OEventPosition[];
  setMapBounds: (mapBounds: OEventPosition[]) => void;
}

const EventMap: FunctionComponent<EventMapProps> = ({
  currentUserId,
  events = [],
  handleSelectEvent,
  language,
  mapBounds,
  // setMapBounds,
}) => {
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

// componentWillUnmount() {
//   const { setMapBounds } = this.props;
//   if (this.mapRef.current) {
//     const leafletMap = this.mapRef.current;
//     const currentBounds = leafletMap.getBounds();
//     const { _southWest: sw, _northEast: ne } = currentBounds;
//     const currentBoundsAsArray = [[sw.lat, sw.lng], [ne.lat, ne.lng]];
//     setMapBounds(currentBoundsAsArray);
//   }
// }
