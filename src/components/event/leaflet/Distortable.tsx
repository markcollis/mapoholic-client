import * as L from 'leaflet';
import 'leaflet-toolbar'; // provides L.Toolbar2 for distortableimage
import 'leaflet-distortableimage'; // extends L a lot
import { useMap } from 'react-leaflet';
import {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react';

// actions (optional, default: [L.DragAction, L.ScaleAction, L.DistortAction, L.RotateAction,
// L.FreeRotateAction, L.LockAction, L.OpacityAction, L.BorderAction, L.ExportAction,
// L.DeleteAction], value: array)
// corners - The corners should be passed as an array of L.latLng objects in
// NW, NE, SW, SE order (in a "Z" shape).

const toolbarTranslations = { // only take effect when map is first created
  en: {
    // deleteImage: 'Delete Image',
    // deleteImages: 'Delete Images',
    distortImage: 'Distort Image',
    dragImage: 'Drag Image',
    // exportImage: 'Export Image',
    // exportImages: 'Export Images',
    // removeBorder: 'Remove Border',
    // addBorder: 'Add Border',
    // freeRotateImage: 'Free rotate Image',
    // geolocateImage: 'Geolocate Image',
    // lockMode: 'Lock Mode',
    // lockImages: 'Lock Images',
    makeImageOpaque: 'Make Image Opaque',
    makeImageTransparent: 'Make Image Transparent',
    // restoreImage: 'Restore Natural Image',
    rotateImage: 'Rotate Image',
    scaleImage: 'Scale Image',
    // stackToFront: 'Stack to Front',
    // stackToBack: 'Stack to Back',
    // unlockImages: 'Unlock Images',
    // confirmImageDelete: 'Are you sure? This image will be permanently deleted from the map.',
    // confirmImagesDeletes: 'Are you sure? These images will be permanently
    // deleted from the map.',
  },
  cs: {
    distortImage: 'TODO Distort Image',
    dragImage: 'TODO Drag Image',
    makeImageOpaque: 'TODO Make Image Opaque',
    makeImageTransparent: 'TODO Make Image Transparent',
    rotateImage: 'TODO Rotate Image',
    scaleImage: 'TODO Scale Image',
  },
};

interface IDistortableProps {
  language: string;
  initialCorners: L.LatLng[];
  triggerResetCorners: number;
  triggerSelect: number;
  triggerUpdateCorners: number;
  updateCorners: (corners: L.LatLng[]) => void;
  url: string;
}

const Distortable: FunctionComponent<IDistortableProps> = (props) => {
  const map = useMap();
  const distortableRef = useRef<L.Layer>();
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    initialCorners,
    language,
    triggerResetCorners,
    triggerSelect,
    triggerUpdateCorners,
    updateCorners,
    url,
  } = props;

  /* eslint-disable consistent-return */
  useEffect(() => {
    // console.log('url/initialCorners in Distortable useEffect setup', url, initialCorners);
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
        L.OpacityAction,
      ],
      // @ts-ignore
      translation: toolbarTranslations[language],
    };
    // @ts-ignore
    const distortableImageLayer = L.distortableImageOverlay(url, options);
    distortableRef.current = distortableImageLayer;
    map.addLayer(distortableImageLayer);
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      map.removeLayer(distortableImageLayer);
    };
  }, [map]);

  useEffect(() => {
    if (distortableRef.current) {
      // @ts-ignore
      distortableRef.current.select();
      // @ts-ignore
      distortableRef.current.bringToFront();
    }
  }, [triggerSelect]);

  useEffect(() => {
    if (distortableRef.current) {
      // @ts-ignore
      distortableRef.current.setCorners(initialCorners);
    }
  }, [triggerResetCorners]);

  useEffect(() => {
    // console.log('updateCornerstriggered', triggerUpdateCorners, isLoaded);
    if (distortableRef.current) {
      // @ts-ignore
      const currentCorners = distortableRef.current.getCorners() as L.LatLng[];
      updateCorners(currentCorners);
    }
  }, [triggerUpdateCorners, isLoaded]);

  return null;
};

export default Distortable;
