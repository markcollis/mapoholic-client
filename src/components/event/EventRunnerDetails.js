import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import Collapse from '../Collapse';
import { visibilityOptionsLocale } from '../../common/data';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunnerDetails = ({
  canEdit,
  language,
  runnerDetails,
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
  const visibilityOptions = visibilityOptionsLocale[language];
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
    // maps,
    // comments,
  } = selectedRunnerDetails;
  const { displayName, fullName } = user;
  // className="event-runner-profile-image"
  const avatar = (
    <img
      className="ui tiny image right floated"
      alt="avatar"
      src={(runnerDetails && runnerDetails.profileImage) ? `${OMAPFOLDER_SERVER}/${runnerDetails.profileImage}` : noAvatar}
    />
  );
  const renderHeader = (
    <h3 className="header">
      {`${displayName} ${(fullName && fullName !== '') ? `(${fullName})` : ''}`}
    </h3>
  );
  const courseTitleToDisplay = (courseTitle && courseTitle !== '')
    ? (
      <Trans>
        {'Course: '}
        <span className="course-title">{courseTitle}</span>
      </Trans>
    )
    : null;
  const courseLengthToDisplay = (courseLength && courseLength !== '')
    ? `${courseLength}km, `
    : '';
  const courseClimbToDisplay = (courseClimb && courseClimb !== '')
    ? `${courseClimb}m, `
    : '';
  const courseControlsToDisplay = (courseControls && courseControls !== '')
    ? <Trans>{`${courseControls} controls`}</Trans>
    : '';
  const renderCourseDetails = (courseTitleToDisplay)
    ? (
      <div>
        {courseTitleToDisplay}
        {(courseLengthToDisplay || courseClimbToDisplay || courseControlsToDisplay)
          ? (
            <span>
              {' ('}
              {courseLengthToDisplay}
              {courseClimbToDisplay}
              {courseControlsToDisplay}
              {')'}
            </span>
          )
          : ''}
      </div>
    )
    : <div className="item"><Trans>No course details to display</Trans></div>;
  const resultTimeToDisplay = (time && time !== '')
    ? (
      <Trans>
        {'Result: '}
        <span className="course-title">{time}</span>
      </Trans>
    )
    : null;
  const resultFieldSizeToDisplay = (fieldSize && fieldSize !== '')
    ? <Trans>{`of ${fieldSize}`}</Trans>
    : '';
  const renderResultSummary = (resultTimeToDisplay)
    ? (
      <p>
        {resultTimeToDisplay}
        {((place && place !== '') || (timeBehind && timeBehind !== ''))
          ? (
            <span>
              {(timeBehind) ? ` (${timeBehind}, ` : ' ('}
              {place || ''}
              {(resultFieldSizeToDisplay !== '') ? ' ' : ''}
              {resultFieldSizeToDisplay}
              {')'}
            </span>
          )
          : ''}
      </p>
    )
    : <p><Trans>No result to display</Trans></p>;
  const renderResultsInfo = (fullResults.length > 0)
    ? <p><Trans>{`See below for results (${fullResults.length} runners)`}</Trans></p>
    : null;
  const renderTags = (tags && tags.length > 0)
    ? (
      <div>
        {tags.map((tag) => {
          return <div key={tag} className="ui violet label">{tag}</div>;
        })}
      </div>
    )
    : null;
  const visibilityText = visibilityOptions.find(el => el.value === visibility).label;
  const renderEditButtons = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <p>{`Visibility to other users: ${visibilityText}`}</p>
        <button type="button" className="ui red tiny button right floated" onClick={() => setEventViewModeRunner('delete')}>
          <Trans>Delete runner</Trans>
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setEventViewModeRunner('edit')}>
          <Trans>Edit runner details</Trans>
        </button>
      </div>
    )
    : null;
  const displayEventRunnerDetails = (
    <div>
      {avatar}
      {renderHeader}
      {renderCourseDetails}
      {renderResultSummary}
      {renderResultsInfo}
      {renderTags}
      {renderEditButtons}
    </div>
  );
  // <div className="item">{`${maps.length} maps, see below`}</div>
  // <div className="item">{`${comments.length} comments, see below`}</div>

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
  language: PropTypes.string.isRequired,
  runnerDetails: PropTypes.objectOf(PropTypes.any),
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  setEventViewModeRunner: PropTypes.func.isRequired,
};
EventRunnerDetails.defaultProps = {
  canEdit: false,
  runnerDetails: {},
  selectedEvent: {},
  selectedRunner: '',
};

export default EventRunnerDetails;
