import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import UserDelete from './UserDelete';
import UserDetails from './UserDetails';
import UserEdit from './UserEdit';
import UserEvents from './UserEvents';
import UserFilter from './UserFilter';
import UserList from './UserList';
import {
  cancelUserErrorAction,
  changePasswordAction,
  deleteProfileImageAction,
  deleteUserAction,
  getClubMembersAction,
  getUserByIdAction,
  getUserEventsAction,
  getUserListAction,
  postProfileImageAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  selectUserToDisplayAction,
  setUserSearchFieldAction,
  setUserViewModeAction,
  setUserViewModeSelfAction,
  updateUserAction,
} from '../../actions';

class UserView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    ownProfile: PropTypes.bool,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    cancelUserError: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    getClubMembers: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    getUserEvents: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    postProfileImage: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setUserSearchField: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    setUserViewModeSelf: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ownProfile: false,
  }

  state = {
    refreshCollapseUserDetails: 0,
  }

  // helper to create filtered user list if relevant props change
  getUserListArray = memoize((list, searchField) => {
    if (!list) return [];
    const filteredList = list.filter((eachUser) => {
      return (eachUser.displayName.toLowerCase().includes(searchField.toLowerCase())
        || eachUser.fullName.toLowerCase().includes(searchField.toLowerCase()));
    });
    // console.log('filteredList in UserView:', filteredList);
    return filteredList;
  });

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to return current user's id for own profile page irrespective of selectedUserId prop
  getUserId = memoize((current, ownProfile, selectedUserId) => {
    if (current && ownProfile) {
      const {
        _id: currentUserId,
      } = current;
      return currentUserId || '';
    }
    return selectedUserId;
  });

  // helper to check if current user is viewing themselves if input props have changed
  getIsSelf = memoize((current, selectedUserId) => {
    if (!current) return false;
    const {
      _id: currentUserId,
    } = current;
    return currentUserId === selectedUserId;
  });

  // helper to get selected user's details if relevant props have changed
  getSelectedUser = memoize((details, selectedUserId, errorMessage) => {
    const {
      getUserById,
    } = this.props;
    if (selectedUserId && !details[selectedUserId] && !errorMessage) {
      getUserById(selectedUserId);
    }
    const selectedUser = details[selectedUserId];
    return selectedUser || {};
  });

  // helper to get list of events attended by selected user if props have changed
  getEventsList = memoize((selectedUserId, eventLists, errorMessage) => {
    const {
      getUserEvents,
    } = this.props;
    const eventsList = eventLists[selectedUserId];
    if (selectedUserId !== '' && !eventsList && !errorMessage) {
      getUserEvents(selectedUserId);
    }
    return eventsList || [];
  });

  // update a prop in UserDetails to trigger refresh of Collapse component to new size
  requestRefreshCollapseUserDetails = () => {
    const { refreshCollapseUserDetails } = this.state;
    this.setState({ refreshCollapseUserDetails: refreshCollapseUserDetails + 1 });
  }

  renderError = () => {
    const {
      cancelUserError,
      user,
    } = this.props;
    const {
      errorMessage,
    } = user;
    if (!errorMessage) return null;

    return (
      <div className="sixteen wide column">
        <div className="ui error message">
          <i
            role="button"
            className="close icon"
            onClick={() => cancelUserError()}
            onKeyPress={() => cancelUserError()}
            tabIndex="0"
          />
          <Trans>{`Error: ${errorMessage}`}</Trans>
        </div>
      </div>
    );
  }

  renderUserFilter = () => {
    const {
      getUserList,
      setUserSearchField,
      user,
    } = this.props;
    const {
      searchField,
    } = user;

    return (
      <UserFilter
        getUserList={getUserList} // prop
        searchField={searchField} // prop (user)
        setUserSearchField={setUserSearchField} // prop
      />
    );
  }

  renderUserList = () => {
    const {
      config,
      selectUserToDisplay,
      setUserViewMode,
      user,
    } = this.props;
    const {
      list,
      searchField,
    } = user;
    const {
      language,
    } = config;
    const userListArray = this.getUserListArray(list, searchField);

    return (
      <div className="list-limit-height">
        <UserList
          language={language} // prop (config)
          selectUserToDisplay={selectUserToDisplay} // prop
          setUserViewMode={setUserViewMode} // prop
          users={userListArray} // derived
        />
      </div>
    );
  }

  renderUserDetails = () => {
    const { refreshCollapseUserDetails } = this.state;
    const {
      ownProfile,
      setUserViewMode,
      setUserViewModeSelf,
      user,
    } = this.props;
    const {
      current,
      details,
      errorMessage,
      selectedUserId,
    } = user;
    const userId = this.getUserId(current, ownProfile, selectedUserId);
    const isAdmin = this.getIsAdmin(current);
    const isSelf = this.getIsSelf(current, userId);
    const showOptional = (isAdmin || isSelf);
    const selectedUser = this.getSelectedUser(details, userId, errorMessage);

    return (
      <UserDetails
        refreshCollapse={refreshCollapseUserDetails} // state (value increments to trigger)
        requestRefreshCollapse={this.requestRefreshCollapseUserDetails} // defined here
        selectedUser={selectedUser} // derived
        setUserViewMode={(ownProfile) ? setUserViewModeSelf : setUserViewMode} // props
        showOptional={showOptional} // derived
      />
    );
  }

  renderUserEdit = () => {
    const {
      changePassword,
      club,
      config,
      deleteProfileImage,
      getClubMembers,
      getUserById,
      getUserList,
      ownProfile,
      postProfileImage,
      selectUserToDisplay,
      setUserViewMode,
      setUserViewModeSelf,
      updateUser,
      user,
    } = this.props;
    const {
      current,
      details,
      errorMessage,
      list,
      selectedUserId,
    } = user;
    const {
      list: clubList,
    } = club;
    const {
      language,
    } = config;
    const userId = this.getUserId(current, ownProfile, selectedUserId);
    const isAdmin = this.getIsAdmin(current);
    const selectedUser = this.getSelectedUser(details, userId, errorMessage);

    return (
      <UserEdit
        changePassword={changePassword} // prop
        clubList={clubList} // prop (club)
        deleteProfileImage={deleteProfileImage} // prop
        getClubMembers={getClubMembers} // prop
        getUserById={getUserById} // prop
        getUserList={getUserList} // prop
        isAdmin={isAdmin} // derived
        language={language} // prop (config)
        postProfileImage={postProfileImage} // prop
        selectedUser={selectedUser} // derived
        selectUserToDisplay={selectUserToDisplay} // prop
        setUserViewMode={(ownProfile) ? setUserViewModeSelf : setUserViewMode} // props
        updateUser={updateUser} // prop
        userList={list} // prop (user)
      />
    );
  }

  renderUserDelete = () => {
    const {
      user,
      deleteUser,
      getUserList,
      ownProfile,
      setUserViewMode,
      setUserViewModeSelf,
    } = this.props;
    const {
      current,
      details,
      errorMessage,
      selectedUserId,
    } = user;
    const userId = this.getUserId(current, ownProfile, selectedUserId);
    const isSelf = this.getIsSelf(current, userId);
    const selectedUser = this.getSelectedUser(details, userId, errorMessage);

    return (
      <UserDelete
        deleteUser={deleteUser} // prop
        getUserList={getUserList} // prop
        isSelf={isSelf} // derived
        selectedUser={selectedUser} // derived
        setUserViewMode={(ownProfile) ? setUserViewModeSelf : setUserViewMode} // props
      />
    );
  }

  renderUserEvents = () => {
    const {
      config,
      ownProfile,
      selectEventToDisplay,
      selectRunnerToDisplay,
      user,
    } = this.props;
    const {
      current,
      details,
      errorMessage,
      eventLists,
      selectedUserId,
    } = user;
    const {
      language,
    } = config;
    const userId = this.getUserId(current, ownProfile, selectedUserId);
    const selectedUser = this.getSelectedUser(details, userId, errorMessage);
    const eventsList = this.getEventsList(userId, eventLists, errorMessage);

    if (ownProfile && eventsList.length === 0) {
      return (
        <div className="ui warning message">
          <Trans>You have not added any events yet.</Trans>
        </div>
      );
    }
    return (
      <div className="list-limit-height">
        <UserEvents
          eventsList={eventsList} // derived
          language={language} // prop (config)
          selectedUser={selectedUser} // derived
          selectEventToDisplay={selectEventToDisplay} // prop
          selectRunnerToDisplay={selectRunnerToDisplay} // prop
        />
      </div>
    );
  }

  render() {
    const {
      ownProfile,
      user,
    } = this.props;
    const {
      viewMode,
      viewModeSelf,
    } = user;

    if (ownProfile) {
      return (
        <div className="ui vertically padded stackable grid">
          {this.renderError()}
          <div className="seven wide column">
            {(viewModeSelf === 'view') ? this.renderUserDetails() : null}
            {(viewModeSelf === 'edit') ? this.renderUserEdit() : null}
            {(viewModeSelf === 'delete') ? this.renderUserDelete() : null}
          </div>
          <div className="nine wide column">
            {this.renderUserEvents()}
          </div>
        </div>
      );
    }
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="seven wide column">
          {this.renderUserFilter()}
          {this.renderUserList()}
        </div>
        <div className="nine wide column">
          {(viewMode === 'none') ? (
            <div className="ui segment">
              <p><Trans>Select a user from the list to show further details here</Trans></p>
            </div>
          ) : null}
          {(viewMode === 'view') ? this.renderUserDetails() : null}
          {(viewMode === 'edit') ? this.renderUserEdit() : null}
          {(viewMode === 'delete') ? this.renderUserDelete() : null}
          {(viewMode === 'view' || viewMode === 'edit') ? this.renderUserEvents() : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  club,
  config,
  user,
}) => {
  return {
    club,
    config,
    user,
  };
};
const mapDispatchToProps = {
  cancelUserError: cancelUserErrorAction,
  changePassword: changePasswordAction,
  deleteProfileImage: deleteProfileImageAction,
  deleteUser: deleteUserAction,
  getClubMembers: getClubMembersAction,
  getUserById: getUserByIdAction,
  getUserEvents: getUserEventsAction,
  getUserList: getUserListAction,
  postProfileImage: postProfileImageAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setUserSearchField: event => setUserSearchFieldAction(event.target.value),
  setUserViewMode: setUserViewModeAction,
  setUserViewModeSelf: setUserViewModeSelfAction,
  updateUser: updateUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
