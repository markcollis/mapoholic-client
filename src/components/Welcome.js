import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import PropTypes from 'prop-types';

const Welcome = ({ auth, currentUser }) => {
  if (auth) {
    const adminNotes = (currentUser && currentUser.role === 'admin')
      ? (
        <>
          <hr />
          <p>Checklist of things still to do:</p>
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
              <del>Check for other components that could use CollapseTrigger function</del>
              {' (EventDetails trigger when thumbnail image loaded 30/5)'}
            </li>
            <li>
              Choose a better name... how about MapOholic, or is it too contrived?
              (O)MapArchive? (O)MapBrowser? (O)MapStore?
            </li>
            <li>Add some more introductory/help text on this page</li>
            <li>Add a component here to show recent activity (own or all?)</li>
            <li>Investigate making results editable/uploadable if not on ORIS</li>
            <li>Incorporate Socket.io notifications if other logged in users add/update things</li>
            <li>Complete the translations and check that nothing is missing</li>
            <li>Centre rotation on current view when zoomed in</li>
            <li>Add some real sample data/maps</li>
            <li>Test it out on a real Internet-facing server</li>
          </ol>
          <p>Other ideas for the future (non-essential):</p>
          <ol>
            <li>Web services interface to take direct feed from QuickRoute</li>
            <li>User-specific preferences (e.g. language)</li>
            <li>Some sort of image on club details (map of where they are based? logo?)</li>
            <li>Real-time (non-persistent) chat??</li>
          </ol>
        </>
      )
      : null;
    return (
      <div className="ui segment">
        <h3 className="header"><Trans>Welcome back!</Trans></h3>
        <p><Trans>You are still logged in.</Trans></p>
        <p>You can do...</p>
        {adminNotes}
      </div>
    );
  }

  const signUpLink = <Link to="/signup"><Trans>Sign up</Trans></Link>;
  const logInLink = <Link to="/login"><Trans>log in</Trans></Link>;
  const browsePublicLink = <Link to="/events"><Trans>browse them here</Trans></Link>;
  const smiley = <i className="smile outline icon" />;

  return (
    <div className="ui segment">
      <h3 className="header"><Trans>Welcome!</Trans></h3>
      <p>
        {'Please '}
        {signUpLink}
        {' or '}
        {logInLink}
        {' to use all the exciting features of this site '}
        {smiley}
        {'.'}
      </p>
      <p>
        {'Some of the maps are visible to unregistered visitors too, you can '}
        {browsePublicLink}
        {'.'}
      </p>
    </div>
  );
};

Welcome.propTypes = {
  auth: PropTypes.string,
  currentUser: PropTypes.objectOf(PropTypes.any),
};
Welcome.defaultProps = {
  auth: '',
  currentUser: {},
};

const mapStateToProps = ({ auth, user }) => {
  return { auth: auth.authenticated, currentUser: user.current };
};

export default connect(mapStateToProps)(Welcome);
