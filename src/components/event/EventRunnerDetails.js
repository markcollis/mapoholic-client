import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import { visibilityOptionsLocale } from '../../common/formData';
import noAvatar from '../../graphics/noAvatar.jpg';

// The EventRunnerDetails component renders detailed information about a runner and
// their particular run at a particular event
const EventRunnerDetails = ({
  canEdit,
  history,
  language,
  requestRefreshCollapse,
  selectedEvent,
  selectedRunner,
  selectUserToDisplay,
  setUserViewMode,
  setEventViewModeRunner,
  userList,
}) => {
  const { _id: selectedEventId } = selectedEvent;
  if (!selectedEventId) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader"><Trans>Loading event details...</Trans></div>
      </div>
    );
  }
  const visibilityOptions = visibilityOptionsLocale[language];
  const selectedRunnerDetails = selectedEvent.runners
    .find(({ user }) => {
      const { _id: runnerId } = user;
      return runnerId === selectedRunner;
    });
  if (!selectedRunnerDetails) {
    return (
      <div className="ui segment">
        <p><Trans>Sorry, no matching runner details were found.</Trans></p>
      </div>
    );
  }
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
  } = selectedRunnerDetails;
  const {
    _id: userId,
    displayName,
    fullName,
    profileImage,
  } = user;
  const avatar = (
    <img
      className="ui tiny image right floated"
      alt="avatar"
      onLoad={() => {
        requestRefreshCollapse();
      }}
      src={profileImage || noAvatar}
      onError={(e) => {
        e.target.src = noAvatar; // if loading profileImage fails
      }}
    />
  );

  const nameToDisplay = `${displayName} ${(fullName && fullName !== '') ? `(${fullName})` : ''}`;
  const renderHeader = (userList && userList.find((eachUser) => {
    const { _id: eachUserId } = eachUser;
    return eachUserId === userId;
  }))
    ? (
      <h3 className="header">
        <a
          href="/users"
          onClick={(e) => {
            e.preventDefault();
            selectUserToDisplay(userId);
            setUserViewMode('view');
            history.push('/users');
            window.scrollTo(0, 0);
          }}
        >
          {nameToDisplay}
        </a>
      </h3>
    )
    : (
      <h3 className="header">
        {`${displayName} ${(fullName && fullName !== '') ? `(${fullName})` : ''}`}
      </h3>
    );
  const courseTitleToDisplay = (courseTitle && courseTitle !== '')
    ? (
      <Trans>
        {'Course: '}
        <span className="event-runner-details--highlight">{courseTitle}</span>
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
        <span className="event-runner-details--highlight">{time}</span>
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
  const renderResultsInfo = (fullResults && fullResults.length > 0)
    ? <p><Trans>{`See below for detailed results (${fullResults.length} runners)`}</Trans></p>
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
  const visibilityText = visibilityOptions.find((el) => el.value === visibility).label;
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
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  language: PropTypes.string.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  selectUserToDisplay: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
  setEventViewModeRunner: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object),
};
EventRunnerDetails.defaultProps = {
  canEdit: false,
  selectedEvent: {},
  selectedRunner: '',
  userList: null,
};

export default withRouter(EventRunnerDetails);
