import { useContext } from 'react';
import { RecorderContext } from '../contexts/RecorderContext';

const useRecorder = () => {
  const context = useContext(RecorderContext);
  
  if (!context) {
    throw new Error('useRecorder must be used within a RecorderProvider');
  }
  
  return context;
};

export default useRecorder; 