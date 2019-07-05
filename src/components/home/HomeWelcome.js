import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Trans, Plural } from '@lingui/macro';

import forest from '../../graphics/blueForest.png';
/* eslint react/jsx-one-expression-per-line: 0  */
/* warning deactivated to avoid unwanted spaces in Trans components */

const HomeWelcome = ({ auth, currentUser, ownEvents }) => {
  const attendedEvents = ownEvents.length;
  let currentUserId = null;
  let currentRole = null;
  if (currentUser) {
    const { _id: userId, role } = currentUser;
    currentUserId = userId;
    currentRole = role;
  }
  // identify user type
  const isGuest = (currentRole === 'guest');
  const isStandardOrAdmin = (currentRole === 'standard' || currentRole === 'admin');

  const uploadedMaps = ownEvents.reduce((acc, val) => {
    const runnerSelf = val.runners.find(runner => runner.user === currentUserId);
    return acc + runnerSelf.numberMaps;
  }, 0);
  const hasMaps = (uploadedMaps > 0);
  // console.log(attendedEvents, uploadedMaps);
  const uploadedMapsText = <Plural value={uploadedMaps} one="# map" other="# maps" />;
  const attendedEventsText = <Plural value={attendedEvents} one="# event" other="# events" />;

  // define links to include in welcome text with translation references
  const signUpLink = <Link to="/signup"><Trans>sign up</Trans></Link>;
  const logInLink = <Link to="/login"><Trans>log in</Trans></Link>;
  const eventsListLink = <Link to="/events"><Trans>by name</Trans></Link>;
  const eventsMapLink = <Link to="/eventsmap"><Trans>on a map</Trans></Link>;
  const myEventsListLink = <Link to="/mymaps"><Trans>by name</Trans></Link>;
  const myEventsMapLink = <Link to="/mymapsmap"><Trans>on a map</Trans></Link>;

  const guestWelcome = (
    <p>
      <Trans>
        As a guest user, you are able to browse or search for maps {eventsListLink}
        or {eventsMapLink}, but can not upload or comment on them. If you would like
        to add some maps of your own, please {signUpLink} for an individual account.
      </Trans>
    </p>
  );
  const newUserWelcome = (
    <p>
      <Trans>
        You have not yet uploaded any maps. Why not start now?
      </Trans>
    </p>
  );
  const standardWelcome = (
    <p>
      <Trans>
        You have already uploaded {uploadedMapsText} from {attendedEventsText}.
        You can browse or search for them either {myEventsListLink} or {myEventsMapLink}.
      </Trans>
    </p>
  );
  const visitorWelcome = (
    <>
      <p>
        <Trans>
          Do you have a large collection of orienteering maps neatly filed away? Can you
          never bear to throw away a map? Do you wish it was easier to search your collection?
          Do you have easy access to your route choices and results for each event?
          Are you interested in seeing your friends&apos; maps and routes as well?
        </Trans>
      </p>
      <p><Trans>Then MapOholic might be for you!</Trans></p>
      <p>
        <Trans>
          Please {signUpLink} or {logInLink} to use all the exciting features of this site.
          If you would like to see more before you sign up, some of the maps are visible
          to unregistered visitors too, you can search for them {eventsListLink} or
          {eventsMapLink}.
        </Trans>
      </p>
    </>
  );

  return (
    <div className="ui segment">
      <img className="ui medium right floated image home-image" src={forest} alt="MapOholic logo" />
      <p className="home-welcome-header"><Trans>Welcome to MapOholic!</Trans></p>
      <p><Trans>Dedicated to those that know you can never have too many maps...</Trans></p>
      {(auth) ? <p><Trans>You are currently logged in.</Trans></p> : visitorWelcome}
      {(isGuest) ? guestWelcome : ''}
      {(isStandardOrAdmin && hasMaps) ? standardWelcome : ''}
      {(isStandardOrAdmin && !hasMaps) ? newUserWelcome : ''}
    </div>
  );
};

HomeWelcome.propTypes = {
  auth: PropTypes.string,
  currentUser: PropTypes.objectOf(PropTypes.any),
  ownEvents: PropTypes.arrayOf(PropTypes.any),
};
HomeWelcome.defaultProps = {
  auth: null,
  currentUser: null,
  ownEvents: [],
};

export default HomeWelcome;
