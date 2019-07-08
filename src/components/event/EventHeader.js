import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const EventFilter = ({
  clearEventSearchField,
  clearEventTagFilter,
  currentUser,
  getEventList,
  mineOnly,
  searchField,
  selectEventId,
  setEventSearchField,
  setEventTagFilter,
  setEventViewModeEvent,
  tagFilter,
  tagLists,
}) => {
  // const dropdownStyle = {};
  // if (tagFilter === '') dropdownStyle.color = 'rgba(0, 0, 0, 0.3)';
  let dropdownClass = 'ui dropdown event-header__tag-filter';
  if (tagFilter === '') dropdownClass = dropdownClass.concat('--empty');
  if (tagLists.eventTags.includes(tagFilter)) dropdownClass = dropdownClass.concat('--event');
  if (tagLists.personalTags.includes(tagFilter)) dropdownClass = dropdownClass.concat('--personal');
  return (
    <div className="ui stackable grid">
      <div className="column five wide">
        <div className="ui icon input fluid">
          <I18n>
            {({ i18n }) => (
              <input
                type="search"
                placeholder={i18n._(t`Search for events`)}
                onChange={setEventSearchField}
                value={searchField}
              />
            )}
          </I18n>
          <i
            role="button"
            className="close icon link"
            onClick={clearEventSearchField}
            onKeyPress={clearEventSearchField}
            tabIndex="0"
          />
        </div>
      </div>
      <div className="column five wide">
        <div className="ui form">
          <div className="ui right labeled input event-header__tag-filter">
            <I18n>
              {({ i18n }) => (
                <select
                  value={tagFilter}
                  className={dropdownClass}
                  onChange={setEventTagFilter}
                >
                  <option value="" disabled hidden>
                    {i18n._(t`Filter by tag`)}
                  </option>
                  <optgroup label={i18n._(t`Event tags`)}>
                    {tagLists.eventTags.map((tag) => {
                      return <option className="event-header__tag-filter--event" key={tag}>{tag}</option>;
                    })}
                  </optgroup>
                  <optgroup label={i18n._(t`Personal tags`)}>
                    {tagLists.personalTags.map((tag) => {
                      return <option className="event-header__tag-filter--personal" key={tag}>{tag}</option>;
                    })}
                  </optgroup>
                </select>
              )}
            </I18n>
            <div className="ui basic label">
              <i
                role="button"
                className="close icon link"
                onClick={clearEventTagFilter}
                onKeyPress={clearEventTagFilter}
                tabIndex="0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="column six wide middle aligned">
        {(currentUser && !mineOnly) // suppress for MyMaps view as new event would not show
          ? (
            <button
              type="button"
              className="ui tiny button primary right floated"
              onClick={() => {
                selectEventId('');
                setEventViewModeEvent('add');
              }}
            >
              <Trans>Add event</Trans>
            </button>
          )
          : null}
        <button type="button" className="ui tiny button right floated" onClick={() => getEventList()}>
          <Trans>Refresh list</Trans>
        </button>
      </div>
    </div>
  );
};

EventFilter.propTypes = {
  clearEventSearchField: PropTypes.func.isRequired,
  clearEventTagFilter: PropTypes.func.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  getEventList: PropTypes.func.isRequired,
  mineOnly: PropTypes.bool.isRequired,
  searchField: PropTypes.string.isRequired,
  selectEventId: PropTypes.func.isRequired,
  setEventSearchField: PropTypes.func.isRequired,
  setEventTagFilter: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  tagFilter: PropTypes.string.isRequired,
  tagLists: PropTypes.objectOf(PropTypes.any).isRequired,
};
EventFilter.defaultProps = {
  currentUser: null,
};

export default EventFilter;
