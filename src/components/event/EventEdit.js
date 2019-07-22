import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGB from 'date-fns/locale/en-GB';
import cs from 'date-fns/locale/cs';
// import cs from '../../common/cs'; NO LONGER NEEDED AS date-fns NOW INCLUDES cs
import {
  countryOptionsLocale,
  regionOptionSets,
  roleOptionsLocale,
  typesOptionsLocale,
  validationErrorsLocale,
} from '../../common/data';
import { dateToDateString, dateStringToDate } from '../../common/conversions';
import mapCorners from '../../graphics/mapCorners.png';
import EventEditLocationMap from './EventEditLocationMap';

registerLocale('cs', cs);
registerLocale('en', enGB);

/* eslint no-underscore-dangle: 0 */

// renders form to either create or edit an event record
class EventEdit extends Component {
  static propTypes = {
    clubList: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.objectOf(PropTypes.any).isRequired, // input validation
    eventLinkList: PropTypes.arrayOf(PropTypes.object),
    eventList: PropTypes.arrayOf(PropTypes.object),
    eventMode: PropTypes.string.isRequired,
    getEventList: PropTypes.func,
    isAdmin: PropTypes.bool,
    isSubmitting: PropTypes.bool.isRequired,
    language: PropTypes.string,
    orisList: PropTypes.arrayOf(PropTypes.object),
    resetForm: PropTypes.func.isRequired,
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    setEventViewModeEvent: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
    touched: PropTypes.objectOf(PropTypes.any).isRequired,
    userList: PropTypes.arrayOf(PropTypes.object),
    values: PropTypes.objectOf(PropTypes.any).isRequired,
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
    orisOptions: [],
    regionOptions: [],
    tagsOptions: [{ value: 'default', label: 'default' }],
    showCornerLatLong: false,
  };

  componentDidMount() {
    const {
      eventList,
      eventMode,
      getEventList,
      orisList,
      selectedEvent,
      tagList,
    } = this.props;
    if (eventList && eventList.length === 0 && eventMode === 'edit') getEventList();
    if (selectedEvent && selectedEvent.locCountry) {
      this.setState({ regionOptions: regionOptionSets[selectedEvent.locCountry] });
    }
    const tagsOptions = tagList.map((tag) => {
      return { value: tag, label: tag };
    });
    this.setState({ tagsOptions });
    // console.log('mounted with tagsOptions;', tagsOptions);
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
  }

