import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

const TablePagination = ({
  pageNumber,
  rowsPerPage,
  setPageNumber,
  setRowsPerPage,
  totalPages,
}) => {
  const prevButtonDisabled = (pageNumber === 1);
  const nextButtonDisabled = (pageNumber === totalPages);
  const handlePrevButtonClick = () => setPageNumber(pageNumber - 1);
  const handleNextButtonClick = () => setPageNumber(pageNumber + 1);
  const pageNumberOptions = Array.from(new Array(totalPages), (x, i) => {
    return (<option key={i} value={i + 1}>{i + 1}</option>);
  });
  const handlePageNumberSelectChange = (e) => {
    const pageSelected = parseInt(e.target.options[e.target.selectedIndex].value, 10);
    setPageNumber(pageSelected);
  };
  const rowsPerPageOptions = ['10', '20', '50', '100', 'all'].map((option) => {
    return (<option key={option} value={option}>{option}</option>);
  });
  const handleRowsPerPageSelectChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex].value;
    const pageSelected = (selectedOption === 'all') ? 1000 : parseInt(selectedOption, 10);
    setRowsPerPage(pageSelected);
  };

  return (
    <span className="floatedright">
      <button
        type="button"
        className="circular ui icon basic button table-control-margin"
        disabled={prevButtonDisabled}
        onClick={handlePrevButtonClick}
      >
        <i className="arrow left icon" />
      </button>
      <Trans>Page</Trans>
      <select
        className="ui dropdown table-control-margin"
        onChange={handlePageNumberSelectChange}
        value={pageNumber}
      >
        {pageNumberOptions}
      </select>
      <Trans>{`of ${totalPages}`}</Trans>
      <button
        type="button"
        className="circular ui icon basic button table-control-margin"
        disabled={nextButtonDisabled}
        onClick={handleNextButtonClick}
      >
        <i className="arrow right icon" />
      </button>
      <select
        className="ui dropdown table-control-margin"
        onChange={handleRowsPerPageSelectChange}
        value={(rowsPerPage === 1000) ? 'all' : rowsPerPage}
      >
        {rowsPerPageOptions}
      </select>
      <Trans>rows per page</Trans>
    </span>
  );
};

TablePagination.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default TablePagination;
