import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import forest from '../../graphics/blueForest.png';
import noAvatar from '../../graphics/noAvatar.png';
import { MAPOHOLIC_SERVER } from '../../config';
import { reformatTimestampDateOnly } from '../../common/conversions';

const UserDetails = ({
  language,
  refreshCollapse,
  requestRefreshCollapse,
  showOptional,
  selectedUser,
  setUserViewMode,
}) => {
  const { _id: userId } = selectedUser;
  if (!userId) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader">
          <Trans>Loading user details...</Trans>
        </div>
      </div>
    );
  }
  const {
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
        <div className="item"><Trans>{`User type: ${role}`}</Trans></div>
        <div className="item"><Trans>{`Profile visibility: ${visibility}`}</Trans></div>
        <div className="item"><Trans>{`Internal ID: ${userId}`}</Trans></div>
        {(orisId)
          ? <div><Trans>{`ORIS ID: ${orisId}`}</Trans></div>
          : null}
        <div className="item"><Trans>{`Last updated: ${reformatTimestampDateOnly(updatedAt, language)}`}</Trans></div>
        <hr className="divider" />
        <button
          type="button"
          className="ui red tiny button right floated"
          onClick={() => setUserViewMode('delete')}
        >
          <Trans>Delete user</Trans>
        </button>
        <button
          type="button"
          className="ui primary tiny button"
          onClick={() => setUserViewMode('edit')}
        >
          <Trans>Edit user details</Trans>
        </button>
      </div>
    )
    : null;
  const displayProfile = (
    <div>
      <div>
        <img
          className="user-details__background-image"
          alt="forest"
          src={forest}
          onLoad={() => requestRefreshCollapse()}
        />
        <img
          className="user-details__profile-image"
          alt="avatar"
          src={(profileImage) ? `${MAPOHOLIC_SERVER}/${profileImage}` : noAvatar}
        />
      </div>
      <div>
        <h3 className="user-details__title">{displayName}</h3>
        {(fullName !== displayName)
          ? fullName
          : null}
        {(memberOf.length > 0)
          ? (
            <div>{`(${memberOf.map(club => club.shortName).join(', ')})`}</div>
          )
          : null
        }
      </div>
      <div>
        <div className="ui list">
          <p className="item">{about}</p>
          {(location && location !== '')
            ? (
              <div className="item">
                <div className="content">
                  <i className="marker icon" />
                  {location}
                </div>
              </div>
            )
            : null
          }
          <div className="item">
            <i className="mail icon" />
            <div className="content">
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
          {(regNumber && regNumber !== '')
            ? (
              <div className="item">
                <div className="content">
                  <i className="compass outline icon" />
                  {regNumber}
                </div>
              </div>
            )
            : null
          }
          <div className="item"><Trans>{`Joined: ${reformatTimestampDateOnly(createdAt, language)}`}</Trans></div>
          {optionalItems}
        </div>
      </div>
    </div>
  );
  const title = <Trans>User profile</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title} refreshCollapse={refreshCollapse}>
        {displayProfile}
      </Collapse>
    </div>
  );
};

UserDetails.propTypes = {
  language: PropTypes.string.isRequired,
  refreshCollapse: PropTypes.number.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedUser: PropTypes.objectOf(PropTypes.any),
  setUserViewMode: PropTypes.func.isRequired,
  showOptional: PropTypes.bool,
};
UserDetails.defaultProps = {
  selectedUser: {},
  showOptional: false,
};

export default UserDetails;
