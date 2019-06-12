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
  getEventByIdAction,
  getEventLinkListAction,
  getEventListAction,
  getEventListOrisAction,
  getUserByIdAction,
  selectEventForDetailsEventsAction,
  selectEventForDetailsMyMapsAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  setEventSearchFieldEventsAction,
  setEventSearchFieldMyMapsAction,
  setEventViewModeEventEventsAction,
  setEventViewModeEventMyMapsAction,
  setEventViewModeEventMapViewAction,
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
    clearEventSearchFieldEvents: PropTypes.func.isRequired,
    clearEventSearchFieldMyMaps: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    createEventOris: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getEventListOris: PropTypes.func.isRequired,
    getUserById: PropTypes.func.isRequired,
    selectEventForDetailsEvents: PropTypes.func.isRequired,
    selectEventForDetailsMyMaps: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    setEventSearchFieldEvents: PropTypes.func.isRequired,
    setEventSearchFieldMyMaps: PropTypes.func.isRequired,
    setEventViewModeEventEvents: PropTypes.func.isRequired,
    setEventViewModeEventMyMaps: PropTypes.func.isRequired,
    setEventViewModeEventMapView: PropTypes.func.isRequired,
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

  // helper to create event list if relevant props change
  getEventListArray = memoize((list, searchField, current, mineOnly) => {
    // console.log('refreshing event list array');
    // console.log('list:', list);
    const currentUserId = (current) ? current._id : '';
    if (!list) return [];
    return list
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

  // switch to MapView when a runner is selected
  handleSelectEventRunner = (eventId, userId) => {
    const {
      history,
      selectEventToDisplay,
      selectRunnerToDisplay,
      setEventViewModeEventMapView,
    } = this.props;
    selectEventToDisplay(eventId);
    setEventViewModeEventMapView('view');
    selectRunnerToDisplay(userId);
    history.push('/mapview');
    window.scrollTo(0, 0);
  };

  // select an event to display details of, switching to MapView if in MyMaps section
  handleSelectEvent = (eventId) => {
    const {
      mineOnly,
      selectEventForDetailsEvents,
      selectEventForDetailsMyMaps,
      setEventViewModeEventEvents,
      setEventViewModeEventMyMaps,
      user,
    } = this.props;
    const { current } = user;
    const { _id: userId } = current;
    if (mineOnly) {
      selectEventForDetailsMyMaps(eventId);
      if (eventId === '') {
        setEventViewModeEventMyMaps('none');
      } else {
        setEventViewModeEventMyMaps('view');
      }
      this.handleSelectEventRunner(eventId, userId);
    } else {
      selectEventForDetailsEvents(eventId);
      if (eventId === '') {
        setEventViewModeEventEvents('none');
      } else {
        setEventViewModeEventEvents('view');
      }
    }
  };

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
      mineOnly,
      selectEventForDetailsEvents,
      selectEventForDetailsMyMaps,
      selectEventToDisplay,
      setEventViewModeEventEvents,
      setEventViewModeEventMyMaps,
      updateEvent,
    } = this.props;
    const {
      details,
      errorMessage, // different to MapView version
      eventModeEvents,
      eventModeMyMaps,
      linkList,
      list,
      selectedEventDetailsEvents, // different to MapView version
      selectedEventDetailsMyMaps,
      selectedEventDisplay,
    } = oevent;
    const { details: clubDetails, list: clubList } = club;
    const { language } = config;
    const { current, list: userList } = user;
    // select appropriate props for Events or MyMaps view
    const selectEventForDetails = (mineOnly)
      ? selectEventForDetailsMyMaps
      : selectEventForDetailsEvents;
    const setEventViewModeEvent = (mineOnly)
      ? setEventViewModeEventMyMaps
      : setEventViewModeEventEvents;
    const eventMode = (mineOnly) ? eventModeMyMaps : eventModeEvents;
    const selectedEventDetails = (mineOnly)
      ? selectedEventDetailsMyMaps
      : selectedEventDetailsEvents;

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
            eventList={list}
            eventLinkList={linkList}
            clubList={clubList}
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
            clubList={clubList} // prop (club)
            eventLinkList={linkList} // prop (oevent)
            eventList={list} // prop (oevent)
            eventMode={eventMode} // prop (oevent)
            getEventList={getEventList} // prop
            isAdmin={isAdmin} // derived
            language={language} // prop (config)
            selectedEvent={selectedEvent} // derived
            setEventViewModeEvent={setEventViewModeEvent} // prop
            updateEvent={updateEvent} // prop
            userList={userList} // prop (user)
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
      mineOnly,
      selectEventForDetailsEvents,
      selectEventForDetailsMyMaps,
      setEventViewModeEventEvents,
      setEventViewModeEventMyMaps,
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
      selectedEventDetailsEvents,
      selectedEventDetailsMyMaps,
      selectedEventDisplay,
      selectedEventLink,
    } = oevent;
    const { current } = user;
    // select appropriate props for Events or MyMaps view
    const selectEventForDetails = (mineOnly)
      ? selectEventForDetailsMyMaps
      : selectEventForDetailsEvents;
    const setEventViewModeEvent = (mineOnly)
      ? setEventViewModeEventMyMaps
      : setEventViewModeEventEvents;
    const selectedEventDetails = (mineOnly)
      ? selectedEventDetailsMyMaps
      : selectedEventDetailsEvents;

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
              eventList={list} // prop (oevent)
              getEventById={getEventById} // prop
              getEventLinkList={getEventLinkList} // prop
              getEventList={getEventList} // prop
              language={language} // prop (config)
              linkDetails={linkDetails} // prop (oevent)
              linkList={linkList} // prop (oevent)
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
      // history,
      mineOnly,
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
      selectedEventDetailsEvents, // only difference from version in MapView
      selectedEventDetailsMyMaps,
    } = oevent;
    const { current, details: userDetails, errorMessage: userErrorMessage } = user;
    const currentUserId = this.getCurrentUserId(current);
    const currentUserOrisId = this.getCurrentUserOrisId(current);
    // select appropriate props for Events or MyMaps view
    const selectedEventDetails = (mineOnly)
      ? selectedEventDetailsMyMaps
      : selectedEventDetailsEvents;
    const selectedEvent = this.getSelectedEvent(details, selectedEventDetails, errorMessage);
    // const handleSelectEventRunner = (eventId, userId) => {
    //   selectEventToDisplay(eventId);
    //   selectRunnerToDisplay(userId);
    //   history.push('/mapview');
    //   window.scrollTo(0, 0);
    // };

    if (mineOnly) return null;
    return (
      <EventRunners
        addEventRunner={addEventRunner} // prop
        addEventRunnerOris={addEventRunnerOris} // prop
        currentUserId={currentUserId} // derived
        currentUserOrisId={currentUserOrisId} // derived
        getUserById={getUserById} // prop
        handleSelectEventRunner={this.handleSelectEventRunner} // derived
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
      clearEventSearchFieldEvents,
      clearEventSearchFieldMyMaps,
      mineOnly,
      setEventSearchFieldEvents,
      setEventSearchFieldMyMaps,
      setEventViewModeEventEvents,
      setEventViewModeEventMyMaps,
      selectEventForDetailsEvents,
      selectEventForDetailsMyMaps,
    } = this.props;
    const {
      searchFieldEvents,
      searchFieldMyMaps,
    } = oevent;
    const { current } = user;
    // select appropriate props for Events or MyMaps view
    const searchField = (mineOnly) ? searchFieldMyMaps : searchFieldEvents;
    const selectEventForDetails = (mineOnly)
      ? selectEventForDetailsMyMaps
      : selectEventForDetailsEvents;
    const setEventViewModeEvent = (mineOnly)
      ? setEventViewModeEventMyMaps
      : setEventViewModeEventEvents;
    const setEventSearchField = (mineOnly)
      ? setEventSearchFieldMyMaps
      : setEventSearchFieldEvents;
    const clearEventSearchField = (mineOnly)
      ? clearEventSearchFieldMyMaps
      : clearEventSearchFieldEvents;

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
      // setEventViewModeEvent,
      // selectEventForDetails,
    } = this.props;
    const { language } = config;
    const {
      searchFieldEvents,
      searchFieldMyMaps,
      list,
    } = oevent;
    const { current } = user;
    // select appropriate props for Events or MyMaps view
    const searchField = (mineOnly) ? searchFieldMyMaps : searchFieldEvents;
    // need to consider reducing the number shown if there are many many events...
    const eventListArray = this.getEventListArray(list, searchField, current, mineOnly);

    return (
      <div className="list-limit-height">
        <EventList
          language={language} // prop (config)
          events={eventListArray} // derived
          handleSelectEvent={this.handleSelectEvent} // derived
          // selectEventForDetails={selectEventForDetails}
          // setEventViewModeEvent={setEventViewModeEvent}
        />
      </div>
    );
  }

  renderEventMap = () => {
    const {
      mineOnly,
      oevent,
      user,
      // setEventViewModeEvent,
      // selectEventForDetails,
    } = this.props;
    const {
      searchFieldEvents,
      searchFieldMyMaps,
      list,
    } = oevent;
    const { current } = user;
    // select appropriate props for Events or MyMaps view
    const searchField = (mineOnly) ? searchFieldMyMaps : searchFieldEvents;
    const eventListArray = this.getEventListArray(list, searchField, current, mineOnly);

    return (
      <EventMap
        events={eventListArray}
        handleSelectEvent={this.handleSelectEvent} // derived
        // selectEventForDetails={selectEventForDetails}
        // setEventViewModeEvent={setEventViewModeEvent}
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
  clearEventSearchFieldEvents: () => setEventSearchFieldEventsAction(''),
  clearEventSearchFieldMyMaps: () => setEventSearchFieldMyMapsAction(''),
  createEvent: createEventAction,
  createEventLink: createEventLinkAction,
  createEventOris: createEventOrisAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
  getEventById: getEventByIdAction,
  getEventLinkList: getEventLinkListAction,
  getEventList: getEventListAction,
  getEventListOris: getEventListOrisAction,
  getUserById: getUserByIdAction,
  selectEventForDetailsEvents: selectEventForDetailsEventsAction,
  selectEventForDetailsMyMaps: selectEventForDetailsMyMapsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  setEventSearchFieldEvents: event => setEventSearchFieldEventsAction(event.target.value),
  setEventSearchFieldMyMaps: event => setEventSearchFieldMyMapsAction(event.target.value),
  setEventViewModeEventEvents: setEventViewModeEventEventsAction,
  setEventViewModeEventMapView: setEventViewModeEventMapViewAction,
  setEventViewModeEventMyMaps: setEventViewModeEventMyMapsAction,
  setEventViewModeEventLink: setEventViewModeEventLinkAction,
  updateEvent: updateEventAction,
  updateEventLink: updateEventLinkAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventView));
