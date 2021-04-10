import * as L from 'leaflet';
import 'leaflet-toolbar'; // provides L.Toolbar2 for distortableimage
import 'leaflet-distortableimage'; // extends L a lot
import { useMap } from 'react-leaflet';
import {
  FunctionComponent,
  useEffect,
  useRef,
} from 'react';

// actions (optional, default: [L.DragAction, L.ScaleAction, L.DistortAction, L.RotateAction,
// L.FreeRotateAction, L.LockAction, L.OpacityAction, L.BorderAction, L.ExportAction,
// L.DeleteAction], value: array)
// corners - The corners should be passed as an array of L.latLng objects in
// NW, NE, SW, SE order (in a "Z" shape).

interface IDistortableProps {
  url: string;
  initialCorners: L.LatLng[];
  triggerSelect: number;
  triggerUpdateCorners: number;
  triggerResetCorners: number;
  updateCorners: (corners: L.LatLng[]) => void;
}

const Distortable: FunctionComponent<IDistortableProps> = (props) => {
  const map = useMap();
  const distortableRef = useRef<L.Layer>();

  const {
    url,
    initialCorners,
    triggerSelect,
    triggerUpdateCorners,
    triggerResetCorners,
    updateCorners,
  } = props;

  /* eslint-disable consistent-return */
  useEffect(() => {
    console.log('url/initialCorners in Distortable useEffect setup', url, initialCorners);
    const options = {
      corners: initialCorners,
      actions: [
        // @ts-ignore
        L.DragAction,
        // @ts-ignore
        L.ScaleAction,
        // @ts-ignore
        L.DistortAction,
        // @ts-ignore
        L.RotateAction,
        // @ts-ignore
        L.FreeRotateAction,
        // @ts-ignore
        L.OpacityAction,
        // @ts-ignore
        L.StackAction,
      ],
    };
    // @ts-ignore
    const distortableImageLayer = L.distortableImageOverlay(url, options);
    distortableRef.current = distortableImageLayer;
    map.addLayer(distortableImageLayer);
    return () => {
      map.removeLayer(distortableImageLayer);
    };
  }, [map]);

  useEffect(() => {
    // console.log('props changed in useEffect (select)', props);
    // console.log('distortableRef', distortableRef.current);
    if (distortableRef.current) {
      // @ts-ignore
      distortableRef.current.select();
    }
  }, [triggerSelect]);

  useEffect(() => {
    if (distortableRef.current) {
      // @ts-ignore
      distortableRef.current.setCorners(initialCorners);
    }
  }, [triggerResetCorners]);

  useEffect(() => {
    // console.log('props changed in useEffect (corners)', props);
    // console.log('distortableRef', distortableRef.current);
    if (distortableRef.current) {
      // @ts-ignore
      const currentCorners = distortableRef.current.getCorners() as L.LatLng[];
      // console.log('current corners', currentCorners);
      updateCorners(currentCorners);
    }
  }, [triggerUpdateCorners]);

  return null;
};

export default Distortable;
