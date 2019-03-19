import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Welcome = ({ auth }) => {
  if (auth) {
    return (
      <div className="ui segment">
        <h3 className="header">Welcome back!</h3>
        <p>You are still logged in.</p>
      </div>
    );
  }
  return (
    <div className="ui segment">
      <h3 className="header">Welcome!</h3>
      <p>
        <Link to="/signup">Sign up</Link>
        {' or '}
        <Link to="/login">log in</Link>
        {' to use all the exciting features of this site '}
        <i className="smile outline icon" />
      </p>
    </div>
  );
};

Welcome.propTypes = {
  auth: PropTypes.string,
};
Welcome.defaultProps = {
  auth: '',
};

const mapStateToProps = ({ auth }) => {
  return { auth: auth.authenticated };
};

export default connect(mapStateToProps)(Welcome);
