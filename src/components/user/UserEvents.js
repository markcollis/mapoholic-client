import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../Collapse';

const UserEvents = ({ eventsList, selectUserEvent }) => {
  if (eventsList.length === 0) {
    return null;
  }

  const userEventsArray = eventsList.map((eachEvent) => {
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
    const typesTags = types.concat(tags);
    return (
      <div
        key={eventId}
        className="ui card fluid"
        role="button"
        onClick={() => selectUserEvent(eventId)}
        onKeyPress={() => selectUserEvent(eventId)}
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
          {userEventsArray}
        </div>
      </Collapse>
    </div>
  );
};

UserEvents.propTypes = {
  eventsList: PropTypes.arrayOf(PropTypes.object),
  selectUserEvent: PropTypes.func.isRequired,
};
UserEvents.defaultProps = {
  eventsList: [],
};

export default UserEvents;
