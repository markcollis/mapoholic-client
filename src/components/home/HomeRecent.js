import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import HomeRecentListItem from './HomeRecentListItem';
import Collapse from '../generic/Collapse';

// The HomeRecent component renders a short list of recent activity on the site,
// either a user's own or for all users
const HomeRecent = ({
  activityList,
  isOwn,
  isAll,
  language,
  userList,
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
  let title = <Trans>Recent activity</Trans>;
  if (isAll) title = <Trans>All recent activity</Trans>;
  if (isOwn) title = <Trans>Your own recent activity</Trans>;
  const renderActivityList = activityList.map((activity) => {
    return (
      <HomeRecentListItem
        key={activity._id}
        activity={activity}
        language={language}
        userList={userList}
      />
    );
  });

  return (
    <div className="ui segment home-recent">
      <Collapse title={title} startHidden>
        <ul>
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
  userList: PropTypes.arrayOf(PropTypes.any),
};
HomeRecent.defaultProps = {
  activityList: null,
  isAll: false,
  isOwn: false,
  userList: null,
};

export default HomeRecent;
