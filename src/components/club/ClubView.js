import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import ClubFilter from './ClubFilter';
import ClubList from './ClubList';
import ClubDetails from './ClubDetails';
import ClubMembers from './ClubMembers';
import ClubEvents from './ClubEvents';
import ClubEdit from './ClubEdit';
import ClubDelete from './ClubDelete';
import {
  createClubAction,
  deleteClubAction,
  getClubByIdAction,
  getClubEventsAction,
  getClubListAction,
  getClubMembersAction,
  getEventListAction,
  getUserByIdAction,
  getUserListAction,
  selectClubToDisplayAction,
  selectEventForDetailsAction,
  selectUserToDisplayAction,
  setClubSearchFieldAction,
  setClubViewModeAction,
  setEventViewModeEventAction,
  setUserViewModeAction,
  updateClubAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class ClubView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    createClub: PropTypes.func.isRequired,
    deleteClub: PropTypes.func.isRequired,
    getClubEvents: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
    getClubMembers: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setClubSearchField: PropTypes.func.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    updateClub: PropTypes.func.isRequired,
  }

  state = {
    gettingEventList: '',
    gettingMemberList: '',
  };

  // get summary data from API if not available
  componentDidMount() {
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

  componentDidUpdate() {
    // console.log('state', this.state);
    const { gettingEventList, gettingMemberList } = this.state;
    const { club, getClubEvents, getClubMembers } = this.props;
    const {
      details,
      eventLists,
      memberLists,
      selectedClubId,
    } = club;
    /* eslint react/no-did-update-set-state: 0 */
    if (details[selectedClubId]) {
      if (!eventLists[selectedClubId] && gettingEventList !== selectedClubId) {
        console.log('getting event list for', selectedClubId);
        getClubEvents(selectedClubId, (successful) => {
          if (successful) this.setState({ gettingEventList: '' });
        });
        this.setState({ gettingEventList: selectedClubId });
      }
      if (!memberLists[selectedClubId] && gettingMemberList !== selectedClubId) {
        console.log('getting member list for', selectedClubId);
        getClubMembers(selectedClubId, (successful) => {
          if (successful) this.setState({ gettingMemberList: '' });
        });
        this.setState({ gettingMemberList: selectedClubId });
      }
    }
  }

  // helper to return current user's id if input prop has changed
  // getCurrentUserId = memoize(current => ((current) ? current._id : null));

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to determine if current user can edit club details if input props have changed
  getCanEditClub = memoize((current, selectedClub) => {
    console.log('current, selectedClub in getCanEditClub:', current, selectedClub);
    if (!current || !current.role || !selectedClub || !selectedClub.owner) return false;
    const isAdmin = (current.role === 'admin');
    if (isAdmin) return true;
    const isOwner = (current._id.toString() === selectedClub.owner._id.toString());
    const canEdit = (isAdmin || isOwner);
    return canEdit;
  });

  // helper to return filtered list of clubs based on search criteria
  getClubList = memoize((list, searchField) => {
    if (!list) return [];
    return list.slice(0, -1).filter((eachClub) => {
      return (eachClub.shortName.toLowerCase().includes(searchField.toLowerCase())
      || eachClub.fullName.toLowerCase().includes(searchField.toLowerCase()));
    });
  });

  // helper to return selected club details when selected club or details change
  getSelectedClub = memoize((details, selectedClubId) => details[selectedClubId] || {});

  // render ClubDetails, Edit, Delete, Members, Events components as required by viewMode
  renderClubDetails = () => {
    const {
      club,
      config,
      oevent,
      user,
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
    const { current, list: userList } = user;

    const selectedClub = this.getSelectedClub(details, selectedClubId);
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEditClub(current, selectedClub);
    const membersList = (selectedClub && memberLists[selectedClubId])
      ? memberLists[selectedClubId]
      : [];
    const eventsList = (selectedClub && eventLists[selectedClubId])
      ? eventLists[selectedClubId]
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
              canEdit={canEdit} // derived
              selectedClub={selectedClub} // derived
              setClubViewMode={setClubViewMode} // prop
            />
            <ClubMembers
              fullEventList={(fullEventList) ? fullEventList.slice(0, -1) : []} // prop (oevent)
              membersList={membersList} // derived
              selectUserToDisplay={selectUserToDisplay} // prop
              setUserViewMode={setUserViewMode} // prop
            />
            <ClubEvents
              eventsList={eventsList} // derived
              language={language} // prop (config)
              selectEventForDetails={selectEventForDetails} // prop
              setEventViewModeEvent={setEventViewModeEvent} // prop
            />
          </div>
        );
      case 'edit':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              getClubList={getClubList} // prop
              getUserList={getUserList} // prop
              isAdmin={isAdmin} // derived
              language={language} // prop (config)
              selectClubToDisplay={selectClubToDisplay} // prop
              selectedClub={selectedClub} // derived
              setClubViewMode={setClubViewMode} // prop
              updateClub={updateClub} // prop
              userList={(userList) ? userList.slice(0, -1) : []} // prop (user)
              viewMode={viewMode} // prop (club)
            />
            <ClubMembers
              fullEventList={(fullEventList) ? fullEventList.slice(0, -1) : []} // prop (oevent)
              membersList={membersList} // derived
              selectUserToDisplay={selectUserToDisplay} // prop
              setUserViewMode={setUserViewMode} // prop
            />
            <ClubEvents
              eventsList={eventsList} // derived
              language={language} // prop (config)
              selectEventForDetails={selectEventForDetails} // prop
              setEventViewModeEvent={setEventViewModeEvent} // prop
            />
          </div>
        );
      case 'add':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              createClub={createClub} // prop
              getClubList={getClubList} // prop
              language={language} // prop (config)
              setClubViewMode={setClubViewMode} // prop
              viewMode={viewMode} // prop (club)
            />
          </div>
        );
      case 'delete':
        return (
          <div className="ten wide column">
            <ClubDelete
              deleteClub={deleteClub} // prop
              getClubList={getClubList} // prop
              selectedClub={selectedClub} // derived
              setClubViewMode={setClubViewMode} // prop
            />
          </div>
        );
      default:
        return null;
    }
  }

  renderError = () => {
    const { club, user } = this.props;
    const { errorMessage } = club;
    const { errorMessage: userErrorMessage } = user;
    if (errorMessage || userErrorMessage) {
      return (
        <div className="sixteen wide column">
          {(errorMessage)
            ? <div className="ui error message"><Trans>{`Error: ${errorMessage}`}</Trans></div>
            : null}
          {(userErrorMessage)
            ? <div className="ui error message"><Trans>{`Error (get user): ${userErrorMessage}`}</Trans></div>
            : null}
        </div>
      );
    }
    return null;
  }

  renderClubFilter = () => {
    const {
      club,
      getClubList,
      setClubSearchField,
      setClubViewMode,
      selectClubToDisplay,
    } = this.props;
    const { searchField } = club;
    return (
      <ClubFilter
        getClubList={getClubList} // prop
        searchField={searchField} // prop (club)
        selectClubToDisplay={selectClubToDisplay} // prop
        setClubSearchField={setClubSearchField} // prop
        setClubViewMode={setClubViewMode} // prop
      />
    );
  }

  renderClubList = () => {
    const { club, selectClubToDisplay, setClubViewMode } = this.props;
    const { list, searchField } = club;
    const clubList = this.getClubList(list, searchField);
    return (
      <div className="list-limit-height">
        <ClubList
          clubList={clubList}
          selectClubToDisplay={selectClubToDisplay}
          setClubViewMode={setClubViewMode}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="six wide column">
          {this.renderClubFilter()}
          {this.renderClubList()}
        </div>
        {this.renderClubDetails()}
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
