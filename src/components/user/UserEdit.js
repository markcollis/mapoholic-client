import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { roleOptionsLocale, visibilityOptionsLocale, validationErrorsLocale } from '../../common/data';
import noAvatar from '../../graphics/noAvatar.png';
import { MAPOHOLIC_SERVER } from '../../config';
import UserChangePassword from './UserChangePassword';
import UserEditProfileImage from './UserEditProfileImage';

// renders form to submit credentials either for login or creating account
class UserEdit extends Component {
  static propTypes = {
    // Formik props
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    isSubmitting: PropTypes.bool.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    // props from parent component
    changePassword: PropTypes.func.isRequired,
    clubList: PropTypes.arrayOf(PropTypes.object),
    deleteProfileImage: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    language: PropTypes.string,
    postProfileImage: PropTypes.func.isRequired,
    selectedUser: PropTypes.objectOf(PropTypes.any).isRequired,
    setUserViewMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    language: 'en',
    clubList: [],
  };

  state = {
    showUpdatePassword: false,
    showUpdateProfileImage: false,
  };

  renderUpdatePassword() {
    const {
      changePassword,
      isAdmin,
      language,
      selectedUser,
    } = this.props;
    return (
      <div>
        <UserChangePassword
          changePassword={changePassword}
          hide={() => this.setState({ showUpdatePassword: false })}
          isAdmin={isAdmin}
          language={language}
          user={selectedUser}
        />
        <hr className="divider" />
      </div>
    );
  }

  renderUpdateProfileImage() {
    const {
      deleteProfileImage,
      postProfileImage,
      selectedUser,
    } = this.props;
    return (
      <div>
        <UserEditProfileImage
          user={selectedUser}
          hide={() => this.setState({ showUpdateProfileImage: false })}
          postProfileImage={postProfileImage}
          deleteProfileImage={deleteProfileImage}
        />
        <hr className="divider" />
      </div>
    );
  }

