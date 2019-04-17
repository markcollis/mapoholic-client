import React from 'react';
import PropTypes from 'prop-types';

const EventRunnerAdd = ({
  eventId,
  addEventRunner,
  setEventViewModeRunner,
  selectEventToDisplay,
  selectRunnerToDisplay,
}) => {
  return (
    <div>
      <h3>EventRunnerAdd component</h3>
      <button
        type="button"
        className="ui tiny button right floated"
        onClick={() => setEventViewModeRunner('view')}
      >
      Cancel
      </button>
    </div>
  );
};

EventRunnerAdd.propTypes = {
  eventId: PropTypes.string.isRequired,
  addEventRunner: PropTypes.func.isRequired,
  setEventViewModeRunner: PropTypes.func.isRequired,
  selectEventToDisplay: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};

export default EventRunnerAdd;
