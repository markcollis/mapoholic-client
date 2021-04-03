/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  useMap,
  useMapEvent,
} from 'react-leaflet';

const ZoomLevelDetection: FunctionComponent = ({
  children,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>();
  const mapInstance = useMap();
  useMapEvent('moveend', () => {
    const newZoomLevel = mapInstance.getZoom();
    // console.log('moveend zoom is', newZoomLevel);
    setZoomLevel(newZoomLevel);
  });
  useEffect(() => {
    const initialZoomLevel = mapInstance.getZoom();
    // console.log('set initial zoom to', initialZoomLevel);
    setZoomLevel(initialZoomLevel);
  }, []);
  const childrenWithZoomLevel = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { zoomLevel });
  });
  return <div>{childrenWithZoomLevel}</div>;
};

export default ZoomLevelDetection;
