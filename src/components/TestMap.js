import React, { Component } from 'react';
// import Leaflet from 'leaflet';
import {
  Map,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import iconFlag from './icon';

const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
// const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [50.08, 14.42];

class TestMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      rectangleCoords: [],
      zoomLevel: 13,
    };
  }

  componentDidMount() {
    // const leafletMap = this.mapRef.current.leafletElement;
    // const { rectangleCoords } = this.state;
    // console.log('Current zoom level: ', leafletMap.getZoom());
    // console.log('Current rectangles: ', rectangleCoords);
  }

  handleZoomEnd = () => {
    const leafletMap = this.mapRef.current.leafletElement;
    // console.log('Zoom level changed to: ', leafletMap.getZoom());
    this.setState({ zoomLevel: leafletMap.getZoom() });
  }

  handleButtonClick = () => {
    // console.log('button clicked');
    const { rectangleCoords } = this.state;
    const coordsToAdd = this.generateRectangleCoords(10);
    const newBounds = [[50.085, 14.395], [50.098, 14.427]]; // city centre map
    const newRectangleCoords = [...rectangleCoords, ...coordsToAdd, newBounds];
    // const newRectangleCoords = [newBounds];
    this.setState({ rectangleCoords: newRectangleCoords });
  }

  generateRectangleCoords = (number, x = 50, y = 14.3) => {
    const coordSet = [];
    for (let i = 0; i < number; i += 1) {
      const xLow = x + Number(Math.random().toFixed(3) / 10);
      const yLow = y + Number(Math.random().toFixed(3) / 10);
      const xHigh = xLow + 0.01 + Number(Math.random().toFixed(2) / 100);
      const yHigh = yLow + 0.01 + Number(Math.random().toFixed(2) / 100);
      coordSet.push([[xLow, yLow], [xHigh, yHigh]]);
    }
    return coordSet;
  }

  renderRectangles = () => {
    const { rectangleCoords } = this.state;
    // console.log('rectangleCoords: ', rectangleCoords);
    if (!this.mapRef.current || rectangleCoords.length === 0) return null;

    const leafletMap = this.mapRef.current.leafletElement;
    // console.log('leafletMap: ', leafletMap);
    const currentZoom = leafletMap.getZoom();
    // const point = leafletMap.project([50.085, 14.395]);
    // const newPoint = { x: point.x, y: point.y + 50 };
    // const newCoord = leafletMap.unproject(newPoint);
    const rectangleSet = rectangleCoords.map((coords) => {
      const markerLong = (coords[0][1] + coords[1][1]) / 2;
      const markerPos = [coords[0][0], markerLong];
      // console.log('markerPos ', markerPos);
      if (currentZoom < 11) {
        return (
          <Marker key={coords[0][0]} position={markerPos} opacity={0.8} icon={iconFlag}>
            <Tooltip direction="center" offset={[0, -20]} className="maplabel">
              Map name
              {currentZoom}
            </Tooltip>
          </Marker>
        );
      }
      return (
        <div key={coords[0][0]}>
          <Rectangle
            bounds={coords}
            color="red"
          />
          <Marker position={markerPos} opacity={0} icon={iconFlag}>
            <Tooltip direction="center" permanent offset={[0, -20]} className="maplabel">
              Map name
              {currentZoom}
            </Tooltip>
          </Marker>
        </div>
      );
    });
    return rectangleSet;
  }

  render() {
    const { zoomLevel } = this.state;
    const homePosition = [50.0657, 14.3982];
    return (
      <div className="test-map ui segment">
        <h3 className="header">{'Look, it\'s a map!'}</h3>
        <Map
          ref={this.mapRef}
          center={mapCenter}
          zoom={zoomLevel}
          onZoomEnd={this.handleZoomEnd}
        >
          <TileLayer attribution={osmAttr} url={osmTiles} />
          <Marker position={homePosition} icon={iconFlag}>
            <Popup>
              Home!
            </Popup>
          </Marker>
          {this.renderRectangles()}
        </Map>
        <div>
          <p />
          <button
            type="button"
            className="ui button primary"
            onClick={this.handleButtonClick}
          >
          Draw some boxes
          </button>
        </div>
      </div>
    );
  }
}

export default TestMap;
