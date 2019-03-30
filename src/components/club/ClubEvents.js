import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import Collapse from '../Collapse';

const ClubEvents = ({ eventsList, selectClubEvent }) => {
  if (eventsList.length === 0) {
    return null;
  }

  // const longerList = eventsList.concat(eventsList).concat(eventsList);
  // const clubEventsArray = longerList.map((eachEvent) => {
  const clubEventsArray = eventsList.map((eachEvent) => {
    const {
      _id: eventId,
      name,
      date,
      locPlace,
      types,
      tags,
      totalRunners,
      orisId,
    } = eachEvent;
    // console.log('event:', eachEvent);
    const typesTags = types.concat(tags);
    return (
      <div
        key={eventId}
        className="ui card fluid"
        role="button"
        onClick={() => selectClubEvent(eventId)}
        onKeyPress={() => selectClubEvent(eventId)}
        tabIndex="0"
      >
        <div className="content">
          <div className="header  ">
            {name}
          </div>
          <div className="meta">
            <div>{`${date}, ${locPlace}`}</div>
            {(orisId)
              ? (
                <p>
                  {`(${totalRunners} users attended) `}
                  <a href={`https://oris.orientacnisporty.cz/Zavod?id=${orisId}`}>{`ORIS ID: ${orisId}`}</a>
                </p>
              )
              : (
                <p>{`(${totalRunners} users attended)`}</p>
              )
            }
            {(typesTags && typesTags.length > 0)
              ? (
                <div>
                  {typesTags.map((type) => {
                    return <div key={type} className="ui label blue">{type}</div>;
                  })}
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="ui segment">
      <Collapse title="Events">
        <div className="ui link cards card-list">
          {clubEventsArray}
        </div>
      </Collapse>
    </div>
  );
};

ClubEvents.propTypes = {
  eventsList: PropTypes.arrayOf(PropTypes.object),
  selectClubEvent: PropTypes.func.isRequired,
};
ClubEvents.defaultProps = {
  eventsList: [],
};

export default ClubEvents;
