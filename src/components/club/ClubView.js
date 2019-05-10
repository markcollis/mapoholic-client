import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
import ClubFilter from './ClubFilter';
import ClubList from './ClubList';
import ClubDetails from './ClubDetails';
import ClubMembers from './ClubMembers';
import ClubEvents from './ClubEvents';
import ClubEdit from './ClubEdit';
import ClubDelete from './ClubDelete';
import UserDetails from '../user/UserDetails';
import UserEvents from '../user/UserEvents';
import {
  setClubSearchFieldAction,
  setClubViewModeAction,
  getClubListAction,
  getClubByIdAction,
  getClubMembersAction,
  getClubEventsAction,
  getUserByIdAction,
  getUserListAction,
  selectClubToDisplayAction,
  selectClubMemberAction,
  selectClubEventAction,
  createClubAction,
  updateClubAction,
  deleteClubAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class ClubView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    setClubSearchField: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
    getClubMembers: PropTypes.func.isRequired,
    getClubEvents: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectClubMember: PropTypes.func.isRequired,
    selectClubEvent: PropTypes.func.isRequired,
    createClub: PropTypes.func.isRequired,
    updateClub: PropTypes.func.isRequired,
    deleteClub: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { club, getClubList, user } = this.props;
    if (!club.list) getClubList();
    console.log('user:', user);
  }

  // show extra details if a club member is selected
  renderClubMember() {
    const { club, user, getUserById } = this.props;
    const { selectedMember } = club;
    const { details: userDetails, errorMessage: userErrorMessage, current } = user;
    if (selectedMember !== '') {
      let isPending = false;
      if (!userDetails[selectedMember] && !userErrorMessage) {
        isPending = true;
        setTimeout(() => getUserById(selectedMember, () => {
          isPending = false;
        }), 2000); // simulate network delay
      }
      const isAdmin = (current && current.role === 'admin');
      const isSelf = (current && current._id === selectedMember);
      const showOptional = (isAdmin || isSelf);
      const userToDisplay = userDetails[selectedMember] || {};

      return (
        <div>
          <UserDetails
            userToDisplay={userToDisplay}
            showOptional={showOptional}
            isPending={isPending}
          />
          <UserEvents userId={selectedMember} />
        </div>
      );
    }
    return null;
  }

  // show extra details if an event is selected
  renderClubEvent() {
    const { club } = this.props;
    const { selectedEvent } = club;
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
      getClubMembers,
      getClubEvents,
      getClubList,
      getUserList,
      selectClubToDisplay,
      selectClubMember,
      selectClubEvent,
      setClubViewMode,
      createClub,
      updateClub,
      deleteClub,
    } = this.props;
    const {
      memberLists,
      eventLists,
      viewMode,
      selectedClubId,
      details,
    } = club;
    const { current, list } = user;
    const selectedClub = details[selectedClubId];
    // console.log('viewMode:', viewMode);
    // console.log('selectedClubId:', selectedClubId);
    // console.log('club.details:', details);
    // console.log('current:', current);
    // console.log('selectedClub:', selectedClub);
    const isAdmin = (current && current.role === 'admin');
    const isOwner = (current && selectedClub
      && current._id.toString() === selectedClub.owner._id.toString());
    const canEdit = (isAdmin || isOwner);
    if (selectedClub && !memberLists[selectedClub._id]) {
      getClubMembers(selectedClub._id);
    }
    if (selectedClub && !eventLists[selectedClub._id]) {
      getClubEvents(selectedClub._id);
    }
    const membersList = (selectedClub && memberLists[selectedClub._id])
      ? memberLists[selectedClub._id]
      : [];
    const eventsList = (selectedClub && eventLists[selectedClub._id])
      ? eventLists[selectedClub._id]
      : [];

    switch (viewMode) {
      case 'none':
        return (
          <div className="ten wide column">
            <div className="ui segment">
              <p>Select a club from the list to show further details here</p>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="ten wide column">
            <ClubDetails
              selectedClub={selectedClub || {}}
              canEdit={canEdit}
              setClubViewMode={setClubViewMode}
            />
            <ClubMembers membersList={membersList} selectClubMember={selectClubMember} />
            {this.renderClubMember()}
            <ClubEvents eventsList={eventsList} selectClubEvent={selectClubEvent} />
            {this.renderClubEvent()}
          </div>
        );
      case 'edit':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              isAdmin={isAdmin}
              selectedClub={selectedClub}
              viewMode={viewMode}
              updateClub={updateClub}
              setClubViewMode={setClubViewMode}
              selectClubToDisplay={selectClubToDisplay}
              getClubList={getClubList}
              userList={(list) ? list.slice(0, -1) : []}
              getUserList={getUserList}
            />
            <ClubMembers membersList={membersList} selectClubMember={selectClubMember} />
            {this.renderClubMember()}
            <ClubEvents eventsList={eventsList} selectClubEvent={selectClubEvent} />
            {this.renderClubEvent()}
          </div>
        );
      case 'add':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              viewMode={viewMode}
              createClub={createClub}
              setClubViewMode={setClubViewMode}
              getClubList={getClubList}
            />
          </div>
        );
      case 'delete':
        return (
          <div className="ten wide column">
            <ClubDelete
              selectedClub={selectedClub}
              deleteClub={deleteClub}
              setClubViewMode={setClubViewMode}
              getClubList={getClubList}
            />
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      club,
      user,
      getClubList,
      setClubSearchField,
      setClubViewMode,
      selectClubToDisplay,
    } = this.props;
    const {
      list,
      searchField,
      errorMessage,
    } = club;
    const { errorMessage: userErrorMessage } = user;

    // need to consider reducing the number shown if there are many many clubs...
    const clubListArray = (list)
      ? list.slice(0, -1).filter((eachClub) => {
        return (eachClub.shortName.toLowerCase().includes(searchField.toLowerCase())
          || eachClub.fullName.toLowerCase().includes(searchField.toLowerCase()));
      })
      : [];
    // const selectedClub = clubListArray.filter(eachClub => eachClub._id === selectedClubId)[0];

    if (errorMessage || userErrorMessage) {
      console.log('Error:', errorMessage, userErrorMessage);
    }
    const renderError = (errorMessage || userErrorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage) ? <div className="ui error message">{`Error: ${errorMessage}`}</div> : null}
          {(userErrorMessage) ? <div className="ui error message">{`Error (get user): ${userErrorMessage}`}</div> : null}
        </div>
      )
      : null;
    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="six wide column">
          <ClubFilter
            searchField={searchField}
            setClubSearchField={setClubSearchField}
            getClubList={getClubList}
            setClubViewMode={setClubViewMode}
            selectClubToDisplay={selectClubToDisplay}
          />
          <div style={{ maxHeight: '50em', overflowY: 'auto' }}>
            <ClubList
              clubs={clubListArray}
              selectClubToDisplay={selectClubToDisplay}
              setClubViewMode={setClubViewMode}
            />
          </div>
        </div>
        {this.renderRightColumn()}
      </div>
    );
  }
}

const mapStateToProps = ({ club, user }) => {
  return { club, user };
};
const mapDispatchToProps = {
  setClubSearchField: event => setClubSearchFieldAction(event.target.value),
  setClubViewMode: setClubViewModeAction,
  getClubList: getClubListAction,
  getClubById: getClubByIdAction,
  getClubMembers: getClubMembersAction,
  getClubEvents: getClubEventsAction,
  getUserById: getUserByIdAction,
  getUserList: getUserListAction,
  selectClubToDisplay: selectClubToDisplayAction,
  selectClubMember: selectClubMemberAction,
  selectClubEvent: selectClubEventAction,
  createClub: createClubAction,
  updateClub: updateClubAction,
  deleteClub: deleteClubAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubView);
