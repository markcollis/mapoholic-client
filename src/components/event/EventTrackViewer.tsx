import React, { FunctionComponent } from 'react';

import {
  OEventMap,
  OEventPosition,
  OEventTrackDetailed,
  OEventTrackPositions,
  OEventWaypoint,
} from '../../types/event';

const isDetailedTrack = (
  test: OEventTrackDetailed | OEventTrackPositions,
): test is OEventTrackDetailed => {
  return test.some((point: OEventWaypoint | OEventPosition) => !Array.isArray(point));
};

interface EventTrackViewerProps {
  map: OEventMap;
}

const EventTrackViewer: FunctionComponent<EventTrackViewerProps> = ({ map }) => {
  const track = (map.geo && map.geo.track) || [];
  return (
    <div>
      <h3>Placeholder for track viewer</h3>
      <p>{map.title || 'only'}</p>
      {track.length === 0 && <p>Nothing to see here, the track is empty</p>}
      {track.length && !isDetailedTrack(track)
        && <p>This track is just an array of positions, and isn&apos;t very interesting.</p>}
      {track.length && isDetailedTrack(track)
        && <p>This will be interesting, once I have implemented it :-)</p>}
    </div>
  );
};

export default EventTrackViewer;
