import L from 'leaflet';
import iconFile from '../graphics/o.png';

const iconFlag = new L.Icon({
  iconUrl: iconFile,
  iconSize: new L.Point(20, 20),
  className: 'leaflet-div-icon',
});

export default iconFlag;
