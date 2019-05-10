import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import EventFilter from './EventFilter';
import EventList from './EventList';
import EventDetails from './EventDetails';
import EventRunners from './EventRunners';
import EventLinked from './EventLinked';
import EventLinkedManage from './EventLinkedManage';
import EventEdit from './EventEdit';
import EventDelete from './EventDelete';

import {
  getClubListAction,
  getUserListAction,
  createEventAction,
  createEventLinkAction,
  addEventRunnerAction,
  addEventRunnerOrisAction,
  createEventOrisAction,
  getEventListAction,
  getEventLinkListAction,
  getEventListOrisAction,
  getEventByIdAction,
  updateEventAction,
  // updateEventRunnerAction,
  updateEventLinkAction,
  deleteEventAction,
  deleteEventLinkAction,
  setEventSearchFieldAction,
  setEventViewModeEventAction,
  setEventViewModeEventLinkAction,
  // setEventViewModeRunnerAction,
  // setEventViewModeCourseMapAction,
  // setEventViewModeCommentAction,
  selectEventForDetailsAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  // selectMapToDisplayAction,
  cancelEventErrorAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

import { testOrisList } from '../data';

class EventViewList extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    getClubList: PropTypes.func.isRequired,
    getUserList: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    addEventRunner: PropTypes.func.isRequired,
    addEventRunnerOris: PropTypes.func.isRequired,
    createEventOris: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    // getEventListOris: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    // updateEventRunner: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    clearEventSearchField: PropTypes.func.isRequired,
    setEventSearchField: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    // setEventViewModeRunner: PropTypes.func.isRequired,
    // setEventViewModeCourseMap: PropTypes.func.isRequired,
    // setEventViewModeComment: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    // selectMapToDisplay: PropTypes.func.isRequired,
    cancelEventError: PropTypes.func.isRequired,
  }

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
    const { list, linkList } = oevent;
    if (!clubList) getClubList();
    if (!userList) getUserList();
    if (!list) getEventList();
    if (!linkList) getEventLinkList();
  }

  createEventListArray() {
    const { oevent } = this.props;
    const { list, searchField } = oevent;
    if (!list) return [];
    return list.slice(0, -1).filter((eachEvent) => {
      const {
        date,
        name,
        mapName,
        locPlace,
        locCountry,
        organisedBy,
        types,
        tags,
      } = eachEvent;
      const reformattedDate = date.slice(8)
        .concat('/')
        .concat(date.slice(5, 7))
        .concat('/')
        .concat(date.slice(0, 4));
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
  }

  renderRightColumn() {
    const {
      club,
      config,
      user,
      oevent,
      addEventRunner,
      addEventRunnerOris,
      createEvent,
      createEventOris,
      createEventLink,
      getEventList,
      getEventLinkList,
      getEventById,
      updateEvent,
      updateEventLink,
      deleteEvent,
      deleteEventLink,
      setEventViewModeEvent,
      setEventViewModeEventLink,
      selectEventForDetails,
      selectEventToDisplay,
      selectRunnerToDisplay,
    } = this.props;
    const {
      details,
      errorMessage,
      eventLinkMode,
      eventMode,
      linkDetails,
      linkList,
      list,
      runnerMode,
      selectedEventDetails,
      selectedEventDisplay,
      selectedEventLink,
    } = oevent;
    const orisList = testOrisList;
    const { current, list: userList } = user;
    const { language } = config;
    // console.log('userList:', userList);
    const currentUserId = (current) ? current._id.toString() : null;
    const currentUserOrisId = (current) ? current.orisId : null;
    const { details: clubDetails, list: clubList } = club;
    console.log('oevent:', oevent);
    // console.log('current:', current);
    if (selectedEventDetails && !details[selectedEventDetails] && !errorMessage) {
      getEventById(selectedEventDetails);
    }
    // if (selectedEventDetails && !details[selectedEventDetails] && !errorMessage) {
    //   setTimeout(() => getEventById(selectedEventDetails), 1000); // simulate network delay
    // }
    const selectedEvent = details[selectedEventDetails] || {};
    console.log('selectedEvent:', selectedEvent);
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user.toString())
      : [];
    // console.log('runnerList:', runnerList);
    const organisingClubs = (selectedEvent.organisedBy)
      ? selectedEvent.organisedBy.map(organisingClub => clubDetails[organisingClub._id])
      : [];
    // console.log('organisingClubs:', organisingClubs);
    const isAdmin = (current && current.role === 'admin');
    const isRunner = (current && selectedEvent
      && runnerList.includes(currentUserId));
    const canEdit = (isAdmin || isRunner);
    // console.log('isAdmin, isRunner, canEdit:', isAdmin, isRunner, canEdit);

    const renderEventRunners = (
      <EventRunners
        currentUserId={currentUserId}
        currentUserOrisId={currentUserOrisId}
        selectedEvent={selectedEvent}
        runnerMode={runnerMode}
        addEventRunner={addEventRunner}
        addEventRunnerOris={addEventRunnerOris}
        selectEventToDisplay={selectEventToDisplay}
        selectRunnerToDisplay={selectRunnerToDisplay}
      />
    );

    const renderEventLinked = (selectedEvent.linkedTo && selectedEvent.linkedTo.length > 0)
      ? (
        <div>
          {selectedEvent.linkedTo.map((link) => {
            return (
              <EventLinked
                key={link._id}
                isAdmin={isAdmin}
                canEdit={canEdit}
                eventLinkMode={eventLinkMode}
                selectedEvent={selectedEvent}
                link={link}
                linkDetails={linkDetails}
                selectEventForDetails={selectEventForDetails}
                setEventViewModeEvent={setEventViewModeEvent}
                setEventViewModeEventLink={setEventViewModeEventLink}
              />
            );
          })}
        </div>
      )
      : null;

    const renderEventLinkedManage = (
      <EventLinkedManage
        eventLinkMode={eventLinkMode}
        selectedEvent={selectedEvent}
        selectedEventDetails={selectedEventDetails}
        selectedEventDisplay={selectedEventDisplay}
        selectedEventLink={selectedEventLink}
        eventList={(list) ? list.slice(0, -1) : []} // prop (oevent)
        linkList={(linkList) ? linkList.slice(0, -1) : []} // prop (oevent)
        linkDetails={linkDetails}
        getEventById={getEventById}
        getEventLinkList={getEventLinkList}
        getEventList={getEventList}
        createEventLink={createEventLink}
        updateEventLink={updateEventLink}
        deleteEventLink={deleteEventLink}
        setEventViewModeEvent={setEventViewModeEvent}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );

    switch (eventMode) {
      case 'none':
        return (
          <div className="eight wide column">
            <div className="ui segment">
              <p><Trans>Select an event from the list to show further details here</Trans></p>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="eight wide column">
            <EventDetails
              canEdit={canEdit}
              language={language}
              organisingClubs={organisingClubs}
              selectedEvent={selectedEvent}
              setEventViewModeEvent={setEventViewModeEvent}
            />
            {renderEventRunners}
            {renderEventLinked}
            {(current) ? renderEventLinkedManage : null}
          </div>
        );
      case 'edit':
        return (
          <div className="eight wide column">
            <EventEdit // same form component handles both create and update
              language={language}
              isAdmin={isAdmin}
              eventMode={eventMode}
              selectedEvent={selectedEvent}
              updateEvent={updateEvent}
              setEventViewModeEvent={setEventViewModeEvent}
              getEventList={getEventList}
              eventList={(list) ? list.slice(0, -1) : []}
              eventLinkList={(linkList) ? linkList.slice(0, -1) : []}
              userList={(userList) ? userList.slice(0, -1) : []}
              clubList={(clubList) ? clubList.slice(0, -1) : []}
            />
            {renderEventRunners}
            {renderEventLinked}
            {renderEventLinkedManage}
          </div>
        );
      case 'add':
        console.log('orisList prop for EventEdit:', orisList);
        return (
          <div className="eight wide column">
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
              orisList={orisList || []}
            />
            {renderEventRunners}
            {renderEventLinked}
            {renderEventLinkedManage}
          </div>
        );
      case 'delete':
        return (
          <div className="eight wide column">
            <EventDelete
              selectedEvent={selectedEvent}
              selectedEventDisplay={selectedEventDisplay}
              deleteEvent={deleteEvent}
              getEventList={getEventList}
              getEventLinkList={getEventLinkList}
              setEventViewModeEvent={setEventViewModeEvent}
              selectEventForDetails={selectEventForDetails}
              selectEventToDisplay={selectEventToDisplay}
            />
            {renderEventRunners}
            {renderEventLinked}
            {renderEventLinkedManage}
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      config,
      oevent,
      user,
      getEventList,
      // getEventListOris,
      clearEventSearchField,
      setEventSearchField,
      setEventViewModeEvent,
      selectEventForDetails,
      cancelEventError,
    } = this.props;
    const { searchField, errorMessage } = oevent;
    // const { searchField, errorMessage, orisList } = oevent;
    const { language } = config;
    const { current } = user;
    // populate ORIS event list when rendered with a current user for the first time
    // if (!orisList && current && current.orisId !== '') getEventListOris();

    // need to consider reducing the number shown if there are many many events...
    const eventListArray = this.createEventListArray();
    if (errorMessage) {
      console.log('Error:', errorMessage);
    }
    const renderError = (errorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage)
            ? (
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
            )
            : null}
        </div>
      )
      : null;
    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="eight wide column">
          <EventFilter
            currentUser={current}
            searchField={searchField}
            clearEventSearchField={clearEventSearchField}
            setEventSearchField={setEventSearchField}
            setEventViewModeEvent={setEventViewModeEvent}
            getEventList={getEventList}
            selectEventForDetails={selectEventForDetails}
          />
          <div style={{ maxHeight: '50em', overflowY: 'auto' }}>
            <EventList
              language={language}
              events={eventListArray}
              selectEventForDetails={selectEventForDetails}
              setEventViewModeEvent={setEventViewModeEvent}
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
  getClubList: getClubListAction,
  getUserList: getUserListAction,
  createEvent: createEventAction,
  createEventLink: createEventLinkAction,
  addEventRunner: addEventRunnerAction,
  addEventRunnerOris: addEventRunnerOrisAction,
  createEventOris: createEventOrisAction,
  getEventList: getEventListAction,
  getEventLinkList: getEventLinkListAction,
  getEventListOris: getEventListOrisAction,
  getEventById: getEventByIdAction,
  updateEvent: updateEventAction,
  // updateEventRunner: updateEventRunnerAction,
  updateEventLink: updateEventLinkAction,
  deleteEvent: deleteEventAction,
  deleteEventLink: deleteEventLinkAction,
  clearEventSearchField: () => setEventSearchFieldAction(''),
  setEventSearchField: event => setEventSearchFieldAction(event.target.value),
  setEventViewModeEvent: setEventViewModeEventAction,
  setEventViewModeEventLink: setEventViewModeEventLinkAction,
  // setEventViewModeRunner: setEventViewModeRunnerAction,
  // setEventViewModeCourseMap: setEventViewModeCourseMapAction,
  // setEventViewModeComment: setEventViewModeCommentAction,
  selectEventForDetails: selectEventForDetailsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  // selectMapToDisplay: selectMapToDisplayAction,
  cancelEventError: cancelEventErrorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventViewList);
