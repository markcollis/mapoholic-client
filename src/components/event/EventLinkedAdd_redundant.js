import React from 'react';
import PropTypes from 'prop-types';

const EventLinkedAdd = ({
  createEventLink,
  eventList,
  linkDetails,
  linkList,
  setEventViewModeEventLink,
}) => {
  return (
    <div className="ui segment">
      <h3>EventLinkedAdd component</h3>
      <p>To do</p>
      <button
        type="button"
        className="ui button right floated"
        onClick={() => setEventViewModeEventLink('view')}
      >
      Cancel
      </button>
    </div>
  );
};

EventLinkedAdd.propTypes = {
  createEventLink: PropTypes.func.isRequired,
  eventList: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkDetails: PropTypes.objectOf(PropTypes.any).isRequired,
  linkList: PropTypes.arrayOf(PropTypes.any).isRequired,
  setEventViewModeEventLink: PropTypes.func.isRequired,
};

export default EventLinkedAdd;
