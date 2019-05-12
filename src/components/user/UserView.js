import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import UserDelete from './UserDelete';
import UserDetails from './UserDetails';
import UserEdit from './UserEdit';
import UserEvents from './UserEvents';
import UserFilter from './UserFilter';
import UserList from './UserList';
import {
  changePasswordAction,
  deleteProfileImageAction,
  deleteUserAction,
  getClubListAction,
  getUserByIdAction,
  getUserEventsAction,
  getUserListAction,
  postProfileImageAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  selectUserToDisplayAction,
  setUserSearchFieldAction,
  setUserViewModeAction,
  updateUserAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class UserView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    changePassword: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    getUserEvents: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    postProfileImage: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setUserSearchField: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // console.log('UserView mounted.');
    const { user, getUserList } = this.props;
    if (!user.list) getUserList();
  }

  renderRightColumn() {
    const {
      club,
      config,
      user,
      changePassword,
      deleteProfileImage,
      deleteUser,
      getClubList,
      getUserById,
      getUserEvents,
      getUserList,
      postProfileImage,
      selectEventToDisplay,
      selectRunnerToDisplay,
      selectUserToDisplay,
      setUserViewMode,
      updateUser,
    } = this.props;
    const {
      current,
      details,
      errorMessage,
      eventLists,
      list,
      selectedUserId,
      viewMode,
    } = user;
    const { list: clubListRaw } = club;
    const clubList = (clubListRaw) ? clubListRaw.slice(0, -1) : [];
    const { language } = config;

    if (selectedUserId && !details[selectedUserId] && !errorMessage) {
      getUserById(selectedUserId);
    }
    const isAdmin = (current && current.role === 'admin');
    const isSelf = (current && current._id === selectedUserId);
    const showOptional = (isAdmin || isSelf);
    const selectedUser = details[selectedUserId];
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
              <p><Trans>Select a user from the list to show further details here</Trans></p>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="nine wide column">
            <UserDetails
              selectedUser={selectedUser || {}}
              setUserViewMode={setUserViewMode}
              showOptional={showOptional}
            />
            <UserEvents
              eventsList={eventsList}
              language={language}
              selectedUser={selectedUser || {}}
              selectEventToDisplay={selectEventToDisplay}
              selectRunnerToDisplay={selectRunnerToDisplay}
            />
          </div>
        );
      case 'edit':
        return (
          <div className="nine wide column">
            <UserEdit
              changePassword={changePassword}
              clubList={clubList}
              deleteProfileImage={deleteProfileImage}
              getClubList={getClubList}
              getUserById={getUserById}
              getUserList={getUserList}
              isAdmin={isAdmin}
              postProfileImage={postProfileImage}
              selectedUser={selectedUser}
              selectUserToDisplay={selectUserToDisplay}
              setUserViewMode={setUserViewMode}
              updateUser={updateUser}
              userList={(list) ? list.slice(0, -1) : []}
            />
            <UserEvents
              eventsList={eventsList}
              language={language}
              selectedUser={selectedUser || {}}
              selectEventToDisplay={selectEventToDisplay}
              selectRunnerToDisplay={selectRunnerToDisplay}
            />
          </div>
        );
      case 'delete':
        return (
          <div className="nine wide column">
            <UserDelete
              deleteUser={deleteUser}
              getUserList={getUserList}
              selectedUser={selectedUser}
              setUserViewMode={setUserViewMode}
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
      selectUserToDisplay,
      setUserSearchField,
      setUserViewMode,
    } = this.props;
    const {
      errorMessage,
      list,
      searchField,
    } = user;
    // need to consider reducing the number shown if there are many many users...
    const userListArray = (list)
      ? list.slice(0, -1).filter((eachUser) => {
        return (eachUser.displayName.toLowerCase().includes(searchField.toLowerCase())
          || eachUser.fullName.toLowerCase().includes(searchField.toLowerCase()));
      })
      : [];
    const renderError = (errorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage)
            ? <div className="ui error message"><Trans>{`Error: ${errorMessage}`}</Trans></div>
            : null}
        </div>
      )
      : null;

    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="seven wide column">
          <UserFilter
            getUserList={getUserList}
            searchField={searchField}
            setUserSearchField={setUserSearchField}
          />
          <div style={{ maxHeight: '50em', overflowY: 'auto' }}>
            <UserList
              selectUserToDisplay={selectUserToDisplay}
              setUserViewMode={setUserViewMode}
              users={userListArray}
            />
          </div>
        </div>
        {this.renderRightColumn()}
      </div>
    );
  }
}

const mapStateToProps = ({ user, club, config }) => {
  return { user, club, config };
};
const mapDispatchToProps = {
  changePassword: changePasswordAction,
  deleteProfileImage: deleteProfileImageAction,
  deleteUser: deleteUserAction,
  getClubList: getClubListAction,
  getUserById: getUserByIdAction,
  getUserEvents: getUserEventsAction,
  getUserList: getUserListAction,
  postProfileImage: postProfileImageAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setUserSearchField: event => setUserSearchFieldAction(event.target.value),
  setUserViewMode: setUserViewModeAction,
  updateUser: updateUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
