import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGB from 'date-fns/locale/en-GB';
import cs from '../../common/cs';
import { countryOptionsLocale, regionOptionSets, typesOptionsLocale } from '../data';
import { dateToDateString, dateStringToDate } from '../../common/conversions';

registerLocale('cs', cs);
registerLocale('en', enGB);

/* eslint no-underscore-dangle: 0 */

// createEventOris={createEventOris}
// getEventListOris={getEventListOris}

// renders form to either create or edit an event record
class EventEdit extends Component {
  static propTypes = {
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    values: PropTypes.objectOf(PropTypes.any).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    language: PropTypes.string,
    isAdmin: PropTypes.bool,
    userList: PropTypes.arrayOf(PropTypes.object),
    clubList: PropTypes.arrayOf(PropTypes.object),
    eventList: PropTypes.arrayOf(PropTypes.object),
    eventLinkList: PropTypes.arrayOf(PropTypes.object),
    orisList: PropTypes.arrayOf(PropTypes.object),
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    resetForm: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    getEventList: PropTypes.func,
    eventMode: PropTypes.string.isRequired,
    setEventViewModeEvent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    language: 'en',
    isAdmin: false,
    userList: [],
    eventList: [],
    eventLinkList: [],
    clubList: [],
    orisList: [],
    selectedEvent: {},
    getEventList: () => {},
  };

  state = {
    // countryOptions: [],
    orisOptions: [],
    regionOptions: [],
    tagsOptions: [{ value: 'default', label: 'default' }],
    // typesOptions: [],
  };

  componentDidMount() {
    const {
      eventList,
      eventMode,
      // language,
      getEventList,
      orisList,
      selectedEvent,
    } = this.props;
    if (eventList && eventList.length === 0 && eventMode === 'edit') getEventList();
    // this.setState({
    //   countryOptions: countryOptionsLocale[language],
    //   typesOptions: typesOptionsLocale[language],
    // });
    if (selectedEvent && selectedEvent.locCountry) {
      this.setState({ regionOptions: regionOptionSets[selectedEvent.locCountry] });
    }
    const newTagsOptions = (selectedEvent.tags && selectedEvent.tags.length > 0)
      ? selectedEvent.tags.map((tag) => {
        return { value: tag, label: tag };
      })
      : [{ value: 'default', label: 'default set to be defined' }];
    this.setState({ tagsOptions: newTagsOptions });
    if (orisList && orisList.length > 0) {
      const populatedOrisOptions = orisList
        .filter(orisEvent => !orisEvent.includedEvents) // remove multi-day
        .filter(orisEvent => orisEvent.date < dateToDateString(new Date())) // remove future
        .sort((a, b) => { // sort so most recent are listed first
          return (a.date < b.date) ? 0 : -1;
        })
        .map((orisEvent) => {
          const { orisEventId, name, date } = orisEvent;
          const value = orisEventId;
          const label = `${orisEventId}: ${name} (${date})`;
          return { value, label };
        });
      this.setState({ orisOptions: populatedOrisOptions });
    }
    // if (eventMode === 'add') {
    //   console.log('checking for ORIS events now');
    //   getEventListOris((success) => {
    //     if (success) {
    //       const { orisList } = this.props;
    //       console.log('current props:', this.props);
    //       console.log('oris event list:', orisList);
    //       if (orisList.length > 0) {
    //         const populatedOrisOptions = orisList.map((orisEvent) => {
    //           const value = orisEvent.orisEventId;
    //           const label = `${orisEvent.name} (${orisEvent.date})`;
    //           return { value, label };
    //         });
    //         this.setState({ orisOptions: populatedOrisOptions });
    //       }
    //     }
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    const {
      eventMode,
      // language,
      resetForm,
    } = this.props;
    if (prevProps.eventMode === 'edit' && eventMode === 'add') {
      resetForm();
    }
  }

