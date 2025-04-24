import React, { useState, useEffect } from 'react';
import '../styles/AutomationLoader.css';

const AutomationLoader = () => {
  const [isActive, setIsActive] = useState(false);

  // Set up global access to the loader
  useEffect(() => {
    // Function to show the loader
    const showLoader = () => setIsActive(true);
    
    // Function to hide the loader
    const hideLoader = () => setIsActive(false);
    
    // Expose functions globally
    window.showAutomationLoader = showLoader;
    window.hideAutomationLoader = hideLoader;
    
    // Cleanup
    return () => {
      delete window.showAutomationLoader;
      delete window.hideAutomationLoader;
    };
  }, []);

  return (
    <div className={`automation-loader ${isActive ? 'active' : ''}`} id="automationLoader">
      <div className="spinner"></div>
      <div className="message">Processing automation flow...</div>
    </div>
  );
};

export default AutomationLoader; 