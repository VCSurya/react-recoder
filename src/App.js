import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import UniversalRecorder from './components/UniversalRecorder';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<UniversalRecorder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 