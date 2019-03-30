import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';

const UserRecent = ({ userId }) => {
  if (userId === '') {
    return null;
  }
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title="Recent activity">
          <div>
            {`This will show a list of recent maps for ${userId}.`}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

UserRecent.propTypes = {
  userId: PropTypes.string,
};
UserRecent.defaultProps = {
  userId: '',
};

export default UserRecent;
