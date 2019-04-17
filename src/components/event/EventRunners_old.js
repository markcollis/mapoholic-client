import React from 'react';
import PropTypes from 'prop-types';
import EventRunnerAdd from './EventRunnerAdd';
import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunners = ({
  selectedEvent,
  runnerMode,
  addEventRunner,
  setEventViewModeRunner,
  selectEventToDisplay,
  selectRunnerToDisplay,
}) => {
  if (!selectedEvent._id) return null;
  const renderEventRunners = (selectedEvent.runners.length === 0)
    ? <p>No runners to show</p>
    : (
      <div className="ui list">
        {selectedEvent.runners.map((runner) => {
          const { displayName, fullName, memberOf } = runner.user;
          const fullNameToShow = (fullName) ? ` (${fullName})` : null;
          const clubsToShow = (memberOf.length > 0)
            ? (
              <span>
                {memberOf.map((club) => {
                  const { shortName } = club;
                  return <div key={shortName} className="ui label">{shortName}</div>;
                })}
              </span>
            )
            : null;
          return (
            <div className="item" key={displayName}>
              {`${displayName}${fullNameToShow} `}
              {clubsToShow}
            </div>
          );
        })}
      </div>
    );
  const renderEventRunnerAdd = (runnerMode === 'add')
    ? (
      <EventRunnerAdd
        eventId={selectedEvent._id}
        addEventRunner={addEventRunner}
        setEventViewModeRunner={setEventViewModeRunner}
        selectEventToDisplay={selectEventToDisplay}
        selectRunnerToDisplay={selectRunnerToDisplay}
      />
    )
    : (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => {
          setEventViewModeRunner('add');
        }}
      >
        Add yourself as a runner
      </button>
    );

  return (
    <div className="ui segment">
      <Collapse title="Event runners">
        {renderEventRunners}
        <hr className="divider" />
        {renderEventRunnerAdd}
      </Collapse>
    </div>
  );
};

EventRunners.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  runnerMode: PropTypes.string,
  addEventRunner: PropTypes.func.isRequired,
  setEventViewModeRunner: PropTypes.func.isRequired,
  selectEventToDisplay: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};
EventRunners.defaultProps = {
  selectedEvent: {},
  runnerMode: 'view',
};

export default EventRunners;
