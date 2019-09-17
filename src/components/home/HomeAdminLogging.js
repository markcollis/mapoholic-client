import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Trans } from '@lingui/macro';

import { setApiLoggingAction } from '../../actions';

class HomeAdminLogging extends Component {
  static propTypes = {
    currentUserRole: PropTypes.string.isRequired,
    logApiCalls: PropTypes.bool.isRequired,
    setApiLogging: PropTypes.func.isRequired,
  }

  handleToggleApiLogging = () => {
    const { setApiLogging, logApiCalls } = this.props;
    setApiLogging(!logApiCalls);
  }

  render() {
    const { currentUserRole, logApiCalls } = this.props;
    const isAdmin = (currentUserRole === 'admin');
    const messageText = (logApiCalls)
      ? <Trans>API logging is currently enabled.</Trans>
      : <Trans>API logging is currently disabled.</Trans>;
    const messageClass = (logApiCalls) ? 'ui compact message positive' : 'ui compact message negative';
    const buttonText = (logApiCalls)
      ? <Trans>Disable logging</Trans>
      : <Trans>Enable logging</Trans>;
    const buttonClass = (logApiCalls) ? 'ui button primary' : 'ui button primary';
    return (
      <div className="home-admin-logging">
        <p className={messageClass}>
          {messageText}
        </p>
        <button
          className={buttonClass}
          type="button"
          onClick={this.handleToggleApiLogging}
          disabled={!isAdmin}
        >
          {buttonText}
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({
  config,
  user,
}) => {
  return {
    currentUserRole: user.current.role,
    logApiCalls: config.logApiCalls,
  };
};
const mapDispatchToProps = {
  setApiLogging: setApiLoggingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeAdminLogging);
