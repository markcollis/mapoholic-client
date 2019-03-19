import React from 'react';
import PropTypes from 'prop-types';
import forest from '../../silhouette.jpg';
import noAvatar from '../../no-avatar.png';
/* eslint no-underscore-dangle: 0 */

const UserDetails = ({ userToDisplay, showOptional }) => {
  // console.log('user:', userToDisplay);
  if (!userToDisplay._id) {
    return (
      <div className="ui segment">
        <p>Select a user from the list to show their full profile here</p>
      </div>
    );
  }
  const optionalItems = (showOptional)
    ? (
      <div>
        <div className="item">{`User type: ${userToDisplay.role}`}</div>
        <div className="item">{`Profile visibility: ${userToDisplay.visibility}`}</div>
      </div>
    )
    : null;
  const displayProfile = (
    <div>
      <div>
        <div />
        <img className="profile-forest" alt="forest" src={forest} />
        <div>
          <img className="profile-image" alt="avatar" src={userToDisplay.profileImage || noAvatar} />
          <h3>{userToDisplay.displayName}</h3>
          {(userToDisplay.fullName !== userToDisplay.displayName)
            ? <div>{userToDisplay.fullName}</div>
            : null}
          {(userToDisplay.memberOf.length > 0)
            ? (
              <div>{`(${userToDisplay.memberOf.map(club => club.shortName).join(', ')})`}</div>
            )
            : null
          }
        </div>
      </div>
      <br />
      <div>
        <div className="ui list">
          <p className="item">{userToDisplay.about}</p>
          {(userToDisplay.location)
            ? (
              <div className="item">
                <i className="marker icon" />
                {userToDisplay.location}
              </div>
            )
            : null
          }
          <div className="item">
            <i className="mail icon" />
            {userToDisplay.email}
          </div>
          <div className="item">{`Joined: ${userToDisplay.createdAt.slice(0, 10)}`}</div>
          {optionalItems}
        </div>
      </div>
    </div>
  );
  return (
    <div className="ui segment">
      {displayProfile}
    </div>
  );
};

UserDetails.propTypes = {
  userToDisplay: PropTypes.objectOf(PropTypes.any),
  showOptional: PropTypes.bool,
};
UserDetails.defaultProps = {
  userToDisplay: {},
  showOptional: false,
};

export default UserDetails;
