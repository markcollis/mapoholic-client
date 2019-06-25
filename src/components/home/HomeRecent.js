import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import HomeRecentListItem from './HomeRecentListItem';
import Collapse from '../Collapse';
// import { reformatTimestamp } from '../../common/conversions';

const HomeRecent = ({
  activityList,
  isOwn,
  isAll,
  language,
}) => {
  // activityList should only be null if it hasn't loaded yet
  if (!activityList) {
    return (
      <div className="ui segment">
        <p><Trans>Loading recent activity...</Trans></p>
      </div>
    );
  }
  // if there is an array but it is empty there is no relevant activity to show
  if (activityList.length === 0) {
    return (
      <div className="ui segment">
        <p><Trans>There has been no recent activity.</Trans></p>
      </div>
    );
  }
  // otherwise we need to create a list to display from the array
  let title = <Trans>Recent Activity</Trans>;
  if (isAll) title = <Trans>All Recent Activity</Trans>;
  if (isOwn) title = <Trans>Your Own Recent Activity</Trans>;

  const renderActivityList = activityList.map((activity) => {
    const { timestamp } = activity;
    return (
      <HomeRecentListItem key={timestamp} activity={activity} language={language} />
    );
  });

  return (
    <div className="ui segment">
      <Collapse title={title}>
        <ul className="recent-activity-list">
          {renderActivityList}
        </ul>
      </Collapse>
    </div>
  );
};

HomeRecent.propTypes = {
  activityList: PropTypes.arrayOf(PropTypes.object),
  isAll: PropTypes.bool,
  isOwn: PropTypes.bool,
  language: PropTypes.string.isRequired,
};
HomeRecent.defaultProps = {
  activityList: null,
  isAll: false,
  isOwn: false,
};

export default HomeRecent;
