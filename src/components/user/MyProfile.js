import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Collapse from '../Collapse';
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
  selectUserEventAction,
  setUserViewModeSelfAction,
  updateUserAction,
} from '../../actions';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const MyProfile = ({
  club,
  user,
  changePassword,
  deleteProfileImage,
  deleteUser,
  getClubList,
  getUserById,
  getUserEvents,
  getUserList,
  postProfileImage,
  selectUserEvent,
  setUserViewModeSelf,
  updateUser,
}) => {
  const {
    current,
    errorMessage,
    eventLists,
    list,
    selectedEvent,
    viewModeSelf,
  } = user;
  const { list: clubListRaw } = club;
  const clubList = (clubListRaw) ? clubListRaw.slice(0, -1) : [];
  const isAdmin = (current && current.role === 'admin');
  if (current && !eventLists[current._id]) {
    getUserEvents(current._id);
  }
  const eventsList = (current && eventLists[current._id])
    ? eventLists[current._id]
    : [];

  switch (viewModeSelf) {
    case 'view':
      return (
        <div>
          <UserDetails
            selectedUser={current || {}}
            setUserViewMode={setUserViewModeSelf}
            showOptional
          />
          <UserEvents eventsList={eventsList} selectUserEvent={selectUserEvent} />
          {(selectedEvent !== '')
            ? (
              <div className="ui segment">
                <Collapse title="Event Details">
                  <h3>{selectedEvent}</h3>
                  <p>Update later when event components are defined</p>
                </Collapse>
              </div>
            )
            : null}
          {(errorMessage)
            ? <div className="ui error message">{`Error: ${errorMessage}`}</div>
            : null
          }
        </div>
      );
    case 'edit':
      return (
        <div className="ui segment">
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
      );
    case 'delete':
      return (
        <div className="ui segment">
          <UserDelete
            deleteUser={deleteUser}
            getUserList={getUserList}
            selectedUser={current}
            setUserViewMode={setUserViewModeSelf}
          />
        </div>
      );
    default:
      return null;
  }
};

MyProfile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  club: PropTypes.objectOf(PropTypes.any).isRequired,
  changePassword: PropTypes.func.isRequired,
  deleteProfileImage: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  getUserEvents: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
  postProfileImage: PropTypes.func.isRequired,
  selectUserEvent: PropTypes.func.isRequired,
  setUserViewModeSelf: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, club }) => {
  return { user, club };
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
  selectUserEvent: selectUserEventAction,
  setUserViewModeSelf: setUserViewModeSelfAction,
  updateUser: updateUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
