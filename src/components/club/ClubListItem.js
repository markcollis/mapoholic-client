import React from 'react';
import PropTypes from 'prop-types';

const ClubListItem = ({ club, selectClubToDisplay, setClubViewMode }) => {
  const {
    _id: clubId,
    shortName,
    fullName,
  } = club;
  // console.log('club:', club);
  return (
    <div
      className="ui centered card"
      role="button"
      onClick={() => {
        selectClubToDisplay(clubId);
        setClubViewMode('view');
      }}
      onKeyPress={() => {
        selectClubToDisplay(clubId);
        setClubViewMode('view');
      }}
      tabIndex="0"
    >
      <div className="content">
        <div className="header">
          {shortName}
        </div>
        <div className="meta">
          <p>{fullName}</p>
        </div>
      </div>
    </div>
  );
};

ClubListItem.propTypes = {
  club: PropTypes.objectOf(PropTypes.any).isRequired,
  selectClubToDisplay: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
};

export default ClubListItem;
