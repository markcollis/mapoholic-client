import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
// import Viewer from 'react-viewer';
// import Collapse from '../Collapse';
import EventCourseMapCanvas from './EventCourseMapCanvas';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import 'react-viewer/dist/index.css';

class EventCourseMap extends Component {
  static propTypes = {
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedRunner: PropTypes.string,
    // selectedMap: PropTypes.string,
    // selectMapToDisplay: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: {},
    selectedRunner: '',
    // selectedMap: '',
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapImageArray: [],
      mapActiveIndex: null,
      mapActiveType: '', // Course or Route
      mapShowInline: false,
      mapShowModal: false,
      mapContainer: null,
      containerWidth: null,
      containerHeight: null,
      width: 0,
      height: 0,
      top: 15,
      left: null,
      rotate: 0,
      scale: 1,
      imageWidth: 0,
      imageHeight: 0,
      isLoading: false,
      // loadFailed: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      rotateStep: 2, // in degrees
    };
  }

  componentDidMount() {
    // console.log('this.mapRef in componentDidMount:', this.mapRef);
    this.setState({
      mapContainer: this.mapRef.current,
      containerWidth: this.mapRef.current.offsetWidth,
      containerHeight: this.mapRef.current.offsetHeight,
      mapShowInline: true,
    });
    this.createMapImageArray();
  }

  componentDidUpdate(prevProps) {
    const { selectedEvent, selectedRunner } = this.props;
    const { selectedEvent: prevSelEv, selectedRunner: prevSelRun } = prevProps;
    if (selectedEvent !== prevSelEv || selectedRunner !== prevSelRun) {
      this.createMapImageArray();
    }
  }

  createMapImageArray = () => {
    const { selectedEvent, selectedRunner } = this.props;
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
      : null;
    const hasMaps = runnerData && runnerData.maps.length > 0;
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
            empty: true,
          };
        }
        const preferType = ((defaultPreferType === 'Course' && hasCourseMap)
          || (defaultPreferType === 'Route' && !hasRouteMap)) ? 'Course' : 'Route';
        return {
          mapId: mapId.toString(),
          title,
          empty: false,
          preferType,
          srcCourse: (hasCourseMap) ? `${OMAPFOLDER_SERVER}/${course}` : null,
          altCourse: (hasCourseMap) ? `${title} - course` : null,
          srcRoute: (hasRouteMap) ? `${OMAPFOLDER_SERVER}/${route}` : null,
          altRoute: (hasRouteMap) ? `${title} - route` : null,
        };
      })
      : [];
    this.setState({ mapImageArray: mapImages }, () => {
      if (mapImages.length > 0) this.handleChangeImage(0);
    });
  }

  handleChangeToModal = () => {
    this.setState({ mapShowModal: true });
  }

  handleResizeWindow = () => {
    const { width, height } = this.state;
    const containerWidth = this.mapRef.current.offsetWidth;
    const containerHeight = this.mapRef.current.offsetHeight;
    const left = (containerWidth - width) / 2;
    const top = (containerHeight - height) / 2;
    this.setState({
      containerWidth,
      containerHeight,
      left,
      top,
    });
    // console.log('state after window resize:', this.state);
  }

  loadImageSuccess = (imageWidth, imageHeight) => {
    const { containerWidth, containerHeight } = this.state;
    let width = Math.min(containerWidth * 0.9, imageWidth);
    let height = imageHeight * (width / imageWidth);
    if (height > containerHeight * 0.9) {
      height = containerHeight * 0.9;
      width = imageWidth * (height / imageHeight);
    }
    const left = (containerWidth - width) / 2;
    const top = (containerHeight - height) / 2;
    this.setState({
      width,
      height,
      left,
      top,
      imageWidth,
      imageHeight,
      loading: false,
      rotate: 0,
      scale: 1,
      mouseDownZoomIn: false,
      mouseDownZoomOut: false,
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
    });
  }

  loadImage = (index, type = null) => {
    const { mapImageArray } = this.state;
    const activeImage = (mapImageArray.length > 0) ? mapImageArray[index] : null;
    if (activeImage && activeImage.empty) {
      this.setState({
        mapActiveIndex: index,
        mapActiveType: '',
        loading: false,
        imageWidth: 0,
        imageHeight: 0,
      });
    } else {
      const activeType = type || activeImage.preferType;
      let loadComplete = false;
      const img = new Image();
      this.setState({
        mapActiveIndex: index,
        mapActiveType: activeType,
        loading: true,
      }, () => {
        img.onload = () => {
          if (!loadComplete) this.loadImageSuccess(img.width, img.height);
        };
        img.onerror = () => {
          this.setState({
            mapActiveIndex: index,
            mapActiveType: activeType,
            loading: false,
            imageWidth: 0,
            imageHeight: 0,
          });
        };
      });
      img.src = activeImage[`src${activeType}`];
      if (img.complete) {
        loadComplete = true;
        this.loadImageSuccess(img.width, img.height);
      }
    }
  }

  handleChangeImage = (index) => {
    const { mapImageArray } = this.state;
    let newIndex = index;
    if (index > mapImageArray.length - 1) newIndex = 0; // wrap high
    if (index < 0) newIndex = mapImageArray.length - 1; // wrap low
    this.loadImage(newIndex);
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
    const { mapImageArray, mapActiveIndex, mapActiveType } = this.state;
    const hasCourseMap = !!mapImageArray[mapActiveIndex].srcCourse;
    const hasRouteMap = !!mapImageArray[mapActiveIndex].srcRoute;
    const newActiveType = ((mapActiveType === 'Route' && hasCourseMap)
      || (mapActiveType === 'Course' && !hasRouteMap)) ? 'Course' : 'Route';
    this.setState({ mapActiveType: newActiveType });
    if (mapActiveType !== newActiveType) this.loadImage(mapActiveIndex, newActiveType);
  }

  // handleFullScreen = () => {}

  // handleRotate = (angle) => {
  //   console.log('angle:', angle);
  //   const { rotate } = this.state;
  //   this.setState({ rotate: rotate + angle });
  // }

  // getImageCentre = () => {
  //   const {
  //     width,
  //     height,
  //     left,
  //     top,
  //   } = this.state;
  //   return {
  //     x: left + width / 2,
  //     y: top + height / 2,
  //   };
  // };

  // handleZoom = (change) => {
  //   // const imageCentre = this.getImageCentre();
  //   console.log('change:', change);
  //   // console.log('imageCentre:', imageCentre);
  //   const { scale } = this.state;
  //   const newScale = scale * change;
  //   this.setState({ scale: newScale });
  // }

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

  zoomIn = () => { // could improve by tracking centre of view
    const { mouseDownZoomIn, scale } = this.state;
    if (mouseDownZoomIn) {
      this.setState({ scale: scale * 1.02 }, () => {
        window.requestAnimationFrame(this.zoomIn);
      });
    }
  }

  zoomInTrigger = () => {
    window.requestAnimationFrame(this.zoomIn);
  }

  handleMouseDownZoomIn = () => {
    this.setState({
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      mouseDownZoomIn: true,
      mouseDownZoomOut: false,
    });
    this.zoomInTrigger();
  }

  handleMouseUpZoomIn = () => {
    this.setState({ mouseDownZoomIn: false });
    this.zoomInTrigger();
  }

  zoomOut = () => {
    const { mouseDownZoomOut, scale } = this.state;
    if (mouseDownZoomOut) {
      this.setState({ scale: scale / 1.02 }, () => {
        window.requestAnimationFrame(this.zoomOut);
      });
    }
  }

  zoomOutTrigger = () => {
    window.requestAnimationFrame(this.zoomOut);
  }

  handleMouseDownZoomOut = () => {
    this.setState({
      mouseDownRotateLeft: false,
      mouseDownRotateRight: false,
      mouseDownZoomIn: false,
      mouseDownZoomOut: true,
    });
    this.zoomOutTrigger();
  }

  handleMouseUpZoomOut = () => {
    this.setState({ mouseDownZoomOut: false });
    this.zoomOutTrigger();
  }

  render() {
    // console.log('this.mapRef in render:', this.mapRef);
    console.log('this.state in render:', this.state);
    const {
      mapActiveIndex,
      mapActiveType,
      // mapContainer,
      mapImageArray,
      // mapShowInline,
      mapShowModal,
      width,
      height,
      top,
      left,
      rotate,
      scale,
      isLoading,
    } = this.state;
    // console.log('mapContainer in render:', mapContainer);
    const hasMaps = (mapImageArray.length > 0);
    const activeImage = (hasMaps) ? mapImageArray[mapActiveIndex] : {};
    // change index to select different maps
    const mapTitles = (hasMaps) ? mapImageArray.map(map => map.title) : null;
    // const mapTitlesList = (mapTitles) ? mapTitles.join(', ') : '';

    const actionsToolbar = (
      <div
        className="event-course-map-toolbar"
        style={{ display: 'flex', justifyContent: 'center', zIndex: 10 }}
      >
        <div className="ui icon buttons">
          {(activeImage && activeImage.srcCourse && activeImage.srcRoute)
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
          {(mapImageArray.length > 1)
            ? (
              <button // previous map
                className="ui button"
                type="button"
                onClick={() => this.handleChangeImage(mapActiveIndex - 1)}
              >
                <i className="icon arrow left" />
              </button>
            )
            : null}
          {(mapImageArray.length > 1)
            ? (
              <button // next map
                className="ui button"
                type="button"
                onClick={() => this.handleChangeImage(mapActiveIndex + 1)}
              >
                <i className="icon arrow right" />
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
            onClick={() => this.loadImage(mapActiveIndex)}
          >
            <i className="icon sync alternate" />
          </button>
          {((activeImage) && activeImage[`src${mapActiveType}`])
            ? (
              <a // download
                className="ui button"
                href={activeImage[`src${mapActiveType}`]}
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

    const mapsToDisplay = (hasMaps)
      ? (
        <div>
          {(activeImage)
            ? (
              <div>
                {actionsToolbar}
                <EventCourseMapCanvas
                  width={width}
                  height={height}
                  left={left}
                  top={top}
                  rotate={rotate}
                  scale={scale}
                  imageSrc={activeImage[`src${mapActiveType}`]}
                  imageAlt={activeImage[`alt${mapActiveType}`]}
                  isLoading={isLoading}
                  onResizeWindow={this.handleResizeWindow}
                  onChangeImageState={this.handleChangeImageState}
                  // onCanvasMouseDown={() => {}}
                />
              </div>
            )
            : null}
          {(mapShowModal) ? (
            <div>
              <p>Show modal version</p>
            </div>
          )
            : null}
        </div>
      )
      : (
        <p><Trans>Sorry, there are no maps to display.</Trans></p>
      );
    // const title = <Trans>Course Map</Trans>;
    // <h3 className="header"><Trans>Course Map</Trans></h3>
    // <p>{`There are ${mapImageArray.length} maps to display (${mapTitlesList}).`}</p>
    return (
      <div className="ui segment">
        <div className="ui top attached tabular menu">
          <div className="item"><Trans>Map Viewer</Trans></div>
          {(mapTitles && mapTitles.length > 1)
            ? mapTitles.map((title, index) => {
              if (activeImage && title === activeImage.title) {
                return <div key={title} className="active item">{title}</div>;
              }
              return (
                <div
                  key={title}
                  role="button"
                  className="item"
                  onClick={() => this.handleChangeImage(index)}
                  onKeyPress={() => this.handleChangeImage(index)}
                  tabIndex="0"
                >
                  {title}
                </div>
              );
            })
            : null}
          <div className="right menu">
            <div className="item"><Trans>Add or Delete maps</Trans></div>
          </div>
        </div>
        <div className="course-map-container" ref={this.mapRef}>
          {mapsToDisplay}
        </div>
        <p>something afterwards</p>
      </div>
    );
  }
}

export default EventCourseMap;
