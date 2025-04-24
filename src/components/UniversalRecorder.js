import React from 'react';
import { RecorderProvider } from '../contexts/RecorderContext';
import Timeline from './Timeline';
import Sidebar from './Sidebar';
import ImageModal from './ImageModal';
import AddEventForm from './AddEventForm';
import AutomationLoader from './AutomationLoader';
import '../styles/UniversalRecorder.css';

const UniversalRecorder = () => {
  return (
    <RecorderProvider>
      <div className="container">
        <Timeline />
        <Sidebar />
        <ImageModal />
        <AddEventForm />
        <AutomationLoader />
      </div>
    </RecorderProvider>
  );
};

export default UniversalRecorder; 