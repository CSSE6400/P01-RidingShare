import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PassengerManager from './components/PassengerManager';
import TripsPage from './pages/TripsPage'
import TripInformation from './pages/TripInformationPage';
import './App.css';

/**
 * App component - the main component of the application.
 * Wraps the entire application in a Router context and defines the main routes.
 * 
 * @returns {ReactElement} The rendered App component
 */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerManager />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trip/:riderId" element={<TripInformation />} />
      </Routes>
    </Router>
  );
};

export default App;
