import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserDetails from './UserDetails';
import UserRecent from './UserRecent';
import { getUserByIdAction } from '../../actions';
/* eslint no-underscore-dangle: 0 */


class UserView extends Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    getUserById: PropTypes.func.isRequired,
  }

  componentDidMount() {
    console.log('UserView mounted.');
  }

  render() {
    const { user, getUserById } = this.props;
    const {
      toDisplay,
      details,
      errorMessage,
      current,
    } = user;
    if (toDisplay && !details[toDisplay] && !errorMessage) {
      console.log('getting user details for:', toDisplay);
      getUserById(toDisplay);
    }
    const isAdmin = (current && current.role === 'admin');
    const isSelf = (current && current._id === toDisplay);
    console.log('isAdmin:', isAdmin, 'isSelf:', isSelf);
    const showOptional = (isAdmin || isSelf);

    const userToDisplay = details[toDisplay] || {};
    return (
      <div className="ui grid">
        {(user.errorMessage)
          ? <div className="ui error message">{`Error: ${user.errorMessage}`}</div>
          : null
        }
        <div className="seven wide column">
          <div />
          <UserFilter />
          <UserList />
        </div>
        <div className="nine wide column">
          <div />
          <UserDetails userToDisplay={userToDisplay} showOptional={showOptional} />
          <UserRecent />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, { getUserById: getUserByIdAction })(UserView);
