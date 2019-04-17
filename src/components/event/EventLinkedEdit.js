import React from 'react';

const EventLinkedEdit = ({ setEventViewModeEventLink }) => {
  return (
    <div className="ui segment">
      <h3>EventLinkedEdit component</h3>
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

export default EventLinkedEdit;
