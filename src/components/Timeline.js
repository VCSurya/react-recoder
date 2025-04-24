import React, { useState } from 'react';
import useRecorder from '../hooks/useRecorder';
import PlayButton from './PlayButton';
import '../styles/Timeline.css';

const Timeline = () => {
  const { 
    timelineEvents, 
    selectedEvent, 
    setSelectedEvent, 
    saveFlow 
  } = useRecorder();
  
  const handleEventClick = (event, index, path) => {
    setSelectedEvent({ event, index, path });
  };

  const getEventClass = (event) => {
    if (event.single_click) return 'mouse-event';
    if (event.double_click) return 'double-click-event';
    if (event.keyboard) return 'keyboard-event';
    if (event.time_delay) return 'delay-event';
    return '';
  };

  const getEventType = (event) => {
    if (event.single_click) return 'Single Click';
    if (event.double_click) return 'Double Click';
    if (event.keyboard && event.keyboard.is_text) return 'Input Text';
    if (event.keyboard && event.keyboard.is_special) return 'Key Pressed';
    if (event.time_delay) return 'Time Delay';
    return 'Unknown';
  };

  const showAddEventForm = () => {
    const overlay = document.getElementById('formOverlay');
    const form = document.getElementById('addEventForm');
    if (overlay && form) {
      overlay.classList.add('active');
      form.classList.add('active');
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline">
        <div id="timeline-events">
          {/* Start point */}
          <div className="start-point">
            <span>Start</span>
          </div>
          
          {/* Events */}
          {timelineEvents.map((event, index) => (
            <div 
              key={event.id} 
              className={`event ${index % 2 === 0 ? 'left' : 'right'}`}
              data-id={event.id}
            >
              <div className="sequence-number">{index + 1}</div>
              <div 
                className={`event-content ${getEventClass(event)} ${
                  selectedEvent && selectedEvent.event.id === event.id ? 'selected' : ''
                }`}
                onClick={() => {
                  if (timelineEvents.length > 0) {
                    const path = selectedEvent ? selectedEvent.path : '';
                    handleEventClick(event, index, path);
                  }
                }}
              >
                <div className="event-type">
                  {event.name || `Step ${index + 1}`}: {getEventType(event)}
                </div>
                
                <div className="event-details">
                  {event.single_click && event.single_click.icon && (
                    <div className="event-image-container">
                      <img 
                        src={`${selectedEvent ? selectedEvent.path : ''}/icons/${event.single_click.icon.filename}`} 
                        className="icon-preview" 
                        alt="Icon"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${selectedEvent ? selectedEvent.path : ''}/icons/${event.single_click.icon.filename}`;
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                  
                  {event.double_click && event.double_click.icon && (
                    <div className="event-image-container">
                      <img 
                        src={`${selectedEvent ? selectedEvent.path : ''}/icons/${event.double_click.icon.filename}`} 
                        className="icon-preview" 
                        alt="Icon"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${selectedEvent ? selectedEvent.path : ''}/icons/${event.double_click.icon.filename}`;
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                  
                  {event.keyboard && event.keyboard.is_text && (
                    <div className="keyboard-content text-key">
                      <p style={{ fontSize: '19px', marginLeft: '13px' }}>
                        <strong>{event.keyboard.key}</strong>
                      </p>
                    </div>
                  )}
                  
                  {event.keyboard && event.keyboard.is_special && (
                    <div className="keyboard-content special-key">
                      <p style={{ fontSize: '19px', marginLeft: '13px' }}>
                        <strong>{event.keyboard.key}</strong>
                      </p>
                    </div>
                  )}
                  
                  {event.time_delay && (
                    <div>
                      <p style={{ fontSize: '19px', marginLeft: '13px' }}>
                        <strong>{event.time_delay.delay} seconds</strong>
                      </p>
                    </div>
                  )}
                </div>
                
                <span 
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete functionality
                  }}
                ></span>
              </div>
            </div>
          ))}
          
          {/* End point */}
          <div className="end-point">
            <span>End</span>
          </div>
        </div>
      </div>
      
      <PlayButton />
      
      <div className="timeline-controls">
        <button className="add-event-btn" id="addEventBtn" onClick={showAddEventForm}>
          Add Event
        </button>
        <button className="save-button" id="save-flow" onClick={saveFlow}>
          Save Flow
        </button>
      </div>
    </div>
  );
};

export default Timeline; 