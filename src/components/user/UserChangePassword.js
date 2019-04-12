import React from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';

const UserChangePassword = ({
  hide,
  isAdmin,
  errors,
  touched,
}) => {
  return (
    <div className="formik">
      <h3 className="header">Change password</h3>
      <Form className="ui form">
        <div className="field">
          <label htmlFor="currentPassword">
            {(isAdmin) ? 'Your own password' : 'Current password'}
            <Field type="password" name="currentPassword" placeholder="Enter current password" />
          </label>
          { touched.currentPassword && errors.currentPassword && <p className="ui negative message">{errors.currentPassword}</p> }
        </div>
        <div className="field">
          <label htmlFor="newPassword">
            New password
            <Field type="password" name="newPassword" placeholder="Enter new password" />
          </label>
          { touched.newPassword && errors.newPassword && <p className="ui negative message">{errors.newPassword}</p> }
        </div>
        <button type="submit" className="ui tiny button primary">Submit</button>
        <button
          type="button"
          className="ui tiny button"
          onClick={() => hide()}
        >
        Cancel
        </button>
      </Form>
    </div>
  );
};

UserChangePassword.propTypes = {
  hide: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
};

UserChangePassword.defaultProps = {
  isAdmin: false,
};

const schema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Your password must be at least 8 characters long.')
    .required('You must confirm your current password.'),
  newPassword: Yup.string()
    .min(8, 'Your password must be at least 8 characters long.')
    .required('A password is required.'),
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
    setTimeout(() => changePassword(userId, values, (didSucceed) => {
      if (didSucceed) {
        hide();
      } else {
        setSubmitting(false);
      }
    }), 2000); // simulate network delay
  },
})(UserChangePassword);
