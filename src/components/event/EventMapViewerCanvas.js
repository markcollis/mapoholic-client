import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import missingMap from '../../graphics/missingMap.jpg';

import EventMapViewerCanvasRender from './EventMapViewerCanvasRender';
/* eslint react/no-did-update-set-state: 0 */

// The EventMapViewerCanvas component renders an individual map and manages its
// size, position, rotation, zoom, etc.
class EventMapViewerCanvas extends Component {
  static propTypes = {
    overlays: PropTypes.arrayOf(PropTypes.string),
    mapImage: PropTypes.objectOf(PropTypes.any),
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    viewParameters: PropTypes.objectOf(PropTypes.any),
    setMapViewParameters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    overlays: [],
    mapImage: {},
    containerHeight: null,
    containerWidth: null,
    viewParameters: null, // i.e. first time this particular map has been viewed
  };

  state = { // detailed view state held locally, stored in Redux state
    // then restored on unmount/remount
    activeType: '', // Course or Route
    width: null,
    height: null,
    top: 15,
    left: null,
    rotate: 0,
    scale: 1,
    initialCentre: { x: 0, y: 0 },
    isLoading: false,
    loadingError: { Course: false, Route: false },
    mouseDownZoomIn: false,
    mouseDownZoomOut: false,
    mouseDownRotateLeft: false,
    mouseDownRotateRight: false,
    rotateStep: 2, // in degrees
    zoomScaleFactor: 1.02,
  };

  componentDidMount() {
    const { viewParameters } = this.props;
    this.loadImage(viewParameters);
  }

  componentDidUpdate(prevProps) {
    const {
      mapImage,
      containerWidth,
      containerHeight,
      viewParameters,
    } = this.props;
    // load image when container first initialised
    if (containerWidth && !prevProps.containerWidth) {
      this.loadImage(viewParameters);
    }
    // load image if maps change
    if (prevProps.mapImage.mapId !== mapImage.mapId
      || prevProps.mapImage.srcCourse !== mapImage.srcCourse
      || prevProps.mapImage.srcRoute !== mapImage.srcRoute) {
      this.loadImage(viewParameters);
    }
    // reset when window size changes
    if (prevProps.containerWidth !== containerWidth
      || prevProps.containerHeight !== containerHeight) {
      const { width, height } = this.state;
      if (width && height) {
        const left = (containerWidth - width) / 2;
        const top = (containerHeight - height) / 2;
        this.setState({ // safe due to conditional
          left,
          top,
        });
      }
    }
  }

  componentWillUnmount() {
    const { mapImage, setMapViewParameters } = this.props;
    const { mapId } = mapImage;
    const {
      left,
      top,
      rotate,
      scale,
    } = this.state;
    setMapViewParameters({
      mapId,
      left,
      top,
      rotate,
      scale,
    });
  }

  loadImageSuccess = (imageWidth, imageHeight, viewParameters) => {
    const { containerWidth, containerHeight } = this.props;
    const applyViewParameters = viewParameters;
    const adjustedHeight = containerHeight - 40; // allowing for toolbar
    let width = Math.min(containerWidth * 0.9, imageWidth);
    let height = imageHeight * (width / imageWidth);
    if (height > adjustedHeight * 0.9) {
      height = adjustedHeight * 0.9;
      width = imageWidth * (height / imageHeight);
    }
    const left = (applyViewParameters) ? viewParameters.left : (containerWidth - width) / 2;
    const top = (applyViewParameters) ? viewParameters.top : (adjustedHeight - height) / 2;
    const rotate = (applyViewParameters) ? viewParameters.rotate : 0;
    const scale = (applyViewParameters) ? viewParameters.scale : 1;
    this.setState({
      width,
      height,
      left,
      top,
      rotate,
      scale,
      initialCentre: { x: left + width / 2, y: top + height / 2 },
      isLoading: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
    });
  };

  loadImage = (viewParameters) => {
    const { mapImage } = this.props;
    if (mapImage && mapImage.empty) {
      this.setState({
        activeType: '',
        isLoading: false,
      });
    } else {
      const activeType = mapImage.preferType;
      const img = new Image();
      this.setState({
        activeType,
        isLoading: true,
      }, () => {
        img.onload = () => {
          this.loadImageSuccess(img.width, img.height, viewParameters);
          const otherType = (activeType === 'Course') ? 'Route' : 'Course';
          if (mapImage[`src${otherType}`]) {
            const img2 = new Image();
            img2.src = mapImage[`src${otherType}`]; // load alternative in background
          }
        };
        img.onerror = () => {
          const { loadingError: imgLoadingError } = this.state;
          this.setState({
            activeType,
            isLoading: false,
            loadingError: { ...imgLoadingError, [activeType]: true },
          });
          const otherType = (activeType === 'Course') ? 'Route' : 'Course';
          if (mapImage[`src${otherType}`]) {
            const img2 = new Image();
            img2.onload = () => {
              this.loadImageSuccess(img2.width, img2.height, viewParameters);
            };
            img2.onerror = () => {
              const { loadingError: img2LoadingError } = this.state;
              this.setState({
                loadingError: { ...img2LoadingError, [otherType]: true },
              });
            };
            img2.src = mapImage[`src${otherType}`]; // load alternative in background
          }
        };
      });
      img.src = mapImage[`src${activeType}`];
    }
  }

