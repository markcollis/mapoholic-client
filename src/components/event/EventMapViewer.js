import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';
import EventMapViewerCanvas from './EventMapViewerCanvas';
import EventMapViewerDetails from './EventMapViewerDetails';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

class EventMapViewer extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    deleteMap: PropTypes.func.isRequired,
    postMap: PropTypes.func.isRequired,
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedMap: PropTypes.string,
    selectedRunner: PropTypes.string,
    selectMapToDisplay: PropTypes.func.isRequired,
    updateEventRunner: PropTypes.func.isRequired,
  };

  static defaultProps = {
    canEdit: false,
    selectedEvent: {},
    selectedRunner: '',
    selectedMap: '',
  };

  mapRef = React.createRef();

  state = {
    mapContainerWidth: null,
    mapContainerHeight: null,
    mapUpdates: 0,
    showMapViewerDetails: false,
  };

  componentDidMount() {
    // console.log('EventMapViewer mounted, props:', this.props);
    this.setState({
      mapContainerWidth: this.mapRef.current.offsetWidth,
      mapContainerHeight: this.mapRef.current.offsetHeight,
    });
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidUpdate() {
    const {
      selectedEvent,
      selectedMap,
      selectedRunner,
    } = this.props;
    const { mapUpdates } = this.state;
    const mapImageArray = this.getMapImageArray(selectedEvent._id, selectedRunner, mapUpdates);
    const hasMaps = mapImageArray.length > 0;
    const selectedMapImage = mapImageArray.find(mapImage => mapImage.mapId === selectedMap);
    if (hasMaps && !selectedMapImage) {
      // console.log('selecting map to display');
      this.handleSelectMapImage(mapImageArray[0].mapId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  // helper to derive mapImageArray if input props have changed (different event or runner)
  getMapImageArray = memoize((selectedEventId, selectedRunner, mapUpdates) => {
    // console.log('getMapImageArray called:', selectedEventId, selectedRunner, mapUpdates);
    const { selectedEvent } = this.props;
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
      : null;
    const hasMaps = runnerData && runnerData.maps.length > 0;
    const now = new Date();
    const srcSuffix = (mapUpdates > 0) ? `?${now.getTime()}` : ''; // to force reload if image changed
    // let hasVisibleMap = false;
    const mapImages = (hasMaps)
      ? runnerData.maps.map((map) => {
        const {
          _id: mapId,
          title,
          course,
          route,
        } = map;
        const defaultPreferType = 'Course'; // consider making this a config option later?
        const hasCourseMap = (course && course !== '');
        const hasRouteMap = (route && route !== '');
        if (!hasCourseMap && !hasRouteMap) {
          return {
            mapId: mapId.toString(),
            title,
            empty: true,
          };
        }
        // const isVisibleMap = (selectedMap === mapId.toString());
        // hasVisibleMap = hasVisibleMap || isVisibleMap;
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
    // console.log('new mapImageArray:', mapImages);
    return mapImages;
  });

  handleResize = () => {
    const { showMapViewerDetails } = this.state;
    if (!showMapViewerDetails) { // i.e. only when map container is visible
      this.setState({
        mapContainerWidth: this.mapRef.current.offsetWidth,
        mapContainerHeight: this.mapRef.current.offsetHeight,
      });
    }
  }

  handleSelectMapImage = (mapId) => {
    const { selectMapToDisplay } = this.props;
    selectMapToDisplay(mapId);
  }

  handleMapUpdated = () => {
    const { mapUpdates } = this.state;
    this.setState({ mapUpdates: mapUpdates + 1 });
  }

  render() {
    // console.log('this.props in EventMapViewer:', this.props);
    // console.log('this.state in EventMapViewer:', this.state);
    const {
      mapContainerHeight,
      mapContainerWidth,
      mapUpdates,
      showMapViewerDetails,
    } = this.state;
    const {
      canEdit,
      deleteMap,
      postMap,
      selectedEvent,
      selectedMap,
      selectedRunner,
      updateEventRunner,
    } = this.props;
    const mapImageArray = this.getMapImageArray(selectedEvent._id, selectedRunner, mapUpdates);
    // console.log('mapImageArray returned:', mapImageArray);
    const hasMaps = (mapImageArray.length > 0);
    const addDeleteTitle = (showMapViewerDetails)
      ? <Trans>Return to map view</Trans>
      : <Trans>Add or Delete maps</Trans>;
    const renderAddDeleteButton = (canEdit)
      ? (
        <button
          type="button"
          className={(showMapViewerDetails) ? 'ui tiny button' : 'ui tiny button primary'}
          onClick={() => this.setState({ showMapViewerDetails: !showMapViewerDetails })}
          onKeyPress={() => this.setState({ showMapViewerDetails: !showMapViewerDetails })}
          tabIndex="0"
        >
          {addDeleteTitle}
        </button>
      )
      : null;
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
            {(title === '') ? 'untitled' : title}
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
        <p />
        <EventMapViewerDetails
          deleteMap={deleteMap}
          postMap={postMap}
          selectedEvent={selectedEvent}
          selectedRunner={selectedRunner}
          updateEventRunner={updateEventRunner}
          updateMapImageArray={() => this.handleMapUpdated()}
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
