import React, { useState, useEffect } from 'react';
import useRecorder from '../hooks/useRecorder';
import '../styles/AddEventForm.css';

const AddEventForm = () => {
  const { timelineEvents, fetchAndDisplaySavedData } = useRecorder();
  const [eventType, setEventType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [keyboardText, setKeyboardText] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeDelay, setTimeDelay] = useState(1);
  const [positionAfter, setPositionAfter] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Update position options when timeline events change
  useEffect(() => {
    updatePositionOptions();
  }, [timelineEvents]);

  const updatePositionOptions = () => {
    const select = document.getElementById('positionAfter');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
      select.remove(1);
    }
    
    // Add options for each existing event
    timelineEvents.forEach((_, index) => {
      const option = document.createElement('option');
      option.value = index + 1;
      option.textContent = `After Step ${index + 1}`;
      select.appendChild(option);
    });
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const closeAddEventForm = () => {
    const form = document.getElementById('addEventForm');
    const overlay = document.getElementById('formOverlay');
    
    if (form && overlay) {
      form.classList.remove('active');
      overlay.classList.remove('active');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setEventType('');
    setImageFile(null);
    setImagePreview('');
    setKeyboardText('');
    setInputText('');
    setTimeDelay(1);
    setPositionAfter(0);
  };

  const saveNewEvent = async () => {
    if (!eventType) {
      alert('Please select an event type');
      return;
    }
    
    const formData = new FormData();
    formData.append('event_type', eventType);
    formData.append('position_after', positionAfter);
    
    // Handle different event types
    if (eventType === 'single_click' || eventType === 'double_click') {
      if (!imageFile) {
        alert('Please upload an image for this event type');
        return;
      }
      formData.append('image', imageFile);
    } else if (eventType === 'keyboard_shortcut') {
      if (!keyboardText) {
        alert('Please enter text for keyboard shortcut');
        return;
      }
      formData.append('text', keyboardText);
    } else if (eventType === 'input_text') {
      if (!inputText) {
        alert('Please enter text to type');
        return;
      }
      formData.append('input_text', inputText);
    } else if (eventType === 'time_delay') {
      if (!timeDelay || timeDelay < 1) {
        alert('Please enter a valid time delay in seconds');
        return;
      }
      formData.append('delay', timeDelay);
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/add_event', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          closeAddEventForm();
          fetchAndDisplaySavedData();
          alert('Event added successfully!');
        } else {
          throw new Error(result.message || 'Failed to add event');
        }
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding event: ' + error.message);
    }
  };

  // Add event listeners when component mounts
  useEffect(() => {
    const formElement = document.getElementById('addEventForm');
    const overlay = document.getElementById('formOverlay');
    
    if (formElement && overlay) {
      // Show form handler
      const showForm = () => {
        formElement.classList.add('active');
        overlay.classList.add('active');
        updatePositionOptions();
      };
      
      // Add event listener to the "Add Event" button
      const addEventBtn = document.getElementById('addEventBtn');
      if (addEventBtn) {
        addEventBtn.addEventListener('click', showForm);
      }
      
      // Close form when clicking outside
      overlay.addEventListener('click', closeAddEventForm);
      
      // Cleanup
      return () => {
        if (addEventBtn) {
          addEventBtn.removeEventListener('click', showForm);
        }
        overlay.removeEventListener('click', closeAddEventForm);
      };
    }
  }, []);

  return (
    <>
      <div className="form-overlay" id="formOverlay"></div>
      <div className="add-event-form" id="addEventForm">
        <h3>Add New Event</h3>
        
        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select 
            id="eventType" 
            value={eventType}
            onChange={handleEventTypeChange}
          >
            <option value="">Select Event Type</option>
            <option value="single_click">Single Mouse Click</option>
            <option value="double_click">Double Mouse Click</option>
            <option value="input_text">Input Text</option>
            <option value="time_delay">Time Delay</option>
          </select>
        </div>
        
        {(eventType === 'single_click' || eventType === 'double_click') && (
          <div className="form-group" id="imageUploadGroup">
            <label>Upload Image</label>
            <div className="image-upload-container">
              <input 
                type="file" 
                id="eventImage" 
                accept="image/png" 
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <img 
                  id="imagePreview" 
                  className="image-preview" 
                  src={imagePreview} 
                  alt="Preview"
                  style={{ display: 'block' }}
                />
              )}
            </div>
          </div>
        )}
        
        {eventType === 'keyboard_shortcut' && (
          <div className="form-group" id="keyboardInputGroup">
            <label htmlFor="keyboardText">Input Text</label>
            <input 
              type="text" 
              id="keyboardText" 
              placeholder="Enter text"
              value={keyboardText}
              onChange={(e) => setKeyboardText(e.target.value)}
            />
          </div>
        )}
        
        {eventType === 'input_text' && (
          <div className="form-group" id="textInputGroup">
            <label htmlFor="inputText">Text to Type</label>
            <input 
              type="text" 
              id="inputText" 
              placeholder="Enter text to type"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        )}
        
        {eventType === 'time_delay' && (
          <div className="form-group" id="timeInputGroup">
            <label htmlFor="inputTime">Time Delay (seconds)</label>
            <input 
              type="number" 
              id="inputTime" 
              placeholder="Enter Time In Seconds" 
              min="1"
              value={timeDelay}
              onChange={(e) => setTimeDelay(e.target.value)}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="positionAfter">Add After Step</label>
          <select 
            id="positionAfter"
            value={positionAfter}
            onChange={(e) => setPositionAfter(e.target.value)}
          >
            <option value="0">At the beginning</option>
            {timelineEvents.map((_, index) => (
              <option key={index + 1} value={index + 1}>
                After Step {index + 1}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            className="form-btn cancel-btn" 
            onClick={closeAddEventForm}
          >
            Cancel
          </button>
          <button 
            className="form-btn save-btn" 
            onClick={saveNewEvent}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddEventForm; 