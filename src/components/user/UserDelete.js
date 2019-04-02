import React from 'react';
import PropTypes from 'prop-types';

const UserDelete = ({
  selectedUser,
  deleteUser,
  setUserViewMode,
  getUserList,
}) => {
  // console.log('selectedUser:', selectedUser);
  if (!selectedUser) return null;
  const { _id: userId, displayName } = selectedUser;
  return (
    <div className="ui segment">
      <h3>Delete User</h3>
      <button
        type="button"
        className="ui red button"
        onClick={() => {
          setTimeout(() => deleteUser(userId, (didSucceed) => {
            if (didSucceed) {
              getUserList(null, () => setUserViewMode('none'));
            }
          }), 2000); // simulate network delay
        }}
      >
        {`Delete ${displayName}?`}
      </button>
      <button
        type="button"
        className="ui button right floated"
        onClick={() => setUserViewMode('view')}
      >
      Cancel
      </button>
      <div className="ui message red">Note: need to clarify what will happen to owner, runners and comment references!</div>
    </div>
  );
};

UserDelete.propTypes = {
  selectedUser: PropTypes.objectOf(PropTypes.any),
  deleteUser: PropTypes.func.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};
UserDelete.defaultProps = {
  selectedUser: null,
};

export default UserDelete;
