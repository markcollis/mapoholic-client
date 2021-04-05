import { polygon } from 'polygon-tools';

import {
  OEvent,
  OEventSummary,
  OEventPosition,
  OEventCorners,
} from '../../../types/event';

function isOEvent(test: OEvent | OEventSummary): test is OEvent {
  return 'createdAt' in test;
}

export const derivePolygonBoundsFromCorners = ({
  locCornerNE,
  locCornerNW,
  locCornerSE,
  locCornerSW,
} : {
  locCornerNE: OEventPosition | [null, null];
  locCornerNW: OEventPosition | [null, null];
  locCornerSE: OEventPosition | [null, null];
  locCornerSW: OEventPosition | [null, null];
}): OEventPosition[] => {
  const polygonBounds = [];
  // add SW corner if it exists
  if (locCornerSW && locCornerSW[0] && locCornerSW[1]) {
    polygonBounds.push(locCornerSW);
  }
  // add NW corner if it exists or assume rectangle if only SW and NE corners exist
  if (locCornerNW && locCornerNW[0] && locCornerNW[1]) {
    polygonBounds.push(locCornerNW);
  } else if (locCornerSW && locCornerSW[1] && locCornerNE && locCornerNE[0]) {
    polygonBounds.push([locCornerNE[0], locCornerSW[1]]);
  }
  // add NE corner if it exists
  if (locCornerNE && locCornerNE[0] && locCornerNE[1]) {
    polygonBounds.push(locCornerNE);
  }
  // add SE corner if it exists or assume rectangle if only SW and NE corners exist
  if (locCornerSE && locCornerSE[0] && locCornerSE[1]) {
    polygonBounds.push(locCornerSE);
  } else if (locCornerSW && locCornerSW[0] && locCornerNE && locCornerNE[1]) {
    polygonBounds.push([locCornerSW[0], locCornerNE[1]]);
  }
  return polygonBounds as OEventPosition[];
};

export const getMapCorners = (event: OEvent | OEventSummary, runnerId: string) => {
  if (isOEvent(event)) {
    const matchingRunner = event.runners
      .find(({ user: { _id: userId } }) => userId === runnerId);
    if (matchingRunner && matchingRunner.maps) {
      const mapCorners = matchingRunner.maps.map((map) => {
        return map.geo && map.geo.mapCorners ? map.geo.mapCorners : null;
      });
      return mapCorners.filter((corners) => corners !== null) as OEventCorners[];
    }
    return [];
  }
  const matchingRunner = event.runners.find(({ user }) => user === runnerId);
  if (matchingRunner && matchingRunner.ownMapCorners) {
    return matchingRunner.ownMapCorners;
  }
  return [];
};

// Return appropriate polygon bounds for location maps
export const derivePolygonBoundsFromEvent = (
  event: OEvent | OEventSummary,
  runnerId: string,
): OEventPosition[] => {
  const defaultPolygonBounds = derivePolygonBoundsFromCorners(event);
  const mapCorners = getMapCorners(event, runnerId);
  if (mapCorners.length < 2) return defaultPolygonBounds;
  const mapCornerPositions = mapCorners.map((corners) => [
    [corners.nw.lat, corners.nw.long],
    [corners.ne.lat, corners.ne.long],
    [corners.se.lat, corners.se.long],
    [corners.sw.lat, corners.sw.long],
  ]);
  const union = polygon.union(...mapCornerPositions);
  // console.log('union', union);
  return union[0];
  // if they don't overlap union will have multiple elements
  // deal with this later...
};
