import 'leaflet-hotline';
import * as L from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { FunctionComponent, useEffect, useRef } from 'react';

// const DEFAULT_OPTIONS = {
//   min: ?
//   max: ?
//   palette: {
//     0.0: '#008800',
//     0.5: '#ffff00',
//     1.0: '#ff0000',
//   },
//   weight: 5,
//   outlineColor: '#000000',
//   outlineWidth: 1,
// };

export type HotlineDataPoint = [number, number, number];
export type HotlineOptions = {
  min?: number;
  max?: number;
  palette?: { [key: number]: string }; // key 0->1, value is #rrggbb
  weight?: number;
  outlineColor?: string;
  outlineWidth?: number;
};

interface IHotlineProps {
  data: HotlineDataPoint[]; // array of [lat, long, z]
  options?: HotlineOptions;
}

const Hotline: FunctionComponent<IHotlineProps> = (props: IHotlineProps) => {
  const context = useLeafletContext();
  const hotlineRef = useRef();

  useEffect(() => {
    const { data, options = {} } = props;

    const zValues = data.map((dataPoint) => dataPoint[2]);
    if (!options.min) {
      options.min = Math.min(...zValues);
    }
    if (!options.max) {
      options.max = Math.max(...zValues);
    }
    if (!options.weight) {
      options.weight = 3;
    }
    // @ts-ignore
    hotlineRef.current = new L.Hotline(data, options);

    const container = context.layerContainer || context.map;
    // @ts-ignore
    container.addLayer(hotlineRef.current);
    return () => {
      // @ts-ignore
      container.removeLayer(hotlineRef.current);
    };
  });

  return null;
};

export default Hotline;
