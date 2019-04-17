import React from 'react';

const EventLinkedAdd = ({ setEventViewModeEventLink }) => {
  return (
    <div className="ui segment">
      <h3>EventLinkedAdd component</h3>
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

export default EventLinkedAdd;
