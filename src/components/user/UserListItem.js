import React from 'react';
import PropTypes from 'prop-types';
import noAvatar from '../../no-avatar.png';

const UserListItem = ({ user, selectUserToDisplay }) => {
  const {
    user_id: userId,
    profileImage,
    displayName,
    fullName,
    memberOf,
    role,
    joined,
  } = user;
  // console.log(user);
  return (
    <div
      className="card"
      role="button"
      onClick={() => selectUserToDisplay(userId)}
      onKeyPress={() => selectUserToDisplay(userId)}
      tabIndex="0"
    >
      <div className="content">
        <img className="left floated ui tiny image" alt="avatar" src={profileImage || noAvatar} />
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
      <div className="extra content">
        {(role === 'admin') ? <div className="ui tag label green">Adminstrator</div> : null}
        {(role === 'guest') ? <div className="ui tag label green">Guest</div> : null}
        <span className="right floated">
          {`Joined in ${joined.slice(0, 4)}`}
        </span>
      </div>
    </div>
  );
};

UserListItem.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
};

export default UserListItem;
