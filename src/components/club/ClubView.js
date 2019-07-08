import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import ClubDelete from './ClubDelete';
import ClubDetails from './ClubDetails';
import ClubEdit from './ClubEdit';
import ClubEvents from './ClubEvents';
import ClubHeader from './ClubHeader';
import ClubList from './ClubList';
import ClubMembers from './ClubMembers';
import {
  createClubAction,
  deleteClubAction,
  getClubByIdAction,
  getClubEventsAction,
  getClubListAction,
  getClubMembersAction,
  getUserByIdAction,
  selectClubToDisplayAction,
  selectEventIdEventsAction,
  selectUserToDisplayAction,
  setClubSearchFieldAction,
  setClubViewModeAction,
  setEventViewModeEventEventsAction,
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
    selectClubToDisplay: PropTypes.func.isRequired,
    selectEventId: PropTypes.func.isRequired,
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
    isMounted: true,
    refreshCollapseClubDetails: 0,
  };

  componentDidUpdate() {
    // console.log('state', this.state);
    const { gettingEventList, gettingMemberList, isMounted } = this.state;
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
        // console.log('getting event list for', selectedClubId);
        getClubEvents(selectedClubId, (successful) => {
          if (successful && isMounted) this.setState({ gettingEventList: '' });
        });
        this.setState({ gettingEventList: selectedClubId });
      }
      if (!memberLists[selectedClubId] && gettingMemberList !== selectedClubId) {
        // console.log('getting member list for', selectedClubId);
        getClubMembers(selectedClubId, (successful) => {
          if (successful && isMounted) this.setState({ gettingMemberList: '' });
        });
        this.setState({ gettingMemberList: selectedClubId });
      }
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to determine if current user can edit club details if input props have changed
  getCanEditClub = memoize((current, selectedClub) => {
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
    return list.filter((eachClub) => {
      const {
        fullName,
        shortName,
        country,
      } = eachClub;
      const matchFullName = fullName.toLowerCase().includes(searchField.toLowerCase());
      const matchShortName = shortName.toLowerCase().includes(searchField.toLowerCase());
      const matchCountry = country.toLowerCase().includes(searchField.toLowerCase());
      return (matchFullName || matchShortName || matchCountry);
    });
  });

  // helper to return selected club details when selected club or details change
  getSelectedClub = memoize((details, selectedClubId) => details[selectedClubId] || {});

  // update a prop in ClubDetails to trigger refresh of Collapse component to new size
  refreshCollapseClubDetails = () => {
    const { refreshCollapseClubDetails } = this.state;
    this.setState({ refreshCollapseClubDetails: refreshCollapseClubDetails + 1 });
  }

  // render ClubDetails, Edit, Delete, Members, Events components as required by viewMode
  renderClubDetails = () => {
    const { refreshCollapseClubDetails } = this.state;
    const {
      club,
      config,
      oevent,
      user,
      getClubList,
      selectClubToDisplay,
      selectEventId,
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
              language={language} // prop (config)
              refreshCollapse={refreshCollapseClubDetails} // state (value increments to trigger)
              requestRefreshCollapse={this.refreshCollapseClubDetails} // defined here
              selectedClub={selectedClub} // derived
              setClubViewMode={setClubViewMode} // prop
            />
            <ClubEvents
              eventsList={eventsList} // derived
              language={language} // prop (config)
              selectEventId={selectEventId} // prop
              setEventViewModeEvent={setEventViewModeEvent} // prop
            />
            <ClubMembers
              fullEventList={fullEventList} // prop (oevent)
              membersList={membersList} // derived
              selectUserToDisplay={selectUserToDisplay} // prop
              setUserViewMode={setUserViewMode} // prop
            />
          </div>
        );
      case 'edit':
        return (
          <div className="ten wide column">
            <ClubEdit // same form component handles both create and update
              getClubList={getClubList} // prop
              isAdmin={isAdmin} // derived
              language={language} // prop (config)
              selectClubToDisplay={selectClubToDisplay} // prop
              selectedClub={selectedClub} // derived
              setClubViewMode={setClubViewMode} // prop
              updateClub={updateClub} // prop
              userList={userList} // prop (user)
              viewMode={viewMode} // prop (club)
            />
            <ClubEvents
              eventsList={eventsList} // derived
              language={language} // prop (config)
              selectEventId={selectEventId} // prop
              setEventViewModeEvent={setEventViewModeEvent} // prop
            />
            <ClubMembers
              fullEventList={fullEventList} // prop (oevent)
              membersList={membersList} // derived
              selectUserToDisplay={selectUserToDisplay} // prop
              setUserViewMode={setUserViewMode} // prop
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
              selectedClub={selectedClub} // derived
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

  renderClubHeader = () => {
    const {
      club,
      getClubList,
      setClubSearchField,
      setClubViewMode,
    } = this.props;
    const { searchField, viewMode } = club;
    return (
      <ClubHeader
        getClubList={getClubList} // prop
        searchField={searchField} // prop (club)
        setClubSearchField={setClubSearchField} // prop
        setClubViewMode={setClubViewMode} // prop
        viewMode={viewMode} // prop
      />
    );
  }

  renderClubList = () => {
    const { club, selectClubToDisplay, setClubViewMode } = this.props;
    const { list, searchField, selectedClubId } = club;
    const clubList = this.getClubList(list, searchField);
    return (
      <div className="card-list--limit-height">
        <ClubList
          clubList={clubList}
          selectClubToDisplay={selectClubToDisplay}
          selectedClubId={selectedClubId}
          setClubViewMode={setClubViewMode}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="sixteen wide column section-header">
          {this.renderClubHeader()}
        </div>
        <div className="six wide column">
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
  getUserById: getUserByIdAction,
  selectClubToDisplay: selectClubToDisplayAction,
  selectEventId: selectEventIdEventsAction, // forwards to Events view
  selectUserToDisplay: selectUserToDisplayAction,
  setEventViewModeEvent: setEventViewModeEventEventsAction, // forwards to Events view
  setUserViewMode: setUserViewModeAction,
  createClub: createClubAction,
  updateClub: updateClubAction,
  deleteClub: deleteClubAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubView);
