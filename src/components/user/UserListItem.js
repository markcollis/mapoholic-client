import React from 'react';
import PropTypes from 'prop-types';

import { roleOptionsLocale } from '../../common/data';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';

const UserListItem = ({
  language,
  selectUserToDisplay,
  setUserViewMode,
  user,
}) => {
  const {
    user_id: userId,
    profileImage,
    displayName,
    fullName,
    memberOf,
    role,
  } = user;
  const roleOptions = roleOptionsLocale[language];
  const roleAdminName = roleOptions.find(el => el.value === 'admin').label;
  const roleGuestName = roleOptions.find(el => el.value === 'guest').label;

  return (
    <div
      className="ui centered card"
      role="button"
      onClick={() => {
        selectUserToDisplay(userId);
        setUserViewMode('view');
      }}
      onKeyPress={() => {
        selectUserToDisplay(userId);
        setUserViewMode('view');
      }}
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
              {(role === 'admin') ? roleAdminName : roleGuestName}
            </div>
          </div>
        )
        : null}
    </div>
  );
};

UserListItem.propTypes = {
  language: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
};
UserListItem.defaultProps = {
  language: 'en',
};

export default UserListItem;
