import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import EventCommentsAdd from './EventCommentsAdd';
import EventCommentsList from './EventCommentsList';

// The EventComments component is the parent for viewing and editing
// all comments related to a particular event/runner combination
const EventComments = ({
  currentUser,
  deleteComment,
  postComment,
  refreshCollapse,
  requestRefreshCollapse,
  selectedEvent,
  selectedRunner,
  updateComment,
}) => {
  const { _id: eventId } = selectedEvent;
  const runnerData = (selectedEvent.runners)
    ? selectedEvent.runners.find((runner) => {
      const { user } = runner;
      const { _id: runnerId } = user;
      return runnerId === selectedRunner;
    })
    : null;
  const isAdmin = Boolean(currentUser && currentUser.role === 'admin');
  const isStandard = Boolean(currentUser && currentUser.role === 'standard');
  const canPostComments = isAdmin || isStandard;
  let currentUserId = null;
  if (currentUser) {
    const { _id: userId } = currentUser;
    currentUserId = userId;
  }

  const title = <Trans>Comments</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title} refreshCollapse={refreshCollapse}>
        <EventCommentsList
          currentUserId={currentUserId}
          deleteComment={deleteComment}
          eventId={eventId}
          isAdmin={isAdmin}
          refreshCollapse={refreshCollapse}
          requestRefreshCollapse={requestRefreshCollapse}
          runnerData={runnerData}
          updateComment={updateComment}
        />
        {(canPostComments)
          ? (
            <div>
              <hr className="divider" />
              <EventCommentsAdd
                eventId={eventId}
                postComment={postComment}
                refreshCollapse={refreshCollapse}
                requestRefreshCollapse={requestRefreshCollapse}
                runnerData={runnerData}
              />
            </div>
          )
          : null}
      </Collapse>
    </div>
  );
};

EventComments.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  deleteComment: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  refreshCollapse: PropTypes.number.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  updateComment: PropTypes.func.isRequired,
};
EventComments.defaultProps = {
  currentUser: null,
  selectedEvent: {},
  selectedRunner: '',
};

export default EventComments;
