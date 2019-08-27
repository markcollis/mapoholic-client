import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { validationErrorsLocale } from '../../common/formData';

const UserChangePassword = ({
  errors,
  hide,
  isAdmin,
  language,
  touched,
}) => {
  const validationErrors = validationErrorsLocale[language];

  return (
    <div className="formik">
      <h3 className="header">Change password</h3>
      <Form className="ui form">
        <div className="field">
          <label htmlFor="currentPassword">
            {(isAdmin) ? <Trans>Your own password</Trans> : <Trans>Current password</Trans>}
            <I18n>
              {({ i18n }) => (
                <Field
                  type="password"
                  name="currentPassword"
                  placeholder={i18n._(t`Enter current password`)}
                  autoComplete="off"
                />
              )}
            </I18n>
          </label>
          { touched.currentPassword && errors.currentPassword
            && <div className="ui warning message">{validationErrors[errors.currentPassword] || '!'}</div> }
        </div>
        <div className="field">
          <label htmlFor="newPassword">
            <Trans>New password</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  type="password"
                  name="newPassword"
                  placeholder={i18n._(t`Enter new password`)}
                  autoComplete="off"
                />
              )}
            </I18n>
          </label>
          { touched.newPassword && errors.newPassword
            && <div className="ui warning message">{validationErrors[errors.newPassword] || '!'}</div> }
        </div>
        <button type="submit" className="ui tiny button primary"><Trans>Change password</Trans></button>
        <button
          type="button"
          className="ui tiny button"
          onClick={() => hide()}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    </div>
  );
};

UserChangePassword.propTypes = {
  hide: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  language: PropTypes.string,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
};

UserChangePassword.defaultProps = {
  isAdmin: false,
  language: 'en',
};

const schema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'passwordLength')
    .required('currentPasswordRequired'),
  newPassword: Yup.string()
    .min(8, 'passwordLength')
    .required('passwordRequired'),
});

export default withFormik({
  mapPropsToValues() { // not appropriate for passwords
    return {
      currentPassword: '',
      newPassword: '',
    };
  },
  validationSchema: schema,
  handleSubmit(values, { props, setSubmitting }) {
    const { hide, user, changePassword } = props;
    const { _id: userId } = user;
    changePassword(userId, values, (didSucceed) => {
      if (didSucceed) {
        hide();
      } else {
        setSubmitting(false);
      }
    });
  },
})(UserChangePassword);
