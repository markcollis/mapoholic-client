import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

// The ErrorBoundary component contains the effects of errors at an appropriate level
// and warns the user that an error has occurred
class ErrorBoundary extends Component {
  state = { error: false }

  static getDerivedStateFromError = () => {
    return { error: true };
  };

  render() {
    const { children } = this.props;
    if (!children) return null; // nothing currently within this boundary

    const childComponents = React.Children.map(children, (child) => {
      if (!child) return null;
      if (!child.type) return null;
      if (child.type.name) {
        return `${child.type.name} component`;
      }
      if (child.type.displayName === 'Connect(App)') { // detect errors not caught at a lower level
        return 'App';
      }
      return null;
    }).filter(name => name).join(', or ');
    if (childComponents !== '') {
      // console.log('childComponents:', childComponents);
    }
    const { error } = this.state;
    if (error) {
      if (childComponents === 'App') {
        return (
          <div className="ui error message">
            <Trans>
              Sorry, something has gone very wrong and MapOholic is not currently available.
            </Trans>
          </div>
        );
      }
      return (
        <div className="ui error message">
          <Trans>
            {`Sorry, something has gone wrong with this part of MapOholic${(childComponents)
              ? `: ${childComponents}` : ''}. Please try again in case it is a temporary problem.
              Other functionality should not be affected.`}
          </Trans>
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};
ErrorBoundary.defaultProps = {
  children: null,
};

export default ErrorBoundary;
