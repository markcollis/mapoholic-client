import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { countryOptionsLocale, validationErrorsLocale } from '../../common/data';
/* eslint no-underscore-dangle: 0 */

// renders form to submit credentials either for login or creating account
class ClubEdit extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    isSubmitting: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    getUserList: PropTypes.func,
    isAdmin: PropTypes.bool,
    language: PropTypes.string,
    setClubViewMode: PropTypes.func.isRequired,
    userList: PropTypes.arrayOf(PropTypes.object),
    viewMode: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    language: 'en',
    getUserList: () => {},
    userList: [],
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
      errors,
      isAdmin,
      isSubmitting,
      language,
      setClubViewMode,
      setFieldTouched,
      setFieldValue,
      touched,
      userList,
      values,
      viewMode,
    } = this.props;
    const buttonText = (viewMode === 'add') ? <Trans>Create</Trans> : <Trans>Update</Trans>;
    // console.log('userList:', userList);
    const ownerOptions = userList.map((user) => {
      return { value: user.user_id, label: user.displayName };
    });
    // console.log('ownerOptions', ownerOptions);
    const countryOptions = countryOptionsLocale[language];
    const validationErrors = validationErrorsLocale[language];

    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="shortName">
            <Trans>Abbreviation</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="shortName"
                  placeholder={i18n._(t`Standard abbreviation for club`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.shortName && errors.shortName
              && <div className="ui warning message">{validationErrors[errors.shortName] || '!'}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="fullName">
            <Trans>Full name</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="fullName"
                  placeholder={i18n._(t`Full name of club`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.fullName && errors.fullName
              && <div className="ui warning message">{validationErrors[errors.fullName] || '!'}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="country">
            <Trans>Country</Trans>
            <I18n>
              {({ i18n }) => (
                <Select
                  id="country"
                  placeholder={i18n._(t`Country in which club is based`)}
                  isClearable
                  options={countryOptions}
                  onChange={value => setFieldValue('country', value)}
                  onBlur={() => setFieldTouched('country', true)}
                  value={(values.country)
                    ? countryOptions.find(el => el.value === values.country.value)
                    : null}
                />
              )}
            </I18n>
            { touched.country && errors.country && <div className="ui warning message">{errors.country}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="website">
            <Trans>Website</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="website"
                  placeholder={i18n._(t`Address of club website`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.website && errors.website
              && <div className="ui warning message">{validationErrors[errors.website] || '!'}</div> }
          </label>
        </div>
        {(viewMode === 'edit' && isAdmin)
          ? (
            <div className="field">
              <label htmlFor="owner">
                <Trans>Owner</Trans>
                <I18n>
                  {({ i18n }) => (
                    <Select
                      id="owner"
                      placeholder={i18n._(t`Owner of club record in this database`)}
                      options={ownerOptions}
                      onChange={value => setFieldValue('owner', value)}
                      onBlur={() => setFieldTouched('owner', true)}
                      value={values.owner}
                    />
                  )}
                </I18n>
                { touched.owner && errors.owner && <div className="ui warning message">{errors.owner}</div> }
              </label>
            </div>
          )
          : null
        }
        <button type="submit" className="ui button primary" disabled={isSubmitting}>
          {buttonText}
        </button>
        <button
          type="button"
          className="ui button right floated"
          onClick={() => setClubViewMode('view')}
        >
          <Trans>Cancel</Trans>
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
  mapPropsToValues({ language = 'en', selectedClub, viewMode }) {
    // const source = selectedClub || {};
    if (viewMode === 'edit' && selectedClub) {
      return {
        shortName: selectedClub.shortName || '',
        fullName: selectedClub.fullName || '',
        country: countryOptionsLocale[language].find((el) => {
          return el.value === selectedClub.country;
        }) || null,
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
    shortName: Yup.string().required('clubShortNameRequired'),
    fullName: Yup.string().required('clubFullNameRequired'),
    website: Yup.string().url('invalidUrl'),
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
