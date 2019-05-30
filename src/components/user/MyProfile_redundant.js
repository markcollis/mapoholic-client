// can probably be rewritten as a subset of UserView

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

// import Collapse from '../Collapse';
import UserDelete from './UserDelete';
import UserDetails from './UserDetails';
import UserEdit from './UserEdit';
import UserEvents from './UserEvents';

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
  setUserViewModeSelfAction,
  updateUserAction,
} from '../../actions';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const MyProfile = ({
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
  setUserViewModeSelf,
  updateUser,
}) => {
  const {
    current,
    errorMessage,
    eventLists,
    list,
    viewModeSelf,
  } = user;
  const { language } = config;
  const { list: clubListRaw } = club;
  const clubList = (clubListRaw) ? clubListRaw.slice(0, -1) : [];
  const isAdmin = (current && current.role === 'admin');
  if (current && !eventLists[current._id] && !errorMessage) {
    getUserEvents(current._id);
  }
  const eventsList = (current && eventLists[current._id])
    ? eventLists[current._id]
    : [];
  const rightColumn = (
    <div className="seven wide column">
      {(eventsList.length === 0)
        ? (
          <div className="ui warning message">
            <Trans>You have not added any events yet.</Trans>
          </div>
        )
        : (
          <UserEvents
            eventsList={eventsList}
            language={language}
            selectedUser={current || {}}
            selectEventToDisplay={selectEventToDisplay}
            selectRunnerToDisplay={selectRunnerToDisplay}
          />
        )
      }
      {(errorMessage)
        ? <div className="ui error message"><Trans>{`Error: ${errorMessage}`}</Trans></div>
        : null
      }
    </div>
  );

  switch (viewModeSelf) {
    case 'view':
      return (
        <div className="ui vertically padded stackable grid">
          <div className="nine wide column">
            <UserDetails
              selectedUser={current || {}}
              setUserViewMode={setUserViewModeSelf}
              showOptional
            />
          </div>
          {rightColumn}
        </div>
      );
    case 'edit':
      return (
        <div className="ui vertically padded stackable grid">
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
              selectedUser={current}
              setUserViewMode={setUserViewModeSelf}
              updateUser={updateUser}
              userList={(list) ? list.slice(0, -1) : []}
            />
          </div>
          {rightColumn}
        </div>
      );
    case 'delete':
      return (
        <div className="ui vertically padded stackable grid">
          <div className="nine wide column">
            <UserDelete
              deleteUser={deleteUser}
              getUserList={getUserList}
              selectedUser={current}
              setUserViewMode={setUserViewModeSelf}
            />
          </div>
          {rightColumn}
        </div>
      );
    default:
      return null;
  }
};

MyProfile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  club: PropTypes.objectOf(PropTypes.any).isRequired,
  config: PropTypes.objectOf(PropTypes.any).isRequired,
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
  setUserViewModeSelf: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

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
  setUserViewModeSelf: setUserViewModeSelfAction,
  updateUser: updateUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
