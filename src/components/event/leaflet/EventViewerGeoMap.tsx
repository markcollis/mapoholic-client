/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
} from 'react-leaflet';
import { LatLng } from 'leaflet';

import Distortable from './Distortable';
import TrackWaypoints from './TrackWaypoints';

import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { derivePolygonBoundsFromEvent } from './getPolygonBounds';
import {
  OEvent,
  OEventMap,
  OEventPosition,
  OEventCorners,
} from '../../../types/event';

export type GeoMapState<T> = { [mapId: string]: T };

// array of L.latLng objects in NW, NE, SW, SE order (in a "Z" shape)
const getDistortableCornersFromEventCorners = (corners: OEventCorners): LatLng[] => ([
  new LatLng(corners.nw.lat, corners.nw.long),
  new LatLng(corners.ne.lat, corners.ne.long),
  new LatLng(corners.sw.lat, corners.sw.long),
  new LatLng(corners.se.lat, corners.se.long),
]);
const getEventCornersFromDistortableCorners = (corners: LatLng[]): OEventCorners => ({
  nw: { lat: corners[0].lat, long: corners[0].lng },
  ne: { lat: corners[1].lat, long: corners[1].lng },
  sw: { lat: corners[2].lat, long: corners[2].lng },
  se: { lat: corners[3].lat, long: corners[3].lng },
});
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
  language: string;
  matchingMaps: OEventMap[];
  selectedEvent: OEvent;
  selectedRunner: string;
  triggerResetCorners: GeoMapState<number>;
  triggerSelect: GeoMapState<number>;
  triggerUpdateCorners: GeoMapState<number>;
  updateCorners: (mapId: string) => (corners: OEventCorners) => void;
}

// map showing the imported map images and tracks overlaid on OSM
const EventViewerGeoMap: FunctionComponent<EventViewerGeoMapProps> = ({
  language,
  matchingMaps,
  selectedEvent,
  selectedRunner,
  triggerResetCorners,
  triggerSelect,
  triggerUpdateCorners,
  updateCorners,
}) => {
  const {
    locLat,
    locLong,
  } = selectedEvent;

  if (!locLat || !locLong) return <p>Sorry, we don&apos;t know where this event is...</p>;
  const initialMapBounds: OEventPosition[] = [
    [locLat - 0.01, locLong - 0.02],
    [locLat + 0.01, locLong + 0.02],
  ];

  const polygonBounds = derivePolygonBoundsFromEvent(selectedEvent, selectedRunner);
  // eslint-disable-next-line
  const polygon = ( // not currently used
    <Polygon
      positions={polygonBounds}
      pathOptions={{ color: 'blue' }}
    />
  );

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

  const mapsWithImages = matchingMaps.filter((map) => map.course); // want course not route
  const mapImages = mapsWithImages.map((map) => {
    const { _id } = map;
    let initialCorners = getDistortableCornersFromInitialBounds(initialMapBounds);
    if (polygonBounds.length === 4) {
      initialCorners = getDistortableCornersFromPolygonBounds(polygonBounds);
    }
    if (map.geo && map.geo.imageCorners) {
      initialCorners = getDistortableCornersFromEventCorners(map.geo.imageCorners);
    }
    const updateDistortableCorners = (corners: LatLng[]): void => {
      updateCorners(_id)(getEventCornersFromDistortableCorners(corners));
    };
    return (
      <Distortable
        key={_id}
        initialCorners={initialCorners}
        language={language}
        triggerResetCorners={triggerResetCorners[_id] || 0}
        triggerSelect={triggerSelect[_id] || 0}
        triggerUpdateCorners={triggerUpdateCorners[_id] || 0}
        updateCorners={updateDistortableCorners}
        url={map.course}
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
      {mapImages}
    </MapContainer>
  );
};

export default EventViewerGeoMap;
