import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import EventCommentsAdd from './EventCommentsAdd';
import EventCommentsList from './EventCommentsList';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

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
    ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
    : null;
  const isAdmin = (currentUser && currentUser.role === 'admin');
  const isStandard = (currentUser && currentUser.role === 'standard');
  const canPostComments = isAdmin || isStandard;
  const currentUserId = (currentUser) ? currentUser._id : null;

  const title = <Trans>Comments</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title} refreshCollapse={refreshCollapse}>
        <EventCommentsList
          requestRefreshCollapse={requestRefreshCollapse}
          currentUserId={currentUserId}
          deleteComment={deleteComment}
          eventId={eventId}
          isAdmin={isAdmin}
          refreshCollapse={refreshCollapse}
          runnerData={runnerData}
          updateComment={updateComment}
        />
        {(canPostComments)
          ? (
            <div>
              <hr className="divider" />
              <EventCommentsAdd
                requestRefreshCollapse={requestRefreshCollapse}
                eventId={eventId}
                postComment={postComment}
                refreshCollapse={refreshCollapse}
                runnerData={runnerData}
              />
            </div>
          )
          : null
        }
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
