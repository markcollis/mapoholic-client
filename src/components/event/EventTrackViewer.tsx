import React, { FunctionComponent } from 'react';

import { OEventMap } from '../../types/event';

interface EventTrackViewerProps {
  map: OEventMap;
}

const EventTrackViewer: FunctionComponent<EventTrackViewerProps> = ({ map }) => {
  return (
    <div>
      <h3>Placeholder for track viewer</h3>
      <p>{map.title || 'only'}</p>
    </div>
  );
};

export default EventTrackViewer;
