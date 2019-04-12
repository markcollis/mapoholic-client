import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileDropzone from '../FileDropzone';

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

  onUploadSelected() {
    const { user, postProfileImage, hide } = this.props;
    const { _id: userId } = user;
    const { fileToUpload } = this.state;
    if (fileToUpload) {
      postProfileImage(userId, fileToUpload);
      hide();
    }
  }

  render() {
    const {
      user,
      hide,
      deleteProfileImage,
    } = this.props;
    const { _id: userId } = user;
    return (
      <div>
        <h3 className="header">Add or change user profile image</h3>
        <div>
          <FileDropzone onFileAdded={file => this.setState({ fileToUpload: file })} />
        </div>
        <button
          type="button"
          className="ui tiny primary button"
          onClick={() => this.onUploadSelected()}
        >
        Upload selected
        </button>
        <button
          type="button"
          className="ui tiny negative button"
          onClick={() => deleteProfileImage(userId)}
        >
        Delete current
        </button>
        <button
          type="button"
          className="ui right floated tiny button"
          onClick={() => hide()}
        >
        Cancel
        </button>
      </div>
    );
  }
}

export default UserEditProfileImage;
