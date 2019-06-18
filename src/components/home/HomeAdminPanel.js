import React from 'react';

import HomeAdminActivity from './HomeAdminActivity';
import HomeAdminNotes from './HomeAdminNotes';

const HomeAdminPanel = () => {
  return (
    <div className="ui segment">
      <h3>HomeAdminPanel component</h3>
      <HomeAdminActivity />
      <HomeAdminNotes />
    </div>
  );
};

export default HomeAdminPanel;
