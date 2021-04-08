import React, { FunctionComponent, EventHandler, SyntheticEvent } from 'react';
import { Trans } from '@lingui/macro';

import ClubListItem from './ClubListItem';
import Collapse from '../generic/Collapse';

import { IClubDetails, ClubViewMode } from '../../types/club';

interface ClubListProps {
  clubList: IClubDetails[];
  selectClubToDisplay: (clubId: string) => void;
  selectedClubId: string;
  setClubViewMode: (viewMode: ClubViewMode) => void;
}

// The ClubList component renders a list of clubs with basic details that
// can be selected to show further details
const ClubList: FunctionComponent<ClubListProps> = ({
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
  const handleSelect: EventHandler<SyntheticEvent> = (e) => {
    const element = e.target as HTMLDivElement;
    if (element.classList.contains('cards')) {
      selectClubToDisplay('');
      setClubViewMode(ClubViewMode.None);
    }
  };
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div
          className="ui link cards card-list"
          role="button"
          onClick={handleSelect}
          onKeyPress={handleSelect}
          tabIndex={0}
        >
          {clubsArray}
        </div>
      </Collapse>
    </div>
  );
};

export default ClubList;
