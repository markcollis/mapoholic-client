import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const ClubHeader = ({
  searchField,
  setClubSearchField,
  setClubViewMode,
  selectClubToDisplay,
  getClubList,
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
          type="button"
          className="ui tiny button primary right floated"
          onClick={() => {
            selectClubToDisplay('');
            setClubViewMode('add');
          }}
        >
          <Trans>Add new club</Trans>
        </button>
        <button
          type="button"
          className="ui tiny button right floated"
          onClick={() => getClubList()}
        >
          <Trans>Refresh list</Trans>
        </button>
      </div>
    </div>
  );
};

ClubHeader.propTypes = {
  searchField: PropTypes.string.isRequired,
  setClubSearchField: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
  selectClubToDisplay: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
};

export default ClubHeader;
