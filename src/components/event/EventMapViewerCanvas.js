import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import EventMapViewerCanvasRender from './EventMapViewerCanvasRender';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint react/no-did-update-set-state: 0 */
/* eslint react/sort-comp: 0 */

class EventMapViewerCanvas extends Component {
  static propTypes = {
    mapImage: PropTypes.objectOf(PropTypes.any),
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    viewParameters: PropTypes.objectOf(PropTypes.any),
    setMapViewParameters: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
    isLoading: false,
    mouseDownZoomIn: false,
    mouseDownZoomOut: false,
    mouseDownRotateLeft: false,
    mouseDownRotateRight: false,
    rotateStep: 2, // in degrees
    zoomScaleFactor: 1.02,
  };

  componentDidMount() {
    const { viewParameters } = this.props;
    // console.log('EventMapViewerCanvas mounted, props:', this.props);
    this.loadImage(viewParameters);
  }

  componentDidUpdate(prevProps) {
    // console.log('EventMapViewerCanvas updated, props:', this.props);
    // console.log('props and state on update:', this.props, this.state);
    const {
      mapImage,
      containerWidth,
      containerHeight,
      viewParameters,
    } = this.props;
    // load image when container first initialised
    if (containerWidth && !prevProps.containerWidth) {
      // console.log('Loading image when container first initialised');
      this.loadImage(viewParameters);
    }
    // load image if maps change
    if (prevProps.mapImage.mapId !== mapImage.mapId
      || prevProps.mapImage.srcCourse !== mapImage.srcCourse
      || prevProps.mapImage.srcRoute !== mapImage.srcRoute) {
      // console.log('Loading image as mapId or URLs have changed');
      this.loadImage(viewParameters);
    }
    // reset when window size changes
    if (prevProps.containerWidth !== containerWidth
      || prevProps.containerHeight !== containerHeight) {
      const { width, height } = this.state;
      if (width && height) {
        const left = (containerWidth - width) / 2;
        const top = (containerHeight - height) / 2;
        // console.log('left, top calculated in componentDidUpdate:', left, top);
        this.setState({ // safe due to conditional
          left,
          top,
        });
        // console.log('state after window resize:', this.state);
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
    // console.log('width/height in loadImageSuccess:', imageWidth, imageHeight);
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
    // console.log('left, top, rotate, scale in loadImageSuccess:', left, top, rotate, scale);
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
      // console.log('started loading');
      this.setState({
        activeType,
        isLoading: true,
      }, () => {
        img.onload = () => {
          // console.log('img.onload');
          this.loadImageSuccess(img.width, img.height, viewParameters);
        };
        img.onerror = () => {
          // console.log('img.onerror');
          this.setState({
            activeType,
            isLoading: false,
          });
        };
      });
      img.src = mapImage[`src${activeType}`];
      // console.log('loading image:', img.src);
      const otherType = (activeType === 'Course') ? 'Route' : 'Course';
      if (mapImage[`src${otherType}`]) {
        const img2 = new Image();
        img2.src = mapImage[`src${otherType}`]; // load alternative in background
        // console.log('loading image 2:', img2.src);
      }
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
    // console.log('initial and current centres', initialCentre, currentCentre);
    const offsetX = currentCentre.x - initialCentre.x;
    const offsetY = currentCentre.y - initialCentre.y;
    if (mouseDownRotateLeft) {
      const deltaXfromX = offsetX * this.sinDeg(-rotateStep) * this.sinDeg(-rotateStep);
      const deltaYfromX = offsetX * this.sinDeg(-rotateStep) * this.cosDeg(-rotateStep);
      const deltaXfromY = offsetY * this.sinDeg(-rotateStep) * this.cosDeg(-rotateStep);
      const deltaYfromY = offsetY * this.sinDeg(-rotateStep) * this.sinDeg(-rotateStep);
      // console.log('deltas:', deltaXfromX, deltaYfromX, deltaXfromY, deltaYfromY);
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
      // console.log('deltas:', deltaXfromX, deltaYfromX, deltaXfromY, deltaYfromY);
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
      mouseDownZoomIn,
      mouseDownZoomOut,
      scale,
      zoomScaleFactor,
      initialCentre,
      top,
      left,
      width,
      height,
    } = this.state;
    const currentCentre = {
      x: left + width / 2,
      y: top + height / 2,
    };
    // console.log('state in zoom (scale/top/left):', scale, top, left);
    // console.log('initial and current centres', initialCentre, currentCentre);
    const offsetX = currentCentre.x - initialCentre.x;
    const offsetY = currentCentre.y - initialCentre.y;
    if (mouseDownZoomIn) {
      const deltaX = offsetX * (zoomScaleFactor - 1);
      const deltaY = offsetY * (zoomScaleFactor - 1);
      // console.log('deltas:', deltaX, deltaY);
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
      // console.log('deltas:', deltaX, deltaY);
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
    // console.log('this.mapRef in render:', this.mapRef);
    // console.log('this.state in render:', this.state);
    const { mapImage } = this.props;
    const {
      activeType,
      width,
      height,
      top,
      left,
      rotate,
      scale,
      isLoading,
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

    // <button // full screen (not done yet)
    //   className="ui button"
    //   type="button"
    //   onClick={() => this.handleFullScreen()}
    // >
    //   <i className="icon expand arrows alternate" />
    // </button>

    // console.log('mapImage:', mapImage);
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
            imageSrc={mapImage[`src${activeType}`]}
            imageAlt={mapImage[`alt${activeType}`]}
            isLoading={isLoading}
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
