import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { logoutAction } from '../../actions';

// When rendered, the Logout component logs the current user out and displays an appropriate message
class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { logout } = this.props;
    logout();
  }

  render() {
    return (
      <div className="logout ui segment">
        <h3 className="header"><Trans>Logged out</Trans></h3>
        <p><Trans>Sorry to see you leave, come back again soon!</Trans></p>
      </div>
    );
  }
}

export default connect(null, { logout: logoutAction })(Logout);
