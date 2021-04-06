import React, { FunctionComponent } from 'react';
import { Trans } from '@lingui/macro';

import { IClubDetails, ClubViewMode } from '../../types/club';

interface ClubDeleteProps {
  deleteClub: (clubId: string, callback: (didSucceed: boolean) => void) => void;
  selectedClub: IClubDetails | null;
  setClubViewMode: (viewMode: ClubViewMode) => void;
}

// The ClubDelete component provides a confirmatory prompt before deleting a club record
const ClubDelete: FunctionComponent<ClubDeleteProps> = ({
  deleteClub,
  selectedClub,
  setClubViewMode,
}) => {
  if (!selectedClub) return null;
  const { _id: clubId, shortName } = selectedClub;
  return (
    <div className="ui segment">
      <h3><Trans>Delete Club</Trans></h3>
      <p>
        <Trans>
          This will delete all records relating to this club, including
          connections with users (as members) and events (as organisers).
        </Trans>
      </p>
      <button
        type="button"
        className="ui tiny red button"
        onClick={() => {
          deleteClub(clubId, (didSucceed) => {
            if (didSucceed) setClubViewMode(ClubViewMode.None);
          });
        }}
      >
        <Trans>{`Delete ${shortName}?`}</Trans>
      </button>
      <button
        type="button"
        className="ui tiny button right floated"
        onClick={() => setClubViewMode(ClubViewMode.View)}
      >
        <Trans>Cancel</Trans>
      </button>
    </div>
  );
};

export default ClubDelete;
