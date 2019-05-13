import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunnersItem = ({
  currentUserId,
  eventId,
  handleSelectEventRunner,
  runner,
}) => {
  const {
    _id: userId,
    displayName,
    fullName,
    memberOf,
  } = runner.user;
  const cardClass = (currentUserId === userId)
    ? 'ui fluid centered card event-runners-item event-runners-current'
    : 'ui fluid centered card event-runners-item';
  const clubsToShow = (memberOf && memberOf.length > 0)
    ? (
      <span>
        {memberOf.map((club) => {
          const { shortName } = club;
          return <div key={shortName} className="ui label floatedright">{shortName}</div>;
        })}
      </span>
    )
    : null;

  return (
    <div
      className={cardClass}
      role="button"
      onClick={() => handleSelectEventRunner(eventId, userId)}
      onKeyPress={() => handleSelectEventRunner(eventId, userId)}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">{displayName}</div>
        <div className="meta">
          {fullName}
          {clubsToShow}
        </div>
      </div>
    </div>
  );
};

EventRunnersItem.propTypes = {
  currentUserId: PropTypes.string,
  eventId: PropTypes.string.isRequired,
  handleSelectEventRunner: PropTypes.func.isRequired,
  runner: PropTypes.objectOf(PropTypes.any).isRequired,
};
EventRunnersItem.defaultProps = {
  currentUserId: null,
};

export default EventRunnersItem;
