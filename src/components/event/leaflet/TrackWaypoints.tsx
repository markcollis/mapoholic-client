/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Polyline } from 'react-leaflet';
import { PathOptions } from 'leaflet';
import Hotline, { HotlineDataPoint } from './Hotline';

import {
  OEventTrack,
  OEventTrackDetailed,
  OEventTrackPositions,
  OEventWaypoint,
  OEventPosition,
} from '../../../types/event';

function isDetailedTrack(
  test: OEventTrackDetailed | OEventTrackPositions,
): test is OEventTrackDetailed {
  return test.some((point: OEventWaypoint | OEventPosition) => !Array.isArray(point));
}

interface Props {
  track: OEventTrack;
  pathOptions?: PathOptions;
}

const DEFAULT_PATH_OPTIONS = {
  color: 'red',
};

const TrackWaypoints: FunctionComponent<Props> = ({ track, pathOptions }) => {
  if (!track.length) return null;
  if (isDetailedTrack(track)) {
    const data: HotlineDataPoint[] = track
      .map((waypoint) => [waypoint.lat, waypoint.long, waypoint.altitude || 0]);
    return <Hotline key={data.length} data={data} />;
  }
  return <Polyline positions={track} pathOptions={pathOptions || DEFAULT_PATH_OPTIONS} />;

  // const positions: OEventTrackPositions = track
  //   .map((waypoint: OEventWaypoint | OEventPosition) => {
  //     if (!Array.isArray(waypoint)) {
  //       const coords: OEventPosition = [waypoint.lat, waypoint.long];
  //       return coords;
  //     }
  //     return waypoint;
  //   });
  // return <Polyline positions={positions} pathOptions={pathOptions || DEFAULT_PATH_OPTIONS} />;
};

export default TrackWaypoints;
