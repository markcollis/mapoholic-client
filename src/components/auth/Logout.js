import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutAction } from '../../actions';

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
        <h3 className="header">Logged out</h3>
        <p>Sorry to see you leave, come back again soon!</p>
      </div>
    );
  }
}

export default connect(null, { logout: logoutAction })(Logout);
