import React from 'react';
import Collapse from '../Collapse';

const UserRecent = () => {
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title="Recent activity">
          <div>
          Populate later with a summary of recent activity (i.e. most recent maps, possibly comments?)
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default UserRecent;
