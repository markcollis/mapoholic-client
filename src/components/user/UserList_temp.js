import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserListAction, selectUserToDisplayAction } from '../../actions';
import noAvatar from '../../no-avatar.png';

const UserList = ({
  auth,
  user,
  getUserList,
  selectUserToDisplay,
}) => {
  // console.log('user:', user);
  // console.log('auth:', auth, ':', !!auth);
  if (!user.list) {
    getUserList();
  }
  const usersToDisplay = (user.list)
    ? (
      <div className="ui divided unstackable items">
        {user.list.slice(0, -1).map((userDetails) => {
          return (
            <div className="item" key={userDetails.user_id} onClick={() => selectUserToDisplay(userDetails.user_id)}>
              <img className="user-list-avatar" alt="avatar" src={userDetails.profileImage || noAvatar} />
              <div className="content">
                <div className="header">
                  <p>{userDetails.displayName}</p>
                </div>
                <div className="description">
                  <p>{userDetails.fullName}</p>
                  {(userDetails.memberOf && userDetails.memberOf.length > 0)
                    ? (
                      <div>
                        {userDetails.memberOf.map((club) => {
                          return <div className="ui label">{club}</div>;
                        })}
                        {(userDetails.role === 'admin') ? <div className="ui label">Adminstrator</div> : null}
                        {(userDetails.role === 'guest') ? <div className="ui label">Guest</div> : null}
                      </div>
                    )
                    : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
    : null;
  return (
    <div className="ui segment">
      <h3>User List</h3>
      {usersToDisplay}
      {(user.errorMessage)
        ? <div className="ui error message">{`Error: ${user.errorMessage}`}</div>
        : null
      }
      {JSON.stringify(user.list, null, 2)}
    </div>
  );
};

UserList.propTypes = {
  auth: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  getUserList: PropTypes.func.isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
};
UserList.defaultProps = {
  auth: '',
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, user };
};

export default connect(mapStateToProps, {
  getUserList: getUserListAction,
  selectUserToDisplay: selectUserToDisplayAction,
})(UserList);
