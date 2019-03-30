import React from 'react';
import PropTypes from 'prop-types';
import ClubListItem from './ClubListItem';
import Collapse from '../Collapse';

const ClubList = ({ clubs, selectClubToDisplay, setClubViewMode }) => {
  if (clubs.length === 0) {
    return (
      <div className="ui segment">
        <div className="ui message warning">{'Sorry, there aren\'t any matching clubs to display!'}</div>
      </div>
    );
  }
  const clubsArray = [...clubs]
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
          setClubViewMode={setClubViewMode}
        />
      );
    });
  return (
    <div className="ui segment">
      <Collapse title="Club list">
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
  clubs: PropTypes.arrayOf(PropTypes.object),
  selectClubToDisplay: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
};
ClubList.defaultProps = {
  clubs: [],
};

export default ClubList;
