import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  visibilityOptionsLocale,
  // validationErrorsLocale,
} from '../../common/data';

/* eslint no-underscore-dangle: 0 */

// renders form to edit runner details for a specific event and runner
class EventRunnerEdit extends Component {
  static propTypes = {
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    // selectedEvent: PropTypes.objectOf(PropTypes.any),
    // selectedRunner: PropTypes.string,
    setEventViewModeRunner: PropTypes.func.isRequired,
    tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  // static defaultProps = {
  //   language: 'en',
  //   selectedEvent: {},
  //   selectedRunner: '',
  // };

  state = {
    // selectedRunnerDetails: {},
    tagsOptions: [{ value: 'default', label: 'default' }],
  };

  componentDidMount() {
    // console.log('EventRunnerEdit mounted, props:', this.props);
    const {
      // selectedEvent,
      // selectedRunner,
      tagList,
    } = this.props;
    // const selectedRunnerDetails = selectedEvent.runners
    //   .find(runner => runner.user._id === selectedRunner);
    // this.setState({ selectedRunnerDetails });
    const tagsOptions = tagList.map((tag) => {
      return { value: tag, label: tag };
    });
    this.setState({ tagsOptions });
    console.log('mounted with tagsOptions;', tagsOptions);
    // const newTagsOptions = (selectedRunnerDetails.tags && selectedRunnerDetails.tags.length > 0)
    //   ? selectedRunnerDetails.tags.map((tag) => {
    //     return { value: tag, label: tag };
    //   })
    //   : [{ value: 'default', label: 'default set to be defined' }];
    // this.setState({ tagsOptions: newTagsOptions });
  }

  renderForm() {
    const {
      // selectedRunnerDetails,
      tagsOptions,
    } = this.state;
    // console.log('props:', this.props);
    // console.log('state:', this.state);
    const {
      language,
      errors,
      touched,
      values,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      // isAdmin,
      setEventViewModeRunner,
    } = this.props;
    const visibilityOptions = visibilityOptionsLocale[language];
    // const validationErrors = validationErrorsLocale[language];

    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="courseTitle">
            <Trans>Course title</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="courseTitle"
                  placeholder={i18n._(t`Title of course`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.courseTitle && errors.courseTitle
              && <div className="ui warning message">{errors.courseTitle}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="courseLength">
            <Trans>Course length</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="courseLength"
                  placeholder={i18n._(t`Length of course (km)`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.courseLength && errors.courseLength
              && <div className="ui warning message">{errors.courseLength}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="courseClimb">
            <Trans>Course climb</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="courseClimb"
                  placeholder={i18n._(t`Climb on course (m)`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.courseClimb && errors.courseClimb
              && <div className="ui warning message">{errors.courseClimb}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="courseControls">
            <Trans>Number of controls</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="courseControls"
                  placeholder={i18n._(t`Number of controls on course`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.courseControls && errors.courseControls
              && <div className="ui warning message">{errors.courseControls}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="time">
            <Trans>Time</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="time"
                  placeholder={i18n._(t`Time taken`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.time && errors.time
              && <div className="ui warning message">{errors.time}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="place">
            <Trans>Place</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="place"
                  placeholder={i18n._(t`Placing in field`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.place && errors.place
              && <div className="ui warning message">{errors.place}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="timeBehind">
            <Trans>Time behind winner</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="timeBehind"
                  placeholder={i18n._(t`Time behind the winner`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.timeBehind && errors.timeBehind
              && <div className="ui warning message">{errors.timeBehind}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="fieldSize">
            <Trans>Field size</Trans>
            <I18n>
              {({ i18n }) => (
                <Field
                  name="fieldSize"
                  placeholder={i18n._(t`Total number of runners`)}
                  autoComplete="off"
                />
              )}
            </I18n>
            { touched.fieldSize && errors.fieldSize
              && <div className="ui warning message">{errors.fieldSize}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="tags">
            <Trans>Tags (customisable)</Trans>
            <I18n>
              {({ i18n }) => (
                <CreatableSelect
                  id="tags"
                  placeholder={i18n._(t`Personal tags for event`)}
                  options={tagsOptions}
                  isMulti
                  onChange={value => setFieldValue('tags', value)}
                  onBlur={() => setFieldTouched('tags', true)}
                  value={values.tags}
                />
              )}
            </I18n>
            { touched.tags && errors.tags
              && <div className="ui warning message">{errors.tags}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="visibility">
            <Trans>Visibility</Trans>
            <I18n>
              {({ i18n }) => (
                <Select
                  id="visibility"
                  placeholder={i18n._(t`Visibility of your maps from this event to others`)}
                  options={visibilityOptions}
                  onChange={value => setFieldValue('visibility', value)}
                  onBlur={() => setFieldTouched('visibility', true)}
                  value={values.visibility}
                />
              )}
            </I18n>
            { touched.visibility && errors.visibility
              && <div className="ui warning message">{errors.visibility}</div> }
          </label>
        </div>
        <button
          type="submit"
          className="ui button tiny primary"
          disabled={isSubmitting}
        >
          <Trans>Update</Trans>
        </button>
        <button
          type="button"
          className="ui button tiny right floated"
          onClick={() => setEventViewModeRunner('view')}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    );
  }

  render() {
    return (
      <div className="ui segment">
        <h3 className="header"><Trans>Edit Event Runner Details</Trans></h3>
        {this.renderForm()}
      </div>
    );
  }
}

const formikEventRunnerEdit = withFormik({
  mapPropsToValues({ selectedEvent, selectedRunner, language }) {
    const selectedRunnerDetails = selectedEvent.runners
      .find(runner => runner.user._id === selectedRunner);
    return {
      // user: not allowed to change this
      visibility: visibilityOptionsLocale[language]
        .find(el => el.value === selectedRunnerDetails.visibility),
      courseTitle: selectedRunnerDetails.courseTitle || '',
      courseLength: selectedRunnerDetails.courseLength || '',
      courseClimb: selectedRunnerDetails.courseClimb || '',
      courseControls: selectedRunnerDetails.courseControls || '',
      // fullResults: not currently editable, in future would be in EventResults component
      time: selectedRunnerDetails.time || '',
      place: selectedRunnerDetails.place || '',
      timeBehind: selectedRunnerDetails.timeBehind || '',
      fieldSize: selectedRunnerDetails.fieldSize || '',
      tags: selectedRunnerDetails.tags.map((tag) => {
        return { value: tag, label: tag };
      }) || [],
      // maps: edit via EventMapViewer component
      // comments: edit via EventComments component
    };
  },
  validationSchema: Yup.object().shape({
    courseTitle: Yup.string(),
    courseLength: Yup.string(),
    courseClimb: Yup.string(),
    courseControls: Yup.string(),
    time: Yup.string(),
    place: Yup.string(),
    timeBehind: Yup.string(),
    fieldSize: Yup.string(),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      selectedEvent,
      selectedRunner,
      setEventViewModeRunner,
      updateEventRunner,
    } = props;
    const valuesToSubmit = { ...values, visibility: values.visibility.value };
    valuesToSubmit.tags = (values.tags && values.tags.length > 0)
      ? values.tags.map(el => el.value)
      : [];
    // console.log('valuesToSubmit:', valuesToSubmit);
    updateEventRunner(selectedEvent._id, selectedRunner, valuesToSubmit, (didSucceed) => {
      if (didSucceed) {
        // console.log('updated runner successfully - is anything else needed?');
        setEventViewModeRunner('view');
      } else {
        setSubmitting(false);
      }
    });
  },
})(EventRunnerEdit);

export default formikEventRunnerEdit;
