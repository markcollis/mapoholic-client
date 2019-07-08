import React from 'react';
import { Trans } from '@lingui/macro';

const HomeWhatIsIt = () => {
  return (
    <div className="ui segment">
      <h3><Trans>What is it?</Trans></h3>
      <p>
        <Trans>
          The core functionality of MapOholic is to provide an online repository for scanned
          images of your orienteering maps, together with your routes if you have them
          (whether drawn manually or using a GPS watch/tracker and a tool such as&nbsp;
          <a href="http://www.matstroeng.se/quickroute/en/" target="_blank" rel="noopener noreferrer">QuickRoute</a>
          *). You can zoom in and rotate maps, switch easily between the plain course and your
          route, and multi-part courses with different maps are supported.
        </Trans>
      </p>
      <p>
        <Trans>
          But there is much more to it than that. The maps can be linked to detailed information
          about the event and your performance, and you can quickly see how other users did
          at the same race. For Czech events registered on ORIS, event details, course details
          and results can be added automatically. You can also tag your maps in any way you like
          and add comments to both your own and other users&apos; maps. The search filter matches
          event and map names, dates, places and the different types of tags so that your maps
          are easy to find.
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
    </div>
  );
};

export default HomeWhatIsIt;
