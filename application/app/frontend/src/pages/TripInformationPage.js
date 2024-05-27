import React, { useEffect, useState } from 'react';
import DriverInformationCard from '../components/DriverInformationCard';
import '../styles/TripInformationPage.css'
import { useParams } from 'react-router-dom';

const TripInformation = () => {
  const { tripId } = useParams();
  const [tripDetails, setTripDetails] = useState([]);
  const [driverInformation, setDriverInformaion] = useState([]);
  const [carInformation, setCarInformation] = useState([]);
  const [TripInformation, setTripInformation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTripDetails = async (trip_request_id) => {
    try {
      const response = await fetch('/trip_requests/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          trip_request_id: trip_request_id
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setTripDetails(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  };

  const fetchDriverInformation = async (driverUsername) => {
    try {
      const response = await fetch('/user/get/information', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: driverUsername,
          user_type: "driver"
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setDriverInformaion(data.user_info);
        setCarInformation(data.car_info)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false)
    }
    return null;
  }

  const fetchTripInformation = async (trip_id) => {
    try {
      const response = await fetch('/trips/get/id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          trip_id: trip_id
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setTripInformation(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  }

  useEffect(() => {
    fetchTripDetails(tripId)
  }, [tripId]);

  useEffect(() => {
    fetchDriverInformation(tripDetails.driver_username)
  }, [tripDetails.driver_username])

  useEffect(() => {
    fetchTripInformation(tripDetails.trip_id)
  }, [tripDetails.trip_id])

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (loading) {
    return <div>Loading trips...</div>;
  }

  return (
    <div className="trip-info-container">
      <h1>Trip Information</h1>
      <div className="trip-details">
        {driverInformation == [] && carInformation == [] && TripInformation == [] ?
          <DriverInformationCard
            driversName={driverInformation.name}
            carRepoNo={carInformation.licence_plate}
            estimatedPickupTime={formatTime(TripInformation.start_time)}
          />
          : null
        }

        <div className="riders">
          <h2>{tripDetails.passenger_name}</h2>
          <p>Pickup Point</p>
          <h3>{tripDetails.start_address}</h3>
          <p>Drop-off Address</p>
          <h3>{tripDetails.end_address}</h3>
        </div>
      </div>
    </div>
  )
}

export default TripInformation;