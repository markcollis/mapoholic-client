import React from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
import Collapse from '../Collapse';

const UserList = ({ users, selectUserToDisplay }) => {
  if (users.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">{'Sorry, there aren\'t any matching users to display!'}</div>
      </div>
    );
  }
  // const testError = false;
  // if (testError) {
  //   throw new Error('Noooooo!');
  // }
  const usersArray = users.map((user) => {
    const { user_id: userId } = user;
    // console.log('userId', userId);
    return (
      // <div key={userId}>{userId}</div>
      <UserListItem key={userId} user={user} selectUserToDisplay={selectUserToDisplay} />
    );
  });
  return (
    <div className="ui segment">
      <Collapse title="User list">
        <div className="ui link cards">
          {usersArray}
        </div>
      </Collapse>
    </div>
  );
};
// <h3>User List</h3>
// <div>
// <div className="ui link cards">
// {usersArray}
// </div>
// </div>

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  selectUserToDisplay: PropTypes.func.isRequired,
};
UserList.defaultProps = {
  users: [],
};

export default UserList;
