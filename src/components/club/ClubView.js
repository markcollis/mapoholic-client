import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import ClubFilter from './ClubFilter';
import ClubList from './ClubList';
import ClubDetails from './ClubDetails';
import ClubMembers from './ClubMembers';
import ClubEvents from './ClubEvents';
import ClubEdit from './ClubEdit';
import ClubDelete from './ClubDelete';
import {
  setClubSearchFieldAction,
  setClubViewModeAction,
  getClubListAction,
  getClubByIdAction,
  getClubMembersAction,
  getClubEventsAction,
  getUserByIdAction,
  getUserListAction,
  getEventListAction,
  selectClubToDisplayAction,
  selectEventForDetailsAction,
  selectUserToDisplayAction,
  setUserViewModeAction,
  setEventViewModeEventAction,
  createClubAction,
  updateClubAction,
  deleteClubAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class ClubView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    setClubSearchField: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
    getClubMembers: PropTypes.func.isRequired,
    getClubEvents: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    createClub: PropTypes.func.isRequired,
    updateClub: PropTypes.func.isRequired,
    deleteClub: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // console.log('oevent', this.props.oevent);
    const {
      club,
      oevent,
      user,
      getClubList,
      getEventList,
      getUserList,
    } = this.props;
    const { list: clubList } = club;
    const { list: eventList } = oevent;
    const { list: userList } = user;
    if (!clubList) getClubList();
    if (!userList) getUserList();
    if (!eventList) getEventList();
  }

  renderRightColumn() {
    const {
      club,
      config,
      oevent,
      user,
      getClubMembers,
      getClubEvents,
      getClubList,
      getUserList,
      selectClubToDisplay,
      selectEventForDetails,
      selectUserToDisplay,
      setClubViewMode,
      setUserViewMode,
      setEventViewModeEvent,
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
    const { language } = config;
    const { list: fullEventList } = oevent;
    const { current, list } = user;
    const selectedClub = details[selectedClubId];
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
              <p><Trans>Select a club from the list to show further details here</Trans></p>
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
            <ClubMembers
              fullEventList={(fullEventList) ? fullEventList.slice(0, -1) : []}
              membersList={membersList}
              selectUserToDisplay={selectUserToDisplay}
              setUserViewMode={setUserViewMode}
            />
            <ClubEvents
              eventsList={eventsList}
              language={language}
              selectEventForDetails={selectEventForDetails}
              setEventViewModeEvent={setEventViewModeEvent}
            />
          </div>
        );
      case 'edit':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              language={language}
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
            <ClubMembers
              fullEventList={(fullEventList) ? fullEventList.slice(0, -1) : []}
              membersList={membersList}
              selectUserToDisplay={selectUserToDisplay}
              setUserViewMode={setUserViewMode}
            />
            <ClubEvents
              eventsList={eventsList}
              language={language}
              selectEventForDetails={selectEventForDetails}
              setEventViewModeEvent={setEventViewModeEvent}
            />
          </div>
        );
      case 'add':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              language={language}
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

    const renderError = (errorMessage || userErrorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage)
            ? <div className="ui error message"><Trans>{`Error: ${errorMessage}`}</Trans></div>
            : null}
          {(userErrorMessage)
            ? <div className="ui error message"><Trans>{`Error (get user): ${userErrorMessage}`}</Trans></div>
            : null}
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

const mapStateToProps = ({
  club,
  config,
  oevent,
  user,
}) => {
  return {
    club,
    config,
    oevent,
    user,
  };
};
const mapDispatchToProps = {
  setClubSearchField: event => setClubSearchFieldAction(event.target.value),
  setClubViewMode: setClubViewModeAction,
  getClubList: getClubListAction,
  getClubById: getClubByIdAction,
  getClubMembers: getClubMembersAction,
  getClubEvents: getClubEventsAction,
  getEventList: getEventListAction,
  getUserById: getUserByIdAction,
  getUserList: getUserListAction,
  selectClubToDisplay: selectClubToDisplayAction,
  selectEventForDetails: selectEventForDetailsAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setEventViewModeEvent: setEventViewModeEventAction,
  setUserViewMode: setUserViewModeAction,
  createClub: createClubAction,
  updateClub: updateClubAction,
  deleteClub: deleteClubAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubView);
