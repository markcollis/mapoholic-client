import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import { FILETYPE_ACCEPT, FILETYPE_MIME } from '../../common/fileData';

class FileDropzone extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    icon: PropTypes.objectOf(PropTypes.any),
    onFileAdded: PropTypes.func.isRequired,
    showAddBorder: PropTypes.bool,
    text: PropTypes.objectOf(PropTypes.any),
    fileType: PropTypes.string, // 'image' (default), 'results' (JSON/CSV)
  };

  static defaultProps = {
    disabled: false,
    icon: null,
    showAddBorder: false,
    text: null,
    fileType: 'image',
  };

  state = {
    borderAdded: false,
    currentFile: null,
    fileNotRecognised: false,
    highlighted: false,
  };

  fileRef = React.createRef();

  onDragOver = (e) => {
    const { disabled } = this.props;
    e.preventDefault();
    if (!disabled) this.setState({ highlighted: true });
  }

  onDragLeave = () => {
    this.setState({ highlighted: false });
  }

  onDrop = (e) => {
    const { disabled, fileType, onFileAdded } = this.props;
    const allowedFileTypes = FILETYPE_MIME[fileType];
    e.preventDefault();
    if (!disabled) {
      const file = e.dataTransfer.files[0];
      // console.log('file dropped:', file);
      if (allowedFileTypes.includes(file.type)) {
        onFileAdded(file);
        this.setState({
          currentFile: file,
          fileNotRecognised: false,
          highlighted: false,
        });
      } else {
        this.setState({
          fileNotRecognised: true,
          highlighted: false,
        });
      }
    }
  }

  openFileDialogue = () => {
    const { disabled } = this.props;
    if (!disabled) this.fileRef.current.click();
  }

  handleFileAdded = (e) => {
    const { disabled, onFileAdded, fileType } = this.props;
    const allowedFileTypes = FILETYPE_MIME[fileType];
    if (!disabled) {
      const file = e.target.files[0];
      if (file && allowedFileTypes.includes(file.type)) {
        onFileAdded(file);
        this.setState({
          currentFile: file,
          fileNotRecognised: false,
          highlighted: false,
        });
      } else {
        this.setState({
          fileNotRecognised: true,
          highlighted: false,
        });
      }
    }
  }

  dataURLToBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];
      return new Blob([raw], { type: contentType });
    }
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  handleAddBorder = () => {
    const { onFileAdded } = this.props;
    const { currentFile } = this.state;
    const fileReader = new FileReader();
    fileReader.onload = (fileReaderEvent) => {
      const mapImage = new Image();
      mapImage.onload = () => {
        const borderCanvas = document.createElement('canvas');
        const { width, height } = mapImage;
        borderCanvas.width = width + 2;
        borderCanvas.height = height + 67;
        borderCanvas.getContext('2d').fillStyle = 'white';
        // borderCanvas.getContext('2d').fillStyle = 'black';
        // black would be consistent with QuickRoute, but I think white looks better
        borderCanvas.getContext('2d').fillRect(0, 0, borderCanvas.width, borderCanvas.height);
        borderCanvas.getContext('2d').drawImage(mapImage, 1, 66, width, height);
        const dataUrl = borderCanvas.toDataURL('image/jpeg', 0.8);
        const updatedImage = this.dataURLToBlob(dataUrl);
        // console.log('image sizes (before and after adding border):',
        // currentFile.size, updatedImage.size);
        // const blob = borderCanvas.toBlob() // simpler way of achieving the same result?
        onFileAdded(updatedImage);
        this.setState({ borderAdded: true, currentFile: updatedImage });
      };
      mapImage.src = fileReaderEvent.target.result;
    };
    fileReader.readAsDataURL(currentFile);
  }

  render() {
    // console.log('props in FileDropzone', this.props);
    const {
      disabled,
      icon,
      showAddBorder,
      text,
      fileType,
    } = this.props;
    const {
      borderAdded,
      currentFile,
      fileNotRecognised,
      highlighted,
    } = this.state;
    const accept = FILETYPE_ACCEPT[fileType];
    const FILETYPE_PREVIEW = {
      image: file => <img src={URL.createObjectURL(file)} alt="preview" />,
      results: file => <p>{file.name}</p>,
    };
    const preview = FILETYPE_PREVIEW[fileType];

    return (
      <div className={(highlighted) ? 'filedropzone filedropzone--highlighted' : 'filedropzone'}>
        <div
          role="button"
          onClick={this.openFileDialogue}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onKeyPress={this.openFileDialogue}
          tabIndex="0"
          style={{ cursor: (disabled) ? 'default' : 'pointer' }}
        >
          <input
            ref={this.fileRef}
            type="file"
            accept={accept}
            onChange={this.handleFileAdded}
          />
          {(currentFile)
            ? preview(currentFile)
            : (
              <div>
                {icon}
                {text}
              </div>
            )
          }
        </div>
        {(showAddBorder && currentFile && !borderAdded)
          ? (
            <div className="filedropzone__button-below">
              <button
                type="button"
                className="ui button small primary"
                onClick={this.handleAddBorder}
              >
                <Trans>Add border</Trans>
              </button>
              <p><Trans>(to match QuickRoute output)</Trans></p>
            </div>
          )
          : null}
        {(fileNotRecognised)
          ? (
            <div className="ui warning message">
              <Trans>
                Error: Incorrect file type. Please check and try again.
              </Trans>
            </div>
          )
          : null}
      </div>
    );
  }
}

export default FileDropzone;
