import React from 'react';
import Collapse from '../generic/Collapse';

// The HomeAdminNotes component renders information about the internals of
// MapOholic of interest to administrative users
const HomeAdminNotes = () => {
  return (
    <div>
      <h3>Notes for Administrators [English only]</h3>
      <hr className="divider" />
      <Collapse title="Checklist of current issues:" startHidden>
        <ol>
          <li>
            React-select (3.0.3) uses the outdated lifecycle method componentWillReceiveProps.
            This has been patched in advance of the next release (issue #3720). Need to monitor
            and update dependency accordingly.
          </li>
          <li>
            Need to improve robustness of back end (specific example: updateEventRunner will
            overwrite maps array without checking its contents, so writing a full URL as an
            image path will succeed). Front end updated to send the appropriate request, but
            it would be good for this to be checked again before writing to the DB).
          </li>
        </ol>
      </Collapse>
      <hr className="divider" />
      <Collapse title="User feedback:" startHidden>
        <p>Feedback from users will be recorded here for convenience.</p>
      </Collapse>
      <hr className="divider" />
      <Collapse title="Future development ideas:" startHidden>
        <p>
          These ideas are summarised here for convenience. They are not in order of priority
          and there is no guarantee that anything noted here will be implemented. Most of
          these will require updates to both front and back end to extend the data model.
        </p>
        <ol>
          <strong>Presentation:</strong>
          <li>
            Filter by country on events and clubs (international support is important,
            but most events attended will be local to the user)? Could be a per-user
            configuration option.
          </li>
          <li>EN and CZ specific screenshots in HomeView</li>
          <strong>Map handling:</strong>
          <li>
            Consider how to better handle events at which someone ran TWO courses
            (not a two-part course) - e.g. sprint relay training 2 legs
            The data model doesn&apos;t support this, would need 2 runner records
            for the same event or 2 course/results records for a runner.
          </li>
          <li>Support re-ordering of multi-part maps?</li>
          <li>
            More on overlays - drawing own route, adding annotations, etc. =&gt;
            need to be able to save too... (look at *react-canvas-draw*)
            (The course overlay is a PNG with transparent background, annotations
            could be treated in a similar manner but might be more efficient as vectors)
          </li>
          <strong>Additional data:</strong>
          <li>
            Consider storing and presenting split times where available?
            (a placeholder for splitTimes: Object has been set up in eventRunner)
          </li>
          <strong>Real-time updates:</strong>
          <li>Incorporate Socket.io notifications if other logged in users add/update things.</li>
          <li>
            Remove refresh list buttons (from desktop width views, already hidden on mobile)?
            Should only be needed if a different user has updated something, how important
            is it? Definitely not needed if sockets implemented as above.
          </li>
          <li>Real-time (non-persistent) chat? Risk of unneccesary scope creep.</li>
          <strong>Interfaces/API:</strong>
          <li>Handle multi-day events in Events.orisCreateEvent</li>
          <li>Web services interface to take direct feed from QuickRoute</li>
          <li>
            Investigate potential to automatically parse other online event listings and
            results if they are in a consistent format (e.g. O-liga, BOF).
          </li>
          <strong>Configuration:</strong>
          <li>User-specific preferences (e.g. language)</li>
        </ol>
      </Collapse>
    </div>
  );
};

export default HomeAdminNotes;
