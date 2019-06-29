import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import FileDropzone from '../generic/FileDropzone';
import { MAPOHOLIC_SERVER } from '../../config';

class EventMapViewerEdit extends Component {
  static propTypes = {
    courseImg: PropTypes.string,
    deleteMap: PropTypes.func.isRequired,
    eventId: PropTypes.string.isRequired,
    mapTitle: PropTypes.string,
    postMap: PropTypes.func.isRequired,
    routeImg: PropTypes.string,
    selectedRunnerMaps: PropTypes.arrayOf(PropTypes.object),
    updateEventRunner: PropTypes.func,
    updateMapImageArray: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    courseImg: null,
    mapTitle: null, // i.e. entirely new; if an existing title is empty, mapTitle = ''
    routeImg: null,
    selectedRunnerMaps: [],
    updateEventRunner: () => {},
  };

  state = {
    changesMade: false,
    courseMapToUpload: null,
    dropZoneKeyCourse: 0,
    dropZoneKeyRoute: 0,
    mapTitleToUpload: '',
    mapTitleEditable: true,
    routeMapToUpload: null,
  };

  componentDidMount() {
    const { mapTitle } = this.props;
    // console.log('mapTitle "', mapTitle, '"');
    if (mapTitle || mapTitle === '') {
      this.setState({
        mapTitleToUpload: mapTitle,
        mapTitleEditable: false,
      });
    }
  }

  onUploadCourseMap = () => {
    const {
      eventId,
      userId,
      postMap,
      updateMapImageArray,
    } = this.props;
    // console.log('upload course map');
    const {
      courseMapToUpload,
      mapTitleToUpload,
      mapTitleEditable,
      dropZoneKeyCourse,
    } = this.state;
    if (courseMapToUpload) {
      const parameters = {
        eventId,
        userId,
        mapType: 'course',
        mapTitle: mapTitleToUpload,
      };
      postMap(parameters, courseMapToUpload, (successful) => {
        if (successful) {
          updateMapImageArray();
          this.setState({
            changesMade: true,
            courseMapToUpload: null,
            dropZoneKeyCourse: dropZoneKeyCourse + 1,
          });
          if (mapTitleEditable) this.setState({ mapTitleToUpload: '' });
          // console.log('course map upload successful');
        } else {
          // console.log('course map upload failed');
        }
      });
    }
  }

  onDeleteMap = (mapType) => {
    const {
      eventId,
      userId,
      deleteMap,
      courseImg,
      routeImg,
      updateMapImageArray,
    } = this.props;
    // console.log(`delete ${mapType} map`);
    const { mapTitleToUpload } = this.state;
    const parameters = {
      eventId,
      userId,
      mapType,
      mapTitle: mapTitleToUpload,
    };
    const willUnmount = (mapType === 'course' && !routeImg)
      || (mapType === 'route' && !courseImg);
    deleteMap(parameters, (successful) => {
      if (successful) {
        updateMapImageArray();
        if (!willUnmount) this.setState({ changesMade: true });
        // console.log(`${mapType} map delete successful`);
      } else {
        // console.log(`${mapType} map delete failed`);
      }
    });
  }

  onUploadRouteMap = () => {
    const {
      eventId,
      userId,
      postMap,
      updateMapImageArray,
    } = this.props;
    // console.log('upload route map');
    const {
      routeMapToUpload,
      mapTitleToUpload,
      mapTitleEditable,
      dropZoneKeyRoute,
    } = this.state;
    if (routeMapToUpload) {
      const parameters = {
        eventId,
        userId,
        mapType: 'route',
        mapTitle: mapTitleToUpload,
      };
      postMap(parameters, routeMapToUpload, (successful) => {
        if (successful) {
          updateMapImageArray();
          this.setState({
            changesMade: true,
            routeMapToUpload: null,
            dropZoneKeyRoute: dropZoneKeyRoute + 1,
          });
          if (mapTitleEditable) this.setState({ mapTitleToUpload: '' });
          // console.log('route map upload successful');
        } else {
          // console.log('route map upload failed');
        }
      });
    }
  }

  onEditTitle = () => {
    const { mapTitleEditable, mapTitleToUpload } = this.state;
    if (!mapTitleEditable) this.setState({ mapTitleEditable: true });
    const {
      mapTitle,
      eventId,
      userId,
      selectedRunnerMaps,
      updateEventRunner,
    } = this.props;
    if (mapTitleEditable && (mapTitleToUpload !== mapTitle)) {
      const newMaps = selectedRunnerMaps.map((map) => {
        const newMap = map;
        if (map.title === mapTitle) newMap.title = mapTitleToUpload;
        return newMap;
      });
      // console.log('newMaps', newMaps);
      updateEventRunner(eventId, userId, { maps: newMaps });
    }
  }

  onCancelEditTitle = () => {
    const { mapTitle } = this.props;
    this.setState({
      mapTitleEditable: false,
      mapTitleToUpload: mapTitle,
    });
  }

