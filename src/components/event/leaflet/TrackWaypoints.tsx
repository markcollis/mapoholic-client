/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Polyline } from 'react-leaflet';
import { PathOptions } from 'leaflet';

import {
  OEventTrack,
  OEventTrackPositions,
  OEventWaypoint,
  OEventPosition,
} from '../../../types/event';

interface Props {
  track: OEventTrack;
  pathOptions?: PathOptions;
}

const DEFAULT_PATH_OPTIONS = {
  color: 'red',
};

const TrackWaypoints: FunctionComponent<Props> = ({ track, pathOptions }) => {
  if (!track.length) return null;
  const positions: OEventTrackPositions = track
    .map((waypoint: OEventWaypoint | OEventPosition) => {
      if (!Array.isArray(waypoint)) {
        const coords: OEventPosition = [waypoint.lat, waypoint.long];
        return coords;
      }
      return waypoint;
    });
  return <Polyline positions={positions} pathOptions={pathOptions || DEFAULT_PATH_OPTIONS} />;
};

export default TrackWaypoints;
