import React from 'react';
import { Trans } from '@lingui/macro';

// import Collapse from '../Collapse';
import HomeAdminActivity from './HomeAdminActivity';
import HomeAdminNotes from './HomeAdminNotes';

const HomeAdminPanel = () => {
  return (
    <div className="ui segment">
      <h3><Trans>Additional information for administrators</Trans></h3>
      <hr className="admin-panel-divider" />
      <HomeAdminActivity />
      <hr className="admin-panel-divider" />
      <HomeAdminNotes />
    </div>
  );
};

export default HomeAdminPanel;
