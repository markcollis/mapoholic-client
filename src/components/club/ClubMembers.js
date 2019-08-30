import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans, Plural } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import noAvatar from '../../graphics/noAvatar.png';
import { MAPOHOLIC_SERVER } from '../../config';

// The ClubMembers component renders a list of users that are members of
// the selected club
const ClubMembers = ({
  history,
  eventList,
  membersList,
  selectUserToDisplay,
  setUserViewMode,
}) => {
  if (membersList.length === 0) {
    return null;
  }
  const mapCountByUserId = {};
  if (eventList) {
    eventList.forEach((eventSummary) => {
      const { runners } = eventSummary;
      if (runners) {
        runners.forEach((runner) => {
          const { user, numberMaps } = runner;
          if (mapCountByUserId[user]) {
            mapCountByUserId[user] += numberMaps;
          } else {
            mapCountByUserId[user] = numberMaps;
          }
        });
      }
    });
  }

  const handleSelectUser = (userId) => {
    selectUserToDisplay(userId);
    setUserViewMode('view');
    history.push('/users');
    window.scrollTo(0, 0);
  };
  const clubMembersArray = membersList.map((member) => {
    const {
      _id: userId,
      displayName,
      fullName,
      profileImage,
    } = member;
    const mapCountText = (mapCountByUserId[userId] && mapCountByUserId[userId] > 0)
      ? (
        <Plural
          value={mapCountByUserId[userId]}
          one="# map"
          other="# maps"
        />
      )
      : '';
    return (
      <div
        key={userId}
        className="ui card centered"
        role="button"
        onClick={() => handleSelectUser(userId)}
        onKeyPress={() => handleSelectUser(userId)}
        tabIndex="0"
      >
        <div className="content">
          <img
            className="right floated ui avatar image"
            alt="avatar"
            src={(profileImage) ? `${MAPOHOLIC_SERVER}/${profileImage}` : noAvatar}
          />
          <div className="header  ">
            {displayName}
          </div>
          <div className="meta">
            {fullName}
            {' '}
            {mapCountText}
          </div>
        </div>
      </div>
    );
  });
  const title = <Trans>Members</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {clubMembersArray}
        </div>
      </Collapse>
    </div>
  );
};

ClubMembers.propTypes = {
  eventList: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  membersList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
};

export default withRouter(ClubMembers);
