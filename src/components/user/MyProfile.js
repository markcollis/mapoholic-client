import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserDetails from './UserDetails';

const MyProfile = ({ user }) => {
  const isPending = !user.current;
  return (
    <div className="ui segment">
      <h3>Current User</h3>
      <UserDetails
        userToDisplay={user.current || {}}
        showOptional
        isPending={isPending}
      />
      {(user.errorMessage)
        ? <div className="ui error message">{`Error: ${user.errorMessage}`}</div>
        : null
      }
    </div>
  );
};

MyProfile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, user };
};

export default connect(mapStateToProps)(MyProfile);
