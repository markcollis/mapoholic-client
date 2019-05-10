import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunnerDetails = ({
  canEdit,
  selectedEvent,
  selectedRunner,
  setEventViewModeRunner,
}) => {
  if (!selectedEvent._id) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader"><Trans>Loading event details...</Trans></div>
      </div>
    );
  }
  const selectedRunnerDetails = selectedEvent.runners
    .find(runner => runner.user._id === selectedRunner);
  if (!selectedRunnerDetails) {
    return (
      <div className="ui segment">
        <p><Trans>Sorry, no matching runner details were found.</Trans></p>
      </div>
    );
  }
  // console.log('selectedRunnerDetails', selectedRunnerDetails);
  const {
    user,
    visibility,
    courseTitle,
    courseLength,
    courseClimb,
    courseControls,
    fullResults,
    time,
    place,
    timeBehind,
    fieldSize,
    tags,
    maps,
    comments,
  } = selectedRunnerDetails;
  const { displayName, fullName } = user;

  const showEdit = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setEventViewModeRunner('delete')}>
          <Trans>Delete runner</Trans>
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setEventViewModeRunner('edit')}>
          <Trans>Edit runner details</Trans>
        </button>
      </div>
    )
    : null;
  const renderTags = (tags && tags.length > 0)
    ? (
      <span>
        {tags.map((tag) => {
          return <div key={tag} className="ui violet label">{tag}</div>;
        })}
      </span>
    )
    : null;
  const renderResultsInfo = (fullResults.length > 0)
    ? <Trans>{`See below for results (${fullResults.length})`}</Trans>
    : <Trans>No results to display</Trans>;
  const displayEventRunnerDetails = (
    <div>
      <h3 className="header">{`${displayName} (${fullName})`}</h3>
      {`visibility: ${visibility}`}
      <div className="ui list">
        <div className="item">
          {`Course: ${courseTitle}\n(${courseLength}km, ${courseClimb}m, ${courseControls} controls)`}
        </div>
        <div className="item">
          {`Result: ${time}, ${place} of ${fieldSize}, ${timeBehind}`}
        </div>
        <div className="item">{renderResultsInfo}</div>
        <div className="item">{`${maps.length} maps, see below`}</div>
        <div className="item">{`${comments.length} comments, see below`}</div>
      </div>
      <div>{renderTags}</div>
      {showEdit}
    </div>
  );
  const title = <Trans>Runner details</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {displayEventRunnerDetails}
      </Collapse>
    </div>
  );
};

EventRunnerDetails.propTypes = {
  canEdit: PropTypes.bool,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  setEventViewModeRunner: PropTypes.func.isRequired,
};
EventRunnerDetails.defaultProps = {
  canEdit: false,
  selectedEvent: {},
  selectedRunner: '',
};

export default EventRunnerDetails;
