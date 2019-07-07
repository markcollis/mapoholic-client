import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import EventComments from './EventComments';
import EventDelete from './EventDelete';
import EventDetails from './EventDetails';
import EventEdit from './EventEdit';
import EventLinked from './EventLinked';
import EventLinkedManage from './EventLinkedManage';
import EventMapViewer from './EventMapViewer';
import EventResults from './EventResults';
import EventRunnerDelete from './EventRunnerDelete';
import EventRunnerDetails from './EventRunnerDetails';
import EventRunnerEdit from './EventRunnerEdit';
import EventRunners from './EventRunners';

import {
  addEventRunnerAction,
  addEventRunnerOrisAction,
  cancelEventErrorAction,
  createEventLinkAction,
  deleteCommentAction,
  deleteEventAction,
  deleteEventLinkAction,
  deleteEventRunnerAction,
  deleteMapAction,
  getEventByIdAction,
  getEventLinkListAction,
  getEventListAction,
  postCommentAction,
  postMapAction,
  selectEventIdMapViewAction,
  selectMapToDisplayAction,
  selectRunnerToDisplayAction,
  selectUserToDisplayAction,
  setEventViewModeEventMapViewAction,
  setEventViewModeEventLinkAction,
  setEventViewModeRunnerAction,
  setMapViewParametersAction,
  setUserViewModeAction,
  updateCommentAction,
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
    deleteComment: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    deleteEventRunner: PropTypes.func.isRequired,
    deleteMap: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    postMap: PropTypes.func.isRequired,
    // selectEventId: PropTypes.func.isRequired,
    selectEventIdMapView: PropTypes.func.isRequired,
    selectMapToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    selectUserToDisplay: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    setEventViewModeRunner: PropTypes.func.isRequired,
    setMapViewParameters: PropTypes.func.isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
    updateEventRunner: PropTypes.func.isRequired,
  }

  state = {
    refreshCollapseEventComments: 0,
    refreshCollapseEventDetails: 0,
    refreshCollapseEventResults: 0,
    refreshCollapseRunnerDetails: 0,
  }

  // helper to get details of selected event if input props have changed
  getSelectedEvent = memoize((details, selectedEventId, errorMessage) => {
    // get detailed data for selected event if not already available
    if (selectedEventId && !details[selectedEventId] && !errorMessage) {
      const { getEventById } = this.props;
      getEventById(selectedEventId);
    }
    return details[selectedEventId] || {};
  });

  // helper to return current user's id if input prop has changed
  getCurrentUserId = memoize(current => ((current) ? current._id.toString() : null));

  // helper to return current user's ORIS id if input prop has changed
  getCurrentUserOrisId = memoize(current => ((current) ? current.orisId : null));

  // helper to check if current user is administrator if input prop has changed
  getIsAdmin = memoize(current => (current && current.role === 'admin'));

  // helper to determine if current user can edit event if input props have changed
  getCanEditEvent = memoize((current, selectedEvent) => {
    const isAdmin = (current && current.role === 'admin');
    if (isAdmin) return true;
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user._id)
      : [];
    const isRunner = (current && selectedEvent && runnerList.includes(current._id));
    return isRunner;
  });

  // helper to determine if current user can edit runner if input props have changed
  getCanEditRunner = memoize((current, selectedRunner) => {
    const isAdmin = (current && current.role === 'admin');
    const isSelectedRunner = (current && current._id === selectedRunner);
    return isAdmin || isSelectedRunner;
  });

  // helper to get details of organising clubs if input props have changed
  getOrganisingClubs = memoize((selectedEvent, clubDetails) => {
    const organisingClubs = (selectedEvent.organisedBy)
      ? selectedEvent.organisedBy.map(organisingClub => clubDetails[organisingClub._id])
      : [];
    return organisingClubs;
  });

  // helper to extract list of event tags if input props have changed
  getEventTagList = memoize((list, language) => {
    if (!list) return [];
    const tagList = list.reduce((acc, val) => {
      val.tags.forEach((tag) => {
        if (acc.indexOf(tag) === -1) {
          acc.push(tag);
        }
      });
      return acc;
    }, []);
    tagList.sort((a, b) => {
      return a.localeCompare(b, language);
    });
    return tagList;
  });

  // helper to extract list of personal tags (from selected
  // runner's entries) if input props have changed
  getPersonalTagList = memoize((list, selectedRunner, language) => {
    if (!list) return [];
    const filteredList = list.filter((eachEvent) => {
      // select only those with current user as runner
      const { runners } = eachEvent;
      const runnerIds = (runners) ? runners.map(runner => runner.user) : [];
      return runnerIds.includes(selectedRunner);
    });
    const tagList = filteredList.reduce((acc, val) => {
      const selectedRunnerDetails = val.runners.find(runner => runner.user === selectedRunner);
      const tagsFromRunner = selectedRunnerDetails.tags;
      tagsFromRunner.forEach((tag) => {
        if (acc.indexOf(tag) === -1) {
          acc.push(tag);
        }
      });
      return acc;
    }, []);
    tagList.sort((a, b) => {
      return a.localeCompare(b, language);
    });
    return tagList;
  });

  // update a prop in EventComments to trigger refresh of Collapse component to new size
  requestRefreshCollapseEventComments = () => {
    const { refreshCollapseEventComments } = this.state;
    this.setState({ refreshCollapseEventComments: refreshCollapseEventComments + 1 });
  }

  // update a prop in EventDetails to trigger refresh of Collapse component to new size
  requestRefreshCollapseEventDetails = () => {
    const { refreshCollapseEventDetails } = this.state;
    this.setState({ refreshCollapseEventDetails: refreshCollapseEventDetails + 1 });
  }

  // update a prop in EventResults to trigger refresh of Collapse component to new size
  requestRefreshCollapseEventResults = () => {
    const { refreshCollapseEventResults } = this.state;
    this.setState({ refreshCollapseEventResults: refreshCollapseEventResults + 1 });
  }

  // update a prop in RunnerDetails to trigger refresh of Collapse component to new size
  requestRefreshCollapseRunnerDetails = () => {
    const { refreshCollapseRunnerDetails } = this.state;
    this.setState({ refreshCollapseRunnerDetails: refreshCollapseRunnerDetails + 1 });
  }

  // render EventRunners component
  renderEventRunners = () => {
    const {
      oevent,
      user,
      addEventRunner,
      addEventRunnerOris,
      setEventViewModeRunner,
      selectEventIdMapView,
      selectRunnerToDisplay,
    } = this.props;
    const {
      details,
      errorMessage,
      selectedEventIdMapView,
      selectedRunner,
    } = oevent;
    const { current } = user;

    const currentUserId = this.getCurrentUserId(current);
    const currentUserOrisId = this.getCurrentUserOrisId(current);
    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
    const handleSelectEventRunner = (eventId, userId) => {
      selectEventIdMapView(eventId);
      setEventViewModeRunner('view');
      selectRunnerToDisplay(userId);
    };

    return (
      <EventRunners
        addEventRunner={addEventRunner} // prop
        addEventRunnerOris={addEventRunnerOris} // prop
        currentUserId={currentUserId} // derived
        currentUserOrisId={currentUserOrisId} // derived
        handleSelectEventRunner={handleSelectEventRunner} // defined here
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
        selectEventId={selectEventIdMapView} // prop
        selectRunnerToDisplay={selectRunnerToDisplay} // prop
      />
    );
  }

  // render EventRunnerDetails, EventRunnerEdit or EventRunnerDelete components as required
  renderEventRunnerDetails = () => {
    const { refreshCollapseRunnerDetails } = this.state;
    const {
      config,
      oevent,
      user,
      deleteEventRunner,
      selectUserToDisplay,
      setEventViewModeRunner,
      setUserViewMode,
      updateEventRunner,
    } = this.props;
    const { language } = config;
    const {
      details,
      errorMessage,
      list,
      runnerMode,
      selectedEventIdMapView,
      selectedRunner,
    } = oevent;
    const { current, list: userList } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
    const canEdit = this.getCanEditRunner(current, selectedRunner);
    const tagList = this.getPersonalTagList(list, selectedRunner, language);
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
            canEdit={canEdit} // derived
            language={language} // prop (config)
            refreshCollapse={refreshCollapseRunnerDetails} // state (value increments to trigger)
            requestRefreshCollapse={this.requestRefreshCollapseRunnerDetails} // defined here
            selectedEvent={selectedEvent} // derived
            selectedRunner={selectedRunner} // prop (oevent)
            selectUserToDisplay={selectUserToDisplay} // prop
            setEventViewModeRunner={setEventViewModeRunner} // prop
            setUserViewMode={setUserViewMode} // prop
            userList={userList} // prop (user)
          />
        );
      case 'edit':
        return (
          <EventRunnerEdit
            language={language} // prop (config)
            selectedEvent={selectedEvent} // derived
            selectedRunner={selectedRunner} // prop (oevent)
            setEventViewModeRunner={setEventViewModeRunner} // prop
            tagList={tagList} // derived
            updateEventRunner={updateEventRunner} // prop
          />
        );
      case 'delete':
        return (
          <EventRunnerDelete
            deleteEventRunner={deleteEventRunner} // prop
            language={language} // prop (config)
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
    const { refreshCollapseEventDetails } = this.state;
    const {
      club,
      config,
      oevent,
      user,
      deleteEvent,
      getEventList,
      getEventLinkList,
      setEventViewModeEvent,
      updateEvent,
    } = this.props;
    const {
      details,
      errorMessage,
      eventModeMapView,
      linkList,
      list,
      selectedEventIdMapView,
    } = oevent;
    const { details: clubDetails, list: clubList } = club;
    const { language } = config;
    const { current, list: userList } = user;
    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
    const isAdmin = this.getIsAdmin(current);
    const canEdit = this.getCanEditEvent(current, selectedEvent);
    const organisingClubs = this.getOrganisingClubs(selectedEvent, clubDetails);
    const tagList = this.getEventTagList(list, language);

    switch (eventModeMapView) {
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
            refreshCollapse={refreshCollapseEventDetails} // state (value increments to trigger)
            requestRefreshCollapse={this.requestRefreshCollapseEventDetails} // defined here
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
            eventMode={eventModeMapView} // prop (oevent)
            getEventList={getEventList} // prop
            isAdmin={isAdmin} // derived
            language={language} // prop (config)
            selectedEvent={selectedEvent} // derived
            setEventViewModeEvent={setEventViewModeEvent} // prop
            tagList={tagList} // derived
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
      // getEventById,
      getEventLinkList,
      getEventList,
      selectEventIdMapView,
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
      // linkDetails,
      linkList,
      selectedEventIdMapView,
      selectedEventLinkId,
    } = oevent;
    const { current } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
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
                  language={language} // prop (config)
                  link={link} // derived (selectedEvent)
                  linkList={linkList} // prop (oevent)
                  // linkDetails={linkDetails} // prop (oevent)
                  selectedEvent={selectedEvent} // derived
                  selectEvent={selectEventIdMapView} // prop
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
              // getEventById={getEventById} // prop
              getEventLinkList={getEventLinkList} // prop
              getEventList={getEventList} // prop
              language={language} // prop (config)
              // linkDetails={linkDetails} // prop (oevent)
              linkList={linkList} // prop (oevent)
              selectedEvent={selectedEvent} // derived
              // selectedEventDetails={selectedEventDetails} // prop (oevent)
              // selectedEventIdMapView={selectedEventIdMapView} // prop (oevent)
              selectedEventLinkId={selectedEventLinkId} // prop (oevent)
              setEventViewModeEventLink={setEventViewModeEventLink} // prop
              updateEventLink={updateEventLink} // prop
            />
          )
          : null}
      </div>
    );
  }

  // render EventComments component (self-contained with add/edit/delete)
  renderEventComments = () => {
    const { refreshCollapseEventComments } = this.state;
    const {
      deleteComment,
      oevent,
      postComment,
      updateComment,
      user,
    } = this.props;
    const {
      details,
      errorMessage,
      selectedEventIdMapView,
      selectedRunner,
    } = oevent;

    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
    const { current } = user;

    return (
      <EventComments
        currentUser={current} // prop (user) - can user post, edit, delete?
        deleteComment={deleteComment} // prop
        postComment={postComment} // prop
        refreshCollapse={refreshCollapseEventComments} // state (value increments to trigger)
        requestRefreshCollapse={this.requestRefreshCollapseEventComments} // defined here
        updateComment={updateComment} // prop
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
      />
    );
  }

  // render EventMapViewer component (self-contained with add/replace/delete maps)
  renderEventMapViewer = () => {
    const {
      oevent,
      user,
      deleteMap,
      postMap,
      selectMapToDisplay,
      setMapViewParameters,
      updateEventRunner,
    } = this.props;
    const {
      details,
      errorMessage,
      mapViewParameters,
      selectedEventIdMapView,
      selectedRunner,
      selectedMap,
    } = oevent;
    const { current } = user;

    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);
    const canEdit = this.getCanEditRunner(current, selectedRunner);

    return (
      <EventMapViewer
        canEdit={canEdit} // derived
        selectedEvent={selectedEvent} // derived
        selectedRunner={selectedRunner} // prop (oevent)
        selectedMap={selectedMap} // prop (oevent)
        deleteMap={deleteMap} // prop
        mapViewParameters={mapViewParameters} // prop (oevent)
        postMap={postMap} // prop
        selectMapToDisplay={selectMapToDisplay} // prop
        setMapViewParameters={setMapViewParameters} // prop
        updateEventRunner={updateEventRunner} // prop
      />
    );
  }

  // render EventResults component (self-contained with add/edit/delete)
  // *** consider whether add/edit might need wider screen? ***
  renderEventResults = () => { // simple viewer done, not editable yet
    const { refreshCollapseEventResults } = this.state;
    const { config, oevent } = this.props;
    const { language } = config;
    const {
      details,
      errorMessage,
      selectedEventIdMapView,
      selectedRunner,
    } = oevent;

    const selectedEvent = this.getSelectedEvent(details, selectedEventIdMapView, errorMessage);

    return (
      <EventResults
        language={language} // prop (config)
        refreshCollapse={refreshCollapseEventResults} // state (value increments to trigger)
        requestRefreshCollapse={this.requestRefreshCollapseEventResults} // defined here
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
    // console.log('state in MapView:', this.state);
    const { oevent } = this.props;
    const { selectedEventIdMapView } = oevent;
    if (!selectedEventIdMapView) {
      // console.log('no event selected, redirecting to events list');
      return <Redirect to="/events" />;
    }
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="sixteen wide column">
          {this.renderEventMapViewer()}
        </div>
        <div className="eight wide column">
          {this.renderEventDetails()}
          {this.renderEventRunners()}
          {this.renderLinkedEvents()}
        </div>
        <div className="eight wide column">
          {this.renderEventRunnerDetails()}
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
  addEventRunner: addEventRunnerAction,
  addEventRunnerOris: addEventRunnerOrisAction,
  cancelEventError: cancelEventErrorAction,
  createEventLink: createEventLinkAction,
  deleteComment: deleteCommentAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
  deleteEventRunner: deleteEventRunnerAction,
  deleteMap: deleteMapAction,
  getEventById: getEventByIdAction,
  getEventLinkList: getEventLinkListAction,
  getEventList: getEventListAction,
  // getUserById: getUserByIdAction,
  postComment: postCommentAction,
  postMap: postMapAction,
  selectEventIdMapView: selectEventIdMapViewAction,
  selectMapToDisplay: selectMapToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  selectUserToDisplay: selectUserToDisplayAction,
  setEventViewModeEvent: setEventViewModeEventMapViewAction,
  setEventViewModeEventLink: setEventViewModeEventLinkAction,
  setEventViewModeRunner: setEventViewModeRunnerAction,
  setMapViewParameters: setMapViewParametersAction,
  setUserViewMode: setUserViewModeAction,
  updateComment: updateCommentAction,
  updateEvent: updateEventAction,
  updateEventLink: updateEventLinkAction,
  updateEventRunner: updateEventRunnerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
