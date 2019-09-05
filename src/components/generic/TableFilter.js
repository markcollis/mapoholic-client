import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

// The TableFilter component renders a search filter for a table
const TableFilter = ({ filter, setTableFilter }) => {
  return (
    <span className="ui icon input">
      <I18n>
        {({ i18n }) => (
          <input
            type="search"
            placeholder={i18n._(t`Filter table`)}
            onChange={setTableFilter}
            value={filter}
          />
        )}
      </I18n>
      <i className="circular search icon" />
    </span>
  );
};

TableFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  setTableFilter: PropTypes.func.isRequired,
};

export default TableFilter;
