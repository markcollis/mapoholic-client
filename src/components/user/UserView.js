import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserDetails from './UserDetails';
import UserRecent from './UserRecent';
import {
  getUserByIdAction,
  setUserSearchFieldAction,
  getUserListAction,
  selectUserToDisplayAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class UserView extends Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    getUserById: PropTypes.func.isRequired,
    setUserSearchField: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // console.log('UserView mounted.');
    const { user, getUserList, setUserSearchField } = this.props;
    if (!user.list) getUserList();
    if (user.searchField !== '') setUserSearchField({ target: { value: '' } });
  }

  render() {
    const {
      user,
      getUserById,
      getUserList,
      setUserSearchField,
      selectUserToDisplay,
    } = this.props;
    const {
      current,
      details,
      toDisplay,
      list,
      searchField,
      errorMessage,
    } = user;

    const userListArray = (list)
      ? list.slice(0, -1).filter((eachUser) => {
        return eachUser.displayName.toLowerCase().includes(searchField.toLowerCase());
      })
      : [];
    // console.log('searchField', searchField);
    let isPending = false;
    if (toDisplay && !details[toDisplay] && !errorMessage) {
      // console.log('getting user details for:', toDisplay);
      isPending = true;
      setTimeout(() => getUserById(toDisplay, () => {
        isPending = false;
      }), 2000); // simulate network delay
      // getUserById(toDisplay);
    }
    const isAdmin = (current && current.role === 'admin');
    const isSelf = (current && current._id === toDisplay);
    // console.log('isAdmin:', isAdmin, 'isSelf:', isSelf);
    const showOptional = (isAdmin || isSelf);
    const renderError = (user.errorMessage)
      ? (
        <div className="sixteen wide column">
          <div className="ui error message">{`Error: ${user.errorMessage}`}</div>
        </div>
      )
      : null;
    const userToDisplay = details[toDisplay] || {};
    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="seven wide column">
          <UserFilter
            searchField={searchField}
            setUserSearchField={setUserSearchField}
            getUserList={getUserList}
          />
          <UserList users={userListArray} selectUserToDisplay={selectUserToDisplay} />
        </div>
        <div className="nine wide column">
          <UserDetails
            userToDisplay={userToDisplay}
            showOptional={showOptional}
            isPending={isPending}
          />
          <UserRecent />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return { user };
};
const mapDispatchToProps = {
  getUserById: getUserByIdAction,
  // getUserById: (toDisplay, callback) => dispatch(getUserByIdAction(toDisplay, callback)),
  setUserSearchField: event => setUserSearchFieldAction(event.target.value),
  getUserList: getUserListAction,
  selectUserToDisplay: selectUserToDisplayAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
