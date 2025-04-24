import React, { createContext, useState, useEffect, useCallback } from 'react';

export const RecorderContext = createContext();

export const RecorderProvider = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const startMonitoring = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/start_monitoring', { 
        method: 'POST' 
      });
      const data = await response.json();
      
      if (data.success) {
        setIsMonitoring(true);
        startProgressRecording();
      }
    } catch (err) {
      console.error('Start error:', err);
    }
  }, []);

  const stopMonitoring = useCallback(async () => {
    if (!isMonitoring) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/stop_monitoring', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setIsMonitoring(false);
        stopProgressRecording();
        fetchAndDisplaySavedData();
      }
    } catch (err) {
      console.error('Stop error:', err);
    }
  }, [isMonitoring]);

  const startProgressRecording = useCallback(() => {
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.5, 100);
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  const stopProgressRecording = useCallback(() => {
    setProgress(0);
  }, []);

  const fetchAndDisplaySavedData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_saved_data');
      const data = await response.json();
      
      if (data.success) {
        setTimelineEvents(data.data);
        // If there are events, select the first one by default
        if (data.data.length > 0) {
          setSelectedEvent({ event: data.data[0], index: 0, path: data.path });
        }
      } else {
        console.error('Error fetching saved data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching saved data:', error);
    }
  }, []);

  const playAutomation = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/run_automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to run automation');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error running automation:', error);
      return false;
    }
  }, []);

  const saveFlow = useCallback(async () => {
    try {
      // Get all events in their current order
      const events = timelineEvents.map((event, index) => {
        return {
          id: event.id,
          name: `Step ${index + 1}`,
          type: getEventType(event)
        };
      });

      const response = await fetch('http://127.0.0.1:5000/update_flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        fetchAndDisplaySavedData();
        return true;
      } else {
        throw new Error(result.message || 'Server returned an error');
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, [timelineEvents, fetchAndDisplaySavedData]);

  // Helper function to determine event type
  const getEventType = (event) => {
    if (event.single_click) return 'Single Click';
    if (event.double_click) return 'Double Click';
    if (event.keyboard && event.keyboard.is_text) return 'Input Text';
    if (event.keyboard && event.keyboard.is_special) return 'Key Pressed';
    if (event.time_delay) return 'Delay Time';
    return 'Unknown';
  };

  // Load saved data when component mounts
  useEffect(() => {
    fetchAndDisplaySavedData();
  }, [fetchAndDisplaySavedData]);

  // Poll for status when monitoring
  useEffect(() => {
    let statusInterval = null;
    
    if (isMonitoring) {
      statusInterval = setInterval(async () => {
        try {
          const res = await fetch('http://127.0.0.1:5000/status');
          const data = await res.json();
          
          if (data.monitoring !== isMonitoring) {
            setIsMonitoring(data.monitoring);
          }
        } catch (err) {
          console.error('Fetch status error:', err);
        }
      }, 1000);
    }
    
    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [isMonitoring]);

  return (
    <RecorderContext.Provider value={{
      isMonitoring,
      isRecording,
      progress,
      timelineEvents,
      selectedEvent,
      setSelectedEvent,
      startMonitoring,
      stopMonitoring,
      playAutomation,
      saveFlow,
      fetchAndDisplaySavedData
    }}>
      {children}
    </RecorderContext.Provider>
  );
};

export default RecorderProvider; 