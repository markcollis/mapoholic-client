import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

// Component displays results if present in event record (e.g. from ORIS)
// (manual adding, editing, deleting results to be done later)
// (consider also highlighting other registered users on same course?)
const EventResults = ({ selectedEvent, selectedRunner }) => {
  // console.log('selectedEvent:', selectedEvent);
  // console.log('selectedRunner:', selectedRunner);
  const runnerData = (selectedEvent.runners)
    ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
    : null;
  const hasResults = runnerData && runnerData.fullResults.length > 0;
  // console.log('hasResults:', hasResults);

  const resultsForTable = (hasResults)
    ? [...runnerData.fullResults]
      .sort((a, b) => parseInt(a.sort, 10) - parseInt(b.sort, 10))
    : null;
  console.log('resultsForTable:', resultsForTable);
  const columnsForTable = [
    { Header: '', accessor: 'place' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Club', accessor: 'clubShort' },
    { Header: 'Time', accessor: 'time' },
    { Header: 'Behind', accessor: 'loss' },
  ];
  const resultsItems = (hasResults)
    ? [...runnerData.fullResults]
      .sort((a, b) => parseInt(a.sort, 10) - parseInt(b.sort, 10))
      .map((result) => {
        const {
          place,
          name,
          regNumber,
          // club,
          clubShort,
          time,
          loss,
        } = result;
        const isCurrent = (regNumber === runnerData.user.regNumber);
        return (
          <tr key={regNumber} className={(isCurrent) ? 'active' : ''}>
            <td>{place}</td>
            <td>{name}</td>
            <td>{clubShort}</td>
            <td>{time}</td>
            <td>{loss}</td>
          </tr>
        );
      })
    : null;
  const courseTitle = (hasResults)
    ? (
      <h4>
        {`${runnerData.courseTitle} (${runnerData.courseLength}km, ${runnerData.courseClimb}m)`}
      </h4>
    )
    : null;
  const resultsToDisplay = (hasResults)
    ? (
      <div>
        {courseTitle}
        <ReactTable data={resultsForTable} columns={columnsForTable} />
        <table className="ui celled unstackable blue compact small table">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Club</th>
              <th>Time</th>
              <th>Behind</th>
            </tr>
          </thead>
          <tbody>
            {resultsItems}
          </tbody>
        </table>
      </div>
    )
    : <p><Trans>Sorry, there are no results to display.</Trans></p>;
  const title = <Trans>Results</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {resultsToDisplay}
      </Collapse>
    </div>
  );
};

EventResults.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
};
EventResults.defaultProps = {
  selectedEvent: {},
  selectedRunner: '',
};

export default EventResults;
