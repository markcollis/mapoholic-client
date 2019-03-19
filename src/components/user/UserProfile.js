import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserByIdAction } from '../../actions';
import forest from '../../silhouette.jpg';

const UserProfile = ({
  auth,
  user,
  match,
  getUserById,
}) => {
  if (match.params.userid && !user.details[match.params.userid]) {
    getUserById(match.params.userid);
  }
  console.log('user:', user);
  console.log('match:', match);
  // console.log('auth:', auth, !!auth);
  const selectedUser = (match.params.userid)
    ? user.details[match.params.userid]
    : user.current;
  const authMessage = (auth) // remove after testing
    ? (
      <div className="ui message success">
        You are logged in
      </div>
    )
    : (
      <div className="ui message warning">
        You are not logged in
      </div>
    );
  const displayProfile = (selectedUser)
    ? (
      <div className="ui items">
        <img className="profile-forest" alt="forest" src={forest} />
        <div>
          {(selectedUser.profileImage !== '')
            ? <img className="profile-image" alt="avatar" src={selectedUser.profileImage} />
            : null}
          <h3>{selectedUser.displayName}</h3>
          {(selectedUser.fullName !== selectedUser.displayName)
            ? <div>{selectedUser.fullName}</div>
            : null}
          <div>{`(${selectedUser.memberOf.map(club => club.shortName).join(', ')})`}</div>
        </div>
        <div className="item">
          <p>{selectedUser.about}</p>
          <p>{`Location: ${selectedUser.location}`}</p>
          <p>{`Email: ${selectedUser.email}`}</p>
          <p>{`Joined: ${selectedUser.createdAt}`}</p>
          <p>{`User type: ${selectedUser.role}`}</p>
          <p>{`Profile visibility: ${selectedUser.visibility}`}</p>
        </div>
      </div>
    )
    : <div>loading profile...</div>;
  return (
    <div>
      <div className="ui segment">
        {displayProfile}
        {authMessage}
        {(user.errorMessage)
          ? <div className="ui error message">{`Error: ${user.errorMessage} Please try again.`}</div>
          : null
        }
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  auth: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  getUserById: PropTypes.func.isRequired,
};
UserProfile.defaultProps = {
  auth: '',
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, user };
};

export default connect(mapStateToProps, { getUserById: getUserByIdAction })(UserProfile);
