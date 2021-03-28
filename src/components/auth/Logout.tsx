import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Trans } from '@lingui/macro';
import { logoutAction } from '../../actions';

const dispatchProps = { logout: logoutAction };
const connector = connect(null, dispatchProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
interface Props extends PropsFromRedux {}

// When rendered, the Logout component logs the current user out and displays an appropriate message
class Logout extends Component<Props> {
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

export default connector(Logout);
