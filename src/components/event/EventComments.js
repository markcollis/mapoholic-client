import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Collapse from '../Collapse';
import { reformatDate } from '../../common/conversions';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventComments = ({
  selectedEvent,
  selectedRunner,
}) => {
  // console.log('selectedEvent:', selectedEvent);
  const runnerData = (selectedEvent.runners)
    ? selectedEvent.runners.find(runner => runner.user._id.toString() === selectedRunner)
    : null;
  const hasComments = runnerData && runnerData.comments.length > 0;

  const commentsList = (hasComments)
    ? [...runnerData.comments]
      .sort((a, b) => parseInt(a.postedAt, 10) - parseInt(b.postedAt, 10))
      .map((comment) => {
        const {
          _id,
          author,
          text,
          postedAt,
          updatedAt,
        } = comment;
        const { displayName, fullName } = author;
        const postedDate = reformatDate(postedAt.slice(0, 10));
        const updatedDate = reformatDate(updatedAt.slice(0, 10));
        const datesToDisplay = (postedDate === updatedDate)
          ? `posted ${postedDate}`
          : `posted ${postedDate}, updated ${updatedDate}`;
        return (
          <div key={_id}>
            <p>{text}</p>
            <p>{`${displayName} (${fullName})`}</p>
            <p>{datesToDisplay}</p>
          </div>
        );
      })
    : null;
  const commentsToDisplay = (hasComments)
    ? (
      <div>
        {commentsList}
      </div>
    )
    : <p><Trans>There are no comments yet.</Trans></p>;
  const title = <Trans>Comments</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {commentsToDisplay}
      </Collapse>
    </div>
  );
};

EventComments.propTypes = {
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
};
EventComments.defaultProps = {
  selectedEvent: {},
  selectedRunner: '',
};

export default EventComments;
