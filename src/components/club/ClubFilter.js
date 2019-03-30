import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';

const ClubFilter = ({
  searchField,
  setClubSearchField,
  setClubViewMode,
  selectClubToDisplay,
  getClubList,
}) => {
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title="Search for clubs">
          <div className="ui icon input fluid">
            <input
              type="search"
              placeholder="Club search filter"
              onChange={setClubSearchField}
              value={searchField}
            />
            <i className="circular search icon" />
          </div>
          <div className="ui divider" />
          <button type="button" className="ui tiny button" onClick={() => getClubList()}>
            Refresh list
          </button>
          <button
            type="button"
            className="ui tiny right floated button"
            onClick={() => {
              selectClubToDisplay('');
              setClubViewMode('add');
            }}
          >
            Add new club
          </button>
        </Collapse>
      </div>
    </div>
  );
};

ClubFilter.propTypes = {
  searchField: PropTypes.string.isRequired,
  setClubSearchField: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
  selectClubToDisplay: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
};

export default ClubFilter;
