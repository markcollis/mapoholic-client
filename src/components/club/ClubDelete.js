import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

const ClubDelete = ({
  deleteClub,
  getClubList,
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
            if (didSucceed) getClubList(null, () => setClubViewMode('none'));
          });
        }}
      >
        <Trans>{`Delete ${shortName}?`}</Trans>
      </button>
      <button
        type="button"
        className="ui tiny button right floated"
        onClick={() => setClubViewMode('view')}
      >
        <Trans>Cancel</Trans>
      </button>
    </div>
  );
};

ClubDelete.propTypes = {
  deleteClub: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
  selectedClub: PropTypes.objectOf(PropTypes.any),
  setClubViewMode: PropTypes.func.isRequired,
};
ClubDelete.defaultProps = {
  selectedClub: null,
};

export default ClubDelete;
