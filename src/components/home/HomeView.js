import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import ErrorBoundary from '../generic/ErrorBoundary';
import HomeAboutAuthor from './HomeAboutAuthor';
import HomeAdminPanel from './HomeAdminPanel';
import HomeHowToUse from './HomeHowToUse';
import HomeRecent from './HomeRecent';
import HomeWelcome from './HomeWelcome';
import HomeWhatIsIt from './HomeWhatIsIt';

import logo from '../../graphics/mapoholicLogo.jpg';
import mark from '../../graphics/markRunning.jpg';
import screenshotCourseMap from '../../graphics/screenshotCourseMapSmall.jpg';
import screenshotEventList from '../../graphics/screenshotEventListSmall.jpg';
import screenshotEventMap from '../../graphics/screenshotEventMapSmall.jpg';

import {
  cancelActivityErrorAction,
  getActivityLogAdminAction,
  getActivityLogAllAction,
  getActivityLogOwnAction,
} from '../../actions';
import { DEFAULT_ACTIVITY_LENGTH } from '../../config';

// The HomeView component renders information about MapOholic and how to use it
// as well as a summary of recent activity (if logged in)
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

  // helper to populate current session activity with full details
  populateActivitySession = memoize((activitySession) => {
    const { currentUser, eventList, userList } = this.props;
    return activitySession.map((eachActivity) => {
      const actionByToRender = { ...currentUser, active: true };
      if (eachActivity.eventId && eachActivity.runnerId) {
        const eventToRender = eventList.find((event) => {
          const { _id: id } = event;
          return (id === eachActivity.eventId);
        });
        const eventRunnerToRender = userList.find((user) => {
          const { _id: userId } = user;
          return (userId === eachActivity.runnerId);
        });
        return {
          ...eachActivity,
          actionBy: actionByToRender,
          event: { ...eventToRender, active: true },
          eventRunner: { ...eventRunnerToRender, active: true },
        };
      }
      if (eachActivity.userId) {
        const userToRender = userList.find((user) => {
          const { _id: userId } = user;
          return (userId === eachActivity.userId);
        });
        return {
          ...eachActivity,
          actionBy: actionByToRender,
          user: { ...userToRender, active: true },
        };
      }
      return { ...eachActivity, actionBy: actionByToRender };
    });
  });

  componentDidMount() {
    this.getActivityLists();
  }

  getActivityLists = () => {
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
    if (currentUser) {
      if (currentUser.role === 'admin') {
        if (!activityAdmin && !gettingActivityAdmin) {
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
    const ownEventList = eventList.filter((eachEvent) => {
      const { runners } = eachEvent;
      const runnerIds = (runners) ? runners.map((runner) => runner.user) : [];
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
            label="close"
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
    if (auth) {
      return (
        <div className="row">
          <div className="six wide column">
            <ErrorBoundary>
              <HomeWelcome
                auth={auth}
                currentUser={currentUser}
                ownEvents={ownEvents}
              />
            </ErrorBoundary>
          </div>
          <div className="ten wide column middle aligned">
            <img src={logo} alt="MapOholic logo" />
          </div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="ten wide column">
          <ErrorBoundary>
            <HomeWelcome />
          </ErrorBoundary>
        </div>
        <div className="six wide column middle aligned">
          <img src={logo} alt="MapOholic logo" />
        </div>
      </div>
    );
  }

  renderHomeRecent = () => {
    const {
      activity,
      currentUser,
      // eventList,
      language,
      userList,
    } = this.props;
    const { activityOwn, activityAll, activitySession } = activity;
    if (!currentUser) return null;
    const { role } = currentUser;
    const activitySessionToRender = this.populateActivitySession(activitySession);
    const activityOwnToRender = (activityOwn)
      ? activitySessionToRender.concat(activityOwn) : activitySessionToRender;
    const activityAllToRender = (activityAll)
      ? activitySessionToRender.concat(activityAll) : activitySessionToRender;
    if (role === 'guest') {
      return (
        <div className="sixteen wide column">
          <ErrorBoundary>
            <HomeRecent
              activityList={activityAllToRender}
              language={language}
              userList={userList}
            />
          </ErrorBoundary>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="eight wide column">
          <ErrorBoundary>
            <HomeRecent
              activityList={activityOwnToRender}
              language={language}
              isOwn
              userList={userList}
            />
          </ErrorBoundary>
        </div>
        <div className="eight wide column">
          <ErrorBoundary>
            <HomeRecent
              activityList={activityAllToRender}
              language={language}
              isAll
              userList={userList}
            />
          </ErrorBoundary>
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
    const { activityAdmin, activitySession } = activity;
    if (!activityAdmin) return null;
    const activitySessionToRender = this.populateActivitySession(activitySession);
    const activityListToRender = activitySessionToRender.concat(activityAdmin);
    return (
      <div className="sixteen wide column">
        <ErrorBoundary>
          <HomeAdminPanel
            activityList={activityListToRender}
            language={language}
            refreshCollapse={refreshCollapseAdminActivity}
            requestRefreshCollapse={this.requestRefreshCollapseAdminActivity}
          />
        </ErrorBoundary>
      </div>
    );
  }

  render() {
    const { language } = this.props;
    return (
      <ErrorBoundary>
        <div className="ui vertically padded stackable grid home-view">
          {this.renderError()}
          {this.renderHomeWelcome()}
          {this.renderHomeRecent()}
          {this.renderHomeAdminPanel()}
          <div className="row">
            <div className="six wide column">
              <img src={screenshotCourseMap} alt="screenshot" className="home-view__screenshot" />
            </div>
            <div className="ten wide column middle aligned">
              <ErrorBoundary>
                <HomeWhatIsIt />
              </ErrorBoundary>
            </div>
          </div>
          <div className="row">
            <div className="ten wide column middle aligned">
              <ErrorBoundary>
                <HomeHowToUse />
              </ErrorBoundary>
            </div>
            <div className="six wide column hide-on-mobile">
              <img src={screenshotEventList} alt="screenshot" className="home-view__screenshot" />
              <img src={screenshotEventMap} alt="screenshot" className="home-view__screenshot" />
            </div>
          </div>
          <div className="row">
            <div className="four wide column">
              <img className="ui medium image rounded" src={mark} alt="Mark Collis" />
            </div>
            <div className="twelve wide column">
              <ErrorBoundary>
                <HomeAboutAuthor language={language} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </ErrorBoundary>
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
