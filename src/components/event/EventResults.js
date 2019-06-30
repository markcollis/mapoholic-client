import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import Table from '../generic/Table';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

// Component displays results if present in event record (e.g. from ORIS)
// (manual adding, editing, deleting results to be done later)
// (consider also highlighting other registered users on same course?)
const EventResults = ({
  language,
  requestRefreshCollapse,
  selectedEvent,
  selectedRunner,
}) => {
  // console.log('selectedEvent:', selectedEvent);
  // console.log('selectedRunner:', selectedRunner);
  const runnerData = (selectedEvent.runners)
    ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
    : null;
  const hasResults = runnerData && runnerData.fullResults.length > 0;
  // console.log('hasResults:', hasResults);

  const courseTitle = (hasResults)
    ? (
      <h4>
        {`${runnerData.courseTitle} (${runnerData.courseLength}km, ${runnerData.courseClimb}m)`}
      </h4>
    )
    : null;
  const tableHead = ['', <Trans>Name</Trans>, <Trans>Club</Trans>, <Trans>Time</Trans>, <Trans>Behind</Trans>];
  const tableData = (hasResults)
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
        return {
          highlightRow: isCurrent,
          rowData: [
            { render: place },
            { render: name },
            { render: clubShort },
            { render: time },
            { render: loss },
          ],
        };
      })
    : null;

  const title = <Trans>Results</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {(hasResults) ? courseTitle : ''}
        {(hasResults)
          ? (
            <Table
              language={language}
              requestRefreshCollapse={requestRefreshCollapse}
              showPagination={false}
              tableHead={tableHead}
              tableData={tableData}
            />
          )
          : <p><Trans>Sorry, there are no results to display.</Trans></p>}
      </Collapse>
    </div>
  );
};

EventResults.propTypes = {
  language: PropTypes.string.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
};
EventResults.defaultProps = {
  selectedEvent: {},
  selectedRunner: '',
};

export default EventResults;
