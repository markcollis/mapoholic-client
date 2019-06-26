// This and its constituent components are intended to provide a simple way of
// rendering tables consistently, supporting:
//  filter (matching any part of a row)
//  pagination (break up long tables)
//  sorting (on any column)
//  highlighting (row or single element)

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import TableFilter from './TableFilter';
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';
import TableRow from './TableRow';

class Table extends Component {
  state = {
    filter: '',
    sortColumn: null,
    sortAscending: true,
  };

  static propTypes = {
    requestRefreshCollapse: PropTypes.func,
    rowsPerPage: PropTypes.number,
    showPagination: PropTypes.bool,
    showFilter: PropTypes.bool,
    tableData: PropTypes.arrayOf(PropTypes.object),
    // highlightRow: boolean, rowData: [ element, sortvalue, highlight ]
    tableHead: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    requestRefreshCollapse: null,
    rowsPerPage: 10,
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
    console.log('getting keyed data');
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
    console.log('getting filtered data');
    const target = filter.toLowerCase();
    const filteredData = keyedData.filter((data) => {
      const { rowData } = data;
      const matching = rowData.filter((element) => {
        const test = element.sort.toLowerCase();
        return (test.includes(target));
      });
      const matchFound = matching.length > 0;
      return matchFound;
    });
    return filteredData;
  });

  getSortedData = memoize((filteredData, sortColumn, sortAscending) => {
    console.log('getting sorted data', sortColumn, sortAscending);
    if (sortColumn === null) return filteredData;
    const sortedData = [...filteredData].sort((a, b) => {
      const { rowData: rowDataA } = a;
      const sortValueA = rowDataA[sortColumn].sort;
      const { rowData: rowDataB } = b;
      const sortValueB = rowDataB[sortColumn].sort;
      // console.log('sort values', a, b, sortValueA, sortValueB);
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

  renderTableData = (data) => {
    console.log('rendering table data');
    if (!data) return <tr />;
    const tableRowArray = data.map((row) => {
      const { highlightRow, id, rowData } = row;
      // console.log('a row!', id);
      if (highlightRow) return <TableRow key={id} highlightRow rowData={rowData} />;
      return <TableRow key={id} rowData={rowData} />;
    });
    return tableRowArray;
  }

  setSortColumn = (colIndex) => {
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
      showFilter,
      showPagination,
      tableData,
      tableHead,
    } = this.props;
    const {
      filter,
      sortColumn,
      sortAscending,
    } = this.state;
    if (!tableData) return null;
    const keyedData = this.getKeyedData(tableData);
    console.log('keyedData:', keyedData);
    const filteredData = this.getFilteredData(keyedData, filter);
    console.log('filteredData:', filteredData);
    const sortedData = this.getSortedData(filteredData, sortColumn, sortAscending);
    console.log('sortedData:', sortedData);

    return (
      <div>
        {(showFilter)
          ? <TableFilter filter={filter} setTableFilter={this.setTableFilter} />
          : ''}
        {(showPagination)
          ? <TablePagination />
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
            {this.renderTableData(sortedData)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
