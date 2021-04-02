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
import {
  OEvent,
  OEventSummary,
  OEventPosition,
  OEventTrack,
} from '../../../types/event';

function isOEvent(test: OEvent | OEventSummary): test is OEvent {
  return 'owner' in test;
}

interface EventLocationProps {
  currentUserId: string;
  selectedEvent: OEvent | OEventSummary;
}

const EventLocation: FunctionComponent<EventLocationProps> = ({
  currentUserId,
  selectedEvent,
  children,
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
  const flagMarkerPos: OEventPosition | null = (locLat && locLong) ? [locLat, locLong] : null;
  const polygonBounds = getPolygonBounds(selectedEvent);

  const getTrackData = (event: OEvent | OEventSummary, runnerId: string): OEventTrack[] => {
    if (isOEvent(event)) {
      const matchingRunner = event.runners
        .find(({ user: { _id: userId } }) => userId === runnerId);
      if (matchingRunner && matchingRunner.maps) {
        const tracks = matchingRunner.maps.map((map) => {
          return map.geo && map.geo.track ? map.geo.track : [];
        });
        return tracks.filter((track) => track.length > 0);
      }
      return [];
    }
    const matchingRunner = event.runners
      .find(({ user }) => user === runnerId);
    return matchingRunner && matchingRunner.ownTracks ? matchingRunner.ownTracks : [];
  };
  const trackData = getTrackData(selectedEvent, currentUserId);
  /* eslint-disable react/no-array-index-key */
  const trackWaypointsArray = trackData.map((track, index) => (
    <TrackWaypoints
      key={index}
      track={track}
      pathOptions={{ color: 'blue' }}
    />
  ));
  if (!zoomLevel || zoomLevel < 11 || polygonBounds.length < 3) {
    return flagMarkerPos && (
      <Marker
        position={flagMarkerPos}
        opacity={0.8}
        icon={iconFlag}
      >
        {children}
      </Marker>
    );
  }
  return (
    <>
      {trackWaypointsArray}
      <Polygon
        positions={polygonBounds}
        color="blue"
      >
        {children}
      </Polygon>
    </>
  );
};

export default EventLocation;
