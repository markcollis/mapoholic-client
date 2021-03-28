import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  Popup,
} from 'react-leaflet';
import iconFlag from '../../common/iconFlag';
import EventListItem from './EventListItem';
import getPolygonBounds from './getPolygonBounds';
import { MAP_TILES, MAP_CREDIT } from '../../config';

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
    } else if (events) {
      const eventBounds = events
        .filter((eventDetails) => eventDetails.locLat && eventDetails.locLong)
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
        .filter((eventDetails) => eventDetails.locLat && eventDetails.locLong)
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

  /* eslint-disable no-console */
  /* eslint-disable no-underscore-dangle */
  renderMapLocations = (events) => {
    const { mapZoomLevel } = this.state;
    const { currentUserId, handleSelectEvent, language } = this.props;
    const eventsWithLocation = events
      .filter((eventDetails) => eventDetails.locLat && eventDetails.locLong);
    // console.log('eventsWithLocation', eventsWithLocation);
    const eventsGroupedByLocation = {};
    eventsWithLocation.forEach((eventDetails) => {
      const locKey = `${eventDetails.locLat.toFixed(3)}:${eventDetails.locLong.toFixed(3)}`;
      if (eventsGroupedByLocation[locKey]) {
        eventsGroupedByLocation[locKey].push(eventDetails);
      } else {
        eventsGroupedByLocation[locKey] = [eventDetails];
      }
    });
    // console.log('eventsGroupedByLocation', eventsGroupedByLocation);
    const leafletGroupedMapLocations = Object.keys(eventsGroupedByLocation).map((locKey) => {
      const eventDetailsArray = eventsGroupedByLocation[locKey];
      const [locLat, locLong] = locKey.split(':');
      const eventListItemArray = eventDetailsArray.map((eventDetails) => (
        <EventListItem
          key={eventDetails._id}
          currentUserId={currentUserId}
          handleSelectEvent={handleSelectEvent}
          language={language}
          oevent={eventDetails}
          selectedEventId={eventDetails._id}
        />
      ));
      const eventBasicDetailsArray = eventDetailsArray.map((eventDetails) => {
        return <li>{`${eventDetails.date} - ${eventDetails.name}`}</li>;
      });
      const popup = <Popup className="event-map__popup">{eventListItemArray}</Popup>;
      const tooltip = (
        <Tooltip
          direction="right"
          offset={[20, 0]}
          className="event-map__tooltip"
        >
          <ul>
            {eventBasicDetailsArray}
          </ul>
          <p>click for more details and to select</p>
        </Tooltip>
      );
      const flagMarkerPos = [locLat, locLong]; // fallback
      const polygonBounds = getPolygonBounds(eventDetailsArray[0]); // assumption, probably untrue
      if (!mapZoomLevel || mapZoomLevel < 11 || polygonBounds.length < 3) {
        return (
          <Marker
            key={eventDetailsArray[0]._id}
            position={flagMarkerPos}
            opacity={0.8}
            icon={iconFlag}
          >
            {popup}
            {tooltip}
          </Marker>
        );
      }
      return (
        <div key={eventDetailsArray[0]._id}>
          <Polygon
            positions={polygonBounds}
            color="blue"
          >
            {popup}
            {tooltip}
          </Polygon>
        </div>
      );
    });
    return leafletGroupedMapLocations;
  }

  render() {
    const { events } = this.props;
    const { mapBounds } = this.state;
    return (
      <div className="ui segment">
        <Map
          ref={this.mapRef}
          bounds={mapBounds}
          onZoomEnd={this.handleZoomEnd}
        >
          <TileLayer attribution={MAP_CREDIT} url={MAP_TILES} />
          {this.renderMapLocations(events)}
        </Map>
      </div>
    );
  }
}

EventMap.propTypes = {
  currentUserId: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.any),
  handleSelectEvent: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  mapBounds: PropTypes.arrayOf(PropTypes.array),
  setMapBounds: PropTypes.func.isRequired,
};
EventMap.defaultProps = {
  currentUserId: null,
  events: [],
  mapBounds: null,
};

export default EventMap;
