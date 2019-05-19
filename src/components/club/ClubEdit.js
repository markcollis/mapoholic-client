import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { countryOptions } from '../../common/data';
/* eslint no-underscore-dangle: 0 */

// renders form to submit credentials either for login or creating account
class ClubEdit extends Component {
  static propTypes = {
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool,
    resetForm: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    userList: PropTypes.arrayOf(PropTypes.object),
    getUserList: PropTypes.func,
    viewMode: PropTypes.string.isRequired,
    setClubViewMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    userList: [],
    getUserList: () => {},
  };

  componentDidMount() {
    const { userList, getUserList, viewMode } = this.props;
    if (userList && userList.length === 0 && viewMode === 'edit') getUserList();
  }

  componentDidUpdate(prevProps) {
    const { viewMode, resetForm } = this.props;
    if (prevProps.viewMode === 'edit' && viewMode === 'add') {
      resetForm();
    }
  }

  renderForm() {
    const {
      viewMode,
      errors,
      touched,
      values,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      isAdmin,
      userList,
      setClubViewMode,
    } = this.props;
    const buttonText = (viewMode === 'add') ? 'Create' : 'Update';
    // console.log('userList:', userList);
    const ownerOptions = userList.map((user) => {
      return { value: user.user_id, label: user.displayName };
    });
    // console.log('ownerOptions', ownerOptions);
    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="shortName">
          Abbreviation
            <Field
              name="shortName"
              placeholder="Standard abbreviation for club"
              autoComplete="off"
            />
            { touched.shortName && errors.shortName && <div className="ui warning message">{errors.shortName}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="fullName">
          Full name
            <Field
              name="fullName"
              placeholder="Full name of club"
              autoComplete="off"
            />
            { touched.fullName && errors.fullName && <div className="ui warning message">{errors.fullName}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="country">
          Country
            <Select
              id="country"
              placeholder="Country in which club is based"
              isClearable
              options={countryOptions}
              onChange={value => setFieldValue('country', value)}
              onBlur={() => setFieldTouched('country', true)}
              value={values.country}
            />
            { touched.country && errors.country && <div className="ui warning message">{errors.country}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="website">
          Website
            <Field
              name="website"
              placeholder="Address of club website"
              autoComplete="off"
            />
            { touched.website && errors.website && <div className="ui warning message">{errors.website}</div> }
          </label>
        </div>
        {(viewMode === 'edit' && isAdmin)
          ? (
            <div className="field">
              <label htmlFor="owner">
              Owner
                <Select
                  id="owner"
                  placeholder="Owner of club record in this database"
                  options={ownerOptions}
                  onChange={value => setFieldValue('owner', value)}
                  onBlur={() => setFieldTouched('owner', true)}
                  value={values.owner}
                />
                { touched.owner && errors.owner && <div className="ui warning message">{errors.owner}</div> }
              </label>
            </div>
          )
          : null
        }
        <button type="submit" className="ui button primary" disabled={isSubmitting}>{buttonText}</button>
        <button
          type="button"
          className="ui button right floated"
          onClick={() => setClubViewMode('view')}
        >
        Cancel
        </button>
      </Form>
    );
  }

  render() {
    const { viewMode } = this.props;
    // console.log(viewMode, selectedClub);
    const headerText = (viewMode === 'add')
      ? 'Create Club'
      : 'Edit Club Details';
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderForm()}
      </div>
    );
  }
}
// {(viewMode === 'edit') ? `${selectedClub._id}, ${selectedClub.orisId}` : null}

const formikClubEdit = withFormik({
  mapPropsToValues({ selectedClub, viewMode }) {
    // const source = selectedClub || {};
    if (viewMode === 'edit' && selectedClub) {
      return {
        shortName: selectedClub.shortName || '',
        fullName: selectedClub.fullName || '',
        country: countryOptions.filter(el => el.value === selectedClub.country) || null,
        website: selectedClub.website || '',
        owner: { value: selectedClub.owner._id, label: selectedClub.owner.displayName },
      };
    }
    return {
      shortName: '',
      fullName: '',
      country: null,
      website: '',
    };
  },
  validationSchema: Yup.object().shape({
    shortName: Yup.string().required('You must provide the club\'s abbreviation or short name.'),
    fullName: Yup.string().required('You must provide the club\'s full name.'),
    website: Yup.string().url('You must provide a valid URL (including http(s)://).'),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      viewMode,
      createClub,
      updateClub,
      setClubViewMode,
      selectedClub,
      getClubList,
    } = props;
    const valuesToSubmit = (values.country)
      ? { ...values, country: values.country.value }
      : { ...values, country: '' };
    if (values.owner) valuesToSubmit.owner = values.owner.value;
    if (viewMode === 'add') {
      setTimeout(() => createClub(valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          getClubList(null, () => setClubViewMode('view'));
        } else {
          setSubmitting(false);
        }
      }), 2000); // simulate network delay
    } else {
      setTimeout(() => updateClub(selectedClub._id, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          getClubList(null, () => setClubViewMode('view'));
        } else {
          setSubmitting(false);
        }
      }), 2000); // simulate network delay
    }
  },
})(ClubEdit);

export default formikClubEdit;
