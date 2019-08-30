import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestamp } from '../../common/conversions';
import noAvatar from '../../graphics/noAvatar.jpg';
import { MAPOHOLIC_SERVER } from '../../config';

class EventCommentsItem extends Component {
  static propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    currentUserId: PropTypes.string,
    deleteComment: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    requestRefreshCollapse: PropTypes.func.isRequired,
    runnerId: PropTypes.string,
    updateComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
  }

  handleDeleteEnable = () => {
    const { requestRefreshCollapse } = this.props;
    this.setState({ isDeleting: true });
    requestRefreshCollapse();
  }

  handleDeleteCancel = () => {
    const { requestRefreshCollapse } = this.props;
    this.setState({ isDeleting: false });
    requestRefreshCollapse();
  }

  handleDeleteSubmit = () => {
    const {
      comment,
      deleteComment,
      eventId,
      runnerId,
    } = this.props;
    const { _id: commentId } = comment;
    deleteComment(eventId, runnerId, commentId);
  }

  handleEditEnable = () => {
    const { requestRefreshCollapse } = this.props;
    this.setState({ isEditing: true });
    requestRefreshCollapse();
  }

  handleEditCancel = () => {
    const { requestRefreshCollapse, comment } = this.props;
    const { text } = comment;
    this.setState({ editCommentText: text, isEditing: false });
    requestRefreshCollapse();
  }

  handleEditSubmit = () => {
    const { editCommentText } = this.state;
    const {
      comment,
      eventId,
      requestRefreshCollapse,
      runnerId,
      updateComment,
    } = this.props;
    const { _id: commentId } = comment;
    updateComment(eventId, runnerId, commentId, { text: editCommentText }, (successful) => {
      if (successful) {
        this.setState({ isEditing: false });
        requestRefreshCollapse();
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
    const { comment, currentUserId } = this.props;
    const {
      author,
      text,
      postedAt,
      updatedAt,
    } = comment;
    const {
      _id: authorId,
      displayName,
      fullName,
      active,
      profileImage,
    } = author;
    const isAuthor = (authorId === currentUserId);
    const postedDate = reformatTimestamp(postedAt);
    const updatedDate = reformatTimestamp(updatedAt);
    const datesToDisplay = (postedDate === updatedDate)
      ? `posted ${postedDate}`
      : `posted ${postedDate}, updated ${updatedDate}`;
    const headerStyle = (isAuthor)
      ? 'header event-comments-item__header event-comments-item__author'
      : 'header event-comments-item__header';
    const displayNameFiltered = (active) ? displayName : displayName.slice(0, -22);
    const textContent = (isEditing)
      ? (
        <div className="ui form event-comments-item__editor">
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
      : <div className="event-comments-item__text">{text}</div>;
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
        src={(profileImage) ? `${MAPOHOLIC_SERVER}/${profileImage}` : noAvatar}
      />
    );
    const header = (fullName === '')
      ? <div className={headerStyle}>{displayNameFiltered}</div>
      : (
        <div className={headerStyle}>
          {`${displayNameFiltered} `}
          <span className="event-comments-item__fullname">
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
          <div className="right floated event-comments-item__date">{datesToDisplay}</div>
        </div>
      </>
    );
  }

  render() {
    // console.log('props, state in EventCommentsItem:', this.props, this.state);
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
