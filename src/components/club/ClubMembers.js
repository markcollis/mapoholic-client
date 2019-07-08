import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans, Plural } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import noAvatar from '../../graphics/noAvatar.png';
import { MAPOHOLIC_SERVER } from '../../config';

const ClubMembers = ({
  history,
  fullEventList,
  membersList,
  selectUserToDisplay,
  setUserViewMode,
}) => {
  if (membersList.length === 0) {
    return null;
  }
  // console.log('fullEventList:', fullEventList);
  const mapCountByUserId = {};
  if (fullEventList) {
    fullEventList.forEach((eventSummary) => {
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
  // console.log('mapCountByUserId:', mapCountByUserId);

  const handleSelectUser = (userId) => {
    selectUserToDisplay(userId);
    setUserViewMode('view');
    history.push('/users');
    window.scrollTo(0, 0);
  };
  const clubMembersArray = membersList.map((member) => {
    const {
      user_id: userId,
      displayName,
      fullName,
      profileImage,
    } = member;
    // console.log('maps', mapCountByUserId[userId]);
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
  fullEventList: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  membersList: PropTypes.arrayOf(PropTypes.object),
  selectUserToDisplay: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
};
ClubMembers.defaultProps = {
  fullEventList: [],
  membersList: [],
};

export default withRouter(ClubMembers);