  renderForm() {
    const {
      orisOptions,
      regionOptions,
      tagsOptions,
    } = this.state;
    // console.log('state:', this.state);
    const {
      language,
      eventMode,
      errors,
      touched,
      values,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      isAdmin,
      userList,
      clubList,
      eventLinkList,
      setEventViewModeEvent,
    } = this.props;
    const buttonText = (eventMode === 'add') ? <Trans>Create</Trans> : <Trans>Update</Trans>;
    const ownerOptions = (userList.length > 0)
      ? userList.map((user) => {
        return { value: user.user_id, label: user.displayName };
      })
      : [{ value: null, label: 'no users in list' }];
    // console.log('ownerOptions', ownerOptions);
    const organisedByOptions = clubList.map((club) => {
      return { value: club._id, label: club.shortName };
    });
    // console.log('organisedByOptions:', organisedByOptions);
    const linkedToOptions = eventLinkList.map((link) => {
      return { value: link._id, label: link.displayName };
    });
    // console.log('linkedToOptions:', linkedToOptions);
    // console.log('values:', values);
    // console.log('tagsOptions:', tagsOptions);
    const countryOptions = countryOptionsLocale[language];
    const typesOptions = typesOptionsLocale[language];
    // const orisOptions = [{ value: 'test', label: 'test' }];

    return (
      <Form className="ui warning form" noValidate>
        {(eventMode === 'add')
          ? (
            <div className="field">
              <label htmlFor="orisId">
                <Trans>Create event using ORIS data</Trans>
                <I18n>
                  {({ i18n }) => (
                    <CreatableSelect
                      id="orisId"
                      isClearable
                      placeholder={i18n._(t`Enter ORIS event ID or select from your recent events`)}
                      options={orisOptions}
                      onChange={(value) => {
                        setFieldValue('orisId', value);
                        setFieldValue('name', value ? value.value : '');
                      }}
                      onBlur={() => setFieldTouched('orisId', true)}
                      value={values.orisId}
                    />
                  )}
                </I18n>
                { touched.orisId && errors.orisId && <div className="ui warning message">{errors.orisId}</div> }
              </label>
            </div>
          )
          : null
        }
        { (values.orisId)
          ? null
          : (
            <div>
              <div className="field">
                <label htmlFor="date">
                  <Trans>Date</Trans>
                  <div>
                    <DatePicker
                      locale={language}
                      name="date"
                      selected={values.date}
                      onChange={value => setFieldValue('date', value)}
                      onBlur={() => setFieldTouched('date', true)}
                    />
                  </div>
                  { touched.date && errors.date && <div className="ui warning message">{errors.date}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="name">
                  <Trans>Name</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="name"
                        placeholder={i18n._(t`Name of event (required)`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.name && errors.name && <div className="ui warning message">{errors.name}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="mapName">
                  <Trans>Map name</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="mapName"
                        placeholder={i18n._(t`Name of map used for event`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.mapName && errors.mapName && <div className="ui warning message">{errors.mapName}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="locPlace">
                  <Trans>Location</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="locPlace"
                        placeholder={i18n._(t`Location of event (e.g. nearest town)`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.locPlace && errors.locPlace && <div className="ui warning message">{errors.locPlace}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="locCountry">
                  <Trans>Country</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Select
                        id="locCountry"
                        placeholder={i18n._(t`Location (country)`)}
                        isClearable
                        options={countryOptionsLocale[language]}
                        onChange={(value) => {
                          setFieldValue('locCountry', value);
                          // console.log('regionOptionSets[value]', regionOptionSets[value]);
                          // console.log('value', value);
                          if (value) {
                            this.setState({ regionOptions: regionOptionSets[value.value] });
                          }
                        }}
                        onBlur={() => setFieldTouched('locCountry', true)}
                        value={(values.locCountry)
                          ? countryOptions.find(el => el.value === values.locCountry.value)
                          : null}
                      />
                    )}
                  </I18n>
                  { touched.locCountry && errors.locCountry && <div className="ui warning message">{errors.locCountry}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="locRegions">
                  <Trans>Region(s) (customisable)</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <CreatableSelect
                        id="locRegions"
                        placeholder={i18n._(t`Region(s) associated with event`)}
                        options={regionOptions}
                        isClearable
                        isMulti
                        onChange={value => setFieldValue('locRegions', value)}
                        onBlur={() => setFieldTouched('locRegions', true)}
                        value={values.locRegions}
                      />
                    )}
                  </I18n>
                  { touched.locRegions && errors.locRegions && <div className="ui warning message">{errors.locRegions}</div> }
                </label>
              </div>
              <div className="fields">
                <div className="eight wide field">
                  <label htmlFor="locLat">
                    <Trans>Latitude</Trans>
                    <I18n>
                      {({ i18n }) => (
                        <Field
                          name="locLat"
                          type="number"
                          min="-90"
                          max="90"
                          placeholder={i18n._(t`Event location (latitude)`)}
                          autoComplete="off"
                        />
                      )}
                    </I18n>
                    { touched.locLat && errors.locLat && <div className="ui warning message">{errors.locLat}</div> }
                  </label>
                </div>
                <div className="eight wide field">
                  <label htmlFor="locLong">
                    <Trans>Longitude</Trans>
                    <I18n>
                      {({ i18n }) => (
                        <Field
                          name="locLong"
                          type="number"
                          min="-180"
                          max="180"
                          placeholder={i18n._(t`Event location (longitude)`)}
                          autoComplete="off"
                        />
                      )}
                    </I18n>
                    { touched.locLong && errors.locLong && <div className="ui warning message">{errors.locLong}</div> }
                  </label>
                </div>
              </div>
              <div className="field">
                <label htmlFor="types">
                  <Trans>Type(s) of event</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Select
                        id="types"
                        placeholder={i18n._(t`Type of event`)}
                        options={typesOptionsLocale[language]}
                        isMulti
                        onChange={value => setFieldValue('types', value)}
                        onBlur={() => setFieldTouched('types', true)}
                        value={values.types.map((type) => {
                          return typesOptions.find(el => el.value === type.value);
                        })}
                      />
                    )}
                  </I18n>
                  { touched.types && errors.types && <div className="ui warning message">{errors.types}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="tags">
                  <Trans>Tags (customisable)</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <CreatableSelect
                        id="tags"
                        placeholder={i18n._(t`Tags for event`)}
                        options={tagsOptions}
                        isMulti
                        onChange={value => setFieldValue('tags', value)}
                        onBlur={() => setFieldTouched('tags', true)}
                        value={values.tags}
                      />
                    )}
                  </I18n>
                  { touched.tags && errors.tags && <div className="ui warning message">{errors.tags}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="website">
                  <Trans>Website</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="website"
                        placeholder={i18n._(t`Address of event website`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.website && errors.website && <div className="ui warning message">{errors.website}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="results">
                  <Trans>Results</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="results"
                        placeholder={i18n._(t`Link to event results`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.results && errors.results && <div className="ui warning message">{errors.results}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="organisedBy">
                  <Trans>Organised by</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Select
                        id="organisedBy"
                        placeholder={i18n._(t`Clubs that event is organised by`)}
                        options={organisedByOptions}
                        isMulti
                        onChange={value => setFieldValue('organisedBy', value)}
                        onBlur={() => setFieldTouched('organisedBy', true)}
                        value={values.organisedBy}
                      />
                    )}
                  </I18n>
                  { touched.organisedBy && errors.organisedBy && <div className="ui warning message">{errors.organisedBy}</div> }
                </label>
              </div>
              <div className="field">
                <label htmlFor="linkedTo">
                  <Trans>Linked to</Trans>
                  <I18n>
                    {({ i18n }) => (
                      <Select
                        id="linkedTo"
                        placeholder={i18n._(t`Groups of other events that this event is linked to`)}
                        options={linkedToOptions}
                        isMulti
                        onChange={value => setFieldValue('linkedTo', value)}
                        onBlur={() => setFieldTouched('linkedTo', true)}
                        value={values.linkedTo}
                      />
                    )}
                  </I18n>
                  { touched.linkedTo && errors.linkedTo && <div className="ui warning message">{errors.linkedTo}</div> }
                </label>
              </div>
            </div>
          )}
        {(eventMode === 'edit' && isAdmin)
          ? (
            <div className="field">
              <label htmlFor="owner">
                <Trans>Owner</Trans>
                <I18n>
                  {({ i18n }) => (
                    <Select
                      id="owner"
                      placeholder={i18n._(t`Owner of event record in this database`)}
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
        <button type="submit" className="ui button tiny primary" disabled={isSubmitting}>{buttonText}</button>
        <button
          type="button"
          className="ui button tiny right floated"
          onClick={() => {
            if (eventMode === 'add') {
              setEventViewModeEvent('none');
            } else {
              setEventViewModeEvent('view');
            }
          }}
        >
          <Trans>Cancel</Trans>
        </button>
      </Form>
    );
  }

  render() {
    const { eventMode } = this.props;
    const headerText = (eventMode === 'add')
      ? <Trans>Create Event</Trans>
      : <Trans>Edit Event Details</Trans>;
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderForm()}
      </div>
    );
  }
}

const formikEventEdit = withFormik({
  mapPropsToValues({ selectedEvent, eventMode, language }) {
    if (eventMode === 'edit' && selectedEvent) {
      // console.log('initialised:', countryOptionsLocale[language].filter((el) => {
      //   return el.value === selectedEvent.locCountry;
      // }) || null);
      return {
        owner: { value: selectedEvent.owner._id, label: selectedEvent.owner.displayName },
        date: dateStringToDate(selectedEvent.date),
        name: selectedEvent.name,
        mapName: selectedEvent.mapName || '',
        locPlace: selectedEvent.locPlace || '',
        locRegions: selectedEvent.locRegions.map((region) => {
          if (!selectedEvent.locCountry) return null;
          const regionOptions = regionOptionSets[selectedEvent.locCountry];
          // console.log('regionOptions in mapPropsToValues', regionOptions);
          const selectedRegion = regionOptions.filter(el => el.value === region)[0];
          // console.log('selectedRegion in mapPropsToValues', selectedRegion);
          return selectedRegion;
        }) || [],
        locCountry: countryOptionsLocale[language].find((el) => {
          return el.value === selectedEvent.locCountry;
        }) || null,
        locLat: selectedEvent.locLat || '',
        locLong: selectedEvent.locLong || '',
        types: selectedEvent.types.map((type) => {
          return typesOptionsLocale[language].find(el => el.value === type);
        }) || [],
        tags: selectedEvent.tags.map((tag) => {
          return { value: tag, label: tag };
        }) || [],
        website: selectedEvent.website || '',
        results: selectedEvent.results || '',
        organisedBy: selectedEvent.organisedBy.map((club) => {
          return {
            value: club._id,
            label: club.shortName,
          };
        }) || [],
        linkedTo: selectedEvent.linkedTo.map((link) => {
          return {
            value: link._id,
            label: link.displayName,
          };
        }) || [],
      };
    }
    return {
      orisId: null,
      date: new Date(),
      name: '',
      mapName: '',
      locPlace: '',
      locRegions: [],
      locCountry: null,
      locLat: '',
      locLong: '',
      types: [],
      tags: [],
      website: '',
      results: '',
      organisedBy: [],
      linkedTo: [],
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('You must provide a name for the event.'),
    mapName: Yup.string(),
    locPlace: Yup.string(),
    locLat: Yup.number().moreThan(-90, 'Not a valid latitude (<-90°)').lessThan(90, 'Not a valid latitude (>90°)'),
    locLong: Yup.number().moreThan(-180, 'Not a valid longitude (<-180°)').lessThan(180, 'Not a valid longitude (>180°)'),
    website: Yup.string().url('You must provide a valid URL (including http(s)://).'),
    results: Yup.string().url('You must provide a valid URL (including http(s)://).'),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      eventMode,
      createEvent,
      createEventOris,
      updateEvent,
      setEventViewModeEvent,
      selectedEvent,
      getEventList,
    } = props;
    const valuesToSubmit = (values.locCountry)
      ? { ...values, locCountry: values.locCountry.value }
      : { ...values, locCountry: '' };
    valuesToSubmit.locRegions = (values.locRegions.length > 0)
      ? values.locRegions.map(el => el.value)
      : [];
    valuesToSubmit.types = (values.types.length > 0)
      ? values.types.map(el => el.value)
      : [];
    valuesToSubmit.tags = (values.tags.length > 0)
      ? values.tags.map(el => el.value)
      : [];
    valuesToSubmit.organisedBy = (values.organisedBy.length > 0)
      ? values.organisedBy.map(el => el.value)
      : [];
    valuesToSubmit.linkedTo = (values.linkedTo.length > 0)
      ? values.linkedTo.map(el => el.value)
      : [];
    valuesToSubmit.date = dateToDateString(values.date);
    if (values.owner) valuesToSubmit.owner = values.owner.value;
    // console.log('valuesToSubmit:', valuesToSubmit);
    if (eventMode === 'add') {
      if (values.orisId) {
        createEventOris(values.orisId.value, (didSucceed) => {
          if (didSucceed) {
            getEventList(null, () => setEventViewModeEvent('view'));
          } else {
            setSubmitting(false);
          }
        });
      } else {
        createEvent(valuesToSubmit, (didSucceed) => {
          if (didSucceed) {
            getEventList(null, () => setEventViewModeEvent('view'));
          } else {
            setSubmitting(false);
          }
        });
      }
    } else {
      updateEvent(selectedEvent._id, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          getEventList(null, () => setEventViewModeEvent('view'));
        } else {
          setSubmitting(false);
        }
      });
    }
  },
})(EventEdit);

export default formikEventEdit;
