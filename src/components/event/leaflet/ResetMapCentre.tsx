/* eslint-disable react/prop-types */
import { FunctionComponent } from 'react';
import { useMap } from 'react-leaflet';
import { OEventPosition } from '../../../types/event';

interface ResetMapCentreProps {
  mapCentre: OEventPosition;
}

// empty child component that uses useMap hook to reset the map centre if the
// selected centre coordinates change
const ResetMapCentre: FunctionComponent<ResetMapCentreProps> = ({ mapCentre }) => {
  const mapInstance = useMap();
  mapInstance.flyTo(mapCentre);
  return null;
};

export default ResetMapCentre;
