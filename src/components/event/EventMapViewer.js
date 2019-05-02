import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventMapViewerCanvas from './EventMapViewerCanvas';
import EventMapViewerDetails from './EventMapViewerDetails';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

class EventMapViewer extends Component {
  static propTypes = {
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedRunner: PropTypes.string,
    selectedMap: PropTypes.string,
    selectMapToDisplay: PropTypes.func.isRequired,
    postMap: PropTypes.func.isRequired,
    deleteMap: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: {},
    selectedRunner: '',
    selectedMap: '',
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      // mapContainer: null,
      mapContainerWidth: null,
      mapContainerHeight: null,
      mapImageArray: [],
      showMapViewerDetails: false,
    };
  }

  componentDidMount() {
    this.setState({
      mapContainerWidth: this.mapRef.current.offsetWidth,
      mapContainerHeight: this.mapRef.current.offsetHeight,
    });
    window.addEventListener('resize', this.handleResize, false);
    this.createMapImageArray();
  }

  componentDidUpdate(prevProps) {
    const { selectedEvent, selectedRunner } = this.props;
    const { selectedEvent: prevSelEv, selectedRunner: prevSelRun } = prevProps;
    if (selectedEvent !== prevSelEv || selectedRunner !== prevSelRun) {
      this.createMapImageArray();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    const { showMapViewerDetails } = this.state;
    if (!showMapViewerDetails) { // i.e. only when map container is visible!
      this.setState({
        mapContainerWidth: this.mapRef.current.offsetWidth,
        mapContainerHeight: this.mapRef.current.offsetHeight,
      });
    }
  }

  createMapImageArray = (update = false) => {
    const {
      selectedEvent,
      selectedRunner,
      selectedMap,
      selectMapToDisplay,
    } = this.props;
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
      : null;
    const hasMaps = runnerData && runnerData.maps.length > 0;
    const now = new Date();
    const srcSuffix = (update) ? `?${now.getTime()}` : ''; // to force reload on change
    let hasVisibleMap = false;
    const mapImages = (hasMaps)
      ? runnerData.maps.map((map) => {
        const {
          _id: mapId,
          title,
          course,
          route,
        } = map;
        const defaultPreferType = 'Course'; // consider making a config option later?
        const hasCourseMap = (course && course !== '');
        const hasRouteMap = (route && route !== '');
        if (!hasCourseMap && !hasRouteMap) {
          return {
            mapId: mapId.toString(),
            title,
            empty: true,
          };
        }
        const isVisibleMap = (selectedMap === mapId.toString());
        hasVisibleMap = hasVisibleMap || isVisibleMap;
        const preferType = ((defaultPreferType === 'Course' && hasCourseMap)
          || (defaultPreferType === 'Route' && !hasRouteMap)) ? 'Course' : 'Route';
        return {
          mapId: mapId.toString(),
          title,
          empty: false,
          preferType,
          srcCourse: (hasCourseMap) ? `${OMAPFOLDER_SERVER}/${course}${srcSuffix}` : null,
          altCourse: (hasCourseMap) ? `${title} - course` : null,
          srcRoute: (hasRouteMap) ? `${OMAPFOLDER_SERVER}/${route}${srcSuffix}` : null,
          altRoute: (hasRouteMap) ? `${title} - route` : null,
        };
      })
      : [];
    if (hasMaps && !hasVisibleMap) {
      selectMapToDisplay(mapImages[0].mapId);
    }
    // console.log('new mapImageArray:', mapImages);
    this.setState({ mapImageArray: mapImages });
  }

  handleSelectMapImage = (mapId) => {
    const { selectMapToDisplay } = this.props;
    selectMapToDisplay(mapId);
  }

  render() {
    console.log('this.props in render:', this.props);
    console.log('this.state in render:', this.state);
    const {
      mapImageArray,
      showMapViewerDetails,
      mapContainerWidth,
      mapContainerHeight,
    } = this.state;
    const {
      selectedEvent,
      selectedRunner,
      selectedMap,
      postMap,
      deleteMap,
    } = this.props;
    const hasMaps = (mapImageArray.length > 0);
    const mapTitleList = (hasMaps) ? mapImageArray.map(mapImage => mapImage.title) : [];

    const addDeleteTitle = (showMapViewerDetails)
      ? <Trans>Return to map view</Trans>
      : <Trans>Add or Delete maps</Trans>;
    const renderAddDeleteButton = (
      <button
        type="button"
        className={(showMapViewerDetails) ? 'ui tiny button' : 'ui tiny button primary'}
        onClick={() => this.setState({ showMapViewerDetails: !showMapViewerDetails })}
        onKeyPress={() => this.setState({ showMapViewerDetails: !showMapViewerDetails })}
        tabIndex="0"
      >
        {addDeleteTitle}
      </button>
    );

    const renderTabs = (mapImageArray.length > 1)
      ? mapImageArray.map((mapImage) => {
        const { mapId, title } = mapImage;
        const visible = (selectedMap === mapId);
        return (
          <div
            key={mapId}
            role="button"
            className={(visible) ? 'active item' : 'item'}
            onClick={() => this.handleSelectMapImage(mapId)}
            onKeyPress={() => this.handleSelectMapImage(mapId)}
            tabIndex="0"
          >
            {title}
          </div>
        );
      })
      : null;
    const renderTabsOrNoMaps = (hasMaps)
      ? renderTabs
      : <div className="item"><Trans>no maps found</Trans></div>;
    const renderMaps = (hasMaps)
      ? mapImageArray.map((mapImage) => {
        const { mapId } = mapImage;
        const visible = (selectedMap === mapId);
        return (
          <div key={mapId} style={(visible) ? {} : { display: 'none' }}>
            <EventMapViewerCanvas
              mapImage={mapImage}
              containerWidth={mapContainerWidth}
              containerHeight={mapContainerHeight}
            />
          </div>
        );
      })
      : null;
    const renderMapViewerDetails = (
      <div style={(showMapViewerDetails) ? {} : { display: 'none' }}>
        <EventMapViewerDetails
          selectedEvent={selectedEvent}
          selectedRunner={selectedRunner}
          mapTitleList={mapTitleList}
          postMap={postMap}
          deleteMap={deleteMap}
          updateMapImageArray={() => this.createMapImageArray(true)}
        />
      </div>
    );
    const showMapContainer = (mapContainerHeight > 0 && (showMapViewerDetails || !hasMaps));
    return (
      <div className="ui segment">
        <div className="ui top attached tabular menu">
          <div className="item"><h3><Trans>Map Viewer</Trans></h3></div>
          {renderTabsOrNoMaps}
          <div className="right menu">
            <div className="item">
              {renderAddDeleteButton}
            </div>
          </div>
        </div>
        <div
          className="course-map-container"
          ref={this.mapRef}
          style={(showMapContainer) ? { display: 'none' } : {}}
        >
          {renderMaps}
        </div>
        {renderMapViewerDetails}
      </div>
    );
  }
}

export default EventMapViewer;
