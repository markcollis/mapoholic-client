import React, { FunctionComponent } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import EventTrackBrushChart from './EventTrackBrushChart';
import { XYDatum } from './EventTrackAreaChart';
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

  const getChartData = (trackData: OEventTrackDetailed): XYDatum[] => {
    if (!trackData.length) return [];
    const startTimestamp = trackData[0].timestamp;
    return trackData.map((waypoint) => ({
      x: (waypoint.timestamp - startTimestamp) / 1000,
      y: waypoint.altitude || 0,
    }));
  };
  const noTrackContent = <p>Nothing to see here, the track is empty</p>;
  const basicTrackContent = (
    <p>
      This track is just an array of positions, and isn&apos;t very interesting.
    </p>
  );
  const detailedTrackContent = (
    <div className="event-track-viewer ui grid">
      <div className="twelve wide column">
        <ParentSize>
          {({ width, height }) => {
            const MAX_HEIGHT = 400; // avoid infinite loop if not defined
            const limitedHeight = Math.min(height, MAX_HEIGHT);
            return (
              <EventTrackBrushChart
                width={width}
                height={limitedHeight}
                data={getChartData(track as OEventTrackDetailed)}
              />
            );
          }}
        </ParentSize>
      </div>
      <div className="four wide column">
        <p>space for selection controls</p>
      </div>
    </div>
  );
  return (
    <div>
      {track.length === 0 && noTrackContent}
      {track.length && !isDetailedTrack(track) && basicTrackContent}
      {track.length && isDetailedTrack(track) && detailedTrackContent}
    </div>
  );
};

export default EventTrackViewer;
