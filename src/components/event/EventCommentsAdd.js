import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

class EventCommentsAdd extends Component {
  static propTypes = {
    requestRefreshCollapse: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    runnerData: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    eventId: null,
    runnerData: null,
  };

  state = {
    commentText: '',
    isEditing: false,
  }

  handleInputChange = (e) => {
    this.setState({ commentText: e.target.value });
  }

  handleEditEnable = () => {
    const { requestRefreshCollapse } = this.props;
    this.setState({ isEditing: true });
    requestRefreshCollapse();
  }

  handleCancel = () => {
    const { requestRefreshCollapse } = this.props;
    this.setState({ commentText: '', isEditing: false });
    requestRefreshCollapse();
  }

  handleSubmit = () => {
    const { commentText } = this.state;
    const {
      requestRefreshCollapse,
      eventId,
      postComment,
      runnerData,
    } = this.props;
    if (runnerData && eventId !== '') {
      const { user } = runnerData;
      const { _id: runnerId } = user;
      postComment(eventId, runnerId, { text: commentText }, (successful) => {
        if (successful) {
          // console.log('posting comment successful');
          this.setState({ isEditing: false, commentText: '' });
          requestRefreshCollapse();
        } else {
          // console.log('posting comment failed');
        }
      });
    }
  }

  renderAddButton = () => {
    const { isEditing } = this.state;
    if (isEditing) return null;

    const buttonStyle = (isEditing)
      ? 'ui mini button primary right floated disabled'
      : 'ui mini button primary right floated';
    return (
      <button type="button" className={buttonStyle} onClick={this.handleEditEnable}>
        <Trans>Add a comment</Trans>
      </button>
    );
  }

  renderPostEditor = () => {
    const { commentText, isEditing } = this.state;
    if (!isEditing) return null;

    return (
      <div className="ui form event-comments-item__editor">
        <div className="field">
          <textarea
            type="textarea"
            value={commentText}
            onChange={this.handleInputChange}
          />
        </div>
        <button type="button" className="ui tiny button primary" onClick={this.handleSubmit}>
          <Trans>Post comment</Trans>
        </button>
        <button type="button" className="ui tiny button right floated" onClick={this.handleCancel}>
          <Trans>Cancel</Trans>
        </button>
      </div>
    );
  }

  render() {
    // console.log('props, state in EventCommentsAdd:', this.props, this.state);
    return (
      <div>
        {this.renderAddButton()}
        {this.renderPostEditor()}
      </div>
    );
  }
}

export default EventCommentsAdd;
