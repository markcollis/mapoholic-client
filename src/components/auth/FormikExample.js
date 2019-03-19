import React from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Formik = ({ values, errors, touched }) => {
  return (
    <div className="formik ui segment">
      <h3 className="header">Formik example</h3>
      <Form className="ui form">
        <div className="field">
          { touched.email && errors.email && <p className="ui negative message">{errors.email}</p> }
          <label htmlFor="email">
            Email
            <Field type="email" name="email" placeholder="Enter email address" />
          </label>
        </div>
        <div className="field">
          { touched.password && errors.password && <p className="ui negative message">{errors.password}</p> }
          <label htmlFor="password">
            Password
            <Field type="password" name="password" placeholder="Enter password" />
          </label>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field type="checkbox" name="newsletter" checked={values.newsletter} tabIndex="0" />
            <label htmlFor="newsletter">Do you want our newsletter?</label>
          </div>
        </div>
        <div className="field">
          <Field component="select" name="plan" className="ui fluid dropdown">
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </Field>
        </div>
        <button type="submit" className="ui button primary">Submit</button>
      </Form>
    </div>
  );
};

Formik.propTypes = {
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
};

const schema = Yup.object().shape({
  email: Yup.string().email('I don\'t believe that\'s an email address!').required(),
  password: Yup.string().min(5).required(),
});
// console.log(schema);

export default withFormik({
  mapPropsToValues({
    email,
    password,
    newsletter,
    plan,
  }) {
    return {
      email: email || '',
      password: password || '',
      newsletter: newsletter || false,
      plan: plan || 'free',
    };
  },
  validationSchema: schema,
  handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
    console.log(values);
    setTimeout(() => {
      if (values.email === 'mark@test.com') {
        setErrors({ email: 'That email address is already in use.' });
      } else {
        resetForm();
      }
      setSubmitting(false);
    }, 2000);
  },
})(Formik);
