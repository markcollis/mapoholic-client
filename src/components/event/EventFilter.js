import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import Collapse from '../generic/Collapse';

const EventFilter = ({
  currentUser,
  searchField,
  clearEventSearchField,
  setEventSearchField,
  setEventViewModeEvent,
  selectEventForDetails,
  getEventList,
}) => {
  const title = <Trans>Search for events</Trans>;
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title={title}>
          <div className="ui icon input fluid">
            <I18n>
              {({ i18n }) => (
                <input
                  type="search"
                  placeholder={i18n._(t`Event search filter`)}
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
          <div className="ui divider" />
          <button type="button" className="ui tiny button" onClick={() => getEventList()}>
            <Trans>Refresh list</Trans>
          </button>
          {(currentUser)
            ? (
              <button
                type="button"
                className="ui tiny right floated button"
                onClick={() => {
                  selectEventForDetails('');
                  setEventViewModeEvent('add');
                }}
              >
                <Trans>Add new event</Trans>
              </button>
            )
            : null}
        </Collapse>
      </div>
    </div>
  );
};

EventFilter.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  searchField: PropTypes.string.isRequired,
  clearEventSearchField: PropTypes.func.isRequired,
  setEventSearchField: PropTypes.func.isRequired,
  setEventViewModeEvent: PropTypes.func.isRequired,
  selectEventForDetails: PropTypes.func.isRequired,
  getEventList: PropTypes.func.isRequired,
};
EventFilter.defaultProps = {
  currentUser: null,
};

export default EventFilter;
