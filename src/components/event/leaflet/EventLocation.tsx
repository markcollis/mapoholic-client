/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { Marker, Polygon } from 'react-leaflet';
import { LeafletEventHandlerFnMap } from 'leaflet';
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
  highlightOnHover?: boolean;
  zoomLevel?: number;
}

const EventLocation: FunctionComponent<EventLocationProps> = ({
  currentUserId,
  selectedEvent,
  highlightOnHover,
  zoomLevel,
  children,
}) => {
  console.log('zoomlevel in EvLoc', zoomLevel);
  const [active, setActive] = useState(false);
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
      pathOptions={{ color: active ? 'red' : 'blue' }}
    />
  ));
  const eventHandlers: LeafletEventHandlerFnMap = highlightOnHover
    ? {
      mouseover: () => {
        setActive(true);
      },
      mouseout: () => {
        setActive(false);
      },
    } : {};
  const markersOnlyZoom = zoomLevel && zoomLevel < 11;
  if (markersOnlyZoom || polygonBounds.length < 3) {
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
        eventHandlers={eventHandlers}
        positions={polygonBounds}
        pathOptions={{ color: active ? 'indianred' : 'blue' }}
      >
        {children}
      </Polygon>
    </>
  );
};

export default EventLocation;
