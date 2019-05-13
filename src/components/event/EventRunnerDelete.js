import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatDate } from '../../common/conversions';
/* eslint no-underscore-dangle: 0 */

const EventRunnerDelete = ({
  selectedEvent,
  selectedRunner,
  deleteEventRunner,
  setEventViewModeRunner,
}) => {
  if (!selectedEvent || !selectedRunner) return null;
  const {
    _id: eventId,
    name,
    date,
    runners,
  } = selectedEvent;
  const runnerDetails = runners.find(runner => runner.user._id === selectedRunner);
  if (!runnerDetails) return null;
  const runnerName = runnerDetails.user.displayName;
  // console.log('selectedEvent, runnerName', selectedEvent, runnerName);
  return (
    <div className="ui segment">
      <h3><Trans>Delete Runner</Trans></h3>
      <p>
        <Trans>
          {`You are about to delete ${runnerName} from ${name} (${reformatDate(date)}).`}
        </Trans>
      </p>
      <p><Trans>Note: Currently non-functional, server does not suspport this yet.</Trans></p>
      <button
        type="button"
        className="ui tiny red button"
        onClick={() => {
          deleteEventRunner(eventId, selectedRunner, (didSucceed) => {
            if (didSucceed) {
              // console.log('Nothing will happen yet, not enabled on server');
              setEventViewModeRunner('view');
            }
          });
        }}
      >
        <Trans>{`Delete ${runnerName}?`}</Trans>
      </button>
      <button
        type="button"
        className="ui tiny button right floated"
        onClick={() => setEventViewModeRunner('view')}
      >
        <Trans>Cancel</Trans>
      </button>
    </div>
  );
};

EventRunnerDelete.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  deleteEventRunner: PropTypes.func.isRequired,
  setEventViewModeRunner: PropTypes.func.isRequired,
};
EventRunnerDelete.defaultProps = {
  selectedEvent: null,
  selectedRunner: null,
};

export default EventRunnerDelete;
