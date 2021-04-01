import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';
import getPolygonBounds from './getPolygonBounds';
import { MAP_TILES, MAP_CREDIT } from '../../config';

// The EventEditLocationMap component renders a simple map to show the location
// of a single event while editing its details
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
    const polygonBounds = getPolygonBounds(this.props);
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
      <MapContainer
        className="event-edit-location-map"
        whenCreated={(mapInstance) => { this.mapRef.current = mapInstance; }}
        center={[locLat, locLong]}
        zoom={mapZoomLevel}
        onZoomEnd={this.handleZoomEnd}
      >
        <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
        {this.renderLocation()}
        {this.renderMapCorners()}
      </MapContainer>
    );
  }
}

EventEditLocationMap.propTypes = {
  locLat: PropTypes.number,
  locLong: PropTypes.number,
};
EventEditLocationMap.defaultProps = {
  locLat: null,
  locLong: null,
};

export default EventEditLocationMap;
