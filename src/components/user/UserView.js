import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
import UserFilter from './UserFilter';
import UserList from './UserList';
import UserDetails from './UserDetails';
import UserEvents from './UserEvents';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import {
  setUserViewModeAction,
  setUserSearchFieldAction,
  selectUserToDisplayAction,
  selectUserEventAction,
  changePasswordAction,
  postProfileImageAction,
  getUserListAction,
  getUserByIdAction,
  getUserEventsAction,
  updateUserAction,
  deleteUserAction,
  deleteProfileImageAction,
  getClubListAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class UserView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    getClubList: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    setUserSearchField: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    selectUserEvent: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    postProfileImage: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    getUserEvents: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // console.log('UserView mounted.');
    const { user, getUserList } = this.props;
    if (!user.list) getUserList();
  }

  // show extra details if an event is selected
  renderUserEvent() {
    const { user } = this.props;
    const { selectedEvent } = user;
    if (selectedEvent !== '') {
      return (
        <div className="ui segment">
          <Collapse title="Event Details">
            <h3>{selectedEvent}</h3>
            <p>Update later when event components are defined</p>
          </Collapse>
        </div>
      );
    }
    return null;
  }

  renderRightColumn() {
    const {
      club,
      user,
      getClubList,
      getUserEvents,
      getUserList,
      getUserById,
      selectUserToDisplay,
      selectUserEvent,
      setUserViewMode,
      updateUser,
      changePassword,
      postProfileImage,
      deleteUser,
      deleteProfileImage,
    } = this.props;
    const {
      list,
      current,
      viewMode,
      details,
      selectedUserId,
      eventLists,
      errorMessage,
    } = user;
    const { list: clubListRaw } = club;
    const clubList = (clubListRaw) ? clubListRaw.slice(0, -1) : [];

    if (selectedUserId && !details[selectedUserId] && !errorMessage) {
      setTimeout(() => getUserById(selectedUserId), 1000); // simulate network delay
    }
    const isAdmin = (current && current.role === 'admin');
    const isSelf = (current && current._id === selectedUserId);
    // console.log('isAdmin:', isAdmin, 'isSelf:', isSelf);
    const showOptional = (isAdmin || isSelf);
    const selectedUser = details[selectedUserId];

    // console.log('viewMode:', viewMode);
    // console.log('current:', current);
    // console.log('selectedUserId:', selectedUserId);
    // console.log('selectedUser:', selectedUser);
    // console.log('eventLists:', eventLists);
    if (selectedUser && !eventLists[selectedUser._id]) {
      getUserEvents(selectedUser._id);
    }
    const eventsList = (selectedUser && eventLists[selectedUser._id])
      ? eventLists[selectedUser._id]
      : [];
    // console.log('eventsList:', eventsList);

    switch (viewMode) {
      case 'none':
        return (
          <div className="nine wide column">
            <div className="ui segment">
              <p>Select a user from the list to show further details here</p>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="nine wide column">
            <UserDetails
              selectedUser={selectedUser || {}}
              showOptional={showOptional}
              setUserViewMode={setUserViewMode}
            />
            <UserEvents eventsList={eventsList} selectUserEvent={selectUserEvent} />
            {this.renderUserEvent()}
          </div>
        );
      case 'edit':
        return (
          <div className="nine wide column">
            <UserEdit
              isAdmin={isAdmin}
              selectedUser={selectedUser}
              updateUser={updateUser}
              setUserViewMode={setUserViewMode}
              selectUserToDisplay={selectUserToDisplay}
              getUserList={getUserList}
              getUserById={getUserById}
              userList={(list) ? list.slice(0, -1) : []}
              changePassword={changePassword}
              postProfileImage={postProfileImage}
              deleteProfileImage={deleteProfileImage}
              clubList={clubList}
              getClubList={getClubList}
            />
            <UserEvents eventsList={eventsList} selectUserEvent={selectUserEvent} />
            {this.renderUserEvent()}
          </div>
        );
      case 'delete':
        return (
          <div className="nine wide column">
            <UserDelete
              selectedUser={selectedUser}
              deleteUser={deleteUser}
              setUserViewMode={setUserViewMode}
              getUserList={getUserList}
            />
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      user,
      getUserList,
      setUserSearchField,
      setUserViewMode,
      selectUserToDisplay,
    } = this.props;
    const {
      list,
      searchField,
      errorMessage,
    } = user;
    // console.log('list of users:', list);
    // need to consider reducing the number shown if there are many many users...
    const userListArray = (list)
      ? list.slice(0, -1).filter((eachUser) => {
        return (eachUser.displayName.toLowerCase().includes(searchField.toLowerCase())
          || eachUser.fullName.toLowerCase().includes(searchField.toLowerCase()));
      })
      : [];

    if (errorMessage) {
      console.log('Error:', errorMessage);
    }
    const renderError = (errorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage) ? <div className="ui error message">{`Error: ${errorMessage}`}</div> : null}
        </div>
      )
      : null;

    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="seven wide column">
          <UserFilter
            searchField={searchField}
            setUserSearchField={setUserSearchField}
            getUserList={getUserList}
          />
          <div style={{ maxHeight: '50em', overflowY: 'auto' }}>
            <UserList
              users={userListArray}
              selectUserToDisplay={selectUserToDisplay}
              setUserViewMode={setUserViewMode}
            />
          </div>
        </div>
        {this.renderRightColumn()}
      </div>
    );
  }
}

const mapStateToProps = ({ user, club }) => {
  return { user, club };
};
const mapDispatchToProps = {
  setUserSearchField: event => setUserSearchFieldAction(event.target.value),
  setUserViewMode: setUserViewModeAction,
  selectUserToDisplay: selectUserToDisplayAction,
  selectUserEvent: selectUserEventAction,
  changePassword: changePasswordAction,
  postProfileImage: postProfileImageAction,
  getUserList: getUserListAction,
  getUserById: getUserByIdAction,
  getUserEvents: getUserEventsAction,
  updateUser: updateUserAction,
  deleteUser: deleteUserAction,
  deleteProfileImage: deleteProfileImageAction,
  getClubList: getClubListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
