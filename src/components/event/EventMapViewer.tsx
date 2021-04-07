import React, { Component } from 'react';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';
import EventMapViewerCanvas from './EventMapViewerCanvas';
import EventMapViewerDetails from './EventMapViewerDetails';
import EventMapViewerGeo from './EventMapViewerGeo';
import EventMapViewerTracks from './EventMapViewerTracks';

import { OEvent, OEventMap } from '../../types/event';

type MapOverlay = {
  userId: string;
  displayName: string;
  courseTitle: string;
  mapTitle: string;
  overlay: string;
};

type MapImage = {
  mapId: string;
  title: string;
  empty: boolean;
  preferType?: string;
  srcCourse?: string | null;
  altCourse?: string | null;
  srcRoute?: string | null;
  altRoute?: string | null;
};

type MapParams = {
  eventId: string;
  userId: string;
  mapType: string;
  mapTitle: string;
};

type MapViewParams = {
  mapId: string;
  left: number;
  top: number;
  rotate: number;
  scale: number;
};

interface EventMapViewerProps {
  canEdit?: boolean;
  deleteMap: (params: MapParams) => void;
  mapViewParameters: { [key: string]: MapViewParams },
  postMap: (params: MapParams, mapToUpload: any, callback: (onSuccess: boolean) => void) => void;
  selectedEvent?: OEvent;
  selectedMap?: string;
  selectedRunner?: string;
  selectMapToDisplay: (mapId: string) => void;
  setMapViewParameters: (mapViewParams: MapViewParams) => void;
  updateEventRunner: (eventId: string, userId: string, maps: OEventMap[]) => void;
}

interface EventMapViewerState {
  mapContainerWidth: number | null;
  mapContainerHeight: number | null;
  showMapViewerDetails: boolean;
  selectedOverlays: string[];
}

// The EventMapViewer component is the top level container for all maps associated with
// a particular runner at a particular event
class EventMapViewer extends Component<EventMapViewerProps, EventMapViewerState> {
  static defaultProps = {
    canEdit: false,
    selectedRunner: '',
    selectedMap: '',
  };

  mapRef = React.createRef<HTMLDivElement>();

  state: EventMapViewerState = {
    mapContainerWidth: null,
    mapContainerHeight: null,
    showMapViewerDetails: false,
    selectedOverlays: [], // to be populated if any of the overlay checkboxes are ticked
  };

