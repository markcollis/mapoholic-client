import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import HomeAdminActivity from './HomeAdminActivity';
import HomeAdminNotes from './HomeAdminNotes';
import HomeAdminLogging from './HomeAdminLogging';

// The HomeAdminPanel component renders additional information for administrative users
const HomeAdminPanel = ({
  activityList,
  language,
  refreshCollapse,
  requestRefreshCollapse,
}) => {
  return (
    <div className="ui segment">
      <h3><Trans>Additional information for administrators</Trans></h3>
      <hr className="home-admin-panel__divider" />
      <HomeAdminLogging />
      <hr className="home-admin-panel__divider" />
      <HomeAdminActivity
        activityList={activityList}
        language={language}
        refreshCollapse={refreshCollapse}
        requestRefreshCollapse={requestRefreshCollapse}
      />
      <hr className="home-admin-panel__divider" />
      <HomeAdminNotes />
    </div>
  );
};

HomeAdminPanel.propTypes = {
  activityList: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string.isRequired,
  refreshCollapse: PropTypes.number.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
};
HomeAdminPanel.defaultProps = {
  activityList: [],
};

export default HomeAdminPanel;
