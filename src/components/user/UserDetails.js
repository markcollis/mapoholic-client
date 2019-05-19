import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
import forest from '../../graphics/silhouette.jpg';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const UserDetails = ({ selectedUser, showOptional, setUserViewMode }) => {
  if (!selectedUser._id) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader">Loading user details...</div>
      </div>
    );
  }
  const {
    _id: userId,
    about,
    createdAt,
    displayName,
    email,
    fullName,
    location,
    memberOf,
    orisId,
    profileImage,
    regNumber,
    role,
    updatedAt,
    visibility,
  } = selectedUser;
  const optionalItems = (showOptional) // shown only to self/admin
    ? (
      <div>
        <hr className="divider" />
        <div className="item">{`User type: ${role}`}</div>
        <div className="item">{`Profile visibility: ${visibility}`}</div>
        <div className="item">{`Internal ID: ${userId}`}</div>
        {(orisId)
          ? <div>{`ORIS ID: ${orisId}`}</div>
          : null}
        <div className="item">{`Last updated: ${updatedAt.slice(0, 10)}`}</div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setUserViewMode('delete')}>
          Delete user
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setUserViewMode('edit')}>
          Edit user details
        </button>
      </div>
    )
    : null;
  const displayProfile = (
    <div>
      <div>
        <div />
        <img className="profile-forest" alt="forest" src={forest} />
        <div>
          <img
            className="profile-image"
            alt="avatar"
            src={(profileImage) ? `${OMAPFOLDER_SERVER}/${profileImage}` : noAvatar}
          />

          <h3>{displayName}</h3>
          {(fullName !== displayName)
            ? <div>{fullName}</div>
            : null}
          {(memberOf.length > 0)
            ? (
              <div>{`(${memberOf.map(club => club.shortName).join(', ')})`}</div>
            )
            : null
          }
        </div>
      </div>
      <br />
      <div>
        <div className="ui list">
          <p className="item">{about}</p>
          {(location && location !== '')
            ? (
              <div className="item">
                <i className="marker icon" />
                {location}
              </div>
            )
            : null
          }
          <div className="item">
            <i className="mail icon" />
            {email}
          </div>
          {(regNumber && regNumber !== '')
            ? (
              <div className="item">
                <i className="compass outline icon" />
                {regNumber}
              </div>
            )
            : null
          }
          <div className="item">{`Joined: ${createdAt.slice(0, 10)}`}</div>
          {optionalItems}
        </div>
      </div>
    </div>
  );
  return (
    <div className="ui segment">
      <Collapse title="User profile">
        {displayProfile}
      </Collapse>
    </div>
  );
};

UserDetails.propTypes = {
  selectedUser: PropTypes.objectOf(PropTypes.any),
  showOptional: PropTypes.bool,
  setUserViewMode: PropTypes.func.isRequired,
};
UserDetails.defaultProps = {
  selectedUser: {},
  showOptional: false,
};

export default UserDetails;
