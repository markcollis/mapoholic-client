import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import FileDropzone from '../generic/FileDropzone';

// The EventMapViewerEdit component renders fields for uploading course and route maps
// for each named instance, and for editing the map title
class EventMapViewerEdit extends Component {
  static propTypes = {
    deleteMap: PropTypes.func.isRequired,
    eventId: PropTypes.string.isRequired,
    map: PropTypes.objectOf(PropTypes.any),
    postMap: PropTypes.func.isRequired,
    selectedRunnerMaps: PropTypes.arrayOf(PropTypes.object),
    updateEventRunner: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    map: {},
    selectedRunnerMaps: [],
  };

  state = {
    courseMapToUpload: null,
    dropZoneKeyCourse: 0,
    dropZoneKeyRoute: 0,
    mapTitleToUpload: '',
    mapTitleEditable: true,
    routeMapToUpload: null,
    isUploading: false,
  };

  componentDidMount() {
    const { map } = this.props;
    const { title } = map;
    if (title || title === '') {
      this.setState({
        mapTitleToUpload: title,
        mapTitleEditable: false,
      });
    }
  }

  onUploadCourseMap = () => {
    const {
      eventId,
      userId,
      postMap,
    } = this.props;
    const {
      courseMapToUpload,
      dropZoneKeyCourse,
      mapTitleEditable,
      mapTitleToUpload,
    } = this.state;
    if (courseMapToUpload) {
      const parameters = {
        eventId,
        userId,
        mapType: 'course',
        mapTitle: mapTitleToUpload,
      };
      this.setState({ isUploading: true });
      postMap(parameters, courseMapToUpload, (successful) => {
        if (successful) {
          this.setState({
            courseMapToUpload: null,
            dropZoneKeyCourse: dropZoneKeyCourse + 1,
            isUploading: false,
          });
          if (mapTitleEditable) this.setState({ mapTitleToUpload: '' });
          // console.log('course map upload successful');
        } else {
          this.setState({ isUploading: false });
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
    } = this.props;
    // console.log(`delete ${mapType} map`);
    const { mapTitleToUpload } = this.state;
    const parameters = {
      eventId,
      userId,
      mapType,
      mapTitle: mapTitleToUpload,
    };
    deleteMap(parameters, (successful) => {
      if (successful) {
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
    } = this.props;
    const {
      dropZoneKeyRoute,
      mapTitleEditable,
      mapTitleToUpload,
      routeMapToUpload,
    } = this.state;
    if (routeMapToUpload) {
      const parameters = {
        eventId,
        userId,
        mapType: 'route',
        mapTitle: mapTitleToUpload,
      };
      this.setState({ isUploading: true });
      postMap(parameters, routeMapToUpload, (successful) => {
        if (successful) {
          this.setState({
            routeMapToUpload: null,
            dropZoneKeyRoute: dropZoneKeyRoute + 1,
            isUploading: false,
          });
          if (mapTitleEditable) this.setState({ mapTitleToUpload: '' });
          // console.log('route map upload successful');
        } else {
          this.setState({ isUploading: false });
          // console.log('route map upload failed');
        }
      });
    }
  }

  onEditTitle = () => {
    const { mapTitleEditable, mapTitleToUpload } = this.state;
    if (!mapTitleEditable) this.setState({ mapTitleEditable: true });
    const {
      eventId,
      map,
      selectedRunnerMaps,
      updateEventRunner,
      userId,
    } = this.props;
    const { title: mapTitle } = map;
    if (mapTitleEditable && (mapTitleToUpload !== mapTitle)) {
      const newMaps = selectedRunnerMaps.map((eachMap) => {
        const newMap = eachMap;
        if (eachMap.title === mapTitle) newMap.title = mapTitleToUpload;
        return newMap;
      });
      updateEventRunner(eventId, userId, { maps: newMaps });
    }
  }

  onCancelEditTitle = () => {
    const { map } = this.props;
    const { title } = map;
    this.setState({
      mapTitleEditable: false,
      mapTitleToUpload: title,
    });
  }

  render() {
    const {
      map,
      selectedRunnerMaps,
    } = this.props;
    const {
      title,
      course,
      courseUpdated,
      route,
      routeUpdated,
    } = map;
    const {
      mapTitleToUpload,
      mapTitleEditable,
      dropZoneKeyCourse,
      dropZoneKeyRoute,
      courseMapToUpload,
      routeMapToUpload,
      isUploading,
    } = this.state;
    const mapTitlesInUse = selectedRunnerMaps.map(eachMap => eachMap.title);
    const mapTitleIsDuplicate = (mapTitleEditable && (mapTitleToUpload !== title)
      && mapTitlesInUse.includes(mapTitleToUpload));
    const courseThumbnail = (course)
      ? `${course.slice(0, -4)}-thumb${course.slice(-4)}?${courseUpdated}`
      : null;
    const renderCourseThumbnail = (courseThumbnail)
      ? <img src={courseThumbnail} alt="course thumbnail" />
      : (
        <div>
          <i className="close icon" />
          <Trans>no map yet</Trans>
        </div>
      );
    const routeThumbnail = (route)
      ? `${route.slice(0, -4)}-thumb${route.slice(-4)}?${routeUpdated}`
      : null;
    const renderRouteThumbnail = (routeThumbnail)
      ? <img src={routeThumbnail} alt="route thumbnail" />
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
    let editTitleButtonText = <Trans>Change title</Trans>;
    if (title === '') editTitleButtonText = <Trans>Add title</Trans>;
    if (mapTitleEditable) editTitleButtonText = <Trans>Confirm change</Trans>;
    const renderEditTitleButton = (
      <button
        className={`ui tiny button primary fluid ${(mapTitleIsDuplicate) ? 'disabled' : null}`}
        type="button"
        onClick={() => this.onEditTitle()}
      >
        {editTitleButtonText}
      </button>
    );
    const renderCancelEditTitleButton = (title && mapTitleEditable)
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
            <div className="column two wide right aligned"><Trans>Course</Trans></div>
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
                className={`ui tiny primary button fluid ${(mapTitleIsDuplicate || !courseMapToUpload || isUploading) ? 'disabled' : null}`}
                onClick={() => this.onUploadCourseMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className={`ui tiny negative button fluid ${(mapTitleIsDuplicate || isUploading) ? 'disabled' : null}`}
                onClick={() => this.onDeleteMap('course')}
              >
                <Trans>Delete current</Trans>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="column two wide right aligned"><Trans>Route</Trans></div>
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
                className={`ui tiny primary button fluid ${(mapTitleIsDuplicate || !routeMapToUpload || isUploading) ? 'disabled' : null}`}
                onClick={() => this.onUploadRouteMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className={`ui tiny negative button fluid ${(mapTitleIsDuplicate || isUploading) ? 'disabled' : null}`}
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
