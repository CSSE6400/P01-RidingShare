import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TripRequest from './components/TripRequest';
import PassengerManager from './components/PassengerManager';
import LoginEmail from './components/loginEmail';
import { UserProvider, UserContext } from './components/UserContext';
import './App.css';
import { useContext } from 'react';
import  TripDetail  from './components/TripDetail'
import  TripList  from './components/TripList'
import SimpleMap from './components/Map';

/**
 * App component - the main component of the application.
 * Wraps the entire application in a Router context and defines the main routes.
 * 
 * @returns {ReactElement} The rendered App component
 */
const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginEmail />} />
          <Route path="/trip-request" element={
            <PrivateRoute userType="driver">
              <TripRequest />
            </PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute userType="driver">
              <SimpleMap />
            </PrivateRoute>
          } />
          <Route path="/trip-list" element={
            <PrivateRoute userType="driver">
              <TripList />
            </PrivateRoute>
          } />
          <Route path="/trip/:tripId" element={
            <PrivateRoute userType="driver">
              <TripDetail />
            </PrivateRoute>
          } />
          <Route path="/passenger-page" element={
            <PrivateRoute userType="passenger">
              <PassengerManager />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
};

const PrivateRoute = ({ children, userType }) => {
  const { user } = useContext(UserContext);
    
  if (!user || user.user_type !== userType) {
    return <Navigate to="/" />;
  }

  return children;
};

export default App;