  componentDidMount() {
    this.setState({
      mapContainerWidth: this.mapRef.current && this.mapRef.current.offsetWidth,
      mapContainerHeight: this.mapRef.current && this.mapRef.current.offsetHeight,
    });
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidUpdate() {
    const {
      selectedEvent,
      selectedMap,
      selectedRunner,
    } = this.props;
    const mapImageArray = selectedEvent && selectedRunner
      ? this.getMapImageArray(selectedEvent, selectedRunner)
      : [];
    const hasMaps = (mapImageArray.length > 0);
    const selectedMapImage = mapImageArray.find((mapImage) => mapImage.mapId === selectedMap);
    if (hasMaps && !['tracks', 'geo'].includes(selectedMap || '') && !selectedMapImage) {
      this.handleSelectMapImage(mapImageArray[0].mapId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  // helper to get list of available overlays if input props have changed
  getOverlays = memoize((selectedEvent: OEvent): MapOverlay[] => {
    const overlays: MapOverlay[] = [];
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
  getMapImageArray = memoize((selectedEvent: OEvent, selectedRunner: string): MapImage[] => {
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find((runner) => {
        const { user } = runner;
        const { _id: runnerId } = user;
        return (runnerId === selectedRunner);
      })
      : null;
    const mapImages = (runnerData && runnerData.maps && runnerData.maps.length > 0)
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
        const hasCourseMap = Boolean(course && course !== '');
        const hasRouteMap = Boolean(route && route !== '');
        if (!hasCourseMap && !hasRouteMap) {
          return {
            mapId,
            title,
            empty: true,
          };
        }
        const preferType = ((defaultPreferType === 'Course' && hasCourseMap)
          || !hasRouteMap) ? 'Course' : 'Route';
        return {
          mapId,
          title,
          empty: false,
          preferType,
          srcCourse: (hasCourseMap) ? `${course}?${courseUpdated}` : null,
          altCourse: (hasCourseMap) ? `${(title === '') ? 'map' : title}: course` : null,
          srcRoute: (hasRouteMap) ? `${route}?${routeUpdated}` : null,
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
        mapContainerWidth: this.mapRef.current && this.mapRef.current.offsetWidth,
        mapContainerHeight: this.mapRef.current && this.mapRef.current.offsetHeight,
      });
    }
  }

  handleSelectMapImage = (mapId: string): void => {
    const { selectMapToDisplay } = this.props;
    selectMapToDisplay(mapId);
  }

  handleCheckboxChange = (filename: string): void => {
    const { selectedOverlays } = this.state;
    const position = selectedOverlays.indexOf(filename);
    if (position === -1) { // add to array
      const newSelectedOverlays = [...selectedOverlays, filename];
      this.setState({ selectedOverlays: newSelectedOverlays });
    } else { // remove from array
      const newSelectedOverlays = selectedOverlays.filter((el) => el !== filename);
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
    const mapImageArray = selectedEvent && selectedRunner
      ? this.getMapImageArray(selectedEvent, selectedRunner)
      : [];
    const hasMaps = (mapImageArray.length > 0);
    const overlays = selectedEvent ? this.getOverlays(selectedEvent) : [];
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
          tabIndex={0}
        >
          {addDeleteTitle}
        </button>
      )
      : null;
    const geoTab = (
      <div
        key="geo"
        role="button"
        className={(selectedMap === 'geo') ? 'active item' : 'item'}
        onClick={() => this.handleSelectMapImage('geo')}
        onKeyPress={() => this.handleSelectMapImage('geo')}
        tabIndex={0}
      >
        <Trans>Geo (beta)</Trans>
      </div>
    );
    const tracksTab = (
      <div
        key="tracks"
        role="button"
        className={(selectedMap === 'tracks') ? 'active item' : 'item'}
        onClick={() => this.handleSelectMapImage('tracks')}
        onKeyPress={() => this.handleSelectMapImage('tracks')}
        tabIndex={0}
      >
        <Trans>Tracks (beta)</Trans>
      </div>
    );
    const renderTabs = [
      ...mapImageArray.map((mapImage) => {
        const { mapId, title } = mapImage;
        const visible = (selectedMap === mapId);
        return (
          <div
            key={mapId}
            role="button"
            className={(visible) ? 'active item' : 'item'}
            onClick={() => this.handleSelectMapImage(mapId)}
            onKeyPress={() => this.handleSelectMapImage(mapId)}
            tabIndex={0}
          >
            {(title === '') ? <Trans>untitled</Trans> : title}
          </div>
        );
      }),
      tracksTab,
      geoTab,
    ];
    const renderTabsOrNoMaps = (hasMaps)
      ? renderTabs
      : <div className="item"><Trans>no maps found</Trans></div>;
    const renderGeo = selectedEvent && selectedRunner && selectedMap === 'geo'
      ? (
        <EventMapViewerGeo
          selectedEvent={selectedEvent}
          selectedRunner={selectedRunner}
        />
      )
      : null;
    const renderTracks = selectedEvent && selectedRunner && selectedMap === 'tracks'
      ? (
        <EventMapViewerTracks
          selectedEvent={selectedEvent}
          selectedRunner={selectedRunner}
          updateEventRunner={updateEventRunner}
        />
      )
      : null;
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
    const renderMapViewerDetails = selectedEvent && selectedRunner && (
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
          overlay: overlayPath,
        } = overlay;
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
            key={overlayPath}
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
    const renderOverlaySelector = (overlays.length > 0 && hasMaps && selectedMap && !['tracks', 'geo'].includes(selectedMap))
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

    const showMapContainer = (mapContainerHeight && mapContainerHeight > 0
      && (showMapViewerDetails || !hasMaps));
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
          {renderGeo}
          {renderTracks}
        </div>
        {renderMapViewerDetails}
        {renderOverlaySelector}
      </div>
    );
  }
}

export default EventMapViewer;
