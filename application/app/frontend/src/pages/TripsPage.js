import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import "leaflet/dist/leaflet.css";
import 'leaflet/dist/images/marker-shadow.png';
import '../styles/ApprovedTrips.css';
import ApprovedTripCard from '../components/ApprovedTripCard';
import Routing from "../components/Routing";

const locations = [
  { lat: -27.4679, lng: 153.0215, name: "Start Point" },
  { lat: -27.4705, lng: 153.0265, name: "Mid Point" },
  { lat: -27.4517, lng: 153.0412, name: "End Point" }
];

const TripsPage = () => {
  const { tripId } = useParams();
  const [trips, setTrips] = useState([]);
  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  // const [locations, setLocations] = useState([]);

  const navigate = useNavigate();
  const tripInfo = (tripRequestId) => {
    navigate(`/trip-info/${tripRequestId}`);
  };
  const mapRef = useRef(null);
  const latitude = -27.4679;
  const longitude = 153.0215;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/trip/get/approved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            trip_id: tripId,
            username: user.username
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data.accepted_trips);
        } else {
          console.error('Failed to fetch trips');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user.username]);

  const fetchTripDetails = async (trip_id) => {
    try {
      const response = await fetch('/trip_requests/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          trip_request_id: trip_id
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAllTripDetails = async () => {
      setLoading(true);
      const allDetails = await Promise.all(trips.map(trip => fetchTripDetails(trip)));
      setTripDetails(allDetails.filter(detail => detail !== null));
      setLoading(false);
    };

    if (trips.length > 0) {
      fetchAllTripDetails();
    }
  }, [trips]);

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (!trips.length) {
    return <div>No trips available.</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Trips</h1>
      </div>
      <div className="trip-list">
        {tripDetails.map((trip, index) => (
          <ApprovedTripCard
            key={index}
            riderName={trip.passenger_name}
            startingPoint={trip.start_address}
            destination={"test"}
            onClickCard={() => tripInfo(trip.id)}
          />
        ))}
      </div>
      <div className="map-container">
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} className="map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Routing waypoints={locations} />
        </MapContainer>
      </div>
    </div>
  );
};

export default TripsPage;
