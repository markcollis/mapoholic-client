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
      .find(({ user: { _id } }) => _id === runnerId);
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

// simple approximation of distance (in metres) for coordinates that are close together
const calculateDistance = (a: OEventPosition, b: OEventPosition): number => {
  if (!a || !b) throw new Error('can not calculate distance, invalid positions');
  const [aLatDegrees, aLongDegrees] = a;
  const [bLatDegrees, bLongDegrees] = b;
  if (Math.abs(aLatDegrees) > 90 || Math.abs(bLatDegrees) > 90
    || Math.abs(aLongDegrees) > 180 || Math.abs(bLongDegrees) > 180) throw new Error('can not calculate distance, invalid lat/long');
  const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const RADIUS_EARTH = 6371000;
  const aLat = degreesToRadians(aLatDegrees);
  const aLong = degreesToRadians(aLongDegrees);
  const bLat = degreesToRadians(bLatDegrees);
  const bLong = degreesToRadians(bLongDegrees);
  const x = (aLong - bLong) * Math.cos((aLat + bLat) / 2);
  const y = aLat - bLat;
  return RADIUS_EARTH * Math.sqrt(x * x + y * y);
};

type NearestPair = {
  aIndex: number;
  aPosition: OEventPosition;
  bIndex: number;
  bPosition: OEventPosition;
  distance: number; // metres
};

const findNearestCoordinatePair = (a: OEventPosition[], b: OEventPosition[]): NearestPair => {
  if (!a.length || !b.length) throw new Error('Invalid coordinates');
  const pairs = a.flatMap((aPosition, aIndex) => b.map((bPosition, bIndex) => ({
    aIndex,
    aPosition,
    bIndex,
    bPosition,
    distance: calculateDistance(aPosition, bPosition),
  }))).sort((x, y) => {
    return x.distance > y.distance ? 1 : -1;
  });
  return pairs[0];
};

const combinePolygons = (a: OEventPosition[], b: OEventPosition[]): OEventPosition[] => {
  if (!a.length) return b;
  if (!b.length) return a;
  const nearestCoordinatePair = findNearestCoordinatePair(a, b);
  return [
    ...a.slice(0, nearestCoordinatePair.aIndex + 1),
    ...b.slice(nearestCoordinatePair.bIndex),
    ...b.slice(0, nearestCoordinatePair.bIndex + 1),
    ...a.slice(nearestCoordinatePair.aIndex),
  ];
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
  const union: OEventPosition[][] = polygon.union(...mapCornerPositions);
  return union.reduce((acc, val) => combinePolygons(acc, val), []);
};
