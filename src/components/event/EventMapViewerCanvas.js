import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import EventMapViewerCanvasRender from './EventMapViewerCanvasRender';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint react/no-did-update-set-state: 0 */

class EventMapViewerCanvas extends Component {
  static propTypes = {
    mapImage: PropTypes.objectOf(PropTypes.any),
    containerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
  };

  static defaultProps = {
    mapImage: {},
    containerHeight: null,
    containerWidth: null,
  };

  constructor(props) {
    super(props);
    this.state = { // detailed view state held locally, reset when component remounted
      // could handle centrally in redux state, need to decide if this is important or not?
      activeType: '', // Course or Route
      width: 0,
      height: 0,
      top: 15,
      left: null,
      rotate: 0,
      scale: 1,
      // imageWidth: 0,
      // imageHeight: 0,
      isLoading: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      rotateStep: 2, // in degrees
      zoomScaleFactor: 1.02,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    const { mapImage, containerWidth, containerHeight } = this.props;
    if (prevProps.mapImage.mapId !== mapImage.mapId
      || prevProps.mapImage.srcCourse !== mapImage.srcCourse
      || prevProps.mapImage.srcRoute !== mapImage.srcRoute) {
      this.loadImage();
    }
    if (prevProps.containerWidth !== containerWidth
      || prevProps.containerHeight !== containerHeight) {
      const { width, height } = this.state;
      const left = (containerWidth - width) / 2;
      const top = (containerHeight - height) / 2;
      this.setState({ // safe due to conditional
        left,
        top,
      });
      // console.log('state after window resize:', this.state);
    }
  }

  loadImageSuccess = (imageWidth, imageHeight) => {
    // console.log('width/height in loadImageSuccess:', imageWidth, imageHeight);
    const { containerWidth, containerHeight } = this.props;
    const adjustedHeight = containerHeight - 40; // allowing for toolbar
    let width = Math.min(containerWidth * 0.9, imageWidth);
    let height = imageHeight * (width / imageWidth);
    if (height > adjustedHeight * 0.9) {
      height = adjustedHeight * 0.9;
      width = imageWidth * (height / imageHeight);
    }
    const left = (containerWidth - width) / 2;
    const top = (adjustedHeight - height) / 2;
    this.setState({
      width,
      height,
      left,
      top,
      centre: { x: left + width / 2, y: top + height / 2 },
      // imageWidth,
      // imageHeight,
      isLoading: false,
      rotate: 0,
      scale: 1,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
    });
  }

  loadImage = (type = null) => {
    // console.log('loadImage triggered');
    const { mapImage } = this.props;
    if (mapImage && mapImage.empty) {
      this.setState({
        activeType: '',
        isLoading: false,
        // imageWidth: 0,
        // imageHeight: 0,
      });
    } else {
      const activeType = type || mapImage.preferType;
      let loadComplete = false;
      const img = new Image();
      this.setState({
        activeType,
        isLoading: true,
      }, () => {
        img.onload = () => {
          // console.log('img.onload');
          if (!loadComplete) this.loadImageSuccess(img.width, img.height);
        };
        img.onerror = () => {
          // console.log('img.onerror');
          this.setState({
            activeType,
            isLoading: false,
            // imageWidth: 0,
            // imageHeight: 0,
          });
        };
      });
      img.src = mapImage[`src${activeType}`];
      const otherType = (activeType === 'Course') ? 'Route' : 'Course';
      if (mapImage[`src${otherType}`]) {
        const img2 = new Image();
        img2.src = mapImage[`src${otherType}`]; // load alternative in background
      }
      if (img.complete) {
        // console.log('img.complete');
        loadComplete = true;
        this.loadImageSuccess(img.width, img.height);
      }
    }
  }

  handleChangeImageState = (width, height, top, left) => {
    this.setState({
      width,
      height,
      top,
      left,
    });
  }

  switchCourseRoute = () => {
    const { mapImage } = this.props;
    const { activeType } = this.state;
    const hasCourseMap = mapImage.srcCourse;
    const hasRouteMap = mapImage.srcRoute;
    const newActiveType = ((activeType === 'Route' && hasCourseMap)
      || (activeType === 'Course' && !hasRouteMap)) ? 'Course' : 'Route';
    this.setState({ activeType: newActiveType });
    // if (activeType !== newActiveType) this.loadImage(newActiveType);
  }

  getCurrentCentre = () => {
    const {
      width,
      height,
      left,
      top,
    } = this.state;
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  };

  rotate = () => {
    const {
      mouseDownRotateLeft,
      mouseDownRotateRight,
      rotate,
      rotateStep,
    } = this.state;
    if (mouseDownRotateLeft) {
      this.setState({ rotate: rotate - rotateStep }, () => {
        window.requestAnimationFrame(this.rotate);
      });
    }
    if (mouseDownRotateRight) {
      this.setState({ rotate: rotate + rotateStep }, () => {
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

  zoom = () => { // could improve by tracking centre of view
    const {
      mouseDownZoomIn,
      mouseDownZoomOut,
      scale,
      zoomScaleFactor,
      centre,
      top,
      left,
    } = this.state;
    const currentCentre = this.getCurrentCentre();
    // console.log('centre:', centre);
    // console.log('currentCentre:', currentCentre);
    const dX = currentCentre.x - centre.x;
    const dY = currentCentre.y - centre.y;
    if (mouseDownZoomIn) {
      // console.log('dX, dY', dX, dY);
      // console.log('scale', scale);
      // console.log('zoomScaleFactor', zoomScaleFactor);
      // console.log('left, top', left, top);
      this.setState({
        scale: scale * zoomScaleFactor,
        top: top + dY * (zoomScaleFactor - 1),
        left: left + dX * (zoomScaleFactor - 1),
      }, () => {
        window.requestAnimationFrame(this.zoom);
      });
    }
    if (mouseDownZoomOut) {
      this.setState({
        scale: scale / zoomScaleFactor,
        top: top - dY * (zoomScaleFactor - 1),
        left: left - dX * (zoomScaleFactor - 1),
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
        className="event-course-map-toolbar"
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
            // data-tooltip="zoom in"
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
            onChangeImageState={this.handleChangeImageState}
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
