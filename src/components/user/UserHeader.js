import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

const UserHeader = ({
  searchField,
  setUserSearchField,
  getUserList,
}) => {
  return (
    <div className="ui stackable grid">
      <div className="column seven wide">
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
      </div>
      <div className="column four wide right floated">
        <button
          type="button"
          className="ui tiny button right floated"
          onClick={() => getUserList()}
        >
          <Trans>Refresh list</Trans>
        </button>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  searchField: PropTypes.string.isRequired,
  setUserSearchField: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};

export default UserHeader;
