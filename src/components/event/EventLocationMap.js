import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  Marker,
  Polygon,
  TileLayer,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';
import getPolygonBounds from './getPolygonBounds';
import TrackWaypoints from './leaflet/TrackWaypoints';
import { MAP_TILES, MAP_CREDIT } from '../../config';

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

  renderLocation = () => {
    const { currentUserId, selectedEvent } = this.props;
    const { mapZoomLevel } = this.state;
    const {
      locLat,
      locLong,
    } = selectedEvent;
    const flagMarkerPos = [locLat, locLong];
    const polygonBounds = getPolygonBounds(selectedEvent);
    const currentUserRunner = selectedEvent.runners
      .find(({ user: { _id: runnerId } }) => runnerId === currentUserId);
    const currentUserMapsGeocoded = currentUserRunner && currentUserRunner.maps
      .filter((map) => map.isGeocoded);
    const trackWaypointsArray = currentUserMapsGeocoded && currentUserMapsGeocoded
      .map((mapData) => <TrackWaypoints key={mapData.title} track={mapData.geo.track} />);
    if (mapZoomLevel < 11 || polygonBounds.length < 3) {
      return (
        <Marker
          position={flagMarkerPos}
          opacity={0.8}
          icon={iconFlag}
        />
      );
    }
    return (
      <>
        <Polygon
          positions={polygonBounds}
          color="blue"
        />
        {trackWaypointsArray}
      </>
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
        <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
        {this.renderLocation()}
      </Map>
    );
  }
}

EventLocationMap.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default EventLocationMap;