  // image panning controlled by mouse click and drag in EventMapViewerCanvasRender
  handlePanImage = (top, left) => {
    this.setState({ top, left });
  }

  // controlled by button (should only appear if there are both course and route maps)
  // and by double click in EventMapViewerCanvasRender
  switchCourseRoute = () => {
    const { mapImage } = this.props;
    const { activeType } = this.state;
    const hasCourseMap = mapImage.srcCourse;
    const hasRouteMap = mapImage.srcRoute;
    const newActiveType = ((activeType === 'Route' && hasCourseMap)
      || (activeType === 'Course' && !hasRouteMap)) ? 'Course' : 'Route';
    this.setState({ activeType: newActiveType });
  }

  sinDeg = angle => Math.sin(angle * Math.PI / 180);

  cosDeg = angle => Math.cos(angle * Math.PI / 180);

  rotate = () => {
    const {
      initialCentre,
      left,
      mouseDownRotateLeft,
      mouseDownRotateRight,
      rotate,
      rotateStep,
      top,
      width,
      height,
    } = this.state;
    const currentCentre = { x: left + width / 2, y: top + height / 2 };
    const offsetX = currentCentre.x - initialCentre.x;
    const offsetY = currentCentre.y - initialCentre.y;
    if (mouseDownRotateLeft) {
      const deltaXfromX = offsetX * this.sinDeg(-rotateStep) * this.sinDeg(-rotateStep);
      const deltaYfromX = offsetX * this.sinDeg(-rotateStep) * this.cosDeg(-rotateStep);
      const deltaXfromY = offsetY * this.sinDeg(-rotateStep) * this.cosDeg(-rotateStep);
      const deltaYfromY = offsetY * this.sinDeg(-rotateStep) * this.sinDeg(-rotateStep);
      this.setState({
        rotate: rotate - rotateStep,
        left: left - deltaXfromX - deltaXfromY,
        top: top + deltaYfromX + deltaYfromY,
      }, () => {
        window.requestAnimationFrame(this.rotate);
      });
    }
    if (mouseDownRotateRight) {
      const deltaXfromX = offsetX * this.sinDeg(rotateStep) * this.sinDeg(rotateStep);
      const deltaYfromX = offsetX * this.sinDeg(rotateStep) * this.cosDeg(rotateStep);
      const deltaXfromY = offsetY * this.sinDeg(rotateStep) * this.cosDeg(rotateStep);
      const deltaYfromY = offsetY * this.sinDeg(rotateStep) * this.sinDeg(rotateStep);
      this.setState({
        rotate: rotate + rotateStep,
        left: left - deltaXfromX - deltaXfromY,
        top: top + deltaYfromX + deltaYfromY,
      }, () => {
        window.requestAnimationFrame(this.rotate);
      });
    }
  }

  rotateTrigger = () => {
    window.requestAnimationFrame(this.rotate);
  }

  handleMouseDownRotateLeft = () => {
    this.setState({
      mouseDownRotateLeft: true,
      mouseDownRotateRight: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
    });
    this.rotateTrigger();
  }

  handleMouseUpRotateLeft = () => {
    this.setState({ mouseDownRotateLeft: false });
    this.rotateTrigger();
  }

  handleMouseDownRotateRight = () => {
    this.setState({
      mouseDownRotateLeft: false,
      mouseDownRotateRight: true,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
    });
    this.rotateTrigger();
  }

  handleMouseUpRotateRight = () => {
    this.setState({ mouseDownRotateRight: false });
    this.rotateTrigger();
  }

  zoom = () => {
    const {
      height,
      initialCentre,
      left,
      mouseDownZoomIn,
      mouseDownZoomOut,
      scale,
      top,
      width,
      zoomScaleFactor,
    } = this.state;
    const currentCentre = {
      x: left + width / 2,
      y: top + height / 2,
    };
    const offsetX = currentCentre.x - initialCentre.x;
    const offsetY = currentCentre.y - initialCentre.y;
    if (mouseDownZoomIn) {
      const deltaX = offsetX * (zoomScaleFactor - 1);
      const deltaY = offsetY * (zoomScaleFactor - 1);
      this.setState({
        scale: scale * zoomScaleFactor,
        top: top + deltaY,
        left: left + deltaX,
      }, () => {
        window.requestAnimationFrame(this.zoom);
      });
    }
    if (mouseDownZoomOut) {
      const deltaX = offsetX * (zoomScaleFactor - 1);
      const deltaY = offsetY * (zoomScaleFactor - 1);
      this.setState({
        scale: scale / zoomScaleFactor,
        top: top - deltaY,
        left: left - deltaX,
      }, () => {
        window.requestAnimationFrame(this.zoom);
      });
    }
  }

  zoomTrigger = () => {
    window.requestAnimationFrame(this.zoom);
  }

