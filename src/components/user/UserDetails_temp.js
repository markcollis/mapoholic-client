import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserByIdAction } from '../../actions';
import forest from '../../silhouette.jpg';
import noAvatar from '../../no-avatar.png';

const UserDetails = ({
  // showUserId,
  user,
  getUserById,
}) => {
  // console.log('showUserId:', showUserId);
  console.log('user:', user);
  if (user.toDisplay === '') {
    return (
      <div className="ui segment">
        <p>Select a user from the list to show their full profile here</p>
      </div>
    );
  }
  if (user.toDisplay && !user.details[user.toDisplay] && !user.errorMessage) {
    console.log('getting user details for:', user.toDisplay);
    getUserById(user.toDisplay);
  }
  const isAdmin = (user.current && user.current.role === 'admin');
  const isSelf = (user.current && user.current._id === user.toDisplay);
  console.log('isAdmin:', isAdmin, 'isSelf:', isSelf);
  const selectedUser = (user.details[user.toDisplay]) || null;
  const optionalItems = ((isAdmin || isSelf) && selectedUser)
    ? (
      <div>
        <div className="item">{`User type: ${selectedUser.role}`}</div>
        <div className="item">{`Profile visibility: ${selectedUser.visibility}`}</div>
      </div>
    )
    : null;
  const displayProfile = (selectedUser)
    ? (
      <div>
        <div>
          <div />
          <img className="profile-forest" alt="forest" src={forest} />
          <div>
            <img className="profile-image" alt="avatar" src={selectedUser.profileImage || noAvatar} />
            <h3>{selectedUser.displayName}</h3>
            {(selectedUser.fullName !== selectedUser.displayName)
              ? <div>{selectedUser.fullName}</div>
              : null}
            {(selectedUser.memberOf.length > 0)
              ? (
                <div>{`(${selectedUser.memberOf.map(club => club.shortName).join(', ')})`}</div>
              )
              : null
            }
          </div>
        </div>
        <br />
        <div>
          <div className="ui list">
            <p className="item">{selectedUser.about}</p>
            {(selectedUser.location)
              ? (
                <div className="item">
                  <i className="marker icon" />
                  {selectedUser.location}
                </div>
              )
              : null
            }
            <div className="item">
              <i className="mail icon" />
              {selectedUser.email}
            </div>
            <div className="item">{`Joined: ${selectedUser.createdAt.slice(0, 10)}`}</div>
            {optionalItems}
          </div>
        </div>
      </div>
    )
    : <div>loading profile...</div>;
  return (
    <div className="ui segment">
      {displayProfile}
      {(user.errorMessage)
        ? <div className="ui error message">{`Error: ${user.errorMessage}`}</div>
        : null
      }
    </div>
  );
};

UserDetails.propTypes = {
  // showUserId: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  getUserById: PropTypes.func.isRequired,
};
// UserDetails.defaultProps = {
//   showUserId: null,
// };

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, { getUserById: getUserByIdAction })(UserDetails);
