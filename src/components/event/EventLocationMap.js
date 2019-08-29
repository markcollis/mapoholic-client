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

// simple map to show the location of a single event
class EventLocationMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapZoomLevel: undefined,
    };
  }

  handleZoomEnd = () => {
    const leafletMap = this.mapRef.current.leafletElement;
    this.setState({ mapZoomLevel: leafletMap.getZoom() });
  }

  renderLocation = (selectedEvent) => {
    const { mapZoomLevel } = this.state;
    const {
      locLat,
      locLong,
      locCornerSW,
      locCornerNW, // * may be missing in some older records *
      locCornerNE,
      locCornerSE, // * may be missing in some older records *
    } = selectedEvent;
    const flagMarkerPos = [locLat, locLong];
    const markerOnly = (!locCornerSW || !locCornerSW[0] || !locCornerSW[1]
      || !locCornerNE || !locCornerNE[0] || !locCornerNE[1]);
    if (mapZoomLevel < 11 || markerOnly) {
      return (
        <Marker
          position={flagMarkerPos}
          opacity={0.8}
          icon={iconFlag}
        />
      );
    }
    const polygonBounds = (!locCornerNW || locCornerNW.length === 0)
      ? [locCornerSW, [locCornerNE[0], locCornerSW[1]],
        locCornerNE, [locCornerSW[0], locCornerNE[1]]]
      : [locCornerSW, locCornerNW, locCornerNE, locCornerSE];
    return (
      <Polygon
        positions={polygonBounds}
        color="blue"
      />
    );
  }

  render() {
    const { selectedEvent } = this.props;
    const { locLat, locLong } = selectedEvent;
    if (!locLat || !locLong) return null;
    const mapBounds = [[locLat - 0.03, locLong - 0.03], [locLat + 0.03, locLong + 0.03]];
    return (
      <Map
        className="event-location-map"
        ref={this.mapRef}
        bounds={mapBounds}
        onZoomEnd={this.handleZoomEnd}
      >
        <TileLayer attribution={osmAttr} url={osmTiles} />
        {this.renderLocation(selectedEvent)}
      </Map>
    );
  }
}

EventLocationMap.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EventLocationMap;
