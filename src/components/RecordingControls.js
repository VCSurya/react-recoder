import React from 'react';
import useRecorder from '../hooks/useRecorder';
import '../styles/RecordingControls.css';

const RecordingControls = () => {
  const { 
    isMonitoring, 
    progress, 
    startMonitoring, 
    stopMonitoring 
  } = useRecorder();

  return (
    <div className="recording-screen">
      <div className="recording-controls">
        {!isMonitoring ? (
          <button 
            className="record-btn" 
            onClick={startMonitoring}
          >
            Start Recording
          </button>
        ) : (
          <button 
            className="stop-btn" 
            onClick={stopMonitoring}
          >
            Stop Recording
          </button>
        )}
      </div>

      {isMonitoring && (
        <div className="progress-container" id="progressContainer">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls; 