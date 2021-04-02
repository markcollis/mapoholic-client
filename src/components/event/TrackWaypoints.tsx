/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Polyline } from 'react-leaflet';

import { OEventLatLongTuple, OEventMap, OEventWaypoint } from '../../types/event';

interface Props {
  mapData: OEventMap
}

const TrackWaypoints: FunctionComponent<Props> = ({ mapData }) => {
  if (!mapData.geo) return null;
  const { track } = mapData.geo;
  const positions: OEventLatLongTuple[] = track
    .map((waypoint: OEventWaypoint | OEventLatLongTuple) => {
      if (!Array.isArray(waypoint)) {
        const coords: OEventLatLongTuple = [waypoint.lat, waypoint.long];
        return coords;
      }
      return waypoint;
    });
  return <Polyline positions={positions} />;
};

export default TrackWaypoints;
