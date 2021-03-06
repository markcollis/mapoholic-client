import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import FileDropzone from '../generic/FileDropzone';

// The UserEditProfileImage component renders an interface to add or change a profile picture
class UserEditProfileImage extends Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    hide: PropTypes.func.isRequired,
    postProfileImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
  };

  state = {
    fileToUpload: null,
  };

  onUploadSelected = () => {
    const { user, postProfileImage, hide } = this.props;
    const { _id: userId } = user;
    const { fileToUpload } = this.state;
    if (fileToUpload) {
      postProfileImage(userId, fileToUpload);
      hide();
    }
  }

  render() {
    const { fileToUpload } = this.state;
    const {
      user,
      hide,
      deleteProfileImage,
    } = this.props;
    const { _id: userId, profileImage } = user;
    const hasProfileImage = Boolean(profileImage && profileImage !== '');
    const dropzoneIcon = <i className="image big icon" />;
    const dropzoneText = (
      <div>
        <Trans>
          Select your file (drag and drop or click to open file dialogue).
          The file must be a JPEG or PNG image, maximum size 1MB.
        </Trans>
      </div>
    );
    return (
      <div>
        <h3 className="header"><Trans>Add or change user profile image</Trans></h3>
        <div>
          <FileDropzone
            onFileAdded={file => this.setState({ fileToUpload: file })}
            icon={dropzoneIcon}
            text={dropzoneText}
          />
        </div>
        <button
          type="button"
          className="ui tiny primary button"
          disabled={!fileToUpload}
          onClick={() => this.onUploadSelected()}
        >
          <Trans>Upload selected</Trans>
        </button>
        <button
          type="button"
          className="ui tiny negative button"
          disabled={!hasProfileImage}
          onClick={() => deleteProfileImage(userId)}
        >
          <Trans>Delete current</Trans>
        </button>
        <button
          type="button"
          className="ui right floated tiny button"
          onClick={() => hide()}
        >
          <Trans>Cancel</Trans>
        </button>
      </div>
    );
  }
}

export default UserEditProfileImage;
