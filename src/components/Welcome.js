import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trans, Plural } from '@lingui/macro';
import PropTypes from 'prop-types';
/* eslint react/jsx-one-expression-per-line: 0  */
/* warning deactivated to avoid unwanted spaces in Trans components */

const Welcome = ({ auth, currentUser, eventList }) => {
  // console.log('Props in Welcome - auth:', auth,
  // 'currentUser:', currentUser, 'eventList:', eventList);
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
  const isAdmin = (currentRole === 'admin');

  // notes for developers - to show to admin users only, no need to translate
  const adminNotes = (
    <>
      <hr />
      <p>Checklist of things still to do:</p>
      <ol>
        <li>Add some more introductory/help text on this page</li>
        <li>Remember list/map tab in MyMaps and Events when moving away</li>
        <li>Remember overview map position when moving away (is it possible?)</li>
        <li>Separate Redux state for Events/MyMaps</li>
        <li>Hide &apos;runners at event&apos; for MyMaps</li>
        <li>Add a component here to show recent activity (own or all?)</li>
        <li>Complete the translations and check that nothing is missing</li>
        <li>Centre rotation on current view when zoomed in</li>
        <li>Add some real sample data/maps (started 4/6)</li>
        <li>Design a logo, control colours on the O</li>
        <li>Draw my own version of the tree background, or find a royalty free one</li>
        <li>Take a photo of a pile of O maps to use as a background</li>
        <li>Test it out on a real Internet-facing server</li>
      </ol>
      <p>What has already been done:</p>
      <ol>
        <li>
          <del>Investigate unauthorized /users/me request when logging in</del>
          {' (fixed 18/5)'}
        </li>
        <li>
          <del>Make use of map thumbnails/thin extracts</del>
          {' (added thumbnail to EventDetails 18/5, extract to EventListItem 18/5)'}
        </li>
        <li>
          <del>Enable HTTPS</del>
          {' (done 19/5)'}
        </li>
        <li>
          <del>
          Add option to process blank course maps used with QR
          (black border: top 66px, others 1px)
          </del>
          {' (added 19/5)'}
        </li>
        <li>
          <del>Add translation hooks to all hardcoded text</del>
          {' (first pass of all components complete 22/5)'}
        </li>
        <li>
          <del>Investigate image resize bug if uploaded maps are too small</del>
          {' (fixed 22/5)'}
        </li>
        <li>
          <del>Implement delete runner on server</del>
          {' (done 23/5)'}
        </li>
        <li>
          <del>
          Clarify what happens to OrganisedBy and MemberOf references if club is deleted,
          updating ClubDelete as appropriate
          </del>
          {' (implemented on back end 23/5)'}
        </li>
        <li>
          <del>Add some links to Footer (Github, my email?)</del>
          {' (added 23/5)'}
        </li>
        <li>
          <del>
            Clarify what happens to owner, runners and comment references if user is deleted,
            updating UserDelete as appropriate. Thoughts: Club/owner and Event/owner leave as
            is, only admin can see xxx (deleted) in UI. Set visibility of all runner records
            to private (i.e. not actual deletion, admin can see/recover). Comments should stay
            - filter out `deleted` part of name.
          </del>
          {' (Runner visibility change set up 23/5, inactive users stripped from runners returned by API 27/5, comment authors now include active and profileImage fields 28/5)'}
        </li>
        <li>
          <del>
            Split up events controller on server into several smaller files
            (Comment/Event/EventLink/EventRunner/Map)
          </del>
          {' (done 28/5)'}
        </li>
        <li>
          <del>Refactor User and Club pages to align with Event best practice</del>
          {' (Club completed 20/5, User completed 30/5)'}
        </li>
        <li>
          <del>Add a bit more visual identity</del>
          {' (added flags and tree background to Club page 30/5, others look OK for now)'}
        </li>
        <li>
          <del>Improve layout of MapView to put map first</del>
          {' (done 31/5)'}
        </li>
        <li>
          <del>
          Choose a better name... how about MapOholic, or is it too contrived?
          (O)MapArchive? (O)MapBrowser? (O)MapStore?
          </del>
          {' (MapOholic it is! 4/6)'}
        </li>
        <li>
          <del>Re-enable live check of ORIS for recent events</del>
          &nbsp;(done 4/6 with much refactoring required - check for null lists now done
          in Header component, further refinement 5/6 and 6/6)
        </li>
        <li>
          <del>Check that all temporary setTimeouts have been removed</del>
          &nbsp;(done 5/6)
        </li>
        <li>
          <del>Simplify list handling in actions/reducers/container components</del>
          &nsbp;(completed 6/6)
        </li>
        <li>
          <del>Load background image on event list when first uploaded</del>
          &nbsp;(done 6/6 - refresh event list within map upload/delete actions;
          further improvement 7/6 to avoid unnecessary network traffic)
        </li>
        <li>
          <del>
          Fix appearance of EventListItem and EventDetails when there is a map
          but not much other information
          </del>
          &nbsp;(done 7/6)
        </li>
        <li>
          <del>Add new events to own event list when you add yourself as a runner</del>
          &nbsp;(done 7/6)
        </li>
        <li>
          <del>Check for other components that could use CollapseTrigger function</del>
          &nbsp;(EventDetails trigger when thumbnail image loaded 30/5, UserDetails trigger
          when forest background loaded 7/6)
        </li>
        <li>
          <del>Trigger a Collapse refresh on window resize</del>
          &nbsp;(done 7/6)
        </li>
        <li>
          <del>Go to map directly from list selection when viewing MyMaps</del>
          &nbsp;(done 12/6)
        </li>
      </ol>
      <p>Other ideas for the future (non-essential):</p>
      <ol>
        <li>
          Investigate overlays - drawing own route, adding annotations, etc. =&gt;
          need to be able to save too... *react-canvas-draw*
        </li>
        <li>Investigate making results editable/uploadable if not on ORIS</li>
        <li>Incorporate Socket.io notifications if other logged in users add/update things</li>
        <li>Web services interface to take direct feed from QuickRoute</li>
        <li>User-specific preferences (e.g. language)</li>
        <li>Real-time (non-persistent) chat??</li>
        <li>
        View multiple routes for the same course together? (e.g. 50% opacity for each?)
        Only works in general if course is an overlay not complete image
        </li>
      </ol>
    </>
  );

  // check number of events and maps for current user
  const ownEvents = (eventList)
    ? eventList
      .filter((eachEvent) => {
        const { runners } = eachEvent;
        const runnerIds = (runners) ? runners.map(runner => runner.user) : [];
        return runnerIds.includes(currentUserId);
      })
    : [];
  // console.log('ownEvents:', ownEvents);
  const attendedEvents = ownEvents.length;
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

  const whatIsIt = (
    <>
      <p>
        <Trans>
          The core functionality of MapOholic is to provide an online repository for scanned
          images of your orienteering maps, together with your routes if you have them
          (whether drawn manually or using a GPS watch/tracker and a tool such as&nbsp;
          <a href="http://www.matstroeng.se/quickroute/en/">QuickRoute</a>*).
        </Trans>
      </p>
      <p>
        <Trans>
          But there is much more to it than that. The maps can be linked to detailed information
          about the event and your performance, and you can quickly see how other users did
          at the same race. For Czech events registered on ORIS, event details, course details
          and results can be added automatically. You can also tag your maps in any way you like
          and add comments to both your own and other users&apos; maps.
        </Trans>
      </p>
      <p>
        <Trans>
          <em>
            * QuickRoute is an excellent tool and I use it for all races where I have a GPS track.
            The JPG images of routes exported from it include track data and MapOholic can use
            this to determine the location of a map without needing to enter it manually. When
            no accompanying GPS track is available, any simple graphics editor can be used to draw
            a route on a scanned map. Capturing and displaying vector route overlays is on the
            future feature list!
          </em>
        </Trans>
      </p>
    </>
  );

  const howToUseIt = (
    <>
      <p>
        <Trans>
          Browsing or searching for maps is easy.
        </Trans>
      </p>
      <p>
        <Trans>
          xxx
        </Trans>
      </p>
      <p>
        <Trans>
          xxx
        </Trans>
      </p>
    </>
  );

  const aboutMe = (
    <>
      <p><Trans>to add</Trans></p>
      <p>
        <Trans>
          xxx
        </Trans>
      </p>
      <p>
        <Trans>
          xxx
        </Trans>
      </p>
    </>
  );

  return (
    <div className="ui segment">
      <h3 className="header"><Trans>Welcome to MapOholic!</Trans></h3>
      <p><Trans>Dedicated to those that know you can never have too many maps...</Trans></p>
      {(auth) ? <p><Trans>You are currently logged in.</Trans></p> : visitorWelcome}
      {(isGuest) ? guestWelcome : ''}
      {(isStandardOrAdmin && hasMaps) ? standardWelcome : ''}
      {(isStandardOrAdmin && !hasMaps) ? newUserWelcome : ''}
      <h3 className="header"><Trans>What is it?</Trans></h3>
      {whatIsIt}
      <h3 className="header"><Trans>How do I use it?</Trans></h3>
      {howToUseIt}
      <h3 className="header"><Trans>About me</Trans></h3>
      {aboutMe}
      {(isAdmin) ? adminNotes : ''}
    </div>
  );
};

Welcome.propTypes = {
  auth: PropTypes.string,
  currentUser: PropTypes.objectOf(PropTypes.any),
  eventList: PropTypes.arrayOf(PropTypes.any),
};
Welcome.defaultProps = {
  auth: null,
  currentUser: {},
  eventList: null,
};

const mapStateToProps = ({ auth, oevent, user }) => {
  return {
    auth: auth.authenticated,
    currentUser: user.current,
    eventList: oevent.list,
  };
};

export default connect(mapStateToProps)(Welcome);
