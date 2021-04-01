/* eslint-disable react/prop-types */
import { FunctionComponent } from 'react';
import { useMap } from 'react-leaflet';
import { OEvent, OEventPosition } from '../../../types/event';

export const getInitialMapBounds = (event: OEvent): OEventPosition[] | undefined => {
  const { locLat, locLong } = event;
  if (!locLat || !locLong) return undefined;
  const initialMapBounds: OEventPosition[] = [
    [locLat - 0.02, locLong - 0.02],
    [locLat + 0.02, locLong + 0.02],
  ];
  return initialMapBounds;
};

interface ResetMapBoundsProps {
  selectedEvent: OEvent;
}

// empty child component that uses useMap hook to reset map bounds if the selected event changes
const ResetMapBounds: FunctionComponent<ResetMapBoundsProps> = ({ selectedEvent }) => {
  const mapInstance = useMap();
  const newMapBounds = getInitialMapBounds(selectedEvent);
  if (newMapBounds) {
    mapInstance.fitBounds(newMapBounds);
  }
  return null;
};

export default ResetMapBounds;
