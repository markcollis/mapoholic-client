import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    static propTypes = {
      auth: PropTypes.string.isRequired,
      history: PropTypes.objectOf(PropTypes.any).isRequired,
    };

    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      const { auth, history } = this.props;
      if (!auth) {
        // console.log('Forbidden without being logged in');
        history.push('/');
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ auth }) => {
    return { auth: auth.authenticated };
  };

  return connect(mapStateToProps)(ComposedComponent);
};
