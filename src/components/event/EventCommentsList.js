import React from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from '@lingui/macro';
import EventCommentsItem from './EventCommentsItem';

const EventCommentsList = ({
  collapseTrigger,
  currentUserId,
  deleteComment,
  getUserById,
  eventId,
  isAdmin,
  runnerData,
  updateComment,
  userDetails,
  userErrorMessage,
}) => {
  if (!runnerData) return null;

  const { user } = runnerData;
  const { _id: runnerId } = user;
  const hasComments = runnerData && runnerData.comments.length > 0;
  const sortedComments = (hasComments)
    ? [...runnerData.comments]
      .sort((a, b) => parseInt(a.postedAt, 10) - parseInt(b.postedAt, 10))
    : [];
  const renderCommentsHeader = (hasComments)
    ? (
      <p>
        <Plural
          value={sortedComments.length}
          one="# comment"
          other="# comments"
        />
      </p>
    )
    : <p><Trans>No comments have been posted yet</Trans></p>;
  const renderCommentsArray = (hasComments)
    ? (
      <div className="ui items">
        {sortedComments.map((comment) => {
          const { _id: commentId, author } = comment;
          const { _id: authorId } = author;
          if (!userDetails[authorId] && !userErrorMessage) {
            getUserById(authorId);
          }
          return (
            <EventCommentsItem
              key={commentId}
              authorDetails={userDetails[authorId]}
              collapseTrigger={collapseTrigger}
              comment={comment}
              currentUserId={currentUserId}
              deleteComment={deleteComment}
              eventId={eventId}
              isAdmin={isAdmin}
              runnerId={runnerId}
              updateComment={updateComment}
            />
          );
        })}
      </div>
    )
    : null;
  return (
    <div>
      {renderCommentsHeader}
      {renderCommentsArray}
    </div>
  );
};

EventCommentsList.propTypes = {
  collapseTrigger: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  deleteComment: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  getUserById: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  runnerData: PropTypes.objectOf(PropTypes.any),
  updateComment: PropTypes.func.isRequired,
  userDetails: PropTypes.objectOf(PropTypes.any).isRequired,
  userErrorMessage: PropTypes.string.isRequired,
};
EventCommentsList.defaultProps = {
  currentUserId: null,
  eventId: null,
  isAdmin: false,
  runnerData: null,
};

export default EventCommentsList;
