import React from 'react';
import { Trans } from '@lingui/macro';

const HomeHowToUse = () => {
  return (
    <div className="ui segment">
      <h3><Trans>How to use MapOholic</Trans></h3>
      <p>
        <Trans>
          Sample workflow: [to flesh out]
        </Trans>
      </p>
      <ul>
        <li>
          <Trans>
            Search for the event you ran at: if it&apos;s there, great; if not you
            can add it. If it happens to be a Czech event on ORIS, you&apos;re lucky
            and can import all the event information automatically, just select it
            from the list of recent events at the top. Otherwise you can enter as
            much information about the event as you like, only the date and its name
            are required.
          </Trans>
        </li>
        <li>
          <Trans>
            Once you have created the event, or are looking at its details if it
            already exists, add yourself as a runner (below the details in list
            view, to the right of the details in map view). This will take you to
            the Current Map screen with this event selected. Again, there is a
            bonus if the event and your entry are in ORIS, because course details
            and results can be populated automatically too. Edit runner details
            allows you to enter course details manually, as well as to add personal
            tags to help you search your collection later and to decide who else
            can see your maps for this particular event (just you, anyone who is
            a member of the same club as you, all registered users of the site,
            or anyone anywhere in the entire world).
          </Trans>
        </li>
        <li>
          <Trans>
            It&apos;s now time to add some maps! Click the big &quot;Add or Delete
            maps&quot; button at the top, which enables you to upload both a course
            map and a route map (i.e. the same map with the route drawn on). You
            can also give the map a title, which will be shown if you add a different
            map for the same event later, for example if the course was in two parts.
            For the course map, you are given the option to add a border. This makes
            it easier to work with QuickRoute, which outputs images bigger than the
            original when you have added a route; without the border switching
            between course and route would not be smooth. If you do not have a route
            to upload, or you drew it on the course map with a different tool, you
            can ignore this option.
          </Trans>
        </li>
        <li>
          <Trans>
            That&apos;s it for this event, now upload some more maps for another
            event, browse other users&apos; maps for this event or search through
            the archive for any other maps of interest.
          </Trans>
        </li>
      </ul>
      <p>
        <Trans>
          Other user stories to be added - see requirements document!
        </Trans>
      </p>
    </div>
  );
};

export default HomeHowToUse;
