import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../Collapse';
import EventCommentsAdd from './EventCommentsAdd';
import EventCommentsList from './EventCommentsList';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventComments = ({
  collapseTrigger,
  currentUser,
  deleteComment,
  getUserById,
  postComment,
  updateComment,
  selectedEvent,
  selectedRunner,
  userDetails,
  userErrorMessage,
}) => {
  const { _id: eventId } = selectedEvent;
  console.log('selectedEvent/Runner in EventComments:', selectedEvent, selectedRunner);
  console.log('currentUser in EventComments:', currentUser);
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
      <Collapse title={title}>
        <EventCommentsList
          collapseTrigger={collapseTrigger}
          currentUserId={currentUserId}
          deleteComment={deleteComment}
          eventId={eventId}
          getUserById={getUserById}
          isAdmin={isAdmin}
          runnerData={runnerData}
          updateComment={updateComment}
          userDetails={userDetails}
          userErrorMessage={userErrorMessage}
        />
        {(canPostComments)
          ? (
            <div>
              <hr className="divider" />
              <EventCommentsAdd
                collapseTrigger={collapseTrigger}
                eventId={eventId}
                postComment={postComment}
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
  collapseTrigger: PropTypes.func.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  deleteComment: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  userDetails: PropTypes.objectOf(PropTypes.any),
  userErrorMessage: PropTypes.string,
};
EventComments.defaultProps = {
  currentUser: null,
  selectedEvent: {},
  selectedRunner: '',
  userDetails: {},
  userErrorMessage: '',
};

export default EventComments;
