import React from 'react';
import Collapse from '../generic/Collapse';

const HomeAdminNotes = () => {
  return (
    <div>
      <h3>Development notes</h3>
      <hr className="divider" />
      <Collapse title="Checklist of things still to do:">
        <ol>
          <li>Finish introductory/help text on Home view</li>
          <li>
            Investigate issue with not loading thumbnail after uploading map (timing?)
            (possibly fixed 5/7 using setState callback, need to test)
          </li>
          <li>
            Complete lingui translations and check that nothing is missing
            (done all except long paragraphs on Home page 29/6)
          </li>
          <li>Design a logo, e.g. map with control colours on the O</li>
          <li>
            <del>Make style names more consistent across components</del>
            &nbsp;(done 5/7 (BEM))
          </li>
          <li>Make website/email links actual links in user/club views! (cf event view)</li>
          <li>Take a photo of a pile of O maps to use as a background/on home page</li>
          <li>Add some real sample data/maps (started 4/6 - ongoing task)</li>
          <li>
            Test it out on a real Internet-facing server
            &nbsp;(DB migrated to MongoDB Atlas online service 5/7)
          </li>
        </ol>
      </Collapse>
      <hr className="divider" />
      <Collapse title="What has already been done:" startHidden>
        <ol>
          <li>
            <del>Investigate unauthorized /users/me request when logging in</del>
            &nbsp;(fixed 18/5)
          </li>
          <li>
            <del>Make use of map thumbnails/thin extracts</del>
            &nbsp;(added thumbnail to EventDetails 18/5, extract to EventListItem 18/5)
          </li>
          <li>
            <del>Enable HTTPS</del>
            &nbsp;(done 19/5)
          </li>
          <li>
            <del>
            Add option to process blank course maps used with QR
            (black border: top 66px, others 1px)
            </del>
            &nbsp;(added 19/5)
          </li>
          <li>
            <del>Add translation hooks to all hardcoded text</del>
            &nbsp;(first pass of all components complete 22/5)
          </li>
          <li>
            <del>Investigate image resize bug if uploaded maps are too small</del>
            &nbsp;(fixed 22/5)
          </li>
          <li>
            <del>Implement delete runner on server</del>
            &nbsp;(done 23/5)
          </li>
          <li>
            <del>
            Clarify what happens to OrganisedBy and MemberOf references if club is deleted,
            updating ClubDelete as appropriate
            </del>
            &nbsp;(implemented on back end 23/5)
          </li>
          <li>
            <del>Add some links to Footer (Github, my email?)</del>
            &nbsp;(added 23/5)
          </li>
          <li>
            <del>
              Clarify what happens to owner, runners and comment references if user is deleted,
              updating UserDelete as appropriate. Thoughts: Club/owner and Event/owner leave as
              is, only admin can see xxx (deleted) in UI. Set visibility of all runner records
              to private (i.e. not actual deletion, admin can see/recover). Comments should stay
              - filter out `deleted` part of name.
            </del>
            &nbsp;(Runner visibility change set up 23/5, inactive users stripped from runners
            returned by API 27/5, comment authors now include active and profileImage fields 28/5)
          </li>
          <li>
            <del>
              Split up events controller on server into several smaller files
              (Comment/Event/EventLink/EventRunner/Map)
            </del>
            &nbsp;(done 28/5)
          </li>
          <li>
            <del>Refactor User and Club pages to align with Event best practice</del>
            &nbsp;(Club completed 20/5, User completed 30/5)
          </li>
          <li>
            <del>Add a bit more visual identity</del>
            &nbsp;(added flags and tree background to Club page 30/5, others look OK for now)
          </li>
          <li>
            <del>Improve layout of MapView to put map first</del>
            &nbsp;(done 31/5)
          </li>
          <li>
            <del>
            Choose a better name... how about MapOholic, or is it too contrived?
            (O)MapArchive? (O)MapBrowser? (O)MapStore?
            </del>
            &nbsp;(MapOholic it is! 4/6)
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
            Separate Redux state for Events/MyMaps
            (selected event and view mode recorded separately)
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
          <li>
            <del>Sort list ordering in ClubEdit, EventEdit, UserEdit&nbsp;</del>
            &nbsp;(done 14/6)
          </li>
          <li>
            <del>Add a component to Welcome to show recent activity (own or all)</del>
            &nbsp;(server-side development 14-17/6, client-side 18-21/6)
          </li>
          <li>
            <del>On MapView, highlight *currently selected* runner as well as yourself</del>
            &nbsp;(done 24/6)
          </li>
          <li>
            <del>Highlight currently selected user and current user in UserView</del>
            &nbsp;(done 24/6)
          </li>
          <li>
            <del>Highlight currently selected event in Event (list) view</del>
            &nbsp;(done 24/6)
          </li>
          <li>
            <del>Highlight currently selected club in ClubView</del>
            &nbsp;(done 24/6)
          </li>
          <li>
            <del>Consistent date presentation (localised, follows selected language)</del>
            &nbsp;(done 25/6)
          </li>
          <li>
            <del>Add detailed activity log for administrators</del>
            &nbsp;(completed 27/6, together with new reusable Table component)
          </li>
          <li>
            <del>Complete common/data translations and check that nothing is missing</del>
            &nbsp;(done 28/6)
          </li>
          <li>
            <del>Need to refresh EventEdit when ORIS list is loaded</del>
            &nbsp;(fixed 29/6)
          </li>
          <li>
            <del>Restructure Header to remove space-wasting List/Map view tabs</del>
            &nbsp;(done 30/6)
          </li>
          <li>
            <del>Rewrite filter components as a control bar along the top</del>
            &nbsp;(done 30/6)
          </li>
          <li>
            <del>Define a default set of event tags (EventEdit, EventRunnerEdit)</del>
            &nbsp;(captured event and personal tags in EventView 30/6, set to use as default 1/7;
            captured runner personal tags in MapView and set to use as default 1/7)
          </li>
          <li>
            <del>Decide what to do with runner tags - not currently searchable...</del>
            &nbsp;(now included in search filter 1/7)
          </li>
          <li>
            <del>Add refreshCollapse to RunnerDetails</del>
            &nbsp;(done 1/7)
          </li>
          <li>
            <del>Incorporate extra filter into new control toolbars (start with event tags)</del>
            &nbsp;(tag filter implemented 2/7)
          </li>
          <li>
            <del>Check permission to view ActionBy user&apos;s profile in HomeRecentListItem</del>
            (done - only show link if the action is by a user in the downloaded user list 2/7)
          </li>
          <li>
            <del>Add keyboard shortcuts to EventMapViewerCanvas</del>
            (&nbsp;done 3/7)
          </li>
          <li>
            <del>
              Remember current map position/zoom/rotation in Redux state when changing pages
            </del>
            &nbsp;(done 4/7)
          </li>
          <li>
            <del>
            Investigate user details auth error in EventsList when not admin
            (can see runner but not profile?)
            </del>
            &nbsp;(conflict between runner and profile permissions - eliminated, along with
            unneccesary calls to API, 4/7)
          </li>
          <li>
            <del>Centre rotation on current view when zoomed in</del>
            (done both rotate and zoom 4/7, still not 100% perfect)
          </li>
          <li>
            <div>Draw my own version of the tree background, or find a royalty free one</div>
            &nbsp;(done 4/7, cropped to different sizes and used accordingly 5/7)
          </li>
          <li>
            <del>Check background image on ClubDetails on narrow screens</del>
            &nbsp;(fixed with new graphics 5/7)
          </li>
          <li>
            <del>Include touch event handlers in EventMapViewerCanvas</del>
            &nbsp;(done 5/7)
          </li>
          <li>
            <del>Improve overview map views, particularly MyMaps</del>
            &nbsp;(done 5/7, using EventListItem component on map)
          </li>
        </ol>
      </Collapse>
      <hr className="divider" />
      <Collapse title="Other ideas for the future (non-essential):">
        <ol>
          <li>
            Investigate overlays - drawing own route, adding annotations, etc. =&gt;
            need to be able to save too... *react-canvas-draw*
          </li>
          <li>Investigate making results editable/uploadable if not on ORIS</li>
          <li>Incorporate Socket.io notifications if other logged in users add/update things</li>
          <li>
            Remove refresh list buttons? Should only be needed if a different user has updated
            something, how important is it? Definitely not needed if sockets implemented
          </li>
          <li>Web services interface to take direct feed from QuickRoute</li>
          <li>User-specific preferences (e.g. language)</li>
          <li>Real-time (non-persistent) chat??</li>
          <li>
          View multiple routes for the same course together? (e.g. 50% opacity for each?)
          Only works in general if course is an overlay not complete image
          </li>
        </ol>
      </Collapse>
    </div>
  );
};

export default HomeAdminNotes;
