import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { loginAction, signupAction } from '../../actions';

// renders form to submit credentials either for login or creating account
class Authenticate extends Component {
  static propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    errorMessage: PropTypes.string.isRequired, // error returned from server
    isSubmitting: PropTypes.bool.isRequired,
  }

  renderServerErrorMessage() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return <div className="ui error message">{`Error: ${errorMessage} Please try again.`}</div>;
    }
    return null;
  }

  renderForm() {
    const {
      location,
      errors,
      touched,
      isSubmitting,
    } = this.props;
    const route = location.pathname.slice(1);
    const buttonText = (route === 'signup') ? 'Sign up' : 'Log in';
    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="email">
          Email
            <Field
              type="email"
              name="email"
              placeholder="Enter email address"
              autoComplete="off"
            />
            { touched.email && errors.email && <div className="ui warning message">{errors.email}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="password">
          Password
            <Field
              type="password"
              name="password"
              placeholder="Enter password"
              autoComplete="off"
            />
            { touched.password && errors.password && <div className="ui warning message">{errors.password}</div> }
          </label>
        </div>
        {(route === 'signup')
          ? (
            <div className="field">
              <label htmlFor="displayName">
                User name
                <Field
                  name="displayName"
                  placeholder="Enter user name (your email address will be used if left blank)"
                  autoComplete="off"
                />
                { touched.displayName && errors.displayName && <div className="ui warning message">{errors.displayName}</div> }
              </label>
            </div>
          )
          : null
        }
        <button type="submit" className="ui button primary" disabled={isSubmitting}>{buttonText}</button>
      </Form>
    );
  }

  render() {
    const { location } = this.props;
    const route = location.pathname.slice(1);
    const headerText = (route === 'signup')
      ? 'Sign up for OMapFolder'
      : 'Log in to OMapFolder';
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderForm()}
        {this.renderServerErrorMessage()}
      </div>
    );
  }
}

const formikAuthenticate = withFormik({
  mapPropsToValues({ email, displayName }) {
    return {
      email: email || '', // can set a value to pass in as a prop, if we ever want to
      password: '', // don't ever want to pass THIS in as a prop...
      displayName: displayName || '',
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('This is not a valid email address.')
      .required('An email address is required.'),
    password: Yup.string()
      .min(8, 'Your password must be at least 8 characters long.')
      .required('A password is required.'),
    displayName: Yup.string(),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      signup,
      login,
      history,
      location,
    } = props;
    const route = location.pathname.slice(1);
    if (route === 'signup') {
      setTimeout(() => signup(values, (didSucceed) => {
        if (didSucceed) {
          history.push('/me');
        } else {
          setSubmitting(false);
        }
      }), 1000); // simulate network delay
    } else {
      setTimeout(() => login(values, (didSucceed) => {
        if (didSucceed) {
          history.push('/mymaps');
        } else {
          setSubmitting(false);
        }
      }), 1000); // simulate network delay
    }
  },
});

const mapStateToProps = ({ auth }) => {
  return { errorMessage: auth.errorMessage };
};

export default compose(
  connect(mapStateToProps, { signup: signupAction, login: loginAction }),
  formikAuthenticate,
)(Authenticate);
