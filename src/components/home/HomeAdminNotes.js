import React from 'react';

const HomeAdminNotes = () => {
  return (
    <div>
      <p>Checklist of things still to do:</p>
      <ol>
        <li>Add some more introductory/help text on this page</li>
        <li>
          <del>Sort list ordering in ClubEdit, EventEdit, UserEdit&nbsp;</del>
          (done 14/6)
        </li>
        <li>
        Add a component to Welcome to show recent activity (own or all?)
        (server-side development 14-17/6, exploit in client 18?)
        </li>
        <li>Complete lingui translations and check that nothing is missing</li>
        <li>Complete common/data translations and check that nothing is missing</li>
        <li>Centre rotation on current view when zoomed in</li>
        <li>Define a default set of event tags</li>
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
        <li>
          <del>
          Separate Redux state for Events/MyMaps (selected event and view mode recorded separately)
          </del>
          &nbsp;(done 12/6)
        </li>
        <li>
          <del>Remember overview map position when moving away</del>
          &nbsp;(done 12/6, record bounds on unmounting)
        </li>
        <li>
          <del>Hide &apos;runners at event&apos; for MyMaps</del>
          &nbsp;(done 12/6)
        </li>
        <li>
          <del>Remember list/map tab in MyMaps and Events when moving away</del>
          &nbsp;(done 13/6, using state in Header component)
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
    </div>
  );
};

export default HomeAdminNotes;
