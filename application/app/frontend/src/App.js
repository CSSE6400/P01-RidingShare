import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PassengerManager from './components/PassengerManager';
import TripsPage from './pages/TripsPage'
import TripInformation from './pages/TripInformationPage';
import './App.css';
import Login from './pages/login'
import LoginEmail from './pages/loginEmail';

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
        <Route path="/login" element={<Login/>} />
        <Route path="/loginPage" element={<LoginEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
