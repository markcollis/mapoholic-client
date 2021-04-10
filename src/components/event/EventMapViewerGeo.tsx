import React, { FunctionComponent, useState } from 'react';
import { LatLng } from 'leaflet';
import { Trans } from '@lingui/macro';

import EventViewerGeoMap, { GeoMapState } from './leaflet/EventViewerGeoMap';
import { OEvent, OEventMap } from '../../types/event';

interface EventMapViewerGeoProps {
  language: string;
  selectedEvent: OEvent;
  selectedRunner: string;
  updateEventRunner: (eventId: string, userId: string, maps: OEventMap[]) => void;
}

const EventMapViewerGeo: FunctionComponent<EventMapViewerGeoProps> = ({
  language,
  selectedEvent,
  selectedRunner,
  // updateEventRunner,
}) => {
  const [triggerSelect, setTriggerSelect] = useState<GeoMapState<number>>({});
  const [triggerUpdateCorners, setTriggerUpdateCorners] = useState<GeoMapState<number>>({});
  const [triggerResetCorners, setTriggerResetCorners] = useState<GeoMapState<number>>({});
  const [corners, setCorners] = useState<GeoMapState<LatLng[]>>({});

  const handleTriggerSelect = (mapId: string) => {
    setTriggerSelect({
      ...triggerSelect,
      [mapId]: triggerSelect[mapId] ? triggerSelect[mapId] + 1 : 1,
    });
  };

  const handleTriggerUpdateCorners = (mapId: string) => {
    setTriggerUpdateCorners({
      ...triggerUpdateCorners,
      [mapId]: triggerUpdateCorners[mapId] ? triggerUpdateCorners[mapId] + 1 : 1,
    });
  };

  const handleTriggerResetCorners = (mapId: string) => {
    setTriggerResetCorners({
      ...triggerResetCorners,
      [mapId]: triggerResetCorners[mapId] ? triggerResetCorners[mapId] + 1 : 1,
    });
  };

  const handleUpdateCorners = (mapId: string) => (updatedCorners: LatLng[]): void => {
    setCorners({
      ...corners,
      [mapId]: updatedCorners,
    });
  };

  const matchingRunner = selectedEvent.runners.find(({ user: { _id } }) => _id === selectedRunner);
  const matchingMaps = (matchingRunner && matchingRunner.maps) || [];

  const mapList = matchingMaps.map((map) => (
    <div key={map.title}>
      <p>{map.title}</p>
      <button
        type="button"
        className="ui button tiny"
        onClick={() => handleTriggerSelect(map._id)}
      >
        <Trans>Select</Trans>
      </button>
      <button
        type="button"
        className="ui button tiny"
        onClick={() => handleTriggerUpdateCorners(map._id)}
      >
        <Trans>Update corners</Trans>
      </button>
      <button
        type="button"
        className="ui button tiny"
        onClick={() => handleTriggerResetCorners(map._id)}
      >
        <Trans>Reset</Trans>
      </button>
      <p>Corners:</p>
      <p>{JSON.stringify(corners[map._id])}</p>
    </div>
  ));

  return (
    <div className="event-map-viewer-geo ui grid">
      <div className="ten wide column">
        <EventViewerGeoMap
          language={language}
          matchingMaps={matchingMaps}
          selectedEvent={selectedEvent}
          selectedRunner={selectedRunner}
          triggerResetCorners={triggerResetCorners}
          triggerSelect={triggerSelect}
          triggerUpdateCorners={triggerUpdateCorners}
          updateCorners={handleUpdateCorners}
        />
      </div>
      <div className="event-map-viewer-geo-right-panel six wide column">
        <p><Trans>Course maps uploaded</Trans></p>
        {mapList}
        <hr />
        <p>Features to add</p>
        <ul>
          <li>Overlay all scanned maps on Leaflet/OSM - done</li>
          <li>Simple distortion (corners) for best fit - done</li>
          <li>Display tracks (hotlines where there is data) - done</li>
          <li>Choose which of several maps/tracks are shown - can select/bring to front</li>
          <li>Allow map record to be updated</li>
          <li>Limit editing to admin/current user</li>
          <li>Sort out scroll when lots of maps</li>
        </ul>
      </div>
    </div>
  );
};

export default EventMapViewerGeo;
