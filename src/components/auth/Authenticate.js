import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

// import { i18nInstance } from '../App'; doesn't work properly, needs more investigation
import { loginAction, signupAction, cancelAuthErrorAction } from '../../actions';
import { validationErrorsLocale } from '../../common/data';

// renders form to submit credentials either for login or creating account
class Authenticate extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    cancelAuthError: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired, // error returned from server
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    isSubmitting: PropTypes.bool.isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  renderError = () => {
    const { cancelAuthError, errorMessage } = this.props;
    if (!errorMessage) return null;
    return (
      <div className="ui error message">
        <i
          role="button"
          className="close icon"
          onClick={() => cancelAuthError()}
          onKeyPress={() => cancelAuthError()}
          tabIndex="0"
        />
        <Trans>{`Error: ${errorMessage} Please try again.`}</Trans>
      </div>
    );
  }

  renderForm = () => {
    const {
      errors,
      isSubmitting,
      language,
      location,
      touched,
    } = this.props;
    const route = location.pathname.slice(1);
    const validationErrors = validationErrorsLocale[language];
    const buttonText = (route === 'signup')
      ? <Trans>Sign up</Trans>
      : <Trans>Log in</Trans>;
    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="email">
            <Trans>Email</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  type="email"
                  name="email"
                  placeholder={i18n._(t`Enter email address`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.email && errors.email
              && <div className="ui warning message">{validationErrors[errors.email] || '!'}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="password">
            <Trans>Password</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  type="password"
                  name="password"
                  placeholder={i18n._(t`Enter password`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.password && errors.password
              && <div className="ui warning message">{validationErrors[errors.password] || '!'}</div> }
          </label>
        </div>
        {(route === 'signup')
          ? (
            <div className="field">
              <label htmlFor="displayName">
                <Trans>User name</Trans>
                <I18n>
                  {({ i18n }) => (
                    <Field
                      name="displayName"
                      placeholder={i18n._(t`Enter user name (your email address will be used if left blank)`)}
                      autoComplete="off"
                    />
                  )}
                </I18n>
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
      ? <Trans>Sign up for OMapFolder</Trans>
      : <Trans>Log in to OMapFolder</Trans>;
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderForm()}
        {this.renderError()}
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
      .email('invalidEmail')
      .required('emailRequired'),
    password: Yup.string()
      .min(8, 'passwordLength')
      .required('passwordRequired'),
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
      signup(values, (didSucceed) => {
        if (didSucceed) {
          history.push('/me');
        } else {
          setSubmitting(false);
        }
      });
    } else {
      login(values, (didSucceed) => {
        if (didSucceed) {
          history.push('/mymaps');
        } else {
          setSubmitting(false);
        }
      });
    }
  },
});

const mapStateToProps = ({ auth, config }) => {
  return { errorMessage: auth.errorMessage, language: config.language };
};

export default compose(
  connect(mapStateToProps, {
    cancelAuthError: cancelAuthErrorAction,
    login: loginAction,
    signup: signupAction,
  }),
  formikAuthenticate,
)(Authenticate);
