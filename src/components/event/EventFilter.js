import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';

const eventFilter = ({
  searchField,
  setEventSearchField,
  setEventViewModeEvent,
  selectEventForDetails,
  getEventList,
}) => {
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title="Search for events">
          <div className="ui icon input fluid">
            <input
              type="search"
              placeholder="Event search filter"
              onChange={setEventSearchField}
              value={searchField}
            />
            <i className="circular search icon" />
          </div>
          <div className="ui divider" />
          <button type="button" className="ui tiny button" onClick={() => getEventList()}>
            Refresh list
          </button>
          <button
            type="button"
            className="ui tiny right floated button"
            onClick={() => {
              selectEventForDetails('');
              setEventViewModeEvent('add');
            }}
          >
            Add new event
          </button>
        </Collapse>
      </div>
    </div>
  );
};

eventFilter.propTypes = {
  searchField: PropTypes.string.isRequired,
  setEventSearchField: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  getEventList: PropTypes.func.isRequired,
};

export default eventFilter;
