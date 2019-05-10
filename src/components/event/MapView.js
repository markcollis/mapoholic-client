import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import EventRunners from './EventRunners';
import EventRunnerDetails from './EventRunnerDetails';
import EventRunnerEdit from './EventRunnerEdit';
import EventRunnerDelete from './EventRunnerDelete';
import EventMapViewer from './EventMapViewer';
import EventDetails from './EventDetails';
import EventEdit from './EventEdit';
import EventDelete from './EventDelete';
import EventLinked from './EventLinked';
import EventLinkedManage from './EventLinkedManage';
import EventComments from './EventComments';
import EventResults from './EventResults';

import {
  // setEventViewModeCommentAction,
  addEventRunnerAction,
  addEventRunnerOrisAction,
  cancelEventErrorAction,
  createEventLinkAction,
  deleteEventAction,
  deleteEventLinkAction,
  deleteEventRunnerAction,
  deleteMapAction,
  getClubListAction,
  getEventByIdAction,
  getEventLinkListAction,
  getEventListAction,
  getUserListAction,
  postMapAction,
  selectEventForDetailsAction,
  selectEventToDisplayAction,
  selectMapToDisplayAction,
  selectRunnerToDisplayAction,
  setEventViewModeEventAction,
  setEventViewModeEventLinkAction,
  setEventViewModeRunnerAction,
  updateEventAction,
  updateEventLinkAction,
  updateEventRunnerAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class MapView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    addEventRunner: PropTypes.func.isRequired,
    addEventRunnerOris: PropTypes.func.isRequired,
    cancelEventError: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    deleteEventRunner: PropTypes.func.isRequired,
    deleteMap: PropTypes.func.isRequired,
    getClubList: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    postMap: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectMapToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    setEventViewModeRunner: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
    updateEventRunner: PropTypes.func.isRequired,
  }

  // get summary data from API if not already available
  componentDidMount() {
    const {
      club,
      user,
      oevent,
      getClubList,
      getEventList,
      getEventLinkList,
      getUserList,
    } = this.props;
    const { list: clubList } = club;
    const { list: eventList, linkList } = oevent;
    const { list: userList } = user;
    if (!clubList) getClubList();
    if (!eventList) getEventList();
    if (!linkList) getEventLinkList();
    if (!userList) getUserList();
  }

  // helper to get details of selected event if input props have changed
  getSelectedEvent = memoize((details, selectedEventDisplay, errorMessage) => {
    // get detailed data for selected event if not already available
    if (selectedEventDisplay && !details[selectedEventDisplay] && !errorMessage) {
      const { getEventById } = this.props;
      getEventById(selectedEventDisplay);
    }
    return details[selectedEventDisplay] || {};
  });

  // helper to return current user's id if input prop has changed
  getCurrentUserId = memoize(current => ((current) ? current._id.toString() : null));

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to determine if current user can edit runner if input props have changed
  getCanEdit = memoize((current, selectedEvent) => {
    const isAdmin = (current && current.role === 'admin');
    if (isAdmin) return true;
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user.toString())
      : [];
    const isRunner = (current && selectedEvent && runnerList.includes(current._id.toString()));
    return isRunner;
  });

  // helper to get details of organising clubs if input props have changed
  getOrganisingClubs = memoize((selectedEvent, clubDetails) => {
    const organisingClubs = (selectedEvent.organisedBy)
      ? selectedEvent.organisedBy.map(organisingClub => clubDetails[organisingClub._id])
      : [];
    return organisingClubs;
  });

  // render EventRunners component
  renderEventRunners = () => {
    const {
      oevent,
      user,
      addEventRunner,
      addEventRunnerOris,
      selectEventToDisplay,
      selectRunnerToDisplay,
    } = this.props;
    const {
      details,
      errorMessage,
      runnerMode,
      selectedEventDisplay,
    } = oevent;
    const { current } = user;

    const currentUserId = this.getCurrentUserId(current);
    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay, errorMessage);

    return (
      <EventRunners
        addEventRunner={addEventRunner} // prop
        addEventRunnerOris={addEventRunnerOris} // prop
        currentUserId={currentUserId} // derived
        runnerMode={runnerMode} // prop (oevent)
        selectedEvent={selectedEvent} // derived
        selectEventToDisplay={selectEventToDisplay} // prop
        selectRunnerToDisplay={selectRunnerToDisplay} // prop
      />
    );
  }

  // render EventRunnerDetails, EventRunnerEdit or EventRunnerDelete components as required
  renderEventRunnerDetails = () => {
    const {
      config,
      oevent,
      user,
      deleteEventRunner,
      setEventViewModeRunner,
      updateEventRunner,
    } = this.props;
    const { language } = config;
    const {
      details,
      runnerMode,
      selectedEventDisplay,
      selectedRunner,
    } = oevent;
    const { current } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);
    const canEdit = this.getCanEdit(current, selectedEvent);
    const isAdmin = this.getIsAdmin(current);

    switch (runnerMode) {
      case 'none':
        return (
          <div className="ui segment">
            <p><Trans>Select a runner from the list to show further details here</Trans></p>
          </div>
        );
      case 'view':
        return (
          <EventRunnerDetails
            canEdit={canEdit}
            selectedEvent={selectedEvent} // derived
            selectedRunner={selectedRunner} // prop (oevent)
            setEventViewModeRunner={setEventViewModeRunner} // prop
          />
        );
      case 'edit':
        return (
          <EventRunnerEdit
            isAdmin={isAdmin}
            language={language} // prop (config)
            selectedEvent={selectedEvent} // derived
            selectedRunner={selectedRunner} // prop (oevent)
            setEventViewModeRunner={setEventViewModeRunner} // prop
            updateEventRunner={updateEventRunner} // prop
          />
        );
      case 'delete':
        return (
          <EventRunnerDelete
            deleteEventRunner={deleteEventRunner} // prop
            selectedEvent={selectedEvent} // derived
            selectedRunner={selectedRunner} // prop (oevent)
            setEventViewModeRunner={setEventViewModeRunner} // prop
          />
        );
      default:
        return null;
    }
  }

  // render EventDetails, EventEdit or EventDelete components as required by eventMode
  renderEventDetails = () => {
    const {
      club,
      config,
      oevent,
      user,
      deleteEvent,
      getEventList,
      getEventLinkList,
      selectEventForDetails,
      selectEventToDisplay,
      setEventViewModeEvent,
      updateEvent,
    } = this.props;
    const {
      details,
      eventMode,
      linkList,
      list,
      selectedEventDisplay,
    } = oevent;
    const { details: clubDetails, list: clubList } = club;
    const { language } = config;
    const { current, list: userList } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEdit(current, selectedEvent);
    const organisingClubs = this.getOrganisingClubs(selectedEvent, clubDetails);

    switch (eventMode) {
      case 'none':
        return (
          <div className="ui segment">
            <p><Trans>Sorry, no event is selected.</Trans></p>
          </div>
        );
      case 'add': // not relevant on this screen
      case 'view':
        return (
          <EventDetails
            canEdit={canEdit} // derived
            language={language} // prop (config)
            organisingClubs={organisingClubs} // derived
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
      oevent,
      user,
      createEventLink,
      deleteEventLink,
      getEventById,
      getEventLinkList,
      getEventList,
      selectEventToDisplay,
      setEventViewModeEvent,
      setEventViewModeEventLink,
      updateEventLink,
    } = this.props;
    const {
      details,
      eventLinkMode,
      list,
      linkDetails,
      linkList,
      selectedEventDetails,
      selectedEventDisplay,
      selectedEventLink,
    } = oevent;
    const { current } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEdit(current, selectedEvent);

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
                  selectEventForDetails={selectEventToDisplay} // prop: names need work
                  setEventViewModeEvent={setEventViewModeEvent} // prop
                  setEventViewModeEventLink={setEventViewModeEventLink} // prop
                />
              );
            })
          )}
        <EventLinkedManage
          createEventLink={createEventLink} // prop
          deleteEventLink={deleteEventLink} // prop
          eventLinkMode={eventLinkMode} // prop (oevent)
          eventList={(list) ? list.slice(0, -1) : []} // prop (oevent)
          getEventById={getEventById} // prop
          getEventLinkList={getEventLinkList} // prop
          getEventList={getEventList} // prop
          linkDetails={linkDetails} // prop (oevent)
          linkList={(linkList) ? linkList.slice(0, -1) : []} // prop (oevent)
          selectedEvent={selectedEvent} // derived
          selectedEventDetails={selectedEventDetails} // prop (oevent)
          selectedEventDisplay={selectedEventDisplay} // prop (oevent)
          selectedEventLink={selectedEventLink} // prop (oevent)
          setEventViewModeEventLink={setEventViewModeEventLink} // prop
          updateEventLink={updateEventLink} // prop
        />
      </div>
    );
  }

  // render EventComments component (self-contained with add/edit/delete)
  renderEventComments = () => {
    const {
      oevent,
    } = this.props;
    const {
      details,
      selectedEventDisplay,
      selectedRunner,
    } = oevent;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);

    return (
      <EventComments
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
      />
    );
  }

  // render EventMapViewer component (self-contained with add/replace/delete maps)
  renderEventMapViewer = () => {
    const {
      oevent,
      deleteMap,
      postMap,
      selectMapToDisplay,
      updateEventRunner,
    } = this.props;
    const {
      details,
      selectedEventDisplay,
      selectedRunner,
      selectedMap,
    } = oevent;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);

    return (
      <EventMapViewer
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
        selectedMap={selectedMap} // prop (oevent)
        deleteMap={deleteMap} // prop
        postMap={postMap} // prop
        selectMapToDisplay={selectMapToDisplay} // prop
        updateEventRunner={updateEventRunner} // prop
      />
    );
  }

  // render EventResults component (self-contained with add/edit/delete)
  // *** consider whether add/edit might need wider screen? ***
  renderEventResults = () => { // simple viewer done, not editable yet
    const { oevent } = this.props;
    const {
      details,
      selectedEventDisplay,
      selectedRunner,
    } = oevent;

    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);

    return (
      <EventResults
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
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

  render() {
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="eight wide column">
          {this.renderEventRunnerDetails()}
        </div>
        <div className="eight wide column">
          {this.renderEventRunners()}
        </div>
        <div className="sixteen wide column">
          {this.renderEventMapViewer()}
        </div>
        <div className="eight wide column">
          {this.renderEventDetails()}
          {this.renderLinkedEvents()}
        </div>
        <div className="eight wide column">
          {this.renderEventComments()}
          {this.renderEventResults()}
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
  // setEventViewModeComment: setEventViewModeCommentAction,
  addEventRunner: addEventRunnerAction,
  addEventRunnerOris: addEventRunnerOrisAction,
  cancelEventError: cancelEventErrorAction,
  createEventLink: createEventLinkAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
  deleteEventRunner: deleteEventRunnerAction,
  deleteMap: deleteMapAction,
  getClubList: getClubListAction,
  getEventById: getEventByIdAction,
  getEventLinkList: getEventLinkListAction,
  getEventList: getEventListAction,
  getUserList: getUserListAction,
  postMap: postMapAction,
  selectEventForDetails: selectEventForDetailsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectMapToDisplay: selectMapToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  setEventViewModeEvent: setEventViewModeEventAction,
  setEventViewModeEventLink: setEventViewModeEventLinkAction,
  setEventViewModeRunner: setEventViewModeRunnerAction,
  updateEvent: updateEventAction,
  updateEventLink: updateEventLinkAction,
  updateEventRunner: updateEventRunnerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
