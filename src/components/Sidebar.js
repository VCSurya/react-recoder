import React from 'react';
import useRecorder from '../hooks/useRecorder';
import EventDetails from './EventDetails';
import RecordingControls from './RecordingControls';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { selectedEvent } = useRecorder();
  
  return (
    <div className="sidebar">
      <div className="event-details-sidebar" id="eventDetails">
        {selectedEvent ? (
          <EventDetails 
            event={selectedEvent.event} 
            index={selectedEvent.index} 
            path={selectedEvent.path} 
          />
        ) : (
          <div className="no-event-selected">
            <i>🔍</i>
            <p>Select an event from the timeline to view its details</p>
          </div>
        )}
      </div>
      <RecordingControls />
    </div>
  );
};

export default Sidebar; 