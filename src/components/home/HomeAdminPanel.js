import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

// import Collapse from '../generic/Collapse';
import HomeAdminActivity from './HomeAdminActivity';
import HomeAdminNotes from './HomeAdminNotes';

const HomeAdminPanel = ({
  activityList,
  language,
  refreshCollapse,
  requestRefreshCollapse,
}) => {
  return (
    <div className="ui segment">
      <h3><Trans>Additional information for administrators</Trans></h3>
      <hr className="admin-panel-divider" />
      <HomeAdminActivity
        activityList={activityList}
        language={language}
        refreshCollapse={refreshCollapse}
        requestRefreshCollapse={requestRefreshCollapse}
      />
      <hr className="admin-panel-divider" />
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
