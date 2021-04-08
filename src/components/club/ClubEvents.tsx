import React, { FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { Trans } from '@lingui/macro';

import Collapse from '../generic/Collapse';
import EventListItem from '../event/EventListItem';

import { OEventSummary } from '../../types/event';

interface ClubEventsProps extends RouteComponentProps {
  eventsList: OEventSummary[];
  history: History;
  language: string;
  selectEventId: (eventId: string) => void;
  setEventViewModeEvent: (viewMode: string) => void;
}

// The ClubEvents component renders a list of events organised by a club
const ClubEvents: FunctionComponent<ClubEventsProps> = ({
  eventsList,
  history,
  language,
  selectEventId,
  setEventViewModeEvent,
}) => {
  if (eventsList.length === 0) {
    return null;
  }
  const handleSelectEvent = (eventId: string): void => {
    selectEventId(eventId);
    setEventViewModeEvent('view');
    history.push('/events');
    window.scrollTo(0, 0);
  };
  const userEventsArray = [...eventsList]
    .sort((a, b) => {
      return (a.date < b.date) ? 0 : -1;
    })
    .map((oevent) => {
      const { _id: eventId } = oevent;
      return (
        <EventListItem
          key={eventId}
          language={language}
          handleSelectEvent={handleSelectEvent}
          oevent={oevent}
          selectedEventId=""
        />
      );
    });
  const title = <Trans>Events</Trans>;

  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {userEventsArray}
        </div>
      </Collapse>
    </div>
  );
};

export default withRouter(ClubEvents);
