import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import { reformatTimestampDateOnly } from '../../common/conversions';
import Collapse from '../generic/Collapse';
import forest from '../../graphics/blueForest.jpg';

// The ClubDetails component renders information about the selected club
const ClubDetails = ({
  canEdit,
  language,
  requestRefreshCollapse,
  selectedClub,
  setClubViewMode,
}) => {
  const { _id: selectedClubId } = selectedClub;
  if (!selectedClubId) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader">
          <Trans>Loading club details...</Trans>
        </div>
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
    createdAt,
    updatedAt,
  } = selectedClub;
  const showEdit = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <div className=""><Trans>{`Owner: ${owner.displayName}`}</Trans></div>
        {(orisId)
          ? <div><Trans>{`ORIS ID: ${orisId}`}</Trans></div>
          : null}
        <div className="item">
          <Trans>
            {`Created: ${reformatTimestampDateOnly(createdAt.slice(0, 10), language)}`}
          </Trans>
        </div>
        <div className="item">
          <Trans>
            {`Last updated: ${reformatTimestampDateOnly(updatedAt.slice(0, 10), language)}`}
          </Trans>
        </div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setClubViewMode('delete')}>
          <Trans>Delete club</Trans>
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setClubViewMode('edit')}>
          <Trans>Edit club details</Trans>
        </button>
      </div>
    )
    : null;
  const displayProfile = (
    <div>
      <img
        className="club-details__background-image"
        alt="forest"
        src={forest}
        onLoad={() => {
          requestRefreshCollapse();
        }}
      />
      <div className="club-details__summary">
        <h3>{shortName}</h3>
        {(fullName)
          ? <div>{fullName}</div>
          : null}
        <div className="ui list">
          <div className="item">
            <i className="marker icon" />
            <div className="content">
              {country}
            </div>
          </div>
          <div className="item">
            <i className="linkify icon" />
            <div className="content">
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Trans>Website</Trans>
              </a>
            </div>
          </div>
        </div>
      </div>
      {showEdit}
    </div>
  );
  const title = <Trans>Club details</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {displayProfile}
      </Collapse>
    </div>
  );
};

ClubDetails.propTypes = {
  canEdit: PropTypes.bool,
  language: PropTypes.string.isRequired,
  requestRefreshCollapse: PropTypes.func.isRequired,
  selectedClub: PropTypes.objectOf(PropTypes.any),
  setClubViewMode: PropTypes.func.isRequired,
};
ClubDetails.defaultProps = {
  selectedClub: {},
  canEdit: false,
};

export default ClubDetails;
