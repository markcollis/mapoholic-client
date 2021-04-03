/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
} from 'react-leaflet';
import iconFlag from '../../../common/iconFlag';
import getPolygonBounds from './getPolygonBounds';
import ResetMapCentre from './ResetMapCentre';
import { MAP_TILES, MAP_CREDIT } from '../../../config';
import { OEventPosition } from '../../../types/event';

interface EventEditLocationMapProps {
  locLat: number | null;
  locLong: number | null;
  locCornerNE: OEventPosition;
  locCornerNW: OEventPosition;
  locCornerSE: OEventPosition;
  locCornerSW: OEventPosition;
}

// The EventEditLocationMap component renders a simple map to show the location
// of a single event while editing its details
const EventEditLocationMap: FunctionComponent<EventEditLocationMapProps> = ({
  locLat,
  locLong,
  locCornerNE,
  locCornerNW,
  locCornerSE,
  locCornerSW,
}) => {
  const locationMarker = locLat && locLong && (
    <Marker
      position={[locLat, locLong]}
      opacity={0.8}
      icon={iconFlag}
    />
  );
  const polygonBounds = getPolygonBounds({
    locCornerNE,
    locCornerNW,
    locCornerSE,
    locCornerSW,
  });
  const locationPolygon = polygonBounds.length > 1 && (
    <Polygon
      positions={polygonBounds}
      color="blue"
    />
  );

  if (!locLat || !locLong) return null;
  return (
    <MapContainer
      className="event-edit-location-map"
      center={[locLat, locLong]}
      zoom={12}
    >
      <ResetMapCentre mapCentre={[locLat, locLong]} />
      <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
      {locationMarker}
      {locationPolygon}
    </MapContainer>
  );
};

export default EventEditLocationMap;
