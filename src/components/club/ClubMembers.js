import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
import noAvatar from '../../no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';

const ClubMembers = ({ membersList, selectClubMember }) => {
  if (membersList.length === 0) {
    return null;
  }
  const clubMembersArray = membersList.map((member) => {
    const {
      user_id: userId,
      displayName,
      fullName,
      profileImage,
    } = member;
    return (
      <div
        key={userId}
        className="ui card centered"
        role="button"
        onClick={() => selectClubMember(userId)}
        onKeyPress={() => selectClubMember(userId)}
        tabIndex="0"
      >
        <div className="content">
          <img
            className="right floated ui avatar image"
            alt="avatar"
            src={(profileImage) ? `${OMAPFOLDER_SERVER}/${profileImage}` : noAvatar}
          />
          <div className="header  ">
            {displayName}
          </div>
          <div className="meta">
            {`${fullName} (x maps)`}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="ui segment">
      <Collapse title="Members">
        <div className="ui link cards card-list">
          {clubMembersArray}
        </div>
      </Collapse>
    </div>
  );
};

ClubMembers.propTypes = {
  membersList: PropTypes.arrayOf(PropTypes.object),
  selectClubMember: PropTypes.func.isRequired,
};
ClubMembers.defaultProps = {
  membersList: [],
};

export default ClubMembers;
