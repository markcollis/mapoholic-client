import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileDropzone extends Component {
  static propTypes = {
    onFileAdded: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    icon: PropTypes.objectOf(PropTypes.any),
    text: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    disabled: false,
    icon: null,
    text: null,
  };

  state = {
    highlighted: false,
    currentFile: null,
  };

  fileRef = React.createRef();

  // constructor(props) {
  //   super(props);
  //   this.fileRef = React.createRef();
  // }

  onDragOver = (e) => {
    const { disabled } = this.props;
    e.preventDefault();
    if (!disabled) this.setState({ highlighted: true });
  }

  onDragLeave = () => {
    this.setState({ highlighted: false });
  }

  onDrop = (e) => {
    const { disabled, onFileAdded } = this.props;
    e.preventDefault();
    if (!disabled) {
      const file = e.dataTransfer.files[0];
      onFileAdded(file);
      this.setState({ highlighted: false, currentFile: file });
    }
  }

  openFileDialogue = () => {
    const { disabled } = this.props;
    if (!disabled) this.fileRef.current.click();
  }

  handleFileAdded = (e) => {
    const { disabled, onFileAdded } = this.props;
    if (!disabled) {
      const file = e.target.files[0];
      // console.log('file:', file);
      onFileAdded(file);
      this.setState({ currentFile: file });
    }
  }

  render() {
    const { disabled, icon, text } = this.props;
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
              {icon}
              {text}
            </div>
          )
        }
      </div>
    );
  }
}

export default FileDropzone;
