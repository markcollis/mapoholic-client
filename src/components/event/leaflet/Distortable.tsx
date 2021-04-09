import * as L from 'leaflet';
import 'leaflet-toolbar'; // provides L.Toolbar2 for distortableimage
import 'leaflet-distortableimage'; // extends L a lot
import { useMap } from 'react-leaflet';
import { FunctionComponent, useEffect } from 'react';

// actions (optional, default: [L.DragAction, L.ScaleAction, L.DistortAction, L.RotateAction,
// L.FreeRotateAction, L.LockAction, L.OpacityAction, L.BorderAction, L.ExportAction,
// L.DeleteAction], value: array)
// corners - The corners should be passed as an array of L.latLng objects in
// NW, NE, SW, SE order (in a "Z" shape).

interface DistortableImageOverlayOptions {
  actions?: unknown[];
  corners?: L.LatLng[];
}

interface IDistortableProps extends DistortableImageOverlayOptions {
  url: string;
}

const Distortable: FunctionComponent<IDistortableProps> = (props) => {
  const map = useMap();

  /* eslint-disable consistent-return */
  useEffect(() => {
    const { url, ...options } = props;

    console.log('url/options in Distortable', url, options);
    try {
      // @ts-ignore
      const distortableImageLayer = L.distortableImageOverlay(url, options);
      map.addLayer(distortableImageLayer);
      return () => {
        map.removeLayer(distortableImageLayer);
      };
    } catch (err) {
      console.error('Error in Distortable', err);
    }
  }, [map, props]);

  return null;
};

export default Distortable;
