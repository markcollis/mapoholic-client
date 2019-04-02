import React from 'react';
import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
import Collapse from '../Collapse';

const UserList = ({ users, selectUserToDisplay, setUserViewMode }) => {
  if (users.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">{'Sorry, there aren\'t any matching users to display!'}</div>
      </div>
    );
  }
  const usersArray = [...users]
    .sort((a, b) => {
      return (a.displayName > b.displayName) ? 0 : -1;
    })
    .map((user) => {
      const { user_id: userId } = user;
      return (
        <UserListItem
          key={userId}
          user={user}
          selectUserToDisplay={selectUserToDisplay}
          setUserViewMode={setUserViewMode}
        />
      );
    });
  return (
    <div className="ui segment">
      <Collapse title="User list">
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
  users: PropTypes.arrayOf(PropTypes.object),
  selectUserToDisplay: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
};
UserList.defaultProps = {
  users: [],
};

export default UserList;
