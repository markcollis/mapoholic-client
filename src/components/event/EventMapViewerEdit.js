import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import FileDropzone from '../FileDropzone';
import { OMAPFOLDER_SERVER } from '../../config';

class EventMapViewerEdit extends Component {
  static propTypes = {
    eventId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    mapTitle: PropTypes.string,
    courseImg: PropTypes.string,
    routeImg: PropTypes.string,
    postMap: PropTypes.func.isRequired,
    deleteMap: PropTypes.func.isRequired,
    updateMapImageArray: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mapTitle: null,
    courseImg: null,
    routeImg: null,
  };

  state = {
    mapTitleToUpload: '',
    mapTitleEditable: true,
    courseMapToUpload: null,
    routeMapToUpload: null,
    changesMade: false,
  };

  componentDidMount() {
    const { mapTitle } = this.props;
    if (mapTitle) {
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
      // mapId,
      // courseImg,
      // routeImg,
      postMap,
      // mapImageArray,
      updateMapImageArray,
    } = this.props;
    console.log('upload course map');
    const { courseMapToUpload, mapTitleToUpload } = this.state;
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
          this.setState({ changesMade: true });
          console.log('course map upload successful');
        } else {
          console.log('course map upload failed');
        }
      });
    }
  }

  onDeleteCourseMap = () => {
    console.log('delete course map');
  }

  onUploadRouteMap = () => {
    console.log('upload route map');
  }

  onDeleteRouteMap = () => {
    console.log('delete route map');
  }

  render() {
    console.log('props in EventMapViewerEdit:', this.props);
    console.log('state in EventMapViewerEdit:', this.state);
    const {
    //   eventId,
    //   userId,
    //   mapTitle,
      courseImg,
      routeImg,
    //   postMap,
    //   deleteMap,
    //   updateMapImageArray,
    } = this.props;
    const { mapTitleToUpload, mapTitleEditable, changesMade } = this.state;
    const now = new Date();
    const srcSuffix = (changesMade) ? `?${now.getTime()}` : ''; // to force reload on change
    const courseThumbnail = (courseImg)
      ? courseImg.slice(0, -4).concat('-thumb').concat(courseImg.slice(-4))
      : null;
    const renderCourseThumbnail = (courseThumbnail)
      ? <img src={`${OMAPFOLDER_SERVER}/${courseThumbnail}${srcSuffix}`} alt="course thumbnail" />
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
      ? <img src={`${OMAPFOLDER_SERVER}/${routeThumbnail}${srcSuffix}`} alt="route thumbnail" />
      : (
        <div>
          <i className="close icon" />
          <Trans>no map yet</Trans>
        </div>
      );
    // console.log('courseThumbnail:', courseThumbnail);
    const renderMapTitle = (mapTitleEditable)
      ? (
        <div className="ui form">
          <div className="field four wide">
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
          </div>
        </div>
      )
      : <h4>{mapTitleToUpload}</h4>;
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
        {renderMapTitle}
        <div className="ui four column grid middle aligned">
          <div className="row">
            <div className="column two wide"><Trans>Course</Trans></div>
            <div className="column four wide">
              {renderCourseThumbnail}
            </div>
            <div className="column seven wide">
              <FileDropzone
                onFileAdded={file => this.setState({ courseMapToUpload: file })}
                icon={dropzoneIcon}
                text={dropzoneTextCourse}
              />
            </div>
            <div className="column three wide">
              <button
                type="button"
                className="ui tiny primary button fluid"
                onClick={() => this.onUploadCourseMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className="ui tiny negative button fluid"
                onClick={() => this.onDeleteCourseMap()}
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
                onFileAdded={file => this.setState({ routeMapToUpload: file })}
                icon={dropzoneIcon}
                text={dropzoneTextRoute}
              />
            </div>
            <div className="column three wide">
              <button
                type="button"
                className="ui tiny primary button fluid"
                onClick={() => this.onUploadRouteMap()}
              >
                <Trans>Upload selected</Trans>
              </button>
              <p />
              <button
                type="button"
                className="ui tiny negative button fluid"
                onClick={() => this.onDeleteRouteMap()}
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

// <div className="ui three column grid">
//   <div className="column four wide">
//     <div className="ui field">
//       <label htmlFor="title">
//         <Trans>Map title</Trans>
//         <I18n>
//           {({ i18n }) => (
//             <input
//               name="title"
//               type="text"
//               placeholder={i18n._(t`Title for map (e.g. "Part 1")`)}
//               autoComplete="off"
//               value={mapTitleToUpload}
//               onChange={e => this.setState({ mapTitleToUpload: e.target.value })}
//             />
//           )}
//         </I18n>
//       </label>
//     </div>
//   </div>
//   <div className="column six wide">
//     <img src={`${OMAPFOLDER_SERVER}/${courseThumbnail}`} alt="course thumbnail" />
//     <FileDropzone
//       onFileAdded={file => this.setState({ courseMapToUpload: file })}
//       icon={dropzoneIcon}
//       text={dropzoneTextCourse}
//     />
//     <button
//       type="button"
//       className="ui tiny primary button"
//       onClick={() => this.onUploadCourseMap()}
//     >
//       <Trans>Upload selected</Trans>
//     </button>
//     <button
//       type="button"
//       className="ui tiny negative button right floated"
//       onClick={() => this.onDeleteCourseMap()}
//     >
//       <Trans>Delete current</Trans>
//     </button>
//   </div>
//   <div className="column six wide">
//     <img src={`${OMAPFOLDER_SERVER}/${routeThumbnail}`} alt="route thumbnail" />
//     <FileDropzone
//       onFileAdded={file => this.setState({ routeMapToUpload: file })}
//       icon={dropzoneIcon}
//       text={dropzoneTextRoute}
//     />
//     <button
//       type="button"
//       className="ui tiny primary button"
//       onClick={() => this.onUploadRouteMap()}
//     >
//       <Trans>Upload selected</Trans>
//     </button>
//     <button
//       type="button"
//       className="ui tiny negative button"
//       onClick={() => this.onDeleteRouteMap()}
//     >
//       <Trans>Delete current</Trans>
//     </button>
//   </div>
// </div>
