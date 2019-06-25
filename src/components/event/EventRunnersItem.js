import React from 'react';
import PropTypes from 'prop-types';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunnersItem = ({
  currentUserId,
  eventId,
  getUserById,
  handleSelectEventRunner,
  runner,
  selectedRunner,
  userDetails,
  userErrorMessage,
}) => {
  const {
    _id: userId,
    displayName,
    fullName,
    memberOf,
  } = runner.user;
  // check if runner has been deleted (as 'deletion' involves setting runner
  // records to 'private' instead of completely deleting them)
  // only admin users should ever see deleted runners displayed
  const isDeleted = (displayName.slice(-21, -14) === 'deleted');
  // console.log('isDeleted', isDeleted);
  const headerClass = (isDeleted)
    ? 'header event-runners-deleted'
    : 'header';
  let cardClass = 'ui fluid centered card event-runners-item';
  if (currentUserId === userId) cardClass = cardClass.concat(' item-current-user');
  if (selectedRunner === userId) cardClass = cardClass.concat(' item-selected');
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

  if (!userDetails[userId] && !userErrorMessage && !isDeleted) {
    getUserById(userId);
  }

  const avatar = (
    <img
      className="ui mini image left floated"
      alt="avatar"
      src={(userDetails[userId] && userDetails[userId].profileImage)
        ? `${OMAPFOLDER_SERVER}/${userDetails[userId].profileImage}`
        : noAvatar}
    />
  );

  return (
    <div
      className={cardClass}
      role="button"
      onClick={() => handleSelectEventRunner(eventId, userId)}
      onKeyPress={() => handleSelectEventRunner(eventId, userId)}
      tabIndex="0"
    >
      <div className="content">
        {avatar}
        <div className={headerClass}>
          {displayName}
        </div>
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
  getUserById: PropTypes.func.isRequired,
  handleSelectEventRunner: PropTypes.func.isRequired,
  runner: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedRunner: PropTypes.string.isRequired,
  userDetails: PropTypes.objectOf(PropTypes.any),
  userErrorMessage: PropTypes.string,
};
EventRunnersItem.defaultProps = {
  currentUserId: null,
  userDetails: {},
  userErrorMessage: '',
};

export default EventRunnersItem;
