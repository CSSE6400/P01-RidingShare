import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TripRequest from './components/TripRequest';
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
        <Route path="/" element={<Login />} />
        <Route path="/trip-request" element={<TripRequest />} />
        <Route path="/loginPage" element={<LoginEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
