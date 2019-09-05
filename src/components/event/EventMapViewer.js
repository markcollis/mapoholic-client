import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';
import EventMapViewerCanvas from './EventMapViewerCanvas';
import EventMapViewerDetails from './EventMapViewerDetails';
import { MAPOHOLIC_SERVER } from '../../config';

// The EventMapViewer component is the top level container for all maps associated with
// a particular runner at a particular event
class EventMapViewer extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    deleteMap: PropTypes.func.isRequired,
    mapViewParameters: PropTypes.objectOf(PropTypes.any).isRequired,
    postMap: PropTypes.func.isRequired,
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedMap: PropTypes.string,
    selectedRunner: PropTypes.string,
    selectMapToDisplay: PropTypes.func.isRequired,
    setMapViewParameters: PropTypes.func.isRequired,
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
    showMapViewerDetails: false,
    selectedOverlays: [], // to be populated if any of the overlay checkboxes are ticked
  };

  componentDidMount() {
    this.setState({
      mapContainerWidth: this.mapRef.current.offsetWidth,
      mapContainerHeight: this.mapRef.current.offsetHeight,
    });
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  // helper to get list of available overlays if input props have changed
  getOverlays = memoize((selectedEvent) => {
    const overlays = [];
    const { runners } = selectedEvent;
    if (!runners || runners.length === 0) return overlays;
    runners.forEach((runner) => {
      const { maps, user, courseTitle } = runner;
      const outputCourseTitle = courseTitle || '';
      if (maps.length > 0) {
        maps.forEach((map) => {
          const { _id: userId, displayName } = user;
          const { overlay, overlayUpdated, title } = map;
          if (overlay && overlay !== '') {
            overlays.push({
              userId,
              displayName,
              courseTitle: outputCourseTitle,
              mapTitle: title,
              overlay: `${overlay}?${overlayUpdated}`,
            });
          }
        });
      }
    });
    return overlays;
  });

  // helper to derive mapImageArray if input props have changed (different event or runner)
  getMapImageArray = memoize((selectedEvent, selectedRunner) => {
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find((runner) => {
        const { user } = runner;
        const { _id: runnerId } = user;
        return (runnerId === selectedRunner);
      })
      : null;
    const hasMaps = runnerData && runnerData.maps.length > 0;
    const mapImages = (hasMaps)
      ? runnerData.maps.map((map) => {
        const {
          _id: mapId,
          title,
          course,
          route,
          courseUpdated,
          routeUpdated,
        } = map;
        const defaultPreferType = 'Course'; // consider making this a per-user config option later
        const hasCourseMap = (course && course !== '');
        const hasRouteMap = (route && route !== '');
        if (!hasCourseMap && !hasRouteMap) {
          return {
            mapId,
            title,
            empty: true,
          };
        }
        const preferType = ((defaultPreferType === 'Course' && hasCourseMap)
          || (defaultPreferType === 'Route' && !hasRouteMap)) ? 'Course' : 'Route';
        return {
          mapId,
          title,
          empty: false,
          preferType,
          srcCourse: (hasCourseMap) ? `${MAPOHOLIC_SERVER}/${course}?${courseUpdated}` : null,
          altCourse: (hasCourseMap) ? `${(title === '') ? 'map' : title}: course` : null,
          srcRoute: (hasRouteMap) ? `${MAPOHOLIC_SERVER}/${route}?${routeUpdated}` : null,
          altRoute: (hasRouteMap) ? `${(title === '') ? 'map' : title}: route` : null,
        };
      })
      : [];
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

  handleCheckboxChange = (filename) => {
    const { selectedOverlays } = this.state;
    const position = selectedOverlays.indexOf(filename);
    if (position === -1) { // add to array
      const newSelectedOverlays = [...selectedOverlays, filename];
      this.setState({ selectedOverlays: newSelectedOverlays });
    } else { // remove from array
      const newSelectedOverlays = selectedOverlays.filter(el => el !== filename);
      this.setState({ selectedOverlays: newSelectedOverlays });
    }
  }

  render() {
    const {
      mapContainerHeight,
      mapContainerWidth,
      showMapViewerDetails,
      selectedOverlays,
    } = this.state;
    const {
      canEdit,
      deleteMap,
      mapViewParameters,
      postMap,
      selectedEvent,
      selectedMap,
      selectedRunner,
      setMapViewParameters,
      updateEventRunner,
    } = this.props;
    const mapImageArray = this.getMapImageArray(selectedEvent, selectedRunner);
    const hasMaps = (mapImageArray.length > 0);
    const selectedMapImage = mapImageArray.find(mapImage => mapImage.mapId === selectedMap);
    if (hasMaps && !selectedMapImage) {
      this.handleSelectMapImage(mapImageArray[0].mapId);
    }
    const overlays = this.getOverlays(selectedEvent);
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
            {(title === '') ? <Trans>untitled</Trans> : title}
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
              viewParameters={mapViewParameters[mapId]}
              setMapViewParameters={setMapViewParameters}
              overlays={selectedOverlays}
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
        />
      </div>
    );
    const overlayCheckboxes = (overlays.length > 0)
      ? overlays.map((overlay) => {
        const {
          displayName,
          courseTitle,
          mapTitle,
          overlay: filename,
        } = overlay;
        const overlayPath = `${MAPOHOLIC_SERVER}/${filename}`;
        const overlayOrder = selectedOverlays.indexOf(overlayPath) + 1;
        const checked = (overlayOrder > 0);
        let routeName = displayName;
        if (courseTitle && courseTitle !== '') {
          if (mapTitle && mapTitle !== '') {
            routeName = `${displayName} (${courseTitle}/${mapTitle})`;
          } else {
            routeName = `${displayName} (${courseTitle})`;
          }
        } else if (mapTitle && mapTitle !== '') {
          routeName = `${displayName} (${mapTitle})`;
        }
        return (
          <li
            key={filename}
            className={`event-map-viewer-canvas-render__overlay-${overlayOrder}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => this.handleCheckboxChange(overlayPath)}
            />
            {routeName}
          </li>
        );
      })
      : null;
    const renderOverlaySelector = (overlays.length > 0 && hasMaps)
      ? (
        <div className="event-map-viewer__overlay-selector">
          <hr className="divider" />
          <label><Trans>Show routes as highlighted overlays:</Trans></label>
          <ul>
            {overlayCheckboxes}
          </ul>
          <p>
            <Trans>
            Note: The overlays will only be perfectly aligned if they were drawn on the
            same course map.
            </Trans>
          </p>
        </div>
      )
      : null;

    const showMapContainer = (mapContainerHeight > 0 && (showMapViewerDetails || !hasMaps));
    return (
      <div className="ui segment">
        <div className="ui top attached tabular menu stackable">
          <div className="item"><h3><Trans>Map Viewer</Trans></h3></div>
          {renderTabsOrNoMaps}
          <div className="right menu">
            <div className="item">
              {renderAddDeleteButton}
            </div>
          </div>
        </div>
        <div
          className="event-map-viewer__container"
          ref={this.mapRef}
          style={(showMapContainer) ? { display: 'none' } : {}}
        >
          {renderMaps}
        </div>
        {renderMapViewerDetails}
        {renderOverlaySelector}
      </div>
    );
  }
}

export default EventMapViewer;
