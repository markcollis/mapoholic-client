import React from 'react';
import PropTypes from 'prop-types';
import { countryCodesConversion } from '../../common/data';

const ClubListItem = ({
  club,
  selectClubToDisplay,
  selectedClubId,
  setClubViewMode,
}) => {
  const {
    _id: clubId,
    shortName,
    fullName,
    country,
  } = club;
  const flagClass = `${countryCodesConversion[country]} flag floatedright`;
  const cardClass = (selectedClubId === clubId)
    ? 'ui fluid centered card card-list--item-selected'
    : 'ui fluid centered card';
  return (
    <div
      className={cardClass}
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
        <i className={flagClass} />
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
  selectedClubId: PropTypes.string.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
};

export default ClubListItem;