  handleMouseDownZoomIn = () => {
    this.setState({
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      mouseDownZoomIn: true,
      mouseDownZoomOut: false,
    });
    this.zoomTrigger();
  }

  handleMouseUpZoomIn = () => {
    this.setState({ mouseDownZoomIn: false });
    this.zoomTrigger();
  }

  handleMouseDownZoomOut = () => {
    this.setState({
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: true,
    });
    this.zoomTrigger();
  }

  handleMouseUpZoomOut = () => {
    this.setState({ mouseDownZoomOut: false });
    this.zoomTrigger();
  }

  render() {
    const { mapImage, overlays } = this.props;
    const {
      activeType,
      height,
      isLoading,
      loadingError,
      left,
      rotate,
      scale,
      top,
      width,
    } = this.state;

    const actionsToolbar = (
      <div
        className="event-map-viewer-canvas__toolbar"
        style={{ display: 'flex', justifyContent: 'center', zIndex: 10 }}
      >
        <div className="ui icon buttons">
          {(mapImage && mapImage.srcCourse && mapImage.srcRoute)
            ? (
              <button // toggle course/route if available
                className="ui button"
                type="button"
                onClick={() => this.switchCourseRoute()}
              >
                <i className="icon compass outline" />
              </button>
            )
            : null}
          <button // zoom in
            className="ui button"
            type="button"
            onMouseDown={() => this.handleMouseDownZoomIn()}
            onMouseUp={() => this.handleMouseUpZoomIn()}
            onMouseOut={() => this.handleMouseUpZoomIn()}
            onBlur={() => this.handleMouseUpZoomIn()}
            onTouchStart={() => this.handleMouseDownZoomIn()}
            onTouchEnd={() => this.handleMouseUpZoomIn()}
          >
            <i className="icon zoom-in" />
          </button>
          <button // zoom out
            className="ui button"
            type="button"
            onMouseDown={() => this.handleMouseDownZoomOut()}
            onMouseUp={() => this.handleMouseUpZoomOut()}
            onMouseOut={() => this.handleMouseUpZoomOut()}
            onBlur={() => this.handleMouseUpZoomOut()}
            onTouchStart={() => this.handleMouseDownZoomOut()}
            onTouchEnd={() => this.handleMouseUpZoomOut()}
          >
            <i className="icon zoom-out" />
          </button>
          <button // rotate left
            className="ui button"
            type="button"
            onMouseDown={() => this.handleMouseDownRotateLeft()}
            onMouseUp={() => this.handleMouseUpRotateLeft()}
            onMouseOut={() => this.handleMouseUpRotateLeft()}
            onBlur={() => this.handleMouseUpRotateLeft()}
            onTouchStart={() => this.handleMouseDownRotateLeft()}
            onTouchEnd={() => this.handleMouseUpRotateRight()}
          >
            <i className="icon undo alternate" />
          </button>
          <button // rotate right
            className="ui button"
            type="button"
            onMouseDown={() => this.handleMouseDownRotateRight()}
            onMouseUp={() => this.handleMouseUpRotateRight()}
            onMouseOut={() => this.handleMouseUpRotateRight()}
            onBlur={() => this.handleMouseUpRotateRight()}
            onTouchStart={() => this.handleMouseDownRotateRight()}
            onTouchEnd={() => this.handleMouseUpRotateRight()}
          >
            <i className="icon redo alternate" />
          </button>
          <button // reset
            className="ui button"
            type="button"
            onClick={() => this.loadImage()}
          >
            <i className="icon sync alternate" />
          </button>
          {((mapImage) && mapImage[`src${activeType}`])
            ? (
              <a // download
                className="ui button"
                href={mapImage[`src${activeType}`]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="icon download" />
              </a>
            )
            : null}
        </div>
      </div>
    );

    const imageSrc = (loadingError[activeType]) ? missingMap : mapImage[`src${activeType}`];
    const imageAlt = (loadingError[activeType]) ? 'Map could not be loaded' : mapImage[`alt${activeType}`];
    const mapsToDisplay = (mapImage && !mapImage.empty)
      ? (
        <div>
          <EventMapViewerCanvasRender
            width={width}
            height={height}
            left={left}
            top={top}
            rotate={rotate}
            scale={scale}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            isLoading={isLoading}
            overlays={overlays}
            handlePanImage={this.handlePanImage}
            switchCourseRoute={this.switchCourseRoute}
            startZoomIn={this.handleMouseDownZoomIn}
            endZoomIn={this.handleMouseUpZoomIn}
            startZoomOut={this.handleMouseDownZoomOut}
            endZoomOut={this.handleMouseUpZoomOut}
            startRotateLeft={this.handleMouseDownRotateLeft}
            endRotateLeft={this.handleMouseUpRotateLeft}
            startRotateRight={this.handleMouseDownRotateRight}
            endRotateRight={this.handleMouseUpRotateRight}
          />
          {actionsToolbar}
        </div>
      )
      : (
        <p><Trans>Sorry, there are no maps to display.</Trans></p>
      );
    return (
      <div>
        {mapsToDisplay}
      </div>
    );
  }
}

export default EventMapViewerCanvas;
