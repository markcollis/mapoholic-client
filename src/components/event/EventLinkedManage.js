import React from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import Collapse from '../Collapse';
import EventLinkedAdd from './EventLinkedAdd';
import EventLinkedEdit from './EventLinkedEdit';
import EventLinkedDelete from './EventLinkedDelete';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventLinkedManage = ({
  eventLinkMode,
  selectedEvent,
  selectedEventLink,
  eventList,
  linkList,
  linkDetails,
  createEventLink,
  updateEventLink,
  deleteEventLink,
  // setEventViewModeEvent,
  setEventViewModeEventLink,
}) => {
  const { _id: eventId } = selectedEvent;
  console.log('selectedEvent:', selectedEvent);
  console.log('selectedEventLink:', selectedEventLink);
  if (!eventId) return null;

  const renderAddButton = (
    <button
      type="button"
      className="ui tiny primary right floated button"
      onClick={() => setEventViewModeEventLink('add')}
    >
      Add a new link between events
    </button>
  );

  switch (eventLinkMode) {
    case 'add':
      return (
        <div className="ui segment">
          <Collapse title="Manage linked events">
            <EventLinkedAdd
              eventList={eventList}
              linkList={linkList}
              linkDetails={linkDetails}
              setEventViewModeEventLink={setEventViewModeEventLink}
              createEventLink={createEventLink}
            />
          </Collapse>
        </div>
      );
    case 'edit':
      return (
        <div className="ui segment">
          <Collapse title="Manage linked events">
            <EventLinkedEdit
              setEventViewModeEventLink={setEventViewModeEventLink}
              selectedEventLink={selectedEventLink}
              linkDetails={linkDetails}
              updateEventLink={updateEventLink}
            />
          </Collapse>
        </div>
      );
    case 'delete':
      return (
        <div className="ui segment">
          <Collapse title="Manage linked events">
            <EventLinkedDelete
              setEventViewModeEventLink={setEventViewModeEventLink}
              selectedEventLink={selectedEventLink}
              deleteEventLink={deleteEventLink}
            />
          </Collapse>
        </div>
      );
    case 'view':
    default:
      return (
        <div className="ui segment">
          <Collapse title="Manage linked events">
            {renderAddButton}
          </Collapse>
        </div>
      );
  }
};
// {JSON.stringify(linkListDetails[linkId], null, 2)}

EventLinkedManage.propTypes = {
  eventLinkMode: PropTypes.string,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedEventLink: PropTypes.string,
  eventList: PropTypes.arrayOf(PropTypes.any),
  linkList: PropTypes.arrayOf(PropTypes.any),
  linkDetails: PropTypes.objectOf(PropTypes.any),
  createEventLink: PropTypes.func.isRequired,
  updateEventLink: PropTypes.func.isRequired,
  deleteEventLink: PropTypes.func.isRequired,
  // setEventViewModeEvent: PropTypes.func.isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};
EventLinkedManage.defaultProps = {
  eventLinkMode: 'view',
  selectedEvent: {},
  selectedEventLink: '',
  eventList: [],
  linkList: [],
  linkDetails: {},
};

export default EventLinkedManage;
