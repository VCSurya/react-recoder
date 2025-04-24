import React, { useState } from 'react';
import useRecorder from '../hooks/useRecorder';
import '../styles/PlayButton.css';

const PlayButton = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { playAutomation } = useRecorder();

  const handlePlay = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    try {
      const success = await playAutomation();
      
      if (success) {
        alert('Automation completed successfully!');
      } else {
        alert('Automation failed.');
      }
    } catch (error) {
      console.error('Error running automation:', error);
      alert(`Error running automation: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <button 
      className={`play ${isRunning ? 'running' : ''}`}
      onClick={handlePlay}
      disabled={isRunning}
      title="Run Automation"
    />
  );
};

export default PlayButton; 