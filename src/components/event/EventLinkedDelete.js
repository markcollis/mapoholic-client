import React from 'react';

const EventLinkedDelete = ({ setEventViewModeEventLink }) => {
  return (
    <div className="ui segment">
      <h3>EventLinkedDelete component</h3>
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

export default EventLinkedDelete;
