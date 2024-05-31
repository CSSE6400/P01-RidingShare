import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from "react-leaflet";
import { UserContext } from '../components/UserContext';
import styles from '../styles/TripRequest.module.css';
import "leaflet/dist/leaflet.css";
import 'leaflet/dist/images/marker-shadow.png';
import Routing from "./Routing";

import "../styles/Map.css"

const SimpleMap = () => {
  const { tripId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const lat = -27.4679;
  const lng = 153.0215;
  const [trip, setTrip] = useState({});
  const [passengers, setPassengers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [doneFetch, setDoneFetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripLocation = async () => {
      try {
        const response = await fetch('/trips/get/id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
            trip_id: tripId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTrip(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setDoneFetch(true);
      }
    };

    if (!doneFetch) {
      fetchTripLocation();
    }
  }, [tripId, doneFetch, user.username, user.password]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/trip/get_route_positions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            trip_id: tripId,
            username: user.username,
            password: user.password
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPassengers(data.passengers);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (doneFetch) {
      fetchLocations();
    }
  }, [tripId, doneFetch, user.username, user.password]);

  useEffect(() => {
    if (doneFetch && trip.start_location && trip.end_location && passengers.length > 0) {
      const newLocations = [
        {
          lat: trip.start_location.latitude,
          lng: trip.start_location.longitude,
          name: "Start Point"
        },
        ...passengers.map(passenger => ({
          lat: passenger.lat,
          lng: passenger.long,
          name: passenger.name
        })),
        {
          lat: trip.end_location.latitude,
          lng: trip.end_location.longitude,
          name: "End Point"
        }
      ];
      setLocations(newLocations);
    }
  }, [trip, passengers, doneFetch]);

  useEffect(() => {
    if (locations.length > 0) {
      setLoading(false);
    }
  }, [locations]);

  if (loading) {
    return <div>Loading trips...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Trip Map</h1>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        ref={mapRef}
        className="small-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing waypoints={locations} />
      </MapContainer>
      <button onClick={() => navigate(-1)} className={styles.blueButton}>Back</button>
      <button onClick={() => navigate(`/trips/${tripId}`)} className={"blueButton"}>Go to Trips</button>
    </div>
  );
};

export default SimpleMap;
