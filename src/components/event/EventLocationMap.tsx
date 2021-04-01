/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';
import getPolygonBounds from './getPolygonBounds';
import TrackWaypoints from './leaflet/TrackWaypoints';
import { MAP_TILES, MAP_CREDIT } from '../../config';
import { OEvent, OEventPosition } from '../../types/event';

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

export const getInitialMapBounds = (event: OEvent): OEventPosition[] | undefined => {
  const { locLat, locLong } = event;
  if (!locLat || !locLong) return undefined;
  const initialMapBounds: OEventPosition[] = [
    [locLat - 0.02, locLong - 0.02],
    [locLat + 0.02, locLong + 0.02],
  ];
  return initialMapBounds;
};

interface ResetMapBoundsProps {
  selectedEvent: OEvent;
}

// child component that uses useMap hook to reset map bounds if the selected event changes
const ResetMapBounds: FunctionComponent<ResetMapBoundsProps> = ({ selectedEvent }) => {
  const mapInstance = useMap();
  const newMapBounds = getInitialMapBounds(selectedEvent);
  if (newMapBounds) {
    mapInstance.fitBounds(newMapBounds);
  }
  return null;
};

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
