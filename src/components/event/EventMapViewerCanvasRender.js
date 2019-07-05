import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

class EventCourseMapCanvasRender extends Component {
  state = {
    isKeyDown: {
      // ArrowLeft: false,
      // ArrowRight: false,
      // ArrowUp: false,
      // ArrowDown: false,
    },
    isMouseDown: false,
    isMouseOver: false,
    maxPanStep: 10, // pixels
    mouseX: 0,
    mouseY: 0,
    panTimeInterval: 20, // milliseconds
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    scale: PropTypes.number,
    imageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    isLoading: PropTypes.bool,
    handlePanImage: PropTypes.func.isRequired,
    switchCourseRoute: PropTypes.func.isRequired,
    startZoomIn: PropTypes.func.isRequired,
    endZoomIn: PropTypes.func.isRequired,
    startZoomOut: PropTypes.func.isRequired,
    endZoomOut: PropTypes.func.isRequired,
    startRotateLeft: PropTypes.func.isRequired,
    endRotateLeft: PropTypes.func.isRequired,
    startRotateRight: PropTypes.func.isRequired,
    endRotateRight: PropTypes.func.isRequired,
  };

  static defaultProps = {
    left: null,
    width: null,
    height: null,
    scale: 1,
    imageSrc: '',
    imageAlt: 'a map',
    isLoading: false,
  };

  // want to respond to arrow keys (pan), +/- (zoom) and L/R (rotate) when hovering over img
  // mouse movement and button release may happen outside the boundary of the img
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleMouseUp, false);
    document.addEventListener('touchend', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    // document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleMouseUp, false);
    document.removeEventListener('touchend', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    // document.removeEventListener('touchmove', this.handleTouchMove, { passive: false });
  }

  handleTouchStart = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    // console.log('touchStart', e);
    // console.log('touches', e.touches);
    const touchPoint = e.touches[0];
    this.setState({
      isMouseDown: true,
      mouseX: touchPoint.clientX,
      mouseY: touchPoint.clientY,
    });
  }

  handleTouchMove = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    // console.log('touchMove touches', e.touches);
    const touchPoint = e.touches[0];
    const {
      handlePanImage,
      top,
      left,
    } = this.props;
    const { isMouseDown, mouseX, mouseY } = this.state;
    // console.log('state in handleTouchMove:', isMouseDown, mouseX, mouseY);
    if (isMouseDown) {
      const dX = touchPoint.clientX - mouseX;
      const dY = touchPoint.clientY - mouseY;
      this.setState({
        mouseX: touchPoint.clientX,
        mouseY: touchPoint.clientY,
      });
      handlePanImage(top + dY, left + dX);
    }
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
      mouseX: e.nativeEvent.clientX,
      mouseY: e.nativeEvent.clientY,
    });
  }

  handleMouseMove = (e) => {
    const {
      handlePanImage,
      top,
      left,
    } = this.props;
    const { isMouseDown, mouseX, mouseY } = this.state;
    if (isMouseDown) {
      const dX = e.clientX - mouseX;
      const dY = e.clientY - mouseY;
      this.setState({ mouseX: e.clientX, mouseY: e.clientY });
      handlePanImage(top + dY, left + dX);
    }
  }

  handleMouseUp = () => {
    this.setState({ isMouseDown: false });
  }

  handleDoubleClick = () => {
    const { switchCourseRoute } = this.props;
    switchCourseRoute();
  }

  handleMouseOver = () => {
    this.setState({ isMouseOver: true });
  }

  handleMouseOut = () => {
    this.setState({ isMouseOver: false });
  }

  handleKeyDown = (e) => {
    const {
      startZoomIn,
      startZoomOut,
      startRotateLeft,
      startRotateRight,
    } = this.props;
    const { isKeyDown, isMouseOver, maxPanStep } = this.state;
    // console.log('isKeyDown:', isKeyDown);
    if (isMouseOver) {
      const keyCode = e.code;
      if (!isKeyDown[keyCode]) {
        this.setState({ isKeyDown: { ...isKeyDown, [keyCode]: true } });
      }
      switch (keyCode) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            this.panKeyboard(keyCode, 1, maxPanStep);
          }
          return true;
        case 'Equal':
        case 'NumpadAdd':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startZoomIn();
          }
          break;
        case 'Minus':
        case 'NumpadSubtract':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startZoomOut();
          }
          break;
        case 'KeyL':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startRotateLeft();
          }
          break;
        case 'KeyR':
        case 'KeyP':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startRotateRight();
          }
          break;
        default: // pass on event for normal handling by browser
          return false;
      }
    }
    return false; // ignore keyboard when not hovering over image to allow scrolling
  }

  handleKeyUp = (e) => { // reset when no longer holding down arrow key
    const {
      endZoomIn,
      endZoomOut,
      endRotateLeft,
      endRotateRight,
    } = this.props;
    const { isKeyDown } = this.state;
    const keyCode = e.code;
    this.setState({ isKeyDown: { ...isKeyDown, [keyCode]: false } });
    switch (keyCode) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        break;
      case 'Equal':
      case 'NumpadAdd':
        e.preventDefault();
        endZoomIn();
        break;
      case 'Minus':
      case 'NumpadSubtract':
        e.preventDefault();
        endZoomOut();
        break;
      case 'KeyL':
        e.preventDefault();
        endRotateLeft();
        break;
      case 'KeyR':
      case 'KeyP':
        e.preventDefault();
        endRotateRight();
        break;
      default: // pass on event for normal handling by browser
    }
  }

  panKeyboard = (arrowKey, step, maxStep) => {
    const { handlePanImage, left, top } = this.props;
    const { isKeyDown, panTimeInterval } = this.state;
    if (isKeyDown[arrowKey]) {
      let newTop = top;
      let newLeft = left;
      if (arrowKey === 'ArrowLeft') newLeft -= step;
      if (arrowKey === 'ArrowRight') newLeft += step;
      if (arrowKey === 'ArrowUp') newTop -= step;
      if (arrowKey === 'ArrowDown') newTop += step;
      // console.log('top/left old/new', arrowKey, top, left, newTop, newLeft);
      handlePanImage(newTop, newLeft);
      const newStep = Math.min(step + 1, maxStep);
      setTimeout(() => this.panKeyboard(arrowKey, newStep, maxStep), panTimeInterval);
    }
  }

  render() {
    // console.log('props in EventMapViewerCanvasRender:', this.props);
    console.log('state in EventMapViewerCanvasRender:', this.state);
    const {
      width,
      height,
      left,
      top,
      rotate,
      scale,
      imageSrc,
      imageAlt,
      isLoading,
    } = this.props;
    const imageClass = 'event-map-viewer-canvas-render__map-image';
    const imageStyle = {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translateX(${(left) ? `${left}px` : 'auto'}) translateY(${top}px) scale(${scale}) rotate(${rotate}deg)`,
    };
    const imgToDisplay = (imageSrc === '')
      ? null
      : (
        <div className="event-map-viewer-canvas-render__canvas">
          <img
            className={imageClass}
            style={imageStyle}
            src={imageSrc}
            alt={imageAlt}
            onMouseDown={this.handleMouseDown}
            onMouseOut={this.handleMouseOut}
            onBlur={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
            onFocus={this.handleMouseOver}
            onDoubleClick={this.handleDoubleClick}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
          />
        </div>
      );
    return (isLoading)
      ? (
        <div className="ui segment event-map-viewer-canvas-render__loader">
          <div className="ui active dimmer">
            <div className="ui medium text loader">Loading...</div>
          </div>
        </div>
      )
      : imgToDisplay;
  }
}

export default EventCourseMapCanvasRender;
