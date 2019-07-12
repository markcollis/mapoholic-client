import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MAPOHOLIC_SERVER } from '../../config';

class EventThumbnails extends Component {
  static propTypes = {
    mapFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    requestRefreshCollapse: PropTypes.func.isRequired,
  };

  state = {
    currentIndex: 0,
  };

  handleThumbnailClick = () => {
    const { mapFiles } = this.props;
    const { currentIndex } = this.state;
    const newIndex = (currentIndex + 1) % mapFiles.length;
    this.setState({ currentIndex: newIndex });
  }

  render() {
    // console.log('props in EventThumbnails:', this.props);
    // console.log('state in EventThumbnails:', this.state);
    const { mapFiles, requestRefreshCollapse } = this.props;
    const { currentIndex } = this.state;
    if (!mapFiles || mapFiles.length === 0) return null;
    const mapFile = mapFiles[currentIndex];
    const { file, mapType, updated } = mapFile;
    return (
      <button
        className="event-thumbnails"
        type="button"
        onClick={this.handleThumbnailClick}
      >
        <img
          className="ui image"
          src={`${MAPOHOLIC_SERVER}/${file.slice(0, -4)}-thumb${file.slice(-4)}?${updated}}`}
          alt={`${mapType} thumbnail`}
          onLoad={() => {
            // console.log('image loaded!');
            requestRefreshCollapse();
          }}
        />
      </button>
    );
  }
}

export default EventThumbnails;
