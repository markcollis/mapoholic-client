import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Viewer from 'react-viewer';
import Collapse from '../Collapse';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import 'react-viewer/dist/index.css';

class EventCourseMap extends Component {
  static propTypes = {
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedRunner: PropTypes.string,
    selectedMap: PropTypes.string,
    selectMapToDisplay: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: {},
    selectedRunner: '',
    selectedMap: '',
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapActiveIndex: 0,
      mapShowInline: false,
      mapShowModal: false,
      mapContainer: null,
    };
  }

  componentDidMount() {
    console.log('this.mapRef in componentDidMount:', this.mapRef);
    this.setState({ mapContainer: this.mapRef.current, mapShowInline: true });
  }

  handleChangeToModal = () => {
    this.setState({ mapShowModal: true });
  }

  render() {
    console.log('this.mapRef in render:', this.mapRef);
    const {
      mapActiveIndex,
      mapContainer,
      mapShowInline,
      mapShowModal,
    } = this.state;
    console.log('mapContainer in render:', mapContainer);
    const { selectedEvent, selectedRunner, selectedMap } = this.props;
    const runnerData = (selectedEvent.runners)
      ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
      : null;
    const hasMaps = runnerData && runnerData.maps.length > 0;
    const mapImages = (hasMaps)
      ? [{
        src: `${OMAPFOLDER_SERVER}/${runnerData.maps[0].course}`,
        downloadUrl: `${OMAPFOLDER_SERVER}/${runnerData.maps[0].course}`,
        alt: 'map',
      }]
      : [];
    // <img
    // className="course-map"
    // alt="course map"
    // src={`${OMAPFOLDER_SERVER}/${runnerData.maps[0].course}`}
    // />
    const mapsToDisplay = (hasMaps)
      ? (
        <div>
          <p>{`There are ${runnerData.maps.length} maps to display.`}</p>
          <div className="course-map-container" ref={this.mapRef} />
          <Viewer
            visible={mapShowInline && !mapShowModal}
            onClose={() => this.setState({ mapShowInline: false, mapShowModal: true })}
            images={mapImages}
            activeIndex={mapActiveIndex}
            container={mapContainer}
            scalable={false}
            disableKeyboardSupport
            downloadable
            noNavbar
            defaultScale="1.5"
          />
          {(mapShowModal) ? (
            <div>
              <p>Show modal version</p>
              <Viewer
                visible
                onClose={() => this.setState({ mapShowModal: false })}
                images={mapImages}
                activeIndex={mapActiveIndex}
                downloadable
              />
            </div>
          )
            : null}
        </div>
      )
      : (
        <p><Trans>Sorry, there are no maps to display.</Trans></p>
      );
    const title = <Trans>Course Map</Trans>;
    return (
      <div className="ui segment">
        <Collapse title={title}>
          {mapsToDisplay}
        </Collapse>
      </div>
    );
  }
}

export default EventCourseMap;
