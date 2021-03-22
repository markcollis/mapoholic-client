import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { validationErrorsLocale } from '../../common/formData';

// The EventLinkedEdit component renders a form to either create or edit an event link record
class EventLinkedEdit extends Component {
  static propTypes = {
    // Formik
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    isSubmitting: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    // passed down from parent
    eventLinkMode: PropTypes.string.isRequired,
    eventList: PropTypes.arrayOf(PropTypes.object),
    language: PropTypes.string.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
  };

  componentDidUpdate(prevProps) {
    const { eventLinkMode, resetForm } = this.props;
    if (prevProps.eventLinkMode === 'edit' && eventLinkMode === 'add') {
      resetForm();
    }
  }

  renderForm() {
    const {
      errors,
      eventLinkMode,
      eventList,
      isSubmitting,
      language,
      setEventViewModeEventLink,
      setFieldTouched,
      setFieldValue,
      touched,
      values,
    } = this.props;
    const submitButtonText = (eventLinkMode === 'add') ? <Trans>Create</Trans> : <Trans>Update</Trans>;
    const sortedEventList = [...eventList].sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
    const includesOptions = sortedEventList.map((eachEvent) => {
      const { _id: eventId, name, date } = eachEvent;
      return { value: eventId, label: `${name} (${date})` };
    });
    // console.log('includesOptions:', includesOptions);
    const validationErrors = validationErrorsLocale[language];

    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="displayName">
            <Trans>Name</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="displayName"
                  placeholder={i18n._(t`Name of event link (required)`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.displayName && errors.displayName
              && <div className="ui warning message">{validationErrors[errors.displayName]}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="includes">
            <Trans>Events included</Trans>
            <I18n>
              {({ i18n }) => (
                <Select
                  id="includes"
                  placeholder={i18n._(t`Events connected by this link`)}
                  isClearable
                  isMulti
                  options={includesOptions}
                  onChange={(value) => setFieldValue('includes', value)}
                  onBlur={() => setFieldTouched('includes', true)}
                  value={values.includes}
                />
              )}
            </I18n>
            { touched.includes && errors.includes
              && <div className="ui warning message">{errors.includes}</div> }
          </label>
        </div>
        <button
          type="submit"
          className="ui button tiny primary"
          disabled={isSubmitting}
        >
          {submitButtonText}
        </button>
        <button
          type="button"
          className="ui button tiny right floated"
          onClick={() => setEventViewModeEventLink('view')}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }
}

const formikEventLinkedEdit = withFormik({
  mapPropsToValues({ eventLinkMode, linkData }) {
    if (eventLinkMode === 'edit' && linkData) {
      const { displayName, includes } = linkData;
      const sortedIncludes = [...includes].sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
      return {
        displayName,
        includes: sortedIncludes.map((includedEvent) => {
          const { _id: eventId, name, date } = includedEvent;
          return {
            value: eventId,
            label: `${name} (${date})`,
          };
        }) || [],
      };
    }
    return {
      displayName: '',
      includes: [],
    };
  },
  validationSchema: Yup.object().shape({
    displayName: Yup.string().required('eventLinkNameRequired'),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      eventLinkMode,
      createEventLink,
      linkData,
      updateEventLink,
      setEventViewModeEventLink,
    } = props;
    const valuesToSubmit = { displayName: values.displayName };
    valuesToSubmit.includes = (values.includes.length > 0)
      ? values.includes.map((el) => el.value)
      : [];
    // console.log('valuesToSubmit:', valuesToSubmit);
    if (eventLinkMode === 'add') {
      createEventLink(valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          setEventViewModeEventLink('view');
        } else {
          setSubmitting(false);
        }
      });
    } else {
      const { _id: selectedEventLinkId } = linkData;
      updateEventLink(selectedEventLinkId, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          setEventViewModeEventLink('view');
        } else {
          setSubmitting(false);
        }
      });
    }
  },
})(EventLinkedEdit);

export default formikEventLinkedEdit;
