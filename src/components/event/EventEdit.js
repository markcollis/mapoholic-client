import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGB from 'date-fns/locale/en-GB';
import cs from '../../common/cs';
import { countryOptions, regionOptionSets, typesOptions } from '../data';
import { dateToDateString, dateStringToDate } from '../../common/conversions';

registerLocale('cs', cs);
registerLocale('en', enGB);

/* eslint no-underscore-dangle: 0 */
// 00100300

// createEventOris={createEventOris}
// getEventListOris={getEventListOris}

// renders form to submit credentials either for login or creating account
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
    selectedEvent: {},
    getEventList: () => {},
  };

  state = {
    regionOptions: [],
    tagsOptions: [{ value: 'default', label: 'default' }],
  };

  componentDidMount() {
    const {
      eventList,
      getEventList,
      eventMode,
      selectedEvent,
    } = this.props;
    if (eventList && eventList.length === 0 && eventMode === 'edit') getEventList();
    if (selectedEvent && selectedEvent.locCountry) {
      this.setState({ regionOptions: regionOptionSets[selectedEvent.locCountry] });
    }
    const newTagsOptions = (selectedEvent.tags && selectedEvent.tags.length > 0)
      ? selectedEvent.tags.map((tag) => {
        return { value: tag, label: tag };
      })
      : [{ value: 'updated', label: 'updated' }];
    console.log('newTagsOptions:', newTagsOptions);
    this.setState({ tagsOptions: newTagsOptions });
    // if (selectedEvent && selectedEvent.tags && selectedEvent.tags.length > 0) {
    //   this.setState({
    //     tagsOptions: selectedEvent.tags.map((tag) => {
    //       return { value: tag, label: tag };
    //     }),
    //   });
    // }
    console.log('cs locale:', cs);
    console.log('en locale:', enGB);
  }

  componentDidUpdate(prevProps) {
    const { eventMode, resetForm } = this.props;
    if (prevProps.eventMode === 'edit' && eventMode === 'add') {
      resetForm();
    }
  }

  renderForm() {
    const { regionOptions, tagsOptions } = this.state;
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
    const buttonText = (eventMode === 'add') ? 'Create' : 'Update';
    const ownerOptions = (userList.length > 0)
      ? userList.map((user) => {
        return { value: user.user_id, label: user.displayName };
      })
      : [{ value: null, label: 'no users in list' }];
    console.log('ownerOptions', ownerOptions);
    const organisedByOptions = clubList.map((club) => {
      return { value: club._id, label: club.shortName };
    });
    console.log('organisedByOptions:', organisedByOptions);
    const linkedToOptions = eventLinkList.map((link) => {
      return { value: link._id, label: link.displayName };
    });
    console.log('linkedToOptions:', linkedToOptions);
    console.log('values:', values);
    console.log('tagsOptions:', tagsOptions);

    return (
      <Form className="ui warning form" noValidate>
        <div className="field">
          <label htmlFor="date">
            Date
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
          Name
            <Field
              name="name"
              placeholder="Name of event (required)"
              autoComplete="off"
            />
            { touched.name && errors.name && <div className="ui warning message">{errors.name}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="mapName">
          Map name
            <Field
              name="mapName"
              placeholder="Name of map used for event"
              autoComplete="off"
            />
            { touched.mapName && errors.mapName && <div className="ui warning message">{errors.mapName}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="locPlace">
          Location
            <Field
              name="locPlace"
              placeholder="Location of event (e.g. nearest town)"
              autoComplete="off"
            />
            { touched.locPlace && errors.locPlace && <div className="ui warning message">{errors.locPlace}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="locRegions">
          Region(s)
            <Select
              id="locRegions"
              placeholder="Region(s) associated with event"
              options={regionOptions}
              isMulti
              onChange={value => setFieldValue('locRegions', value)}
              onBlur={() => setFieldTouched('locRegions', true)}
              value={values.locRegions}
            />
            { touched.locRegions && errors.locRegions && <div className="ui warning message">{errors.locRegions}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="locCountry">
          Country
            <Select
              id="locCountry"
              placeholder="Location (country)"
              isClearable
              options={countryOptions}
              onChange={(value) => {
                setFieldValue('locCountry', value);
                // console.log('regionOptionSets[value]', regionOptionSets[value]);
                // console.log('value', value);
                this.setState({ regionOptions: regionOptionSets[value.value] });
              }}
              onBlur={() => setFieldTouched('locCountry', true)}
              value={values.locCountry}
            />
            { touched.locCountry && errors.locCountry && <div className="ui warning message">{errors.locCountry}</div> }
          </label>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label htmlFor="locLat">
            Latitude
              <Field
                name="locLat"
                placeholder="Event location (latitude)"
                autoComplete="off"
              />
              { touched.locLat && errors.locLat && <div className="ui warning message">{errors.locLat}</div> }
            </label>
          </div>
          <div className="eight wide field">
            <label htmlFor="locLong">
            Longitude
              <Field
                name="locLong"
                placeholder="Event location (longitude)"
                autoComplete="off"
              />
              { touched.locLong && errors.locLong && <div className="ui warning message">{errors.locLong}</div> }
            </label>
          </div>
        </div>
        <div className="field">
          <label htmlFor="types">
          Type of event
            <Select
              id="types"
              placeholder="Type of event"
              options={typesOptions}
              isMulti
              onChange={value => setFieldValue('types', value)}
              onBlur={() => setFieldTouched('types', true)}
              value={values.types}
            />
            { touched.types && errors.types && <div className="ui warning message">{errors.types}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="tags">
          Tags (customisable)
            <CreatableSelect
              id="tags"
              placeholder="Tags for event"
              options={tagsOptions}
              isMulti
              onChange={value => setFieldValue('tags', value)}
              onBlur={() => setFieldTouched('tags', true)}
              value={values.tags}
            />
            { touched.tags && errors.tags && <div className="ui warning message">{errors.tags}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="website">
          Website
            <Field
              name="website"
              placeholder="Address of event website"
              autoComplete="off"
            />
            { touched.website && errors.website && <div className="ui warning message">{errors.website}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="results">
          Results
            <Field
              name="results"
              placeholder="Link to event results"
              autoComplete="off"
            />
            { touched.results && errors.results && <div className="ui warning message">{errors.results}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="organisedBy">
          Organised by
            <Select
              id="organisedBy"
              placeholder="Clubs that event is organised by"
              options={organisedByOptions}
              isMulti
              onChange={value => setFieldValue('organisedBy', value)}
              onBlur={() => setFieldTouched('organisedBy', true)}
              value={values.organisedBy}
            />
            { touched.organisedBy && errors.organisedBy && <div className="ui warning message">{errors.organisedBy}</div> }
          </label>
        </div>
        <div className="field">
          <label htmlFor="linkedTo">
          Linked to
            <Select
              id="linkedTo"
              placeholder="Groups of other events that this event is linked to"
              options={linkedToOptions}
              isMulti
              onChange={value => setFieldValue('linkedTo', value)}
              onBlur={() => setFieldTouched('linkedTo', true)}
              value={values.linkedTo}
            />
            { touched.linkedTo && errors.linkedTo && <div className="ui warning message">{errors.linkedTo}</div> }
          </label>
        </div>
        {(eventMode === 'edit' && isAdmin)
          ? (
            <div className="field">
              <label htmlFor="owner">
              Owner
                <Select
                  id="owner"
                  placeholder="Owner of event record in this database"
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
        Cancel
        </button>
      </Form>
    );
  }

  render() {
    const { eventMode } = this.props;
    const headerText = (eventMode === 'add')
      ? 'Create Event'
      : 'Edit Event Details';
    return (
      <div className="ui segment">
        <h3 className="header">{headerText}</h3>
        {this.renderForm()}
      </div>
    );
  }
}

const formikEventEdit = withFormik({
  mapPropsToValues({ selectedEvent, eventMode }) {
    if (eventMode === 'edit' && selectedEvent) {
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
        locCountry: countryOptions.filter(el => el.value === selectedEvent.locCountry) || null,
        locLat: selectedEvent.locLat || '',
        locLong: selectedEvent.locLong || '',
        types: selectedEvent.types.map((type) => {
          return { value: type, label: type };
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
  // validationSchema: Yup.object().shape({
  //   shortName: Yup.string().required('You must provide the club\'s abbreviation or short name.'),
  //   fullName: Yup.string().required('You must provide the club\'s full name.'),
  //   website: Yup.string().url('You must provide a valid URL (including http(s)://).'),
  // }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      eventMode,
      createEvent,
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
    console.log('valuesToSubmit:', valuesToSubmit);
    if (eventMode === 'add') {
      setTimeout(() => createEvent(valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          getEventList(null, () => setEventViewModeEvent('view'));
        } else {
          setSubmitting(false);
        }
      }), 1000); // simulate network delay
    } else {
      setTimeout(() => updateEvent(selectedEvent._id, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          getEventList(null, () => setEventViewModeEvent('view'));
        } else {
          setSubmitting(false);
        }
      }), 1000); // simulate network delay
    }
  },
})(EventEdit);

export default formikEventEdit;
