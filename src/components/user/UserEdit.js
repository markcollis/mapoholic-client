import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { roleOptions, visibilityOptions } from '../../common/data';
import noAvatar from '../../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../../config';
import UserChangePassword from './UserChangePassword';
import UserEditProfileImage from './UserEditProfileImage';
/* eslint no-underscore-dangle: 0 */

// renders form to submit credentials either for login or creating account
class UserEdit extends Component {
  static propTypes = {
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    clubList: PropTypes.arrayOf(PropTypes.object),
    getClubList: PropTypes.func.isRequired,
    selectedUser: PropTypes.objectOf(PropTypes.any).isRequired,
    setUserViewMode: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    postProfileImage: PropTypes.func.isRequired,
    deleteProfileImage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    clubList: [],
  };

  state = {
    showUpdatePassword: false,
    showUpdateProfileImage: false,
  };

  componentDidMount() {
    const { clubList, getClubList } = this.props;
    if (clubList.length === 0) getClubList();
  }

  renderUpdatePassword() {
    const { selectedUser, changePassword, isAdmin } = this.props;
    return (
      <div>
        <UserChangePassword
          isAdmin={isAdmin}
          user={selectedUser}
          hide={() => this.setState({ showUpdatePassword: false })}
          changePassword={changePassword}
        />
        <hr className="divider" />
      </div>
    );
  }

  renderUpdateProfileImage() {
    const { selectedUser, postProfileImage, deleteProfileImage } = this.props;
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
      errors,
      touched,
      values,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      isAdmin,
      clubList,
      setUserViewMode,
    } = this.props;
    // console.log('values:', values);
    // console.log('clubList:', clubList);
    const memberOfOptions = clubList.map((club) => {
      return { value: club._id, label: club.shortName };
    });
    // console.log('memberOfOptions', memberOfOptions);
    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="email">
          Email address
            <Field
              name="email"
              autoComplete="off"
            />
            { touched.email && errors.email && <div className="ui warning message">{errors.email}</div> }
          </label>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="displayName">
            User name
              <Field
                name="displayName"
                autoComplete="off"
              />
              { touched.displayName && errors.displayName && <div className="ui warning message">{errors.displayName}</div> }
            </label>
          </div>
          <div className="eight wide field">
            <label htmlFor="fullName">
            Full name
              <Field
                name="fullName"
                placeholder="Full name of user"
                autoComplete="off"
              />
              { touched.fullName && errors.fullName && <div className="ui warning message">{errors.fullName}</div> }
            </label>
          </div>
        </div>
        <div className="field">
          <label htmlFor="memberOf">
          Member of
            <Select
              id="memberOf"
              placeholder="Clubs that user is a member of"
              options={memberOfOptions}
              isMulti
              onChange={value => setFieldValue('memberOf', value)}
              onBlur={() => setFieldTouched('memberOf', true)}
              value={values.memberOf}
            />

            { touched.memberOf && errors.memberOf && <div className="ui warning message">{errors.memberOf}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="about">
          About
            <Field
              component="textarea"
              name="about"
              placeholder="More details about the user"
              autoComplete="off"
            />
            { touched.about && errors.about && <div className="ui warning message">{errors.about}</div> }
          </label>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="location">
            Location
              <Field
                name="location"
                placeholder="Location where the user is based"
                autoComplete="off"
              />
              { touched.location && errors.location && <div className="ui warning message">{errors.location}</div> }
            </label>
          </div>
          <div className="eight wide field">
            <label htmlFor="regNumber">
            Registration number
              <Field
                name="regNumber"
                placeholder="Registration number of user"
                autoComplete="off"
              />
              { touched.regNumber && errors.regNumber && <div className="ui warning message">{errors.regNumber}</div> }
            </label>
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="visibility">
            Profile visibility
              <Select
                id="visibility"
                options={visibilityOptions}
                onChange={value => setFieldValue('visibility', value)}
                onBlur={() => setFieldTouched('visibility', true)}
                value={values.visibility}
              />
              { touched.visibility && errors.visibility && <div className="ui warning message">{errors.visibility}</div> }
            </label>
          </div>
          {(isAdmin)
            ? (
              <div className="eight wide field">
                <label htmlFor="role">
                Role
                  <Select
                    id="role"
                    options={roleOptions}
                    onChange={value => setFieldValue('role', value)}
                    onBlur={() => setFieldTouched('role', true)}
                    value={values.role}
                  />
                  { touched.role && errors.role && <div className="ui warning message">{errors.role}</div> }
                </label>
              </div>
            )
            : null
          }
        </div>
        <button type="submit" className="ui tiny button primary" disabled={isSubmitting}>Update</button>
        <button
          type="button"
          className="ui tiny button right floated"
          onClick={() => setUserViewMode('view')}
        >
        Cancel
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
        <h3 className="header">Edit User Details</h3>
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
            Change Password
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
                src={(profileImage) ? `${OMAPFOLDER_SERVER}/${profileImage}` : noAvatar}
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
  mapPropsToValues({ selectedUser }) {
    return {
      email: selectedUser.email,
      displayName: selectedUser.displayName,
      fullName: selectedUser.fullName || '',
      memberOf: selectedUser.memberOf.map((club) => {
        return {
          value: club._id,
          label: club.shortName,
        };
      }) || [],
      about: selectedUser.about || '',
      location: selectedUser.location || '',
      regNumber: selectedUser.regNumber || '',
      role: roleOptions.filter(el => el.value === selectedUser.role),
      visibility: visibilityOptions.filter(el => el.value === selectedUser.visibility),
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string().required().email('This is not a valid email address.'),
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
      getClubMembers,
      getUserList,
      getUserById,
    } = props;
    const valuesToSubmit = (values.role)
      ? { ...values, role: values.role.value }
      : { ...values };
    valuesToSubmit.visibility = values.visibility.value;
    valuesToSubmit.memberOf = values.memberOf.map(el => el.value);
    // console.log('valuesToSubmit:', valuesToSubmit);
    setTimeout(() => updateUser(selectedUser._id, valuesToSubmit, (didSucceed) => {
      if (didSucceed) {
        getUserList(null, () => {
          getUserById(selectedUser._id);
          setUserViewMode('view');
          valuesToSubmit.memberOf.forEach((clubId) => {
            getClubMembers(clubId);
          });
        });
      } else {
        setSubmitting(false);
      }
    }), 2000); // simulate network delay
  },
})(UserEdit);

export default formikUserEdit;
