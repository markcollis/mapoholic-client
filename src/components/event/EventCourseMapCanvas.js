import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EventCourseMapCanvas extends Component {
  state = {
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
  };

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number,
    top: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    scale: PropTypes.number,
    imageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    isLoading: PropTypes.bool,
    onResizeWindow: PropTypes.func.isRequired,
    onChangeImageState: PropTypes.func.isRequired,
    // onCanvasMouseDown: PropTypes.func.isRequired,
  };

  static defaultProps = {
    left: null,
    scale: 1,
    imageSrc: '',
    imageAlt: 'a map',
    isLoading: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    const { onResizeWindow } = this.props;
    onResizeWindow();
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

  handleCanvasMouseDown = (e) => {
    // const { onCanvasMouseDown } = this.props;
    // onCanvasMouseDown(e);
    this.handleMouseDown(e);
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
    const imageClass = 'event-course-map-img';
    const imageStyle = {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translateX(${(left) ? `${left}px` : 'auto'}) translateY(${top}px) rotate(${rotate}deg) scale(${scale})`,
    };
    const imgToDisplay = (imageSrc === '')
      ? null
      : (
        <div
          className="event-course-map-canvas"
          onMouseDown={this.handleCanvasMouseDown}
        >
          <img
            className={imageClass}
            src={imageSrc}
            alt={imageAlt}
            style={imageStyle}
            onMouseDown={this.handleMouseDown}
          />
        </div>
      );
    return (isLoading)
      ? <p>Loading...</p>
      : imgToDisplay;
  }
}

export default EventCourseMapCanvas;
