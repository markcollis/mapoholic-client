import React from 'react';
import Collapse from '../generic/Collapse';

// The HomeAdminNotes component renders a list of notes and actions to aid development
// (much of which will be deleted once an initial release is complete)
const HomeAdminNotes = () => {
  return (
    <div>
      <h3>Development notes [English only]</h3>
      <hr className="divider" />
      <Collapse title="Checklist of things still to do before first release:">
        <ol>
          <li>
            Write a proper README for each repository
            &nbsp;(front end completed 4/9)
          </li>
          <li>
            Refactor back end to better separate controller and service functions
            (in progress)
          </li>
          <li>
            <del>Bug: error in user event list if event.runners is undefined</del>
            &nbsp;(fixed 9/9 as well as similar potential issue in EventRunners)
          </li>
          <li>
            <del>Bug: user deleting themselves leads to an actions must be plain objects error</del>
            &nbsp;(fixed 9/9)
          </li>
          <li>
            React-select uses outdated componentWillReceiveProps - monitor for library update
          </li>
          <li>
            When ready to release, replace this component with notes of more relevance
            to the admin _user_, rather than developer. Development notes/issues should
            move to Github.
          </li>
          <li>
            <del>Bug: Club errors not cancellable</del>
            &nbsp;(fixed 9/9)
          </li>
          <li>
            <del>Display country name in place of abbreviation?</del>
            &nbsp;(done for ClubDetails 9/9, left as abbreviation for events to save space)
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
            <del>Complete common/formData translations and check that nothing is missing</del>
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
          <li>
            <del>Make style names more consistent across components</del>
            &nbsp;(done 5/7 (BEM))
          </li>
          <li>
            <del>Bug (server): Can not deal with map titles with spaces/brackets in</del>
            &nbsp;(fixed 6/7, URIencoded for maptitle parameter, strip special chars for filename)
          </li>
          <li>
            <del>Bug: Datepicker in EventEdit parses partial dates as mm/dd</del>
            &nbsp;(fixed 6/7)
          </li>
          <li>
            <del>Bug: map part title doesn&apos;t change in the tab when edited</del>
            &nbsp;(fixed 6/7)
          </li>
          <li>
            <del>Add some real sample data/maps</del>
            &nbsp;(all 2019 maps now added 6/7)
          </li>
          <li>
            <del>Design a logo, e.g. map with control colours on the O</del>
            &nbsp;(done and included on home page 7/7)
          </li>
          <li>
            <del>Bug: hangs on Loading... event details when creating a new event</del>
            &nbsp;(fixed 7/7)
          </li>
          <li>
            <del>Suppress add event on MyMaps screen</del>
            &nbsp;(done 7/7)
          </li>
          <li>
            <del>Bug? (server): Does not change file names when title changes</del>
            &nbsp;(leave them, throw an error when uploading a map with a previously used title,
            deleting now renames the files to -deleted@... so they can be replaced 7/7)
          </li>
          <li>
            <del>Bug: Event link list doesn&apos;t update when a new event is created in link</del>
            &nbsp;(fixed - major refactoring of event reducer and event link components 8/7)
          </li>
          <li>
            <del>
            Inconsistency: non-admins can see delete button for event links but cannot delete
            </del>
            &nbsp;(fixed 8/7)
          </li>
          <li>
            <del>
            Use all four corners for map outline (Polygon not Rectangle) otherwise
            the likes of pootoceny Hradek breaks things...
            </del>
            &nbsp;(done 8/7)
          </li>
          <li>
            <del>Automatically select language based on browser navigator.language</del>
            &nbsp;(done 8/7)
          </li>
          <li>
            <del>Review when various buttons should appear to be disabled</del>
            &nbsp;(Add Event/Add Club disabled when view mode is not none or view 8/7)
          </li>
          <li>
            <del>Make website/email links actual links in user/club views! (cf event view)</del>
            &nbsp;(done 8/7)
          </li>
          <li>
            <del>Investigate making results editable/uploadable if not on ORIS</del>
            &nbsp;(CSV/JSON results upload and dowload added 9-10/7)
          </li>
          <li>
            <del>Refactor user reducer and components to avoid unnecessary API calls</del>
            &nbsp;(done 10/7)
          </li>
          <li>
            <del>Refactor club reducer and components to avoid unnecessary API calls</del>
            &nbsp;(done 10/7)
          </li>
          <li>
            <del>Investigate issue with not loading thumbnail after uploading map (timing?)</del>
            &nbsp;(possibly fixed 5/7 using setState callback, need to test - still seems
            to be an issue when connection is slow/server is overloaded; now addressed
            through major refactor of image/extract/thumbnail management code 11/7)
          </li>
          <li>
            <del>Disable upload map button when already uploading</del>
            &nbsp;(done 15/7)
          </li>
          <li>
            <del>Investigate extracting the route from a course/route combination</del>
            &nbsp;(Implemented 15/7 - overlay PNG produced whenever course and route
            exist, are the same size and are not identical)
          </li>
          <li>
            <del>
              View a list of course names at an event for which maps have been uploaded.
              Also view the course name in EventRunners?
            </del>
            &nbsp;(now listed in EventRunners 15/7)
          </li>
          <li>
            <del>View multiple routes for the same course together? (based on overlays)</del>
            &nbsp;(done 25/7)
          </li>
          <li>
            <del>
            If a user with no maps logs in, go to Events not MyMaps
            (not as easy as it looks!)
            -&gt; if *any* user with no maps visits MyMaps, redirect to Events
            </del>
            &nbsp;(done 22/7)
          </li>
          <li>
            <del>Manual editing of map corner coordinates in EventEdit</del>
            &nbsp;(done 22/7, also location map for EventDetails)
          </li>
          <li>
            <del>Finish introductory/help text on Home view</del>
            &nbsp;(first pass done 8/7, complete 22/7)
          </li>
          <li>
            <del>
            Refresh results via ORIS? Direct from front end in EventResults
            as an alternative to direct upload.
            </del>
            &nbsp;(done via support for JSON upload in ORIS API format 22/7)
          </li>
          <li>
            <del>Test it out on a real Internet-facing server</del>
            &nbsp;(DB migrated to MongoDB Atlas online service 5/7,
            front end and API moved to markcollis.dev 3/8)
          </li>
          <li>
            <del>Bug: missing corner coordinates breaks EventDetails</del>
            &nbsp;(fixed 28/8)
          </li>
          <li>
            <del>Bug: missing corner coordinates breaks EventMap</del>
            &nbsp;(fixed 29/8)
          </li>
          <li>
            <del>Bug: Corner coordinates of [null, null] are not superseded</del>
            &nbsp;(fixed 29/8)
          </li>
          <li>
            <del>Investigate better overall error handling</del>
            &nbsp;(done 30/8 - ErrorBoundary component at top level, for each View
            and for each main component within each View)
          </li>
          <li>
            <del>Complete lingui translations and check that nothing is missing</del>
            (done all except long paragraphs on Home page 29/6, Blanka reviewing, completed 4/9)
          </li>
          <li>
            <del>Find a better picture of me for the front page</del>
            &nbsp;(done 5/9)
          </li>
          <li>
            <del>
            Possible bug: Strange behaviour observed when switching to an event at
            which you are not a runner and trying to add maps (NOT only as admin)
            (selecting a linked event while in map view does not select a runner)
            =&gt; need to hide Add or Delete maps when no runner selected
            </del>
            &nbsp;(fixed 5/9 - hide map if selected runner is not present at event)
          </li>
          <li>
            <del>
            Supplementary - hide overlay option when there is no map to display
            (also comments component)
            </del>
            &nbsp;(fixed 5/9)
          </li>
        </ol>
      </Collapse>
      <hr className="divider" />
      <Collapse title="Other ideas for the future (non-essential):">
        <ol>
          <strong>Presentation:</strong>
          <li>EN and CZ specific screenshots in HomeView?</li>
          <strong>Map handling:</strong>
          <li>
            Consider how to better handle events at which someone ran TWO courses
            (not a two-part course) - e.g. sprint relay training 2 legs
            The data model doesn&apos;t support this, would need 2 runner records
            for the same event or 2 course/results records for a runner
          </li>
          <li>Support re-ordering of multi-part maps</li>
          <li>
            More on overlays - drawing own route, adding annotations, etc. =&gt;
            need to be able to save too... *react-canvas-draw*
            (course overlay is PNG with transparent background, park annotations for now)
          </li>
          <strong>Real-time updates:</strong>
          <li>Incorporate Socket.io notifications if other logged in users add/update things</li>
          <li>
            Remove refresh list buttons? Should only be needed if a different user has updated
            something, how important is it? Definitely not needed if sockets implemented
            (removed from mobile views 12/7)
          </li>
          <li>Real-time (non-persistent) chat?</li>
          <strong>Interfaces/API:</strong>
          <li>Handle multi-day events in Events.orisCreateEvent</li>
          <li>Web services interface to take direct feed from QuickRoute</li>
          <li>
            Investigate potential to automatically parse other online results
            too if they are in a consistent format (e.g. O-liga, BOF). Check out Apify?
          </li>
          <strong>Configuration:</strong>
          <li>User-specific preferences (e.g. language)</li>
        </ol>
      </Collapse>
    </div>
  );
};

export default HomeAdminNotes;
