import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import Collapse from '../Collapse';

const UserFilter = ({
  searchField,
  setUserSearchField,
  getUserList,
}) => {
  const title = <Trans>Search for users</Trans>;
  return (
    <div className="ui segment">
      <div className="ui items">
        <Collapse title={title}>
          <div className="ui icon input fluid">
            <I18n>
              {({ i18n }) => (
                <input
                  type="search"
                  placeholder={i18n._(t`User search filter`)}
                  onChange={setUserSearchField}
                  value={searchField}
                />
              )}
            </I18n>
            <i className="circular search icon" />
          </div>
          <div className="ui divider" />
          <div className="ui form">
            <button type="button" className="ui tiny button" onClick={() => getUserList()}>
              <Trans>Refresh list</Trans>
            </button>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

UserFilter.propTypes = {
  searchField: PropTypes.string.isRequired,
  setUserSearchField: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};

export default UserFilter;
