import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';
import forest from '../../graphics/silhouette.jpg';

import HomeWelcome from './HomeWelcome';
import HomeRecent from './HomeRecent';
import HomeWhatIsIt from './HomeWhatIsIt';
import HomeHowToUse from './HomeHowToUse';
import HomeAboutAuthor from './HomeAboutAuthor';
import HomeAdminPanel from './HomeAdminPanel';

import {
  getActivityLogAdminAction,
  getActivityLogAllAction,
  getActivityLogOwnAction,
  cancelActivityErrorAction,
} from '../../actions';

class HomeView extends Component {
  static propTypes = {
    activity: PropTypes.objectOf(PropTypes.any).isRequired,
    auth: PropTypes.string,
    cancelActivityError: PropTypes.func.isRequired,
    currentUser: PropTypes.objectOf(PropTypes.any),
    eventList: PropTypes.arrayOf(PropTypes.any),
    getActivityLogAdmin: PropTypes.func.isRequired,
    getActivityLogAll: PropTypes.func.isRequired,
    getActivityLogOwn: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    userList: PropTypes.arrayOf(PropTypes.any),
  }

  static defaultProps = {
    auth: null,
    currentUser: null,
    eventList: null,
    userList: null,
  };

  state = {
    gettingActivityAdmin: false,
    gettingActivityAll: false,
    gettingActivityOwn: false,
    refreshCollapseAdminActivity: 0,
  };

  componentDidMount() {
    this.getActivityLists();
  }

  componentDidUpdate() {
    this.getActivityLists();
  }

  getActivityLists = () => {
    // console.log('state', this.state);
    const {
      gettingActivityAdmin,
      gettingActivityAll,
      gettingActivityOwn,
    } = this.state;
    const {
      activity,
      currentUser,
      getActivityLogAdmin,
      getActivityLogAll,
      getActivityLogOwn,
    } = this.props;
    const {
      activityAdmin,
      activityAll,
      activityOwn,
    } = activity;
    const DEFAULT_ACTIVITY_LENGTH = 10; // set here for now, could make config option later
    if (currentUser) {
      if (currentUser.role === 'admin') {
        if (!activityAdmin && !gettingActivityAdmin) {
          // console.log('getting complete activity log for admin');
          getActivityLogAdmin(null, (successful) => {
            if (successful) this.setState({ gettingActivityAdmin: false });
          });
          this.setState({ gettingActivityAdmin: true });
        }
      }
      if (currentUser.role === 'admin' || currentUser.role === 'standard') {
        if (!activityOwn && !gettingActivityOwn) {
          // console.log('getting activity log for current user');
          const { _id: userId } = currentUser;
          getActivityLogOwn(userId, DEFAULT_ACTIVITY_LENGTH, (successful) => {
            if (successful) this.setState({ gettingActivityOwn: false });
          });
          this.setState({ gettingActivityOwn: true });
        }
      }
      if (currentUser.role === 'guest' || currentUser.role === 'standard' || currentUser.role === 'admin') {
        if (!activityAll && !gettingActivityAll) {
          // console.log('getting activity log for all users');
          getActivityLogAll(DEFAULT_ACTIVITY_LENGTH, (successful) => {
            if (successful) this.setState({ gettingActivityAll: false });
          });
          this.setState({ gettingActivityAll: true });
        }
      }
    }
  }

  // helper to get a list of user's own events when props change
  getOwnEvents = memoize((eventList, currentUser) => {
    if (!eventList || !currentUser) return [];
    const { _id: currentUserId } = currentUser;
    // if (!currentUserId) return [];
    const ownEventList = eventList.filter((eachEvent) => {
      const { runners } = eachEvent;
      const runnerIds = (runners) ? runners.map(runner => runner.user) : [];
      return runnerIds.includes(currentUserId);
    });
    return ownEventList;
  });

  // update a prop in AdminActivity to trigger refresh of Collapse component to new size
  requestRefreshCollapseAdminActivity = () => {
    const { refreshCollapseAdminActivity } = this.state;
    this.setState({ refreshCollapseAdminActivity: refreshCollapseAdminActivity + 1 });
  }

  renderError = () => {
    const {
      cancelActivityError,
      activity,
    } = this.props;
    const {
      errorMessage,
    } = activity;
    if (!errorMessage) return null;

    return (
      <div className="sixteen wide column">
        <div className="ui error message">
          <i
            role="button"
            className="close icon"
            onClick={() => cancelActivityError()}
            onKeyPress={() => cancelActivityError()}
            tabIndex="0"
          />
          <Trans>{`Error: ${errorMessage}`}</Trans>
        </div>
      </div>
    );
  }

