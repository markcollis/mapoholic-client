import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

import Collapse from '../Collapse';

const ClubFilter = ({
  searchField,
  setClubSearchField,
  setClubViewMode,
  selectClubToDisplay,
  getClubList,
}) => {
  const title = <Trans>Search for clubs</Trans>;
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title={title}>
          <div className="ui icon input fluid">
            <I18n>
              {({ i18n }) => (
                <input
                  type="search"
                  placeholder={i18n._(t`Club search filter`)}
                  onChange={setClubSearchField}
                  value={searchField}
                />
              )}
            </I18n>
            <i className="circular search icon" />
          </div>
          <div className="ui divider" />
          <button type="button" className="ui tiny button" onClick={() => getClubList()}>
            <Trans>Refresh list</Trans>
          </button>
          <button
            type="button"
            className="ui tiny right floated button"
            onClick={() => {
              selectClubToDisplay('');
              setClubViewMode('add');
            }}
          >
            <Trans>Add new club</Trans>
          </button>
        </Collapse>
      </div>
    </div>
  );
};

ClubFilter.propTypes = {
  searchField: PropTypes.string.isRequired,
  setClubSearchField: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
  selectClubToDisplay: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
};

export default ClubFilter;
