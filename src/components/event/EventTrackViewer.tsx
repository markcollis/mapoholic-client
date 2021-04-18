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
import { calculateDistance } from './leaflet/getPolygonBounds';

const isDetailedTrack = (
  test: OEventTrackDetailed | OEventTrackPositions,
): test is OEventTrackDetailed => {
  return test.some((point: OEventWaypoint | OEventPosition) => !Array.isArray(point));
};

const isXYDatum = (test: XYDatum | object): test is XYDatum => {
  if (!('x' in test)) return false;
  if (!('y' in test)) return false;
  if (typeof test.x !== 'number') return false;
  return (typeof test.y === 'number');
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
  // console.log('generate chart data for', xAxisType, 'vs', yAxisType);
  const startTimestamp = trackData[0].timestamp;
  const getPosition = (waypoint: OEventWaypoint): OEventPosition => [waypoint.lat, waypoint.long];
  let distance = 0;
  const stats = trackData.map((waypoint, index, array) => {
    // simple
    const duration = (waypoint.timestamp - startTimestamp) / 1000;
    const altitude = waypoint.altitude || 0;
    const heartRate = waypoint.heartRate || 0;
    // based on previous
    if (index === 0) {
      return {
        distance,
        duration,
        stepDistance: 0,
        stepDuration: 0,
        altitude,
        heartRate,
        pace: undefined, // will filter out later
        speed: 0,
      };
    }
    const previousWaypoint = array[index - 1];
    const stepDistance = calculateDistance(getPosition(waypoint), getPosition(previousWaypoint));
    distance += stepDistance;
    const stepDuration = (waypoint.timestamp - previousWaypoint.timestamp) / 1000;
    const speed = stepDistance / stepDuration;
    const rawPace = stepDistance > 0 ? (stepDuration / 60) / (stepDistance / 1000) : undefined;
    return {
      distance,
      duration,
      stepDistance,
      stepDuration,
      altitude,
      heartRate,
      pace: (rawPace && rawPace < 20) ? rawPace : undefined, // filter out extremes when not moving
      speed,
    };
  });
  const data = stats.map((waypointStats) => ({
    x: waypointStats[xAxisType],
    y: waypointStats[yAxisType],
  })).filter(isXYDatum);
  return data;
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
              mapId={map._id}
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
          {trackData[0].altitude && <option value={YAxisType.altitude}>Altitude</option>}
          {trackData[0].heartRate && <option value={YAxisType.heartRate}>Heart Rate</option>}
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
