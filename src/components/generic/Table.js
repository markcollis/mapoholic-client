// The Table component and its constituent components are intended to provide
// a simple way of rendering tables consistently, supporting:
//  - filter (matching any part of a row)
//  - pagination (break up long tables)
//  - sorting (on any column)
//  - highlighting (row or single element)

// Initially developed for HomeAdminActivity, now also used in EventResults
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import TableFilter from './TableFilter';
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';
import TableRow from './TableRow';

import { simplifyString } from '../../common/conversions';

/* eslint react/destructuring-assignment: 0 */
class Table extends Component {
  state = {
    filter: '',
    pageNumber: 1,
    rowsPerPage: this.props.defaultRowsPerPage,
    sortColumn: null,
    sortAscending: true,
  };

  static propTypes = {
    defaultRowsPerPage: PropTypes.number,
    language: PropTypes.string.isRequired,
    requestRefreshCollapse: PropTypes.func,
    showPagination: PropTypes.bool,
    showFilter: PropTypes.bool,
    tableData: PropTypes.arrayOf(PropTypes.object),
    tableHead: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    requestRefreshCollapse: () => {},
    defaultRowsPerPage: 10,
    showPagination: true,
    showFilter: true,
    tableData: [],
    tableHead: [],
  }

  setTableFilter = (event) => {
    this.setState({ filter: event.target.value });
    const { requestRefreshCollapse } = this.props;
    requestRefreshCollapse();
  };

  getKeyedData = memoize((tableData) => {
    // console.log('getting keyed data');
    const keyedData = tableData.map((row, index) => {
      const keyedRowData = row.rowData.map((item, innerIndex) => {
        const { render, sort } = item;
        return {
          ...item,
          sort: sort || render, // use render text for sorting if not explicitly specified
          id: innerIndex, // to use as persistent key for presentation
        };
      });
      return {
        ...row,
        rowData: keyedRowData,
        id: index, // to use as persistent key when filtering or sorting the same input data
      };
    });
    return keyedData;
  });

  getFilteredData = memoize((keyedData, filter) => {
    // console.log('getting filtered data');
    const target = simplifyString(filter);
    const filteredData = keyedData.filter((data) => {
      const { rowData } = data;
      const matching = rowData.filter((element) => {
        const { sort } = element;
        if (typeof sort !== 'string') return false;
        const test = simplifyString(sort);
        return (test.includes(target));
      });
      const matchFound = matching.length > 0;
      return matchFound;
    });
    return filteredData;
  });

  getSortedData = memoize((filteredData, sortColumn, sortAscending) => {
    // console.log('getting sorted data', sortColumn, sortAscending);
    if (sortColumn === null) return filteredData;
    const sortedData = [...filteredData].sort((a, b) => {
      const { rowData: rowDataA } = a;
      const sortValueA = rowDataA[sortColumn].sort;
      const { rowData: rowDataB } = b;
      const sortValueB = rowDataB[sortColumn].sort;
      if (sortValueA === sortValueB) return 0;
      if (sortValueA === '') return 1; // always send blank fields to the bottom
      if (sortValueB === '') return -1;
      if (sortAscending) {
        if (sortValueA > sortValueB) return 1;
        if (sortValueA < sortValueB) return -1;
      } else {
        if (sortValueA < sortValueB) return 1;
        if (sortValueA > sortValueB) return -1;
      }
      return 0;
    });
    return sortedData;
  });

  getPageData = memoize((sortedData, pageNumber, rowsPerPage) => {
    // console.log('getting page data', pageNumber, rowsPerPage);
    const first = rowsPerPage * (pageNumber - 1);
    const last = first + rowsPerPage;
    const pageData = sortedData.slice(first, last);
    return pageData;
  });

  getTotalPages = memoize((sortedData, rowsPerPage) => {
    // console.log('getting total pages');
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    return totalPages;
  });

  renderTableData = (data) => {
    // console.log('rendering table data');
    if (!data) return <tr />;
    const tableRowArray = data.map((row) => {
      const { highlightRow, id, rowData } = row;
      if (highlightRow) return <TableRow key={id} highlightRow rowData={rowData} />;
      return <TableRow key={id} rowData={rowData} />;
    });
    return tableRowArray;
  }

  setPageNumber = (page) => {
    if (typeof page !== 'number') throw new Error('page must be a number');
    // console.log('Changing page number to:', page);
    this.setState({ pageNumber: page });
    const { requestRefreshCollapse } = this.props;
    requestRefreshCollapse();
  };

  setRowsPerPage = (rows) => {
    if (typeof rows !== 'number') throw new Error('number of rows must be a number');
    // console.log('Changing number of rows to:', rows);
    this.setState({ rowsPerPage: rows });
    const { requestRefreshCollapse } = this.props;
    requestRefreshCollapse();
  };

  setSortColumn = (colIndex) => {
    if (typeof colIndex !== 'number') throw new Error('column index must be a number');
    const { sortColumn, sortAscending } = this.state;
    if (sortColumn === colIndex) {
      if (sortAscending) {
        this.setState({ sortAscending: false });
      } else {
        this.setState({ sortColumn: null });
      }
    } else {
      this.setState({ sortColumn: colIndex, sortAscending: true });
    }
  };

  render() {
    const {
      language,
      showFilter,
      showPagination,
      tableData,
      tableHead,
    } = this.props;
    const {
      filter,
      pageNumber,
      rowsPerPage,
      sortColumn,
      sortAscending,
    } = this.state;
    if (!tableData) return null;
    const keyedData = this.getKeyedData(tableData);
    const filteredData = this.getFilteredData(keyedData, filter);
    const sortedData = this.getSortedData(filteredData, sortColumn, sortAscending);
    const totalPages = (showPagination)
      ? this.getTotalPages(sortedData, rowsPerPage)
      : 1;
    // need this check as filtering may have reduced the total number of pages
    const pageNumberToUse = (pageNumber > totalPages) ? totalPages : pageNumber;
    const pageData = (showPagination)
      ? this.getPageData(sortedData, pageNumberToUse, rowsPerPage)
      : sortedData;

    return (
      <div className="table-component">
        {(showFilter)
          ? <TableFilter filter={filter} setTableFilter={this.setTableFilter} />
          : ''}
        {(showPagination)
          ? (
            <TablePagination
              language={language}
              pageNumber={pageNumberToUse}
              rowsPerPage={rowsPerPage}
              setPageNumber={this.setPageNumber}
              setRowsPerPage={this.setRowsPerPage}
              totalPages={totalPages}
            />
          )
          : ''}
        <table className="ui celled sortable unstackable compact small table">
          <thead>
            <TableHeader
              tableHead={tableHead}
              setSortColumn={this.setSortColumn}
              sortColumn={sortColumn}
              sortAscending={sortAscending}
            />
          </thead>
          <tbody>
            {this.renderTableData(pageData)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
