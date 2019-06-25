import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Leaflet from 'leaflet';
import {
  Map,
  Marker,
  // Popup,
  Rectangle,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';
import { reformatTimestampDateOnly } from '../../common/conversions';

const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
// const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

class EventMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapBounds: [[50, 14], [50.2, 14.2]],
      mapZoomLevel: undefined,
    };
  }

  componentDidMount() {
    const { events, mapBounds } = this.props;
    // console.log('Event Map mounted - events:', events);
    // console.log('mapBounds:', mapBounds);
    if (mapBounds) {
      this.setState({ mapBounds });
    } else {
      const eventBounds = events
        .filter(eventDetails => eventDetails.locLat && eventDetails.locLong)
        .map((eventDetails) => {
          const {
            locLat,
            locLong,
          } = eventDetails;
          return [locLat, locLong];
        });
      if (eventBounds.length > 0) {
        const mapBoundsToSet = eventBounds.reduce((acc, val) => {
          const low = [
            (val[0] < acc[0][0]) ? val[0] : acc[0][0],
            (val[1] < acc[0][1]) ? val[1] : acc[0][1],
          ];
          const high = [
            (val[0] > acc[1][0]) ? val[0] : acc[1][0],
            (val[1] > acc[1][1]) ? val[1] : acc[1][1],
          ];
          return [low, high];
        }, [[eventBounds[0][0] - 0.01, eventBounds[0][1] - 0.01],
          [eventBounds[0][0] + 0.01, eventBounds[0][1] + 0.01]]);
        this.setState({ mapBounds: mapBoundsToSet });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { events } = this.props;
    if (events !== prevProps.events) {
      // console.log('Event Map updated - events:', events);
      const eventBounds = events
        .filter(eventDetails => eventDetails.locLat && eventDetails.locLong)
        .map((eventDetails) => {
          const {
            locLat,
            locLong,
          } = eventDetails;
          return [locLat, locLong];
        });
      if (eventBounds.length > 0) {
        const mapBounds = eventBounds.reduce((acc, val) => {
          const low = [
            (val[0] < acc[0][0]) ? val[0] : acc[0][0],
            (val[1] < acc[0][1]) ? val[1] : acc[0][1],
          ];
          const high = [
            (val[0] > acc[1][0]) ? val[0] : acc[1][0],
            (val[1] > acc[1][1]) ? val[1] : acc[1][1],
          ];
          return [low, high];
        }, [[eventBounds[0][0] - 0.01, eventBounds[0][1] - 0.01],
          [eventBounds[0][0] + 0.01, eventBounds[0][1] + 0.01]]);
        /* eslint react/no-did-update-set-state: 0 */
        this.setState({ mapBounds }); // safe to use due to prevProps check
      }
    }
  }

  componentWillUnmount() {
    const { setMapBounds } = this.props;
    if (this.mapRef.current) {
      const leafletMap = this.mapRef.current.leafletElement;
      const currentBounds = leafletMap.getBounds();
      const { _southWest: sw, _northEast: ne } = currentBounds;
      const currentBoundsAsArray = [[sw.lat, sw.lng], [ne.lat, ne.lng]];
      setMapBounds(currentBoundsAsArray);
    }
  }

  handleZoomEnd = () => {
    const leafletMap = this.mapRef.current.leafletElement;
    this.setState({ mapZoomLevel: leafletMap.getZoom() });
  }

  renderMapLocations = (events) => {
    const { mapZoomLevel } = this.state;
    const { handleSelectEvent, language } = this.props;
    return (
      events
        .filter(eventDetails => eventDetails.locLat && eventDetails.locLong)
        .map((eventDetails) => {
          const {
            _id: eventId,
            locLat,
            locLong,
            locCornerSW,
            locCornerNE,
            name,
            date,
          } = eventDetails;
          const flagMarkerPos = [locLat, locLong];
          const rectangleMarkerPos = [
            (locCornerSW[0] + locCornerNE[0]) / 2,
            (locCornerSW[1] + locCornerNE[1]) / 2,
          ];
          const rectangleBounds = [locCornerSW, locCornerNE];
          // const coords = [[locLat - 0.01, locLong - 0.01], [locLat + 0.01, locLong + 0.01]];
          if (!mapZoomLevel || mapZoomLevel < 12 || locCornerSW.length === 0) {
            return (
              <Marker
                key={eventId}
                position={flagMarkerPos}
                opacity={0.8}
                icon={iconFlag}
                onClick={() => handleSelectEvent(eventId)}
              >
                <Tooltip direction="center" offset={[0, 30]} className="event-map-flag-tooltip">
                  <div>{name}</div>
                  <div>{reformatTimestampDateOnly(date, language)}</div>
                </Tooltip>
              </Marker>
            );
          }
          // console.log('rectangleMarkerPos:', rectangleMarkerPos);
          // console.log('rectangleBounds:', rectangleBounds);
          return (
            <div key={eventId}>
              <Rectangle
                bounds={rectangleBounds}
                color="blue"
                onClick={() => handleSelectEvent(eventId)}
              />
              <Marker
                position={rectangleMarkerPos}
                opacity={0}
                icon={iconFlag}
              >
                <Tooltip direction="center" permanent className="event-map-box-tooltip">
                  <div>{name}</div>
                  <div>{reformatTimestampDateOnly(date, language)}</div>
                </Tooltip>
              </Marker>
            </div>
          );
        })
    );
  }

  render() {
    // const mapBoundsDefault = [[50, 14], [50.5, 14.5]];
    // console.log('current zoom:', this.state.mapZoomLevel);
    const { events } = this.props;
    const { mapBounds } = this.state;
    // console.log('mapBounds in state', mapBounds);
    // if (this.mapRef.current) {
    //   const leafletMap = this.mapRef.current.leafletElement;
    //   console.log('current bounds:', leafletMap.getBounds());
    //   // console.log('centre, zoom:', leafletMap.getCenter(), leafletMap.getZoom());
    // } else {
    //   console.log('no mapRef yet');
    // }
    // <p>is it here</p>
    return (
      <div className="ui segment">
        <Map
          ref={this.mapRef}
          bounds={mapBounds}
          onZoomEnd={this.handleZoomEnd}
        >
          <TileLayer attribution={osmAttr} url={osmTiles} />
          {this.renderMapLocations(events)}
        </Map>
      </div>
    );
  }
}

EventMap.propTypes = {
  events: PropTypes.arrayOf(PropTypes.any),
  handleSelectEvent: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  mapBounds: PropTypes.arrayOf(PropTypes.array),
  setMapBounds: PropTypes.func.isRequired,
  // selectEventForDetails: PropTypes.func.isRequired,
  // setEventViewModeEvent: PropTypes.func.isRequired,
};
EventMap.defaultProps = {
  events: [],
  mapBounds: null,
};

export default EventMap;
