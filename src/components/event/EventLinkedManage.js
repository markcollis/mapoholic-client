import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
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
  // console.log('selectedEvent:', selectedEvent);
  // console.log('selectedEventLink:', selectedEventLink);
  if (!eventId) return null;

  const renderAddButton = (
    <button
      type="button"
      className="ui tiny primary right floated button"
      onClick={() => setEventViewModeEventLink('add')}
    >
      <Trans>Add a new link between events</Trans>
    </button>
  );
  const title = {
    view: <Trans>Manage linked events</Trans>,
    add: <Trans>Add new event link</Trans>,
    edit: <Trans>Edit event link</Trans>,
    delete: <Trans>Delete event link</Trans>,
  };

  return (
    <div className="ui segment">
      <Collapse title={title[eventLinkMode]}>
        {eventLinkMode === 'view' ? renderAddButton : null}
        {eventLinkMode === 'add'
          ? (
            <EventLinkedAdd
              createEventLink={createEventLink}
              eventList={eventList}
              linkDetails={linkDetails}
              linkList={linkList}
              setEventViewModeEventLink={setEventViewModeEventLink}
            />
          )
          : null}
        {eventLinkMode === 'edit'
          ? (
            <EventLinkedEdit
              setEventViewModeEventLink={setEventViewModeEventLink}
              selectedEventLink={selectedEventLink}
              linkDetails={linkDetails}
              updateEventLink={updateEventLink}
            />
          )
          : null}
        {eventLinkMode === 'delete'
          ? (
            <EventLinkedDelete
              setEventViewModeEventLink={setEventViewModeEventLink}
              selectedEventLink={selectedEventLink}
              deleteEventLink={deleteEventLink}
            />
          )
          : null}
      </Collapse>
    </div>
  );
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
