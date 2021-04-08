import React, { FunctionComponent, ChangeEventHandler } from 'react';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { ClubViewMode } from '../../types/club';

interface ClubHeaderProps {
  getClubList: () => void;
  searchField: string;
  setClubSearchField: ChangeEventHandler;
  setClubViewMode: (viewMode: ClubViewMode) => void;
  viewMode: ClubViewMode;
}

// The ClubHeader component renders the search bar and other controls at
// the top of the club view
const ClubHeader: FunctionComponent<ClubHeaderProps> = ({
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
            setClubViewMode(ClubViewMode.Add);
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

export default ClubHeader;
