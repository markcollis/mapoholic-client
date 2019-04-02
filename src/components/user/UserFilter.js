import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';

const UserFilter = ({
  searchField,
  setUserSearchField,
  getUserList,
}) => {
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title="Search for users">
          <div className="ui icon input fluid">
            <input
              type="search"
              placeholder="User search filter"
              onChange={setUserSearchField}
              value={searchField}
            />
            <i className="circular search icon" />
          </div>
          <div className="ui divider" />
          <div className="ui form">
            <button type="button" className="ui tiny button" onClick={() => getUserList()}>
              Refresh user list
            </button>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

UserFilter.propTypes = {
  searchField: PropTypes.string.isRequired,
  setUserSearchField: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};

export default UserFilter;
