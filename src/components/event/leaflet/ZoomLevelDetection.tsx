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
  useMapEvent('zoomend', () => {
    const newZoomLevel = mapInstance.getZoom();
    console.log('set zoom level to ', newZoomLevel);
    setZoomLevel(newZoomLevel);
  });
  useMapEvent('moveend', () => {
    const newZoomLevel = mapInstance.getZoom();
    console.log('moveend zoom is', newZoomLevel);
    // setZoomLevel(newZoomLevel);
  });
  useMapEvent('viewreset', () => {
    const newZoomLevel = mapInstance.getZoom();
    console.log('viewreset zoom is', newZoomLevel);
    // setZoomLevel(newZoomLevel);
  });
  useEffect(() => {
    const initialZoomLevel = mapInstance.getZoom();
    console.log('set initial zoom to', initialZoomLevel);
    setZoomLevel(initialZoomLevel);
  }, []);
  console.log('zoomlevel', zoomLevel);
  const childrenWithProps = React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { zoomLevel });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
};

export default ZoomLevelDetection;
