import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestamp } from '../../common/conversions';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';

class EventCommentsItem extends Component {
  static propTypes = {
    authorDetails: PropTypes.objectOf(PropTypes.any),
    collapseTrigger: PropTypes.func.isRequired,
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    currentUserId: PropTypes.string,
    deleteComment: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    runnerId: PropTypes.string,
    updateComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authorDetails: {},
    currentUserId: null,
    eventId: null,
    runnerId: null,
  };

  state = {
    editCommentText: '',
    isDeleting: false,
    isEditing: false,
  }

  componentDidMount() {
    const { comment } = this.props;
    const { text } = comment;
    this.setState({ editCommentText: text });
  }

  handleInputChange = (e) => {
    this.setState({ editCommentText: e.target.value });
    // e.target.style.height = 'inherit';
    // e.target.style.height = `${e.target.scrollHeight}px`;
  }

  handleDeleteEnable = () => {
    // console.log('handleDeleteEnable', e);
    const { collapseTrigger } = this.props;
    this.setState({ isDeleting: true });
    collapseTrigger();
  }

  handleDeleteCancel = () => {
    // console.log('handleDeleteCancel', e);
    const { collapseTrigger } = this.props;
    this.setState({ isDeleting: false });
    collapseTrigger();
  }

  handleDeleteSubmit = () => {
    // console.log('handleDeleteSubmit', e);
    const {
      comment,
      deleteComment,
      eventId,
      runnerId,
    } = this.props;
    const { _id: commentId } = comment;
    deleteComment(eventId, runnerId, commentId, (successful) => {
      if (successful) {
        console.log('comment delete successful');
      } else {
        console.log('comment delete failed');
      }
    });
  }

  handleEditEnable = () => {
    // console.log('handleEditEnable', e);
    const { collapseTrigger } = this.props;
    this.setState({ isEditing: true });
    collapseTrigger();
  }

  handleEditCancel = () => {
    // console.log('handleEditCancel', e);
    const { collapseTrigger, comment } = this.props;
    const { text } = comment;
    this.setState({ editCommentText: text, isEditing: false });
    collapseTrigger();
  }

  handleEditSubmit = () => {
    // console.log('handleEditSubmit', e);
    const { editCommentText } = this.state;
    const {
      collapseTrigger,
      comment,
      eventId,
      runnerId,
      updateComment,
    } = this.props;
    const { _id: commentId } = comment;
    updateComment(eventId, runnerId, commentId, { text: editCommentText }, (successful) => {
      if (successful) {
        console.log('comment update successful');
        this.setState({ isEditing: false });
        collapseTrigger();
      } else {
        console.log('comment update failed');
      }
    });
  }

  renderButtons = () => {
    const { isEditing, isDeleting } = this.state;
    const { comment, currentUserId, isAdmin } = this.props;
    const { author } = comment;
    const { _id: authorId } = author;
    const isAuthor = (authorId === currentUserId);
    const canEdit = isAuthor || isAdmin;
    if (!canEdit) return null;
    const buttonStyle = (isEditing || isDeleting)
      ? 'ui mini button right floated disabled'
      : 'ui mini button right floated';
    return (
      <span>
        <button type="button" className={buttonStyle} onClick={this.handleDeleteEnable}>
          <Trans>Delete</Trans>
        </button>
        {(isAuthor)
          ? (
            <button type="button" className={buttonStyle} onClick={this.handleEditEnable}>
              <Trans>Edit</Trans>
            </button>
          )
          : null}
      </span>
    );
  }

  renderPost = () => {
    const { editCommentText, isDeleting, isEditing } = this.state;
    const { authorDetails, comment, currentUserId } = this.props;
    const {
      author,
      text,
      postedAt,
      updatedAt,
    } = comment;
    const { _id: authorId, displayName, fullName } = author;
    const isAuthor = (authorId === currentUserId);
    const postedDate = reformatTimestamp(postedAt);
    const updatedDate = reformatTimestamp(updatedAt);
    const datesToDisplay = (postedDate === updatedDate)
      ? `posted ${postedDate}`
      : `posted ${postedDate}, updated ${updatedDate}`;
    const headerStyle = (isAuthor)
      ? 'header comment-header comment-author'
      : 'header comment-header';
    const textContent = (isEditing)
      ? (
        <div className="ui form comment-editor">
          <div className="field">
            <textarea
              type="textarea"
              value={editCommentText}
              onChange={this.handleInputChange}
            />
          </div>
          <button type="button" className="ui tiny button primary" onClick={this.handleEditSubmit}>
            <Trans>Save changes</Trans>
          </button>
          <button type="button" className="ui tiny button right floated" onClick={this.handleEditCancel}>
            <Trans>Cancel</Trans>
          </button>
        </div>
      )
      : <div className="comment-text">{text}</div>;
    const deleteButtons = (isDeleting)
      ? (
        <div>
          <p />
          <button type="button" className="ui tiny button negative" onClick={this.handleDeleteSubmit}>
            <Trans>Delete comment</Trans>
          </button>
          <button type="button" className="ui tiny button right floated" onClick={this.handleDeleteCancel}>
            <Trans>Cancel</Trans>
          </button>
        </div>
      )
      : null;
    const avatar = (
      <img
        className="ui mini image left floated"
        alt="avatar"
        src={(authorDetails && authorDetails.profileImage) ? `${OMAPFOLDER_SERVER}/${authorDetails.profileImage}` : noAvatar}
      />
    );
    const header = (fullName === '')
      ? <div className={headerStyle}>{displayName}</div>
      : (
        <div className={headerStyle}>
          {`${displayName} `}
          <span className="comment-fullname">
            {`(${fullName})`}
          </span>
        </div>
      );

    return (
      <>
        {this.renderButtons()}
        {avatar}
        <div className={headerStyle}>
          {header}
        </div>
        <div className="description">
          {textContent}
          {deleteButtons}
        </div>
        <div className="extra">
          <div className="right floated comment-date">{datesToDisplay}</div>
        </div>
      </>
    );
  }

  render() {
    console.log('props, state in EventCommentsItem:', this.props, this.state);
    return (
      <div className="item">
        <div className="content">
          {this.renderPost()}
        </div>
      </div>
    );
  }
}

export default EventCommentsItem;
