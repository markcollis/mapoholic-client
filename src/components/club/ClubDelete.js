import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

const ClubDelete = ({
  selectedClub,
  deleteClub,
  setClubViewMode,
  getClubList,
}) => {
  // console.log('selectedClub:', selectedClub);
  if (!selectedClub) return null;
  const { _id: clubId, shortName } = selectedClub;
  return (
    <div className="ui segment">
      <h3><Trans>Delete Club</Trans></h3>
      <p>
      What will happen?
      Note: need to clarify what will happen to MemberOf and OrganisedBy references!
      </p>
      <button
        type="button"
        className="ui tiny red button"
        onClick={() => {
          deleteClub(clubId, (didSucceed) => {
            if (didSucceed) getClubList(null, () => setClubViewMode('none'));
          });
          // setTimeout(() => deleteClub(clubId, (didSucceed) => {
          //   if (didSucceed) {
          //     getClubList(null, () => setClubViewMode('none'));
          //   }
          // }), 1000); // simulate network delay
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
  selectedClub: PropTypes.objectOf(PropTypes.any),
  deleteClub: PropTypes.func.isRequired,
  setClubViewMode: PropTypes.func.isRequired,
  getClubList: PropTypes.func.isRequired,
};
ClubDelete.defaultProps = {
  selectedClub: null,
};

export default ClubDelete;
