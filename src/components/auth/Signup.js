import React, { Component } from 'react';
import { compose } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signupAction, loginAction } from '../../actions';

class Signup extends Component {
  state = { route: '' };

  static propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    signup: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { location } = this.props;
    this.setState({ route: location.pathname.slice(1) });
  }

  onSubmit = (formProps) => {
    const { signup, login, history } = this.props;
    const { route } = this.state;
    if (route === 'signup') {
      signup(formProps, () => {
        history.push('/feature');
      });
    } else {
      login(formProps, () => {
        history.push('/feature');
      });
    }
  };

  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return <div className="ui error message">{`Error: ${errorMessage} Please try again.`}</div>;
    }
    return null;
  }

  renderForm() {
    const { handleSubmit } = this.props;
    const { route } = this.state;
    const buttonText = (route === 'signup') ? 'Sign up' : 'Log in';
    return (
      <form className="ui form" onSubmit={handleSubmit(this.onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="email">
            Email
            <Field
              name="email"
              type="email"
              component="input"
              placeholder="Enter email address"
              autoComplete="off"
            />
          </label>
        </div>
        <div className="field">
          <label htmlFor="password">
            Password
            <Field
              name="password"
              type="password"
              component="input"
              placeholder="Enter password"
              autoComplete="off"
            />
          </label>
        </div>
        <button type="submit" className="ui button primary">{buttonText}</button>
      </form>
    );
  }

  render() {
    const { route } = this.state;
    const headerText = (route === 'signup')
      ? 'Sign up for Redux Auth'
      : 'Log in to Redux Auth';
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderErrorMessage()}
        {this.renderForm()}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { errorMessage: auth.errorMessage };
};

export default compose(
  connect(mapStateToProps, { signup: signupAction, login: loginAction }),
  reduxForm({ form: 'signup-login' }),
)(Signup);
