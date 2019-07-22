import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  Marker,
  Polygon,
  TileLayer,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';

const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// simple map to show the location of a single event while editing
class EventEditLocationMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapZoomLevel: 12,
    };
  }

  handleZoomEnd = () => {
    const leafletMap = this.mapRef.current.leafletElement;
    this.setState({ mapZoomLevel: leafletMap.getZoom() });
  }

  renderLocation = () => {
    const {
      locLat,
      locLong,
    } = this.props;
    const flagMarkerPos = [locLat, locLong];
    return (
      <Marker
        position={flagMarkerPos}
        opacity={0.8}
        icon={iconFlag}
      />
    );
  }

  renderMapCorners = () => {
    const {
      locCornerSW,
      locCornerNW, // * may be missing in some older records *
      locCornerNE,
      locCornerSE, // * may be missing in some older records *
    } = this.props;
    const polygonBounds = [];
    if (locCornerNW[0] && locCornerNW[1]) polygonBounds.push(locCornerNW);
    if (locCornerNE[0] && locCornerNE[1]) polygonBounds.push(locCornerNE);
    if (locCornerSE[0] && locCornerSE[1]) polygonBounds.push(locCornerSE);
    if (locCornerSW[0] && locCornerSW[1]) polygonBounds.push(locCornerSW);
    if (polygonBounds.length < 2) return null;
    return (
      <Polygon
        positions={polygonBounds}
        color="blue"
      />
    );
  }

  render() {
    const { mapZoomLevel } = this.state;
    const { locLat, locLong } = this.props;
    if (!locLat || !locLong) return null;
    return (
      <Map
        className="event-edit-location-map"
        ref={this.mapRef}
        center={[locLat, locLong]}
        zoom={mapZoomLevel}
        onZoomEnd={this.handleZoomEnd}
      >
        <TileLayer attribution={osmAttr} url={osmTiles} />
        {this.renderLocation()}
        {this.renderMapCorners()}
      </Map>
    );
  }
}

EventEditLocationMap.propTypes = {
  locLat: PropTypes.number,
  locLong: PropTypes.number,
  locCornerSW: PropTypes.arrayOf(PropTypes.number),
  locCornerNW: PropTypes.arrayOf(PropTypes.number), // * may be missing in some older records *
  locCornerNE: PropTypes.arrayOf(PropTypes.number),
  locCornerSE: PropTypes.arrayOf(PropTypes.number), // * may be missing in some older records *
};
EventEditLocationMap.defaultProps = {
  locLat: null,
  locLong: null,
  locCornerNW: [null, null],
  locCornerNE: [null, null],
  locCornerSW: [null, null],
  locCornerSE: [null, null],
};

export default EventEditLocationMap;
