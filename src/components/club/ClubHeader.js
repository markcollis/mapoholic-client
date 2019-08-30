import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

// The ClubHeader component renders the search bar and other controls at
// the top of the club view
const ClubHeader = ({
  getClubList,
  searchField,
  setClubSearchField,
  setClubViewMode,
  viewMode,
}) => {
  return (
    <div className="ui stackable grid">
      <div className="column six wide">
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
      </div>
      <div className="column six wide right floated">
        <button
          disabled={(['add', 'edit', 'delete'].includes(viewMode))}
          type="button"
          className="ui tiny button primary right floated"
          onClick={() => {
            setClubViewMode('add');
          }}
        >
          <Trans>Add club</Trans>
        </button>
        <button
          type="button"
          className="ui tiny button right floated hide-on-mobile"
          onClick={() => getClubList()}
        >
          <Trans>Refresh list</Trans>
        </button>
      </div>
    </div>
  );
};

ClubHeader.propTypes = {
  getClubList: PropTypes.func.isRequired,
  searchField: PropTypes.string.isRequired,
  setClubSearchField: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
};

export default ClubHeader;
