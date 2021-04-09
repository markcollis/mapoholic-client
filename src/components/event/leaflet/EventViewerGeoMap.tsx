/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  // ImageOverlay,
} from 'react-leaflet';
import { LatLng } from 'leaflet';
import Distortable from './Distortable';

import TrackWaypoints from './TrackWaypoints';

import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEvent, OEventPosition, OEventCorners } from '../../../types/event';
import { derivePolygonBoundsFromEvent } from './getPolygonBounds';

// array of L.latLng objects in NW, NE, SW, SE order (in a "Z" shape)
const getDistortableCorners = (corners: OEventCorners): LatLng[] => ([
  new LatLng(corners.nw.lat, corners.nw.long),
  new LatLng(corners.ne.lat, corners.ne.long),
  new LatLng(corners.sw.lat, corners.sw.long),
  new LatLng(corners.se.lat, corners.se.long),
]);

interface EventViewerGeoMapProps {
  runnerId: string;
  selectedEvent: OEvent;
}

// simple map to show the location of a single event
const EventViewerGeoMap: FunctionComponent<EventViewerGeoMapProps> = ({
  runnerId,
  selectedEvent,
}) => {
  const {
    locLat,
    locLong,
  } = selectedEvent;
  if (!locLat || !locLong) return <p>Sorry, we don&apos;t know where this event is...</p>;
  const initialMapBounds: OEventPosition[] = [
    [locLat - 0.01, locLong - 0.01],
    [locLat + 0.01, locLong + 0.01],
  ];

  const polygonBounds = derivePolygonBoundsFromEvent(selectedEvent, runnerId);
  const polygon = (
    <Polygon
      positions={polygonBounds}
      pathOptions={{ color: 'blue' }}
    />
  );

  const matchingRunner = selectedEvent.runners.find(({ user: { _id } }) => _id === runnerId);
  const matchingMaps = (matchingRunner && matchingRunner.maps) || [];

  const trackData = matchingMaps
    .map((map) => ((map.geo && map.geo.track) ? map.geo.track : []))
    .filter((track) => track.length > 0);
  /* eslint-disable react/no-array-index-key */
  const route = trackData.map((track, index) => {
    if (track.length === 0) return null;
    return (
      <TrackWaypoints
        key={index}
        track={track}
      />
    );
  });

  console.log('matchingMaps', matchingMaps);
  const mapsWithImages = matchingMaps.filter((map) => map.course); // want course not route
  const mapImages = mapsWithImages.map((map) => {
    if (map.geo && map.geo.imageCorners) {
      return (
        <Distortable
          key={map.course}
          url={map.course}
          corners={getDistortableCorners(map.geo.imageCorners)}
        />
      );
    }
    return <Distortable url={map.course} />;
  });

  return (
    <MapContainer
      id="EventViewerGeoMap"
      className="event-viewer-geo-map"
      bounds={initialMapBounds} // this prop will not reset map if selected event changes
    >
      <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
      {polygon}
      {route}
      {mapImages}
    </MapContainer>
  );
};

export default EventViewerGeoMap;
