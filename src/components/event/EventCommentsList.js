import React from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from '@lingui/macro';
import EventCommentsItem from './EventCommentsItem';

// The EventCommentsList component renders a list of comments from a runner record
const EventCommentsList = ({
  currentUserId,
  deleteComment,
  eventId,
  isAdmin,
  requestRefreshCollapse,
  runnerData,
  updateComment,
}) => {
  if (!runnerData) return null;

  const { user } = runnerData;
  const { _id: runnerId } = user;
  const hasComments = Boolean(runnerData && runnerData.comments.length > 0);
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
          const { _id: commentId } = comment;
          return (
            <EventCommentsItem
              key={commentId}
              requestRefreshCollapse={requestRefreshCollapse}
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
  currentUserId: PropTypes.string,
  deleteComment: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  isAdmin: PropTypes.bool,
  requestRefreshCollapse: PropTypes.func.isRequired,
  runnerData: PropTypes.objectOf(PropTypes.any),
  updateComment: PropTypes.func.isRequired,
};
EventCommentsList.defaultProps = {
  currentUserId: null,
  eventId: null,
  isAdmin: false,
  runnerData: null,
};

export default EventCommentsList;
