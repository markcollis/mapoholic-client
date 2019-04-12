import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileDropzone extends Component {
  static propTypes = {
    onFileAdded: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    highlighted: false,
    currentFile: null,
  };

  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }


  onDragOver(e) {
    const { disabled } = this.props;
    e.preventDefault();
    if (!disabled) this.setState({ highlighted: true });
  }

  onDragLeave() {
    this.setState({ highlighted: false });
  }

  onDrop(e) {
    const { disabled, onFileAdded } = this.props;
    e.preventDefault();
    if (!disabled) {
      const file = e.dataTransfer.files[0];
      onFileAdded(file);
      this.setState({ highlighted: false, currentFile: file });
    }
  }

  openFileDialogue() {
    const { disabled } = this.props;
    if (!disabled) this.fileRef.current.click();
  }

  handleFileAdded(e) {
    const { disabled, onFileAdded } = this.props;
    if (!disabled) {
      const file = e.target.files[0];
      // console.log('file:', file);
      onFileAdded(file);
      this.setState({ currentFile: file });
    }
  }

  render() {
    const { disabled } = this.props;
    const { highlighted, currentFile } = this.state;
    return (
      <div
        role="button"
        className={(highlighted) ? 'filedropzone highlighted' : 'filedropzone'}
        onClick={() => this.openFileDialogue()}
        onDragOver={e => this.onDragOver(e)}
        onDragLeave={() => this.onDragLeave()}
        onDrop={e => this.onDrop(e)}
        onKeyPress={() => this.openFileDialogue()}
        tabIndex="0"
        style={{ cursor: (disabled) ? 'default' : 'pointer' }}
      >
        <input
          ref={this.fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={e => this.handleFileAdded(e)}
        />
        {(currentFile)
          ? <img src={URL.createObjectURL(currentFile)} alt="preview" />
          : (
            <div>
              <i className="image big icon" />
              <div>
              Select your file (drag and drop or click to open file dialogue).
              The file must be a JPEG or PNG image, maximum size 1MB.
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default FileDropzone;