  render() {
    // console.log('props in EventMapViewerEdit:', this.props);
    // console.log('state in EventMapViewerEdit:', this.state);
    const {
      mapTitle,
      selectedRunnerMaps,
      courseImg,
      routeImg,
    } = this.props;
    const {
      mapTitleToUpload,
      mapTitleEditable,
      changesMade,
      dropZoneKeyCourse,
      dropZoneKeyRoute,
    } = this.state;
    const mapTitlesInUse = selectedRunnerMaps.map(map => map.title);
    const mapTitleIsDuplicate = (mapTitleEditable && (mapTitleToUpload !== mapTitle)
      && mapTitlesInUse.includes(mapTitleToUpload));
    const now = new Date();
    const srcSuffix = (changesMade) ? `?${now.getTime()}` : ''; // to force reload on change
    // edge case - not applied if a map is completely deleted then one of the same name added
    // from the default empty component
    const courseThumbnail = (courseImg)
      ? courseImg.slice(0, -4).concat('-thumb').concat(courseImg.slice(-4))
      : null;
    const renderCourseThumbnail = (courseThumbnail)
      ? <img src={`${MAPOHOLIC_SERVER}/${courseThumbnail}${srcSuffix}`} alt="course thumbnail" />
      : (
        <div>
          <i className="close icon" />
          <Trans>no map yet</Trans>
        </div>
      );
    const routeThumbnail = (routeImg)
      ? routeImg.slice(0, -4).concat('-thumb').concat(routeImg.slice(-4))
      : null;
    const renderRouteThumbnail = (routeThumbnail)
      ? <img src={`${MAPOHOLIC_SERVER}/${routeThumbnail}${srcSuffix}`} alt="route thumbnail" />
      : (
        <div>
          <i className="close icon" />
          <Trans>no map yet</Trans>
        </div>
      );
    const renderMapTitle = (mapTitleEditable)
      ? (
        <div className="ui form">
          <div className={(mapTitleIsDuplicate) ? 'field error' : 'field'}>
            <label htmlFor="title">
              <Trans>Map title</Trans>
              <I18n>
                {({ i18n }) => (
                  <input
                    name="title"
                    type="text"
                    placeholder={i18n._(t`Title for map (e.g. "Part 1")`)}
                    autoComplete="off"
                    value={mapTitleToUpload}
                    onChange={e => this.setState({ mapTitleToUpload: e.target.value })}
                  />
                )}
              </I18n>
            </label>
            {(mapTitleIsDuplicate)
              ? <div className="ui negative message"><Trans>Duplicate map title</Trans></div>
              : null}
          </div>
        </div>
      )
      : <h4>{mapTitleToUpload}</h4>;
    const editTitleButtonText = (mapTitleEditable)
      ? <Trans>Confirm change</Trans>
      : <Trans>Change title</Trans>;
    const renderEditTitleButton = (mapTitle || mapTitle === '')
      ? (
        <button
          className={`ui tiny button primary fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
          type="button"
          onClick={() => this.onEditTitle()}
        >
          {editTitleButtonText}
        </button>
      )
      : null;
    const renderCancelEditTitleButton = (mapTitle && mapTitleEditable)
      ? (
        <div>
          <p />
          <button
            className="ui tiny button fluid"
            type="button"
            onClick={() => this.onCancelEditTitle()}
          >
            <Trans>Cancel</Trans>
          </button>
        </div>
      )
      : null;

    const dropzoneIcon = <i className="image big icon" />;
    const dropzoneTextCourse = (
      <div>
        <Trans>
          Select your course map file (drag and drop or click to open file dialogue).
          The file must be a JPEG or PNG image, maximum size 5MB.
        </Trans>
      </div>
    );
    const dropzoneTextRoute = (
      <div>
        <Trans>
          Select your route map file (drag and drop or click to open file dialogue).
          The file must be a JPEG or PNG image, maximum size 5MB.
        </Trans>
      </div>
    );
    return (
      <div>
        <hr className="divider" />
        <div className="ui four column grid middle aligned">
          <div className="row">
            <div className="column six wide">
              {renderMapTitle}
            </div>
            <div className="column seven wide" />
            <div className="column three wide">
              {renderEditTitleButton}
              {renderCancelEditTitleButton}
            </div>
          </div>
          <div className="row">
            <div className="column two wide"><Trans>Course</Trans></div>
            <div className="column four wide">
              {renderCourseThumbnail}
            </div>
            <div className="column seven wide">
              <FileDropzone
                key={dropZoneKeyCourse}
                onFileAdded={file => this.setState({ courseMapToUpload: file })}
                icon={dropzoneIcon}
                text={dropzoneTextCourse}
                showAddBorder
              />
            </div>
            <div className="column three wide">
              <button
                type="button"
                className={`ui tiny primary button fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
                onClick={() => this.onUploadCourseMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className={`ui tiny negative button fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
                onClick={() => this.onDeleteMap('course')}
              >
                <Trans>Delete current</Trans>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="column two wide"><Trans>Route</Trans></div>
            <div className="column four wide">
              {renderRouteThumbnail}
            </div>
            <div className="column seven wide">
              <FileDropzone
                key={dropZoneKeyRoute}
                onFileAdded={file => this.setState({ routeMapToUpload: file })}
                icon={dropzoneIcon}
                text={dropzoneTextRoute}
              />
            </div>
            <div className="column three wide">
              <button
                type="button"
                className={`ui tiny primary button fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
                onClick={() => this.onUploadRouteMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className={`ui tiny negative button fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
                onClick={() => this.onDeleteMap('route')}
              >
                <Trans>Delete current</Trans>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventMapViewerEdit;
