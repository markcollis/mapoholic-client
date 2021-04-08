import React, { FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { Trans, Plural } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import noAvatar from '../../graphics/noAvatar.jpg';

import { OEventSummary } from '../../types/event';
import { User } from '../../types/user';

interface ClubMembersProps extends RouteComponentProps {
  history: History;
  eventList: OEventSummary[];
  membersList: User[];
  selectUserToDisplay: (userId: string) => void;
  setUserViewMode: (userViewMode: string) => void;
}

// The ClubMembers component renders a list of users that are members of
// the selected club
const ClubMembers: FunctionComponent<ClubMembersProps> = ({
  history,
  eventList,
  membersList,
  selectUserToDisplay,
  setUserViewMode,
}) => {
  if (membersList.length === 0) {
    return null;
  }
  const mapCountByUserId: { [key: string]: number} = {};
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

  const handleSelectUser = (userId: string): void => {
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
        tabIndex={0}
      >
        <div className="content">
          <img
            className="right floated ui avatar image"
            alt="avatar"
            src={profileImage || noAvatar}
            onError={(e) => {
              const targetImage = e.target as HTMLImageElement;
              targetImage.src = noAvatar; // if loading profileImage fails
            }}
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

export default withRouter(ClubMembers);