  renderHomeWelcome = () => {
    const {
      auth,
      eventList,
      currentUser,
    } = this.props;
    const ownEvents = this.getOwnEvents(eventList, currentUser);
    return (
      <HomeWelcome
        auth={auth}
        currentUser={currentUser}
        ownEvents={ownEvents}
      />
    );
  }

  renderHomeWelcomeImage = () => {
    return (
      <>
        <img className="home-image" src={forest} alt="welcome" />
        <p>Photo: spread out pile of O maps, folder in background</p>
      </>
    );
  }

  renderHomeWhatIsIt = () => {
    return (
      <HomeWhatIsIt />
    );
  }

  renderHomeWhatIsItImage = () => {
    return (
      <>
        <img className="home-image" src={forest} alt="screenshot" />
        <p>screenshot(s)</p>
      </>
    );
  }

  renderHomeHowToUse = () => {
    return (
      <HomeHowToUse />
    );
  }

  renderHomeHowToUseImage = () => {
    return (
      <>
        <img className="home-image" src={forest} alt="screenshot" />
        <p>screenshot(s)</p>
      </>
    );
  }

  renderHomeAboutAuthor = () => {
    return (
      <HomeAboutAuthor />
    );
  }

  renderHomeAboutAuthorImage = () => {
    return (
      <>
        <img className="home-image" src={forest} alt="author" />
        <p>picture of me running</p>
      </>
    );
  }

  renderHomeRecent = () => {
    const {
      activity,
      currentUser,
      language,
      userList,
    } = this.props;
    const { activityOwn, activityAll } = activity;
    if (!currentUser) return null;
    const { role } = currentUser;
    if (role === 'guest') {
      return (
        <div className="sixteen wide column">
          <HomeRecent activityList={activityAll} language={language} userList={userList} />
        </div>
      );
    }
    return (
      <div className="row">
        <div className="eight wide column">
          <HomeRecent
            activityList={activityOwn}
            language={language}
            isOwn
            userList={userList}
          />
        </div>
        <div className="eight wide column">
          <HomeRecent
            activityList={activityAll}
            language={language}
            isAll
            userList={userList}
          />
        </div>
      </div>
    );
  }

  renderHomeAdminPanel = () => {
    const { activity, currentUser, language } = this.props;
    if (!currentUser) return null;
    const { refreshCollapseAdminActivity } = this.state;
    const { role } = currentUser;
    if (role !== 'admin') return null;
    const { activityAdmin } = activity;
    return (
      <div className="sixteen wide column">
        <HomeAdminPanel
          activityList={activityAdmin}
          language={language}
          refreshCollapse={refreshCollapseAdminActivity}
          requestRefreshCollapse={this.requestRefreshCollapseAdminActivity}
        />
      </div>
    );
  }

  render() {
    // console.log('state in HomeView', this.state);
    // console.log('props in HomeView', this.props);
    return (
      <div className="ui vertically padded stackable grid">
        {this.renderError()}
        <div className="row">
          <div className="twelve wide column">
            {this.renderHomeWelcome()}
          </div>
          <div className="four wide column">
            {this.renderHomeWelcomeImage()}
          </div>
        </div>
        {this.renderHomeRecent()}
        {this.renderHomeAdminPanel()}
        <div className="row">
          <div className="four wide column">
            {this.renderHomeWhatIsItImage()}
          </div>
          <div className="twelve wide column">
            {this.renderHomeWhatIsIt()}
          </div>
        </div>
        <div className="row">
          <div className="twelve wide column">
            {this.renderHomeHowToUse()}
          </div>
          <div className="four wide column">
            {this.renderHomeHowToUseImage()}
          </div>
        </div>
        <div className="row">
          <div className="four wide column">
            {this.renderHomeAboutAuthorImage()}
          </div>
          <div className="twelve wide column">
            {this.renderHomeAboutAuthor()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  activity,
  auth,
  config,
  oevent,
  user,
}) => {
  return {
    activity,
    auth: auth.authenticated,
    currentUser: user.current,
    eventList: oevent.list,
    language: config.language,
    userList: user.list,
  };
};
const mapDispatchToProps = {
  getActivityLogAdmin: getActivityLogAdminAction,
  getActivityLogAll: getActivityLogAllAction,
  getActivityLogOwn: getActivityLogOwnAction,
  cancelActivityError: cancelActivityErrorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
