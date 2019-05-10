import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
// import { withRouter } from 'react-router-dom';
// import Collapse from '../Collapse';
import EventLinkedList from './EventLinkedList';
import EventLinkedEdit from './EventLinkedEdit';
import EventLinkedDelete from './EventLinkedDelete';

class EventLinkedManage extends Component {
  state = {
    showEventLinkedList: false,
  };

  static propTypes = {
    createEventLink: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    eventLinkMode: PropTypes.string,
    eventList: PropTypes.arrayOf(PropTypes.any),
    getEventById: PropTypes.func.isRequired,
    getEventLinkList: PropTypes.func.isRequired,
    getEventList: PropTypes.func.isRequired,
    linkDetails: PropTypes.objectOf(PropTypes.any),
    linkList: PropTypes.arrayOf(PropTypes.any),
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedEventDetails: PropTypes.string,
    selectedEventDisplay: PropTypes.string,
    selectedEventLink: PropTypes.string,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventLinkMode: 'view',
    eventList: [],
    linkDetails: {},
    linkList: [],
    selectedEvent: {},
    selectedEventDetails: '',
    selectedEventDisplay: '',
    selectedEventLink: '',
  };

  renderEventLinkedList = () => {
    const {
      linkList,
      setEventViewModeEventLink,
    } = this.props;
    return (
      <EventLinkedList
        linkList={linkList}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderEventLinkedAdd = () => {
    const {
      createEventLink,
      eventLinkMode,
      eventList,
      getEventById,
      getEventLinkList,
      getEventList,
      linkDetails,
      linkList,
      selectedEventDetails,
      selectedEventDisplay,
      setEventViewModeEventLink,
    } = this.props;
    return (
      <EventLinkedEdit
        createEventLink={createEventLink}
        eventLinkMode={eventLinkMode}
        eventList={eventList}
        getEventById={getEventById}
        getEventLinkList={getEventLinkList}
        getEventList={getEventList}
        linkDetails={linkDetails}
        linkList={linkList}
        selectedEventDetails={selectedEventDetails}
        selectedEventDisplay={selectedEventDisplay}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderEventLinkedEdit = () => {
    const {
      eventLinkMode,
      eventList,
      getEventById,
      getEventLinkList,
      getEventList,
      linkDetails,
      linkList,
      selectedEventDetails,
      selectedEventDisplay,
      selectedEventLink,
      setEventViewModeEventLink,
      updateEventLink,
    } = this.props;
    return (
      <EventLinkedEdit
        eventLinkMode={eventLinkMode}
        eventList={eventList}
        getEventById={getEventById}
        getEventLinkList={getEventLinkList}
        getEventList={getEventList}
        linkDetails={linkDetails}
        linkList={linkList}
        selectedEventDetails={selectedEventDetails}
        selectedEventDisplay={selectedEventDisplay}
        selectedEventLink={selectedEventLink}
        setEventViewModeEventLink={setEventViewModeEventLink}
        updateEventLink={updateEventLink}
      />
    );
  }

  renderEventLinkedDelete = () => {
    const {
      deleteEventLink,
      getEventById,
      getEventList,
      getEventLinkList,
      linkDetails,
      selectedEventDetails,
      selectedEventDisplay,
      selectedEventLink,
      setEventViewModeEventLink,
    } = this.props;
    return (
      <EventLinkedDelete
        deleteEventLink={deleteEventLink}
        getEventById={getEventById}
        getEventLinkList={getEventLinkList}
        getEventList={getEventList}
        linkDetails={linkDetails}
        selectedEventDetails={selectedEventDetails}
        selectedEventDisplay={selectedEventDisplay}
        selectedEventLink={selectedEventLink}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderAddButton = () => {
    const { setEventViewModeEventLink } = this.props;
    return (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => setEventViewModeEventLink('add')}
      >
        <Trans>Add a new link between events</Trans>
      </button>
    );
  }

  renderShowHideListButton = () => {
    const { showEventLinkedList } = this.state;
    const buttonClass = (showEventLinkedList)
      ? 'ui tiny button'
      : 'ui tiny primary button';
    const buttonText = (showEventLinkedList)
      ? <Trans>Hide event link list</Trans>
      : <Trans>Show event link list</Trans>;
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => this.setState({ showEventLinkedList: !showEventLinkedList })}
      >
        {buttonText}
      </button>
    );
  }

  render() {
    const {
      eventLinkMode,
      selectedEvent,
    } = this.props;
    const { showEventLinkedList } = this.state;
    const { _id: eventId } = selectedEvent;
    if (!eventId) return null;

    const titles = {
      view: <Trans>Manage linked events</Trans>,
      add: <Trans>Add new event link</Trans>,
      edit: <Trans>Edit event link</Trans>,
      delete: <Trans>Delete event link</Trans>,
    };
    const title = titles[eventLinkMode];

    return (
      <div className="ui segment">
        <h3 className="ui header">{title}</h3>
        {eventLinkMode === 'view'
          ? (
            <div>
              {(showEventLinkedList) ? this.renderEventLinkedList() : null}
              {this.renderShowHideListButton()}
              {this.renderAddButton()}
            </div>
          )
          : null}
        {eventLinkMode === 'add'
          ? this.renderEventLinkedAdd()
          : null}
        {eventLinkMode === 'edit'
          ? this.renderEventLinkedEdit()
          : null}
        {eventLinkMode === 'delete'
          ? this.renderEventLinkedDelete()
          : null}
      </div>
    );
  }
}

export default EventLinkedManage;
