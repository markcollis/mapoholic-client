import React, { FunctionComponent, useState, ChangeEventHandler } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import EventTrackBrushChart, { XAxisType, YAxisType } from './EventTrackBrushChart';
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

const getChartData = ({
  trackData,
  xAxisType = XAxisType.duration,
  yAxisType = YAxisType.speed,
}: {
  trackData: OEventTrackDetailed,
  xAxisType?: XAxisType,
  yAxisType?: YAxisType,
}): XYDatum[] => {
  if (!trackData.length) return [];
  console.log('generate chart data for', xAxisType, 'vs', yAxisType);
  const startTimestamp = trackData[0].timestamp;
  return trackData.map((waypoint) => ({
    x: (waypoint.timestamp - startTimestamp) / 1000,
    y: waypoint.altitude || 0,
  }));
};

const EventTrackViewer: FunctionComponent<EventTrackViewerProps> = ({ map }) => {
  const [xAxisType, setXAxisType] = useState(XAxisType.duration);
  const [yAxisType, setYAxisType] = useState(YAxisType.altitude);
  const track = (map.geo && map.geo.track) || [];

  const handleSelectXAxis: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setXAxisType(e.target.value as XAxisType);
  };
  const handleSelectYAxis: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setYAxisType(e.target.value as YAxisType);
  };

  const noTrackContent = <p>Nothing to see here, the track is empty</p>;
  const basicTrackContent = (
    <p>
      This track is just an array of positions, and isn&apos;t very interesting.
    </p>
  );
  const detailedTrackContent = (trackData: OEventTrackDetailed) => (
    <div className="event-track-viewer ui grid">
      <div className="twelve wide column">
        <ParentSize>
          {({ width }) => (
            <EventTrackBrushChart
              width={width}
              height={400}
              data={getChartData({
                trackData,
                xAxisType,
                yAxisType,
              })}
              xAxisType={xAxisType}
              yAxisType={yAxisType}
            />
          )}
        </ParentSize>
      </div>
      <div className="four wide column">
        <h3>Select data to show</h3>
        <h4>X axis</h4>
        <select className="ui dropdown" onChange={handleSelectXAxis}>
          <option value={XAxisType.duration}>Elapsed time from start</option>
          <option value={XAxisType.distance}>Distance from start</option>
        </select>
        <h4>Y axis</h4>
        <select className="ui dropdown" onChange={handleSelectYAxis}>
          <option value={YAxisType.altitude}>Altitude</option>
          <option value={YAxisType.heartRate}>Heart Rate</option>
          <option value={YAxisType.pace}>Pace</option>
          <option value={YAxisType.speed}>Speed</option>
        </select>
      </div>
    </div>
  );
  return (
    <div>
      {track.length === 0 && noTrackContent}
      {track.length && !isDetailedTrack(track) && basicTrackContent}
      {track.length && isDetailedTrack(track) && detailedTrackContent(track)}
    </div>
  );
};

export default EventTrackViewer;
