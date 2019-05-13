import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
// click and drag for panning - add buttons as alterative

class EventCourseMapCanvasRender extends Component {
  state = {
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
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
    onChangeImageState: PropTypes.func.isRequired,
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

  componentDidMount() {
    document.addEventListener('click', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
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
      onChangeImageState,
      width,
      height,
      top,
      left,
    } = this.props;
    const { isMouseDown, mouseX, mouseY } = this.state;
    if (isMouseDown) {
      const dX = e.clientX - mouseX;
      const dY = e.clientY - mouseY;
      this.setState({ mouseX: e.clientX, mouseY: e.clientY });
      onChangeImageState(width, height, top + dY, left + dX);
    }
  }

  handleMouseUp = () => {
    this.setState({ isMouseDown: false });
  }

  render() {
    // console.log('props in EventMapViewerCanvasRender:', this.props);
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
    // what are the image coordinates of the current centre of view?
    // possibly use as transform-origin
    const imageClass = 'event-course-map-img';
    const imageStyle = {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translateX(${(left) ? `${left}px` : 'auto'}) translateY(${top}px) rotate(${rotate}deg) scale(${scale})`,
      // transformOrigin: 'top left',
    };
    const imgToDisplay = (imageSrc === '')
      ? null
      : (
        <div
          className="event-course-map-canvas"
          // onMouseDown={this.handleCanvasMouseDown}
        >
          <img
            className={imageClass}
            style={imageStyle}
            src={imageSrc}
            alt={imageAlt}
            onMouseDown={this.handleMouseDown}
          />
        </div>
      );
    return (isLoading)
      ? (
        <div className="ui segment event-course-map-loader">
          <div className="ui active dimmer">
            <div className="ui medium text loader">Loading...</div>
          </div>
        </div>
      )
      : imgToDisplay;
  }
}

export default EventCourseMapCanvasRender;
