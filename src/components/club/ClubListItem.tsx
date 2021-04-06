import React, { FunctionComponent } from 'react';
import { countryCodesConversion } from '../../common/formData';

import { IClubDetails, ClubViewMode } from '../../types/club';

interface ClubListItemProps {
  club: IClubDetails;
  selectClubToDisplay: (clubId: string) => void;
  selectedClubId: string;
  setClubViewMode: (viewMode: ClubViewMode) => void;
}

// The ClubListItem component renders the basic details for an individual
// club and can be selected to trigger the display of full details.
const ClubListItem: FunctionComponent<ClubListItemProps> = ({
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
  const handleSelect = (): void => {
    selectClubToDisplay(clubId);
    setClubViewMode(ClubViewMode.View);
  };
  return (
    <div
      className={cardClass}
      role="button"
      onClick={handleSelect}
      onKeyPress={handleSelect}
      tabIndex={0}
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

export default ClubListItem;
