import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TripRequest from './components/TripRequest';
import LoginEmail from './components/loginEmail';
import { UserProvider, UserContext } from './components/UserContext';
import './App.css';
import RideRequests from './components/RideRequests';
import { useContext } from 'react';
import TripDetail from './components/TripDetail'
import TripList from './components/TripList'
import RequestList from './components/RequestList'
import SimpleMap from './components/Map';
import RideRequest from './components/RideRequest';
import TripsPage from './pages/TripsPage';
import TripInformation from './pages/TripInformationPage';

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
            <PrivateRoute userType={["driver"]}>
              <TripRequest />
            </PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute userType={["driver"]}>
              <SimpleMap />
            </PrivateRoute>
          } />
          <Route path="/trip-list" element={
            <PrivateRoute userType={["driver"]}>
              <TripList />
            </PrivateRoute>
          } />
          <Route path="/request-list" element={
            <PrivateRoute userType={["passenger"]}>
              <RequestList />
            </PrivateRoute>
          } />
          <Route path="/trip/:tripId" element={
            <PrivateRoute userType={["driver"]}>
              <TripDetail />
            </PrivateRoute>
          } />
          <Route path="/trip-info/:tripId" element={
            <PrivateRoute userType={["driver", "passenger"]}>
              <TripInformation />
            </PrivateRoute>
          } />
          <Route path="/ride-request" element={
            <PrivateRoute userType={["passenger"]}>
              <RideRequest />
            </PrivateRoute>
          } />
          <Route path="/rides/:tripId" element={
            <PrivateRoute userType={["driver"]}>
              <RideRequests />
            </PrivateRoute>
          } />
          <Route path="/trips/:tripId" element={
            <PrivateRoute userType={["driver"]}>
              <TripsPage />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
};

const PrivateRoute = ({ children, userType }) => {
  const { user, setUser } = useContext(UserContext);

  const isAllowed = Array.isArray(userType)
    ? userType.includes(user.user_type)
    : user.user_type === userType;

  if (!user || !isAllowed) {
    setUser(null);
    localStorage.removeItem('user');
    return <Navigate to="/" />;
  }

  return children;
};

export default App;
