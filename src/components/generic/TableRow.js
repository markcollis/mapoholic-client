import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({ highlightRow, rowData }) => {
  const rowTdArray = rowData.map((row) => {
    const { render, highlight, id } = row;
    if (highlight) return <td key={id} className="active">{render}</td>;
    return <td key={id}>{render}</td>;
  });

  return (
    <tr className={(highlightRow) ? 'active' : ''}>
      {rowTdArray}
    </tr>
  );
};

TableRow.propTypes = {
  highlightRow: PropTypes.bool,
  rowData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
TableRow.defaultProps = {
  highlightRow: false,
};

export default TableRow;
