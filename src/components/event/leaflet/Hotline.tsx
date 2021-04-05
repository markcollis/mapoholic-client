import 'leaflet-hotline';
import * as L from 'leaflet';
import {
  // LayerProps,
  // LeafletContextInterface,
  // createLayerComponent,
  useLeafletContext,
} from '@react-leaflet/core';
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
    console.log('addto ref', hotlineRef.current);
    console.log('context', context);
    /* eslint-disable */
    // @ts-ignore
    console.log('container', container._container);
    return () => {
      console.log('removing layer');
      console.log('hotlineRef', hotlineRef);
      // @ts-ignore
      container.removeLayer(hotlineRef.current);
    };
  });

  return null;
};

export default Hotline;

// const createLeafletElement = (props: IHotlineProps, context: LeafletContextInterface) => {
//   useEffect(() => {
//     return () => {
//       console.log('context.map in useEffect', context.map);
//       // updateOnCanvas(context.map);
//     };
//   }, []);
//   console.log('context.map in createLeEl', context.map);
//   const { data, options = {} } = props;

//   const zValues = data.map((dataPoint) => dataPoint[2]);
//   if (!options.min) {
//     options.min = Math.min(...zValues);
//   }
//   if (!options.max) {
//     options.max = Math.max(...zValues);
//   }
//   if (!options.weight) {
//     options.weight = 3;
//   }
//   /* eslint-disable no-console */
//   console.log('hotline options', options);
//   console.log('hotline data', data.slice(0, 3));
//   // @ts-ignore
//   const instance = new L.Hotline(data, options);
//   // if (context.map.options.preferCanvas) {
//   //   setTimeout((map: L.Map) => {
//   //     // Handling react-leaflet bug of canvas renderer not updating
//   //     // @ts-ignore
//   //     map._renderer._update();
//   //   }, 0, context.map);
//   // }
// //   return { instance, context };
// // };

/* eslint-disable @typescript-eslint/no-unused-vars */
// const updateLeafletElement = (
//   instance: L.Layer,
//   props: IHotlineProps,
//   prevProps: IHotlineProps,
// ) => {
// console.log('updateLeafletElement triggered', props, instance);
// @ts-ignore
// updateOnCanvas(instance._map);
// };

// export const old = createLayerComponent<L.Layer, LayerProps & IHotlineProps>(
//   createLeafletElement,
// updateLeafletElement,
// );

// export default Square;
