import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import EventDelete from './EventDelete';
import EventDetails from './EventDetails';
import EventEdit from './EventEdit';
import EventFilter from './EventFilter';
import EventLinked from './EventLinked';
import EventLinkedManage from './EventLinkedManage';
import EventList from './EventList';
import EventMap from './EventMap';
import EventRunners from './EventRunners';
// support dev without repeatedly calling ORIS API
// import { testOrisList } from '../../common/data';
import { reformatDate } from '../../common/conversions';
import {
  addEventRunnerAction,
  addEventRunnerOrisAction,
  cancelEventErrorAction,
  createEventAction,
  createEventLinkAction,
  createEventOrisAction,
  deleteEventAction,
  deleteEventLinkAction,
  getClubListAction,
  getEventByIdAction,
  getEventLinkListAction,
  getEventListAction,
  getEventListOrisAction,
  getUserByIdAction,
  getUserListAction,
  selectEventForDetailsAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  setEventSearchFieldAction,
  setEventViewModeEventAction,
  setEventViewModeEventLinkAction,
  updateEventAction,
  updateEventLinkAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class EventView extends Component {
  static propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    mineOnly: PropTypes.bool,
    showMap: PropTypes.bool,
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    addEventRunner: PropTypes.func.isRequired,
    addEventRunnerOris: PropTypes.func.isRequired,
    cancelEventError: PropTypes.func.isRequired,
    clearEventSearchField: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    createEventOris: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    // getClubList: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getEventListOris: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    // getUserList: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    setEventSearchField: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mineOnly: false,
    showMap: false,
  };

  state = {
    refreshCollapseEventDetails: 0,
  }

  // get summary data from API if not available
  componentDidMount() {
    // const {
    //   club,
    //   user,
    //   oevent,
    //   getClubList,
    //   getEventList,
    //   getEventLinkList,
    //   getUserList,
    // } = this.props;
    // const { list: clubList } = club;
    // const { list: userList } = user;
    // const { list, linkList } = oevent;
    // if (!clubList) getClubList();
    // if (!userList) getUserList();
    // if (!list) getEventList();
    // if (!linkList) getEventLinkList();
  }

  // helper to create event list if relevant props change
  getEventListArray = memoize((list, searchField, current, mineOnly) => {
    // console.log('refreshing event list array');
    const currentUserId = (current) ? current._id : '';
    if (!list) return [];
    return list.slice(0, -1)
      .filter((eachEvent) => { // if mineOnly, select only those with current user as runner
        const { runners } = eachEvent;
        const runnerIds = (runners) ? runners.map(runner => runner.user) : [];
        // console.log(currentUserId, runnerIds);
        return !mineOnly || runnerIds.includes(currentUserId);
      })
      .filter((eachEvent) => { // filter against search field
        const {
          date,
          locCountry,
          locPlace,
          mapName,
          name,
          organisedBy,
          tags,
          types,
        } = eachEvent;
        const reformattedDate = reformatDate(date);
        const matchName = name.toLowerCase().includes(searchField.toLowerCase());
        const matchMapName = mapName.toLowerCase().includes(searchField.toLowerCase());
        const matchDate = (date.includes(searchField) || reformattedDate.includes(searchField));
        const matchPlace = locPlace.toLowerCase().includes(searchField.toLowerCase());
        const matchCountry = locCountry.includes(searchField.toUpperCase());
        const matchOrganisedBy = organisedBy.length > 0 && organisedBy.some((club) => {
          return club.shortName.toLowerCase().includes(searchField.toLowerCase());
        });
        const matchTypes = types.length > 0 && types.some((type) => {
          return type.toLowerCase().includes(searchField.toLowerCase());
        });
        const matchTags = tags.length > 0 && tags.some((tag) => {
          return tag.toLowerCase().includes(searchField.toLowerCase());
        });
        return (matchName || matchMapName || matchDate || matchPlace || matchCountry
          || matchOrganisedBy || matchTypes || matchTags);
      });
  });

  // helper to get details of selected event if input props have changed
  getSelectedEvent = memoize((details, selectedEventDetails, errorMessage) => {
    // console.log('getting selected event');
    // get detailed data for selected event if not already available
    if (selectedEventDetails && !details[selectedEventDetails] && !errorMessage) {
      const { getEventById } = this.props;
      getEventById(selectedEventDetails);
    }
    return details[selectedEventDetails] || {};
  });

  // helper to return current user's id if input prop has changed
  getCurrentUserId = memoize(current => ((current) ? current._id : null));

  // helper to return current user's ORIS id if input prop has changed
  getCurrentUserOrisId = memoize(current => ((current) ? current.orisId : null));

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to determine if current user can edit event if input props have changed
  getCanEditEvent = memoize((current, selectedEvent) => {
    // console.log('checking if user can edit event');
    // console.log('current, selectedEvent', current, selectedEvent);
    if (!current || !selectedEvent) return false;
    const isAdmin = (current.role === 'admin');
    if (isAdmin) return true;
    const isOwner = (current._id && selectedEvent.owner
      && current._id === selectedEvent.owner._id);
    if (isOwner) return true;
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user._id)
      : [];
    const isRunner = runnerList.includes(current._id);
    // console.log('isRunner:', isRunner);
    return isRunner;
  });

  // helper to get details of organising clubs if input props have changed
  getOrganisingClubs = memoize((selectedEvent, clubDetails) => {
    const organisingClubs = (selectedEvent.organisedBy)
      ? selectedEvent.organisedBy.map(organisingClub => clubDetails[organisingClub._id])
      : [];
    return organisingClubs;
  });

  // helper to get list of events from ORIS if input props have changed
  getOrisList = memoize((current, orisList, eventMode) => {
    const { getEventListOris } = this.props;
    const currentHasOrisList = current && current.orisId && current.orisId !== '' && current.role !== 'guest';
    // populate ORIS event list when adding event with a current user for the first time
    if (currentHasOrisList && eventMode === 'add' && !orisList) {
      console.log('getting list of events from ORIS');
      getEventListOris();
      return [];
    }
    return orisList;
  });

  // update a prop in EventDetails to trigger refresh of Collapse component to new size
  refreshCollapseEventDetails = () => {
    const { refreshCollapseEventDetails } = this.state;
    this.setState({ refreshCollapseEventDetails: refreshCollapseEventDetails + 1 });
  }

  // render EventDetails, EventEdit or EventDelete components as required by eventMode
  renderEventDetails = () => {
    const { refreshCollapseEventDetails } = this.state;
    const {
      club,
      config,
      oevent,
      user,
      createEvent, // different to MapView version
      createEventOris, // different to MapView version
      deleteEvent,
      getEventList,
      // getEventListOris,
      getEventLinkList,
      selectEventForDetails,
      selectEventToDisplay,
      setEventViewModeEvent,
      updateEvent,
    } = this.props;
    const {
      details,
      errorMessage, // different to MapView version
      eventMode,
      linkList,
      list,
      selectedEventDetails, // different to MapView version
      selectedEventDisplay,
    } = oevent;
    const { details: clubDetails, list: clubList } = club;
    const { language } = config;
    const { current, list: userList } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDetails, errorMessage);
    // different to MapView version
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEditEvent(current, selectedEvent);
    // console.log('canEdit, current, selectedEvent:', canEdit, current, selectedEvent);
    const organisingClubs = this.getOrganisingClubs(selectedEvent, clubDetails);
    // const orisList = testOrisList; // different to MapView version, temporary while developing
    const { orisList } = oevent;
    const orisEventsList = this.getOrisList(current, orisList, eventMode);

    switch (eventMode) {
      case 'none':
        return (
          <div className="ui segment">
            <p><Trans>Sorry, no event is selected.</Trans></p>
          </div>
        );
      case 'add': // not provided in MapView version
        // console.log('orisList prop for EventEdit:', orisList);
        return (
          <EventEdit // same form component handles both create and update
            language={language}
            isAdmin={isAdmin}
            eventMode={eventMode}
            selectedEvent={selectedEvent}
            createEvent={createEvent}
            createEventOris={createEventOris}
            setEventViewModeEvent={setEventViewModeEvent}
            selectEventForDetails={selectEventForDetails}
            selectEventToDisplay={selectEventToDisplay}
            getEventList={getEventList}
            eventList={(list) ? list.slice(0, -1) : []}
            eventLinkList={(linkList) ? linkList.slice(0, -1) : []}
            clubList={(clubList) ? clubList.slice(0, -1) : []}
            orisList={orisEventsList}
          />
        );
      case 'view':
        return (
          <EventDetails
            canEdit={canEdit} // derived
            language={language} // prop (config)
            organisingClubs={organisingClubs} // derived
            refreshCollapse={refreshCollapseEventDetails} // state (value increments to trigger)
            requestRefreshCollapse={this.refreshCollapseEventDetails} // defined here
            selectedEvent={selectedEvent} // derived
            setEventViewModeEvent={setEventViewModeEvent} // prop
          />
        );
      case 'edit':
        return (
          <EventEdit
            clubList={(clubList) ? clubList.slice(0, -1) : []} // prop (club)
            eventLinkList={(linkList) ? linkList.slice(0, -1) : []} // prop (oevent)
            eventList={(list) ? list.slice(0, -1) : []} // prop (oevent)
            eventMode={eventMode} // prop (oevent)
            getEventList={getEventList} // prop
            isAdmin={isAdmin} // derived
            language={language} // prop (config)
            selectedEvent={selectedEvent} // derived
            setEventViewModeEvent={setEventViewModeEvent} // prop
            updateEvent={updateEvent} // prop
            userList={(userList) ? userList.slice(0, -1) : []} // prop (user)
          />
        );
      case 'delete':
        return (
          <EventDelete
            deleteEvent={deleteEvent} // prop
            getEventLinkList={getEventLinkList} // prop
            getEventList={getEventList} // prop
            selectedEvent={selectedEvent} // derived
            selectedEventDetails={selectedEventDetails} // prop (oevent)
            selectedEventDisplay={selectedEventDisplay} // prop (oevent)
            selectEventForDetails={selectEventForDetails} // prop
            selectEventToDisplay={selectEventToDisplay} // prop
            setEventViewModeEvent={setEventViewModeEvent} // prop
          />
        );
      default:
        return null;
    }
  }

  // render EventLinked components as required plus EventLinkedManage
  renderLinkedEvents = () => {
    const {
      config,
      oevent,
      user,
      createEventLink,
      deleteEventLink,
      getEventById,
      getEventLinkList,
      getEventList,
      selectEventForDetails,
      setEventViewModeEvent,
      setEventViewModeEventLink,
      updateEventLink,
    } = this.props;
    const { language } = config;
    const {
      details,
      errorMessage,
      eventLinkMode,
      list,
      linkDetails,
      linkList,
      selectedEventDetails,
      selectedEventDisplay,
      selectedEventLink,
    } = oevent;
    const { current } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDetails, errorMessage);
    // different from MapView version
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEditEvent(current, selectedEvent);

    return (
      <div>
        {(!selectedEvent.linkedTo || selectedEvent.linkedTo.length === 0)
          ? null
          : (
            selectedEvent.linkedTo.map((link) => {
              return (
                <EventLinked
                  key={link._id} // derived (selectedEvent)
                  canEdit={canEdit} // derived
                  eventLinkMode={eventLinkMode} // prop (oevent)
                  isAdmin={isAdmin} // derived
                  link={link} // derived (selectedEvent)
                  linkDetails={linkDetails} // prop (oevent)
                  selectedEvent={selectedEvent} // derived
                  selectEvent={selectEventForDetails} // prop, different from MapView version
                  setEventViewModeEvent={setEventViewModeEvent} // prop
                  setEventViewModeEventLink={setEventViewModeEventLink} // prop
                />
              );
            })
          )}
        {(current)
          ? (
            <EventLinkedManage
              createEventLink={createEventLink} // prop
              deleteEventLink={deleteEventLink} // prop
              eventLinkMode={eventLinkMode} // prop (oevent)
              eventList={(list) ? list.slice(0, -1) : []} // prop (oevent)
              getEventById={getEventById} // prop
              getEventLinkList={getEventLinkList} // prop
              getEventList={getEventList} // prop
              language={language} // prop (config)
              linkDetails={linkDetails} // prop (oevent)
              linkList={(linkList) ? linkList.slice(0, -1) : []} // prop (oevent)
              selectedEvent={selectedEvent} // derived
              selectedEventDetails={selectedEventDetails} // prop (oevent)
              selectedEventDisplay={selectedEventDisplay} // prop (oevent)
              selectedEventLink={selectedEventLink} // prop (oevent)
              setEventViewModeEventLink={setEventViewModeEventLink} // prop
              updateEventLink={updateEventLink} // prop
            />
          )
          : null}
      </div>
    );
  }

  // render EventRunners component
  renderEventRunners = () => {
    const {
      history,
      oevent,
      user,
      addEventRunner,
      addEventRunnerOris,
      getUserById,
      selectEventToDisplay,
      selectRunnerToDisplay,
    } = this.props;
    const {
      details,
      errorMessage,
      selectedEventDetails, // only difference from version in MapView
    } = oevent;
    const { current, details: userDetails, errorMessage: userErrorMessage } = user;

    const currentUserId = this.getCurrentUserId(current);
    const currentUserOrisId = this.getCurrentUserOrisId(current);
    const selectedEvent = this.getSelectedEvent(details, selectedEventDetails, errorMessage);
    const handleSelectEventRunner = (eventId, userId) => {
      selectEventToDisplay(eventId);
      selectRunnerToDisplay(userId);
      history.push('/mapview');
      window.scrollTo(0, 0);
    };

    return (
      <EventRunners
        addEventRunner={addEventRunner} // prop
        addEventRunnerOris={addEventRunnerOris} // prop
        currentUserId={currentUserId} // derived
        currentUserOrisId={currentUserOrisId} // derived
        getUserById={getUserById} // prop
        handleSelectEventRunner={handleSelectEventRunner} // defined here
        selectedEvent={selectedEvent} // derived
        selectEventToDisplay={selectEventToDisplay} // prop
        selectRunnerToDisplay={selectRunnerToDisplay} // prop
        userDetails={userDetails} // prop (user)
        userErrorMessage={userErrorMessage} // prop (user)
      />
    );
  }

  renderError = () => {
    const { oevent, cancelEventError } = this.props;
    const { errorMessage } = oevent;

    if (!errorMessage) return null;
    return (
      <div className="sixteen wide column">
        <div className="ui error message">
          <i
            role="button"
            className="close icon"
            onClick={() => cancelEventError()}
            onKeyPress={() => cancelEventError()}
            tabIndex="0"
          />
          <Trans>{`Error: ${errorMessage}`}</Trans>
        </div>
      </div>
    );
  }

  renderEventFilter = () => {
    const {
      oevent,
      user,
      getEventList,
      clearEventSearchField,
      setEventSearchField,
      setEventViewModeEvent,
      selectEventForDetails,
    } = this.props;
    const { searchField } = oevent;
    const { current } = user;

    return (
      <EventFilter
        currentUser={current}
        searchField={searchField}
        clearEventSearchField={clearEventSearchField}
        setEventSearchField={setEventSearchField}
        setEventViewModeEvent={setEventViewModeEvent}
        getEventList={getEventList}
        selectEventForDetails={selectEventForDetails}
      />
    );
  }

  renderEventList = () => {
    const {
      mineOnly,
      config,
      oevent,
      user,
      setEventViewModeEvent,
      selectEventForDetails,
    } = this.props;
    const { language } = config;
    const { searchField, list } = oevent;
    const { current } = user;
    // need to consider reducing the number shown if there are many many events...
    const eventListArray = this.getEventListArray(list, searchField, current, mineOnly);

    return (
      <div className="list-limit-height">
        <EventList
          language={language}
          events={eventListArray}
          selectEventForDetails={selectEventForDetails}
          setEventViewModeEvent={setEventViewModeEvent}
        />
      </div>
    );
  }

  renderEventMap = () => {
    const {
      mineOnly,
      oevent,
      user,
      setEventViewModeEvent,
      selectEventForDetails,
    } = this.props;
    const { searchField, list } = oevent;
    const { current } = user;
    const eventListArray = this.getEventListArray(list, searchField, current, mineOnly);

    return (
      <EventMap
        events={eventListArray}
        selectEventForDetails={selectEventForDetails}
        setEventViewModeEvent={setEventViewModeEvent}
      />
    );
  }

  render() {
    // console.log('props in EventView:', this.props);
    const { showMap } = this.props;
    if (showMap) {
      return (
        <div className="ui vertically padded stackable grid">
          {this.renderError()}
          <div className="sixteen wide column">
            {this.renderEventMap()}
          </div>
          <div className="eight wide column">
            {this.renderEventFilter()}
            {this.renderLinkedEvents()}
          </div>
          <div className="eight wide column">
            {this.renderEventDetails()}
            {this.renderEventRunners()}
          </div>
        </div>
      );
    }

    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="eight wide column">
          {this.renderEventFilter()}
          {this.renderEventList()}
        </div>
        <div className="eight wide column">
          {this.renderEventDetails()}
          {this.renderEventRunners()}
          {this.renderLinkedEvents()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  club,
  config,
  user,
  oevent,
}) => {
  return {
    club,
    config,
    user,
    oevent,
  };
};
const mapDispatchToProps = {
  addEventRunner: addEventRunnerAction,
  addEventRunnerOris: addEventRunnerOrisAction,
  cancelEventError: cancelEventErrorAction,
  clearEventSearchField: () => setEventSearchFieldAction(''),
  createEvent: createEventAction,
  createEventLink: createEventLinkAction,
  createEventOris: createEventOrisAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
  getClubList: getClubListAction,
  getEventById: getEventByIdAction,
  getEventLinkList: getEventLinkListAction,
  getEventList: getEventListAction,
  getEventListOris: getEventListOrisAction,
  getUserById: getUserByIdAction,
  getUserList: getUserListAction,
  selectEventForDetails: selectEventForDetailsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  setEventSearchField: event => setEventSearchFieldAction(event.target.value),
  setEventViewModeEvent: setEventViewModeEventAction,
  setEventViewModeEventLink: setEventViewModeEventLinkAction,
  updateEvent: updateEventAction,
  updateEventLink: updateEventLinkAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventView));
