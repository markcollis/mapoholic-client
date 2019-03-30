import React from 'react';
import PropTypes from 'prop-types';
import noAvatar from '../../no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';

const UserListItem = ({ user, selectUserToDisplay }) => {
  const {
    user_id: userId,
    profileImage,
    displayName,
    fullName,
    memberOf,
    role,
  } = user;
  // console.log(user);
  return (
    <div
      className="ui fluid card"
      role="button"
      onClick={() => selectUserToDisplay(userId)}
      onKeyPress={() => selectUserToDisplay(userId)}
      tabIndex="0"
    >
      <div className="content">
        <img
          className="left floated ui tiny image"
          alt="avatar"
          src={(profileImage) ? `${OMAPFOLDER_SERVER}/${profileImage}` : noAvatar}
        />
        <div className="header">
          {displayName}
        </div>
        <div className="meta">
          <p>{fullName}</p>
          {(memberOf && memberOf.length > 0)
            ? (
              <div>
                {memberOf.map((club) => {
                  return <div key={club} className="ui label">{club}</div>;
                })}
              </div>
            )
            : null}
        </div>
      </div>
      {(role === 'admin' || role === 'guest')
        ? (
          <div className="extra content">
            <div className="right floated">
              {(role === 'admin') ? 'Adminstrator' : 'Guest'}
            </div>
          </div>
        )
        : null}
    </div>
  );
};

UserListItem.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
};

export default UserListItem;