  componentDidUpdate(prevProps) {
    const {
      eventMode,
      orisList,
      resetForm,
    } = this.props;
    if (prevProps.eventMode === 'edit' && eventMode === 'add') {
      resetForm();
    }

    /* eslint react/no-did-update-set-state: 0 */
    // state update can be used because it is conditional on prop change
    if (prevProps.orisList !== orisList) {
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
  }

  renderForm() {
    const {
      orisOptions,
      regionOptions,
      tagsOptions,
      showCornerLatLong,
    } = this.state;
    // console.log('state in EventEdit:', this.state);
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
    const countryOptions = countryOptionsLocale[language];
    const roleOptions = roleOptionsLocale[language];
    const typesOptions = typesOptionsLocale[language];
    const validationErrors = validationErrorsLocale[language];
    const ownerOptions = userList
      .map((user) => {
        const roleOption = roleOptions.find((el => el.value === user.role));
        const role = roleOption.label;
        const label = `${user.displayName} (${role})`;
        return { value: user._id, label };
      })
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });
    const organisedByOptions = clubList
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
    const linkedToOptions = eventLinkList
      .map((link) => {
        return { value: link._id, label: link.displayName };
      })
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      });

    return (
      <Form className="ui warning form" noValidate>
        {(eventMode === 'add')
          ? (
            <div className="field">
              <label htmlFor="orisId">
                <Trans>Create event using ORIS data</Trans>
                {(orisOptions.length === 0)
                  ? (
                    <I18n>
                      {({ i18n }) => (
                        <CreatableSelect
                          id="orisId"
                          isClearable
                          placeholder={i18n._(t`Enter ORIS event ID (list of recent events loading or unavailable)`)}
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
                  )
                  : (
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
                  )
                }
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
                      dateFormat={(language === 'cs') ? ['d. M. yyyy', 'd/M'] : ['d/M/yyyy', 'd/M']}
                      locale={language}
                      name="date"
                      selected={values.date}
                      onChange={value => setFieldValue('date', value || new Date())}
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
                  { touched.name && errors.name
                    && <div className="ui warning message">{validationErrors[errors.name] || '!'}</div> }
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
                        options={countryOptions}
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
              <p className="event-edit__label">
                <Trans>Location of event (latitude/longitude)</Trans>
              </p>
              <div className="fields">
                <div className="eight wide field">
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="locLat"
                        type="number"
                        min="-90"
                        max="90"
                        step="0.001"
                        placeholder={i18n._(t`Event location (latitude)`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.locLat && errors.locLat
                    && <div className="ui warning message">{validationErrors[errors.locLat] || '!'}</div> }
                </div>
                <div className="eight wide field">
                  <I18n>
                    {({ i18n }) => (
                      <Field
                        name="locLong"
                        type="number"
                        min="-180"
                        max="180"
                        step="0.001"
                        placeholder={i18n._(t`Event location (longitude)`)}
                        autoComplete="off"
                      />
                    )}
                  </I18n>
                  { touched.locLong && errors.locLong
                    && <div className="ui warning message">{validationErrors[errors.locLong] || '!'}</div> }
                </div>
              </div>
              <EventEditLocationMap
                locLat={(values.locLat !== '') ? values.locLat : null}
                locLong={(values.locLong !== '') ? values.locLong : null}
                locCornerNW={(values.locCornerNWLat !== '' && values.locCornerNWLong !== '')
                  ? [values.locCornerNWLat, values.locCornerNWLong]
                  : [null, null]}
                locCornerNE={(values.locCornerNELat !== '' && values.locCornerNELong !== '')
                  ? [values.locCornerNELat, values.locCornerNELong]
                  : [null, null]}
                locCornerSW={(values.locCornerSWLat !== '' && values.locCornerSWLong !== '')
                  ? [values.locCornerSWLat, values.locCornerSWLong]
                  : [null, null]}
                locCornerSE={(values.locCornerSELat !== '' && values.locCornerSELong !== '')
                  ? [values.locCornerSELat, values.locCornerSELong]
                  : [null, null]}
              />
              {(showCornerLatLong)
                ? (
                  <>
                    <p className="event-edit__label">
                      <Trans>Locations of map corners (four latitude/longitude pairs)</Trans>
                    </p>
                    <div className="fields">
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerNWLat"
                              type="number"
                              min="-90"
                              max="90"
                              step="0.001"
                              placeholder={i18n._(t`NW`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerNWLat && errors.locCornerNWLat
                          && <div className="ui warning message">{validationErrors[errors.locCornerNWLat] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerNWLong"
                              type="number"
                              min="-180"
                              max="180"
                              step="0.001"
                              placeholder={i18n._(t`NW`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerNWLong && errors.locCornerNWLong
                          && <div className="ui warning message">{validationErrors[errors.locCornerNWLong] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerNELat"
                              type="number"
                              min="-90"
                              max="90"
                              step="0.001"
                              placeholder={i18n._(t`NE`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerNELat && errors.locCornerNELat
                          && <div className="ui warning message">{validationErrors[errors.locCornerNELat] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerNELong"
                              type="number"
                              min="-180"
                              max="180"
                              step="0.001"
                              placeholder={i18n._(t`NE`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerNELong && errors.locCornerNELong
                          && <div className="ui warning message">{validationErrors[errors.locCornerNELong] || '!'}</div> }
                      </div>
                    </div>
                    <img className="event-edit__map-corner-image" src={mapCorners} alt="map corners" />
                    <div className="fields">
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerSWLat"
                              type="number"
                              min="-90"
                              max="90"
                              step="0.001"
                              placeholder={i18n._(t`SW`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerSWLat && errors.locCornerSWLat
                          && <div className="ui warning message">{validationErrors[errors.locCornerSWLat] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerSWLong"
                              type="number"
                              min="-180"
                              max="180"
                              step="0.001"
                              placeholder={i18n._(t`SW`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerSWLong && errors.locCornerSWLong
                          && <div className="ui warning message">{validationErrors[errors.locCornerSWLong] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerSELat"
                              type="number"
                              min="-90"
                              max="90"
                              step="0.001"
                              placeholder={i18n._(t`SE`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerSELat && errors.locCornerSELat
                          && <div className="ui warning message">{validationErrors[errors.locCornerSELat] || '!'}</div> }
                      </div>
                      <div className="four wide field">
                        <I18n>
                          {({ i18n }) => (
                            <Field
                              name="locCornerSELong"
                              type="number"
                              min="-180"
                              max="180"
                              step="0.001"
                              placeholder={i18n._(t`SE`)}
                              autoComplete="off"
                            />
                          )}
                        </I18n>
                        { touched.locCornerSELong && errors.locCornerSELong
                          && <div className="ui warning message">{validationErrors[errors.locCornerSELong] || '!'}</div> }
                      </div>
                    </div>
                  </>
                )
                : (
                  <div className="field">
                    <button
                      type="button"
                      className="ui button tiny"
                      onClick={() => this.setState({ showCornerLatLong: true })}
                    >
                      <Trans>Show and edit map corner locations</Trans>
                    </button>
                  </div>
                )}
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
                        value={(values.types)
                          ? values.types.map((type) => {
                            return typesOptions.find(el => el.value === type.value);
                          })
                          : null}
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
                  { touched.website && errors.website
                    && <div className="ui warning message">{validationErrors[errors.website] || '!'}</div> }
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
                  { touched.results && errors.results
                    && <div className="ui warning message">{validationErrors[errors.results] || '!'}</div> }
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
      const roundTo3dp = (number) => {
        const result = Math.round(number * 1000) / 1000;
        return result;
      };
      return {
        owner: { value: selectedEvent.owner._id, label: selectedEvent.owner.displayName },
        date: dateStringToDate(selectedEvent.date),
        name: selectedEvent.name,
        mapName: selectedEvent.mapName || '',
        locPlace: selectedEvent.locPlace || '',
        locRegions: selectedEvent.locRegions.map((region) => {
          if (!selectedEvent.locCountry) return null;
          const regionOptions = regionOptionSets[selectedEvent.locCountry];
          const selectedRegion = regionOptions.filter(el => el.value === region)[0];
          return selectedRegion;
        }) || [],
        locCountry: countryOptionsLocale[language].find((el) => {
          return el.value === selectedEvent.locCountry;
        }) || null,
        locLat: roundTo3dp(selectedEvent.locLat) || '',
        locLong: roundTo3dp(selectedEvent.locLong) || '',
        locCornerNWLat: roundTo3dp(selectedEvent.locCornerNW[0]) || '',
        locCornerNWLong: roundTo3dp(selectedEvent.locCornerNW[1]) || '',
        locCornerNELat: roundTo3dp(selectedEvent.locCornerNE[0]) || '',
        locCornerNELong: roundTo3dp(selectedEvent.locCornerNE[1]) || '',
        locCornerSWLat: roundTo3dp(selectedEvent.locCornerSW[0]) || '',
        locCornerSWLong: roundTo3dp(selectedEvent.locCornerSW[1]) || '',
        locCornerSELat: roundTo3dp(selectedEvent.locCornerSE[0]) || '',
        locCornerSELong: roundTo3dp(selectedEvent.locCornerSE[1]) || '',
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
      locCornerNWLat: '',
      locCornerNWLong: '',
      locCornerNELat: '',
      locCornerNELong: '',
      locCornerSWLat: '',
      locCornerSWLong: '',
      locCornerSELat: '',
      locCornerSELong: '',
      types: [],
      tags: [],
      website: '',
      results: '',
      organisedBy: [],
      linkedTo: [],
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('eventNameRequired'),
    mapName: Yup.string(),
    locPlace: Yup.string(),
    locLat: Yup.number().moreThan(-90, 'invalidLatLow').lessThan(90, 'invalidLatHigh'),
    locLong: Yup.number().moreThan(-180, 'invalidLongLow').lessThan(180, 'invalidLongHigh'),
    locCornerNWLat: Yup.number().moreThan(-90, 'invalidLatLow').lessThan(90, 'invalidLatHigh'),
    locCornerNELat: Yup.number().moreThan(-90, 'invalidLatLow').lessThan(90, 'invalidLatHigh'),
    locCornerSWLat: Yup.number().moreThan(-90, 'invalidLatLow').lessThan(90, 'invalidLatHigh'),
    locCornerSELat: Yup.number().moreThan(-90, 'invalidLatLow').lessThan(90, 'invalidLatHigh'),
    locCornerNWLong: Yup.number().moreThan(-180, 'invalidLongLow').lessThan(180, 'invalidLongHigh'),
    locCornerNELong: Yup.number().moreThan(-180, 'invalidLongLow').lessThan(180, 'invalidLongHigh'),
    locCornerSWLong: Yup.number().moreThan(-180, 'invalidLongLow').lessThan(180, 'invalidLongHigh'),
    locCornerSELong: Yup.number().moreThan(-180, 'invalidLongLow').lessThan(180, 'invalidLongHigh'),
    website: Yup.string().url('invalidUrl'),
    results: Yup.string().url('invalidUrl'),
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const {
      eventMode,
      createEvent,
      createEventOris,
      updateEvent,
      setEventViewModeEvent,
      selectedEvent,
    } = props;
    const valuesToSubmit = { // simple fields first
      name: values.name,
      date: dateToDateString(values.date),
      mapName: values.mapName,
      locPlace: values.locPlace,
      locLat: values.locLat,
      locLong: values.locLong,
      website: values.website,
      results: values.results,
    };
    valuesToSubmit.locCountry = (values.locCountry) ? values.locCountry.value : '';
    valuesToSubmit.locRegions = (values.locRegions && values.locRegions.length > 0)
      ? values.locRegions.map(el => el.value)
      : [];
    valuesToSubmit.locCornerNW = [values.locCornerNWLat, values.locCornerNWLong];
    valuesToSubmit.locCornerNE = [values.locCornerNELat, values.locCornerNELong];
    valuesToSubmit.locCornerSW = [values.locCornerSWLat, values.locCornerSWLong];
    valuesToSubmit.locCornerSE = [values.locCornerSELat, values.locCornerSELong];
    valuesToSubmit.types = (values.types && values.types.length > 0)
      ? values.types.map(el => el.value)
      : [];
    valuesToSubmit.tags = (values.tags && values.tags.length > 0)
      ? values.tags.map(el => el.value)
      : [];
    valuesToSubmit.organisedBy = (values.organisedBy && values.organisedBy.length > 0)
      ? values.organisedBy.map(el => el.value)
      : [];
    valuesToSubmit.linkedTo = (values.linkedTo && values.linkedTo.length > 0)
      ? values.linkedTo.map(el => el.value)
      : [];
    if (values.owner) valuesToSubmit.owner = values.owner.value;
    // console.log('valuesToSubmit:', valuesToSubmit);
    if (eventMode === 'add') {
      if (values.orisId) {
        createEventOris(values.orisId.value, (didSucceed) => {
          if (didSucceed) {
            setEventViewModeEvent('view');
          } else {
            setSubmitting(false);
          }
        });
      } else {
        createEvent(valuesToSubmit, (didSucceed) => {
          if (didSucceed) {
            setEventViewModeEvent('view');
          } else {
            setSubmitting(false);
          }
        });
      }
    } else {
      updateEvent(selectedEvent._id, valuesToSubmit, (didSucceed) => {
        if (didSucceed) {
          setEventViewModeEvent('view');
        } else {
          setSubmitting(false);
        }
      });
    }
  },
})(EventEdit);

export default formikEventEdit;
