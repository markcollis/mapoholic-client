import React from 'react';
import PropTypes from 'prop-types';

const UserChangeEmail = ({ hide }) => {
  return (
    <div>
      <h3 className="header">UserChangeEmail component</h3>
      <p>
      Not yet implemented on back end, to do later. Need to address issues with JWT auth token
      </p>
      <button
        type="button"
        className="ui button"
        onClick={() => hide()}
      >
      Cancel
      </button>
    </div>
  );
};

UserChangeEmail.propTypes = {
  hide: PropTypes.func.isRequired,
};

export default UserChangeEmail;
