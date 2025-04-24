import React, { useState } from 'react';
import '../styles/EventDetails.css';

const EventDetails = ({ event, index, path }) => {
  const [isEditingKeyboard, setIsEditingKeyboard] = useState(false);
  const [isEditingDelay, setIsEditingDelay] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');
  const [delayValue, setDelayValue] = useState('');
  
  let eventType = '';
  let eventData = null;

  // Determine event type and data
  if (event.single_click) {
    eventType = 'Single Click';
    eventData = event.single_click;
  } else if (event.double_click) {
    eventType = 'Double Click';
    eventData = event.double_click;
  } else if (event.keyboard) {
    eventType = 'Keyboard Press';
    eventData = event.keyboard;
  } else if (event.time_delay) {
    eventType = 'Time Delay';
    eventData = event.time_delay;
  }

  // Initialize values for editing
  React.useEffect(() => {
    if (eventData) {
      if (eventData.key) {
        setKeyboardText(eventData.key);
      }
      if (eventData.delay) {
        setDelayValue(eventData.delay);
      }
    }
  }, [eventData]);

  const toggleKeyboardEdit = () => {
    setIsEditingKeyboard(!isEditingKeyboard);
  };

  const cancelKeyboardEdit = () => {
    setIsEditingKeyboard(false);
    if (eventData && eventData.key) {
      setKeyboardText(eventData.key);
    }
  };

  const saveKeyboardText = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/update_keyboard_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id,
          new_text: keyboardText
        })
      });

      if (response.ok) {
        setIsEditingKeyboard(false);
        alert('Keyboard text updated successfully!');
      } else {
        throw new Error('Failed to update keyboard text');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating keyboard text. Please try again.');
      cancelKeyboardEdit();
    }
  };

  const toggleDelayEdit = () => {
    setIsEditingDelay(!isEditingDelay);
  };

  const cancelDelayEdit = () => {
    setIsEditingDelay(false);
    if (eventData && eventData.delay) {
      setDelayValue(eventData.delay);
    }
  };

  const saveDelayValue = async () => {
    // Validate the delay value
    if (!delayValue || isNaN(delayValue) || parseFloat(delayValue) <= 0) {
      alert('Please enter a valid delay value (must be a positive number)');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/update_delay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id,
          new_delay: delayValue
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsEditingDelay(false);
        alert('Delay updated successfully!');
        // You might want to reload data here
      } else {
        alert('Failed to update delay: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating delay:', error);
      alert('Failed to update delay. Please try again.');
    }
  };

  const openCropTool = (screenshot) => {
    // Implementation would be more complex and might require a modal component
    alert('Crop tool functionality requires implementation');
  };

  const captureScreen = (iconFilename) => {
    const formData = new FormData();
    formData.append('filename', iconFilename);

    fetch('http://127.0.0.1:5000/api/screenshot', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'saved') {
        alert('Screenshot captured!');
        window.location.reload();
      } else {
        alert('Screenshot capture failed or was cancelled.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while capturing the screenshot.');
    });
  };

  if (!eventData) {
    return (
      <div className="no-event-selected">
        <i>🔍</i>
        <p>No details available for this event</p>
      </div>
    );
  }

  return (
    <div>
      <div className="event-details-header">{event.name || `Step ${index + 1}`} - {eventType}</div>
      <div className="event-details-content">
        {eventData.icon && (
          <div className="event-detail-item">
            <span className="event-detail-label">Icon</span>
            <div className="icon-details">
              <img 
                src={`${path}/icons/${eventData.icon.filename}`} 
                className="icon-preview-large" 
                alt="Icon"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = `${path}/icons/${eventData.icon.filename}`;
                }}
                onClick={() => {
                  // Implementation of showImageModal would be in a separate component
                }}
              />
              <div className="icon-actions">
                <input 
                  type="file" 
                  id="iconUpload" 
                  accept=".png" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    // Handle file upload
                  }}
                />
                <button 
                  className="upload-btn" 
                  onClick={() => document.getElementById('iconUpload').click()}
                >
                  Upload New Icon
                </button>
                <button 
                  className="crop-btn" 
                  onClick={() => openCropTool(`${path}/screenshots/${eventData.screenshot?.filename}`)}
                >
                  Crop Image
                </button>
                <button 
                  className="capture-btn" 
                  onClick={() => captureScreen(eventData.icon.filename)}
                >
                  Capture Image
                </button>
              </div>
              <div id="previewContainer" style={{ display: 'none', marginTop: '15px', position: 'relative' }}>
                <img id="previewImage" className="icon-preview-large" alt="Preview" />
                <button 
                  className="cancel-upload-btn" 
                  onClick={() => {
                    document.getElementById('previewContainer').style.display = 'none';
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {eventData.key && (
          <div className="event-detail-item">
            <span className="event-detail-label">Key Pressed</span>
            <div className="keyboard-input-container">
              <div className="keyboard-input-row">
                <input 
                  type="text" 
                  id="keyboardInput" 
                  value={keyboardText} 
                  onChange={(e) => setKeyboardText(e.target.value)}
                  disabled={!isEditingKeyboard} 
                  className="keyboard-input"
                />
              </div>
              <div className="keyboard-actions">
                {!isEditingKeyboard ? (
                  <button className="edit-btn" onClick={toggleKeyboardEdit}>Change Text</button>
                ) : (
                  <>
                    <button className="save-btn" onClick={saveKeyboardText}>Save</button>
                    <button className="cancel-btn" onClick={cancelKeyboardEdit}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {eventData.delay && (
          <div className="event-detail-item">
            <span className="event-detail-label">Delay</span>
            <div className="delay-input-container">
              <div className="delay-input-row">
                <input 
                  type="text" 
                  id="delayInput" 
                  value={delayValue} 
                  onChange={(e) => setDelayValue(e.target.value)}
                  disabled={!isEditingDelay} 
                  className="delay-input"
                />
                <span className="delay-unit">Seconds</span>
              </div>
              <div className="delay-actions">
                {!isEditingDelay ? (
                  <button className="edit-btn" onClick={toggleDelayEdit}>Change Delay</button>
                ) : (
                  <>
                    <button className="save-btn" onClick={saveDelayValue}>Save</button>
                    <button className="cancel-btn" onClick={cancelDelayEdit}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails; 