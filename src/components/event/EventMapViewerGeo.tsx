import React, { FunctionComponent, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';

import EventViewerGeoMap, { GeoMapState } from './leaflet/EventViewerGeoMap';
import {
  OEvent,
  OEventCoordinates,
  OEventCorners,
  OEventMap,
  OEventRunner,
} from '../../types/event';

interface EventMapViewerGeoProps {
  canEdit: boolean;
  language: string;
  selectedEvent: OEvent;
  selectedRunner: string;
  updateEventRunner: (
    eventId: string,
    userId: string,
    payload: Partial<OEventRunner>,
    callback: (didSucceed: boolean) => void,
  ) => void;
}

const EventMapViewerGeo: FunctionComponent<EventMapViewerGeoProps> = ({
  canEdit,
  language,
  selectedEvent,
  selectedRunner,
  updateEventRunner,
}) => {
  const matchingRunner = selectedEvent.runners.find(({ user: { _id } }) => _id === selectedRunner);
  const matchingMaps = (matchingRunner && matchingRunner.maps) || [];

  const [triggerSelect, setTriggerSelect] = useState<GeoMapState<number>>({});
  const [triggerUpdateCorners, setTriggerUpdateCorners] = useState<GeoMapState<number>>({});
  const [triggerResetCorners, setTriggerResetCorners] = useState<GeoMapState<number>>({});
  const [corners, setCorners] = useState<GeoMapState<OEventCorners>>({});
  const [haveCornersChanged, setHaveCornersChanged] = useState<GeoMapState<boolean>>({});

  useEffect(() => {
    matchingMaps.forEach((map) => {
      setTriggerSelect({ ...triggerSelect, [map._id]: 1 });
      setTriggerUpdateCorners({ ...triggerUpdateCorners, [map._id]: 1 });
      setTriggerResetCorners({ ...triggerResetCorners, [map._id]: 1 });
      setHaveCornersChanged({ ...haveCornersChanged, [map._id]: false });
    });
  }, []);

  // const {
  //   locCornerNE,
  //   locCornerNW,
  //   locCornerSE,
  //   locCornerSW,
  // } = selectedEvent;
  // const shouldUpdateEventCorners = locCornerNE.length < 2 || locCornerNW.length < 2
  //   || locCornerSE.length < 2 || locCornerSW.length < 2;

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
    setHaveCornersChanged({ ...haveCornersChanged, [mapId]: true });
  };

  const handleTriggerResetCorners = (mapId: string) => {
    setTriggerResetCorners({
      ...triggerResetCorners,
      [mapId]: triggerResetCorners[mapId] ? triggerResetCorners[mapId] + 1 : 1,
    });
    setHaveCornersChanged({ ...haveCornersChanged, [mapId]: false });
  };

  const handleUpdateCorners = (mapId: string) => (updatedCorners: OEventCorners): void => {
    setCorners({
      ...corners,
      [mapId]: updatedCorners,
    });
  };

  const handleUploadCorners = () => {
    const eventId = selectedEvent._id;
    const newMaps = matchingMaps.map((map) => ({
      ...map,
      geo: {
        ...map.geo,
        imageCorners: corners[map._id],
        mapCorners: corners[map._id],
      },
    })) as OEventMap[];
    updateEventRunner(eventId, selectedRunner, { maps: newMaps }, (successful: boolean): void => {
      if (successful) {
        matchingMaps.forEach((map) => {
          setHaveCornersChanged({ ...haveCornersChanged, [map._id]: false });
        });
        // console.log('Successfully updated map corners');
      } else {
        // console.error('Error updating map corners');
      }
    });
    // if (shouldUpdateEventCorners) {
    //   const newEventCorners = {
    //     locCornerNE: ...
    //   };
    //   console.log('newEventCorners to add', newEventCorners);
    // }
    // then call updateEvent
  };

  const renderCorners = (cornersToDisplay: OEventCorners): React.ReactNode => {
    if (!cornersToDisplay) return null;
    const formattedCoords = (coords: OEventCoordinates): JSX.Element => (
      <I18n>
        {({ i18n }) => {
          const lat = Math.abs(coords.lat).toFixed(3);
          // @ts-ignore
          const latLabel = coords.lat > 0 ? i18n._('N') : i18n._('S');
          const long = Math.abs(coords.long).toFixed(3);
          // @ts-ignore
          const longLabel = coords.lat > 0 ? i18n._('E') : i18n._('W');
          return <span>{`${lat}${latLabel}, ${long}${longLabel}`}</span>;
        }}
      </I18n>
    );
    // const formatCoords = (coords: OEventCoordinates): string => {
    //   const lat = `${Math.abs(coords.lat).toFixed(3)}${coords.lat > 0 ? 'N' : 'S'}`;
    //   const long = `${Math.abs(coords.long).toFixed(3)}${coords.long > 0 ? 'E' : 'W'}`;
    //   return `${lat}, ${long}`;
    // };
    return (
      <div>
        <table>
          <tr>
            <td><strong><Trans>NW</Trans></strong></td>
            <td>{formattedCoords(cornersToDisplay.nw)}</td>
            <td><strong><Trans>NE</Trans></strong></td>
            <td>{formattedCoords(cornersToDisplay.ne)}</td>
          </tr>
          <tr>
            <td><strong><Trans>SW</Trans></strong></td>
            <td>{formattedCoords(cornersToDisplay.sw)}</td>
            <td><strong><Trans>SE</Trans></strong></td>
            <td>{formattedCoords(cornersToDisplay.se)}</td>
          </tr>
        </table>
      </div>
    );
  };
  const mapList = matchingMaps.map((map) => (
    <div key={map.title}>
      {map.title && <p>{map.title}</p>}
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
      {renderCorners(corners[map._id])}
    </div>
  ));

  const enableUpload = matchingMaps.length > 0
    && Object.values(haveCornersChanged).some((changed) => changed);
  const uploadButton = canEdit
    ? (
      <button
        type="button"
        className="ui button tiny primary"
        disabled={!enableUpload}
        onClick={handleUploadCorners}
      >
        <Trans>Upload new corners</Trans>
      </button>
    ) : null;
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
        {mapList}
        {uploadButton}
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
