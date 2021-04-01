/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Marker,
  Polygon,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import iconFlag from '../../../common/iconFlag';
import getPolygonBounds from './getPolygonBounds';
import TrackWaypoints from './TrackWaypoints';
import { OEvent, OEventPosition } from '../../../types/event';

interface EventLocationProps {
  currentUserId: string;
  selectedEvent: OEvent;
}

const EventLocation: FunctionComponent<EventLocationProps> = ({
  currentUserId,
  selectedEvent,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>();
  const mapInstance = useMap();
  useMapEvent('zoomend', () => {
    const newZoomLevel = mapInstance.getZoom();
    setZoomLevel(newZoomLevel);
  });
  useEffect(() => {
    const initialZoomLevel = mapInstance.getZoom();
    setZoomLevel(initialZoomLevel);
  }, []);
  const {
    locLat,
    locLong,
  } = selectedEvent;
  const flagMarkerPos: OEventPosition = [locLat, locLong];
  const polygonBounds = getPolygonBounds(selectedEvent);
  const currentUserRunner = selectedEvent.runners
    .find(({ user: { _id: runnerId } }) => runnerId === currentUserId);
  const trackWaypointsArray = currentUserRunner && currentUserRunner.maps && currentUserRunner.maps
    .filter((mapData) => 'geo' in mapData)
    .map((mapData) => (
      <TrackWaypoints
        key={mapData.title}
        track={mapData.geo ? mapData.geo.track : []}
        pathOptions={{ color: 'blue' }}
      />
    ));
  if (!zoomLevel || zoomLevel < 11 || polygonBounds.length < 3) {
    return (
      <Marker
        position={flagMarkerPos}
        opacity={0.8}
        icon={iconFlag}
      />
    );
  }
  return (
    <>
      {trackWaypointsArray}
      <Polygon
        positions={polygonBounds}
        color="blue"
      />
    </>
  );
};

export default EventLocation;
