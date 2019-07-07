import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import EventRunnersItem from './EventRunnersItem';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunners = ({
  addEventRunner,
  addEventRunnerOris,
  currentUserId,
  currentUserOrisId,
  handleSelectEventRunner,
  history,
  selectedEvent,
  selectedRunner,
  selectEventId,
  selectRunnerToDisplay,
}) => {
  if (!selectedEvent._id) return null;
  const { _id: eventId, runners, orisId } = selectedEvent;
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
          handleSelectEventRunner={handleSelectEventRunner}
          runner={runner}
          selectedRunner={selectedRunner}
        />
      );
    });

  const useOrisToAdd = orisId && orisId !== '' && currentUserOrisId && currentUserOrisId !== '';
  const renderEventRunnerAdd = (isCurrentRunner || !currentUserId)
    ? null
    : (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => {
          if (useOrisToAdd) {
            addEventRunnerOris(eventId, (successful) => {
              if (successful) {
                selectEventId(eventId);
                selectRunnerToDisplay(currentUserId);
                history.push('/mapview');
                window.scrollTo(0, 0);
              }
            });
          } else {
            addEventRunner(eventId, (successful) => {
              if (successful) {
                selectEventId(eventId);
                selectRunnerToDisplay(currentUserId);
                history.push('/mapview');
                window.scrollTo(0, 0);
              }
            });
          }
        }}
      >
        <Trans>Add yourself as a runner</Trans>
      </button>
    );
  const title = <Trans>Runners at event (select one to see their maps)</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {runnersArray}
        </div>
        {renderEventRunnerAdd}
      </Collapse>
    </div>
  );
};

EventRunners.propTypes = {
  addEventRunner: PropTypes.func.isRequired,
  addEventRunnerOris: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  currentUserOrisId: PropTypes.string,
  handleSelectEventRunner: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  selectEventId: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};
EventRunners.defaultProps = {
  currentUserId: null,
  currentUserOrisId: null,
  selectedEvent: {},
  selectedRunner: '',
};

export default withRouter(EventRunners);
