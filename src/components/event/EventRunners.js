import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Collapse from '../Collapse';
import EventRunnersItem from './EventRunnersItem';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunners = ({
  currentUserId,
  selectedEvent,
  addEventRunner,
  selectEventToDisplay,
  selectRunnerToDisplay,
  history,
}) => {
  if (!selectedEvent._id) return null;
  const { _id: eventId, runners } = selectedEvent;
  const isCurrentRunner = runners.some(runner => runner.user._id === currentUserId);
  const runnersArray = [...runners]
    .sort((a, b) => {
      return (a.user.displayName < b.user.displayName) ? 0 : -1;
    })
    .map((runner) => {
      const { _id: runnerId } = runner;
      return (
        <EventRunnersItem
          key={runnerId}
          currentUserId={currentUserId}
          eventId={eventId}
          runner={runner}
          selectEventToDisplay={selectEventToDisplay}
          selectRunnerToDisplay={selectRunnerToDisplay}
        />
      );
    });

  const renderEventRunnerAdd = (isCurrentRunner)
    ? null
    : (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => {
          addEventRunner(eventId, (successful) => {
            if (successful) {
              selectEventToDisplay(eventId);
              selectRunnerToDisplay(currentUserId);
              history.push('/mapview');
            }
          });
        }}
      >
        Add yourself as a runner
      </button>
    );

  return (
    <div className="ui segment">
      <Collapse title="Event runners">
        <div className="ui link cards card-list">
          {runnersArray}
        </div>
        {renderEventRunnerAdd}
      </Collapse>
    </div>
  );
};

EventRunners.propTypes = {
  currentUserId: PropTypes.string,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  addEventRunner: PropTypes.func.isRequired,
  selectEventToDisplay: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
EventRunners.defaultProps = {
  currentUserId: null,
  selectedEvent: {},
};

export default withRouter(EventRunners);
