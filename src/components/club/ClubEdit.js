import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import {
  countryOptionsLocale,
  roleOptionsLocale,
  validationErrorsLocale,
} from '../../common/formData';

// The ClubEdit component renders a form to enable club properties to be added or edited
class ClubEdit extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    isSubmitting: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    isAdmin: PropTypes.bool,
    language: PropTypes.string,
    setClubViewMode: PropTypes.func.isRequired,
    userList: PropTypes.arrayOf(PropTypes.object),
    viewMode: PropTypes.string.isRequired,
    selectedClub: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    language: 'en',
    userList: [],
  };

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
      selectedClub,
      setClubViewMode,
      setFieldTouched,
      setFieldValue,
      touched,
      userList,
      values,
      viewMode,
    } = this.props;
    const buttonText = (viewMode === 'add') ? <Trans>Create</Trans> : <Trans>Update</Trans>;
    const roleOptions = roleOptionsLocale[language];
    const ownerOptions = userList
      .map((user) => {
        const { _id: userId, role, displayName } = user;
        const roleOption = roleOptions.find((el => el.value === role));
        const roleLabel = roleOption.label;
        const label = `${displayName} (${roleLabel})`;
        return { value: userId, label };
      })
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
    const countryOptions = countryOptionsLocale[language];
    const validationErrors = validationErrorsLocale[language];
    const { _id: currentClubId } = selectedClub;

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
          onClick={() => setClubViewMode((currentClubId) ? 'view' : 'none')}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    );
  }

  render() {
    const { viewMode } = this.props;
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

const formikClubEdit = withFormik({
  mapPropsToValues({ language = 'en', selectedClub, viewMode }) {
    if (viewMode === 'edit' && selectedClub) {
      const {
        shortName,
        fullName,
        country,
        website,
        owner,
      } = selectedClub;
      const { _id: userId, displayName } = owner;
      return {
        shortName: shortName || '',
        fullName: fullName || '',
        country: countryOptionsLocale[language].find((el) => {
          return el.value === country;
        }) || null,
        website: website || '',
        owner: { value: userId, label: displayName },
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
    } = props;
    const { _id: clubId } = selectedClub;
    const valuesToSubmit = (values.country)
      ? { ...values, country: values.country.value }
      : { ...values, country: '' };
    if (values.owner) valuesToSubmit.owner = values.owner.value;
    if (viewMode === 'add') {
      createClub(valuesToSubmit, (didSucceed) => {
        if (didSucceed) setClubViewMode('view');
        else setSubmitting(false);
      });
    } else {
      updateClub(clubId, valuesToSubmit, (didSucceed) => {
        if (didSucceed) setClubViewMode('view');
        else setSubmitting(false);
      });
    }
  },
})(ClubEdit);

export default formikClubEdit;
