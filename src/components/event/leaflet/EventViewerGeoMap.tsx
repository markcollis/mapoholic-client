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
const getDistortableCornersFromPolygonBounds = (bounds: OEventPosition[]): LatLng[] => ([
  new LatLng(bounds[0][0], bounds[0][1]),
  new LatLng(bounds[1][0], bounds[1][1]),
  new LatLng(bounds[3][0], bounds[3][1]),
  new LatLng(bounds[2][0], bounds[2][1]),
]);
const getDistortableCornersFromInitialBounds = (bounds: OEventPosition[]): LatLng[] => ([
  new LatLng(bounds[1][0], bounds[0][1]),
  new LatLng(bounds[1][0], bounds[1][1]),
  new LatLng(bounds[0][0], bounds[0][1]),
  new LatLng(bounds[0][0], bounds[1][1]),
]);

interface EventViewerGeoMapProps {
  runnerId: string;
  selectedEvent: OEvent;
  triggerSelect: number;
  triggerUpdateCorners: number;
  triggerResetCorners: number;
  updateCorners: (corners: L.LatLng[]) => void;
}

// simple map to show the location of a single event
const EventViewerGeoMap: FunctionComponent<EventViewerGeoMapProps> = ({
  runnerId,
  selectedEvent,
  triggerSelect,
  triggerUpdateCorners,
  triggerResetCorners,
  updateCorners,
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
  // eslint-disable-next-line
  const polygon = ( // not currently used
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
          initialCorners={getDistortableCorners(map.geo.imageCorners)}
          triggerSelect={triggerSelect}
          triggerUpdateCorners={triggerUpdateCorners}
          triggerResetCorners={triggerResetCorners}
          updateCorners={updateCorners}
        />
      );
    }
    if (polygonBounds.length === 4) {
      return (
        <Distortable
          url={map.course}
          initialCorners={getDistortableCornersFromPolygonBounds(polygonBounds)}
          triggerSelect={triggerSelect}
          triggerUpdateCorners={triggerUpdateCorners}
          triggerResetCorners={triggerResetCorners}
          updateCorners={updateCorners}
        />
      );
    }
    return (
      <Distortable
        url={map.course}
        initialCorners={getDistortableCornersFromInitialBounds(initialMapBounds)}
        triggerSelect={triggerSelect}
        triggerUpdateCorners={triggerUpdateCorners}
        triggerResetCorners={triggerResetCorners}
        updateCorners={updateCorners}
      />
    );
  });

  return (
    <MapContainer
      id="EventViewerGeoMap"
      className="event-viewer-geo-map"
      bounds={initialMapBounds} // this prop will not reset map if selected event changes
    >
      <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
      {/* {polygon} */}
      {route}
      {mapImages.length && mapImages[0]}
    </MapContainer>
  );
};

export default EventViewerGeoMap;