  renderForm() {
    const {
      clubList,
      errors,
      isAdmin,
      isSubmitting,
      language,
      setFieldTouched,
      setFieldValue,
      setUserViewMode,
      touched,
      values,
    } = this.props;
    const memberOfOptions = clubList
      .map((club) => {
        const {
          _id: clubId,
          shortName,
          fullName,
          country,
        } = club;
        const fullNameToDisplay = (fullName) ? `: ${fullName}` : '';
        const countryToDisplay = (country !== '') ? ` (${country})` : '';
        return { value: clubId, label: `${shortName}${fullNameToDisplay}${countryToDisplay}` };
      })
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
    const validationErrors = validationErrorsLocale[language];
    const roleOptions = roleOptionsLocale[language];
    const visibilityOptions = visibilityOptionsLocale[language];

    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="email">
            <Trans>Email address</Trans>
            <Field
              name="email"
              autoComplete="off"
            />
            { touched.email && errors.email
               && <div className="ui warning message">{validationErrors[errors.email] || '!'}</div> }
          </label>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="displayName">
              <Trans>User name</Trans>
              <Field
                name="displayName"
                autoComplete="off"
              />
              { touched.displayName && errors.displayName
                && <div className="ui warning message">{errors.displayName}</div> }
            </label>
          </div>
          <div className="eight wide field">
            <label htmlFor="fullName">
              <Trans>Full name</Trans>
              <I18n>
                {({ i18n }) => (
                  <Field
                    name="fullName"
                    placeholder={i18n._(t`Full name of user`)}
                    autoComplete="off"
                  />
                )}
              </I18n>
              { touched.fullName && errors.fullName
                && <div className="ui warning message">{errors.fullName}</div> }
            </label>
          </div>
        </div>
        <div className="field">
          <label htmlFor="memberOf">
            <Trans>Member of</Trans>
            <I18n>
              {({ i18n }) => (
                <Select
                  id="memberOf"
                  placeholder={i18n._(t`Clubs that user is a member of`)}
                  options={memberOfOptions}
                  isMulti
                  onChange={value => setFieldValue('memberOf', value)}
                  onBlur={() => setFieldTouched('memberOf', true)}
                  value={values.memberOf}
                />
              )}
            </I18n>
            { touched.memberOf && errors.memberOf
              && <div className="ui warning message">{errors.memberOf}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="about">
            <Trans>About</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  component="textarea"
                  name="about"
                  placeholder={i18n._(t`A brief user profile`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.about && errors.about
              && <div className="ui warning message">{errors.about}</div> }
          </label>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="location">
              <Trans>Location</Trans>
              <I18n>
                {({ i18n }) => (
                  <Field
                    name="location"
                    placeholder={i18n._(t`Where user is based`)}
                    autoComplete="off"
                  />
                )}
              </I18n>
              { touched.location && errors.location
                && <div className="ui warning message">{errors.location}</div> }
            </label>
          </div>
          <div className="eight wide field">
            <label htmlFor="regNumber">
              <Trans>Registration number</Trans>
              <I18n>
                {({ i18n }) => (
                  <Field
                    name="regNumber"
                    placeholder={i18n._(t`National registration number of user`)}
                    autoComplete="off"
                  />
                )}
              </I18n>
              { touched.regNumber && errors.regNumber
                && <div className="ui warning message">{errors.regNumber}</div> }
            </label>
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="visibility">
              <Trans>Profile visibility</Trans>
              <Select
                id="visibility"
                options={visibilityOptions}
                onChange={value => setFieldValue('visibility', value)}
                onBlur={() => setFieldTouched('visibility', true)}
                value={values.visibility}
              />
              { touched.visibility && errors.visibility
                && <div className="ui warning message">{errors.visibility}</div> }
            </label>
          </div>
          {(isAdmin)
            ? (
              <div className="eight wide field">
                <label htmlFor="role">
                  <Trans>Role</Trans>
                  <Select
                    id="role"
                    options={roleOptions}
                    onChange={value => setFieldValue('role', value)}
                    onBlur={() => setFieldTouched('role', true)}
                    value={values.role}
                  />
                  { touched.role && errors.role
                    && <div className="ui warning message">{errors.role}</div> }
                </label>
              </div>
            )
            : null
          }
        </div>
        <button
          type="submit"
          className="ui tiny button primary"
          disabled={isSubmitting}
        >
          <Trans>Update</Trans>
        </button>
        <button
          type="button"
          className="ui tiny button right floated"
          onClick={() => setUserViewMode('view')}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    );
  }

  render() {
    const { selectedUser, isAdmin } = this.props;
    const {
      _id: userId,
      displayName,
      email,
      profileImage,
    } = selectedUser;
    const { showUpdateEmail, showUpdatePassword, showUpdateProfileImage } = this.state;
    return (
      <div className="ui segment">
        <h3 className="header"><Trans>Edit User Details</Trans></h3>
        <hr className="divider" />
        <div className="ui grid">
          <div className="ten wide column">
            <h3 className="header">{displayName}</h3>
            <p className="content">{email}</p>
            <button
              type="button"
              className={(showUpdatePassword) ? 'ui tiny button disabled' : 'ui primary tiny button'}
              onClick={() => this.setState({ showUpdatePassword: true })}
            >
              <Trans>Change Password</Trans>
            </button>
          </div>
          <div className="six wide column">
            <div
              role="button"
              className={(showUpdateProfileImage) ? 'ui small image disabled' : 'ui small image'}
              onClick={() => this.setState({ showUpdateProfileImage: true })}
              onKeyPress={() => this.setState({ showUpdateProfileImage: true })}
              tabIndex="0"
            >
              <div className="ui right corner label blue">
                <i className="sync icon" />
              </div>
              <img
                alt="avatar"
                src={(profileImage) ? `${MAPOHOLIC_SERVER}/${profileImage}` : noAvatar}
              />
            </div>
          </div>
        </div>
        <hr className="divider" />
        {(showUpdateEmail) ? this.renderUpdateEmail() : null}
        {(showUpdatePassword) ? this.renderUpdatePassword() : null}
        {(showUpdateProfileImage) ? this.renderUpdateProfileImage() : null}
        {this.renderForm()}
        {(isAdmin) ? (
          <div>
            <hr className="divider" />
            <p>{`(UserId: ${userId})`}</p>
          </div>
        ) : null}
      </div>
    );
  }
}

const formikUserEdit = withFormik({
  mapPropsToValues({ selectedUser, language }) {
    return {
      email: selectedUser.email,
      displayName: selectedUser.displayName,
      fullName: selectedUser.fullName || '',
      memberOf: selectedUser.memberOf.map((club) => {
        const { _id: clubId } = club;
        return { value: clubId, label: club.shortName };
      }) || [],
      about: selectedUser.about || '',
      location: selectedUser.location || '',
      regNumber: selectedUser.regNumber || '',
      role: roleOptionsLocale[language].filter(el => el.value === selectedUser.role),
      visibility: visibilityOptionsLocale[language]
        .filter(el => el.value === selectedUser.visibility),
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string().required().email('invalidEmail'),
    displayName: Yup.string().required(),
    fullName: Yup.string(),
    memberOf: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      }),
    ),
    about: Yup.string(),
    location: Yup.string(),
    regNumber: Yup.string(),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      updateUser,
      setUserViewMode,
      selectedUser,
    } = props;
    const { _id: selectedUserId } = selectedUser;
    const valuesToSubmit = (values.role)
      ? { ...values, role: values.role.value }
      : { ...values };
    valuesToSubmit.visibility = values.visibility.value;
    valuesToSubmit.memberOf = values.memberOf.map(el => el.value);
    updateUser(selectedUserId, valuesToSubmit, (didSucceed) => {
      if (didSucceed) setUserViewMode('view');
      else setSubmitting(false);
    });
  },
})(UserEdit);

export default formikUserEdit;
