import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';
import { Redirect } from 'react-router-dom';

import ErrorBoundary from '../generic/ErrorBoundary';
import ClubDelete from './ClubDelete';
import ClubDetails from './ClubDetails';
import ClubEdit from './ClubEdit';
import ClubEvents from './ClubEvents';
import ClubHeader from './ClubHeader';
import ClubList from './ClubList';
import ClubMembers from './ClubMembers';
import {
  cancelClubErrorAction,
  createClubAction,
  deleteClubAction,
  getClubListAction,
  selectClubToDisplayAction,
  selectEventIdEventsAction,
  selectUserToDisplayAction,
  setClubSearchFieldAction,
  setClubViewModeAction,
  setEventViewModeEventEventsAction,
  setUserViewModeAction,
  updateClubAction,
} from '../../actions';
import { simplifyString } from '../../common/conversions';

// The ClubView component is the parent for all components associated with
// viewing and editing club details.
class ClubView extends Component {
  static propTypes = {
    auth: PropTypes.objectOf(PropTypes.any).isRequired,
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    cancelClubError: PropTypes.func.isRequired,
    createClub: PropTypes.func.isRequired,
    deleteClub: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
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
    refreshCollapseClubDetails: 0,
  };

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize((current) => Boolean(current && current.role === 'admin'));

  // helper to determine if current user can edit club details if input props have changed
  getCanEditClub = memoize((current, selectedClub) => {
    if (!current || !current.role || !selectedClub || !selectedClub.owner) return false;
    const { _id: currentUserId, role } = current;
    const { _id: clubOwnerUserId } = selectedClub.owner;
    const isAdmin = (role === 'admin');
    if (isAdmin) return true;
    const isOwner = (currentUserId === clubOwnerUserId);
    const canEdit = (isAdmin || isOwner);
    return canEdit;
  });

  // helper to return filtered list of clubs based on search criteria
  getClubList = memoize((list, searchField) => {
    if (!list) return [];
    const simpleSearchField = simplifyString(searchField);
    return list.filter((eachClub) => {
      const {
        fullName,
        shortName,
        country,
      } = eachClub;
      const matchesFullName = Boolean(fullName
        && simplifyString(fullName).includes(simpleSearchField));
      const matchesShortName = Boolean(shortName
        && simplifyString(shortName).includes(simpleSearchField));
      const matchesCountry = Boolean(country
        && country.includes(simpleSearchField.toUpperCase()));
      return (matchesFullName || matchesShortName || matchesCountry);
    });
  });

  // helper to return selected club details when selected club or details change
  getSelectedClub = memoize((details, selectedClubId) => details[selectedClubId] || null);

  // helper to return list of members of this club when selected club or user list change
  getClubMembersList = memoize((selectedClubId, userList) => {
    if (!userList) return [];
    const clubMembers = userList.filter((eachUser) => {
      const { memberOf } = eachUser;
      const isMember = memberOf.some((club) => {
        const { _id: clubId } = club;
        return clubId === selectedClubId;
      });
      return isMember;
    });
    return clubMembers;
  });

  // helper to return list of events organised by this club when selected club or event list change
  getClubEventsList = memoize((selectedClubId, eventList) => {
    if (!eventList) return [];
    const clubEvents = eventList.filter((eachEvent) => {
      const { organisedBy } = eachEvent;
      const isOrganisedBy = organisedBy.some((club) => {
        const { _id: clubId } = club;
        return clubId === selectedClubId;
      });
      return isOrganisedBy;
    });
    return clubEvents;
  });

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
      viewMode,
      selectedClubId,
      details,
    } = club;
    const { language } = config;
    const { list: eventList } = oevent;
    const { current, list: userList } = user;

    const selectedClub = this.getSelectedClub(details, selectedClubId);
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEditClub(current, selectedClub);
    const membersList = this.getClubMembersList(selectedClubId, userList);
    const eventsList = this.getClubEventsList(selectedClubId, eventList);

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
              eventList={eventList} // prop (oevent)
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
              eventList={eventList} // prop (oevent)
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
    const { cancelClubError, club } = this.props;
    const { errorMessage } = club;
    if (!errorMessage) return null;
    return (
      <div className="sixteen wide column">
        {(errorMessage)
          ? (
            <div className="ui error message">
              <i
                role="button"
                className="close icon"
                aria-label="close"
                onClick={() => cancelClubError()}
                onKeyPress={() => cancelClubError()}
                tabIndex={0}
              />
              <Trans>{`Error: ${errorMessage}`}</Trans>
            </div>
          ) : null}
      </div>
    );
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
    const { auth: { authenticated } } = this.props;
    if (!authenticated) return <Redirect to="/login" />;

    return (
      <ErrorBoundary>
        <div className="ui vertically padded stackable grid">
          {this.renderError()}
          <div className="sixteen wide column section-header">
            <ErrorBoundary>
              {this.renderClubHeader()}
            </ErrorBoundary>
          </div>
          <div className="six wide column">
            <ErrorBoundary>
              {this.renderClubList()}
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            {this.renderClubDetails()}
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({
  auth,
  club,
  config,
  oevent,
  user,
}) => {
  return {
    auth,
    club,
    config,
    oevent,
    user,
  };
};
const mapDispatchToProps = {
  cancelClubError: cancelClubErrorAction,
  createClub: createClubAction,
  deleteClub: deleteClubAction,
  getClubList: getClubListAction,
  selectClubToDisplay: selectClubToDisplayAction,
  selectEventId: selectEventIdEventsAction, // forwards to Events view
  selectUserToDisplay: selectUserToDisplayAction,
  setClubSearchField: (event) => setClubSearchFieldAction(event.target.value),
  setClubViewMode: setClubViewModeAction,
  setEventViewModeEvent: setEventViewModeEventEventsAction, // forwards to Events view
  setUserViewMode: setUserViewModeAction,
  updateClub: updateClubAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubView);
