import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { tableAllLocale } from '../../common/formData';

// The TablePagination component renders controls to navigate the pages of a multi-page table
const TablePagination = ({
  language,
  pageNumber,
  rowsPerPage,
  setPageNumber,
  setRowsPerPage,
  totalPages,
}) => {
  const tableAll = tableAllLocale[language];
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
  const rowsPerPageOptions = ['10', '20', '50', '100', tableAll].map((option) => {
    return (<option key={option} value={option}>{option}</option>);
  });
  const handleRowsPerPageSelectChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex].value;
    const pageSelected = (selectedOption === tableAll) ? 1000 : parseInt(selectedOption, 10);
    setRowsPerPage(pageSelected);
  };

  return (
    <span className="floatedright">
      <button
        type="button"
        className="circular ui icon basic button table__control"
        disabled={prevButtonDisabled}
        onClick={handlePrevButtonClick}
      >
        <i className="arrow left icon" />
      </button>
      <Trans>Page</Trans>
      <select
        className="ui dropdown table__control"
        onChange={handlePageNumberSelectChange}
        value={pageNumber}
      >
        {pageNumberOptions}
      </select>
      <Trans>{`of ${totalPages}`}</Trans>
      <button
        type="button"
        className="circular ui icon basic button table__control"
        disabled={nextButtonDisabled}
        onClick={handleNextButtonClick}
      >
        <i className="arrow right icon" />
      </button>
      <select
        className="ui dropdown table__control"
        onChange={handleRowsPerPageSelectChange}
        value={(rowsPerPage === 1000) ? tableAll : rowsPerPage}
      >
        {rowsPerPageOptions}
      </select>
      <Trans>rows per page</Trans>
    </span>
  );
};

TablePagination.propTypes = {
  language: PropTypes.string.isRequired,
  pageNumber: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default TablePagination;
