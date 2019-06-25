import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import ClubListItem from './ClubListItem';
import Collapse from '../Collapse';

const ClubList = ({
  clubList,
  selectClubToDisplay,
  selectedClubId,
  setClubViewMode,
}) => {
  if (clubList.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">
          <Trans>{'Sorry, there aren\'t any matching clubs to display!'}</Trans>
        </div>
      </div>
    );
  }
  const clubsArray = [...clubList]
    .sort((a, b) => {
      return (a.shortName > b.shortName) ? 0 : -1;
    })
    .map((club) => {
      const { _id: clubId } = club;
      return (
        <ClubListItem
          key={clubId}
          club={club}
          selectClubToDisplay={selectClubToDisplay}
          selectedClubId={selectedClubId}
          setClubViewMode={setClubViewMode}
        />
      );
    });
  const title = <Trans>Club list</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div
          className="ui link cards card-list"
          role="button"
          onClick={(e) => {
            if (e.target.classList.contains('cards')) {
              selectClubToDisplay('');
              setClubViewMode('none');
            }
          }}
          onKeyPress={(e) => {
            if (e.target.classList.contains('cards')) {
              selectClubToDisplay('');
              setClubViewMode('none');
            }
          }}
          tabIndex="0"
        >
          {clubsArray}
        </div>
      </Collapse>
    </div>
  );
};

ClubList.propTypes = {
  clubList: PropTypes.arrayOf(PropTypes.object),
  selectClubToDisplay: PropTypes.func.isRequired,
  selectedClubId: PropTypes.string.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
};
ClubList.defaultProps = {
  clubList: [],
};

export default ClubList;
