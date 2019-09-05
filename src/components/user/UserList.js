import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import UserListItem from './UserListItem';
import Collapse from '../generic/Collapse';

// The UserList component renders a list of users
const UserList = ({
  currentUserId,
  language,
  selectUserToDisplay,
  selectedUserId,
  setUserViewMode,
  users,
}) => {
  if (users.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">
          <Trans>{'Sorry, there aren\'t any matching users to display!'}</Trans>
        </div>
      </div>
    );
  }
  const usersArray = [...users]
    .sort((a, b) => {
      return (a.displayName > b.displayName) ? 0 : -1;
    })
    .map((user) => {
      const { _id: userId } = user;
      return (
        <UserListItem
          key={userId}
          currentUserId={currentUserId}
          language={language}
          user={user}
          selectUserToDisplay={selectUserToDisplay}
          selectedUserId={selectedUserId}
          setUserViewMode={setUserViewMode}
        />
      );
    });
  const title = <Trans>User list</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div
          className="ui link cards card-list"
          role="button"
          onClick={(e) => {
            if (e.target.classList.contains('cards')) {
              selectUserToDisplay('');
              setUserViewMode('none');
            }
          }}
          onKeyPress={(e) => {
            if (e.target.classList.contains('cards')) {
              selectUserToDisplay('');
              setUserViewMode('none');
            }
          }}
          tabIndex="0"
        >
          {usersArray}
        </div>
      </Collapse>
    </div>
  );
};

UserList.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  language: PropTypes.string,
  selectUserToDisplay: PropTypes.func.isRequired,
  selectedUserId: PropTypes.string.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
};
UserList.defaultProps = {
  language: 'en',
  users: [],
};

export default UserList;
