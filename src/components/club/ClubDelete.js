import React from 'react';
import PropTypes from 'prop-types';
/* eslint no-underscore-dangle: 0 */

const ClubDelete = ({
  selectedClub,
  deleteClub,
  setClubViewMode,
  getClubList,
}) => {
  console.log('selectedClub:', selectedClub);
  if (!selectedClub) return null;
  return (
    <div className="ui segment">
      <h3>Delete Club</h3>
      <button
        type="button"
        className="ui red button"
        onClick={() => {
          setTimeout(() => deleteClub(selectedClub._id, (didSucceed) => {
            if (didSucceed) {
              getClubList(null, () => setClubViewMode('none'));
            }
          }), 2000); // simulate network delay
        }}
      >
        {`Delete ${selectedClub.shortName}?`}
      </button>
      <p>Note: need to clarify what will happen to MemberOf and OrganisedBy references!</p>
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
