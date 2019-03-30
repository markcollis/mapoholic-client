import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const ClubDetails = ({
  selectedClub,
  canEdit,
  setClubViewMode,
}) => {
  // console.log(selectedClub);
  if (!selectedClub._id) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader">Loading club details...</div>
      </div>
    );
  }
  const {
    owner,
    shortName,
    fullName,
    orisId,
    country,
    website,
  } = selectedClub;
  const showEdit = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <div className="">{`Owner: ${owner.displayName}`}</div>
        {(orisId)
          ? <div>{`ORIS ID: ${orisId}`}</div>
          : null}
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setClubViewMode('delete')}>
          Delete club
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setClubViewMode('edit')}>
          Edit club details
        </button>
      </div>
    )
    : null;
  const displayProfile = (
    <div>
      <h3>{shortName}</h3>
      {(fullName)
        ? <div>{fullName}</div>
        : null}
      <div className="ui list">
        <div className="item">
          <i className="marker icon" />
          {country}
        </div>
        <div className="item">
          <i className="linkify icon" />
          {website}
        </div>
        {showEdit}
      </div>
    </div>
  );
  return (
    <div className="ui segment">
      <Collapse title="Club details">
        {displayProfile}
      </Collapse>
    </div>
  );
};

ClubDetails.propTypes = {
  selectedClub: PropTypes.objectOf(PropTypes.any),
  canEdit: PropTypes.bool,
  setClubViewMode: PropTypes.func.isRequired,
};
ClubDetails.defaultProps = {
  selectedClub: {},
  canEdit: false,
};

export default ClubDetails;
