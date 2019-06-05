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
import { reformatDate } from '../../common/conversions';

const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// const stamenTonerTiles = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
// const stamenTonerAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
// const mapCenter = [];

class EventMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapBounds: [[50, 14], [50.2, 14.2]],
      // mapCenter: [50.08, 14.42],
      mapZoomLevel: undefined,
    };
  }

  componentDidMount() {
    const { events } = this.props;
    // console.log('Event Map mounted - events:', events);
    const eventBounds = events
      .filter(eventDetails => eventDetails.locLat && eventDetails.locLong)
      .map((eventDetails) => {
        const {
          locLat,
          locLong,
        } = eventDetails;
        return [locLat, locLong];
      });
    // console.log('eventBounds:', eventBounds);
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
      // console.log('mapBounds:', mapBounds);
      this.setState({ mapBounds });
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
      // console.log('eventBounds:', eventBounds);
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
        // console.log('mapBounds:', mapBounds);
        /* eslint react/no-did-update-set-state: 0 */
        this.setState({ mapBounds }); // safe to use due to prevProps check
      }
    }
  }

  handleZoomEnd = () => {
    const leafletMap = this.mapRef.current.leafletElement;
    // console.log('Zoom level changed to: ', leafletMap.getZoom());
    this.setState({ mapZoomLevel: leafletMap.getZoom() });
  }

  renderMapLocations = (events) => {
    const { mapZoomLevel } = this.state;
    const { selectEventForDetails, setEventViewModeEvent } = this.props;
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
                onClick={() => {
                  selectEventForDetails(eventId);
                  setEventViewModeEvent('view');
                }}
              >
                <Tooltip direction="center" offset={[0, 30]} className="event-map-flag-tooltip">
                  <div>{name}</div>
                  <div>{reformatDate(date)}</div>
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
                onClick={() => {
                  selectEventForDetails(eventId);
                  setEventViewModeEvent('view');
                }}
              />
              <Marker
                position={rectangleMarkerPos}
                opacity={0}
                icon={iconFlag}
              >
                <Tooltip direction="center" permanent className="event-map-box-tooltip">
                  <div>{name}</div>
                  <div>{reformatDate(date)}</div>
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
    // console.log('mapBounds', mapBounds);
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
  selectEventForDetails: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
};
EventMap.defaultProps = {
  events: [],
};

export default EventMap;
