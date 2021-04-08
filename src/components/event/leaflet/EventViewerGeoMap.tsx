/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  ImageOverlay,
} from 'react-leaflet';
// import DistortableImageOverlay from 'react-leaflet-distortable-imageoverlay';

import ZoomLevelDetection from './ZoomLevelDetection';
import TrackWaypoints from './TrackWaypoints';

import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEvent, OEventPosition, OEventCorners } from '../../../types/event';
import { derivePolygonBoundsFromEvent } from './getPolygonBounds';

const positionsFromCorners = (corners: OEventCorners): OEventPosition[] => ([
  [corners.nw.lat, corners.nw.long],
  [corners.ne.lat, corners.ne.long],
  [corners.se.lat, corners.se.long],
  [corners.sw.lat, corners.sw.long],
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
  const mapImage = matchingMaps.length && matchingMaps[0].geo ? (
    <ImageOverlay
      url={matchingMaps[0].course}
      bounds={positionsFromCorners(matchingMaps[0].geo.mapCorners)}
    />
  ) : null;

  return (
    <MapContainer
      id="EventViewerGeoMap"
      className="event-viewer-geo-map"
      bounds={initialMapBounds} // this prop will not reset map if selected event changes
    >
      <ZoomLevelDetection>
        <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
        {polygon}
        {route}
        {mapImage}
      </ZoomLevelDetection>
    </MapContainer>
  );
};

export default EventViewerGeoMap;
