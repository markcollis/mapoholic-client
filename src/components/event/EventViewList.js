import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Collapse from '../Collapse';
import EventFilter from './EventFilter';
import EventList from './EventList';
import EventDetails from './EventDetails';
import EventRunners from './EventRunners';
import EventLinked from './EventLinked';
import EventEdit from './EventEdit';
import EventDelete from './EventDelete';
// import EventRunnerAdd from './EventRunnerAdd';
// import EventRunnerEdit from './EventRunnerEdit';
// import EventRunnerDelete from './EventRunnerDelete';

import {
  getClubListAction,
  createEventAction,
  createEventLinkAction,
  addEventRunnerAction,
  createEventOrisAction,
  getEventListAction,
  getEventLinkListAction,
  getEventListOrisAction,
  getEventByIdAction,
  setEventSearchFieldAction,
  setEventViewModeEventAction,
  setEventViewModeRunnerAction,
  // setEventViewModeCourseMapAction,
  // setEventViewModeCommentAction,
  selectEventForDetailsAction,
  selectEventToDisplayAction,
  selectRunnerToDisplayAction,
  // selectMapToDisplayAction,
} from '../../actions';
/* eslint no-underscore-dangle: 0 */

class EventViewList extends Component {
  static propTypes = {
    club: PropTypes.objectOf(PropTypes.any).isRequired,
    oevent: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    getClubList: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
    createEventLink: PropTypes.func.isRequired,
    addEventRunner: PropTypes.func.isRequired,
    createEventOris: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventListOris: PropTypes.func.isRequired,
    getEventById: PropTypes.func.isRequired,
    setEventSearchField: PropTypes.func.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
    setEventViewModeRunner: PropTypes.func.isRequired,
    // setEventViewModeCourseMap: PropTypes.func.isRequired,
    // setEventViewModeComment: PropTypes.func.isRequired,
    selectEventForDetails: PropTypes.func.isRequired,
    selectEventToDisplay: PropTypes.func.isRequired,
    selectRunnerToDisplay: PropTypes.func.isRequired,
    // selectMapToDisplay: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      club,
      oevent,
      getClubList,
      getEventList,
      getEventLinkList,
    } = this.props;
    const { list: clubList } = club;
    const { list, linkList } = oevent;
    if (!clubList) getClubList();
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
      user,
      oevent,
      getEventList,
      getEventById,
      setEventViewModeEvent,
      setEventViewModeRunner,
      selectEventForDetails,
      selectEventToDisplay,
      selectRunnerToDisplay,
    } = this.props;
    const {
      // searchField,
      // eventView,
      eventMode,
      runnerMode,
      list,
      details,
      linkList,
      linkListDetails,
      selectedEventDetails,
      errorMessage,
    } = oevent;
    const { current } = user;
    const { details: clubDetails } = club;
    console.log('oevent:', oevent);
    console.log('current:', current);
    if (selectedEventDetails && !details[selectedEventDetails] && !errorMessage) {
      setTimeout(() => getEventById(selectedEventDetails), 1000); // simulate network delay
    }
    const selectedEvent = details[selectedEventDetails] || {};
    console.log('selectedEvent:', selectedEvent);
    const runnerList = (selectedEvent.runners)
      ? selectedEvent.runners.map(runner => runner.user.toString())
      : [];
    console.log('runnerList:', runnerList);
    const organisingClubs = (selectedEvent.organisedBy)
      ? selectedEvent.organisedBy.map(organisingClub => clubDetails[organisingClub._id])
      : [];
    console.log('organisingClubs:', organisingClubs);
    const isAdmin = (current && current.role === 'admin');
    const isRunner = (current && selectedEvent
      && runnerList.includes(current._id.toString()));
    const canEdit = (isAdmin || isRunner);
    console.log('isAdmin, isRunner, canEdit:', isAdmin, isRunner, canEdit);

    switch (eventMode) {
      case 'none':
        return (
          <div className="eight wide column">
            <div className="ui segment">
              <p>Select an event from the list to show further details here</p>
            </div>
          </div>
        );
      case 'view':
        return (
          <div className="eight wide column">
            <EventDetails
              selectedEvent={selectedEvent}
              organisingClubs={organisingClubs}
              canEdit={canEdit}
              setEventViewModeEvent={setEventViewModeEvent}
            />
            <EventRunners
              selectedEvent={selectedEvent}
              runnerMode={runnerMode}
              setEventViewModeRunner={setEventViewModeRunner}
              selectEventToDisplay={selectEventToDisplay}
              selectRunnerToDisplay={selectRunnerToDisplay}
            />
            <EventLinked
              linkList={linkList}
              linkListDetails={linkListDetails}
              selectEventForDetails={selectEventForDetails}
            />
          </div>
        );
      case 'edit':
        return (
          <div className="eight wide column">
            <EventEdit // same form component handles both create and update
              isAdmin={isAdmin}
              selectedEvent={selectedEvent}
              /* updateEvent={updateEvent} */
              /* setEventViewModeEvent={setEventViewModeEvent} */
              /* selectEventToDisplay={selectEventToDisplay} */
              getEventList={getEventList}
              eventList={(list) ? list.slice(0, -1) : []}
            />
            <EventRunners
              runnerMode={runnerMode}
            />
            <EventLinked />
          </div>
        );
      case 'add':
        return (
          <div className="eight wide column">
            <EventEdit // same form component handles both create and update
              isAdmin={isAdmin}
              selectedEvent={selectedEvent}
              /* createEvent={createEvent} */
              /* setEventViewModeEvent={setEventViewModeEvent} */
              /* selectEventToDisplay={selectEventToDisplay} */
              getEventList={getEventList}
              eventList={(list) ? list.slice(0, -1) : []}
            />
            <EventRunners
              runnerMode={runnerMode}
            />
            <EventLinked />
          </div>
        );
      case 'delete':
        return (
          <div className="eight wide column">
            <EventDelete
              selectedEvent={selectedEvent}
              /* deleteEvent={deleteEvent} */
              /* setEventViewModeEvent={setEventViewModeEvent} */
            />
            <EventRunners
              runnerMode={runnerMode}
            />
            <EventLinked />
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      oevent,
      getEventList,
      setEventSearchField,
      setEventViewModeEvent,
      selectEventForDetails,
    } = this.props;
    const {
      searchField,
      errorMessage,
    } = oevent;

    // need to consider reducing the number shown if there are many many events...
    const eventListArray = this.createEventListArray();
    if (errorMessage) {
      console.log('Error:', errorMessage);
    }
    const renderError = (errorMessage)
      ? (
        <div className="sixteen wide column">
          {(errorMessage) ? <div className="ui error message">{`Error: ${errorMessage}`}</div> : null}
        </div>
      )
      : null;
    return (
      <div className="ui vertically padded stackable grid">
        {renderError}
        <div className="eight wide column">
          <EventFilter
            searchField={searchField}
            setEventSearchField={setEventSearchField}
            setEventViewModeEvent={setEventViewModeEvent}
            getEventList={getEventList}
            selectEventForDetails={selectEventForDetails}
          />
          <div style={{ maxHeight: '50em', overflowY: 'auto' }}>
            <EventList
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

const mapStateToProps = ({ club, user, oevent }) => {
  return { club, user, oevent };
};
const mapDispatchToProps = {
  getClubList: getClubListAction,
  createEvent: createEventAction,
  createEventLink: createEventLinkAction,
  addEventRunner: addEventRunnerAction,
  createEventOris: createEventOrisAction,
  getEventList: getEventListAction,
  getEventLinkList: getEventLinkListAction,
  getEventListOris: getEventListOrisAction,
  getEventById: getEventByIdAction,
  setEventSearchField: event => setEventSearchFieldAction(event.target.value),
  setEventViewModeEvent: setEventViewModeEventAction,
  setEventViewModeRunner: setEventViewModeRunnerAction,
  // setEventViewModeCourseMap: setEventViewModeCourseMapAction,
  // setEventViewModeComment: setEventViewModeCommentAction,
  selectEventForDetails: selectEventForDetailsAction,
  selectEventToDisplay: selectEventToDisplayAction,
  selectRunnerToDisplay: selectRunnerToDisplayAction,
  // selectMapToDisplay: selectMapToDisplayAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventViewList);
