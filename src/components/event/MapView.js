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
  // setEventViewModeCourseMapAction,
  // setEventViewModeRunnerAction,
  // updateEventRunnerAction,
  addEventRunnerAction,
  addEventRunnerOrisAction,
  cancelEventErrorAction,
  createEventLinkAction,
  deleteEventAction,
  deleteEventLinkAction,
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
  updateEventAction,
  updateEventLinkAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class MapView extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    addEventRunner: PropTypes.func.isRequired,
    addEventRunnerOris: PropTypes.func.isRequired,
    cancelEventError: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
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
    updateEvent: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
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
    const { list: userList } = user;
    const { list: eventList, linkList } = oevent;
    if (!clubList) getClubList();
    if (!userList) getUserList();
    if (!eventList) getEventList();
    if (!linkList) getEventLinkList();
  }

  // get detailed data for selected event if not already available
  componentDidUpdate() {
    const { oevent, getEventById } = this.props;
    const { details, errorMessage, selectedEventDisplay } = oevent;
    if (selectedEventDisplay && !details[selectedEventDisplay] && !errorMessage) {
      getEventById(selectedEventDisplay);
    }
  }

  // helper to recalculate only if input props have changed
  getSelectedEvent = memoize((details, selectedEventDisplay) => {
    return details[selectedEventDisplay] || {};
  });

  // helper to recalculate only if input prop has changed
  getCurrentUserId = memoize((current) => {
    return (current) ? current._id.toString() : null;
  });

  // helper to recalculate only if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to recalculate only if input props have changed
  getCanEdit = memoize((current, selectedEvent) => {
    const isAdmin = (current && current.role === 'admin');
    if (isAdmin) return true;
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user.toString())
      : [];
    const isRunner = (current && selectedEvent
      && runnerList.includes(current._id.toString()));
    return isRunner;
  });

  // helper to recalculate only if input props have changed
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
    const { details, runnerMode, selectedEventDisplay } = oevent;
    const { current } = user;

    const currentUserId = this.getCurrentUserId(current);
    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);

    return (
      <EventRunners
        currentUserId={currentUserId} // derived
        selectedEvent={selectedEvent} // derived
        runnerMode={runnerMode} // prop (oevent)
        addEventRunner={addEventRunner} // prop
        addEventRunnerOris={addEventRunnerOris} // prop
        selectEventToDisplay={selectEventToDisplay} // prop
        selectRunnerToDisplay={selectRunnerToDisplay} // prop
      />
    );
  }

  // render EventRunnerDetails, EventRunnerEdit or EventRunnerDelete components as required
  renderEventRunnerDetails = () => { // new, to do now
    const {
      oevent,
    } = this.props;
    const {
      details,
      selectedEventDisplay,
    } = oevent;
    const selectedEvent = this.getSelectedEvent(details, selectedEventDisplay);
    return (
      <div>
        <EventRunnerDetails
          selectedEvent={selectedEvent}
        />
        <EventRunnerEdit
          selectedEvent={selectedEvent}
        />
        <EventRunnerDelete
          selectedEvent={selectedEvent}
        />
      </div>
    );
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
      eventMode,
      list,
      details,
      linkList,
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
            language={language} // prop (config)
            isAdmin={isAdmin} // derived
            eventMode={eventMode} // prop (oevent)
            getEventList={getEventList} // prop
            selectedEvent={selectedEvent} // derived
            setEventViewModeEvent={setEventViewModeEvent} // prop
            updateEvent={updateEvent} // prop
            eventList={(list) ? list.slice(0, -1) : []} // prop (oevent)
            eventLinkList={(linkList) ? linkList.slice(0, -1) : []} // prop (oevent)
            userList={(userList) ? userList.slice(0, -1) : []} // prop (user)
            clubList={(clubList) ? clubList.slice(0, -1) : []} // prop (club)
          />
        );
      case 'delete':
        return (
          <EventDelete
            selectedEvent={selectedEvent} // derived
            selectedEventDisplay={selectedEventDisplay} // prop (oevent)
            deleteEvent={deleteEvent} // prop
            getEventList={getEventList} // prop
            getEventLinkList={getEventLinkList} // prop
            setEventViewModeEvent={setEventViewModeEvent} // prop
            selectEventForDetails={selectEventForDetails} // prop
            selectEventToDisplay={selectEventToDisplay} // prop
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
      selectEventToDisplay,
      setEventViewModeEvent,
      setEventViewModeEventLink,
      createEventLink,
      updateEventLink,
      deleteEventLink,
    } = this.props;
    const {
      details,
      eventLinkMode,
      list,
      linkDetails,
      linkList,
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
                  isAdmin={isAdmin} // derived
                  canEdit={canEdit} // derived
                  eventLinkMode={eventLinkMode} // prop (oevent)
                  selectedEvent={selectedEvent} // derived
                  link={link} // derived (selectedEvent)
                  linkDetails={linkDetails} // prop (oevent)
                  selectEventForDetails={selectEventToDisplay} // prop: names need work
                  setEventViewModeEvent={setEventViewModeEvent} // prop
                  setEventViewModeEventLink={setEventViewModeEventLink} // prop
                />
              );
            })
          )}
        <EventLinkedManage
          eventLinkMode={eventLinkMode} // prop (oevent)
          selectedEvent={selectedEvent} // derived
          selectedEventLink={selectedEventLink} // prop (oevent)
          eventList={list} // prop (oevent)
          linkList={linkList} // prop (oevent)
          linkDetails={linkDetails} // prop (oevent)
          createEventLink={createEventLink} // prop
          updateEventLink={updateEventLink} // prop
          deleteEventLink={deleteEventLink} // prop
          setEventViewModeEvent={setEventViewModeEvent} // prop
          setEventViewModeEventLink={setEventViewModeEventLink} // prop
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
        selectedEvent={selectedEvent}
        selectedRunner={selectedRunner}
      />
    );
  }

  // render EventMapViewer component (self-contained with add/replace/delete maps)
  renderEventMapViewer = () => { // new
    const {
      oevent,
      selectMapToDisplay,
      postMap,
      deleteMap,
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
        selectedEvent={selectedEvent}
        selectedRunner={selectedRunner}
        selectedMap={selectedMap}
        selectMapToDisplay={selectMapToDisplay}
        postMap={postMap}
        deleteMap={deleteMap}
      />
    );
  }

  // render EventResults component (self-contained with add/edit/delete)
  // *** consider whether add/edit might need wider screen? ***
  renderEventResults = () => { // simple viewer done, not editable
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
      <EventResults
        selectedEvent={selectedEvent}
        selectedRunner={selectedRunner}
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
          {`Error: ${errorMessage}`}
        </div>
      </div>
    );
  }

  render() {
    const { oevent } = this.props;
    const {
      selectedEventDetails,
      selectedEventDisplay,
      selectedRunner,
      selectedMap,
    } = oevent;
    return (
      <div className="ui vertically padded stackable grid">
        <div className="sixteen wide column">
          <h3>MapView component</h3>
          <p>{`Selected Event (details): ${selectedEventDetails}`}</p>
          <p>{`Selected Event (display): ${selectedEventDisplay}`}</p>
          <p>{`Selected Runner: ${selectedRunner}`}</p>
          <p>{`Selected Map: ${selectedMap}`}</p>
        </div>
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
  // selectMapToDisplay: selectMapToDisplayAction,
  // setEventViewModeComment: setEventViewModeCommentAction,
  // setEventViewModeCourseMap: setEventViewModeCourseMapAction,
  // setEventViewModeRunner: setEventViewModeRunnerAction,
  // updateEventRunner: updateEventRunnerAction,
  addEventRunner: addEventRunnerAction,
  addEventRunnerOris: addEventRunnerOrisAction,
  cancelEventError: cancelEventErrorAction,
  createEventLink: createEventLinkAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
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
  updateEvent: updateEventAction,
  updateEventLink: updateEventLinkAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
